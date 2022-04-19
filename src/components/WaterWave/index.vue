<template>
  <div class="water-circle">
    <div class="water-circle-inner">
      <div class="wave"></div>
      <!-- <div
        class="water-wave1"
        :style="circleColor[currentStatus].wave1Color"
      ></div>
      <div
        class="water-wave2"
        :style="circleColor[currentStatus].wave2Color"
      ></div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    circleColor: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    },
    currentStatus: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.water-circle {
  position: absolute;
  top: 0px;
  left: 88px;
  height: 200px;
  width: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.water-circle-inner {
  position: relative;
  height: 185px;
  width: 185px;
  border-radius: 50%;
  overflow: hidden;
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
}
.wave {
  position: relative;
  width: 200px;
  height: 200px;
  // background-color: rgb(118, 218, 255);
  border-radius: 50%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    top: 170%;
    left: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 35%;
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 6s linear infinite;
    z-index: 10;
  }

  &::after {
    border-radius: 35%;
    background-color: rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 10s linear infinite;
    z-index: 20;
  }
}

@keyframes rotate {
  50% {
    transform: translate(-50%, -73%) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -70%) rotate(360deg);
  }
}
.water-wave1 {
  position: absolute;
  top: 65%;
  left: -35%;
  width: 180%;
  height: 180%;
  border-radius: 33%;
  animation: 10s linear infinite water-wave;
  -webkit-animation: 10s linear infinite water-wave;
}
.water-wave2 {
  position: absolute;
  top: 65%;
  left: -35%;
  width: 180%;
  height: 180%;
  border-radius: 33%;
  animation: 13s linear infinite water-wave;
  -webkit-animation: 13s linear infinite water-wave;
}
@keyframes water-wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes water-wave {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
