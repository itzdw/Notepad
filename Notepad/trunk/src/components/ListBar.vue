<template>
    <div class="listbar">
        <ul class="listbar-list">
            <li class="listbar-item" v-for="(item,index) in list" :key="index">
                <div class="product-box">
                  <div class="pic">
                    <a href="/pages/ProductDetail/main">
                      <img :src="item.image" mode='aspectFit' />
                    </a>
                    <i class="iconfont animated" @click="colletProduct(item)" 
                      :class="{'icon-collect':!item.is_collect,'icon-cellected':item.is_collect,
                      'flash':item.is_tap && !item.is_collect,'bounceIn':item.is_tap && item.is_collect}">
                    </i>
                  </div>
                  <div class="info">
                    <p>{{item.name}}</p>
                    <!-- <p>{{item.number}}</p> -->
                    <p class="price-action">
                      <span class="price">
                        <em>￥{{item.saleprice}}</em>
                      </span>
                      <!-- <i class="iconfont icon-add-cart" @click="addShopCart(item)"></i> -->
                    </p>
                  </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            currentTarget:this.list[0]
        }
    },
    props: {
        list:{
            type: Array,
            default: ['1']
        }
    },
    computed:{
        items () {
            // 如果通用 请用chunk函数  比如lodash的chunk方法
            let res = this.list
            // console.log([res.slice(0, 4), res.slice(4, 8), res.slice(8)])
            return [res.slice(0, 4), res.slice(4, 8), res.slice(8)]
        }
    },
    methods:{
        tapHandle(item){
            this.currentTarget = item
        },
        clickHanle(){
            wx.switchTab({
                url:'/pages/index/main'
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../common/stylus/variable"
.listbar
    color $color-luxury
    font-size 30rpx
    flex 1
    padding-bottom 30rpx
    overflow-y auto
    .listbar-list
        display block
        width 100%
        clear both
        zoom 1
        &:afer
            display block
            clear both
            content ''
            visibility hidden
            height 0
        li
            width 50%
            float left
            display flex
            flex 1
            align-items center
            justify-content space-around
            padding 30rpx 0 0
            box-sizing border-box
            &:nth-child(2n+1) 
                padding-left 20rpx
            &:nth-child(2n) 
                padding-right 40rpx
            .product-box
                .pic
                    width 100%
                    height 295rpx
                    display flex
                    align-items center
                    justify-content center
                    position relative
                    padding 10rpx
                    background-image url($host'mpvue_img/bg_luxury_pic.png') 
                    background-size cover
                img 
                    display inline-block
                    width 250rpx
                    height 250rpx
                    vertical-align middle
                i 
                    position absolute
                    top 10rpx
                    right 20rpx
                    color $color-luxury
                    font-size 40rpx
                .info
                    width 290rpx
                    padding-top 10rpx
                    font-size 24rpx
                    color $color-white
                .price-action
                    display flex
                    .price
                        flex 1
                    em
                        color $color-luxury
                    i 
                        color $color-luxury 
                        font-size 50rpx
                        margin-top -30rpx  
</style>