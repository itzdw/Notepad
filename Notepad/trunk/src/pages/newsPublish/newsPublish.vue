<template>
  <div class="container news-publish">
    <section class="publish-content">
      <textarea name="" id="" cols="30" rows="10" placeholder="请输入文字" v-model="newsContent" auto-focus auto-height class="textarea">
      </textarea>
    </section>
    <section class="flex-box flex-end mr-10 word-num">
      <p v-if="newsContent.length<=maxLen">您还可以输入{{maxLen-newsContent.length}}个字</p>
      <p class="fail" v-else>您已经超出{{newsContent.length-maxLen}}个字</p>
    </section>
    <section class="publish-thumb">
      <ul class="thumb-list">
        <li class="thumb-item" v-for="(item,index) in thumbList" :key="index">
          <img :src="item.path" mode="aspectFill" @click.stop="previewImage(item.path_server)"/>
          <progress :percent="item.upload_percent" stroke-width="12" color="pink" active class="thumb-progress" v-if="item.upload_percent<=100" />
          <span class="del" @click="delPhoto(item.path_server)">&times;</span>
        </li>
        <li class="thumb-item add" @click="uploadPhoto()" v-if="thumbList.length<6">
          +
        </li>
      </ul>
    </section>
    <section class="publish-submit btn-wrapper">
      <!-- <button open-type="getUserInfo" /> -->
      <button class="btn" @click="addNews">发表</button>
    </section>
  </div>
</template>

<script>
import util from '@/util'
import config from '@/config'
import ProgressCircle from '@/components/ProgressCircle'

export default {
  data () {
    return {
      newsContent:'',
      maxLen:128,
      thumbList:[],
      thumbNameList:[]
    }
  },
  components: {
    ProgressCircle
  },
  methods: {
    // 选择图片方法
    uploadPhoto(){
      wx.chooseImage({
        count:6-this.thumbList.length,//最多上传6张
        sizeType:['compressed'],
        sourceType: ['album', 'camera'],
        success:res=>{
          let tempFiles = res.tempFiles
          //把选择的图片 添加到集合里
          for(let i in tempFiles){
            if(this.thumbList.length<6){
              tempFiles[i]['upload_percent']=0
              tempFiles[i]['path_server']= tempFiles[i]['path']
              this.thumbList.push(tempFiles[i])
              // 上传图片
              if (tempFiles[i]['upload_percent'] == 0) {
                this.upload(tempFiles[i])
              }
            }
          }
        }
      })
    },
    async upload(tempFile){
      let imgUrl=''
      // wx.showToast({
      //   icon:"loading",
      //   title:"正在上传"
      // })
      let upload_task =  wx.uploadFile({
        url:config.uploadImageUrl,
        filePath:tempFile['path'],
        name:'file',
        header : {
          "Content-Type": "application/json"
        },
        success:res=>{
          if (res.statusCode != 200) { 
            wx.showModal({
              title:'上传失败',
              content:'图片数据量太大',
              showCancel:false
            })
            //删除失败图片数据
            const index = this.thumbList.findIndex(item=>item.path == tempFile['path'])
            this.thumbList.splice(index,1)
          }else{
            let data = JSON.parse(res.data)
            tempFile['path_server'] = data.Data.url
            tempFile['name'] = data.Data.name
          }
        },
        fail:e=>{
          wx.showModal({
            title:'提示',
            content:'上传失败',
            showCancel:false
          })
        },
        complete:()=> {
          wx.hideToast()  //隐藏Toast
        }
      })

      //上传 进度方法
      upload_task.onProgressUpdate(res=>{
        tempFile['upload_percent'] = res.progress
        if(res.progress>=100){
          let seconds = (tempFile['size']/40)>3000?3000:(tempFile['size']/40)
          setTimeout(()=>{
            tempFile['upload_percent'] += 1
          },seconds)
        }
      })
    },
    previewImage(ev){
      let preImgList = []
      this.thumbList.forEach(item => {
        preImgList.push(item.path_server)
      })
      wx.previewImage({
        current: ev,
        urls:preImgList
      })
    },
    delPhoto(selectedItem){
      const index = this.thumbList.findIndex(item=>item.path_server==selectedItem)
      this.thumbList.splice(index,1)
    },
    async addNews(){
      if(this.newsContent.length==0){
        util.showMsg('请输入内容！')
        return false
      }

      if(this.newsContent.length>this.maxLen){
        let maxLen = this.maxLen
        util.showMsg(`请输入不超过${maxLen}个字的内容！`)
        return false
      }

      if(this.thumbList.length<1){
        util.showMsg('请最少上传1张图片！')
        return false
      }

      util.showMsg('发布中')

      this.thumbNameList=[]
      this.thumbList.forEach(item => {
        this.thumbNameList.push(item.name)
      })

      const data = await util.post('/api/content/addcontentinfo',{
        guidkey:wx.getStorageSync('guidkey'),
        content:this.newsContent,
        images:this.thumbNameList.join(',')
      })

      util.showSuccess('发布成功')
      this.newsContent=''
      this.thumbList=[]
      this.thumbNameList=[]
    },
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/variable"
.news-publish
  font-size 30rpx
  overflow hidden
.publish-content
  padding 20rpx
  .textarea
    width 100%
    min-height 300rpx
    padding 10rpx
    box-sizing border-box
    font-size 30rpx
    background-color $color-white
.word-num
  color #999999
  .fail
    color $color-warn
.publish-thumb
  padding 20rpx
  flex 1
  .thumb-list
    clear both
    margin-right -30rpx
    .thumb-item
      float left
      width 225rpx
      height 225rpx
      margin-right 20rpx
      margin-bottom 30rpx
      background-color $color-white
      position relative
      img 
        width 100%
        height 100%
      &.add
        background-color #eeeeee
        display flex
        align-items center 
        justify-content center
        font-size 100rpx
        color #666666
      .del
        display inline-block
        width 40rpx
        height 40rpx
        line-height 40rpx
        text-align center
        position absolute
        top -10rpx
        right -10rpx
        font-size 30rpx
        background-color #eeeeee
        border-radius 50%
        color #999999
      .thumb-progress
        position absolute
        bottom 0
        left 0
        right 0
.publish-submit
  padding 0 20rpx 50rpx
</style>
