import adapter from './adapter'
import dsbridge from 'dsbridge'
import { parseUrl } from './tools'
import { MXSMARTInstance } from './index'
import { Toast } from 'vant'
import debounce from 'debounce-promise'
import store from '@/store'

interface DeviceParams {
  iotId?: string
  homeId?: string
}

// 自定义的设备接入类型：0-未知产品类型 1-WiFi设备 2-BLE设备 3-BLE MESH设备 4-BLE MESH低功耗设备 5-网关设备
const iotId = parseUrl('iotId')

const debounceAdapter = async params => {
  const asyncResponse = await new Promise(async resolve => {
    const resp = await adapter(
      {
        app: 'device.setProperties',
        web: ''
      },
      {
        ...params,
        iotId
      }
    )
    resolve(resp)
  })
  return asyncResponse
}
const debounceFoo = debounce(debounceAdapter, 100)

interface DeviceStatusResp {
  /**
   * 1是在线，其他是离线
   */
  status: number
  /**
   * 1:飞燕在线  0:离线
   */
  remoteStatus: number
  /**
   * 1:mesh在线  0:mesh离线
   */
  localStatus: number
  /**
   * 上报的时间
   */
  time: number
}

interface RegistThingResp {
  /**
   *  status - 设备状态监听
   *  property - 设备属性监听
   *  event - 设备告警监听
   *  hex - 上报的hex
   */
  type: string
  /**
   * status - {}
   */
  data:
    | {
        /**
         * 1是在线，其他是离线
         */
        value: number
        /**
         * 1:飞燕在线  0:离线
         */
        remoteStatus: number
        /**
         * 1:mesh在线  0:mesh离线
         */
        localStatus: number
      }
    /**
     * 物模型
     */
    | {
        [key: string]: {
          /**
           * 物模型的值
           */
          value: number
          time: number
        }
      }
    /**
     * hex值
     */
    | string
}

interface PropertiesFull {
  [key: string]: {
    value: string | number
  }
}

type PropertiesFullResp =
  /**
   * 物模型
   */
  | PropertiesFull
  /**
   * hex值
   */
  | string

interface RoomInfoResp {
  roomId: string
  roomName: string
}

class Device {
  /**
   * 设备在离线
   * @param params - 设备参数
   * @param callback - 回调函数
   */
  public async getStatus(params: {}, callback: (resp: DeviceStatusResp) => {}) {
    const resp = await adapter<DeviceStatusResp>(
      {
        app: 'device.getStatus',
        web: ''
      },
      {
        ...params,
        iotId
      }
    )
    callback(resp)
  }
  /**
   * 添加设备数据、状态监听
   * @param params - 控制设备同步状态
   * @param callback - 回调函数
   */
  public registThing(
    params: {
      /**
       * 0: 实时同步状态 1：设备上报延时（目前针对灯做了处理）
       */
      messageControl: number
      /**
       * true: 开 false: 关
       */
      hex: boolean
    },
    callback: (resp: RegistThingResp) => {}
  ) {
    dsbridge.call('device.registThing', params, (res: RegistThingResp) => {
      callback(res)
    })
  }
  /**
   * TODO: 解除监听
   */
  public async unRegistThing(
    params: DeviceParams,
    callback: Function = () => ({})
  ) {
    const resp = await adapter(
      {
        app: 'device.unRegistThing',
        web: ''
      },
      {}
    )
    callback(resp)
  }
  /**
   * 获取设备的物模型的全属性
   */
  public async getPropertiesFull(
    params: {},
    callback: (resp: PropertiesFullResp) => {}
  ) {
    const resp = await adapter<PropertiesFullResp>(
      {
        app: 'device.getPropertiesFull',
        web: ''
      },
      {
        ...params,
        iotId
      }
    )
    callback(resp)
  }
  /**
   * 下发设备指令
   */
  public async setProperties(
    params: {
      iotId: string
      /**
       * 物模型对象
       */
      data: {}
      /**
       * 新接的蓝牙设备传入hex组装指令
       */
      hex?: string
      /**
       * 0: 实时同步状态
       * 1：设备上报延时
       */
      messageControl?: 0 | 1
      /**
       * ack:   has callback
       * unack: no callback
       */
      messageType?: 'ack' | 'unack'
    },
    callback: Function = () => ({})
  ) {
    // unack没有callback所以需要单独处理
    if (params?.messageType === 'unack') {
      store.commit('changeDeviceData', params?.data)
    }
    debounceFoo(params).then(resp => {
      if (params?.messageType !== 'unack' && params?.messageControl !== 0) {
        store.commit('changeDeviceData', params?.data)
        // FIXME: 调试用
        // store.commit('changeDeviceHex')
      }

      if (resp?.code === 29004) {
        Toast('该设备已被解绑或被取消分享')
        MXSMARTInstance.device.onReflushDevices(
          {
            iotId: parseUrl('iotId') || ''
          },
          () => {
            setTimeout(() => {
              MXSMARTInstance.page.closeWebView({})
            }, 2000)
          }
        )
      }
      callback(resp)
    })
  }
  /**
   * 下发设备预设指令(真实下发由app重新组装指令去执行)
   */
  public async setPropertiesPre(
    params: {
      iotId: string
      /**
       * 物模型对象
       */
      data: {}
      /**
       * 新接的蓝牙设备传入hex组装指令
       */
      hex?: string
      /**
       * 0: 实时同步状态
       * 1：设备上报延时
       */
      messageControl?: 0 | 1
      /**
       * ack:   has callback
       * unack: no callback
       */
      messageType?: 'ack' | 'unack'
    },
    callback: Function = () => ({})
  ) {
    const resp = await adapter(
      {
        app: 'device.setPropertiesPre',
        web: ''
      },
      {
        ...params,
        iotId
      }
    )
    callback(resp)
  }
  /**
   * 执行联动指令
   */
  public async actionLinkage(
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
        app: 'device.actionLinkage',
        web: ''
      },
      params
    )
    callback(resp)
  }
  /**
   * 刷新APP上设备状态
   */
  public async onReflushDevices(
    params: DeviceParams,
    callback: Function = () => ({})
  ) {
    const resp = await adapter(
      {
        app: 'device.onReflushDevices',
        web: ''
      },
      params
    )
    callback(resp)
  }
  /**
   * 获取房间信息
   */
  public async getRoomInfo(params: {}, callback: (resp: RoomInfoResp) => {}) {
    const resp = await adapter<RoomInfoResp>(
      {
        app: 'device.getRoomInfo',
        web: ''
      },
      params
    )
    callback(resp)
  }
}

export default Device
