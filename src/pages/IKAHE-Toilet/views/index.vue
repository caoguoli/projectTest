<template>
  <div class="toilet-box">
    <NavBar title="智能马桶" />
    <Home />
  </div>
</template>

<script>
import NavBar from '@/bizComponents/NavBar'
import Home from './home'
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
// import HEX from '../hex.json'
// import ilop2hex from '@/utils/MXSMART/tools/ilop2hex'

export default {
  components: {
    NavBar,
    Home
  },
  data() {
    return {}
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
.toilet-box {
  // min-height: 100vh;
  // overflow: hidden;
  background: linear-gradient(180deg, #183b56 0%, #0475cc 100%);
  // position: inherit;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  min-height: 100vh;
  border: 1px solid transparent;
  overflow: scroll;
}
</style>
