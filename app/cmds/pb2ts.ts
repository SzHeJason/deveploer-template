import os from 'os'
import _ from 'lodash'
import path from 'path'
import yaml from 'js-yaml'
import fs from 'fs-extra'
import nodePath from 'path'
import signale from 'signale'
import inquirer from 'inquirer'
import commandExists from 'command-exists'
import Fuse from 'fuse.js'

import { spawnSync } from 'child_process'

import { downloadProject, getTree, serchBranch } from '../utils/git'


const logger = signale.scope('pb2js')

const PROTOC_GEN_TS_PROTO_BIN_PATH = path.resolve(__dirname, '../../modules/ts-proto/protoc-gen-ts_proto')

// const PROTOC_GEN_TS_PROTO_BIN_PATH = require.resolve('ts-proto/protoc-gen-ts_proto')

const protocIsExist = commandExists.sync('protoc')

interface Arguments {
  id?: string,
  sha?: string
  path?: string
  output?: string
  protoOpt: Array<string>
}

export =  {
  command: 'pb2ts',
  describe: 'protobuf 转 ts interface',
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
    },
    protoOpt: {
      type: 'array',
      desc: "详情查看 https://github.com/stephenh/ts-proto 示例: --protoOpt stringEnums=false snakeToCamel=true"
    }
  },
  async handler(argv) {
    if (!protocIsExist) {
      signale.error('protoc 命令不存在，请先安装 https://github.com/protocolbuffers/protobuf/releases 或者执行 brew install protobuf')

      process.exit(0)
    }

    const defaultOutputDir = `${os.tmpdir()}/pb`
    fs.ensureDirSync(defaultOutputDir)

    const res = await inquirer
      .prompt<Required<Omit<Arguments, 'protoOpt'>>>([
        {
          name: 'id',
          type: 'input',
          message: '「项目 ID」或「项目全路径」',
          default: 'wesing-server/api',
          when: !argv.id,
        },
        {
          name: 'sha',
          type: 'autocomplete',
          message: '[支持异步查找] 填入分支名',
          default: 'master',
          when: !argv.sha,
          async source(answers: { id: string }, input: string) {
            const res = await serchBranch({ id: answers.id, search: input })

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
            const res = await getTree({ id: answers.id, recursive: true, ref_name: answers.sha })
            const files = res.map(item => item.name).filter(item => _.endsWith(item, '.proto'))

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
          when: !argv.output
        },
      ], argv)

    const { id, sha, path, output } = res
    const { protoOpt } = argv

    console.log('\n')
    logger.note(`git 文件地址 https://git.woa.com/${id}/blob/${sha}/${path}`)

    const projectId = encodeURIComponent(id)

    const resolveOuput = nodePath.resolve(output)
    const gitLocalPath = await downloadProject(projectId, sha)

    const protocPaths = ['./']


    try {
      // 获取项目下的 prototool.yaml 解析需要处理的路径参数
      const prototoolConfig = await yaml.load(fs.readFileSync(nodePath.join(gitLocalPath, 'prototool.yaml')).toString())
      const includes = _.get(prototoolConfig, 'protoc.includes', [])

      protocPaths.push(...includes)
    } catch (e) {
      signale.error('没找到项目下的 prototool.yaml 文件')
    }

    fs.ensureDirSync(resolveOuput)

    /**
     * @see https://github.com/stephenh/ts-proto
     */
    const options = {
      env: 'browser',
      forceLong: 'string',
      base64Bytes: true,
      useOptionals: true,
      stringEnums: true,
      snakeToCamel: false,
      outputClientImpl: false,
      outputJsonMethods: false,
      outputEncodeMethods: false,
      onlyOutputEnumToNumber:true,
      ..._.chain(protoOpt).map(item => item.split('=')).fromPairs().value()
    }


    const optionsStr = _.chain(options).reduce((result, value, key) => {
      return result + `${key}=${value},`
    }, '').value()

    const spawnCmds: string[] = []


    // 使用的插件地址
    spawnCmds.push(`--plugin=${PROTOC_GEN_TS_PROTO_BIN_PATH}`)
    // 输出地址
    spawnCmds.push(`--ts_proto_out=${resolveOuput}`)
    // 插件相关选项
    spawnCmds.push(`--ts_proto_opt=${optionsStr}`)

    // 解析 import 路径
    protocPaths.forEach(item => {
      spawnCmds.push(`--proto_path=${item}`)
    })
    
    // protobuf 文件路径
    spawnCmds.push(path)


    const result = spawnSync(
      'protoc',
      spawnCmds,
      {
        stdio: 'inherit',
        cwd: gitLocalPath,
      }
    )

    if (result.error) {
      throw result.error
    }

    if (result.stderr) {
      throw new Error(result.stderr.toString())
    }


    logger.success(`protobuf => ts interface,输出路径: ${nodePath.join(resolveOuput)}`)
  }
} as ICommandModule<Arguments>