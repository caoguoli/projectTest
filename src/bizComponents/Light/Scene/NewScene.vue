<template>
  <div v-if="ready" class="new-scene-wrap">
    <NavBar
      :title="title"
      theme="transparent"
      right-icon="none"
      background="#000"
      @back="$router.back()"
      @rightClick="save"
    >
      <div slot="right" class="right-button">保存</div>
    </NavBar>
    <div class="new-scene-content ">
      <div>
        <div class="title">颜色</div>
        <ColorSelect
          ref="colorSelect"
          v-model="colorSelectValue"
          :brightness="brightness"
        />
        <Slider
          v-model="brightness"
          class="light-slider-wrap"
          title="亮度"
          unit="%"
          :min="1"
          :max="100"
        />
      </div>
      <div v-if="title === '编辑场景'" class="delete-button" @click="remove">
        删除场景
      </div>
    </div>
    <van-popup v-model="show" round>
      <div class="dialog-body">
        <div class="title">
          场景名称
        </div>
        <div class="dialog-input-warp">
          <input
            v-model="name"
            class="dialog-input"
            type="text"
            placeholder="请输入场景名称"
          />
        </div>
        <div class="button-wrap">
          <div class="button cancel" @click="show = false">
            取消
          </div>
          <div class="button confirm" @click="sureBtn">
            确定
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar'
import { Toast, Dialog } from 'vant'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
import ColorSelect from './ColorSelect'
import Slider from '../Slider'

export default {
  name: 'NewScene',

  components: {
    NavBar,
    ColorSelect,
    Slider
  },

  data() {
    return {
      title: '',
      name: '',
      show: false,
      brightness: 50,
      colorSelectValue: [0, 1],
      nightLightSwitch: 1,
      ready: false
    }
  },

  mounted() {
    const { editIndex, isEdit } = this.$route.query
    const iotId = parseUrl('iotId')
    const result = JSON.parse(localStorage.getItem(iotId) || '{}')
    result.scene = result.scene || []
    if (isEdit) {
      this.title = '编辑场景'
      const { name, data } = result.scene[editIndex]
      this.name = name
      this.brightness = result.scene[editIndex].data.HSVColor.Value
      this.colorSelectValue = data.HSVColor
    } else {
      this.colorSelectValue = {
        Hue: 0,
        Saturation: 0,
        Value: 0
      }
      this.title = '新建场景'
    }
    this.ready = true
  },
  methods: {
    remove() {
      Dialog.confirm({
        title: '确认',
        message: '确定删除该场景吗？'
      }).then(() => {
        const iotId = parseUrl('iotId')
        const { editIndex } = this.$route.query
        const result = JSON.parse(localStorage.getItem(iotId) || '{}')
        const sceneList = result.scene || []
        sceneList.splice(editIndex, 1)
        result.scene = sceneList
        localStorage.setItem(iotId, JSON.stringify(result))
        this.$router.back()
      })
    },
    sureBtn() {
      const color = this.$refs.colorSelect.currentColor
      const iotId = parseUrl('iotId')
      if (!this.name) {
        Toast('场景名称不能为空')
        return
      }
      const result = JSON.parse(localStorage.getItem(iotId) || '{}')
      result.scene = result.scene || []
      const { editIndex, isEdit } = this.$route.query
      const currentNode = {
        name: this.name,
        background: `#${color}`,
        data: {
          HSVColor: this.colorSelectValue
        }
      }
      if (isEdit) {
        Toast('编辑场景成功')
        result.scene[editIndex] = currentNode
      } else {
        Toast('创建场景成功')
        result.scene = [...result.scene, currentNode]
      }
      localStorage.setItem(iotId, JSON.stringify(result))

      this.$router.back()
    },
    save() {
      this.show = true
    }
  }
}
</script>
<style lang="less" scoped>
.right-button {
  font-size: 16px;
  font-weight: 500;
  text-align: right;
}
.new-scene-wrap {
  background: #000;
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.new-scene-content {
  padding: 40px 28px;
  .light-slider-wrap {
    margin-top: 40px;
  }
}
.title {
  font-size: 12px;
  color: #fff;
  margin-bottom: 16px;
}
.night-switch-box {
  width: 320px;
  height: 68px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  &-left {
    font-size: 17px;
    font-weight: 500;
    color: #fcfcfb;
    line-height: 24px;
  }
}
.delete-button {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 320px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  font-size: 15px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #ff5b5e;
}

.dialog-body {
  box-sizing: border-box;
  padding: 25px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  .title {
    margin-bottom: 30px;
    font-size: 18px;
    color: @text-primary;
    line-height: 18px;
    text-align: center;
  }
}
.dialog-input-warp {
  display: flex;
  align-items: center;
  width: 255px;
  height: 50px;
  border-radius: 5px;
  margin: 0 auto;
  border: 1px solid @border;
}
.dialog-input {
  outline: none !important;
  box-shadow: none !important;
  border: 0;
  width: 100%;
  display: block;
  padding: 0 17px;
  font-size: 17px;
}
.dialog-input::placeholder {
  color: @text-secondary;
}
.button-wrap {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .button {
    width: 120px;
    height: 44px;
    border-radius: 44px;
    text-align: center;
    line-height: 44px;
  }
  .cancel {
    color: @text-primary;
    background: #f5f5f5;
  }
  .confirm {
    color: #fff;
    background: @primary;
  }
}
</style>
