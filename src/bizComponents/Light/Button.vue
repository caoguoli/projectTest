<template>
  <div class="button-wrap" @click="$emit('click')">
    <div class="button">
      <i class="iconfont " :class="icon"></i>
    </div>
    <div class="text">
      {{ text }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Button',
  props: {
    icon: {
      default: '',
      type: String
    },
    text: {
      default: '',
      type: String
    }
  }
}
</script>
<style lang="less" scoped>
i {
  font-size: 20px;
  color: #fff;
}
.button {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 1);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.button-wrap {
  color: #fff;
  .text {
    text-align: center;
    margin-top: 10px;
  }
  .button {
    background: rgb(107, 121, 147);
  }
}
.button-wrap.disabled {
  .button {
    background: rgba(255, 255, 255, 0.2);
  }
  .text {
    color: rgba(255, 255, 255, 0.5);
  }
  i {
    opacity: 0.4;
  }
}
.button-wrap.off {
  .button {
    background: rgb(28, 28, 28);
  }
  .text {
    color: rgba(255, 255, 255, 0.2);
  }
  i {
    opacity: 0.4;
  }
}
</style>
