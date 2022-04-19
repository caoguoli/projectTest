<template>
  <div>
    <div
      class="navbar"
      :class="{ 'navbar-theme-transparent': theme === 'transparent' }"
      :style="
        (border ? `border-bottom: 1px solid #f5f5f5;` : '') +
          (background ? `background-color:${background};` : '') +
          `padding-top:${top}px;` +
          `height: ${46 + top}px`
      "
    >
      <div class="left-content" :style="leftContentStyle" @click="onBack">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="title-content" :style="titleContentStyle">
        <slot name="title"></slot>
        {{ title }}
      </div>
      <div
        class="right-content"
        :style="rightContentStyle"
        @click="onRightClick"
      >
        <slot name="right"></slot>
        <i v-if="rightIcon !== 'none'" class="iconfont" :class="rightIcon"></i>
      </div>
    </div>
    <div class="narbar-empty" :style="`margin-top:${top}px;`"></div>
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false,
      required: false
    },
    title: {
      type: String,
      default: '',
      required: false
    },
    theme: {
      type: String,
      default: 'default',
      required: false
    },
    rightIcon: {
      type: String,
      default: 'icon-menu',
      required: false
    },
    leftContentStyle: {
      type: String,
      default: '',
      required: false
    },
    titleContentStyle: {
      type: String,
      default: '',
      required: false
    },
    rightContentStyle: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      top: 0
    }
  },
  created() {
    this.getBarHeight()
  },
  methods: {
    getBarHeight() {
      this.$mx.page.getBarHeight({}, res => {
        if (res.top) {
          this.top = res.top
        }
      })
    },
    onBack() {
      this.$emit('back')
    },
    onRightClick() {
      this.$emit('rightClick')
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 46px;
  display: flex;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  color: #000;
  background: #fff;
  align-items: center;
  padding-left: 17px;
  padding-right: 17px;
  line-height: 1;
  background: #fff;
  z-index: 10000000;

  .left-content,
  .right-content {
    width: 20%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .left-content {
    text-align: left;
    i {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  }
  .title-content {
    flex: 1;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    font-size: 18px;
  }
  .right-content {
    text-align: right;
    i {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }
}
.navbar-theme-transparent {
  background: transparent;
  //background: #15305a;
  color: #fff;
}
.narbar-empty {
  width: 100vw;
  height: 46px;
}
</style>
