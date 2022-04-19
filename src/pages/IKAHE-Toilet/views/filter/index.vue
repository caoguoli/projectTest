<template>
  <div class="filter-box">
    <NavBar title="滤芯使用寿命" right-icon="none" border @back="goBack" />
    <img :src="filterImg" :width="192" />
    <div class="lave" :class="`${filterColor}`">
      滤芯剩余{{ deviceData.FilterLifeTimeDays }}%
    </div>
    <div class="life">滤芯使用寿命约为6个月</div>
    <div class="reset flex" @click="modalShow = true">重置滤芯</div>

    <ALertModal
      :show="modalShow"
      title="滤芯重置"
      subtitle="确认是否要重置滤芯？"
      @cancelClick="cancelModal"
      @sureClick="sureModal"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue'
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
import ALertModal from '../../components/AlertModal'
// import HEX from '../hex.json'
// import ilop2hex from '@/utils/MXSMART/tools/ilop2hex'

export default {
  components: {
    NavBar,
    ALertModal
  },
  data() {
    return {
      modalShow: false,
      filterColor: '',
      filterImg: require('../../assets/imgs/filter.png')
    }
  },
  computed: {
    ...mapState(['deviceData'])
  },
  watch: {
    deviceData: {
      handler(deviceData) {
        const { FilterLifeTimeDays } = deviceData
        this.syncData(FilterLifeTimeDays)
      },
      deep: true
    }
  },
  mounted() {
    const { FilterLifeTimeDays } = this.deviceData
    this.syncData(FilterLifeTimeDays)
  },
  methods: {
    ...mapMutations(['changeDeviceData']),
    goBack() {
      this.$router.back()
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
    syncData(FilterLifeTimeDays) {
      this.filterColor =
        FilterLifeTimeDays <= 5
          ? 'red'
          : FilterLifeTimeDays <= 10
          ? 'yellow'
          : ''
    },
    /*
     * 弹窗提示
     */

    cancelModal() {
      this.modalShow = false
    },
    sureModal() {
      this.setHSVColorFunc({ filterReset: 1 })
      this.modalShow = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/public.less';
.filter-box {
  text-align: center;
  overflow: hidden;
  img {
    margin: 54px 0 59px;
  }
  .lave {
    font-size: 22px;
    font-weight: 500;
    color: #0066a1;
    line-height: 30px;
  }
  .red {
    color: #ff0000;
  }
  .yellow {
    color: #ff9900;
  }
  .life {
    font-size: 18px;
    font-weight: 400;
    color: #577592;
    line-height: 25px;
    margin: 6px 0;
  }
  .reset {
    width: 256px;
    height: 44px;
    border-radius: 22px;
    border: 1px solid #33d1ff;
    position: fixed;
    bottom: 101px;
    left: 0;
    right: 0;
    margin: 0 auto;
    font-size: 17px;
    font-weight: 500;
    color: #33d1ff;
    line-height: 17px;
  }
}
</style>
