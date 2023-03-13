<template>
  <div
    :style="{
      width:'100%',
      height:'100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
  }">
    <div
      :style="{
        width:'95%',
        height:'100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    }">
      <div
        :style="{
          width:'100%',
          height:'24%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: '5px',
          background: '#090933',
          border: '0.25px solid #00D4FE',
          boxShadow: 'inset 0px 0px 5px 0px #FFFFFF',
      }">
        <top />
      </div>
      <div
        :style="{
          width:'100%',
          height:'41%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '5px',
          background: '#090933',
          border: '0.25px solid #00D4FE',
          boxShadow: 'inset 0px 0px 5px 0px #FFFFFF',
      }">
        <center />
      </div>
      <div
        :style="{
          width:'100%',
          height:'30%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: '5px',
          background: '#090933',
          border: '0.25px solid #00D4FE',
          boxShadow: 'inset 0px 0px 5px 0px #FFFFFF',
      }">
        <bottom />
      </div>
    </div>

  </div>
</template>

<script>
import top from './top.vue'
import bottom from './bottom.vue'
import center from './center.vue'

export default {
  name: 'RightBox',
  components: {
    top,
    center,
    bottom
  },
  data () {
    return {
    }
  },
  mounted () {
    // this.infinitScroll()
  },
  methods: {
    // infinitScroll() {
    //   // 拿到表格挂载后的真实DOM
    //   const table = this.$refs.table
    //   // 拿到表格中承载数据的div元素
    //   const divData = table.bodyWrapper
    //   divData.onmouseover = function () {
    //     clearInterval(t)
    //   } // 鼠标移入，停止滚动
    //   divData.onmouseout = function () {
    //     start()
    //   } // 鼠标移出，继续滚动

    //   // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
    //   let t
    //   function start() {
    //     // 数据少于表格高度停止滚动
    //     if (divData.clientHeight >= divData.scrollHeight) {
    //       return
    //     }
    //     t = setInterval(() => {
    //       // 元素自增距离顶部1像素
    //       divData.scrollTop += 1
    //       // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
    //       if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
    //         // 重置table距离顶部距离
    //         divData.scrollTop = 0
    //       }
    //     }, 100)
    //   }
    //   start()
    // }
  }

}
</script>

<style scoped>
.TXBJL {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
