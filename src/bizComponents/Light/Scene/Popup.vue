<template>
  <div>
    <Button
      :class="{
        off: power === 'off'
      }"
      icon="icon-scenes"
      text="场景"
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
          灯场景
        </div>
        <div class="scene-list">
          <div
            v-for="(v, i) in defaultSceneList"
            :key="i + '_' + 'default'"
            :class="[
              'item',
              'color-item',
              { active: activeScene === i + '_' + 'default' }
            ]"
            :style="[
              {
                background: colorRgba(v.background, 100),
                '--color': colorRgba(v.background, 100)
              }
            ]"
            @touchstart="showDeleteButton(v, i)"
            @touchend="clearLoop"
            @click="() => choseScene(v, i, true)"
          >
            <div class="name-icon-wrap">
              <div>{{ v.name }}</div>
            </div>
          </div>
          <div
            v-for="(v, i) in sceneList"
            :key="i + '_' + 'notDefault'"
            :class="[
              'item',
              'color-item',
              { active: activeScene === i + '_' + 'notDefault' }
            ]"
            :style="[
              {
                background: colorRgba(v.background, 100),
                '--color': colorRgba(v.background, 100)
              }
            ]"
            @touchstart="showDeleteButton(v, i)"
            @touchend="clearLoop"
            @click="() => choseScene(v, i)"
          >
            <div class="name-icon-wrap">
              <div>{{ v.name }}</div>
              <div
                class="icon-wrap"
                @click="e => goNewScene(e, { isEdit: 1, editIndex: i })"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-scenes-edit" />
                </svg>
              </div>
            </div>
          </div>
          <div class="add item" @click="() => goNewScene()">
            <i class="iconfont icon-add"></i>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Button from '../Button'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
export default {
  name: 'ScenePopup',

  components: {
    Button
  },

  data() {
    return {
      iotId: parseUrl('iotId'),
      show: false,
      power: 'disabled',
      activeScene: '',
      sceneList: [],
      defaultSceneList: [
        {
          isDefault: true,
          name: '睡眠',
          background: '#f5b958',
          data: {
            HSVColor: {
              Hue: 37,
              Saturation: 64, // 饱和度
              Value: 96 // 亮度
            }
          }
        },
        {
          isDefault: true,
          name: '电影',
          background: '#21314B',
          data: {
            HSVColor: {
              Hue: 217,
              Saturation: 56, // 饱和度
              Value: 29 // 亮度
            }
          }
        },
        {
          isDefault: true,
          name: '阅读',
          background: '#FBE2BA',
          data: {
            HSVColor: {
              Hue: 37,
              Saturation: 26, // 饱和度
              Value: 98 // 亮度
            }
          }
        }
      ]
    }
  },

  computed: {},
  activated() {
    this.getSceneList()
  },
  mounted() {
    this.getSceneList()
  },

  methods: {
    clearLoop() {
      clearInterval(this.Loop)
    },
    getSceneList() {
      const result = JSON.parse(localStorage.getItem(this.iotId) || '{}')
      this.sceneList = result.scene || []
    },
    showDeleteButton(item, index) {
      clearInterval(this.Loop) //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(() => {
        this.showEditName = true
        this.name = item.name
        this.editIndex = index
      }, 1000)
    },
    choseScene(item, index, isDefault) {
      this.activeScene = isDefault ? index + '_default' : index + '_notDefault'
      const { HSVColor } = item.data
      this.$emit('setCircleSliderValue', HSVColor)
    },
    goNewScene(e, query = {}) {
      if (e) {
        e.stopPropagation()
      }
      this.$router.push({
        name: 'NewScene',
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
      color: #262626;
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
