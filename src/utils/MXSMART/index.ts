import Device from './device'
import Gatt from './gatt'
import Media from './media'
import Page from './page'
import Request from './request'
import Network from './network'
import { parseUrl, parseAppParams } from './tools'
import { APP, PRODUCT_TYPE, APP_PATH } from './config'

export class MXSMART {
  public static instance: MXSMART
  /**
   * 设备相关接口
   */
  device: Device
  /**
   * Gatt相关接口
   */
  gatt: Gatt
  /**
   * 多媒体相关接口
   */
  media: Media
  /**
   * 页面相关接口
   */
  page: Page
  /**
   * 请求相关接口
   */
  request: Request
  /**
   * 手机网络状态
   */
  network: Network
  /**
   * url跳转相关参数
   */
  query: {
    /**
     * 0: 被分享 1: 主用户 2: 虚拟设备
     */
    isOwner: string
  }
  /**
   * 当前app肤色类型
   */
  app: string
  /**
   * 设备类型
   * 0 - 未知产品类型 1 - WiFi设备 2 - 蓝牙设备 3 - 蓝牙MESH设备 4 - 蓝牙MESH低功耗设备 5 - WIFI + Mesh网关设备 6 - Combo设备
   */
  productType: string
  /**
   * 是否在app内
   */
  isApp: boolean
  /**
   * app路径
   */
  APP_PATH: typeof APP_PATH
  private constructor() {
    this.device = new Device()
    this.gatt = new Gatt()
    this.media = new Media()
    this.page = new Page()
    this.request = new Request()
    this.network = new Network()
    this.query = {
      isOwner: parseUrl('isOwner')
    }
    this.app = APP[parseAppParams()]
    const productType =
      window.navigator.userAgent.match(/productType\/(\S+)/) || []
    this.productType = productType[1] ? PRODUCT_TYPE[productType[1]] : 'wifi'
    this.isApp = window.navigator.userAgent.includes('mxchip')
    this.APP_PATH = APP_PATH
  }
  public static getInstance() {
    if (this.instance === undefined) {
      this.instance = new MXSMART()
    }
    return this.instance
  }
}

const mxFunc = {
  install: Vue => {
    Vue.prototype.$mx = MXSMART.getInstance()
  }
}
const MXSMARTInstance = MXSMART.getInstance()
export { MXSMARTInstance }

export default mxFunc
