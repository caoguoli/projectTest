import { parseUrl } from '@/utils/MXSMART/tools/index.ts'

export default {
  methods: {
    goDetail() {
      if (parseUrl('groupId')) {
        this.$mx.page.has(this.$mx.APP_PATH.GROUP_INFO, res => {
          if (res === 'noMethod' || !res || Object.keys(res).length === 0) {
            this.$router.push({
              name: 'DeviceDetail'
            })
            return
          }
          this.$mx.page.go({
            path: this.$mx.APP_PATH.GROUP_INFO,
            query: {
              groupId: parseUrl('groupId')
            }
          })
        })
      } else {
        this.$mx.page.has(this.$mx.APP_PATH.DEVICE_DETAIL, res => {
          if (res === 'noMethod' || !res || Object.keys(res).length === 0) {
            this.$router.push({
              name: 'DeviceDetail'
            })
            return
          }
          this.$mx.page.go({
            path: this.$mx.APP_PATH.DEVICE_DETAIL,
            query: {
              productKey: parseUrl('productKey'),
              iotId: parseUrl('iotId'),
              isOwner: parseUrl('isOwner'),
              homeId: parseUrl('homeId')
            }
          })
        })
      }
    }
  }
}
