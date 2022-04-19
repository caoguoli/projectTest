import dsbridge from 'dsbridge'

const adapter = <T>(
  name: {
    app: string
    web: string
  },
  params = {}
): Promise<T> => {
  const isApp = window.navigator.userAgent.includes('mxchip')
  if (isApp) {
    return new Promise((resolve, reject) => {
      // 调用方法不存在
      if (!dsbridge.hasNativeMethod(name.app)) {
        resolve(('noMethod' as unknown) as T)
        return
      }
      console.log('调用的方法===>', name.app, '参数===>', params)
      dsbridge.call(name.app, params, (resp: T) => {
        console.log(`收到的数据-${name.app}-${JSON.stringify(params)}`, resp)
        try {
          resolve(resp)
        } catch (e) {
          reject(e)
        }
      })
    })
  } else {
    // TODO: name.web
    return new Promise(resolve => {
      resolve(({} as unknown) as T)
    })
  }
}

export default adapter
