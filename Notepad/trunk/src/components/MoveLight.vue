<template>
    <div class="movelight-wrapper" :class="colorSetting" :style="'height:'+height+'rpx'"></div>
</template>

<script>
export default {
    name:'MoveLight',
    props:{
        height:{
            type:Number,
            default: 4
        },
        colorSetting:{
            type:String,
            default:'default'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../common/stylus/variable"

.movelight-wrapper
    height 4rpx
    background linear-gradient(left,rgb(36,124,195),rgb(92,205, 223) 55%,rgb(75, 167, 216) 74%,rgb(36, 124, 195) 98%)
    opacity .6
    &.dimension
        background linear-gradient(left,$color-dimension,lighten($color-dimension,20) 55%,lighten($color-dimension,20) 74%,$color-dimension 98%)
</style>
