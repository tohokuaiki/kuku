const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/kuku99',
  pages: {
    index: {
      entry: 'src/main.js', // 必須パラメータ
      title: '九九の練習をしよう',
    }
  },
  transpileDependencies: true,
  devServer: {
  }
})
