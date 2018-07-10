<template>
    <div class="mp-select-wrapper">
        <section class="section">
            <section class="section-title">
                <slot></slot>
            </section>
            <picker @change="bindPickerChange" :value="index" :range="list">
                <view class="picker">
                    {{list[index]}}
                </view>
            </picker>
        </section>
    </div>
</template>

<script>
    export default {
        props:['list'],
        data () {
            return {
                index:0
            }
        },
        methods: {
            bindPickerChange(e) {
                this.index = e.target.value
            },
        },
    }
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"
.mp-select-wrapper
    display inline-block
    picker
        display inline-block
        min-width 200rpx
        height 40rpx
        line-height 40rpx
        border 1px solid $color-luxury
        text-align center
        padding 0 20rpx
</style>