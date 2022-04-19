export const APP_PATH = {
  /**
   * 房间管理
   */
  ROOM: 'page/device/manage_room',
  /**
   * 分享设备
   */
  SHARE: 'page/share/adduser',
  /**
   * 用户反馈
   */
  FEED_BACK: 'page/feedback',
  /**
   * ota升级
   */
  OTA: 'page/ota',
  /**
   * 蓝牙ota升级
   */
  OTA_BLE: 'page/device/upgrateOTA',
  /**
   * 问答
   */
  FAQ: 'page/me/faq',
  /**
   * PIR传感器设备联动
   */
  PIRRULES: 'page/scene/mxchip/pirRules',
  /**
   * 无线场景设备联动
   */
  RULEBUTTONLIST: 'page/scene/mxchip/ruleButtonList',
  /**
   * 设置wifi
   */
  SETWIFI: 'page/device/setWIFI',
  /**
   * 设备详情
   */
  DEVICE_DETAIL: 'page/device/detail',
  /**
   * 组控
   */
  GROUP_INFO: 'page/device/group_info'
}

export const APP = {
  // 智家精灵
  '0': 'smartplus',
  // 佛照
  '1': 'fsl',
  // 无限极
  '2': 'infinitus',
  'com.mxchip.bta': 'smartplus',
  'com.mxchip.zgrill': 'smartplus',
  'com.chinafsl.smart': 'fsl',
  'com.chinafsl.iot': 'fsl',
  'com.mxchip.infinitus': 'infinitus'
}
// https://mxchip.yuque.com/vbs9010/project/vvapgx#u1ChR
// 自定义的设备接入类型：0 - 未知产品类型 1 - WiFi设备 2 - 蓝牙设备 3 - 蓝牙MESH设备 4 - 蓝牙MESH低功耗设备 5 - WIFI + Mesh网关设备 6 - Combo设备
export const PRODUCT_TYPE = {
  '0': 'unknown',
  '1': 'wifi',
  '2': 'ble',
  '3': 'mesh',
  '4': 'mesh-low',
  '5': 'mesh-wifi',
  '6': 'combo'
}
