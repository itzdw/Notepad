<script>
import config from './config'
import util from './util'
export default {
  async created () {
    this.updateVersion()

    wx.onNetworkStatusChange(res=>{
      console.log(res.isConnected)
      console.log(res.networkType)
    })
    if(wx.getStorageSync('guidkey')){
      this.checkSession()
    }else{
      this.wxLogin()
    }

  },
  methods:{
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
          if (!res.authSetting['scope.userInfo']) {
            // wx.authorize({
            //   scope: 'scope.userInfo',
            //   success:res=>{
            //     wx.getUserInfo({
            //       lang:'zh_CN',
            //       success:res=> {
            //         wx.setStorageSync('userInfo',res.userInfo)
            //         this.saveUserInfo()
            //       }
            //     })
            //   }
            // })
          }else{
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              lang:'zh_CN',
              success:res=> {
                wx.setStorageSync('userInfo',res.userInfo)
                this.saveUserInfo()
              }
            })
          }
        }
      })
    },
    updateVersion(){
      const updateManager = wx.getUpdateManager()

      updateManager.onCheckForUpdate((res)=> {
        // 请求完新版本信息的回调
        if(res.hasUpdate){
          updateManager.onUpdateReady(()=> {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: res=> {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })

          updateManager.onUpdateFailed(()=> {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })

    }
  }
}
</script>

<style lang="stylus">
@import "./common/stylus/variable"
* 
  margin 0
  padding 0
  box-sizing border-box
page
  height 100%
  background-color #f5f5f5
  font-font-family '微软雅黑'
.container
  width 100%
  height 100%
  display flex
  flex-direction column
  box-sizing border-box
  color #333333
  font-size 30rpx
table 
  width 100%
  display table
  border-collapse separate
  border-spacing 2px
  border-color grey
  tr 
    display table-row
    vertical-align middle
    border-color inherit
  td
  th
    display table-cell
    vertical-align inherit
i 
em
u 
b
span
a
  display inline-block
  vertical-align top

.btn-wrapper
  ._button
  button
  .btn
    background-color $color-luxury
    border 1rpx solid $color-luxury
    border-radius 10rpx
    overflow hidden
    color #ffffff
    height 100rpx
    line-height 100rpx
    font-size 32rpx
    &:active
      background-color darken($color-luxury,10)

.no-more
  text-align center 
  padding-bottom 20rpx
  color #999999
</style>
