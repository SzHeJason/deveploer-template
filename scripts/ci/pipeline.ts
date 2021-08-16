/* eslint-disable no-template-curly-in-string */
import { Pipeline } from '@tencent/ocg/lib/dist';

export function gitPresetStage(pipeline: Pipeline) {
  pipeline.services
    .add('ssh-agent-for-oa')
    .end()
    .runner({
      network: 'devnet',
    })
    .stage('配置 Git 环境，增加读可权限')
    .job('config')
    // GIT_URL 应该替换为私密项目的某个 yml 文件，内有 GIT_SSH_KEY 作为环境变量
    .imports.add(
      'https://git.woa.com/wesing-web/secret-park/blob/master/git.yml',
    )
    .end()
    .script.add('ssh-add -D ')
    .add('echo -n "${GIT_SSH_KEY}" > ~/.ssh/id_rsa')
    .add('chmod 0600 ~/.ssh/id_rsa')
    // 到这里其实权限已经注入完毕了，接下来的 user.emial 和 user.name 是 push 的要求
    .add('git config --global user.email "$GIT_EMAIL"')
    .add('git config --global user.name "$GIT_USER_NAME"')
    .end()
    .end();
}

/**
 * 下载部分依赖
 */
export function installDependency(pipeline: Pipeline) {
  pipeline
    .runner({
      network: 'devnet',
    })
    .stage('下载部分依赖')
    .job('install node module')
    .script.add('yarn global add standard-version')
    .end()
    .end()
    .end();
}

export function checkIsExit(pipeline: Pipeline, condition: string) {
  pipeline
    .runner({
      network: 'devnet',
    })
    .stage('检查是否继续流程')
    .job('check')
    .if.add(condition)
    .end()
    .script.add('exit 78')
    .end();
}

/**
 * 构建 Docker 缓存镜像
 */
export const dockerCache = function(pipeline: Pipeline) {
  pipeline
    .runner({
      network: 'devnet',
    })
    .stage('构建缓存镜像')
    .job('docker cache')
    .type('docker:cache')
    .envExport.set('name', 'DOCKER_CACHE_IMAGE_NAME')
    .end()
    .options.set({
      versionBy: [ 'yarn.lock' ],
      dockerfile: 'cache.dockerfile',
      by: [ 'yarn.lock', 'package.json' ],
    })
    .end()
    .end()
    .end();
};
