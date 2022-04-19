<template>
  <div v-if="show" class="container">
    <div class="container-content">
      <div class="icon-wrap">
        <i class="iconfont icon-offline"></i>
      </div>
      <div class="offlineTitle">{{ $t('loadError.title') }}</div>
      <div class="off-content">
        <div class="p">{{ $t('loadError.check') }}</div>
      </div>
      <div class="button-wrap">
        <van-button class="button-left" type="default" @click="backHome">{{ $t('loadError.back') }}</van-button>
        <van-button class="button-right" type="default" @click="reload">{{ $t('loadError.reload') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      required: false
    },
    color: {
      type: String,
      default: '#ff5a28'
    }
  },
  computed: {
    productTypeGetters() {
      return this.$mx.productType
    }
  },
  methods: {
    backHome() {
      this.$mx.page.closeWebView()
    },
    reload() {
      window.location.reload()
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  position: fixed;
  flex: 1;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000002;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  &-content {
    flex-direction: column;
    display: flex;
    width: 305px;
    padding: 20px 27px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 1);
    .icon-wrap {
      background: rgba(246, 246, 245);
      border-radius: 50%;
      width: 80px;
      height: 80px;
      overflow: hidden;
    }
    .icon-offline {
      font-size: 80px;
      color: @primary;
    }
  }
  .offlineTitle {
    margin-top: 15px;
    margin-bottom: 12px;
    font-size: 17px;
    color: @text-primary;
  }

  .offlineTextContainer {
    width: 100%;
  }
  .offlineText {
    margin-bottom: 20px;
    font-size: 14px;
    color: @text-primary;
    line-height: 14px;
  }
  .button-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .back-btn,
  .retry-btn {
    width: 120px;
    height: 44px;
    border-radius: 22px;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    display: flex;
  }
  .back-btn {
    background: @primary;
    color: #fff;
  }
  .retry-btn {
    margin-left: 16px;
    color: @text-secondary;
    border: 1px solid @text-secondary;
  }

  .button-wrap {
    display: flex;
    justify-content: space-around;
    .button-left {
      width: 120px;
      height: 44px;
      background: rgba(245, 245, 245, 1);
      border-radius: 44px;
      font-size: 17px;
      font-weight: 400;
      color: rgba(24, 59, 86, 1);
      line-height: 17px;
      letter-spacing: 1px;
      margin-right: 16px;
      border: none;
    }
    .button-right {
      width: 120px;
      height: 44px;
      background: rgba(51, 209, 255, 1);
      border-radius: 44px;
      font-size: 17px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 17px;
      letter-spacing: 1px;
      border: none;
    }
  }
  .off-content {
    width: 100%;
    line-height: 2;
    margin-bottom: 30px;
    .p,
    .t {
      font-family: PingFangSC-Regular, PingFang SC;
      color: @text-secondary;
      line-height: 24px;
      text-align: center;
    }
    .t {
      font-size: 14px;
      line-height: 14px;
      margin: 15px 0 10px;
    }
    .p {
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
