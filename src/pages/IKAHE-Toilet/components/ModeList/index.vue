<template>
  <!-- active:
          status[v.value] && !!v.data
            ? v.data == status.mode
            : status[v.value] != 0 && active == 1, -->
  <div class="status-button">
    <div
      v-for="v in modelist"
      :key="v"
      class="status-button-wrap"
      :class="{
        active: v.active && active == 1,
        disabled: v.disabled,
        opacity: !v.name
      }"
    >
      <div class="status-button-icon" @click="setProperties(v)">
        <i :class="`iconfont ${v.ico}`"></i>
      </div>
      <div class="text">{{ v.name }}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    status: {
      type: Object,
      default: function() {
        return {}
      }
    },
    modelist: {
      type: Array,
      default: function() {
        return []
      }
    },
    active: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    setProperties(v) {
      if (v.disabled) return
      let value = !!v.data ? v.data : this.status[v.value] == 1 ? 0 : 1
      this.$emit('fClick', { [v.value]: value })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/public.less';
.status-button {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  margin-top: 20px;
  &-wrap {
    text-align: center;
  }
  &-wrap.active {
    .status-button-icon {
      background: #33d1ff;
    }
  }
  &-icon {
    display: flex;
    width: 52px;
    height: 52px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    .iconfont {
      font-size: 32px;
      display: inline-block;
    }
  }
  .text {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #fff;
    line-height: 16px;
    margin-top: 8px;
    font-weight: 400;
    margin-top: 5px;
  }
  &-wrap.disabled {
    opacity: 0.4;
    .status-button-icon {
      background: rgba(255, 255, 255, 0.4);
    }
  }
  &-wrap.opacity {
    opacity: 0;
  }
}
</style>
