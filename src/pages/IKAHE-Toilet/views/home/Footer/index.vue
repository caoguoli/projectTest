<template>
  <div class="footer flex">
    <div class="btn">
      <div class="circle flex" @click="closePower"><i class="iconfont icon-switch"></i></div>
      <p>待机</p>
    </div>

    <ALertModal :show="modalShow" @cancelClick="cancelModal" @sureClick="sureModal" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
// import HEX from '../hex.json'
// import ilop2hex from '@/utils/MXSMART/tools/ilop2hex'
import ALertModal from '../../../components/AlertModal'
export default {
  components: {
    ALertModal
  },
  data() {
    return {
      modalShow: false,
    }
  },
  computed: {
    ...mapState(['deviceData'])
  },
  created() {
    
  },
  methods: {
    ...mapMutations(['changeDeviceData']),
     setHSVColorFunc(list) {
      const data = list
      // const hex = ilop2hex(data, HEX)
      console.warn('data-->',JSON.stringify(data));
      // console.warn('hex-->',hex);
      this.$mx.device.setProperties({
        data,
        // hex
      })
    },
    closePower(){
      this.modalShow = true;
    },
    cancelModal(){
      this.modalShow = false;
    },
    sureModal(){
      this.modalShow = false;
      this.$emit('losePowerClick')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/less/public.less';
.footer{
  width: 100%;
  height: 122px;
  background: rgba(255, 255, 255, 0.1);
  .btn{
    text-align: center;
    .circle{
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 1px solid #fff;
      i{
        font-size: 30px;
      }
    }
    p{
      margin-top: 10px;
    }
  }
}
</style>
