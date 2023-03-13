<template>
  <div
    :style="showwebh"
    class="base"
  >
    <topBox style="width:100%;height:8%;" />
    <centerBox style="width:100%;height:50%;" />
    <bottomBox style="width:100%;height:42%" />
  </div>
</template>

<script>
import topBox from './topBox'
import centerBox from './centerBox'
import bottomBox from './bottomBox'
export default {
  components: {
    topBox,
    centerBox,
    bottomBox
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
