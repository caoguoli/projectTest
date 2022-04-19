<template>
  <div class="add-timing">
    <NavBar
      :title="title"
      right-icon="none"
      border
      @back="goBack"
      @rightClick="save"
    >
      <div slot="right" class="right-button">保存</div>
    </NavBar>
    <div class="add-timing-picker">
      <van-picker
        ref="timingPicker"
        title="标题"
        :show-toolbar="false"
        :columns="columns"
        @change="onChange"
      />
    </div>
    <div>
      <van-cell-group>
        <van-cell
          title="重复"
          :value="getDayText()"
          is-link
          @click="openDays"
        />
        <van-cell
          title="设备动作"
          :value="getAction"
          is-link
          @click="$router.push({ name: 'Choose' })"
        />
      </van-cell-group>
    </div>
    <van-popup v-model="show" round position="bottom" safe-area-inset-bottom>
      <div class="add-timing-dialog">
        <div class="dialog-title">重复</div>
        <van-cell-group>
          <van-cell
            v-for="day in days"
            :key="day.value"
            :title="day.name"
            @click="chooseWeek(day)"
          >
            <div slot="right-icon">
              <i
                v-if="copySelectDays.indexOf(day.value) >= 0"
                class="iconfont icon-selected"
              ></i>
              <i v-else class="iconfont icon-unselected"> </i>
            </div>
          </van-cell>
        </van-cell-group>
        <div class="dialog-buttons">
          <div class="dialog-buttons-left" @click="show = false">取消</div>
          <div class="dialog-buttons-right" @click="sureBtn">确定</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar/index.vue'
import { mapState, mapMutations } from 'vuex'
import { Toast } from 'vant'
import dayjs from 'dayjs'
import { parseUrl } from '@/utils/MXSMART/tools'
import { PowerSwitchConst } from '@/config/timerConfig'

export default {
  components: {
    NavBar
  },
  data() {
    return {
      title: '',
      days: [
        { name: '周一', value: 1 },
        { name: '周二', value: 2 },
        { name: '周三', value: 3 },
        { name: '周四', value: 4 },
        { name: '周五', value: 5 },
        { name: '周六', value: 6 },
        { name: '周日', value: 7 }
      ],
      selectDays: [],
      copySelectDays: [],
      show: false,
      columns: [
        // 第一列
        {
          values: new Array(24).fill(0).map((_, index) => {
            if (index < 10) {
              return '0' + index
            } else {
              return '' + index
            }
          }),
          defaultIndex: 0
        },
        // 第二列
        {
          values: new Array(60).fill(0).map((_, index) => {
            if (index < 10) {
              return '0' + index
            } else {
              return '' + index
            }
          }),
          defaultIndex: 1
        }
      ]
    }
  },
  computed: {
    ...mapState(['deviceData', 'timer', 'cloudTimingList']),
    currentCron() {
      return this.timer.cron.length !== 0
        ? this.timer.cron.join(',')
        : this.selectDays.join(',') || '*'
    },
    current() {
      return this.cloudTimingList.filter(
        v => v.sceneId === this.$route.query.sceneId
      )[0]
    },
    getAction() {
      if (this.timer.powerstate !== undefined) {
        return PowerSwitchConst[this.timer.powerstate]
      }
      if (this.current) {
        return PowerSwitchConst[this.current.actions[0].params.propertyValue]
      }
      return '请添加'
    }
  },
  watch: {
    selectDays() {
      this.setTimer({
        cron: this.selectDays
      })
    }
  },
  mounted() {
    const { sceneId } = this.$route.query
    this.title = sceneId ? '编辑定时' : '添加定时'
    if (sceneId) {
      const arr = this.current.description.split(': ')
      this.$refs.timingPicker.setIndexes([Number(arr[0]), Number(arr[1])])
      const cron = this.current.triggers.items[0].params.cron
      const selectDays = cron.split(' ')[cron.split(' ').length - 1]
      if (['*', ''].includes(selectDays)) {
        this.selectDays = []
      } else {
        this.selectDays = selectDays.split(',').map(i => i * 1)
      }
    } else {
      this.$refs.timingPicker.setIndexes(
        this.timer.indexes.length === 0
          ? [new Date().getHours(), new Date().getMinutes()]
          : this.timer.indexes
      )
    }
  },
  destroyed() {
    this.setTimer({
      cron: [],
      powerstate: undefined,
      indexes: []
    })
  },
  methods: {
    ...mapMutations(['setTimer']),
    onChange() {
      const indexes = this.$refs.timingPicker.getIndexes()
      this.setTimer({
        indexes
      })
    },
    chooseWeek(day) {
      const index = this.copySelectDays.indexOf(day.value)
      if (index >= 0) {
        this.copySelectDays.splice(index, 1)
      } else {
        this.copySelectDays = [...this.copySelectDays, day.value].sort()
      }
    },
    getDayText() {
      const days = this.currentCron
      const dayText = ['', '一', '二', '三', '四', '五', '六', '日']
      if (days === '*') {
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

    addZero(num) {
      if (num < 10) {
        return '0' + num
      } else {
        return '' + num
      }
    },

    save() {
      const { sceneId } = this.$route.query
      if (this.getAction === '请添加') {
        Toast('请添加设备动作')
        return
      }
      const indexs = this.$refs.timingPicker.getIndexes()
      Toast.loading({
        message: '保存中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      this.$mx.request.fetchOwnServer({
        url: `app/v1/time/fix`,
        method: 'POST',
        data: {}
      })
      const isBeyond =
        indexs[0] * 60 + indexs[1] >= dayjs().hour() * 60 + dayjs().minute()
      const time = isBeyond
        ? dayjs().format('DD MM YYYY')
        : dayjs()
            .add(1, 'day')
            .format('DD MM YYYY')
      const cron =
        this.currentCron === '*'
          ? `0 ${indexs[1]} ${indexs[0]} ${time}`
          : `0 ${indexs[1]} ${indexs[0]} ? * ${this.currentCron}`

      if (sceneId) {
        const { sceneId, enable, name, icon } = this.current
        this.$mx.request.fetch(
          {
            url: '/scene/timing/update',
            method: 'POST',
            data: {
              sceneId,
              associatedId: parseUrl('iotId'),
              idType: 'DEVICE',
              enable,
              name,
              icon,
              description: `${this.addZero(indexs[0])}: ${this.addZero(
                indexs[1]
              )}`,
              triggers: {
                items: [
                  {
                    params: {
                      cron,
                      cronType: 'quartz_cron',
                      timezoneID: 'Asia/Shanghai'
                    },
                    uri: 'trigger/timer'
                  }
                ],
                uri: 'logical/or'
              },
              actions: [
                {
                  params: {
                    iotId: parseUrl('iotId'),
                    propertyName: 'powerstate',
                    propertyValue: this.getAction.includes('开启') ? 1 : 0
                  },
                  uri: 'action/device/setProperty'
                }
              ]
            },
            authType: 'iotAuth',
            version: '1.0.5'
          },
          res => {
            if (res.code === 200) {
              Toast('云端定时编辑成功')
              // this.setTimer({
              //   cron: [],
              //   powerstate: undefined,
              //   indexes: []
              // })
              this.$router.back()
            } else {
              Toast('操作失败')
            }
          }
        )
      } else {
        this.$mx.request.fetch(
          {
            url: '/scene/timing/create',
            method: 'POST',
            data: {
              associatedId: parseUrl('iotId'),
              idType: 'DEVICE',
              enable: true,
              name: '空净云端定时',
              icon: 'webCloudTiming',
              description: `${this.addZero(indexs[0])}: ${this.addZero(
                indexs[1]
              )}`,
              triggers: {
                items: [
                  {
                    params: {
                      cron,
                      cronType: 'quartz_cron',
                      timezoneID: 'Asia/Shanghai'
                    },
                    uri: 'trigger/timer'
                  }
                ],
                uri: 'logical/or'
              },
              actions: [
                {
                  params: {
                    iotId: parseUrl('iotId'),
                    propertyName: 'powerstate',
                    propertyValue: this.timer.powerstate
                  },
                  uri: 'action/device/setProperty'
                }
              ]
            },
            authType: 'iotAuth',
            version: '1.0.5'
          },
          res => {
            if (res.code === 200) {
              Toast('云端定时添加成功')
              this.$router.back()
            } else {
              Toast('操作失败')
            }
          }
        )
      }
    },
    openDays() {
      this.copySelectDays = JSON.parse(JSON.stringify(this.selectDays))
      this.show = true
    },
    sureBtn() {
      this.selectDays = JSON.parse(JSON.stringify(this.copySelectDays))
      this.show = false
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.add-timing {
  min-height: 100vh;
  background: #f7f7f7;

  .iconfont {
    font-size: 20px;
  }
  &-picker {
    margin-top: 17px;
    margin-bottom: 17px;
  }
  .dialog {
    width: 305px;
    &-title {
      font-size: 18px;
      font-weight: 400;
      color: #262626;
      line-height: 18px;
      padding-top: 25px;
      padding-bottom: 30px;
      text-align: center;
    }
    &-buttons {
      width: 100%;
      padding: 0 16px;
      margin: 20px auto 20px;
      display: flex;
      justify-content: space-between;
      &-left,
      &-right {
        width: 164px;
        height: 44px;
        border: 1px solid @primary;
        background: #fff;
        color: @primary;
        border-radius: 44px;
        font-size: 17px;
        font-weight: 400;
        line-height: 44px;
        letter-spacing: 1px;
        text-align: center;
      }
      &-right {
        background: @primary;
        color: #ffffff;
      }
    }
  }
  .icon-selected {
    color: @primary;
  }
  .icon-unselected {
    color: #bfbfbf;
  }
}
</style>
