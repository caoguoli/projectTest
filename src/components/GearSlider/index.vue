<template>
  <div class="slider-box">
    <div class="labels">
      <div v-for="item in items" :key="item.value" class="label">
        {{ item.label }}
      </div>
    </div>
    <div ref="slider">
      <van-slider
        v-model="sliderValue"
        :disabled="disabled"
        class="van-slider-style"
        :step="1"
        :min="0"
        :max="items.length - 1"
        active-color="#FFFFFF"
        inactive-color="rgba(255, 255, 255, 0.2)"
        bar-height="1px"
        @change="changeSlider"
      />
    </div>
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
      required: false
    },
    vanProps: {
      type: Object,
      default: () => ({})
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
  margin: 18px -8px 26px;
  .label {
    text-align: center;
  }
}
</style>
