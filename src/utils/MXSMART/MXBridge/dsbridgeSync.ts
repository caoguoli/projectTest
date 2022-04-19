import dsbridge from 'dsbridge'

const dsbridgeSync = (name: string, params = {}) => {
  return new Promise((resolve, reject) => {
    // 不在 App 内
    if (!window.navigator.userAgent.includes('mxchip')) {
      return
    }
    // 调用方法不存在
    if (!dsbridge.hasNativeMethod(name)) {
      return
    }
    dsbridge.call(name, params, (resp: any) => {
      try {
        resolve(resp)
      } catch (e) {
        // TODO:
      }
    })
  })
}

export default dsbridgeSync
