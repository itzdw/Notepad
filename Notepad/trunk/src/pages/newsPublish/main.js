import Vue from 'vue'
import newsPublish from './newsPublish'

const app = new Vue(newsPublish)
app.$mount()

export default{
    // 这个字段走 app.json
    config: {
        navigationBarTitleText:'发布内容',
        enablePullDownRefresh:false
    }
}
