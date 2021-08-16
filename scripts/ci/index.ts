import { Config } from '@tencent/ocg';

import * as path from 'path';
import * as PipelineTools from './pipeline';

const config = new Config({
  yamlPath: path.resolve(__dirname, '../../.orange-ci.yml'),
});

function generateProcess(branchName: string) {
  const branch = config.branch(branchName);

  const isMaster = branchName === 'master';

  /**
   * mr 检查代码是否正常
   */
  const mrPipeline = branch.hook('merge_request').pipeline();
  PipelineTools.dockerCache(mrPipeline);
  mrPipeline
    .stage('检查代码')
    .job('use docker cache')
    .image('$DOCKER_CACHE_IMAGE_NAME')
    .commands.add('cp -an $CACHE_PATH/node_modules ./node_modules')
    .add('npm run check')
    .end()
    .end();

  /**
   * review 自动通过自动使用 merge 合并
   */
  branch
    .hook('review' as any)
    .pipeline()
    .stage('Review 后自动合并')
    .job('automerge')
    .type('git:automerge')
    .options.set({
      mergeType: 'merge',
    })
    .end()
    .end();

  /**
   * merge 合并通过后触发 push 发布素材库
   */
  const pipeline = branch.hook('push' as any).pipeline();

  pipeline
    .stage('打印信息')
    .job('info')
    .script.add('echo $(git config --global --get user.name)')
    .add('echo $ORANGE_BUILD_USER')
    .end()
    .end();

  PipelineTools.gitPresetStage(pipeline);
  PipelineTools.checkIsExit(
    pipeline,
    'test $(git config --global --get user.name) = $ORANGE_BUILD_USER',
  );
  PipelineTools.installDependency(pipeline);

  pipeline
    .runner({
      network: 'devnet',
    })
    .git({
      dotGit: true,
    })
    .stage('标准化发布流程')
    .job('执行 standard-version')
    .script.add('git fetch --all')
    .add('git checkout -b $ORANGE_BRANCH origin/$ORANGE_BRANCH')
    .add(
      isMaster
        ? 'standard-version --release-as patch'
        : 'standard-version --skip.changelog=true --release-as patch --prerelease beta',
    )
    .add('git push --follow-tags origin $ORANGE_BRANCH')
    .end()
    .end();

  if (isMaster) {
    pipeline
      .runner({
        network: 'devnet',
      })
      .git({
        dotGit: true,
      })
      .stage('获取 npm 版本')
      .job('Pick Npm Version')
      .exports.set({
        stdout: 'NPM_VERSION',
      })
      .end()
      .script.add(
        "cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]'",
      )
      .end()
      .end()
      .end()
      .stage('创建 Release 分支')
      .job('release')
      .script.add('git fetch --all')
      .add('git checkout -b release/v$NPM_VERSION origin/$ORANGE_BRANCH')
      .add('git push --set-upstream origin release/v$NPM_VERSION')
      .add('git checkout -b develop origin/develop')
      .add('git merge --squash release/v$NPM_VERSION --no-edit || true')
      .add('git checkout --theirs package.json CHANGELOG.md || true')
      .add('git add . || true')
      .add('git commit --no-edit || true')
      .add('git push')
      .end()
      .end();
  }
}

generateProcess('develop');
generateProcess('master');

config.output();
