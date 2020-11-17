import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'

import * as grpc from '@grpc/grpc-js'
import * as protobufLoader from '@grpc/proto-loader'

import { SetOptional } from 'type-fest'
import {
  GrpcObject,
  ServiceClientConstructor,
} from '@grpc/grpc-js/build/src/make-client'

import ServiceError from '../helper/error'
import ErrorCode from '../constants/code'

import { BodySchme } from '../schemas/protobuf'

type RequestParams = BodySchme

type GetServiceParams = SetOptional<RequestParams, 'action' | 'payload'>

type GetPackageParams = SetOptional<
  RequestParams,
  'action' | 'address' | 'serviceName' | 'payload'
>

type GetDefinitionParams = SetOptional<
  RequestParams,
  'action' | 'address' | 'packageName' | 'serviceName' | 'payload'
>

/**
 * protobuf 存放路径，支持多路径模式
 * @example /usr/local/etc/protobuf:/data/protobuf
 */
const PROTOBUF_PATH = process.env.PROTOBUF_PATH

export class ProtobufService {
  private getPbFilePath(file: string) {
    const arr = PROTOBUF_PATH.split(':')

    let result = ''

    arr.some(item => {
      const isExist = fs.pathExistsSync(item)

      if (isExist) {
        result = path.join(item, file)
        return true
      }
    })

    return result
  }

  async getDefinition(params: GetDefinitionParams) {
    const { file } = params

    const filePath = this.getPbFilePath(file)

    const isExists = await fs.pathExists(filePath)

    if (!isExists) {
      throw new ServiceError({
        code: ErrorCode.NOT_FOUND,
        message: '无法找到对应的协议文件',
      })
    }

    const packageDefinition = await protobufLoader.load(filePath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    })

    return packageDefinition
  }

  async getPackage(params: GetPackageParams) {
    const { packageName } = params

    const definition = await this.getDefinition(params)

    const grpcObject = grpc.loadPackageDefinition(definition)

    const protobufPackage = _.get(grpcObject, packageName)

    if (!protobufPackage) {
      throw new ServiceError({
        code: ErrorCode.NOT_FOUND,
        message: '无法找到对应的 package',
      })
    }

    return protobufPackage
  }

  async getService(params: GetServiceParams) {
    const { serviceName, address } = params

    const protobufPackage = await this.getPackage(params)

    const ServiceClient = (protobufPackage as GrpcObject)[serviceName]

    if (!ServiceClient) {
      throw new ServiceError({
        code: ErrorCode.NOT_FOUND,
        message: '无法找到对应的 service',
      })
    }

    return new (ServiceClient as ServiceClientConstructor)(
      address,
      grpc.credentials.createInsecure()
    )
  }

  async request<T = Record<string, unknown>>(params: RequestParams) {
    const { action, payload } = params
    const client = await this.getService(params)

    return new Promise((resolve, reject) => {
      if (!client[action]) {
        throw new ServiceError({
          code: ErrorCode.NOT_FOUND,
          message: '无法找到对应的 action',
        })
      }

      client[action](payload, (err: any, response: T) => {
        if (err) {
          reject(
            new ServiceError({
              code: ErrorCode.FORBIDDEN,
              message: err && err.message,
            })
          )
          console.log('error', err)
          return
        }

        console.log('success', response)

        resolve(response)
      })
    })
  }
}

export default new ProtobufService()
