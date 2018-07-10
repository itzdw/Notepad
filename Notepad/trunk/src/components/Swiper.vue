<template>
    <div class="swiper-wrapper">
        <swiper 
            class="swiper"
            :indicator-dots='true'
            :indicator-color="'#ffffff'"
            :indicator-active-color="'#8fd25e'"
            :autoplay='true'
            :interval='6000'
            :duration='1000'
            :circular='true'
        >
            <div :key='index' v-for='(item,index) in imgUrls'>
                <swiper-item>
                    <img :src="item" class="slide-image" mode="aspectFit"/>
                </swiper-item>
            </div>
        </swiper>
    </div>
</template>

<script>
    export default {
        props:['imgUrls'],
        methods:{
            changeIndicatorDots(e) {
                this.indicatorDots =! this.indicatorDots
            },
            changeAutoplay(e) {
                this.autoplay =! this.data.autoplay
            },
            intervalChange(e) {
                this.interval = e.detail.value
            },
            durationChange(e) {
                this.duration = e.detail.value
            }
        }
    }
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"

.swiper-wrapper
    padding-top 20rpx
    height 500rpx
.swiper
    color $color-white
    width 100%
    height 100%
    .slide-image
        width 750rpx
        height 500rpx
</style>