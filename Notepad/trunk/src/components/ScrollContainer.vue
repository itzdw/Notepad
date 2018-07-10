<template>
    <div class="scroll-view">
        <scroll-view scroll-y style="height:100%;" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll" :scroll-with-animation="true">
            <slot></slot>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        methods: {
            upper(e) {
                console.log(e)
            },
            lower(e) {
                console.log(e)
            },
            scroll(e) {
                console.log(e)
            }
        }
    }
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"
.scroll-view
    height 100%
</style>