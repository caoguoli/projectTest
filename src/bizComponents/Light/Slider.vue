<template>
  <div class="light-handle-item-wrap">
    <div class="light-handle-item">
      <div>{{ title }}</div>
      <div>{{ `${localValue}${unit}` }}</div>
    </div>
    <div
      ref="slider"
      class="slider-wrap"
      @touchmove.stop="event => handleAnimation(event, 'touchmove')"
      @touchend.stop="event => handleAnimation(event, 'touchend')"
    >
      <div class="item" :style="{ width: `${localValue}%` }"></div>
    </div>
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
export default {
  name: 'Slider',
  props: {
    value: {
      type: Number,
      required: true
    },
    title: {
      default: '',
      type: String
    },
    label: {
      default: '',
      type: String
    },
    min: {
      default: 0,
      type: Number,
      required: true
    },
    max: {
      default: 100,
      type: Number,
      required: true
    },
    unit: {
      default: '',
      type: String
    }
  },

  data() {
    return {
      localValue: this.value,
      move: false
    }
  },
  watch: {
    value() {
      this.localValue = this.value
    }
  },
  mounted() {
    this.throttleEmit = throttle(() => {
      this.$emit('change', this.localValue)
    }, 200)
  },
  methods: {
    handleAnimation(event, action) {
      if (action === 'touchmove') {
        this.move = true
      }
      window.requestAnimationFrame(() => {
        if (this.move) {
          const width = this.getWidth(event.changedTouches[0].clientX)
          const percent = width / this.$refs.slider.clientWidth
          const value = parseInt(percent * (this.max - this.min) + this.min)
          this.localValue = value
          // this.$emit('change', this.localValue)
          this.throttleEmit()
          this.$emit('input', this.localValue)
        }

        if (action === 'touchend') {
          this.move = false
        }
      })
    },
    getWidth(width) {
      if (width < 0) {
        return 0
      }
      if (width >= this.$refs.slider.clientWidth) {
        return this.$refs.slider.clientWidth
      }
      return width
    }
  }
}
</script>
<style lang="less" scoped>
.light-handle-item-wrap {
  margin-bottom: 24px;
}

.light-handle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  padding-bottom: 8px;
}
.slider-wrap {
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  .item {
    width: 100px;
    height: 44px;
    background: #d8d8d8;
    border-radius: 8px;
  }
}
</style>
