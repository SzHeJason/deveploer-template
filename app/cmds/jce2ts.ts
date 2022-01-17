import os from 'os'
import glob from 'glob'
import _ from 'lodash'
import fs from 'fs-extra'
import nodePath from 'path'
import signale from 'signale'
import inquirer from 'inquirer'
import Fuse from 'fuse.js'

import jceConvert from '../../modules/jceconvert/src'

import { ensureExtname } from '../utils/helper'
import { downloadProject, getTree, serchBranch } from '../utils/git'

const logger = signale.scope('jce2ts')

interface Arguments {
  id?: string,
  sha?: string
  path?: string
  output?: string
}

export =  {
  command: 'jce2ts',
  describe: 'jce 转 ts interface',
  builder: {
    id: {
      type: 'string',
      desc: "仓库名称"
    },
    sha: {
      type: 'string',
      desc: "commitid 、分支、tag"
    },
    path: {
      type: 'string',
      desc: '协议文件路径'
    },
    output: {
      type: 'string',
      desc: '输出路径'
    }
  },
  async handler(argv) {
    const defaultOutputDir = `${os.tmpdir()}/jce`
    fs.ensureDirSync(defaultOutputDir)

    const res = await inquirer
      .prompt<Required<Arguments>>([
        {
          name: 'id',
          type: 'input',
          message: '「项目 ID」或「项目全路径」',
          default: 'tme/wesing-protocol',
          when: !argv.id
        },
        {
          name: 'sha',
          type: 'autocomplete',
          message: '[支持异步查找] 填入分支名',
          default: 'master',
          when: !argv.sha,
          async source(answers: { id: string }, input: string) {
            const res = await serchBranch({
              id: answers.id,
              search: input
            })

            return res.map(item => item.name)
          }
        },
        {
          name: 'path',
          type: 'autocomplete',
          message: '[支持异步查找] 输入协议路径（相对于仓库路径）',
          default: '',
          when: !argv.path,
          async source(answers: { id: string, sha: string }, input?: string) {
            const res = await getTree({
              recursive: true,
              id: answers.id,
              ref_name: answers.sha
            })
            const files = res.map(item => item.name).filter(item => _.endsWith(item, '.jce'))

            if (!input) {
              return files
            }

            const fuse = new Fuse(files)

            return fuse.search(input).map(item => {
              return item.item
            })
          }
        },
        {
          name: 'output',
          type: 'input',
          message: '输出路径',
          default: defaultOutputDir,
          when: !argv.output,
        },
      ], argv)


    const { id, sha, path, output } = res

    console.log('\n')
    logger.note(`git 文件地址 https://git.woa.com/${id}/blob/${sha}/${path}`)

    const projectId = encodeURIComponent(id)

    const resolveOuput = nodePath.resolve(output, ensureExtname(path, ''))
    const gitLocalPath = await downloadProject(projectId, sha)

    fs.ensureDirSync(resolveOuput)

    await jceConvert.exec({
      src: nodePath.join(gitLocalPath, path),
      outputDir: resolveOuput,
      options: {
        sourceType: 'JCE', // 源码类型[JCE|TARS]
        targetLang: 'JavaScript', // 输出类型[JavaScript|TypeScript]
        targetPlatform: 'Node.js', // 输出平台[NODE.js|Hippy]
        longType: 'number', // 转化<idl::long> [number|BigInt|String]
        client: false, // 生成客户端代码
        server: false, // 生成服务端代码
        dts: true, // 生成d.ts文件
        withtaf: false,
        recursive: true, // 递归转化依赖
        minimalrecursive: false, // 全量(false)or精简(true)
        reservedfiles: false,
        useraw: false,
        reverseenum: false, // 输出代码enum支持反查
        optimizeos: false, // 优化输出代码大小
      },
    })

    glob.sync(nodePath.join(resolveOuput, '*.js')).map((file) => {
      fs.removeSync(file)
    });

    logger.success(`protobuf => ts interface,输出路径: ${nodePath.resolve(res.output)}`)
  }
} as ICommandModule<Arguments>