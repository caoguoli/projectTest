<template>
  <div class="home-box">
    <div>cgl1 t修改了部分的代码</div>
    <WarningBar
      :data-source="warningArray"
      :style="{ background: 'rgba(255, 159, 159, 0.32)', color: '#FF5B5E' }"
      :left-icon-style="{ color: '#FF5B5E', 'font-size': '16px' }"
      :content-style="{ 'font-size': '14px' }"
      :cancel-icon-style="{ color: '#AAAAAA' }"
    />
    <div v-if="PowerSwitch == 0" key="off" class="off-box">
      <img class="offLogo" :src="bgImg" alt="" />
      <div class="power flex" @click="PowerClick(1)">
        <i class="iconfont icon-switch"></i>
      </div>
    </div>

    <div v-else key="on">
      <StatusView :status="status" :bg-img="bgImg" />
      <StatusMode :status="deviceData" />
      <Mode :status="deviceData" />
      <Switchs :status="deviceData" />
      <Gear :status="deviceData" />
      <SwitchOther />
      <Footer @losePowerClick="PowerClick(0)" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
import WarningBar from '@/components/WarningBar/index.vue'
import StatusView from './StatusView'
import StatusMode from './StatusMode'
import Mode from './Model'
import Switchs from './Switch'
import Gear from './Gear'
import SwitchOther from './SwitchOther'
import Footer from './Footer'

export default {
  components: {
    WarningBar,
    StatusView,
    StatusMode,
    Mode,
    Switchs,
    Gear,
    SwitchOther,
    Footer
  },
  data() {
    return {
      status: {},
      bgImg: require('../../assets/imgs/bg.png'),
      Power: 1,
      PowerSwitch: 0,
      warningArray: ['交流频率异常'],
      warnList: {
        1: '设备交流频率异常，请检查机器。',
        4: '备烘干异常，请检查机器。',
        2: '设备水温异常，请检查机器。',
        5: '设备水流量异常，请检查机器',
        3: '设备座温异常，请检查机器。',
        6: '设备滤芯到期，请更换。'
      }
    }
  },
  computed: {
    ...mapState(['deviceData'])
  },
  watch: {
    deviceData: {
      handler(deviceData) {
        this.PowerSwitch = deviceData.PowerSwitch
        this.syncData({ ...deviceData })
      },
      deep: true
    }
  },
  mounted() {
    const deviceData = this.deviceData
    this.PowerSwitch = deviceData.PowerSwitch
    this.syncData({ ...deviceData })
  },
  created() {},
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
    PowerClick(v) {
      console.warn('PowerSwitch', v)
      this.PowerSwitch = v
      // this.Power = this.Power == 1 ? 0 : 1;
    },
    syncData(deviceData) {
      console.warn('deviceData', deviceData)
      const showWindTemp =
        deviceData.windTempTrim == 0 ? '--' : deviceData.windTemp + '℃'
      const showCurrentTemperature =
        deviceData.waterTempTrim == 0
          ? '--'
          : deviceData.currentTemperature + '℃'

      this.status = { ...deviceData, showWindTemp, showCurrentTemperature }

      const errorCode = deviceData.errorCode
      this.warningArray =
        !errorCode || !this.warnList[errorCode]
          ? []
          : [this.warnList[errorCode]]
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-box {
  overflow: hidden;
  position: relative;
  color: #fff;
  .power {
    width: 65px;
    height: 65px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    i {
      font-size: 30px;
    }
  }
  .off-box {
    text-align: center;
    .offLogo {
      width: 260px;
      // height: 245px;
      margin-top: 186px;
    }
    .power {
      margin: 0 auto;
      position: fixed;
      bottom: 70px;
      left: 0;
      right: 0;
    }
  }
  .show-index {
    z-index: 2;
  }
}
</style>
