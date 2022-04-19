<template>
  <!-- :is-hex="true"-->
  <App :need-off-line="needOffLine" />
</template>

<script>
import App from '@/views/App'
import { mapState } from 'vuex'

export default {
  components: {
    App
  },
  data() {
    return {
      needOffLine: true
    }
  },
  computed: {
    ...mapState(['LightScene'])
  },
  watch: {
    LightScene() {
      const whiteList = ['/NewMusciScene', '/music-rhythm']
      // 如果在音乐律动的时候 && enable开启的时候
      if (whiteList.includes(this.$route.path) && this.LightScene.Enable) {
        this.needOffLine = false
      } else {
        this.needOffLine = true
      }
    }
  }
}
</script>
