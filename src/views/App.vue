<template>
  <div id="app">
    <router-view class="routeView" />
    <!-- <OffLine v-if="needOffLine" :show="deviceStatus !== 1" /> -->
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import OffLine from '@/components/OffLine'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import {
  Dialog,
  Slider,
  Picker,
  Overlay,
  Button,
  Swipe,
  SwipeItem,
  SwipeCell,
  Progress,
  Cell,
  CellGroup,
  Circle,
  Popup,
  Collapse,
  CollapseItem
} from 'vant'
Vue.use(Dialog)
Vue.use(Slider)
Vue.use(Picker)
Vue.use(Overlay)
Vue.use(Button)
Vue.use(Swipe)
Vue.use(SwipeCell)
Vue.use(SwipeItem)
Vue.use(Progress)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Circle)
Vue.use(Popup)
Vue.use(Collapse)
Vue.use(CollapseItem)

export default {
  // components: {
  //   OffLine
  // },
  props: {
    needOffLine: {
      type: Boolean,
      default: true
    },
    messageControl: {
      type: Number,
      default: 1
    },
    isHex: {
      type: Boolean,
      default: false // TODO 默认 false
    }
  },
  data() {
    return {
      isLock: false
    }
  },
  computed: {
    ...mapState(['deviceStatus'])
  },
  watch: {
    $route() {
      if (this.$route.name === 'Home') {
        this.getPropertiesFull() // 获取全属性
      }
    }
  },
  created() {
    this.registThing() //监听物模型属性的变化
    this.getPropertiesFull() // 获取全属性
    this.getStatus() // 获取设备的在离线状态
    this.getNetWorkStatus() // 获取手机网络状态
  },
  mounted() {
    document.addEventListener('touchstart', this.addLock)
    document.addEventListener('touchend', this.removeLock)
  },
  destroyed() {
    document.removeEventListener('touchstart', this.addLock)
    document.removeEventListener('touchend', this.removeLock)
  },
  methods: {
    ...mapMutations([
      'changeDeviceData',
      'changeDeviceStatus',
      'changeDeviceStatusDetail',
      'changeDeviceHex',
      'changeNetworkStatus'
    ]),
    addLock() {
      this.isLock = true
    },
    removeLock() {
      this.isLock = false
    },
    //获取设备属性
    getPropertiesFull() {
      this.$mx.device.getPropertiesFull({}, res => {
        console.log('getPropertiesFull ===', res)
        if (res === 'noMethod') {
          return
        }
        if (typeof res === 'string') {
          this.changeDeviceHex(res)
        } else {
          const object = {}
          for (const key in res) {
            object[key] = res[key].value
          }
          console.log('设备的属性值', object)
          this.changeDeviceData(object)
        }
      })
    },
    getStatus() {
      this.$mx.device.getStatus({}, res => {
        console.log('设备的在离线', res.status)
        if (res.status !== undefined) {
          this.changeDeviceStatus(res.status)
          this.changeDeviceStatusDetail(res)
        }
      })
    },
    getNetWorkStatus() {
      this.$mx.network.getStatus({}, res => {
        console.log('手机网络状态', res ? JSON.stringify(res) : '')
        if (res) {
          this.changeNetworkStatus(res)
        }
      })
    },
    registThing() {
      this.$mx.device.registThing(
        {
          messageControl: this.messageControl,
          // hex 开关需要在其目录下有hex.json文件方可配合ilop2hex, hex2ilop转换
          // 目前只支持一层深度的json转换
          hex: this.isHex
        },
        res => {
          if (this.isLock) return
          console.log('监听的数据------》', res)
          if (res.type === 'status') {
            // 状态的变化
            console.log('设备状态监听', res)
            // TODO: 未来会渐渐淘汰此方法
            this.changeDeviceStatus(res.data.value)
            // 全量返回所有状态颗粒化判断
            this.changeDeviceStatusDetail(res.data)
          } else if (res.type === 'property') {
            // 设备属性
            const object = {}
            for (const key in res.data) {
              if (res.data[key].value !== undefined) {
                object[key] = res.data[key].value
              }
            }
            this.changeDeviceData({ isMocked: '', ...object })
          } else if (res.type === 'event') {
            // 告警
            console.log('<<<<<<< 设备告警监听 >>>>>>>', res)
            this.changeDeviceData({ isMocked: '', errorCode: res.data.value })
            // console.warn('res.data.value')
          } else if (res.type === 'hex') {
            this.changeDeviceHex(res.data)
          }
        }
      )
    }
  }
}
</script>
<style scoped lang="less">
.routeView {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
