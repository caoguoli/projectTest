import adapter from './adapter'
import { parseUrl } from './tools'
interface FetchResp {
  code: number
  data: object
  message: string
}
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
class Request {
  /**
   * 调用飞燕接口
   */
  public async fetch(
    params: {
      /**
       * 请求地址
       */
      url: string
      /**
       * 请求方法
       */
      method: Method
      /**
       * 请求参数
       */
      data: object
      /**
       * 鉴权类型
       */
      authType: string
      /**
       * 版本
       */
      version: string
    },
    callback: (resp: FetchResp) => {}
  ) {
    const resp = await adapter<FetchResp>(
      {
        app: 'request.fetch',
        web: ''
      },
      {
        ...params,
        data: {
          ...params?.data,
          iotId: parseUrl('iotId')
        }
      }
    )
    callback(resp)
  }
  /**
   * 庆科自己的服务器
   */
  public async fetchOwnServer(
    params: {
      /**
       * 请求地址
       */
      url: string
      /**
       * 请求方法 GET,POST,PUT,DELETE
       */
      method: Method
      /**
       * 请求参数
       */
      data: object
    },
    callback: (resp: FetchResp) => {}
  ) {
    const resp = await adapter<FetchResp>(
      {
        app: 'request.fetchOwnServer',
        web: ''
      },
      {
        ...params,
        data: {
          ...params?.data,
          // iotId => iotid
          iotid: parseUrl('iotId')
        }
      }
    )
    callback(resp)
  }
}

export default Request
