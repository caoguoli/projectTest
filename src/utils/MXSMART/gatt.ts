import adapter from './adapter'
import dsbridge from 'dsbridge'
interface DeviceParams {
  iotId?: string
}
class Gatt {
  /**
   * 连接设备
   */
  public async connectDevice(
    params: DeviceParams,
    callback: Function = () => ({})
  ) {
    dsbridge.call('gatt.connectDevice', params, res => {
      console.log(
        '调用的方法===>',
        'gatt.connectDevice',
        '参数===>',
        params,
        '回复===>',
        res.code,
        typeof res.code
      )
      callback(res)
    })
    // const resp = await adapter(
    //   {
    //     app: 'gatt.connectDevice',
    //     web: ''
    //   },
    //   params
    // )
    // callback(resp)
  }
  /**
   * 下发设备指令
   */
  public async setProperties(
    params: {
      /**
       * 物模型对象
       */
      data: {}
    },
    callback: Function = () => ({})
  ) {
    const resp = await adapter(
      {
        app: 'gatt.writeData',
        web: ''
      },
      {
        data: {
          ...params
        }
      }
    )
    callback(resp)
  }
  /**
   * 断开连接
   */
  public async disconnectGatt(
    params: {
      /**
       * 物模型对象
       */
      data: {}
    },
    callback: Function = () => ({})
  ) {
    const resp = await adapter(
      {
        app: 'gatt.disconnectGatt',
        web: ''
      },
      {
        data: {
          ...params
        }
      }
    )
    callback(resp)
  }
}
export default Gatt
