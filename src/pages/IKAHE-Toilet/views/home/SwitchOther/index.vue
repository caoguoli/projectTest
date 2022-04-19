<template>
  <div>
    <div class="public-box">
      <SwitchOther
        :text-style="{ color: '#fff', margin: '0' }"
        :sub-ico-style="{ color: '#fff' }"
        :subtitle="subText"
        name="附加功能"
        @fClick="BrightnessFn('attach')"
      />
    </div>

    <div class="public-box">
      <SwitchOther
        :text-style="{ color: '#fff', margin: '0' }"
        :sub-style="{ color: 'rgba(255,255,255,0.5)' }"
        :sub-ico-style="{ color: '#fff' }"
        :subtitle="heatRingTime"
        name="座圈加热节能"
        @fClick="BrightnessFn('seatHeating')"
      />
    </div>

    <div class="public-box">
      <SwitchOther
        :text-style="{ color: '#fff', margin: '0' }"
        :sub-style="{ color: 'rgba(255,255,255,0.5)' }"
        :sub-ico-style="{ color: '#fff' }"
        :subtitle="`滤芯剩余${deviceData.FilterLifeTimeDays}%`"
        name="滤芯使用寿命"
        @fClick="BrightnessFn('filter')"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import SwitchOther from '../../../components/SwitchList/other.vue'
export default {
  components: {
    SwitchOther
  },
  props: {
    status: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      heatRingTime: ''
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
  methods: {
    ...mapMutations(['changeDeviceData']),
    syncData(deviceData) {
      let heatRingTime = ''
      const startTime = this.getTimes(deviceData.heatRingSavingStartTime)
      const endTime = this.getTimes(deviceData.heatRingSavingFinishTime)
      heatRingTime =
        deviceData.heatRingSaving == 0 ? '' : `${startTime}-${endTime} 打开`
      this.heatRingTime = heatRingTime
    },
    getTimes(time) {
      let h = parseInt(time / 60)
      let m = time - parseInt(time / 60) * 60
      h = h <= 9 ? `0${h}` : h
      m = m <= 9 ? `0${m}` : m
      return `${h}:${m}`
    },
    BrightnessFn(page) {
      this.$router.push({ path: `/${page}` })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/less/public.less';
</style>
