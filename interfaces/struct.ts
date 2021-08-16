export interface IResponse<T = any> {
  code: number
  subcode: number
  message: string
  data: T | null
}
