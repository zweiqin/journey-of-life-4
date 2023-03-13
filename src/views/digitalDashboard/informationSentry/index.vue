<template>
  <div
    :style="showwebh"
    class="base"
  >
    <leftBox style="width:31%;height:100%;" />
    <centerBox style="width:38%;height:100%;" />
    <rightBox style="width:31%;height:100%" />
  </div>
</template>

<script>
import leftBox from './leftBox'
import centerBox from './centerBox'
import rightBox from './rightBox'
export default {
  components: {
    leftBox,
    centerBox,
    rightBox
  },
  data () {
    return {
      number: [],
      showwebh: {
        width: '100%',
        // height: 884 * this.$root.dw + 'px',
        height: '100%',
        // backgroundImage: `url(${require('@/assets/bodybg.jpg')})`,
        background: '#2d3968',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }
    }
  }
}
</script>

<style scoped>
.base {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
