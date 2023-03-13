<template>
  <div style="width: 100%;height: 100%;">
    <div :style="{ 'color': 'white','font-size': 22 * $root.dw + 'px' }">数据概览</div>
    <div class="TXBJ" >
      <div :style="bgimg">
        <div :style="{ 'margin': 15 * $root.dw + 'px' }">访问数</div>
        <div :style="{ 'margin-left': 15 * $root.dw + 'px','font-size': 35 * $root.dw + 'px' }">7270人</div>
      </div>
      <div :style="bgimg">
        <div :style="{ 'margin': 15 * $root.dw + 'px' }">注册数</div>
        <div :style="{ 'margin-left': 15 * $root.dw + 'px','font-size': 35 * $root.dw + 'px' }">5089人</div>
      </div>
      <div :style="bgimg">
        <div :style="{ 'margin': 15 * $root.dw + 'px' }">平均停留时长</div>
        <div :style="{ 'margin-left': 15 * $root.dw + 'px','font-size': 35 * $root.dw + 'px' }">5089人</div>
      </div>
      <div :style="bgimg">
        <div :style="{ 'margin': 15 * $root.dw + 'px' }">付费数</div>
        <div :style="{ 'margin-left': 15 * $root.dw + 'px','font-size': 35 * $root.dw + 'px' }">5089人</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bgimg: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 10 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        backgroundSize: '100% 100%',
        padding: 10 * this.$root.dw + 'px',
        width: '23%',
        height: '80%'
      }
    }
  }
}
</script>

<style scoped>
.TXBJ {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 90%;
  width: 100%;
  color:white;
}
</style>
