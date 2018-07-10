<template>
  <div class="container">
    <div class="wx-auth flex-box center">
      <main>
        <section class="hd">
          <img src="../../../static/image/logo.png" alt="" />
        </section>
        <!-- <section class="bd">
          登录后可体验完整功能
        </section> -->
        <section class="ft btn-wrapper">
          <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo" class="btn" v-if="level!=0">{{btnText}}</button>
          <button class="btn" v-else>{{btnText}}</button>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import util from '@/util'
import config from '@/config'
import NoResult from '@/components/NoResult'
import ThumbList from '@/components/ThumbList'

export default {
  data () {
    return {
      isAuth:true,
      btnText:'加载中',//微信一键登录
      level:0
    }
  },
  components: {
    NoResult,ThumbList
  },
  methods: {
    init(){
      wx.clearStorageSync()
      this.wxLogin()
    },
    async onGotUserInfo(e) {
      // console.log(e.target.errMsg)
      // console.log(e.target.rawData)
      // console.log(e.target.userInfo)
      if(e.target.userInfo){
        wx.setStorageSync('userInfo',e.target.userInfo)
        this.saveUserInfo()
        if(wx.getStorageSync('guidkey')){
          wx.switchTab({
            url: '/pages/newsToday/main'
          })
        }
      }
    },
    async wxLogin(){
      wx.login({
        success:res=>{
          if(res.code){
            wx.request({
              url: config.loginUrl,
              method:'POST',
              header:{'content-type':'application/x-www-form-urlencoded'},
              data: {
                code:res.code
              },
              success:res=> {
                if(res.data.Status==200){
                  wx.setStorageSync('guidkey',res.data.Data.guidkey)
                  wx.setStorageSync('level',Number(res.data.Data.level))
                  this.level = wx.getStorageSync('level')
                  if(this.level===0){
                    this.btnText = "您暂时没有权限访问"
                    return false
                  }
                  this.getAuth()
                }
              }
            })
          }
        }
      })
    },
    async checkSession(){
      wx.checkSession({
        success:()=>{
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail:()=>{
          // session_key 已经失效，需要重新执行登录流程
          this.wxLogin()//重新登录
        }
      })
    },
    async saveUserInfo(){
      const userInfo = wx.getStorageSync('userInfo')
      const data = await util.post('/api/user/saveuserinfo',{
        guidkey:wx.getStorageSync('guidkey'),
        nickName:userInfo.nickName,
        avatarUrl:userInfo.avatarUrl,
        gender:userInfo.gender,
        country:userInfo.country,
        province:userInfo.province,
        city:userInfo.city
      })
    },
    async getAuth(){
      wx.getSetting({
        success:res=>{
          // console.log(res)
          if (res.authSetting['scope.userInfo']) { 
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            this.authSuccess()
          }else{
            this.btnText = '微信一键登录'
          }
        }
      })
    },
    async authSuccess(){
      wx.getUserInfo({
        lang:'zh_CN',
        success:res=> {
          wx.setStorageSync('userInfo',res.userInfo)
          this.saveUserInfo()
          if(wx.getStorageSync('guidkey')){
            wx.switchTab({
              url: '/pages/newsToday/main'
            })
          }
        }
      })
      
    }
  },
  onPullDownRefresh(){
    this.init()
    wx.stopPullDownRefresh()
  },
  onShow(){
    this.init()
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable"
.wx-auth
  height 100%
  background-color $color-white
  padding 30rpx
  .hd
    text-align center
    padding-bottom 50rpx
    img 
      width 150rpx
      height 150rpx
      margin 0 auto
  .bd
    padding 50rpx 0
    text-align center
    color $color-text-l
  .ft
    padding-top 100rpx
    padding-bottom 150rpx
    .btn
      width 500rpx
      border-radius 100rpx
</style>