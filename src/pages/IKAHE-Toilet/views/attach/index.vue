<template>
  <div class="attach-box">
    <NavBar title="附加功能" right-icon="none" border @back="goBack" />

    <div v-for="(v, k) in buttonList" :key="k" class="public-box switchbox">
      <SwitchList
        v-if="!v.none"
        theme-color="#33D1FF"
        :name="v.name"
        :text-style="{ color: '#183B56', margin: '0' }"
        :active="deviceData[v.code] == 1"
        @fClick="ButtomClick(v)"
      />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue'
import SwitchList from '../../components/SwitchList'
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
// import HEX from '../hex.json'
// import ilop2hex from '@/utils/MXSMART/tools/ilop2hex'

export default {
  components: {
    NavBar,
    SwitchList
  },
  data() {
    return {
      buttonList: [
        {
          name: '微波',
          code: 'AutoFlip',
          none: false
        },
        {
          name: '自动除臭',
          code: 'autoDeodorization',
          none: false
        },
        {
          name: '脚踢灯光',
          code: 'kickLight',
          none: false
        },
        {
          name: '润圈',
          code: 'ringLubrication',
          none: false
        },
        // {
        //   name:'旋钮灯光',
        //   code:'knobLight',
        //   none: false,
        // },
        {
          name: '离座冲水',
          code: 'standFlushWater',
          none: false
        },
        {
          name: '干燥冲水',
          code: 'dryFlush',
          none: false
        }
      ]
    }
  },
  computed: {
    ...mapState(['deviceData'])
  },
  watch: {
    deviceData: {
      handler(deviceData) {
        // const { flipType, knobKickStatus } = deviceData
        this.syncData(deviceData)
      },
      deep: true
    }
  },
  mounted() {
    // const { flipType, knobKickStatus } = this.deviceData
    const deviceData = this.deviceData
    this.syncData(deviceData)
  },
  methods: {
    ...mapMutations(['changeDeviceData']),
    goBack() {
      this.$router.back()
    },
    syncData(deviceData) {
      console.log('deviceData', deviceData)
      // console.warn('knobKickStatus',knobKickStatus,knobKickStatus != 3 && knobKickStatus != 2)
      let buttonList = this.buttonList
      // buttonList[0].none = flipType == 0
      // buttonList[2].none = knobKickStatus != 3 && knobKickStatus != 2 // 旋钮
      // buttonList[3].none = knobKickStatus != 3 && knobKickStatus != 1 // 脚踢
      // buttonList[2].none = true;
      // buttonList[3].none = true;
      this.buttonList = buttonList
    },
    setHSVColorFunc(list) {
      const data = list
      // const hex = ilop2hex(data, HEX)
      console.warn(JSON.stringify(data))
      // console.warn('hex-->',hex);
      this.$mx.device.setProperties({
        data
        // hex
      })
    },
    ButtomClick(v) {
      const data = {
        [v.code]: this.deviceData[v.code] == 1 ? 0 : 1
      }
      this.setHSVColorFunc({ ...data })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/public.less';
.attach-box {
  overflow: hidden;
  margin-top: 7px;
  .switchbox {
    background: #fff;
    margin: 17px;
  }
}
</style>
