<template>
  <div class="container">
    <main v-if="!isLoading">
      <ul class="news-list" v-if="newsTotal!=0">
        <li class="news-item" v-for="(item,index) in newsList" :key="index">
          <section class="article-wrapper">
            <article class="article-content">
              <p class="txt selectable">
                <text :selectable="true">{{item.content}}</text>
              </p>
            </article>
          </section>
          <section class="thumb-wrapper">
            <thumb-list :list="item.images" @stop-on-show="stopOnShow"></thumb-list>
          </section>
          <!-- <section class="time-wrapper">
            <time class="time">2018-06-25 12:25</time>
            <span class="status">√</span>
          </section> -->
        </li>
      </ul>
      <no-result v-if="newsTotal==0"></no-result>
    </main>
  </div>
</template>

<script>
import util from '@/util'
import NoResult from '@/components/NoResult'
import ThumbList from '@/components/ThumbList'

export default {
  data () {
    return {
      newsList: [],
      newsTotal: 0,
      pageIndex: 1,
      pageSize: 10,
      isShowAuth: true,
      more: true,
      level: wx.getStorageSync('level')||0,
      isLoading: true,
      isOnShow: false//阻止预览图片退出时重新渲染onshow事件
    }
  },
  components: {
    NoResult,ThumbList
  },
  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    let path = `pages/wxAuth/main?guidkey=${wx.getStorageSync('guidkey')}`
    return {
      title: '我发现了一个可以查询最新价格和最新款式的小程序',//分享标题
      path: path,
      imageUrl: 'http://t.img.i.hsuperior.com/5d49fead-65d0-4e7c-ac61-d23dc80863b5'
    }
  },
  methods: {
    async getNewsList(init){
      if(init){
        this.isLoading = true
        this.pageIndex = 1
        this.more = true
      }

      wx.showLoading({
        title:'加载中'
      })
      wx.showNavigationBarLoading()

      const res = await util.post('/api/content/getcontentinfoday',{
        page_index:this.pageIndex,
        page_size:this.pageSize
      })

      if (res.list.length < this.pageSize && this.pageIndex > 1) {
        this.more = false
      }

      if(init){
        this.newsList = res.list
        this.newsTotal = res.total
        wx.stopPullDownRefresh()
      }else{
        // 下拉刷新，不能直接覆盖newsList 而是累加
        this.newsList = this.newsList.concat(res.list)
      }

      setTimeout(()=>{
        this.isLoading = false
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      },300)
      
    }
  },
  onReachBottom () {
    if (!this.more) {
      // 没有更多了
      return false
    }
    if(Math.ceil(this.newsTotal/this.pageSize)>this.pageIndex){
      this.pageIndex++
      this.getNewsList()
    }
  },
  onPullDownRefresh(){
    this.getNewsList(true)
  },
  onShow(){
    //阻止图片退出预览时触发onshow事件
    if(this.isOnShow){
      return false
    }

    this.getNewsList(true)
    this.level = wx.getStorageSync('level')||0
    setTimeout(()=>{
      this.level = wx.getStorageSync('level')||0
    },500)
  },
  async created(){
    this.level = wx.getStorageSync('level')||0
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable"
.news-list
  flex 1
  margin-top 1rpx
  color #333333
  .news-item
    background-color #ffffff
    margin-bottom 20rpx
    padding 20rpx
    .time-wrapper
      padding-top 20rpx
      display flex
      justify-content space-between
      .time
        color #999999
        font-size 26rpx
.wx-auth
  position fixed
  width 500rpx
  top 50%
  left 50%
  transform translate(-50%,-50%)
  background-color #ffffff
  padding 30rpx
  .hd
    text-align center
    padding-bottom 50rpx
    border-bottom 1px solid #f5f5f5
  .bd
    padding 50rpx 0
</style>
