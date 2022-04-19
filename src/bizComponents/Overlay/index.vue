<template>
  <div>
    <div v-if="show">
      <van-overlay :show="show" class="overlay" @click="changeShow">
        <div class="picture fadeOutLeft">
          <img class="pic" :src="handImg" />
        </div>
        <div class="wrapper">
          <div class="top">左右滑动空白区域</div>
          <div class="bottom">
            {{ desc }}
          </div>
        </div>
        <div class="button">
          <div class="text">试一试</div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    desc: {
      type: String,
      default: '可切换TDS显示'
    }
  },
  data() {
    return {
      handImg: require('./Hand@2x.png'),
      show: false,
      lastname: ''
    }
  },
  created() {
    localStorage.getItem('overLaykey') === 'used'
      ? (this.show = false)
      : (this.show = true)
  },
  methods: {
    changeShow() {
      this.show = false
      if (this.$mx.query.isOwner !== '2') {
        localStorage.setItem('overLaykey', 'used')
      }
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes fadeOutLeft {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
    transform: translate3d(-20%, 0, 0);
  }
}

.fadeOutLeft {
  animation-name: fadeOutLeft;
  animation-duration: 1.6s;
  animation-timing-function: cubic-bezier(0.36, 0.12, 0.21, 1);
  animation-iteration-count: infinite;
}
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 428px;
  margin-left: 115px;
  width: 150px;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100vh;
  z-index: 10000002;
}

.pic {
  position: absolute;
  height: 202px;
  margin-left: 253px;
  margin-top: 311px;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  margin-left: 128px;
  width: 120px;
  height: 44px;
  border-radius: 22px;
  border: 1px solid #ffffff;
}
.bottom {
  margin-top: 3px;
}
</style>
