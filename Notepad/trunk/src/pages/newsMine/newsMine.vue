<template>
  <div class="container" @touchstart="touchstartHandle($event)" @touchmove="touchmoveHandle($event)" @touchend="touchendHandle($event)">
    <nav-tab :list="navList" @change-nav="switchNav" :nav-index="state"></nav-tab>
    <main v-if="!isLoading">
      <!-- <section class="pass-num" v-if="state==1">您当前的通过数为：{{newsTotal}}</section> -->
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
          <section class="thumb-wrapper">
            <thumb-list :list="item.images" @stop-on-show="stopOnShow"></thumb-list>
          </section>
          <section class="time-wrapper">
            <time class="time">{{item.createtime}}</time>
            <span class="status" :class="{'pass':item.state==1,'fail':item.state==2}">
              {{item.state_cn}}
            </span>
            <span class="status" v-if="item.state==0||item.state==2">
              <img src="../../../static/image/delete.png" class="status-delete" mode="aspectfill" @click="deleteNew(item.id)"/>
            </span>
          </section>
        </li>
      </ul>
      <p v-if="!more" class="no-more">没有更多数据了</p>
      <no-result v-if="newsTotal==0"></no-result>
    </main>
  </div>
</template>

<script>
import util from '@/util'
import NoResult from '@/components/NoResult'
import ThumbList from '@/components/ThumbList'
import NavTab from '@/components/NavTab'

export default {
  data () {
    return {
      newsList:[],
      newsTotal:0,
      pageIndex:1,
      pageSize:10,
      more:true,
      navList:[{
          name:'全部',
          count:0
        },
        {
          name:'已通过',
          count:0
        },
        {
          name:'未通过',
          count:0
        }],
      navCurrent:'全部',
      state:0,
      isLoading:true,
      isOnShow:false//阻止预览图片退出时重新渲染onshow事件
    }
  },
  components: {
    NoResult,ThumbList,NavTab
  },
  created(){
    this.touch = {}
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
      
      const res = await util.post('/api/content/getmycontentlist',{
        guidkey:wx.getStorageSync('guidkey'),
        page_index:this.pageIndex,
        page_size:this.pageSize,
        state:this.state
      })

      this.navList = [
        {
          name:'全部',
          count:res.count.all>9999?'9999+':res.count.all
        },
        {
          name:'已通过',
          count:res.count.success>9999?'9999+':res.count.success
        },
        {
          name:'未通过',
          count:res.count.fail>9999?'9999+':res.count.fail
        }
      ]

      if (res.list.length < this.pageSize && this.pageIndex > 1) {
        this.more = false
      }

      if(init){
        this.newsList = res.list
        this.newsTotal = res.total
        wx.stopPullDownRefresh()
      }else{
        // 下拉刷新，不能直接覆盖books 而是累加
        this.newsList = this.newsList.concat(res.list)
      }

      setTimeout(()=>{
        this.isLoading = false
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      },300)
    },
    async deleteNew(selectedId){
      wx.showActionSheet({
        itemList: ['确定删除吗？'],
        itemColor:'#df4d75',
        success: res=> {
          // console.log(res.tapIndex)
          if(res.tapIndex===0){
            this.deleteAction(selectedId)
          }
        },
        fail: res=>{
          // console.log(res.errMsg)
        }
      })
    },
    async deleteAction(selectedId){
      wx.showNavigationBarLoading()

      const res = await util.post('/api/content/delcontentinfo',{
        guidkey:wx.getStorageSync('guidkey'),
        id:selectedId
      })

      wx.hideNavigationBarLoading()

      let index = this.newsList.findIndex(item=>item.id==selectedId)
      this.newsList.splice(index,1)

      util.showSuccess('删除成功！')
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
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable"
.pass-num
  height 80rpx
  line-height 80rpx
  background-color $color-white
  margin-top 2rpx
  text-align center
  color $color-text
.news-list
  flex 1
  margin-top 1rpx
  color $color-text-d
  .news-item
    background-color $color-white
    margin-bottom 20rpx
    padding 20rpx
    .time-wrapper
      padding-top 20rpx
      display flex
      justify-content space-between
      .time
        color $color-text-l
        font-size 26rpx
      .status
        &.pass
          color $color-theme
        &.fail
          color $color-warn
        .status-delete
          width 40rpx
          height 40rpx
</style>
