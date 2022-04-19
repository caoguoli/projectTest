<template>
  <div class="list-tpl-wrap" @click="$emit('click')">
    <div class="left-content">
      <i class="iconfont left-icon" :class="icon" :style="iconStyle"></i>
      <div class="name" :style="textStyle">{{ name }}</div>
    </div>
    <div>
      <slot name="right">
        <span class="subtitle" :style="subStyle">{{ subtitle }}</span>
        <i :style="subIcoStyle" class="iconfont right-icon icon-arrow-right"></i>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ListTpl',

  components: {},
  props: {
    icon: {
      type: String,
      default: '',
      required: true
    },
    name: {
      type: String,
      default: '',
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    iconStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    textStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    subStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    subIcoStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },

  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>
<style lang="less" scoped>
.list-tpl-wrap {
  height: 64px;
  padding:0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-content {
    display: flex;
    align-items: center;
  }
  .left-icon {
    color: #0db983;
    font-size: 24px;
  }
  .subtitle{
    color: #97AFB9;
  }
  .right-icon {
    color: #bfbfbf;
    font-size: 15px;
  }
  .name {
    font-size: 17px;
    color: #fff;
    line-height: 24px;
    margin-left: 21px;
  }
}
</style>
