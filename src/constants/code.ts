/**
 * 错误使用码与 HTTP 状态码保持一致
 * 详细错误各个服务使用 subcode 定义
 */
enum ErrorCode {
  /**
   * 错误请求：例如参数错误
   */
  BAD_REQUEST = 400,
  /**
   * 授权请求
   */
  UNAUTHORIZED = 401,
  /**
   * 被拒绝的请求
   */
  FORBIDDEN = 403,
  /**
   * 不存在的资源
   */
  NOT_FOUND = 404,
  /**
   * 是不允许的请求方法
   */
  METHOD_NOT_ALLOWED = 405,
  /**
   * 不能处理的Content-Type要求
   */
  NOT_ACCEPTABLE = 406,
  /**
   * 客户端请求超时，客户端未能在服务器预备等待的时间内完成一个请求的发送
   */
  REQUEST_TIMEOUT = 408,
}

export default ErrorCode
