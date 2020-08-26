export interface ResponseStruct<T = any> {
  code: number
  subcode: number
  message: string
  data: T | null
}
