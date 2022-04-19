import adapter from './adapter'

interface NetworkStatusResp {
  status: boolean
  type: string
}
class Network {
  /**
   * 手机网络状态
   * @param params
   * @param callback - 回调函数
   */
  public async getStatus(
    params: {},
    callback: (resp: NetworkStatusResp) => {}
  ) {
    const resp = await adapter<NetworkStatusResp>(
      {
        app: 'network.getStatus',
        web: ''
      },
      {}
    )
    callback(resp)
  }
}

export default Network
