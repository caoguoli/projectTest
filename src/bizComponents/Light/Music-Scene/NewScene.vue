<template>
  <div class="new-scene-wrap">
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
        <ColorSelect ref="colorSelect" />
      </div>
      <div v-if="title === '编辑模式'" class="delete-button" @click="remove">
        删除模式
      </div>
    </div>
    <van-popup v-model="show" round>
      <div class="dialog-body">
        <div class="title">
          模式名称
        </div>
        <div class="dialog-input-warp">
          <input
            v-model="name"
            class="dialog-input"
            type="text"
            placeholder="请输入模式名称"
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
import ColorSelect from './ColorSelect'
import { mapState, mapMutations } from 'vuex'
import Convert from 'color-convert'

export default {
  name: 'NewScene',

  components: {
    NavBar,
    ColorSelect
  },

  data() {
    return {
      title: '',
      name: '',
      show: false
    }
  },
  computed: {
    ...mapState(['LightScene', 'musicSceneHash'])
  },
  mounted() {
    const { editIndex } = this.$route.query
    let LightScene = {}
    if (editIndex !== undefined) {
      this.title = '编辑模式'
      const { name, data } = JSON.parse(
        this.musicSceneHash.list[editIndex].json
      )
      this.name = name
      LightScene = {
        ...data,
        Enable: 0
      }
    } else {
      this.title = '新建模式'
    }
    this.changeLightScene(LightScene)
  },
  methods: {
    ...mapMutations(['changeLightScene', 'changeMusicSceneHash']),
    colorHandle(len) {
      let linearString = ''
      this.LightScene.ColorArr.forEach(({ Hue, Saturation, Value }) => {
        linearString += `, #${Convert.hsv.hex(Hue, Saturation, Value)}`
      })
      const { Hue, Saturation, Value } = this.LightScene.ColorArr[0]
      // 如果只有长度1，即使是渐变色也只显示第一种颜色
      if (len === 1) {
        return `#${Convert.hsv.hex(Hue, Saturation, Value)}`
      }
      return this.LightScene.ColorArr.length === 1
        ? `#${Convert.hsv.hex(Hue, Saturation, Value)}`
        : `linear-gradient(to right${linearString}`
    },
    remove() {
      Dialog.confirm({
        title: '确认',
        message: '确定删除该模式吗？'
      }).then(() => {
        const { editIndex } = this.$route.query
        const sceneList = this.musicSceneHash.list || []
        this.$mx.request.fetchOwnServer(
          {
            url: 'app/v1/device/panel/scene/delete',
            method: 'DELETE',
            data: {
              type: 0,
              scene_id: sceneList[editIndex].scene_id
            }
          },
          res => {
            if (res.code === 0) {
              sceneList.splice(editIndex, 1)
              this.changeMusicSceneHash({
                list: sceneList
              })
              this.$router.back()
            }
          }
        )
        // FIXME:
        // sceneList.splice(editIndex, 1)
        // this.changeMusicSceneHash({
        //   list: sceneList
        // })
        // this.$router.back()
      })
    },
    sureBtn() {
      if (!this.name) {
        Toast('模式名称不能为空')
        return
      }
      const { editIndex } = this.$route.query
      const json = JSON.stringify({
        name: this.name,
        background: this.colorHandle(),
        border: this.colorHandle(1),
        data: {
          ...this.LightScene,
          Enable: 1
        }
      })
      if (editIndex !== undefined) {
        this.$mx.request.fetchOwnServer(
          {
            url: 'app/v1/device/panel/scene/update',
            method: 'PUT',
            data: {
              scene_id: this.musicSceneHash.list[editIndex].scene_id,
              type: 0,
              json
            }
          },
          res => {
            if (res.code === 0) {
              Toast('编辑模式成功')
              const list = this.musicSceneHash.list
              list[editIndex] = {
                ...list[editIndex],
                json
              }
              this.changeMusicSceneHash({
                list
              })
              this.$router.back()
            }
          }
        )
        // FIXME:
        // const list = this.musicSceneHash.list
        // list[editIndex] = {
        //   ...list[editIndex],
        //   json
        // }
        // this.changeMusicSceneHash({
        //   list
        // })
        // this.$router.back()
      } else {
        this.$mx.request.fetchOwnServer(
          {
            url: 'app/v1/device/panel/scene/create',
            method: 'POST',
            data: {
              type: 0,
              json
            }
          },
          res => {
            if (res.code === 0) {
              Toast('创建模式成功')
              const list = this.musicSceneHash.list
              list.push({
                scene_id:
                  list.length === 0 ? 1 : list[list.length - 1].scene_id + 1,
                type: 0,
                json
              })
              this.changeMusicSceneHash({
                list
              })
              this.$router.back()
            }
          }
        )
        // FIXME:
        // const list = this.musicSceneHash.list
        // list.push({
        //   scene_id: list.length === 0 ? 1 : list[list.length - 1].scene_id + 1,
        //   type: 0,
        //   json
        // })
        // this.changeMusicSceneHash({
        //   list
        // })
        // this.$router.back()
      }
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
  flex-direction: column;
}

.new-scene-content {
  padding: 16px 28px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
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
