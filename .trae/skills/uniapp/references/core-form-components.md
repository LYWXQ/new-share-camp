---
name: 表单组件
description: 输入、选择和表单控制组件。在使用 uni-app 的 input、textarea、picker、checkbox、radio、switch、slider 等表单组件时调用此技能。
---

# 表单组件

## input

单行文本输入。

```vue
<template>
  <input
    v-model="inputValue"
    type="text"
    placeholder="请输入文本"
    :maxlength="100"
    :focus="true"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
    @confirm="onConfirm"
  />
</template>
```

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| value | String | | 输入值 |
| type | String | text | 输入类型：text/number/idcard/digit/tel |
| password | Boolean | false | 密码输入 |
| placeholder | String | | 占位符文本 |
| placeholder-style | String | | 占位符内联样式 |
| placeholder-class | String | | 占位符 CSS 类 |
| maxlength | Number | 140 | 最大字符长度 |
| cursor-spacing | Number | 0 | 光标距离键盘底部的距离（px） |
| focus | Boolean | false | 自动聚焦 |
| confirm-type | String | done | 回车键类型：send/search/next/go/done |
| confirm-hold | Boolean | false | 确认后保持键盘打开 |

**事件：**
- `@input` - 输入值变化
- `@focus` - 输入框聚焦
- `@blur` - 输入框失焦
- `@confirm` - 确认按钮点击
- `@keyboardheightchange` - 键盘高度变化

## textarea

多行文本输入。

```vue
<template>
  <textarea
    v-model="content"
    placeholder="请输入内容"
    :maxlength="500"
    :auto-height="true"
    :show-confirm-bar="false"
    @linechange="onLineChange"
  />
</template>
```

**附加属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| auto-height | Boolean | false | 自动调整高度 |
| fixed | Boolean | false | 滚动时固定位置 |
| cursor | Number | | 光标位置 |
| show-confirm-bar | Boolean | true | 显示推荐栏（微信） |
| selection-start | Number | -1 | 选择起始位置 |
| selection-end | Number | -1 | 选择结束位置 |

## picker

从预定义选项中选择。

```vue
<template>
  <!-- 选择器模式 -->
  <picker mode="selector" :range="options" :value="selected" @change="onChange">
    <view>已选择：{{ options[selected] }}</view>
  </picker>

  <!-- 多列选择器 -->
  <picker mode="multiSelector" :range="multiOptions" @change="onMultiChange">
    <view>多选</view>
  </picker>

  <!-- 日期选择器 -->
  <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="onDateChange">
    <view>日期：{{ date }}</view>
  </picker>

  <!-- 地区选择器 -->
  <picker mode="region" :value="region" @change="onRegionChange">
    <view>地区：{{ region.join('-') }}</view>
  </picker>
</template>

<script>
export default {
  data() {
    return {
      options: ['选项 1', '选项 2', '选项 3'],
      selected: 0,
      multiOptions: [['A', 'B'], ['1', '2', '3']],
      date: '2024-01-01',
      startDate: '2020-01-01',
      endDate: '2025-12-31',
      region: ['北京市', '北京市', '东城区']
    }
  },
  methods: {
    onChange(e) {
      this.selected = e.detail.value
    },
    onDateChange(e) {
      this.date = e.detail.value
    },
    onRegionChange(e) {
      this.region = e.detail.value
    }
  }
}
</script>
```

**模式特定属性：**

| 模式 | 属性 |
|------|------|
| selector | range, range-key |
| multiSelector | range, range-key |
| time | start, end |
| date | start, end, fields (year/month/day) |
| region | custom-item, disable-sub-districts |

## picker-view

嵌入式选择器视图（内联，非弹出）。

```vue
<template>
  <picker-view :value="value" @change="onChange">
    <picker-view-column>
      <view v-for="item in years" :key="item">{{ item }}年</view>
    </picker-view-column>
    <picker-view-column>
      <view v-for="item in months" :key="item">{{ item }}月</view>
    </picker-view-column>
  </picker-view>
</template>
```

## radio / checkbox

选择控件。

```vue
<template>
  <!-- 单选组 -->
  <radio-group @change="onRadioChange">
    <label v-for="item in items" :key="item.value">
      <radio :value="item.value" :checked="item.checked" color="#007AFF" />
      {{ item.name }}
    </label>
  </radio-group>

  <!-- 复选组 -->
  <checkbox-group @change="onCheckboxChange">
    <label v-for="item in items" :key="item.value">
      <checkbox :value="item.value" :checked="item.checked" color="#007AFF" />
      {{ item.name }}
    </label>
  </checkbox-group>
</template>
```

**radio/checkbox 属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| value | String | | 标识值 |
| checked | Boolean | false | 选中状态 |
| disabled | Boolean | false | 禁用状态 |
| color | Color | | 选中颜色 |

## switch

开关切换。

```vue
<template>
  <switch
    :checked="isOn"
    :disabled="false"
    type="switch"
    color="#007AFF"
    @change="onSwitchChange"
  />
</template>
```

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| checked | Boolean | false | 选中状态 |
| disabled | Boolean | false | 禁用状态 |
| type | String | switch | 样式：switch/checkbox |
| color | Color | | 开启时的颜色 |

## slider

范围滑块输入。

```vue
<template>
  <slider
    :value="50"
    :min="0"
    :max="100"
    :step="1"
    :show-value="true"
    :disabled="false"
    activeColor="#007AFF"
    backgroundColor="#e9e9e9"
    block-size="28"
    @change="onChange"
    @changing="onChanging"
  />
</template>
```

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/input.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/textarea.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/picker.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/radio.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/checkbox.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/switch.md
- https://gitcode.com/dcloud/unidocs-zh/blob/main/docs/component/slider.md
-->
