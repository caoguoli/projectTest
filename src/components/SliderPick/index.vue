<template>
  <div class="slider-box">
    <div v-if="icon || text" class="slider-box-title">
      <div v-if="icon" class="slider-box-title-icon">
        <i :class="`iconfont ${icon}`"></i>
      </div>
      <div v-if="text" class="slider-box-title-text">{{ text }}</div>
    </div>

    <div v-if="textPosition === 'up'" class="labels">
      <div v-for="item in items" :key="item.value" class="label">
        {{ item.label }}
      </div>
    </div>

    <div ref="slider">
      <van-slider
        v-model="sliderValue"
        :disabled="disabled"
        :step="1"
        :min="0"
        :max="items.length - 1"
        :active-color="activeColor"
        :inactive-color="inActiveColor"
        :bar-height="barHeight"
        @change="changeSlider"
      />
    </div>

    <div v-if="textPosition === 'down'" class="labels">
      <div v-for="item in items" :key="item.value" class="label">
        {{ item.label }}
      </div>
    </div>
    <div v-if="textPosition === 'down'" class="line"></div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true
    },
    value: {
      type: Number,
      default: 1,
      required: false
    },
    icon: {
      type: String,
      default: '',
      required: true
    },
    text: {
      type: String,
      default: '',
      required: true
    },
    textPosition: {
      type: String,
      default: 'down',
      required: false
    },
    activeColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.2)',
      required: false
    },
    inactiveColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.2)',
      required: false
    },
    barHeight: {
      type: String,
      default: '4px',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      sliderValue: 0,
      sliderWidth: 0,
      slider: null, //滚动条DOM元素
      thumb: null //拖拽DOM元素
    }
  },
  watch: {
    value(newVal) {
      this.sliderValue = newVal
    },
    brightness(newVal) {
      this.$emit('input', newVal)
    }
  },

  mounted() {
    this.sliderValue = this.value
    this.min = 0
    this.max = this.items.length - 1
    this.slider = this.$refs.slider

    this.sliderWidth = this.slider.offsetWidth
  },

  methods: {
    changeSlider(v) {
      this.$emit('change', v)
    }
  }
}
</script>
<style lang="less" scoped>
.slider-box {
  &-title {
    margin-left: -8px;
    margin-bottom: 24px;
    height: 20px;
    display: flex;
    align-items: center;
    &-icon {
      i {
        font-size: 20px;
      }
      margin-right: 6px;
    }
    &-text {
      font-size: 12px;
      font-weight: 400;
      color: rgba(24, 59, 86, 1);
    }
  }
}

.labels {
  color: #97afb9;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  margin: 18px auto 26px;
  .label {
    text-align: center;
  }
}
.line {
  height: 1px;
  box-shadow: 0px 0px 0px 0px rgba(225, 228, 232, 1);
  background: #e1e4e8;
  margin-bottom: 10px;
  margin-left: -10px;
  width: calc(100% + 20px);
}
</style>
