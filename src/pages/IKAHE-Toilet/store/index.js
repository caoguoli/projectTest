const state = {
  deviceData: {
    PowerSwitch: 1,
    seatTemp: 37, // 当前座温
    windTemp: 20, //当前风温
    currentTemperature: 40,  // 当前水温
    // autoClean: 0, // 自动清洗
    // hipWash: 0, // 臀洗
    // womanWash: 0, // 妇洗
    // Dry: 0, // 烘干
    // flushing: 0, // 冲水
    seatStatus: 0, // 着座状态 - 枚举值 0：未着座  1：着座
    workstatus: 0, // 工作状态 - 枚举值 0：臀洗中  1：妇洗中 2：烘干中 3：喷枪清洗中
    flushingStatus: 0, // 冲水状态 - 枚举值 0：空闲  1：冲水中  2：蓄水中 

    washingSwitch: 0, // 冷热按摩
    moveClean: 0,   // 移动清洗
    InjectorClean: 0, // 喷嘴清洁
    nightLight: 0, // 夜灯
    heatRing: 0, // 座圈
    closeroof: 0, //座盖

    waterGageTrim: 0, // 水压      枚举值 0：1挡  1：2挡  2：3挡
    waterTempTrim: 0, // 水温       枚举值 0：关  1：低  2：中  3：高
    nozzleLocation: 1, // 喷嘴位置  枚举值 0：1挡  1：2挡  2：3挡  3：4挡  4：5挡
    seatTempTrim: 2, // 座温        枚举值 0：关  1：低  2：中  3：高
    windTempTrim: 0, // 风温        枚举值 0：关  1：低  2：中  3：高
    windspeed: 0,  // 风速          枚举值 0：1挡  1：2挡  2：3挡
    windStatus: 0, // 风速状态
    mode: 6,
    /* 附加功能 */
    AutoFlip: 0, // 微波开关
    // flipType: 1, // 微波类型 - 枚举值 0：无微波  1：带微波
    ringLubrication: 0, // 润圈开/关
    // knobLight: 0, // 旋钮灯光开/关
    // knobKickStatus: 3, // 脚踢/旋钮状态 -  枚举值 0：全不带  1：脚踢  2：旋钮  3：脚踢+旋钮
    kickLight: 0, // 脚踢灯光开/关
    standFlushWater: 0, // 离座冲水
    /* 座圈加热时间 */
    heatRingSaving: 0, // 座圈加热节能
    heatRingSavingStartTime: 178, // 座圈加热节能开始时间
    heatRingSavingFinishTime: 20, // 座圈加热节能结束时间
    FilterLifeTimeDays: 100, // 滤芯剩余寿命
    faultReportEvent: 2,
    faultReport: '12000',
    autoDeodorization: 0,
    dryFlush: 0
  }
}
const getters = {
  dataSource(state) {
    return state.LightScene.ColorArr
  }
}
const mutations = {
  changeLightScene(state, object) {
    state.LightScene = Object.assign({}, { ...state.LightScene, ...object })
  },
  changeDeviceStatus(state, deviceStatus) {
    state.deviceStatus = deviceStatus
  },
  changeDeviceData(state, object) {
    state.deviceData = Object.assign(
      {},
      {
        ...state.deviceData,
        ...object,
        isInit: false
      }
    )
  },
  initDeviceData(state, object) {
    state.deviceData = Object.assign(state.deviceData, {
      ...object,
      isInit: true
    })
  },
  changeSelectColor(state, object) {
    state.selectColor = Object.assign({}, { ...state.selectColor, ...object })
  },
  changeMusicSceneHash(state, object) {
    state.musicSceneHash = Object.assign(
      {},
      { ...state.musicSceneHash, ...object }
    )
  }
}

export default { state, getters, mutations }
