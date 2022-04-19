<template>
  <div>
    <ModeButton
      :class="{
        off: power === 'off'
      }"
      icon="icon-RhythmScene"
      @click="show = true"
    />
    <van-popup
      v-model="show"
      position="bottom"
      safe-area-inset-bottom
      closeable
    >
      <div class="light-scene">
        <div class="title">
          律动模式
        </div>
        <div class="scene-list">
          <div
            v-for="(v, i) in dataSource"
            :key="v.scene_id"
            :class="[
              'item',
              'color-item',
              {
                active:
                  musicSceneHash.active === undefined && i === 0
                    ? true
                    : musicSceneHash.active === v.scene_id
              }
            ]"
            :style="[
              {
                background: colorRgba(v.background, 100),
                '--color': v.border
              }
            ]"
            @touchstart="showDeleteButton(v, i - 4)"
            @touchend="clearLoop"
            @click="() => chooseScene(v)"
          >
            <div class="name-icon-wrap">
              <div>{{ v.name }}</div>
              <div
                v-if="!v.is_default"
                class="icon-wrap"
                @click="e => goNewMusciScene(e, { editIndex: i - 4 })"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-scenes-edit" />
                </svg>
              </div>
            </div>
          </div>
          <div class="add item" @click="() => goNewMusciScene()">
            <i class="iconfont icon-add"></i>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import ModeButton from '@/components/ModeButton'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ScenePopup',

  components: {
    ModeButton
  },

  data() {
    return {
      show: false,
      power: 'disabled',
      defaultSceneList: [
        {
          scene_id: -1,
          is_default: true,
          json: JSON.stringify({
            name: '默认',
            background:
              'linear-gradient(90deg, rgba(255, 84, 0, 1), rgba(102, 228, 13, 1))',
            border: 'rgba(255, 84, 0, 1)',
            data: {
              LightMode: 1,
              ColorSpeed: 50,
              SceneMode: 1,
              ColorArr: [
                { Hue: 20, Saturation: 100, Value: 100 },
                { Hue: 95, Saturation: 94, Value: 89 }
              ],
              Brightness: {},
              Enable: 1,
              SceneItems: {}
            }
          })
        },
        {
          scene_id: -2,
          is_default: true,
          json: JSON.stringify({
            name: '暖色',
            background: 'linear-gradient(90deg, #D46C0B 0%, #FF4D4F 100%',
            border: '#D46C0B',
            data: {
              LightMode: 1,
              ColorSpeed: 50,
              SceneMode: 1,
              ColorArr: [
                {
                  Hue: 29,
                  Saturation: 95,
                  Value: 82
                },
                {
                  Hue: 359,
                  Saturation: 70,
                  Value: 100
                }
              ],
              Brightness: {},
              Enable: 1,
              SceneItems: {}
            }
          })
        },
        {
          scene_id: -3,
          is_default: true,
          json: JSON.stringify({
            name: '冷色',
            background: 'linear-gradient(270deg, #0E239D 0%, #40A9FF 100%',
            border: '#40A9FF',
            data: {
              LightMode: 1,
              ColorSpeed: 50,
              SceneMode: 2,
              ColorArr: [
                {
                  Hue: 231,
                  Saturation: 91,
                  Value: 62
                },
                {
                  Hue: 207,
                  Saturation: 75,
                  Value: 100
                }
              ],
              Brightness: {},
              Enable: 1,
              SceneItems: {}
            }
          })
        },
        {
          scene_id: -4,
          is_default: true,
          json: JSON.stringify({
            name: '多彩',
            background:
              'linear-gradient(90deg, #FBDB17 0%, #F9551C 51%, #1391FE 100%',
            border: '#FBDB17',
            data: {
              LightMode: 1,
              ColorSpeed: 50,
              SceneMode: 2,
              ColorArr: [
                {
                  Hue: 52,
                  Saturation: 91,
                  Value: 98
                },
                {
                  Hue: 15,
                  Saturation: 89,
                  Value: 98
                },
                {
                  Hue: 208,
                  Saturation: 93,
                  Value: 100
                }
              ],
              Brightness: {},
              Enable: 1,
              SceneItems: {}
            }
          })
        }
      ]
    }
  },

  computed: {
    ...mapState(['musicSceneHash']),
    dataSource() {
      return this.defaultSceneList.concat(this.musicSceneHash.list).map(v => {
        return {
          ...v,
          ...JSON.parse(v.json)
        }
      })
    }
  },
  mounted() {
    this.$mx.request.fetchOwnServer(
      {
        url: 'app/v1/device/panel/scene/list',
        method: 'GET',
        data: {
          type: 0
        }
      },
      res => {
        if (res.code === 0) {
          const list = res.data.list
          this.$mx.request.fetchOwnServer(
            {
              url: 'app/v1/device/panel/scene/select/info',
              method: 'GET',
              data: {
                type: 0
              }
            },
            res => {
              if (res.code === 0) {
                const active = res.data.scene_id
                this.changeMusicSceneHash({
                  list,
                  active
                })
              } else {
                if (this.musicSceneHash.active === undefined) {
                  this.chooseScene({
                    ...this.dataSource[0],
                    data: {
                      ...this.dataSource[0].data,
                      Enable: 0
                    }
                  })
                }
              }
            }
          )
        }
      }
    )
  },

  methods: {
    ...mapMutations(['changeLightScene', 'changeMusicSceneHash']),
    clearLoop() {
      clearInterval(this.Loop)
    },
    showDeleteButton(item, index) {
      clearInterval(this.Loop) //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(() => {
        this.showEditName = true
        this.name = item.name
        this.editIndex = index
      }, 1000)
    },
    chooseScene(item) {
      const {
        LightMode,
        ColorSpeed,
        SceneMode,
        ColorArr,
        Brightness,
        Enable,
        SceneItems
      } = item.data
      this.changeLightScene({
        LightMode,
        ColorSpeed,
        SceneMode,
        ColorArr,
        Brightness,
        Enable,
        SceneItems
      })
      this.$mx.request.fetchOwnServer({
        url: 'app/v1/device/panel/scene/select/update',
        method: 'PUT',
        data: {
          is_default: item.is_default,
          scene_id: item.scene_id,
          type: 0
        }
      })
      this.changeMusicSceneHash({
        active: item.scene_id
      })
    },
    goNewMusciScene(e, query = {}) {
      this.changeLightScene({
        LightMode: 1,
        ColorSpeed: 50,
        SceneMode: 0,
        ColorArr: [{ Hue: 180, Saturation: 50, Value: 100 }],
        Brightness: {},
        Enable: 1,
        SceneItems: {}
      })
      this.$router.push({
        name: 'NewMusciScene',
        query
      })
    },
    colorRgba(sHex, alpha) {
      const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/
      let sColor = sHex.toLowerCase()
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4 || sColor.length === 5) {
          let sColorNew = '#'
          for (let i = 1; i < sColor.length; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        // 如果有透明度再执行
        if (sColor.length === 9) {
          alpha = (parseInt('0x' + sColor.slice(7, 9)) / 255).toFixed(2)
        }
        //  处理六位的颜色值
        const sColorChange = []
        for (let i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }
        return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
      } else {
        return sColor
      }
    }
  }
}
</script>
<style lang="less" scoped>
.light-scene {
  height: 60vh;
  background: #000;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  .title {
    padding: 18px 20px;
    width: 100%;
    background: #000;
    color: #fff;
  }
}

.scene-list {
  padding: 6px 20px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    display: inline-block;
    width: 47.7%;
    height: 88px;
    border-radius: 12px;
    margin-bottom: 15px;
  }
  .color-item {
    position: relative;
    padding: 10px 12px;
    .name-icon-wrap {
      color: #fff;
      display: flex;
      align-content: center;
      justify-content: space-between;
      position: absolute;
      width: 85%;
      .icon-wrap {
        height: 100%;
        width: 30px;
        text-align: right;
        .icon {
          width: 24px;
          height: 24px;
          overflow: hidden;
        }
      }
    }
  }
  .active.color-item:before {
    content: '';
    position: absolute;
    left: -3%;
    top: -6%;
    width: 210%;
    height: 220%;
    border: 2px solid var(--color);
    border-radius: 24px;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(0.5, 0.5);
    -ms-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
  }

  .item:nth-of-type(odd) {
    margin-right: 15px;
  }
  .add {
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 24px;
      color: #fff;
    }
  }
}
</style>
