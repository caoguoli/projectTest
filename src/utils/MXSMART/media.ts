import adapter from './adapter'
interface MediaShareResp {
  /**
   * 0: 成功
   */
  code: number
}
class Media {
  /**
   * 图片分享
   */
  public async share(
    params: {
      /**
       * 标题
       */
      title: string
      /**
       * 描述
       */
      desc: string
      /**
       * 图片链接
       */
      imgUrl: string
      /**
       * 分享链接
       */
      link: string
    },
    callback: (resp: MediaShareResp) => {}
  ) {
    const resp = await adapter<MediaShareResp>(
      {
        app: 'media.share',
        web: ''
      },
      params
    )
    callback(resp)
  }
  // 视频
  // 音频
}

export default Media
