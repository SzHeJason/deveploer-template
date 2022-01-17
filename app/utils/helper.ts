import path from 'path'

/**
 * 修改文件的后缀名
 * @param filePath 文件路径
 * @param extName 后缀名 default: .js
 */
export function ensureExtname(filePath: string, extName = '.js') {
  const info = path.parse(filePath)

  info.ext = extName
  info.base = info.name + extName

  return path.format(info)
}