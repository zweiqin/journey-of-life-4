<template>
  <div class="base">
    <div class="maindivitem">
      <div class="titledivitem">代金券</div>
      <div :style="bgimg"/>
      <div class="titledivitem">地图红包</div>
    </div>
    <titleNumber :name="'总数'" :parameter="number[1]" class="divitem1" />
    <div :style="bgimg2"/>
    <titleNumber :name="'数量'" :parameter="number[2]" class="divitem2" />
    <titleNumber :name="'总金额'" :parameter="number[3]" class="divitem2" />
    <titleNumber :name="'已领取'" :parameter="number[4]" class="divitem2" />
  </div>
</template>

<script>
import titleNumber from './../components/titleNumber.vue'
export default {
  components: {
    titleNumber
  },
  data () {
    return {
      number: [],
      bgimg: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 30 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        backgroundSize: '100% 100%',
        width: '2%',
        height: '60%'
      },
      bgimg2: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 30 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        backgroundSize: '100% 100%',
        width: '2%',
        height: '20%'
      }
    }
  },
  mounted () {
    for (let index = 0; index < 29; index++) {
      this.number.push((Math.random() * 100).toFixed(0))
    }
  }
}
</script>

<style scoped>
.base {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.maindivitem{
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 50%
}
.titledivitem {
  font-size: 4vh;
  width: 49%;
}
.divitem1 {
  height: 30%;
  width: 49%;
}
.divitem2 {
  height: 30%;
  width: 16.3%;
}
</style>
