<template>
  <div
    :style="{
      background: '#060327',
    }"
    class="main"
  >
    <div
      :style="{
        height: '7%',
        width:'100%',
        color: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${require('@/assets/titlebox.png')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
        fontSize:30*$root.dw+'px',
        fontFamily: 'SourceHanSansCN-Medium',
        lineHeight: 30*$root.dw+'px',
        letterSpacing: '0'
      }"
      @click="screenFull">
      团蜂家居可视化数据展示平台
    </div>
    <div
      :style="{
        height: '93%',
        width:'100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }"
    >
      <leftBox style="width:30%;height:98%;" />
      <centerBox style="width:45%;height:98%" />
      <rightBox style="width:30%;height:98%" />
    </div>
  </div>

</template>

<script>
import leftBox from './leftBox'
import centerBox from './centerBox'
import rightBox from './rightBox'
import titleNumber from './components/titleNumber.vue'
// import Screenfull from '@/components/Screenfull'
import screenfull from 'screenfull'

export default {
  components: {
    titleNumber,
    leftBox,
    centerBox,
    rightBox
    // Screenfull
  },
  data () {
    return {
      number: []
    }
  },
  // inject: [
  //   'reload'
  // ],
  mounted () {
    for (let index = 0; index < 29; index++) {
      this.number.push((Math.random() * 100).toFixed(0))
    }
  },
  methods: {
    screenFull () {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }

}
</script>

<style scoped>
.main{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow:hidden;
}
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
.item {
  width: 30%;
  height: 50%;
  margin-left: 3.3%;
}
</style>
