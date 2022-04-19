import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const { pathname } = window.location
const PAGE_NAME =
  process.env.NODE_ENV !== 'production'
    ? pathname.replace(/(^\/)|(.html$)/g, '')
    : require('../../env.json').PAGE
const injectStore = require(`../../src/pages/${PAGE_NAME}/store`).default
export default new Vuex.Store({
  state: {
    deviceStatus: 1,
    deviceStatusDetail: {
      value: 1,
      remoteStatus: 1,
      localStatus: 1
    },
    networkStatus: {
      type: '4G',
      status: true
    },
    ...injectStore.state
  },
  getters: {
    ...injectStore.getters
  },
  mutations: {
    changeDeviceStatus(state, deviceStatus) {
      state.deviceStatus = deviceStatus
    },
    changeDeviceStatusDetail(state, object) {
      state.deviceStatusDetail = Object.assign({}, object)
    },
    changeNetworkStatus(state, status) {
      state.networkStatus = Object.assign(
        {},
        { ...state.networkStatus, ...status }
      )
    },
    changeDeviceData(state, object) {
      state.deviceData = Object.assign({}, { ...state.deviceData, ...object })
    },
    changeDeviceHex(state, totalHex) {
      const object = {}
      function hex2ilop(hex) {
        const reverseString = str => {
          const padStart = 2
          const b = str.slice(0, padStart)
          const c = str.replace(b, '')
          return c.concat(b)
        }

        const hex2Int = (value_length, valueHex) => {
          return value_length === 2
            ? parseInt(reverseString(valueHex), 16)
            : parseInt(valueHex, 16)
        }
        // FIXME: 如果是要支持hex, 需要有hex文件去根据配置解析成hex，参考单火开关
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const HEX = require(`../../src/pages/${PAGE_NAME}/hex.json`)
        Object.entries(HEX).forEach(v => {
          const key = v[0]
          const value = v[1]
          const { iLop_property, value_length } = value
          // 兼容上报的数据补位还原成真实数据
          const keyHexAfter = (
            `0x${reverseString(hex.slice(0, key.length))}` & '0x7fff'
          )
            .toString(16)
            .padStart(4, '0')
            .toUpperCase()
          if (keyHexAfter === key) {
            const valueHex = hex.slice(
              key.length,
              key.length + value_length * 2
            )
            if (
              typeof iLop_property === 'string' &&
              iLop_property !== 'version'
            ) {
              // version表示版本号可以直接过滤
              object[iLop_property] = hex2Int(value_length, valueHex)
            }

            if (Array.isArray(iLop_property)) {
              // TODO: 如果是窗帘自定义类型
            }
            if (
              !Array.isArray(iLop_property) &&
              typeof iLop_property !== 'string'
            ) {
              Object.keys(iLop_property).forEach(v => {
                if (Array.isArray(iLop_property[v])) {
                  let pos = 0
                  iLop_property[v].forEach(subV => {
                    const subVKey = subV.iLop_property
                    const subVValue = subV.value_length
                    object[v] = {
                      ...object[v],
                      [subVKey]: hex2Int(
                        subVValue,
                        valueHex.slice(pos, pos + subVValue * 2)
                      )
                    }
                    pos += subVValue * 2
                  })
                } else {
                  object[v] = hex2Int(value_length, valueHex)
                }
              })
            }

            const afterHex = hex.slice(
              keyHexAfter.length + valueHex.length,
              hex.length
            )

            if (afterHex) {
              return hex2ilop(afterHex)
            }
          }
        })
      }
      hex2ilop(totalHex)
      console.log('changeDeviceData', totalHex, object)
      this.commit('changeDeviceData', object)
    },
    ...injectStore.mutations
  }
})
