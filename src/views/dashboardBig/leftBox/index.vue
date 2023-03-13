<template>
  <div :style="bgimg2">
    <bottom />
  </div>

</template>

<script>
import bottom from './bottom.vue'

export default {
  name: 'RightBox',
  components: {
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
        padding: 20 * this.$root.dw + 'px',
        width: '95%',
        height: '30%'
      },
      bgimg2: {
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        // backgroundImage: `url(${require('@/assets/divbg.png')})`,
        // borderRadius: 30 * this.$root.dw + 'px',
        // background: `rgba(255, 255, 255, 0.1)`,
        // backgroundSize: '100% 100%',
        // padding: 0 * this.$root.dw + 'px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '95%',
        height: '95%'
      },

      TableTitle: [],
      TitleData: []
    }
  },
  mounted () {
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
  /* background: #fff;
  color: #fff; */
}
</style>
