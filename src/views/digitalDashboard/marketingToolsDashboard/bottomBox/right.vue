<template>
  <div ref="echart" style="width:100%;height:100%;"/>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/line')
export default {
  name: 'ActivityAttendance',
  data () {
    return {
      chart: null,
      seriesData: [[]]
    }
  },
  mounted () {
    this.initDate() // 数据初始化
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
    initDate () {
      for (let i = 0; i < 5; i++) {
        this.seriesData[i] = [i, i * i]
      }
    },
    initEcharts () {
      const option = {
        color: ['#FF9B9A', '#FFD097', '#5FD77E', '#72E1FF', '#A886FF', '#56ABFF'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 0, // 控制图例出现的距离  默认左上角
          textStyle: { // 图例中文字的样式
            color: 'white',
            fontSize: 12
          },
          data: ['预计到场率', '实际到场率']
        },
        // 标题
        title: {
          text: '活动到场率',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: 'white',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 22 // 主题文字字体大小，默认为18px
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: ['20%', '20%'], // 坐标轴两边留白策略
          axisLabel: {
            interval: 0,
            show: true,
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
          data: ['6-21', '6-22', '6-23', '6-24', '6-25', '6-26', '6-27']
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#979797', // 左边线的颜色
              width: '1'// 坐标线的宽度
            }
          },
          splitLine: { // 自定义网格线样式
            lineStyle: {
              type: 'dashed',
              color: 'rgba(233, 233, 233, 0.2)'
            }
          },
          axisLabel: {
            show: true,
            formatter: '{value} %',
            textStyle: {
              fontSize: 12,
              color: '#FFF'
            }
          }
        },
        series: [
          {
            name: '预计到场率',
            type: 'line',
            // 显示数值
            label: {
              show: true,
              formatter: function (params) {
                return (params.value) + '%'
              }
            },
            data: [20, 22, 25, 22, 18, 20, 21]
          },
          {
            name: '实际到场率',
            type: 'line',
            // 显示数值
            label: {
              show: true,
              formatter: function (params) {
                return (params.value) + '%'
              }
            },
            data: [30, 12, 35, 32, 14, 33, 20]
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
