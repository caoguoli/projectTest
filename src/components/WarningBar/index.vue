<template>
  <div v-show="show" class="warning-bar-wrap" :class="type" @click="totalClick">
    <div class="warning-text-wrap">
      <i
        v-if="type === 'error'"
        class="iconfont icon-tips"
        :style="leftIconStyle"
      ></i>
      <van-swipe
        :autoplay="4000"
        :show-indicators="false"
        vertical
        class="custom-swipe"
      >
        <van-swipe-item
          v-for="(v, i) in dataSource"
          :key="i"
          class="warning-text"
          :style="contentStyle"
        >
          {{ v }}
        </van-swipe-item>
      </van-swipe>
    </div>
    <div v-if="type === 'error'" @click="failClick">
      <i
        class="iconfont icon-small_cancel"
        :class="rightIcon"
        :style="cancelIconStyle"
      ></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WarningBar',
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
    leftIconStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    contentStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    cancelIconStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rightIcon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'error'
    }
  },

  data() {
    return {
      show: false
    }
  },

  computed: {},
  watch: {
    dataSource() {
      if (this.dataSource.length > 0) {
        this.show = true
      } else {
        this.show = false
      }
    }
  },
  mounted() {
    if (this.dataSource.length > 0) {
      this.show = true
    } else {
      this.show = false
    }
  },
  methods: {
    failClick() {
      this.show = false
    },
    totalClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="less" scoped>
.warning-bar-wrap {
  height: 40px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background: #ffdada;
  color: #ff5b5e;
  width: 100%;
  z-index: 1;
}
.warning-bar-wrap.warning {
  color: #fc5e31;
  background: #ffe5de;
}
.icon-tips {
  font-size: 20px;
  color: #ff5b5e;
}
.icon-small_cancel {
  font-size: 20px;
  color: #b5b5b5;
}
.warning-text-wrap {
  display: flex;
  align-items: center;
}
.warning-text {
  margin-left: 8px;
  height: 40px;
  line-height: 40px;
}
.custom-swipe {
  height: 40px;
  width: 100%;
}
</style>
