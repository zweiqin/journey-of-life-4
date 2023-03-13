<template>
  <div :style="{ 'font-size': 40 * $root.dw + 'px' }" class="TXBJ" >
    <div class="TEXT1">
      <div>
        <div>11671389.15</div>
        <div>门店消费总额</div>
      </div>
    </div>
    <div class="TEXT2">
      <div>
        <div>2569</div>
        <div>销售额</div>
      </div>
      <div>
        <div>4543</div>
        <div>人均消费</div>
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
        height: '75%'
      }
    }
  }
}
</script>

<style scoped>
.TXBJ {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  color:rgb(255, 255, 255);
  /*text-shadow: 0 0 10px red;*/
  text-align:center;
}
.TEXT1 {
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: 100%;
  height: 45%;
}
.TEXT2 {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  height: 55%;
}
</style>
