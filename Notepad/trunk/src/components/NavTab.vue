<template>
    <nav class="nav-bar">
      <ul class="nav-list">
        <li v-for="(item,index) in list" :key="index" class="nav-item" 
            :class="{'active':navIndex===index}" @click="switchNav(item.name,index)">
            {{item.name}} ( {{item.count||0}} )
        </li>
      </ul>
    </nav>
</template>

<script>
export default {
    data () {
        return {
            navCurrent:this.list[0]
        }
    },
    props: {
        list:{
            type: Array,
            default: []
        },
        navIndex:{
            type: Number,
            default: 0
        }
    },
    methods:{
        switchNav(item,index){
            // this.newsTotal = 0
            this.navCurrent = item
            // this.state = index
            // this.getNewsList(true)
            this.navIndex = index
            this.$emit('change-nav',index)
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../common/stylus/variable"
.nav-bar
    margin-top 2rpx
    padding-bottom 20rpx
    .nav-list
        display flex
        background-color $color-white
        .nav-item
            flex 1
            text-align center
            height 80rpx
            line-height 80rpx
            &.active
                color $color-theme
                border-bottom 2rpx solid $color-theme
</style>