<template>
  <div class="progress-circle" :style="'height:'+radius+'px;width:'+radius+'px'">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
        :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
    </svg>
    <div class="progress-slot" :style="'line-height:'+radius+'px'">
      {{percent}}%
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent/100) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/variable"

  .progress-circle
    position relative
    background-color #fff
    border-radius 50%
    transition all 1s
    circle
      stroke-width 20rpx
      transform-origin center
      transition all 1s
      &.progress-background
        transform scale(0.9)
        stroke red
        transition all 1s
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke $color-theme
        transition all 1s
    .progress-slot
      position absolute
      top 0
      left 0
      right 0 
      bottom 0
      margin auto
      text-align center
      color $color-theme
      font-size 12px
</style>