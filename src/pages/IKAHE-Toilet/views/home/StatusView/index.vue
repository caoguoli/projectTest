<template>
  <div class="status-view">
    <img :src="bgImg" alt="" />
    <ul class="show flex">
      <li v-for="(v, k) in statusList" :key="k">
        <div class="flex"><i :class="`iconfont ${v.iconfont}`"></i></div>
        <p>{{ v.text }}</p>
      </li>
      <!-- <li>
        <div class="flex"><i :class="`iconfont icon-fengwen1`"></i></div>
        <p>{{ windTempStatus }}</p>
      </li>
      <li>
        <div class="flex"><i class="iconfont icon-shuiwen1"></i></div>
        <p>{{ waterTempTrimStatus }}</p>
      </li> -->
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
// import HEX from '../hex.json'
// import ilop2hex from '@/utils/MXSMART/tools/ilop2hex'

export default {
  props: {
    bgImg: {
      type: String,
      default: ''
    },
    status: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      statusList: [
        {
          iconfont: 'icon-zuowen1',
          text: '--'
        },
        {
          iconfont: 'icon-fengwen1',
          text: '--'
        },
        {
          iconfont: 'icon-shuiwen1',
          text: '--'
        }
      ],
      seatStatus: '',
      seatTempTrimList: {
        0: '--',
        1: '34',
        2: '37',
        3: '39'
      },
      windTempStatus: '',
      windTempTrimList: {
        0: '--',
        1: '35',
        2: '45',
        3: '55'
      },
      waterTempTrimStatus: '',
      waterTempTrimList: {
        0: '--',
        1: '34',
        2: '37',
        3: '39'
      }
    }
  },
  watch: {
    status: {
      handler(status) {
        let statusList = this.statusList
        this.seatStatus =
          status.seatTempTrim == 0
            ? '--'
            : this.seatTempTrimList[status.seatTempTrim] + '℃'
        this.windTempStatus =
          status.windTempTrim == 0
            ? '--'
            : this.windTempTrimList[status.windTempTrim] + '℃'
        this.waterTempTrimStatus =
          status.waterTempTrim == 0
            ? '--'
            : this.waterTempTrimList[status.waterTempTrim] + '℃'

        statusList[0].text = this.seatStatus
        statusList[1].text = this.windTempStatus
        statusList[2].text = this.waterTempTrimStatus
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState(['deviceData'])
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
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/less/public.less';
.status-view {
  margin-top: 63px;
  display: flex;
  align-items: center;
  flex-direction: column;
  img {
    width: 240px;
    // width: 299.7px;
    // height: 216.4px;
  }
  .show {
    width: 299.7px;
    justify-content: space-between;
    div {
      width: 30px;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      i {
        font-size: 20px;
      }
    }
    p {
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      margin-top: 5px;
      text-align: center;
    }
  }
}
</style>
