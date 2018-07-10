import Vue from 'vue'
import newsExamine from './newsExamine'

const app = new Vue(newsExamine)
app.$mount()

export default{
    // 这个字段走 app.json
    config: {
        navigationBarTitleText:'全部内容',
        enablePullDownRefresh:true
    }
}
