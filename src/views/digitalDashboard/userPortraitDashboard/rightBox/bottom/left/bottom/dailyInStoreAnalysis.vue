<template>
  <div ref="echart" style="width:100%;height:100%;"/>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/bar')

export default {
  name: 'DailyInStoreAnalysis',
  data () {
    return {
      chart: null,
      xData: ['6-16', '6-17', '6-18', '6-19', '6-20', '6-21', '6-22', '6-23', '6-24', '6-25', '6-26', '6-27'], // 横坐标
      yData: [23, 24, 18, 25, 27, 28, 25, 23, 24, 18, 25, 27] // 数据
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.initEcharts()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    window.removeEventListener('resize', this.resizeFun)
    this.resizeFun = null
  },
  methods: {
    initEcharts () {
      // 基本柱状图
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '20%',
          bottom: '1%',
          containLabel: true // 防止标签溢出
        },
        // 标题
        title: {
          text: '每日进店分析',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: 'white',
            fontStyle: 'normal',
            fontWeight: 100,
            fontSize: 20 // 主题文字字体大小，默认为18px
          }
        },
        xAxis: {
          axisLabel: {
            show: true,
            rotate: 40,
            textStyle: {
              fontSize: 12,
              color: '#FFF'
            }
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#979797', // 左边线的颜色
              width: '1'// 坐标线的宽度
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          data: this.xData
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: { // 隐藏y轴刻度线
            show: false
          },
          splitLine: { // 自定义网格线样式
            lineStyle: {
              type: 'dashed',
              color: 'rgba(233, 233, 233, 0.2)'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 12,
              color: '#FFF'
            }
          }
        },
        series: [
          {
            type: 'bar', // 形状为柱状图
            barWidth: '50%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            data: this.yData
          }
        ]
      }
      this.chart = echarts.init(this.$refs.echart)
      this.chart.setOption(option)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', this.resizeFun)
    },
    resizeFun () {
      this.chart.resize()
    }
  }
}
</script>

