<template>
  <div class="attach-box">
    <NavBar title="座圈加热时间" right-icon="none" border @back="goBack" />

    <div class="public-box switchbox">
      <SwitchList
        theme-color="#33D1FF"
        name="座圈加热节能"
        :text-style="{color:'#183B56',margin:'0'}"
        :active="deviceData.heatRingSaving == 1"
        @fClick="ButtomClick('heatRingSaving')"
      />
      <div v-show="deviceData.heatRingSaving == 1">
        <div class="hr"></div>
        <SwitchOther
          :text-style="{color:'#183B56',margin:'0'}"
          :subtitle="startTime"
          name="开始时间"
          @fClick="showClick('heatRingSavingStartTime')"
        />
        <div class="hr"></div>
        <SwitchOther
          :text-style="{color:'#183B56',margin:'0'}"
          :subtitle="endTime"
          name="结束时间"
          @fClick="showClick('heatRingSavingFinishTime')"
        />
      </div>
    </div>

    

    <van-popup v-model="show" round position="bottom" safe-area-inset-bottom>
      <div class="add-timing-picker">
        <div class="toolbar flex">
          <div class="left flex" @click="show = false">取消</div>
          <div class="title">{{ titleShow[title] }}</div>
          <div class="right flex" @click="sureClick">确定</div>
        </div>
        <van-picker
          ref="timingPicker"
          :visible-item-count="5"
          :show-toolbar="false"
          :columns="columns"
          @change="onChange"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import SwitchList from '../../components/SwitchList'
import SwitchOther from '../../components/SwitchList/other.vue'
import { mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { parseUrl } from '@/utils/MXSMART/tools/index.ts'
// import HEX from '../hex.json'
// import ilop2hex from '@/utils/MXSMART/tools/ilop2hex'

export default {
  components: {
    NavBar,
    SwitchList,
    SwitchOther
  },
  data() {
    return {
      show: false,
      title: 'heatRingSavingStartTime',
      startTime: '',
      endTime: '',
      timeSel: 0,
      titleShow: {
        heatRingSavingStartTime: '开始时间',
        heatRingSavingFinishTime: '结束时间',
      },
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
          defaultIndex: 20
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
    ...mapState(['deviceData'])
  },
  watch: {
    deviceData: {
      handler(deviceData) {
        const {
          heatRingSavingStartTime,
          heatRingSavingFinishTime
        } = deviceData
        this.syncData(
          heatRingSavingStartTime,
          heatRingSavingFinishTime
        )
      },
      deep: true
    }
  },
  mounted() {
   const {
      heatRingSavingStartTime,
      heatRingSavingFinishTime
    } = this.deviceData
    this.syncData(
      heatRingSavingStartTime,
      heatRingSavingFinishTime
    )
  },
  methods: {
    ...mapMutations(['changeDeviceData']),
    goBack() {
      this.$router.back();
    },
    setHSVColorFunc(list) {
      const data = list
      // const hex = ilop2hex(data, HEX)
      console.warn(JSON.stringify(data));
      // console.warn('hex-->',hex);
      this.$mx.device.setProperties({
        data,
        // hex
      })
    },
    syncData(heatRingSavingStartTime, heatRingSavingFinishTime){
      const faultStart = heatRingSavingStartTime || 0;
      let faulStartH = parseInt(faultStart / 60);
      let faulStartM = faultStart - faulStartH * 60;
      faulStartH = faulStartH <= 9 ? `0${faulStartH}` : faulStartH;
      faulStartM = faulStartM <= 9 ? `0${faulStartM}` : faulStartM;
      this.startTime = `${faulStartH}:${faulStartM}`;

      const faultEnd = heatRingSavingFinishTime || 0;
      let faultEndH = parseInt(faultEnd / 60);
      let faultEndM = faultEnd - faultEndH * 60;
      faultEndH = faultEndH <=9 ? `0${faultEndH}`: faultEndH;
      faultEndM = faultEndM <= 9 ? `0${faultEndM}`: faultEndM;
      this.endTime = `${faultEndH}:${faultEndM}`;
    },
    ButtomClick(mode){
      const v = this.deviceData[mode] == 1 ? 0 : 1;
      this.setHSVColorFunc({[mode]: v})
    },
    showClick(mode){
      this.title = mode;
      const faultTimes = this.deviceData[mode] || 0;
      this.timeSel = faultTimes; // 默认时间
      const h = parseInt(faultTimes / 60);
      const m = faultTimes - parseInt(faultTimes / 60) * 60;
      if(this.$refs.timingPicker){
        console.warn('111')
        this.$refs.timingPicker.setIndexes([h,m])
      }else{
        console.warn('222')
        let columns = this.columns;
        columns[0].defaultIndex = parseInt(faultTimes / 60);
        columns[1].defaultIndex = faultTimes - parseInt(faultTimes / 60) * 60;
      }
      this.show = true
    },
    onChange() {
      const indexes = this.$refs.timingPicker.getIndexes()
      // console.warn('times ++',indexes, this.$refs.timingPicker.getValues())
      console.warn('this.$refs.timingPicker 22',indexes)
      this.timeSel = indexes[0] * 60 + indexes[1] * 1;
    },
    sureClick(){
      const data = {
        [this.title] : this.timeSel
      }
      this.setHSVColorFunc({...data})
      this.show = false;
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/public.less';
.attach-box{
  overflow: hidden;
  margin-top: 7px;
  .hr{
    height: 1px;
    margin:0 20px;
    background: rgba(0, 0, 0, 0.07);
    box-sizing: border-box;
  }
  .switchbox{
    background: #fff;
    margin: 17px;
  }
  .toolbar{
    width:100%;
    height: 40px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #EEEE;
    // margin-bottom: 20px;
    .left,.right{
      position: absolute;
      height: 40px;
      padding: 0 17px;
      top:0;
      font-size: 14px;
      font-weight: 500;
      color: rgba(24, 59, 86, 0.5);
      line-height: 12px;
    }
    .left{
      left: 0;
    }
    .right{
      right:0;
      color: #33D1FF;
    }
    .title{
      font-size: 14px;
      font-weight: 500;
      color: rgba(24, 59, 86, 0.5);
      line-height: 12px;
          }
  }
}
</style>
