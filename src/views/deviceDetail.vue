<template>
  <div class="device-detail">
    <NavBar
      :title="$t('deviceDetail.deviceDetail')"
      right-icon="none"
      border
      @back="goBack"
    />
    <div class="device-detail-card">
      <div class="device-detail-img">
        <img
          v-if="deviceImg"
          :src="deviceImg"
          alt=""
          style="width: 100%;height: 100%;"
        />
      </div>
      <div class="device-detail-box">
        <div class="device-name">{{ deviceName }}</div>
        <div v-if="activeTime" class="device-time">
          {{ $t('deviceDetail.time') }}: {{ activeTime }}
        </div>
      </div>
    </div>
    <div class="device-detail-list">
      <div
        v-for="(items, index) in detailList"
        :key="index"
        class="device-detail-cell"
        @click="items.action(items)"
      >
        <div class="device-detail-right">
          <div
            class="device-detail-title"
            :class="isOwner0(items) ? 'opacity' : ''"
          >
            {{ items.name }}
          </div>
          <div class="device-detail-content">{{ items.content }}</div>
        </div>
        <!-- 设备id不需要右箭头 -->
        <div
          v-if="!isOwner0(items)"
          v-show="items.rightIcon !== 'none'"
          class="device-detail-icon"
        >
          <div
            v-if="items.name === $t('deviceDetail.upgrade') && needUpdate"
            class="device-detail-circle"
          ></div>
          <i class="iconfont icon-arrow-right"></i>
        </div>
      </div>
    </div>
    <div class="device-detail-footer" @click="openUnbindModal">
      {{ $t('deviceDetail.deleteDevice') }}
    </div>
    <van-dialog
      v-model="editDialog"
      :title="$t('deviceDetail.changeName')"
      show-cancel-button
      :confirm-button-text="$t('common.confirm')"
      :cancel-button-text="$t('common.cancel')"
      @confirm="setDeviceNickName"
    >
      <div class="dialog-body">
        <div class="dialog-input-warp">
          <input
            ref="inputDom"
            v-model="deviceNameInput"
            class="dialog-input"
            type="text"
            :placeholder="$t('deviceDetail.pleaseEnterName')"
            maxlength="15"
          />
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
import { Dialog, Toast } from 'vant'
import dayjs from 'dayjs'

export default {
  components: {
    NavBar
  },

  data() {
    return {
      deviceNameInput: '',
      deviceImg: '',
      editDialog: false,
      iotId: '',
      homeId: '',
      needUpdate: true, // 是否需要升级
      productKey: '',
      deviceName: '',
      productName: '',
      roomName: this.$t('deviceDetail.noSet'), // 房间名称
      otaVersion: '', // 版本号
      activeTime: '', // 激活时间
      iLoopDeviceName: '',
      isOwner: '1',
      isGateway: '0',
      product_type: 0,
      share_type: 1,
      link_type_id: []
    }
  },
  computed: {
    isBle() {
      return [2, 3, 4].includes(this.product_type)
    },
    otaUpdateValue() {
      return this.needUpdate === true
        ? this.otaVersion
        : this.needUpdate === false
        ? this.$t('deviceDetail.UpToDate') + this.otaVersion
        : ''
    },
    detailList() {
      const isZgrill = this.product_type === 6 && this.link_type_id.includes(11)
      return [
        {
          name: this.$t('deviceDetail.deviceId'),
          content: this.iLoopDeviceName,
          action: items => this.copyDeviceId(items),
          rightIcon: 'none'
        },
        {
          name: this.$t('deviceDetail.room'),
          content: this.roomName,
          action: items => this.gotoPageHome(items)
        },
        {
          name: this.$t('deviceDetail.share'),
          content: '',
          action: items => this.gotoPageShare(items)
        },
        isZgrill && {
          name: this.$t('deviceDetail.netConnect'),
          content: '',
          action: items => this.goNetwork(items)
        },
        {
          name: this.$t('deviceDetail.feedback'),
          content: '',
          action: items => this.gotoPageFeedback(items)
        },
        {
          name: this.$t('deviceDetail.upgrade'),
          content: this.otaUpdateValue,
          action: items => this.gotoUpdate(items)
        },
        {
          name: this.$t('deviceDetail.changeName'),
          content: this.deviceName,
          action: items => this.gotoEdit(items)
        }
      ].filter(v => !!v)
    }
  },
  watch: {
    editDialog() {
      if (this.editDialog) {
        this.$nextTick(() => {
          this.$refs.inputDom.addEventListener('blur', this.scrollBack)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.inputDom.removeEventListener('blur', this.scrollBack)
        })
      }
    }
  },
  created() {
    this.productKey = parseUrl('productKey')
    this.homeId = parseUrl('homeId')
    this.iotId = parseUrl('iotId')
    this.isOwner = parseUrl('isOwner') // 字符串1 代表是自己的，否则是分享给别人的
    this.isGateway = parseUrl('isGateway') // 字符串1 代表是网关
  },
  mounted() {
    document.addEventListener('visibilitychange', this.refresh)
    this.deviceImg = this.$route.query.deviceImg
    this.compareVersion()
    this.getRoomName()
    this.getInfo()
    this.getByAccountAndDev()
    this.getProductInfo()
  },
  destroyed() {
    document.removeEventListener('visibilitychange', this.refresh)
  },
  methods: {
    copyDeviceId(items) {
      this.$copyText(items.content).then(() => {
        Toast(this.$t('deviceDetail.copySuccess'))
      })
    },
    scrollBack() {
      window.scrollTo(0, 0)
    },
    getProductInfo() {
      this.$mx.request.fetchOwnServer(
        {
          url: `app/v1/product/info`,
          method: 'GET',
          data: {
            product_key: this.productKey
          }
        },
        res => {
          if (+res.code === 0) {
            const { product_type, share_type, link_type_id } = res.data
            this.product_type = product_type
            this.share_type = share_type
            this.link_type_id = link_type_id
          }
        }
      )
    },
    isOwner0(items) {
      return (
        [this.$t('deviceDetail.share'), this.$t('deviceDetail.room')].includes(
          items.name
        ) && this.isOwner === '0'
      )
    },
    gotoEdit() {
      this.editDialog = true
    },
    getByAccountAndDev() {
      // 获取产品详情
      this.$mx.request.fetch(
        {
          url: '/uc/getByAccountAndDev',
          method: 'GET',
          data: { iotId: this.iotId },
          authType: 'iotAuth',
          version: '1.0.2'
        },
        res => {
          if (+res.code === 200 && res.data) {
            this.deviceImg = res.data.productImage || res.data.categoryImage
            this.deviceName = res.data.nickName || res.data.productName
            this.productName = res.data.deviceName || res.data.productName
            this.deviceNameInput = res.data.nickName || res.data.productName
          } else {
            Toast(res.message)
          }
        }
      )
    },
    refresh() {
      if (document.visibilityState === 'visible') {
        this.getInfo()
        this.getByAccountAndDev()
        this.compareVersion()
        this.getRoomName()
      }
    },
    setDeviceNickName() {
      const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi
      if (regStr.test(this.deviceNameInput)) {
        this.deviceNameInput = this.deviceNameInput.replace(regStr, '')
      }
      this.$mx.request.fetch(
        {
          url: '/uc/setDeviceNickName',
          method: 'GET',
          data: { iotId: this.iotId, nickName: this.deviceNameInput },
          authType: 'iotAuth',
          version: '1.0.2'
        },
        res => {
          if (+res.code === 200 && res.data) {
            Toast(this.$t('deviceDetail.modifySuccess'))
            this.getByAccountAndDev()
            this.editDialog = false
          } else {
            Toast(res.message)
          }
        }
      )
      this.$mx.request.fetchOwnServer({
        url: 'app/v1/device/updateNickname',
        method: 'PUT',
        data: { iotid: this.iotId, nickname: this.deviceNameInput }
      })
    },
    getRoomName() {
      this.$mx.device.getRoomInfo({}, res => {
        if (res !== 'noMethod') {
          this.roomName = res.roomName
          return
        }
        this.$mx.request.fetch(
          {
            url: '/living/home/element/query',
            method: 'GET',
            data: { homeId: this.homeId, pageNo: 1, pageSize: 20 },
            authType: 'iotAuth',
            version: '1.0.2'
          },
          res => {
            if (+res.code === 200 && res.data) {
              const { items } = res.data
              for (let i = 0; i < items.length; i++) {
                if (items[i].elementId === this.iotId) {
                  this.roomName = items[i].roomName
                  break
                }
              }
            }
          }
        )
      })
    },
    async getInfo() {
      return new Promise(resolve => {
        this.$mx.request.fetch(
          {
            url: '/thing/info/get',
            method: 'GET',
            data: { iotId: this.iotId },
            authType: 'iotAuth',
            version: '1.0.2'
          },
          res => {
            if (+res.code === 200 && res.data) {
              const info = res.data
              this.iLoopDeviceName = info.name
              // this.productKey = info.productKey
              const activeTime = info.activeTime || info.gmtCreate
              this.activeTime = activeTime
                ? dayjs(activeTime).format('YYYY-MM-DD')
                : ''
              this.otaVersion = info.firmwareVersion || ''
              resolve()
            }
          }
        )
      })
    },
    compareVersion() {
      this.$mx.request.fetch(
        {
          url: '/thing/ota/info/queryByUser',
          method: 'GET',
          data: { iotId: this.iotId },
          authType: 'iotAuth',
          version: '1.0.2'
        },
        res => {
          if (+res.code === 200 && res.data) {
            const { version, currentVersion } = res.data
            if (version !== currentVersion) {
              this.needUpdate = true
            } else {
              this.needUpdate = false
            }
          } else {
            this.needUpdate = false
          }
        }
      )
    },
    gotoUpdate() {
      if (this.isOwner !== '1') {
        return
      }
      if (!this.needUpdate) {
        Toast(this.$t('deviceDetail.UpToDate'))
        return
      }
      this.$mx.page.go({
        path: this.isBle ? this.$mx.APP_PATH.OTA_BLE : this.$mx.APP_PATH.OTA,
        query: {
          homeId: this.homeId,
          iotId: this.iotId,
          deviceName: this.deviceName,
          deviceImg: this.deviceImg
        }
      })
    },
    openUnbindModal() {
      Dialog.confirm({
        title: this.$t('deviceDetail.deleteDevice'),
        message: this.$t('deviceDetail.sureToUnbind'),
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel')
      })
        .then(() => {
          // https://mxchip.yuque.com/vbs9010/project/vvapgx#u1ChR
          this.$mx.request.fetch(
            this.isBle && this.isOwner === '1'
              ? {
                  url: '/awss/subdevice/unbind',
                  version: '1.0.7',
                  method: 'POST',
                  authType: 'iotAuth',
                  data: {
                    homeId: this.homeId,
                    productKey: this.productKey,
                    deviceName: this.productName
                  }
                }
              : {
                  url: '/uc/unbindAccountAndDev',
                  version: '1.0.8',
                  method: 'POST',
                  authType: 'iotAuth',
                  data: {
                    iotId: this.iotId,
                    homeId: this.homeId,
                    unbindSubdevice: false
                  }
                },
            res => {
              if (+res.code === 200) {
                Toast(this.$t('deviceDetail.unbindSuccess'))
                setTimeout(() => {
                  this.$mx.page.closeWebView({})
                }, 3000)
              } else {
                Toast(res.message)
              }
            }
          )
        })
        .catch(e => {
          console.log(e)
        })
    },
    goBack() {
      if (this.isGateway === '1') {
        this.$mx.page.closeWebView({})
      } else {
        this.$router.back()
      }
    },
    gotoPageHome(items) {
      if (this.isOwner0(items)) {
        return
      }
      this.$mx.page.go({
        path: this.$mx.APP_PATH.ROOM,
        query: {
          homeId: this.homeId,
          iotId: this.iotId
        },
        protocol: 'mxchip' // 默认是 https
      })
    },
    gotoPageShare(items) {
      if (this.isOwner0(items)) {
        return
      }
      if (this.share_type === 0) {
        return
      }
      this.$mx.page.go({
        path: this.$mx.APP_PATH.SHARE,
        query: {
          homeId: this.homeId,
          iotId: this.iotId
        }
      })
    },
    gotoPageFeedback() {
      this.$mx.page.go({
        path: this.$mx.APP_PATH.FEED_BACK,
        query: {
          homeId: this.homeId,
          iotId: this.iotId
        }
      })
    },
    goNetwork() {
      this.$mx.page.go({
        path: this.$mx.APP_PATH.SETWIFI,
        query: {
          iotId: this.iotId
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.device-detail {
  width: 100vw;
  .dialog {
    &-input-warp {
      display: flex;
      align-items: center;
      width: 255px;
      height: 50px;
      border-radius: 5px;
      margin: 0 auto;
      border: 1px solid #eeeeee;
    }
    &-input {
      outline: none !important;
      box-shadow: none !important;
      border: 0;
      width: 100%;
      display: block;
      padding: 0 17px;
      font-size: 17px;
    }
  }
  .dialog-body {
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    display: flex;
    align-items: center;
  }
  &-card {
    height: 100px;
    align-items: center;
    background-color: #fff;
    border-radius: 10px;
    margin: 17px;
    padding: 17px;
    display: flex;
  }
  &-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 44px;
  }
  &-img {
    width: 50px;
    height: 50px;
  }
  .device-name {
    color: #262626;
    font-size: 17px;
    margin-left: 17px;
  }
  .device-time {
    color: #595959;
    font-size: 12px;
    margin-left: 17px;
  }
  &-list {
    // margin-top: 10px;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 17px;
  }
  &-footer {
    margin: 17px;
    text-align: center;
    color: #ff4d4f;
    font-size: 17px;
    height: 50px;
    border-radius: 25px;
    background-color: #fff;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  .cell-disable {
    color: #c8c9cc !important;
    cursor: not-allowed;
  }
}
.device-detail-cell {
  height: 55px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.device-detail-title {
  font-size: 16px;
}
.device-detail-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}
.device-detail-content {
  text-align: right;
  color: #c8c9cc;
}
.device-detail-center {
  width: 175px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.device-detail-icon {
  color: #b6b6b6;
  display: flex;
  align-items: center;
  padding: 6px;
}
.deviceUpdate {
  overflow: visible !important;
}
.opacity {
  opacity: 0.5;
}
.device-detail-circle {
  margin-right: 5px;
  height: 6px;
  width: 6px;
  background: #ff4d4f;
  border-radius: 50%;
}
</style>
