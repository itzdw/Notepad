import Vue from 'vue'
import wxAuth from './wxAuth'

const app = new Vue(wxAuth)
app.$mount()

export default{
    // 这个字段走 app.json
    config: {
        navigationBarTitleText:'微信授权',
        enablePullDownRefresh:false
    }
}