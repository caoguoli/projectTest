<template>
  <div v-if="show" class="container" @click.stop="backHome">
    <div class="container-content">
      <!-- <div class="icon-wrap">
        <i class="iconfont icon-offline"></i>
      </div> -->
      <div class="offlineTitle">{{ title }}</div>
      <div class="off-content">
        <div class="p">{{ subtitle }}</div>
      </div>
      <div class="button-wrap">
        <van-button class="button-left" type="default" @click="backHome">取消</van-button>
        <van-button class="button-right" type="default" @click="reload">确定</van-button>
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
    title: {
      type: String,
      default: '待机',
      required: false
    },
    subtitle: {
      type: String,
      default: '是否关闭马桶的智能控制页面？',
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
      this.$emit('cancelClick')
    },
    reload() {
      this.$emit('sureClick')
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
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  &-content {
    flex-direction: column;
    display: flex;
    width: 305px;
    padding: 25px;
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
    font-size: 18px;
    margin-bottom: 20px;
    font-size: 17px;
    color: #183B56;
    font-weight: 500;
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
      font-size: 17px !important;
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
      font-size: 17px !important;
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
      color: #183B56;
      font-weight: 400;
      line-height: 24px;
      text-align: center;
    }
    .t {
      font-size: 14px;
      line-height: 14px;
      margin: 15px 0 10px;
    }
    .p {
      font-size: 16px;
      line-height: 20px;
    }
  }
}
</style>
