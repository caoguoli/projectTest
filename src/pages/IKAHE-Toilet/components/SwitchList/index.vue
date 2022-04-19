<template>
  <div>
    <ListTpl
      :icon="icon"
      :name="name"
      :icon-style="{color:'#fff'}"
      :text-style="textStyle"
    >
      <SwitchItem
        slot="right"
        :theme="themeColor"
        :default-color="defaultColor"
        :control-value="active"
        @submitChange="clickFn"
      />
    </ListTpl>
  </div>
</template>
<script>
import ListTpl from './list-tpl.vue'
import SwitchItem from '../SwitchItem/index.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'SwitchList',
  components: {
    ListTpl,
    SwitchItem
  },
  props:{
    icon:{
      type: String,
      default: ''
    },
    themeColor: {
      type: String,
      default: ''
    },
    defaultColor: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    textStyle:{
      type: Object,
      default: function(){
        return {}
      }
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {

    }
  },
  methods:{
    clickFn(){
      this.$emit('fClick')
    }
  }
}
</script>
<style lang="less" scoped>
.list-border-wrap {
  box-shadow: 0px 0px 10px 0px rgba(55, 106, 82, 0.1);
  border-radius: 10px;
  overflow: hidden;
}
.switch:before {
   background: pink !important;
}
</style>
