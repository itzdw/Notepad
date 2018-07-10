import Vue from 'vue'
import newsToday from './newsToday'

const app = new Vue(newsToday)
app.$mount()

export default{
    // 这个字段走 app.json
    config: {
        navigationBarTitleText:'今日内容',
        enablePullDownRefresh:true
    }
}