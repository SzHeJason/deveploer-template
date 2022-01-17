import os from 'os'
import fs from 'fs-extra'
import nodePath from 'path'

import { spawnSync } from 'child_process'

import { gitAxios } from "./axios";
import signale from 'signale';

interface DownloadProjectOptions {
  outputDir?: string
  unarchive?: boolean
}

/**
 * @see https://git.woa.com/help/menu/api/branches.html
 */
interface SearchBrancheOptions {
  id: number | string
  sort?: string
  page?: number
  search?: string
  per_page?: number
  order_by?: string
}

/**
 * /api/v3/projects/:id/repository/tree
 * @see https://git.woa.com/help/menu/api/repositorys.html
 */
interface GetTreeOptions {
  id: number | string
  ref_name?: string
  path?: string
  recursive?: boolean
}


const logger = signale.scope('api:git')

export async function downloadProject(projectId: string, sha: string, options: DownloadProjectOptions = {}): Promise<string> {

  const { outputDir, unarchive = true } = options
  const realOutputDir = outputDir || `${os.tmpdir()}/${projectId}`

  const zipPath = nodePath.join(realOutputDir, `${projectId}.zip`)
  const unarchivePath = nodePath.join(realOutputDir, projectId)

  fs.removeSync(realOutputDir)
  fs.ensureDirSync(realOutputDir)

  console.log('\n')
  logger.await(`下载 git 仓库，压缩包路径: ${zipPath}`)

  const response = await gitAxios
    .get(
      `/api/v3/projects/${projectId}/repository/archive`,
      {
        params: {
          sha,
        },
        responseType: 'stream',
      }
    )

  const writeStream = fs.createWriteStream(zipPath)

  response.data.pipe(writeStream)

  return new Promise((resolve) => {
    writeStream.on('finish', () => {
      if (!unarchive) {
        resolve(zipPath)
        return
      }

      logger.await(`解压 git 仓库，解压路径: ${unarchivePath}`)

      fs.ensureDirSync(unarchivePath)
      spawnSync('unzip', ['-d', unarchivePath, '-o', zipPath])

      resolve(unarchivePath)
    })
  })
}

export async function serchBranch(params: SearchBrancheOptions) {
  const { id } = params
  return gitAxios.get(`/api/v3/projects/${encodeURIComponent(id)}/repository/branches`, {
    data: params
  }).then(res => res.data)
}

/**
 * 获取文件路径
 */
export const getTree = (function () {
  const Cache = new Map<string, any>([])
  return async (params: GetTreeOptions) => {
    const { id, ref_name } = params

    const cacheKey = ref_name ? `${id}_${ref_name}` : id.toString()

    if (!Cache.has(cacheKey)) {
      const res = await gitAxios.get(`/api/v3/projects/${encodeURIComponent(id)}/repository/tree`, {
        data: params
      }).then(res => res.data)

      Cache.set(cacheKey, res)
    }

    return Cache.get(cacheKey)
  }
})()