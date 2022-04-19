<template>
  <div
    class="light-main"
    :class="[power, small]"
    :style="[
      {
        background: `no-repeat center url(${imgUrl}),no-repeat center url(${coldUrl})`
      },
      {
        'background-size': `${(brightness / 100) * 50 + 50}% ${(brightness /
          100) *
          50 +
          50}%`
      }
    ]"
  >
    <div
      class="light-img"
      :style="{
        filter: `brightness(${(brightness / 100) * 0.5 + 0.5})`,
        'background-color': `${getWhiteModeRGB(colorTemperature)}`
      }"
    ></div>
    <img src="./assets/icon-light.png" />
  </div>
</template>
<script>
import RevertKelvin from 'kelvin-to-rgb'

export default {
  name: 'ColdWarmLight',

  components: {},
  props: {
    colorTemperature: {
      default: 50,
      type: Number,
      required: true
    },
    brightness: {
      default: 50,
      type: Number,
      required: true
    },
    power: {
      default: 'on',
      type: String,
      required: true
    }
  },

  data() {
    return {
      small: ''
    }
  },

  computed: {
    imgUrl() {
      return require(`./assets/halo-warm.png`)
    },
    coldUrl() {
      return require(`./assets/halo-cold.png`)
    }
  },
  mounted() {
    if (window.screen.height <= 640) {
      this.small = 'small'
    }
  },

  methods: {
    getWhiteModeRGB() {
      const RGB = RevertKelvin(
        this.transformRGB(
          2700,
          6500,
          1500,
          10000,
          2700 + this.colorTemperature * 38
        )
      )
      const opacity = 0.5 + 0.5 * (this.brightness / 100)
      return `rgba(${RGB[0]},${RGB[1]},${RGB[2]},${opacity})`
    },
    transformRGB(min, max, baseMin, baseMax, value) {
      /**
       * 为了有切换冷暖的效果
       * min 业务 max 业务
       * baseMin = 1500
       * baseMax = 40000
       * value 当前值
       */
      // 参考 https://mattdesl.github.io/kelvin-to-rgb/
      return min + (baseMax - baseMin) * ((value - min) / (max - min))
    }
  }
}
</script>
<style lang="less" scoped>
.light-main {
  width: 290px;
  height: 290px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 40px;
    height: 40px;
    position: absolute;
  }
}
.light-main.small {
  width: 250px;
  height: 250px;
}
.light-img {
  width: 125px;
  height: 125px;
  border-radius: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.light-main.off {
  background: none !important;
  .light-img {
    background: transparent !important;
    border: 1px solid #eee;
    filter: brightness(0.5) !important;
  }
}
</style>
