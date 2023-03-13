<template>
  <div style="width: 100%;height: 100%;">
    <div class="TXBJ" >
      <div :style="bgimg">
        <div class="TEXT">团队业绩总目标：15</div>
        <div class="TEXT">现有业绩：10</div>
      </div>
      <div :style="bgimg">
        <div class="TEXT">滞销产品：产品一</div>
        <div class="TEXT">畅销产品：产品二</div>
      </div>
    </div>
    <div class="TXBJ" >
      <div :style="bgimg">
        <div class="TEXT">近期销售总额：5</div>
        <div class="TEXT">营销活动销售额：10</div>
      </div>
      <div :style="bgimg">
        <div class="TEXT">用户复购次数：10</div>
        <div class="TEXT">回访话术使用次数：2</div>
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
        width: '46%',
        height: '94%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
  height: 50%;
  width: 100%;
  color:white;
  text-align: center;
}
.TEXT{
  font-size: 2.5vh;
}
</style>
