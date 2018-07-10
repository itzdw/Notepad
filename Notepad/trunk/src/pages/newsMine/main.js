import Vue from 'vue'
import newsMine from './newsMine'

const app = new Vue(newsMine)
app.$mount()

export default{
    // 这个字段走 app.json
    config: {
        navigationBarTitleText:'我的内容',
        enablePullDownRefresh:true
    }
}