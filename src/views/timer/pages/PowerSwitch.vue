<template>
  <div>
    <NavBar title="开关" right-icon="none" border @back="goBack" />
    <div class="m17">
      <van-cell-group>
        <van-cell title="开启" @click="chooseOn" />
        <van-cell title="关闭" @click="chooseOff" />
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar/index.vue'
import { mapMutations } from 'vuex'
export default {
  components: { NavBar },

  methods: {
    ...mapMutations(['setTimer']),
    goBack() {
      this.$router.back()
    },
    chooseOn() {
      this.setTimer({
        powerstate: 1
      })
      this.$router.go(-2)
    },
    chooseOff() {
      this.setTimer({
        powerstate: 0
      })
      this.$router.go(-2)
    }
  }
}
</script>
<style lang="less" scoped>
.m17 {
  margin-top: 17px;
}
</style>
