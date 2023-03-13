<template>
  <div class="TXB">
    <div :style="bgimg" class="HID">
      <userSourceAnalysis />
    </div>
    <div :style="bgimg2" class="HID">
      <bottom />
    </div>
  </div>
</template>

<script>
import bottom from './bottom'
import userSourceAnalysis from './userSourceAnalysis'

export default {
  components: {
    bottom,
    userSourceAnalysis
  },
  data () {
    return {
      bgimg: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 30 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        padding: 10 * this.$root.dw + 'px',
        backgroundSize: '100% 100%',
        width: '100%',
        height: '49%'
      },
      bgimg2: {
        width: '100%',
        height: '49%'
      }
    }
  }

}
</script>

<style scoped>
.TXB {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}
.HID{
  overflow: hidden;
}
</style>
