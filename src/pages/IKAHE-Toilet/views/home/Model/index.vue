<template>
  <div>
    <div class="public-box" style="padding-bottom:20px">
      <div class="title-top">功能模式</div>
      <ModeList :modelist="modelist" :status="deviceData" @fClick="ModeClick" />
      <ModeList
        :modelist="modelist2"
        :status="deviceData"
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
          name: '智能臀洗',
          ico: 'icon-zhinengtunxi',
          value: 'mode',
          disabled: false,
          active: false,
          data: 1
        },
        {
          name: '智能妇洗',
          ico: 'icon-zhinengfuxi',
          value: 'mode',
          disabled: false,
          active: false,
          data: 2
        },
        {
          name: '臀洗',
          ico: 'icon-tunxi1',
          value: 'mode',
          disabled: false,
          active: false,
          data: 3
        }
      ],
      modelist2: [
        {
          name: '妇洗',
          ico: 'icon-fuxi1',
          value: 'mode',
          disabled: false,
          active: false,
          data: 4
        },
        {
          name: '烘干',
          ico: 'icon-honggan1',
          value: 'mode',
          disabled: false,
          active: false,
          data: 5
        },
        {
          name: '冲水',
          ico: 'icon-chongshui1',
          value: 'mode',
          disabled: false,
          active: false,
          data: 6
        }
      ],
      disabled: true
    }
  },
  computed: {
    ...mapState(['deviceData'])
  },
  watch: {
    deviceData: {
      handler(deviceData) {
        const {
          flushingStatus,
          mode,
          seatStatus,
          workstatus,
          windStatus
        } = deviceData
        this.syncData(flushingStatus, mode, seatStatus, workstatus, windStatus)
      },
      deep: true
    }
  },
  mounted() {
    const {
      flushingStatus,
      mode,
      seatStatus,
      workstatus,
      windStatus
    } = this.deviceData
    this.syncData(flushingStatus, mode, seatStatus, workstatus, windStatus)
  },
  methods: {
    ...mapMutations(['changeDeviceData']),
    syncData(flushingStatus, mode, seatStatus, workstatus, windStatus) {
      console.warn('windStatus', windStatus)
      let modelist = this.modelist
      let modelist2 = this.modelist2

      for (let i = 0; i < modelist.length; i++) {
        modelist[i].disabled = false
        modelist[i].active = false
      }
      for (let i = 0; i < modelist2.length; i++) {
        modelist2[i].disabled = false
        modelist2[i].active = false
      }

      // modelist2[2].disabled = windStatus == 0

      if (seatStatus == 0) {
        modelist[0].disabled = true
        modelist[1].disabled = true
        modelist[2].disabled = true
        modelist2[0].disabled = true
        modelist2[1].disabled = true
      }

      // 选中
      // console.log('mode', mode)
      if (mode != 0) {
        if (mode <= 3) {
          modelist[mode - 1].active = true
        } else {
          modelist2[mode - 4].active = true
        }
      }

      if (flushingStatus == 2) {
        modelist2[2].disabled = true
      }
      if (flushingStatus == 0) {
        modelist2[2].active = false
      }
      if (flushingStatus == 1) {
        modelist2[2].active = true
      }
      // 冲水：workstatus=1&2 禁用
      if (workstatus == 1 || workstatus == 2) {
        modelist2[2].disabled = true
      }

      // 智能臀洗
      // modelist[0].disabled = seatStatus == 0 || (mode == 2 && workstatus == 2)
      modelist[0].disabled = seatStatus == 0

      // 冲水中的时候，智能臀洗、智能妇洗、臀洗、妇洗置灰
      if (flushingStatus == 1) {
        modelist[0].disabled = true
        modelist[1].disabled = true
        modelist[2].disabled = true
        modelist2[0].disabled = true
      }

      this.modelist = modelist
      this.modelist2 = modelist2
    },
    ModeClick(data) {
      this.setHSVColorFunc({ ...data })
    },
    setHSVColorFunc(list) {
      const data = list
      console.warn('控制了属性--', JSON.stringify(data))
      // return
      // const hex = ilop2hex(data, HEX)

      this.$mx.device.setProperties({
        data,
        // hex,
        messageType: 'unack',
        messageControl: 1
      })
    }
  }
}
</script>
<style lang="less">
@import '../../../assets/less/public.less';
</style>
