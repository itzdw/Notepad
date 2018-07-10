<template>
    <div class="no-result">
        <section class="icon">
            <img :src="icon" mode="aspectFit"/>
        </section>
        <p class="txt">{{text}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            text:{
                type: String,
                default:'暂时还没有记录'
            },
            icon:{
                type: String,
                default:'../../static/image/no_data.png'
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../common/stylus/variable"
.no-result
    .icon
        display flex
        justify-content center
        align-items center
        img 
            width 300rpx
            margin 0 auto
    .txt
        margin-top 10rpx
        font-size 34rpx
        text-align center
        color $color-text-l
</style>