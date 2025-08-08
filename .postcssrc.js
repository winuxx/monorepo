export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.4",
        "iOS 7.1",
        // "Chrome > 31",
        // "ff > 31",
        // "ie >= 8",
        'last 10 versions'
      ],
    },
    'postcss-pxtorem':{
        // 开头大写的Px 不转换 => height: 100Px, 内联样式不转换，需要 / 75 转成 rem
        rootValue: 16, // 设计稿宽度除以 10 // 应与 root font size 保持一致；可调整此值来缩放页面，但可能会出现错位现象
        unitPrecision: 6, // 计算结果保留 6 位小数
        selectorBlackList: ['.no-rem', 'no-rem'], // 要忽略的选择器并保留为px。
        propList: ['*', '!border'], // 可以从px更改为rem的属性  感叹号开头的不转换
        replace: true, // 转换成 rem 以后，不保留原来的 px 单位属性
        mediaQuery: true, // 允许在媒体查询中转换px。
        minPixelValue: 2, // 设置要替换的最小像素值。
        // exclude: /node_modules/ // 排除 node_modules 文件(node_modules 内文件禁止转换)
        exclude: null,
    }
  }
}
