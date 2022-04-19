export default (data, HEX) => {
  console.warn('-',data,HEX)
  const addZero = (length, value) => {
    const padStart = 2
    const reverseString = str => {
      // 2 之后改成可配
      const b = str.slice(0, padStart)
      const c = str.replace(b, '')
      return c.concat(b)
    }
    if (length === 2) {
      // 默认都是转成16进制
      const zeroHex = value.toString(16).padStart(length * padStart, '0')
      return reverseString(zeroHex)
    }
    if (length === 1) {
      return value.toString(16).padStart(length * padStart, '0')
    }
  }
  let hex = ''
  const addHex = (subValue, iLop_property, value_length, key) => {
    // 如果有子级
    if (subValue) {
      hex += addZero(2, key)
      subValue.forEach(subV => {
        const subVKey = subV.iLop_property
        const subVValue = subV.value_length
        if (data[iLop_property]) {
          hex += `${addZero(subVValue, data[iLop_property][subVKey])}`
        }
      })
    } else {
      hex += `${addZero(2, key)}${addZero(value_length, data[iLop_property])}`
    }
  }
  Object.entries(HEX).forEach(v => {
    const key = v[0]
    const value = v[1] as {
      iLop_property: string
      value_length: number
    }
    const { iLop_property, value_length } = value
    // 常规路径，飞燕字段和hex一一对应
    if (typeof iLop_property === 'string') {
      if (data[iLop_property] !== undefined) {
        addHex('', iLop_property, value_length, key)
      }
    }

    if (Array.isArray(iLop_property)) {
      // TODO: 如果是窗帘自定义类型
    }

    if (!Array.isArray(iLop_property) && typeof iLop_property !== 'string') {
      Object.keys(iLop_property).forEach(v => {
        if (Array.isArray(iLop_property[v])) {
          // 如果有subvalue
          addHex(iLop_property[v], v, value_length, key)
        } else {
          data[v] !== undefined && addHex('', v, value_length, key)
        }
      })
    }
  })
  return hex
}
