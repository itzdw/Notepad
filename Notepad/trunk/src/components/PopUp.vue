<template>
    <div class="popup-wrapper" v-show="isshow" @click="hide()">
        <section class="popup-container" :class="{'up':isshow}">
            <slot></slot>
        </section>
    </div>
</template>

<script>
    export default {
        props:['isshow'],
        methods: {
            hide() {
                this.isshow = false
            },
        },
    }
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"
.popup-wrapper
    position fixed
    z-index 9
    top 0
    bottom 0
    left 0
    right 0
    background-color rgba(0,0,0,0.5)
    translation all 1s
    .popup-container
        position absolute
        bottom 0
        left 0
        right 0
        background-color $color-group-cell
        padding 20rpx 20rpx 50rpx
        transform translateY(100%)
        &.up
            transform translateY(0)
</style>