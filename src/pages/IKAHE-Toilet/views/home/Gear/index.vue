<template>
  <div>
    <div class="gear-box public-box" style="padding-bottom:20px">
      <div class="title-top">挡位调节</div>
      <ModeList
        :modelist="modelist"
        :status="deviceData"
        :active="0"
        :disabled="disabled"
        @fClick="ModeClick"
      />
      <ModeList
        :modelist="modelist2"
        :status="deviceData"
        :active="0"
        :disabled="disabled"
        @fClick="ModeClick"
      />
    </div>

    <van-popup v-model="show" round position="bottom" safe-area-inset-bottom>
      <div class="add-model-con">
        <div class="toolbar flex">
          <!-- <div class="left flex" @click="show = false">取消</div> -->
          <div class="title">{{ title }}调节</div>
          <!-- <div class="right flex">确定</div> -->
        </div>
        <div v-if="sliderShow" class="slider">
          <van-slider
            v-model="sliderVal"
            :min="0"
            :max="scope.length - 1"
            :step="1"
            active-color="#00B2DE"
            @change="sliderChange"
          />
          <ul class="scope">
            <li v-for="(v, k) in scope" :key="k">{{ v }}</li>
          </ul>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import { Slider } from 'vant'
Vue.use(Slider)
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
  //   },
  // },
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
      modelist: [
        {
          name: '水压',
          ico: 'icon-shuiya1',
          value: 'waterGageTrim',
          disabled: false
        },
        {
          name: '水温',
          ico: 'icon-shuiwen1',
          value: 'waterTempTrim',
          disabled: false
        },
        {
          name: '喷嘴位置',
          ico: 'icon-penzuiweizhi1',
          value: 'nozzleLocation',
          disabled: false
        }
      ],
      modelist2: [
        {
          name: '座温',
          ico: 'icon-zuowen1',
          value: 'seatTempTrim',
          disabled: false
        },
        {
          name: '风温',
          ico: 'icon-fengwen1',
          value: 'windTempTrim',
          disabled: false
        },
        {
          name: '风速',
          ico: 'icon-fengsu1',
          value: 'windspeed',
          disabled: false
        }
      ],
      disabled: false,

      show: false,
      sliderShow: false,
      sliderVal: 1,
      title: '水压',
      scope: [0, 1, 2, 3],
      mode: 'waterGageTrim',
      waterGageTrim: {
        title: '水压',
        scope: ['1挡', '2挡', '3挡']
      },
      waterTempTrim: {
        title: '水温',
        scope: ['关挡', '低挡', '中挡', '高挡']
      },
      nozzleLocation: {
        title: '喷嘴位置',
        scope: ['1挡', '2挡', '3挡', '4挡', '5挡']
      },
      seatTempTrim: {
        title: '座温',
        scope: ['关挡', '低挡', '中挡', '高挡']
      },
      windTempTrim: {
        title: '风温',
        scope: ['关挡', '低挡', '中挡', '高挡']
      },
      windspeed: {
        title: '风速',
        scope: ['1挡', '2挡', '3挡']
      },
      nowMode: 'waterGageTrim'
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
      let mode
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          mode = key
        }
      }
      console.warn('this.deviceData[mode]', mode, this.deviceData[mode])
      this.nowMode = mode
      this.title = this[mode].title
      this.scope = this[mode].scope
      this.value = this.deviceData[mode]
      this.sliderVal = this.deviceData[mode]
      this.mode = mode

      this.show = true
      this.sliderShow = true
      // this.setHSVColorFunc({Mode: data * 1});
    },
    popupClosed() {
      this.sliderShow = false
    },
    sliderChange(v) {
      console.warn(v)
      this.setHSVColorFunc({ [this.mode]: v })
    },
    setHSVColorFunc(list) {
      const data = list
      console.warn(JSON.stringify(data))
      // return
      // const hex = ilop2hex(data, HEX)

      this.$mx.device.setProperties({
        data
        // hex,
        // messageType: 'unack',
        // messageControl: 1
      })
    },
    syncData(deviceData) {
      let modelist2 = this.modelist2
      const { seatStatus, workstatus, flushingStatus } = deviceData
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
      modelist2[2].disabled = false
      if (showStatus == '未着座' || showStatus == '着座') {
        modelist2[2].disabled = true
      }
      if (workstatus != 0 && workstatus != 3) {
        modelist2[2].disabled = true
      }
      console.warn('我来啦～～～～～～～～～～～～～～', modelist2[2].disabled)
      // modelist2[2].disabled =
      //   windStatus == 0 ||
      //   !(
      //     mode == 5 ||
      //     (mode == 1 && workstatus == 4) ||
      //     (mode == 2 && workstatus == 4)
      //   )
      // modelist2[2].disabled = deviceData.windStatus == 0
      this.modelist2 = modelist2
      this.alertGear(deviceData)
    },
    alertGear(deviceData) {
      const nowMode = this.nowMode
      this.sliderVal = deviceData[nowMode]
      // switch (nowMode) {
      //   case 'waterGageTrim':

      //     break
      //   case 'waterTempTrim':
      //     this.sliderVal = deviceData[mode]
      //     break
      //   case 'nozzleLocation':
      //     this.sliderVal = deviceData[mode]
      //     break
      //   case 'seatTempTrim':
      //     this.sliderVal = deviceData[mode]
      //     break
      //   case 'windTempTrim':
      //     this.sliderVal = deviceData[mode]
      //     break
      //   case 'windspeed':
      //     this.sliderVal = deviceData.windspeed
      //     break
      //   default:
      //     break
      // }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/less/public.less';
.toolbar {
  width: 100%;
  height: 40px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid #eeee;
  // margin-bottom: 20px;
  .left,
  .right {
    position: absolute;
    height: 40px;
    padding: 0 17px;
    top: 0;
    font-size: 14px;
    font-weight: 500;
    color: rgba(24, 59, 86, 0.5);
    line-height: 12px;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
    color: #33d1ff;
  }
  .title {
    font-size: 14px;
    font-weight: 500;
    color: rgba(24, 59, 86, 0.5);
    line-height: 12px;
  }
}
.slider {
  // height: 40px;
  padding: 38px 28px 20px;
}
.scope {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #33d1ff;
  text-align: center;
  margin-top: 24px;
}
</style>
