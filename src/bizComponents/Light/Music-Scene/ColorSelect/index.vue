<template>
  <div>
    <ColorList ref="colorListRef" />
    <div class="title">颜色</div>
    <div
      ref="picker"
      style="background:linear-gradient(180deg, #FF0000 0%, #FF00C0 12%, #8D00FF 22%, #1100FF 34%, #068AFE 43%, #15EEEE 51%, #00F9FB 59%, #00FD25 69%, #FAF800 80%, #FF8900 90%, #FF0000 100%);"
      class="tone-picker"
      @touchstart.stop="event => addColor(event, v, index)"
    >
      <div
        v-for="(v, index) in dataSource"
        :key="index"
        :ref="`marker${index}`"
        :class="{
          marker: true,
          active: selectColor.index === index,
          'was-dragged': wasDragged
        }"
        :style="{
          transform: getTranslate(v.Saturation / 100, v.Hue / 360),
          ...getMarkerStyles(_options)
        }"
        tabindex="0"
        role="slider"
        @blur="onBlur"
        @touchstart.stop="event => start(event, v, index)"
      >
        <div class="num">
          {{ index + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import colorConversion from './helpers/colorConversion.js'
import Convert from 'color-convert'
import ColorList from './ColorList'
import { mapMutations, mapState, mapGetters } from 'vuex'
export default {
  components: {
    ColorList
  },
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
    ...mapState(['LightScene', 'selectColor']),
    ...mapGetters(['dataSource']),
    _options() {
      return {
        colorLeft: '#fd9',
        colorRight: '#9df',
        readOnly: false,
        marker: {
          radius: 16,
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
    }
  },
  watch: {
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
  },
  beforeDestroy() {
    window.removeEventListener('touchmove', this.move)
    window.removeEventListener('touchend', this.end)
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    ...mapMutations(['changeLightScene', 'changeSelectColor']),
    addColor(event) {
      const { x, y } = this.getRelativeEventPosition(event)
      const Hue = parseInt(y * 360)
      const Saturation = parseInt(x * 100)
      if (this.dataSource.length === 8) {
        return
      }
      this.$refs.colorListRef.add(Hue, Saturation)
      this.start(
        event,
        { Hue, Saturation, Value: 100 },
        this.dataSource.length - 1
      )
    },
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
    start(event, v, index) {
      this.changeSelectColor({ ...v, index })
      this.move(event, true)
      this.wasDragged = true
    },
    end(event) {
      this.move(event, true)
      this.wasDragged = false
    },
    onBlur() {
      this.wasDragged = false
    },
    move(event) {
      if (!this.wasDragged) {
        return
      }
      if (this.$options.animation.animationFrame) {
        return
      }
      this.$options.animation.animationFrame = window.requestAnimationFrame(
        () => {
          const { x, y } = this.getRelativeEventPosition(event)
          this.changeLightScene({
            ColorArr: this.LightScene.ColorArr.map((v, i) => {
              if (i === this.selectColor.index) {
                return {
                  Hue: parseInt(y * 360),
                  Saturation: parseInt(x * 100),
                  Value: v.Value
                }
              }
              return v
            })
          })
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
        'margin-left': `${-radius}px`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 12px;
  color: #fff;
  margin-bottom: 16px;
}
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
  border-radius: 50%;
  touch-action: none;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  &.active {
    border: 2px solid #fff;
  }
  &:focus {
    &.active,
    &.was-dragged {
      outline: none;
    }
    &:not(.active):not(.was-dragged) {
      outline-style: none;
      outline-offset: none;
      outline-width: none;
      background: rgba(0, 0, 0, 0.2);
    }
  }
  .num {
    position: absolute;
    top: 4px;
    left: 10px;
  }
}
</style>
