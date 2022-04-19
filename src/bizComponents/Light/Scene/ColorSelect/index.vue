<template>
  <div>
    <div
      ref="picker"
      style="background:linear-gradient(180deg, #FF0000 0%, #FF00C0 12%, #8D00FF 22%, #1100FF 34%, #068AFE 43%, #15EEEE 51%, #00F9FB 59%, #00FD25 69%, #FAF800 80%, #FF8900 90%, #FF0000 100%);"
      class="tone-picker"
      @touchstart="start"
      @mousedown="start"
    >
      <div
        ref="marker"
        :class="{ marker: true, active: dragActive, 'was-dragged': wasDragged }"
        :style="{
          background: currentColor,
          transform: translate,
          ...getMarkerStyles(_options)
        }"
        tabindex="0"
        role="slider"
        @blur="onBlur"
      ></div>
    </div>
  </div>
</template>

<script>
import colorConversion from './helpers/colorConversion.js'
import Convert from 'color-convert'

export default {
  mixins: [colorConversion],
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    brightness: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dragActive: false,
      wasDragged: false,
      marker: {
        x: 1,
        y: 1
      },
      frame: {
        minX: 0,
        maxX: 1,
        minY: 0,
        maxY: 1
      }
    }
  },
  computed: {
    _options() {
      return {
        colorLeft: '#fd9',
        colorRight: '#9df',
        readOnly: false,
        marker: {
          radius: 15,
          borderWidth: 2
        },
        ...this.getTypesafeAttr(this.options)
      }
    },
    currentColor() {
      const { x, y } = this.marker
      const Saturation = parseInt(x * 100)
      const Hue = parseInt(y * 360)
      const Value = this.brightness
      return Convert.hsv.hex(Hue, Saturation, Value)
    },
    translate() {
      return this.getTranslate(this.marker.x, this.marker.y)
    }
  },
  watch: {
    brightness() {
      const { x, y } = this.marker
      const Saturation = parseInt(x * 100)
      const Hue = parseInt(y * 360)
      this.$emit('input', {
        Saturation,
        Hue,
        Value: this.brightness
      })
    },
    currentColor() {
      const { x, y } = this.marker
      const Saturation = parseInt(x * 100)
      const Hue = parseInt(y * 360)
      this.$emit('input', {
        Saturation,
        Hue,
        Value: this.brightness
      })
    }
  },
  animation: {
    animationFrame: undefined,
    changeTimeout: undefined,
    hasChangedLately: false
  },
  mounted() {
    window.addEventListener('touchmove', this.move, { passive: false })
    window.addEventListener('touchend', this.end, { passive: true })
    window.addEventListener('resize', this.resize, { passive: true })
    setTimeout(this.resize, 0)
    // 初始化同步颜色值
    const { Hue, Saturation } = this.value
    this.marker.x = Saturation / 100
    this.marker.y = Hue / 360
  },
  beforeDestroy() {
    window.removeEventListener('touchmove', this.move)
    window.removeEventListener('touchend', this.end)
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    getTypesafeAttr(value) {
      try {
        if (typeof value === 'string') {
          return JSON.parse(value)
        } else {
          return value
        }
      } catch (error) {
        console.error(error)
      }
      console.error('unable to type convert attribute')
      return value
    },
    /*
			START MARKER POSITIONING
		*/
    start(event) {
      if (this._options.readOnly) {
        return
      }
      event.preventDefault()
      this.$refs.marker.focus()
      this.resize()
      this.dragActive = true
      this.move(event, true)
    },
    end(event) {
      if (this._options.readOnly) {
        return
      }
      this.move(event, true)
      this.dragActive = false
      this.wasDragged = true
    },
    onBlur() {
      this.wasDragged = false
    },
    move(event, noPrevent = false) {
      if (this._options.readOnly || !this.dragActive) {
        return
      }
      if (noPrevent !== true) {
        event.preventDefault()
      }
      if (this.$options.animation.animationFrame) {
        return
      }
      this.$options.animation.animationFrame = window.requestAnimationFrame(
        () => {
          const { x, y } = this.getRelativeEventPosition(event)
          this.marker.x = x
          this.marker.y = y
          this.$options.animation.animationFrame = undefined
        }
      )
    },
    resize() {
      if (!this.$refs.picker) {
        return
      }
      const boundingBox = this.$refs.picker.getBoundingClientRect()
      this.frame.minX = boundingBox.left
      this.frame.minY = boundingBox.top
      this.frame.maxX = boundingBox.right
      this.frame.maxY = boundingBox.bottom
      this.$forceUpdate()
    },
    _getEventPosition(event) {
      // mouse
      if (event.x !== undefined && event.y !== undefined) {
        return { x: event.x, y: event.y }
      }
      // touch
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      }
    },
    getRelativeEventPosition(event) {
      const { minX, maxX, minY, maxY } = this.frame
      const { x, y } = this._getEventPosition(event)
      const newX = Math.min(Math.max(minX, x), maxX)
      const newY = Math.min(Math.max(minY, y), maxY)
      return {
        x: (newX - minX) / (maxX - minX),
        y: 1 - (newY - minY) / (maxY - minY)
      }
    },
    getTranslate(posX, posY) {
      const frameX = this.frame.maxX - this.frame.minX
      const frameY = this.frame.maxY - this.frame.minY
      // // 限制滑动的区域
      const { radius, borderWidth } = this._options.marker
      const padding = radius + borderWidth
      if (posX < padding / frameX) {
        posX = padding / frameX
      }
      if (posX > 1 - padding / frameX) {
        posX = 1 - padding / frameX
      }
      if (posY < padding / frameY) {
        posY = padding / frameY
      }
      if (posY > 1 - padding / frameY) {
        posY = 1 - padding / frameY
      }
      const x = posX * frameX
      const y = -posY * frameY

      return `translate(${x}px, ${y}px)`
    },
    /*
			END MARKER POSITIONING
		*/
    getMarkerStyles(options) {
      const { radius, borderWidth } = options.marker
      return {
        padding: `${radius - borderWidth}px`,
        'margin-bottom': `${-radius}px`,
        'margin-left': `${-radius}px`,
        border: `${borderWidth}px solid #fff`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tone-picker {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 4px;
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    background: linear-gradient(to left, transparent 0%, #fff 100%);
    border-radius: 4px;
  }
}

.marker {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: inline-block;
  border: 2px solid var(-border-i, #fff);
  border-radius: 50%;

  &.active {
    background: #fff !important;
  }
  &:focus {
    &.active,
    &.was-dragged {
      outline: none;
    }
    &:not(.active):not(.was-dragged) {
      outline-style: dashed;
      outline-offset: 0.5rem;
      outline-width: 3px;
      background: #fff;
    }
  }
}
</style>
