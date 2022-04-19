<template>
  <div class="public-box status-mode subshow-box">
    <div class="title">{{ showStatus }}</div>
    <div class="circle flex" @click="OneKeystop">
      <div class="ico"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
// import HEX from '../hex.json'
// import ilop2hex from '@/utils/MXSMART/tools/ilop2hex'
import ListTpl from '../../../components/SwitchList/list-tpl.vue'

export default {
  components: {},
  data() {
    return {
      seatStatus: {
        0: '未着座',
        1: '着座'
      },
      workstatus: {
        0: '未着座',
        1: '臀洗中',
        2: '妇洗中',
        3: '烘干中',
        4: '喷枪清洗中'
      },
      flushingStatus: {
        0: '空闲',
        1: '冲水中',
        2: '蓄水中'
      },
      showStatus: '未着座'
    }
  },
  computed: {
    ...mapState(['deviceData'])
  },
  watch: {
    deviceData: {
      handler(deviceData) {
        const { seatStatus, workstatus, flushingStatus } = deviceData
        this.syncData(seatStatus, workstatus, flushingStatus)
      },
      deep: true
    }
  },
  mounted() {
    const { seatStatus, workstatus, flushingStatus } = this.deviceData
    this.syncData(seatStatus, workstatus, flushingStatus)
  },
  methods: {
    ...mapMutations(['changeDeviceData']),
    setHSVColorFunc(list) {
      const data = list
      // const hex = ilop2hex(data, HEX)
      console.warn('data-->', JSON.stringify(data))
      // console.warn('hex-->',hex);
      this.$mx.device.setProperties({
        data
        // hex
      })
    },
    OneKeystop() {
      this.setHSVColorFunc({ oneKeystop: 1 })
    },
    syncData(seatStatus, workstatus, flushingStatus) {
      /*
        工作状态空闲，显示着座状态（0/1）
        工作状态非空闲，显示工作状态，其中当工作状态为烘干，显示 工作状态*冲洗状态
        当前状态“烘干中*冲水状态”，冲水状态为空闲时不显示
      */
      let showStatus = seatStatus == 0 ? '未着座' : '着座'
      showStatus = flushingStatus == 1 ? '冲水中' : showStatus

      showStatus =
        workstatus == 0
          ? showStatus
          : flushingStatus == 1
          ? this.workstatus[workstatus] +
            '·' +
            this.flushingStatus[flushingStatus]
          : this.workstatus[workstatus]
      //       '·' +
      //       this.flushingStatus[flushingStatus]
      // showStatus =
      //   workstatus == 0
      //     ? showStatus
      //     : workstatus == 3 && flushingStatus !== 0
      //     ? this.workstatus[workstatus] +
      //       '·' +
      //       this.flushingStatus[flushingStatus]
      //     : this.workstatus[workstatus]
      this.showStatus = showStatus
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/less/public.less';
.status-mode {
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.circle {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  .ico {
    width: 13px;
    height: 12.3px;
    border-radius: 3px;
    border: 2px solid #fff;
  }
}
</style>
