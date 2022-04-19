<template>
  <div>
    <ListTpl
      :icon="icon"
      :name="name"
      :icon-style="{color:'#fff'}"
      :sub-style="subStyle"
      :text-style="textStyle"
      :subtitle="subtitle"
      :sub-ico-style="subIcoStyle"
      @click.native="clickFn"
    >
      <div class="rightBtn">www</div>
    </ListTpl>
  </div>
</template>
<script>
import ListTpl from './list-tpl.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'SwitchList',
  components: {
    ListTpl
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
    name: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    },
    textStyle: {
      type: Object,
      default: function(){
        return {}
      }
    },
    subStyle: {
      type: Object,
      default: function(){
        return {}
      }
    },
    subIcoStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
// .list-border-wrap {
//   box-shadow: 0px 0px 10px 0px rgba(55, 106, 82, 0.1);
//   border-radius: 10px;
//   // margin: 0 10px 10px 10px;
//   overflow: hidden;
// }
// .switch:before {
//    background: pink !important;
// }
.rightBtn{
  width: 60px;
  height: 60px;
  background: pink;
}
</style>
