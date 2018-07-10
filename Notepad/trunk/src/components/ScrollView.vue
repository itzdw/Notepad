<template>
    <div class="sroll-view">
        <scroll-view scroll-y style="height:200px;" bindscrolltoupper="upper" bindscrolltolower="lower" bindscroll="scroll" scroll-into-view="{{toView}}" scroll-top="{{scrollTop}}">
            <view id="green" class="scroll-view-item bc_green"></view>
            <view id="red"  class="scroll-view-item bc_red"></view>
            <view id="yellow" class="scroll-view-item bc_yellow"></view>
            <view id="blue" class="scroll-view-item bc_blue"></view>
        </scroll-view>

        <view class="btn-area">
            <button size="mini" bindtap="tap">click me to scroll into view </button>
            <button size="mini" bindtap="tapMove">click me to scroll</button>
        </view>

        <scroll-view class="scroll-view_H" scroll-x style="width:100%">
            <view id="green" class="scroll-view-item_H bc_green"></view>
            <view id="red"  class="scroll-view-item_H bc_red"></view>
            <view id="yellow" class="scroll-view-item_H bc_yellow"></view>
            <view id="blue" class="scroll-view-item_H bc_blue"></view>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"
</style>