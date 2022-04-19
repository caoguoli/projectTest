<template>
  <div v-if="show" class="container">
    <div class="container-content">
      <div class="icon-wrap">
        <i class="iconfont icon-offline"></i>
      </div>
      <div class="offlineTitle">{{ $t('offline.title') }}</div>
      <div class="offlineTextContainer">
        <div class="offlineText">
          <div>{{ $t('offline.h1') }}</div>
        </div>
      </div>
      <div class="off-content">
        <div class="p">· {{ $t('offline.p1') }}</div>
        <div v-if="productTypeGetters !== 'wifi'" class="p">
          · {{ $t('offline.p2') }}
        </div>
        <div v-if="productTypeGetters === 'wifi'" class="p">
          · {{ $t('offline.p3') }}
        </div>
        <div v-if="productTypeGetters === 'combo'" class="p">
          · {{ $t('offline.p4') }}
        </div>
      </div>
      <div class="back-btn" @click="() => backHome()">
        {{ $t('offline.back') }}
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
      console.log('设备离线----', this.$mx)
      this.$mx.page.closeWebView()
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
    margin-bottom: 25px;
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
  .back-btn {
    width: 100%;
    height: 44px;
    border-radius: 22px;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    color: #fff;
    display: flex;
    background: @primary;
  }
  .off-content {
    width: 100%;
    line-height: 2;
    margin-bottom: 20px;
    .p,
    .t {
      font-family: PingFangSC-Regular, PingFang SC;
      color: @text-secondary;
      line-height: 24px;
      text-align: justify;
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
