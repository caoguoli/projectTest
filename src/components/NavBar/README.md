### NavBar 使用文档

### 属性(props)

| 参数       | 说明                                                        | 类型     | 默认值      |
| ---------- | ----------------------------------------------------------- | -------- | ----------- |
| title      | 标题 - 必传                                                 | _string_ | `'标题'`    |
| theme      | 主题样式(支持 default-白底黑字 和 transparen-透明白字 主题) | _string_ | `'default'` |
| right-icon | 右侧 right-icon 按钮,不需要的话设置 right-icon=''           | _string_ | `''`        |

### 插槽 (slots)

### 事件(events)

| 参数       | 说明         | 类型       | 默认值 |
| ---------- | ------------ | ---------- | ------ |
| back       | 返回按钮事件 | _function_ | `-`    |
| rightClick | 右侧按钮事件 | _function_ | `-`    |
