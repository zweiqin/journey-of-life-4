<template>
  <div class="TX">
    <div :style="bgimg" class="HID">
      <dailyInStoreAnalysis />
    </div>
    <div :style="bgimg2" class="HID">
      <tagTrafficAnalysis />
    </div>
  </div>
</template>

<script>
import dailyInStoreAnalysis from './dailyInStoreAnalysis.vue'
import tagTrafficAnalysis from './tagTrafficAnalysis.vue'

export default {
  components: {
    dailyInStoreAnalysis,
    tagTrafficAnalysis
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
        width: '49%',
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
        width: '49%',
        height: '100%'
      }
    }
  }

}
</script>

<style scoped>
.TX {
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
