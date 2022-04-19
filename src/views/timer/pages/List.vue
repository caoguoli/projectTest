<template>
  <div class="timing">
    <NavBar title="定时" right-icon="none" border @back="goBack" />
    <van-swipe-cell v-for="(item, key) in timingList" :key="key">
      <div class="timing-item" @click="() => gotoEditTime(item, key)">
        <div>
          <div class="timing-item-time">
            {{ item.description }}
          </div>
          <div class="timing-item-week">
            {{ getDay(item.triggers.items[0].params.cron.split(' ')) }}
          </div>
          <div class="timing-item-switch">
            {{ PowerSwitchConst[item.actions[0].params.propertyValue] }}
          </div>
        </div>
        <SwitchItem
          :control-value="item.enable && item.status !== 2"
          theme="#0DB983"
          @submitChange="e => changeEnable(key, e)"
        />
      </div>
      <template #right>
        <van-button
          square
          type="danger"
          text="删除"
          style="height: 100%;"
          @click="() => deleteThisTimer(key)"
        />
      </template>
    </van-swipe-cell>

    <!-- 最多只有5个，不能再多了 -->
    <div class="add-btn" @click="gotoAddTiming">
      添加定时
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar/index.vue'
import SwitchItem from '@/components/SwitchItem/index.vue'
import { Dialog, Toast } from 'vant'
import { mapState, mapMutations } from 'vuex'
import { parseUrl } from '@/utils/MXSMART/tools'
import { PowerSwitchConst } from '@/config/timerConfig'
export default {
  components: {
    NavBar,
    SwitchItem
  },
  data() {
    return {
      checked: false,
      timingList: [],
      PowerSwitchConst
    }
  },
  computed: {
    ...mapState({
      deviceData: state => state.deviceData
    })
  },
  mounted() {
    this.getTimingList()
  },
  methods: {
    ...mapMutations(['setTimer', 'setCloudTimingList']),
    getTimingList() {
      this.$mx.request.fetch(
        {
          url: '/scene/timing/list/get',
          method: 'POST',
          data: {
            associatedId: parseUrl('iotId'),
            idType: 'DEVICE',
            pageNo: 1,
            pageSize: 20
          },
          authType: 'iotAuth',
          version: '1.0.5'
        },
        async res => {
          if (res && res.code === 200) {
            this.timingList = await Promise.all(
              res.data.scenes.map(v => {
                return new Promise(resolve => {
                  this.$mx.request.fetch(
                    {
                      url: '/scene/timing/info/get',
                      method: 'POST',
                      data: {
                        sceneId: v.id,
                        associatedId: parseUrl('iotId'),
                        idType: 'DEVICE'
                      },
                      authType: 'iotAuth',
                      version: '1.0.5'
                    },
                    res => {
                      if (res.code === 200) {
                        console.warn('getTimingList', res)
                        resolve(res.data)
                      }
                    }
                  )
                })
              })
            )
            this.setCloudTimingList(this.timingList)
          }
        }
      )
    },
    gotoEditTime(item) {
      this.setTimer(item)
      this.$router.push({
        name: 'timingPage',
        query: {
          sceneId: item.sceneId
        }
      })
    },
    addZero(num) {
      if (num < 10) {
        return '0' + num
      } else {
        return '' + num
      }
    },
    getDay(dayList) {
      const days = dayList[dayList.length - 1]
      const dayText = ['', '一', '二', '三', '四', '五', '六', '日']
      if (!dayList.includes('*')) {
        return '不重复'
      }
      if (days === '1,2,3,4,5,6,7') {
        return '每天'
      }
      if (days === '1,2,3,4,5') {
        return '工作日'
      }
      return days
        .split(',')
        .map(item => {
          return dayText[item]
        })
        .join(' ')
    },
    changeEnable(index) {
      this.$mx.request.fetchOwnServer({
        url: `app/v1/time/fix`,
        method: 'POST',
        data: {}
      })
      const {
        sceneId,
        enable,
        name,
        icon,
        description,
        triggers,
        actions
      } = this.timingList[index]
      this.$mx.request.fetch(
        {
          url: '/scene/timing/update',
          method: 'POST',
          data: {
            sceneId,
            associatedId: parseUrl('iotId'),
            idType: 'DEVICE',
            enable: !enable,
            name,
            icon,
            description,
            triggers,
            actions
          },
          authType: 'iotAuth',
          version: '1.0.5'
        },
        res => {
          if (res.code === 200) {
            this.timingList[index].enable = !enable
          } else {
            Toast('操作失败')
          }
        }
      )
    },
    deleteThisTimer(index) {
      const item = this.timingList[index]
      Dialog.confirm({
        title: '确认',
        message: '确定删除该定时吗？'
      }).then(() => {
        this.$mx.request.fetch(
          {
            url: '/scene/timing/delete',
            method: 'POST',
            data: {
              associatedId: parseUrl('iotId'),
              sceneId: item.sceneId,
              idType: 'DEVICE'
            },
            authType: 'iotAuth',
            version: '1.0.5'
          },
          res => {
            if (res && res.code === 200) {
              this.getTimingList()
              // this.timingList.splice(index, 1)
            }
          }
        )
      })
    },
    gotoAddTiming() {
      if (this.timingList.length < 5) {
        this.setTimer({
          cron: [],
          PowerSwitch: undefined,
          indexes: []
        })
        this.$router.push({
          name: 'timingPage'
        })
      } else {
        Toast('最多设置5个定时')
      }
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.timing {
  &-item {
    margin: 17px 0;
    height: 120px;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 17px;
    justify-content: space-between;
    &-time {
      font-size: 28px;
      font-weight: bold;
      color: #262626;
      line-height: 32px;
    }
    &-week {
      margin-top: 8px;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
    }
    &-switch {
      margin-top: 4px;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
    }
  }
  .add-btn {
    width: 375px;
    height: 60px;
    background: #ffffff;
    font-size: 17px;
    line-height: 60px;
    text-align: center;
    font-weight: 400;
    color: @primary;
    margin-top: 17px;
    margin-bottom: 17px;
  }
}
</style>
