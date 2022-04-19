<template>
  <div class="horizontal-container">
    <div class="scene-mode-wrap">
      <div
        v-for="v in SCENE_MODE"
        :key="v.label"
        class="item"
        @click="handleTabClick(v)"
      >
        {{ v.label }}
      </div>
      <div
        ref="activeRef"
        class="active"
        :style="{
          transform: `translateX(${activeRefWidth * LightScene.SceneMode}px)`
        }"
      ></div>
    </div>
    <div ref="scroll" class="scroll-wrapper">
      <div class="scroll-content">
        <div
          v-for="(item, index) in dataSource"
          :key="index"
          class="scroll-item"
          :style="{
            background: renderBg(item),
            '--color': renderBg(item),
            color: item.Saturation > 50 ? '#fff' : '#000'
          }"
          :class="{ selected: selectColor.index === index }"
          @click="changeSelectColor({ ...item, index })"
        >
          {{ index + 1 }}
        </div>
        <div
          v-if="LightScene.ColorArr.length < 8"
          class="add scroll-item"
          @click="() => add()"
        >
          <i class="iconfont icon-add1"></i>
        </div>
        <div
          v-if="LightScene.ColorArr.length > 1"
          class="remove scroll-item"
          @click="remove"
        >
          <i class="iconfont icon-deleted"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import BScroll from '@better-scroll/core'
import Convert from 'color-convert'

export default {
  name: 'ColorList',
  data() {
    return {
      selected: {},
      SCENE_MODE: [
        {
          label: '默认',
          value: 0
        },
        {
          label: '闪烁',
          value: 1
        },
        {
          label: '渐变',
          value: 2
        }
      ],
      currentSceneMode: 0,
      activeRefWidth: 0
    }
  },

  computed: {
    ...mapGetters(['dataSource']),
    ...mapState(['LightScene', 'selectColor']),
    activeStyle() {
      return {}
    }
  },
  watch: {
    selectColor() {
      this.$nextTick(() => {
        this.handleScroll()
      })
    }
  },
  beforeDestroy() {
    this.bs.destroy()
  },
  mounted() {
    this.bs = new BScroll(this.$refs.scroll, {
      scrollX: true,
      probeType: 3, // listening scroll event
      click: true
    })
    this.$nextTick(() => {
      this.activeRefWidth = this.$refs.activeRef.clientWidth
      this.bs.refresh()
    })
  },

  methods: {
    ...mapMutations(['changeLightScene', 'changeSelectColor']),
    handleScroll() {
      const uint = this.bs.maxScrollX / (this.LightScene.ColorArr.length - 1)
      this.bs.scrollTo(this.selectColor.index * uint, 0, 300)
    },
    handleTabClick(v) {
      this.changeLightScene({
        SceneMode: v.value
      })
      this.$nextTick(() => {
        this.bs.refresh()
      })
    },
    renderBg({ Hue, Saturation, Value }) {
      const background = Convert.hsv.hex(Hue, Saturation, Value)
      return `#${background}`
    },
    remove() {
      this.LightScene.ColorArr.splice(this.LightScene.ColorArr.length - 1, 1)
      this.changeLightScene({
        ColorArr: this.LightScene.ColorArr
      })
      this.$nextTick(() => {
        this.bs.refresh()
      })
    },
    add(Hue, Saturation) {
      const ColorArr = this.LightScene.ColorArr.concat({
        Hue: Hue || this.random(0, 360),
        Saturation: Saturation || this.random(0, 100),
        Value: 100
      })
      this.changeLightScene({
        ColorArr
      })
      this.changeSelectColor({
        ...ColorArr[ColorArr.length - 1],
        index: ColorArr.length - 1
      })
      this.$nextTick(() => {
        this.bs.refresh()
      })
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    }
  }
}
</script>
<style lang="less" scoped>
.horizontal-container {
  .scroll-wrapper {
    position: relative;
    white-space: nowrap;
    border-radius: 5px;
    overflow: hidden;
    .scroll-content {
      padding: 24px 8px;
      display: inline-block;
    }
    .scroll-item {
      font-weight: 500;
      color: #fff;
      height: 50px;
      width: 50px;
      line-height: 50px;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      padding: 0 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 20px;
      vertical-align: top;
      position: relative;
    }

    .scroll-item.selected::before {
      content: '';
      position: absolute;
      left: -6px;
      top: -6px;
      width: 58px;
      height: 58px;
      border: 2px solid var(--color);
      border-radius: 50%;
    }
    .add,
    .remove {
      text-align: center;
      border: 1px solid #fff;
      line-height: 48px;
    }
    .iconfont {
      font-size: 20px;
      color: #fff;
    }
  }
}

.scene-mode-wrap {
  width: 320px;
  height: 50px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  line-height: 50px;
  display: flex;
  color: #fff;
  position: relative;
  .item {
    flex: 1;
    text-align: center;
  }
  .active {
    position: absolute;
    width: 104px;
    height: 44px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    margin: 3px;
    transition: all 0.3s;
  }
}
</style>
