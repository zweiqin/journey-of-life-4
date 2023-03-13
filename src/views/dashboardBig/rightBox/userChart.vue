<template>
  <div
    :style="{
      width:'100%',
      height:'100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
  }">
    <!-- <div
      :style="{
        'color':'white',
        'font-size': 22 * $root.dw + 'px',
        width:'100%',
        height:'10%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }">
      用户画像分析
    </div> -->
    <div
      :style="{
        width:'100%',
        height:'80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }">
      <div ref="echart1" style="width:23%;height:100%;"/>

      <div ref="echart2" style="width:23%;height:100%;"/>

      <div ref="echart3" style="width:23%;height:100%;"/>

    </div>
    <div
      :style="{
        width:'100%',
        height:'10%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }">

      <div :style="{ 'color': 'white', 'font-size': 18 * $root.dw + 'px', 'text-align': 'center' ,width:'23%'}">新访客</div>

      <div :style="{ 'color': 'white', 'font-size': 18 * $root.dw + 'px', 'text-align': 'center',width:'23%' }">老访客</div>

      <div :style="{ 'color': 'white', 'font-size': 18 * $root.dw + 'px', 'text-align': 'center' ,width:'23%'}">购买率</div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-liquidfill'
export default {
  data () {
    return {
      chart1: null,
      chart2: null,
      chart3: null
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.initEcharts()
    })
    // 监听窗口大小改变图表大小(先移除再监听，防止出错)
    window.removeEventListener('resize', this.setResize)

    window.addEventListener('resize', this.setResize)
  },
  beforeDestroy () {
    if (this.chart1) {
      this.chart1.dispose()
      this.chart1 = null
    }
    if (this.chart2) {
      this.chart2.dispose()
      this.chart2 = null
    }
    if (this.chart3) {
      this.chart3.dispose()
      this.chart3 = null
    }
    // 组件销毁前移除监听
    window.removeEventListener('resize', this.setResize)
  },
  methods: {
    setResize () {
      this.chart1.resize()
      this.chart2.resize()
      this.chart3.resize()
    },
    liquidCharts (chart, obj, data, borderC, color0, color100) {
      // 基于准备好的dom，初始化echarts实例
      chart = echarts.init(obj)
      // 使用指定的配置项和数据显示图表
      chart.setOption({
        tooltip: {
          show: true
        },
        series: [{
          name: '用户占比',
          type: 'liquidFill',
          radius: '80%',
          center: ['50%', '50%'],
          data: data,
          label: {
            normal: {
              color: borderC,
              insideColor: '#fff',
              textStyle: {
                fontSize: 24 * this.$root.dw,
                fontWeight: 'bold'
              }
            }
          },
          color: [{
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
              offset: 1,
              color: color0 // 0% 处的颜色
            }, {
              offset: 0,
              color: color100 // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }],
          outline: {
            show: true,
            borderDistance: 5 * this.$root.dw,
            itemStyle: {
              borderColor: borderC,
              borderWidth: 3 * this.$root.dw
            }
          }
        }]
      })
      window.addEventListener('resize', () => {
        if (chart) {
          chart.resize()
        }
      })
    },
    initEcharts () {
      this.liquidCharts(
        this.chart1,
        this.$refs.echart1,
        [0.6],
        ['#27e5f1'],
        ['#6a7feb'],
        ['#27e5f1']
      )
      this.liquidCharts(
        this.chart2,
        this.$refs.echart2,
        [0.4],
        ['#EE82EE'],
        ['#9400D3'],
        ['#EE82EE']
      )
      this.liquidCharts(
        this.chart3,
        this.$refs.echart3,
        [0.7],
        ['#AFEEEE'],
        ['#008B8B'],
        ['#AFEEEE']
      )
    }
  }
}
</script>

<style scoped>
.TXB {
  height: 100%;
  width: 100%;
}
</style>
