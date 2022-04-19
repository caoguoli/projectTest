# agreement.html
用户协议弹框
# 智家精灵，佛照，无限极 h5

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn start
```

### Compiles and minifies for production

```
mxchip build PAGE=MeshLight
其中 MeshLigh5根据自己需要打包的页面修改
```

### mxchip-cli

```
https://rd.mxchip.com/mx/mxchip-cli
```

### Lints and fixes files

```
yarn lint
```

echarts 通过 cdn 引入

### 目标: 新接入的 app 通过不同的分支来管理

### 目前有的 app:

- master
  - 智家精灵
  - 佛照
  - 无限极
  - 泰勒

### 提 mr 的基本流程

- commit 格式

  - "feat: xx 设备 xx 功能"
  - "fix: 修复 xx 设备 xx 功能"
  - demo: "feat: mesh2 路灯泡 ui", "fix: mesh2 路灯泡 滑动跳变"

- 更新以下设备列表的 README.md

### 设备列表：

- Xikong-Closestool
  - 智家精灵 - 矽控
- Jinfenglin-Closestool
  - 智家精灵 - 金枫林
- Curtain
  - 智家精灵 - 杜亚甜筒窗帘
- MeshLight
  - 智家精灵 - mesh 1,2,3,4,5 路灯
- Gateway
  - 智家精灵 - 网关
- MeshSingleFireSwitch
  - 智家精灵 - 一，二，三键单火开关
- MeshWirelessButton
  - 智家精灵 - 无线按钮
- MeshWirelessSwitch
  - 智家精灵 - 一，二，三，四键无线开关
- MeshZgrill
  - 智家精灵 - 泰乐\_烤炉
- Xinke-Airconditioner
  - 智家精灵 - 新科空调 KY-32
- Zhigao-AirConditioner
  - 智家精灵 - 志高智能空调
- Deye-Dehumidifier
  - 智家精灵 - 德业除湿机
- CeilingLamp
  - 佛照 - wifi 吸顶灯
- MeshSimonThermostat
  - 中天西蒙温控器
- MeshTaijiHotel
  - 泰基四键开关
- IKAHE-Toilet
  - 怡和卫浴马桶
- MeshTaijiHotelMultifunction
  - 泰基多功能开关(V3)

### 各个分支专有的一些内容 

- pages
- public/index.html iconfont 库是在这里引入的

### 公共提交的一些代码

- utils
- views
- bizComponents
- components

### 发布平台

- 无限极 https://infdev-cloud.mxchip.com/admin/#/user/login

- dev https://dev-admin.cloud.mxchip.com/#/h5panel/details?pid=17&name=MESH_%E5%8F%8C%E9%94%AE%E6%97%A0%E7%BA%BF%E6%99%BA%E8%83%BD%E5%BC%80%E5%85%B3-DEV

- prod https://admin.cloud.mxchip.com:3443/#/h5panel/index

- 佛照 prod https://web.fslmall.cn/admin/

### FEATURE

- [] 优化打包逻辑
  - 基本完成，后续需要将使用到的 vant 组件自己实现
- [x] 根据 app 产出不同的颜色体系 => 新安已实现，并且考虑是 h5 并不存在兼容性问题，故去掉 cssvars
  - 项目中已用到 var(--color) 与 cssvars 方案不兼容需要另找方式来实现。
  - cssvars 方案 :96d50fa078e0dc60bb1328189fb81c92d2772a9b
- [x] \$mx.device.setProperties 如果是在 app 则通过 store 改变值实现本地 mock => MeshLight 已实现
- [x] 使用\$mx.deivce 的时候，自动提示 device 命名空间下有哪些方法
- [x] bizComponents 下的业务组件抽取，components 下通用型组件抽取



全开：0， 1 
其他： 属性1，属性2，属性3，属性4，

1、全开为1， 以全开为准，
2、全开为0，以其他属性为准。


默认： 全关，5100：0，
点击四键， 1开3关，5100:0，
点击四键，3开1关，5100:0，
点击四键，4开，5100:1，

点击全开， 不管，5100:1 
点击全开， 实际，5100:0
