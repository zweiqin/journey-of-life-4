<template>
  <div class="TXBJ">
    <div :style="bgimg" class="HID">
      <left />
    </div>
    <div :style="bgimg2" class="HID">
      <right />
    </div>
  </div>
</template>

<script>
import left from './left'
import right from './right'

export default {
  components: {
    left,
    right
  },
  data () {
    return {
      bgimg: {
        width: '75%',
        height: '100%'
      },
      bgimg2: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 30 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        padding: 10 * this.$root.dw + 'px',
        backgroundSize: '100% 100%',
        width: '24%',
        height: '100%'
      }
    }
  },
  methods: {

  }

}
</script>

<style scoped>
.TXBJ {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}
.HID{
  overflow: hidden;
}
</style>
