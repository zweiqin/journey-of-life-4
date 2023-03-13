<template>
  <div class="TXBJL">
    <div :style="bgimg">
      <top />
    </div>
    <div :style="bgimg2">
      <center />
    </div>
    <div :style="bgimg">
      <bottom />
    </div>
  </div>
</template>

<script>
import top from './top.vue'
import center from './center'
import bottom from './bottom.vue'

export default {
  components: {
    top,
    center,
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
        padding: 30 * this.$root.dw + 'px',
        width: '97%',
        height: '35%'
      },
      bgimg2: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 30 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        backgroundSize: '100% 100%',
        padding: 30 * this.$root.dw + 'px',
        width: '97%',
        height: '25%'
      }
    }
  },
  methods: {

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
