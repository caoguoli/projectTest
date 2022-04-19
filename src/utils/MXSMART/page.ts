import adapter from './adapter'

interface BarHeightResp {
  /**
   * 距离顶部的高度，已计算刘海屏和状态栏高度
   */
  top: number
  /**
   * 距离底部的高度
   */
  bottom: number
}
/**
 * @returns '' -原生无页面
 * @returns 1  -原生有页面
 * @returns 'noMethod' -无has方法
 */
type HasResp = '1' | '' | 'noMethod'
class Page {
  /**
   * 获取顶部底部的高度
   */
  public async getBarHeight(params: {}, callback: (resp: BarHeightResp) => {}) {
    const resp = await adapter<BarHeightResp>(
      {
        app: 'page.getBarHeight',
        web: ''
      },
      params
    )
    callback(resp)
  }
  /**
   * 关闭页面
   */
  public async closeWebView(params: {}, callback: Function = () => ({})) {
    const resp = await adapter(
      {
        app: 'page.closeWebView',
        web: ''
      },
      params
    )
    callback(resp)
  }
  /**
   * 跳转页面
   */
  public async go(
    params: {
      /**
       * app原生路径
       */
      path: string
      /**
       * 跳转的传参
       */
      query?: {
        [key: string]: string
      }
    },
    callback: Function = () => ({})
  ) {
    const resp = await adapter(
      {
        app: 'page.go',
        web: ''
      },
      params
    )
    callback(resp)
  }
  /**
   * 是否有原生页面
   */
  public async has(
    /**
     * app原生路径
     */
    path: string,
    callback: (resp: HasResp) => {}
  ) {
    const resp = await adapter<HasResp>(
      {
        app: 'page.has',
        web: ''
      },
      path
    )
    callback(resp)
  }
}

export default Page
