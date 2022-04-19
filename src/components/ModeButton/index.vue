<template>
  <div class="mode-button" :class="{ disabled: disabled }" @click="onClick">
    <div
      class="mode-button-icon"
      :class="{
        active: active,
        border: activeType === 'border',
        background: activeType === 'background'
      }"
    >
      <i :class="`iconfont ${icon}`"></i>
    </div>
    <div v-if="text" class="mode-button-text">{{ text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
      required: true
    },
    active: {
      type: Boolean,
      default: false,
      required: false
    },
    text: {
      type: String,
      default: '',
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    activeType: {
      type: String,
      default: 'background',
      required: false
    }
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return
      }
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.mode-button {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  &-icon {
    background: rgba(255, 255, 255, 0.1);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    i {
      font-size: 20px;
    }
    &-active {
      background: #33d1ff;
    }
  }
  .mode-button-icon.active.background {
    background: #33d1ff;
  }
  .mode-button-icon.active.border {
    border: 2px solid #33d1ff;
  }

  &-text {
    height: 16px;
    font-size: 12px;
    margin-top: 11px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 16px;
  }
}
.mode-button.disabled {
  opacity: 0.1;
}
</style>
