<template>
  <div>
    <span
      class="switch"
      :class="{ 'switch-on': isChecked }"

      :value="value"
      :style="[{ position: 'relative', '--color': theme, '--beforeColor': defaultColor}]"
      @click="toggle"
    >
    </span>
  </div>
</template>
<script>
export default {
  props: {
    theme: {
      type: String || undefined,
      default: undefined
    },
    // 非受控
    value: {
      type: Boolean,
      default: true
    },
    // 受控
    controlValue: {
      type: Boolean,
      default: undefined
    },
    defaultColor: {
      type: Boolean,
      default: undefined
    },
  },
  data() {
    return {
      localValue: this.value
    }
  },

  computed: {
    isChecked() {
      return this.controlValue !== undefined
        ? this.controlValue
        : this.localValue
    }
  },
  methods: {
    toggle(event) {
      event.stopPropagation()
      if (this.controlValue === undefined) {
        this.localValue = !this.localValue
      }
      this.$emit('submitChange', this.localValue)
    }
  }
}
</script>

<style lang="less" scoped>
.switch {
  display: block;
  position: relative;
  width: 52px;
  height: 28px;
  outline: 0;
  border-radius: 14px;
  box-sizing: border-box;
  background-color: #dfdfdf;
  transition: 0.1s;
  cursor: pointer;
}
.switch:before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  width: 52px;
  height: 28px;
  border-radius: 14px;
  // background: #4679AB;
  background: var(--beforeColor);;
  transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.switch:after {
  content: ' ';
  position: absolute;
  top: 6px;
  left: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #fff;
  transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.switch-on {
  background-color: #effcef;
}
.switch-on:before {
  background-color: var(--color);
}
.switch-on:after {
  top: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  background-color: #ffffff;
  transform: translateX(21px);
}
</style>
