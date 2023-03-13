<template>
  <div class="TXBJL">
    <div :style="bgimg">
      <top />
    </div>
    <div :style="bgimg2">
      <bottom />
    </div>
  </div>
</template>

<script>
import top from './top'
import bottom from './bottom'

export default {
  components: {
    top,
    bottom
  },
  data () {
    return {
      bgimg: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 30 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        backgroundSize: '100% 100%',
        padding: 10 * this.$root.dw + 'px',
        width: '98%',
        height: '25%'
      },
      bgimg2: {
        width: '98%',
        height: '71%'
      }
    }
  }

}
</script>

<style scoped>
.TXBJL {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
