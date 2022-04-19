<template>
  <div>
    <NavBar title="选择功能" right-icon="none" border @back="goBack" />
    <div class="m17">
      <van-cell-group>
        <van-cell
          title="电源开关"
          @click="$router.push({ name: 'ChoosePowerSwitch' })"
        />
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar/index.vue'

export default {
  components: { NavBar },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.m17 {
  margin-top: 17px;
}
</style>
