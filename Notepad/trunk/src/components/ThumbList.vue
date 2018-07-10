<template>
    <ul class="thumb-list" v-if="list.length!=0">
        <li class="thumb-item" v-for="(item,index) in list" :key="index">
            <img :src="item" alt="" :lazy-load="true" mode="aspectFit" @click.stop="previewImage(item)"/>
        </li>
    </ul>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    props: {
        list:{
            type: Array,
            default: []
        }
    },
    computed:{

    },
    methods:{
        previewImage(ev){
            wx.previewImage({
                current: ev,
                urls: this.list,
                complete:res=>{
                    this.$emit('stop-on-show',true)
                    return false
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../common/stylus/variable"
.thumb-list
    display flex
    justify-content flex-start
    margin-top 20rpx
    margin-right -2%
    .thumb-item
        width 15%
        height 0
        padding-bottom 15%
        overflow hidden
        border 1px solid #f5f5f5
        margin-right 2%
        img 
            width 100%
            height 111rpx
</style>