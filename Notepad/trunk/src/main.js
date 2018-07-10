// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import './common/stylus/index.styl'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default{
  // 这个字段走 app.json
  
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/wxAuth/main',
      'pages/newsMine/main',
      'pages/newsPublish/main',
      'pages/newsToday/main',
      'pages/newsExamine/main'
    ],
    window: {
      backgroundColor:'#e0e0e0',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '汇内容',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh:true
    },
    tabBar: {
      selectedColor: '#8fd25e',
      backgroundColor:'#ffffff',
      borderStyle: 'black',
      list:[
        {
          pagePath: 'pages/newsToday/main',
          text: '今日内容',
          iconPath: 'static/image/home.png',
          selectedIconPath: 'static/image/home_active.png'
        },
        {
          pagePath: 'pages/newsMine/main',
          text: '我的内容',
          iconPath: 'static/image/mine.png',
          selectedIconPath: 'static/image/mine_active.png'
        },
        {
          pagePath: 'pages/newsPublish/main',
          text: '发布内容',
          iconPath: 'static/image/publish.png',
          selectedIconPath: 'static/image/publish_active.png'
        },
        {
          pagePath: 'pages/newsExamine/main',
          text: '全部内容',
          iconPath: 'static/image/examine.png',
          selectedIconPath: 'static/image/examine_active.png'
        }
      ]
    }
  }
}