<template>
    <div class="navbar">
        <ul class="navbar-list">
            <li v-for="(item,index) in list" :key="index" class="navbar-item" @click="tapHandle(item)" :class="{'active':item==currentTarget}">
                {{item}}
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
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../common/stylus/variable"
.navbar
    height 100rpx
    line-height 100rpx
    background-image url($host'mpvue_img/bg_nav.png')
    background-size cover
    .navbar-list
        height 100%
        display flex
    .navbar-item
        flex 1
        text-align center
        font-size 30rpx
        color $color-gray-d
        &.active
            color $color-luxury
            text-shadow 0 0 10rpx $color-luxury
</style>