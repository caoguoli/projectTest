<template>
  <div>
    <div class="public-box" style="padding-bottom:20px">
      <div class="title-top">开关设置</div>
      <ModeList
        :modelist="modelist"
        :status="deviceData"
        :disabled="disabled"
        @fClick="ModeClick"
      />
      <ModeList
        :modelist="modelist2"
        :status="deviceData"
        :disabled="disabled"
        @fClick="ModeClick"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import ModeList from '../../../components/ModeList'
export default {
  components: {
    ModeList
  },
  // props:{
  //   status:{
  //     type: Object,
  //     default: function(){
  //       return {}
  //     }
  //   }
  // },
  data() {
    return {
      modelist: [
        {
          name: '冷热按摩',
          ico: 'icon-lengreanmo1',
          value: 'washingSwitch',
          disabled: false,
          active: false
        },
        {
          name: '移动清洗',
          ico: 'icon-yidongqingxi1',
          value: 'moveClean',
          disabled: false,
          active: false
        },
        {
          name: '喷嘴清洁',
          ico: 'icon-penzuiqingjie1',
          value: 'InjectorClean',
          disabled: false,
          active: false
        }
      ],
      modelist2: [
        {
          name: '夜灯',
          ico: 'icon-yedeng1',
          value: 'nightLight',
          disabled: false,
          active: false
        },
        {
          name: '座圈',
          ico: 'icon-zuoquan1',
          value: 'heatRing',
          disabled: false,
          active: false
        },
        {
          name: '座盖',
          ico: 'icon-zuogai1',
          value: 'closeroof',
          disabled: false,
          active: false
        }
      ],
      disabled: false
    }
  },
  computed: {
    ...mapState(['deviceData'])
  },
  watch: {
    deviceData: {
      handler(deviceData) {
        this.syncData(deviceData)
      },
      deep: true
    }
  },
  mounted() {
    const deviceData = this.deviceData
    this.syncData(deviceData)
  },
  methods: {
    ...mapMutations(['changeDeviceData']),
    ModeClick(data) {
      console.log(data)
      this.setHSVColorFunc({ ...data })
    },
    setHSVColorFunc(list) {
      const data = list
      // console.error('HSVColor',data)
      // return
      // const hex = ilop2hex(data, HEX)
      console.warn(JSON.stringify(data))
      this.$mx.device.setProperties({
        data
        // hex,
        // messageType: 'unack',
        // messageControl: 1
      })
    },
    syncData(deviceData) {
      const mode = deviceData.mode
      const seatStatus = deviceData.seatStatus
      const workstatus = deviceData.workstatus

      let modelist = this.modelist
      let modelist2 = this.modelist2

      modelist.forEach(ele => {
        ele.active = deviceData[ele.value] == 1
      })
      modelist2.forEach(ele => {
        ele.active = deviceData[ele.value] == 1
      })

      // 冷热按摩
      modelist[0].disabled = !(
        mode == 3 ||
        mode == 4 ||
        (mode == 1 && workstatus == 1) ||
        (mode == 2 && workstatus == 2)
      )
      // 移动清洗
      modelist[1].disabled = !(
        mode == 3 ||
        mode == 4 ||
        (mode == 1 && workstatus == 1) ||
        (mode == 2 && workstatus == 2)
      )
      // 喷嘴清洁
      modelist[2].disabled = seatStatus == 1
      // 座圈、座盖
      modelist2[1].disabled = seatStatus == 1
      modelist2[2].disabled = seatStatus == 1

      this.modelist = modelist
      this.modelist2 = modelist2
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/less/public.less';
</style>
