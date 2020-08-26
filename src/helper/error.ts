/**
 * 服务错误
 */
import _ from 'lodash'

interface Options<T> {
  code: number
  subcode?: number
  message: string
  data?: T | null
}

export default class ServiceError<T = any> extends Error {
  code: number
  data: T | null
  subcode: number
  message: string

  constructor(options: Options<T>) {
    const { code, message, subcode, data } = options

    super()
    this.code = code
    this.message = message
    this.subcode = _.isNil(subcode) ? 0 : subcode
    this.data = _.isNil(data) ? null : data
  }

  toObject() {
    return {
      code: this.code,
      message: this.message,
      subcode: this.subcode,
      data: this.data,
    }
  }
}
