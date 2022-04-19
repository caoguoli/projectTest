<template>
  <div class="circle-slider-wrap">
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="inner-color" :style="{ background: colorModeRGB }">
        <img src="../assets/icon-light.png" />
      </div>
    </transition>
    <svg
      ref="_svg"
      :width="side + 'px'"
      :height="side + 'px'"
      :viewBox="'0 0 ' + side + ' ' + side"
      @touchmove="handleTouchMove"
      @click="handleClick"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <!-- 渐变 -->
      <defs>
        <pattern id="fill-img" patternUnits="userSpaceOnUse" width="242" height="242">
          <image xlink:href="../assets/image_IPL.png" x="0" y="0" width="242" height="242" />
        </pattern>
      </defs>

      <defs>
        <filter
          id="dropshadow"
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dx="0" dy="0" result="offsetblur" />
          <feDropShadow data-v-89a03a02 dx="0" dy="0" flood-opacity="0.5" stdDeviation="10" />
        </filter>
      </defs>
      <g>
        <circle
          stroke="url(#fill-img)"
          fill="none"
          :stroke-width="cpMainCircleStrokeWidth"
          :cx="cpCenter"
          :cy="cpCenter"
          :r="radius"
        />
        <path :stroke="progressColor" fill="none" :stroke-width="cpPathStrokeWidth" :d="cpPathD" />
        <circle
          :fill="knobColor"
          :r="cpKnobRadius"
          :cx="cpPathX"
          :cy="cpPathY"
          stroke="white"
          stroke-width="0"
          style="filter:url(#dropshadow)"
        />
        <!-- TODO: 变成line 两边是圆的 -->
        <!-- <line
          x1="0"
          x2="0"
          y1="0"
          y2="0"
          :stroke="knobColor"
          stroke-width="20"
          stroke-linecap="round"
          style="filter:url(#dropshadow)"
        />-->
      </g>
    </svg>
  </div>
</template>
<script>
import TouchPosition from './helpers/touch_position'
import CircleSliderState from './helpers/circle_slider_state'
import Convert from 'color-convert'
import throttle from 'lodash/throttle'

export default {
  name: 'CircleSlider',
  props: {
    hsv: {
      default: () => ({}),
      type: Object
    },
    minAngle: {
      type: Number,
      required: false,
      default: (Math.PI / 2) * 3
    },
    innerColorStyle: {
      type: Object,
      default: () => ({})
    },
    startAngleOffset: {
      type: Number,
      required: false,
      default: function() {
        // return -Math.PI
        return 0
      }
    },
    value: {
      type: Number,
      required: false,
      default: 0
    },
    side: {
      type: Number,
      required: false,
      default: 242
    },
    stepSize: {
      type: Number,
      required: false,
      default: 1
    },
    min: {
      type: Number,
      required: false,
      default: 0
    },
    max: {
      type: Number,
      required: false,
      default: 100
    },
    circleColor: {
      type: String,
      required: false,
      default: '#334860'
    },
    progressColor: {
      type: String,
      required: false,
      default: 'transparent'
    },
    knobColor: {
      type: String,
      required: false,
      default: '#fff'
    },
    knobRadius: {
      type: Number,
      required: false,
      default: 20
    },
    knobRadiusRel: {
      type: Number,
      required: false,
      default: 7
    },
    circleWidth: {
      type: Number,
      required: false,
      default: 40
    },
    circleWidthRel: {
      type: Number,
      required: false,
      default: 20
    },
    progressWidth: {
      type: Number,
      required: false,
      default: null
    },
    progressWidthRel: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      steps: null,
      stepsCount: null,
      radius: 0,
      angle: 0,
      currentStepValue: 0,
      mousePressed: false,
      circleSliderState: null,
      mousemoveTicks: 0,
      isLock: false
    }
  },
  computed: {
    colorModeRGB() {
      const { Hue, Saturation, Value } = this.hsv
      const result = Convert.hsv.rgb(Hue, Saturation, Value)
      return `rgb(${result[0]},${result[1]},${result[2]})`
    },
    // cpStartAngleOffset () {
    //   if (!this.minStepLimit) {
    //     return 0
    //   }
    // },
    cpCenter() {
      return this.side / 2
    },
    cpZeroPosition() {
      return {
        x: this.cpCenter + this.radius * Math.cos(this.minAngle),
        y: this.cpCenter + this.radius * Math.sin(this.minAngle)
      }
    },
    cpAngle() {
      return this.angle + this.minAngle
    },
    cpMainCircleStrokeWidth() {
      return this.circleWidth || this.side / 2 / this.circleWidthRel
    },
    cpPathDirection() {
      return this.angle + Math.PI / 2 < (3 / 2) * Math.PI ? 0 : 1
    },
    cpPathX() {
      return this.cpCenter + this.radius * Math.cos(this.cpAngle)
    },
    cpPathY() {
      return this.cpCenter + this.radius * Math.sin(this.cpAngle)
    },
    cpPathStrokeWidth() {
      return this.progressWidth || this.side / 2 / this.progressWidthRel
    },
    cpKnobRadius() {
      return this.knobRadius || this.side / 2 / this.knobRadiusRel
    },
    cpPathD() {
      const parts = []
      parts.push('M' + this.cpZeroPosition.x)
      parts.push(this.cpZeroPosition.y)
      parts.push('A')
      parts.push(this.radius)
      parts.push(this.radius)
      parts.push(0)
      parts.push(this.cpPathDirection)
      parts.push(1)
      parts.push(this.cpPathX)
      parts.push(this.cpPathY)
      return parts.join(' ')
    }
  },
  watch: {
    value(val) {
      if (this.isLock) return
      this.updateFromPropValue(val)
    }
  },
  created() {
    this.stepsCount = 1 + (this.max - this.min) / this.stepSize
    this.steps = Array.from(
      {
        length: this.stepsCount
      },
      (_, i) => this.min + i * this.stepSize
    )

    this.circleSliderState = new CircleSliderState(
      this.steps,
      this.startAngleOffset,
      this.value
    )
    this.angle = this.circleSliderState.angleValue
    this.currentStepValue = this.circleSliderState.currentStep
    const maxCurveWidth = Math.max(
      this.cpMainCircleStrokeWidth,
      this.cpPathStrokeWidth
    )
    this.radius =
      this.side / 2 - Math.max(maxCurveWidth, this.cpKnobRadius * 2) / 2
    this.updateFromPropValue(this.value)
  },
  mounted() {
    this.throttleEmit = throttle(() => {
      this.$emit('change', this.currentStepValue)
    }, 200)

    this.touchPosition = new TouchPosition(
      this.$refs._svg,
      this.radius,
      this.radius / 2,
      this.minAngle
    )
  },
  methods: {
    /*
     */
    fitToStep(val) {
      return Math.round(val / this.stepSize) * this.stepSize
    },

    /*
     */
    handleClick(e) {
      this.touchPosition.setNewPosition(e)
      if (this.touchPosition.isTouchWithinSliderRange) {
        const newAngle = this.touchPosition.sliderAngle
        this.animateSlider(this.angle, newAngle)
      }
    },

    /*
     */
    handleMouseDown(e) {
      e.preventDefault()
      this.mousePressed = true
      window.addEventListener('mousemove', this.handleWindowMouseMove)
      window.addEventListener('mouseup', this.handleMouseUp)
    },

    /*
     */
    handleMouseUp(e) {
      e.preventDefault()
      this.mousePressed = false
      window.removeEventListener('mousemove', this.handleWindowMouseMove)
      window.removeEventListener('mouseup', this.handleMouseUp)
      this.mousemoveTicks = 0
    },

    /*
     */
    handleWindowMouseMove(e) {
      e.preventDefault()
      if (this.mousemoveTicks < 5) {
        this.mousemoveTicks++
        return
      }

      this.touchPosition.setNewPosition(e)
      this.updateSlider()
    },

    /*
     */
    handleTouchMove(e) {
      this.$emit('touchmove')
      // Do nothing if two or more fingers used
      if (
        e.targetTouches.length > 1 ||
        e.changedTouches.length > 1 ||
        e.touches.length > 1
      ) {
        return true
      }

      const lastTouch = e.targetTouches.item(e.targetTouches.length - 1)
      this.touchPosition.setNewPosition(lastTouch)

      if (this.touchPosition.isTouchWithinSliderRange) {
        e.preventDefault()
        this.updateSlider()
      }
    },

    /*
     */
    updateAngle(angle) {
      this.circleSliderState.updateCurrentStepFromAngle(angle)
      this.angle = this.circleSliderState.angleValue
      this.currentStepValue = this.circleSliderState.currentStep
      this.throttleEmit()
      this.$emit('input', this.currentStepValue)
    },

    /*
     */
    updateFromPropValue(value) {
      const stepValue = this.fitToStep(value)
      this.circleSliderState.updateCurrentStepFromValue(stepValue)

      this.angle = this.circleSliderState.angleValue
      this.currentStepValue = stepValue
    },

    /*
     */
    updateSlider() {
      const angle = this.touchPosition.sliderAngle
      this.updateAngle(angle)
    },

    /*
     */
    animateSlider(startAngle, endAngle) {
      const direction = startAngle < endAngle ? 1 : -1
      // 这里之前是2，调整到2000是为了去掉动画效果的过度
      const curveAngleMovementUnit =
        direction * this.circleSliderState.angleUnit * 2000
      const animate = () => {
        if (
          Math.abs(endAngle - startAngle) < Math.abs(2 * curveAngleMovementUnit)
        ) {
          this.updateAngle(endAngle)
          this.isLock = false
        } else {
          const newAngle = startAngle + curveAngleMovementUnit
          this.updateAngle(newAngle)
          this.animateSlider(newAngle, endAngle)
          this.isLock = true
        }
      }

      window.requestAnimationFrame(animate)
    }
  }
}
</script>

<style lang="less" scoped>
.circle-slider-wrap {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 35px;
}
.inner-color {
  top: 50%;
  border-radius: 50%;
  margin-top: -62px;
  margin-left: -62px;
  left: 50%;
  width: 124px;
  height: 124px;
  background: #fadcaa;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 40px;
    height: 40px;
  }
}
</style>
