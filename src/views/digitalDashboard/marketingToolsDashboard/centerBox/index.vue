<template>
  <div class="TXBJL">
    <div :style="bgimg" class="HID">
      <left />
    </div>
    <div :style="bgimg2">
      <center />
    </div>
    <div :style="bgimg" class="HID">
      <right />
    </div>
  </div>
</template>

<script>
import left from './left.vue'
import center from './center.vue'
import right from './right.vue'

export default {
  name: 'CenterBox',
  components: {
    left,
    center,
    right
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
        width: '32%',
        height: '97%'
      },
      bgimg2: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${require('@/assets/divbg.png')})`,
        borderRadius: 30 * this.$root.dw + 'px',
        background: `rgba(255, 255, 255, 0.1)`,
        backgroundSize: '100% 100%',
        padding: 10 * this.$root.dw + 'px',
        width: '33%',
        height: '97%'
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
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
}
.HID{
  overflow: hidden;
}
</style>
