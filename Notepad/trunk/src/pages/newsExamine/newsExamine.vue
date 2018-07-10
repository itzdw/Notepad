<template>
  <div class="container" @touchstart="touchstartHandle($event)" @touchmove="touchmoveHandle($event)" @touchend="touchendHandle($event)">
    <nav-tab :list="navList" @change-nav="switchNav" :nav-index="state"></nav-tab>
    <!-- 有权限查看 -->
    <section v-if="!isLoading">
      <!-- <scroll-container :list="newsList">
        <div style="height:100%"> -->
          <ul class="news-list" v-if="newsTotal!=0">
            <li class="news-item" v-for="(item,index) in newsList" :key="index">
              <section class="article-wrapper">
                <article class="article-content">
                  <p class="txt selectable">
                    <text :selectable="true">{{item.content}}</text>
                    <!-- <a href="#" class="more">更多</a> -->
                  </p>
                </article>
              </section>
              <section class="thumb-wrapper" v-if="item.images.length!=0">
                <thumb-list :list="item.images" @stop-on-show="stopOnShow"></thumb-list>
              </section>
              <section class="publish-wrapper">
                <span class="nickname">{{item.nickname}}</span>
                <time class="time">{{item.createtime}}</time>
                <div class="examine" v-if="item.state===0">
                  <span class="status" @click="examine(item.id,1)" v-if="level==1">
                    <img src="../../../static/image/pass.png" style="width:20px;height:20px;" />
                  </span>
                  <span class="status" @click="examineFail(item.id,2)" v-if="level==1">
                    <img src="../../../static/image/error.png" style="width:20px;height:20px;" />
                  </span>
                  <span class="status no" v-if="level!=1">
                    {{item.state_cn}}
                  </span>
                </div>
                <div class="examine examine-txt status" :class="{'pass':item.state==1,'fail':item.state==2}" v-else>
                  {{item.state_cn}}
                </div>
              </section>
            </li>
          </ul>
          <p v-if="!more" class="no-more">没有更多数据了</p>
          <no-result v-if="newsTotal==0" :text="'暂时没有待审核内容'"></no-result>
          <div class="picker-examine" v-if="isShowDate"  @click="isShowDate=false">
            <main @click.stop="isShowDate=true">
              <h2 class="title">日期选择</h2>
              <picker mode="date" :value="date" start="2018-01-01" end="2050-12-31" @change="dateChange" class="picker-wrapper">
                <view class="picker">日期: {{date}}</view>
              </picker>
              <section class="btn-wrapper">
                <button class="btn" @click="submit()">提交</button>
              </section>
            </main>
          </div>
        <!-- </div>
      </scroll-container> -->
    </section>
  </div>
</template>

<script>
import util from '@/util'
import ThumbList from '@/components/ThumbList'
import NoResult from '@/components/NoResult'
import NavTab from '@/components/NavTab'
import ScrollContainer from '@/components/ScrollContainer'

export default {
  data () {
    return {
      newsList:[],
      newsTotal:0,
      pageIndex:1,
      pageSize:10,
      isShowDate:false,
      date:util.formatDate(new Date().getTime(),"YYYY-MM-DD"),
      more:true,
      level:wx.getStorageSync('level')||0,
      state:0,
      navList:[],
      isLoading:true,
      isOnShow:false//阻止预览图片退出时重新渲染onshow事件
    }
  },
  components: {
    ThumbList,NoResult,NavTab,ScrollContainer
  },
  methods: {
    touchstartHandle(e){
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    touchmoveHandle(e){
      const touch = e.touches[0]
      this.deltaX = touch.pageX - this.touch.startX
      this.deltaY = touch.pageY - this.touch.startY
      this.direction = this.deltaX > 0 ? 'right':'left'
    },
    touchendHandle(e){
      this.touch.endX = this.deltaX
      if(Math.abs(this.deltaY)>Math.abs(this.deltaX)){
        return false
      }
      if(Math.abs(this.deltaX)>50){
        if(this.direction=='left'){
          this.state++
          if(this.state>2){
            this.state=2
            return false
          }
        }else{
          this.state--
          if(this.state<0){
            this.state=0
            return false
          }
        }
        this.switchNav(this.state)
      }
      this.deltaX = 0
      this.deltaY = 0
    },
    stopOnShow(data){
      this.isOnShow = data
    },
    switchNav(index){
      this.newsTotal = 0
      this.state = index
      this.getNewsList(true)
    },
    dateChange(e) {
      this.date= e.target.value
    },
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
      
      const res = await util.post('/api/content/GetContentInfoAll',{
        state:this.state,
        page_index:this.pageIndex,
        page_size:this.pageSize
      })

      this.navList = [
        {
          name:'全部',
          count:res.count.all>9999?'9999+':res.count.all
        },
        {
          name:'未审核',
          count:res.count.unreviewed>9999?'9999+':res.count.unreviewed
        },
        {
          name:'已审核',
          count:res.count.audited>9999?'9999+':res.count.audited
        }
      ]

      if (res.list.length < this.pageSize && this.pageIndex > 1) {
        this.more = false
      }

      if (res.list.length < this.pageSize && this.pageIndex > 1) {
        this.more = false
      }

      if(init){
        this.newsList = res.list
        this.newsTotal = res.total
        wx.stopPullDownRefresh()
      }else{
        // 下拉刷新，不能直接覆盖,而是累加
        this.newsList = this.newsList.concat(res.list)
      }

      setTimeout(()=>{
        this.isLoading = false
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      },300)
    },
    async examine(id,state){
      this.id = id
      this.state = state
      this.isShowDate = true
    },
    async submit(){
      const res = await util.post('/api/content/auditcontentinfo',{
        id:this.id,
        state:this.state,
        day:this.date
      })
      util.showModal('成功', `审核通过！`)
      this.isShowDate = false
      this.getNewsList(true)
    },
    async examineFail(id,state){
      const res = await util.post('/api/content/auditcontentinfo',{
        id,
        state,
        day:this.date
      })
      util.showModal('成功', `审核不通过！`)
      this.getNewsList(true)
    }
  },
  onShareAppMessage(res){
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
    this.touch = {}
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable"
.news-list
  flex 1
  margin-top 1rpx
  color $color-text-d
  .news-item
    background-color $color-white
    margin-bottom 20rpx
    padding 20rpx
    .publish-wrapper
      padding-top 20rpx
      display flex
      justify-content space-between
      .nickname
        color $color-text
        flex 2
      .time
        color $color-text-l
        font-size 26rpx
        flex 2
      .examine
        flex 2
        display flex
        .status
          flex 1
          display flex
          justify-content flex-end
          &.no 
            color $color-text-ll
        &.examine-txt 
          justify-content flex-end
.picker-examine
  height 100%
  width 100%
  background rgba(0,0,0,0.1)
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 1
  main
    width 400rpx
    padding 50rpx
    background-color $color-white
    position fixed
    z-index 2
    top 50%
    left 50%
    transform translate(-50%,-50%)
    text-align center
    .title
      padding-bottom 40rpx
      color $color-text-l
    .btn-wrapper
      margin-top 50rpx
    .picker-wrapper
    .picker
      text-align center
      background-color #f5f5f5
      padding 10rpx 0
      margin 0 5rpx
</style>
