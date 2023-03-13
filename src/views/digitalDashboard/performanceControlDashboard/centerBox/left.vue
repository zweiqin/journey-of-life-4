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
  name: 'PersonalPerformance',
  data () {
    return {
      chart: null,
      xData: [4668, 3775, 2912, 2200, 1259, 700, 403], // 横坐标
      yData: ['华东', '华北', '西南', '东北', '华中', '西北', '华南'] // 数据
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
          top: '12%',
          bottom: '12%',
          containLabel: true // 防止标签溢出
        },
        // 标题
        title: {
          text: '个人业绩',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: 'white',
            fontStyle: 'normal',
            fontWeight: 100,
            fontSize: 20 // 主题文字字体大小，默认为18px
          }
        },
        xAxis: {
          type: 'value',
          position: 'top',
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#979797', // 左边线的颜色
              width: '1'// 坐标线的宽度
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 12,
              color: '#FFF'
            }
          },
          splitLine: { // 自定义网格线样式
            lineStyle: {
              type: 'dashed',
              color: 'rgba(233, 233, 233, 0.2)'
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 12,
              color: '#FFF'
            }
          },
          data: this.yData
        },
        series: [
          {
            type: 'bar', // 形状为柱状图
            barWidth: '40%',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white',
                fontSize: 12
              }
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            data: this.xData
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
