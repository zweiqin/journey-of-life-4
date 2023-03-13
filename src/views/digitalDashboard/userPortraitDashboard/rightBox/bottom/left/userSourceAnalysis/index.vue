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
  name: 'UserSourceAnalysis',
  data () {
    return {
      seriesData: [[]],
      chart: null
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
          bottom: 0, // 控制图例出现的距离  默认左上角
          textStyle: { // 图例中文字的样式
            color: 'white',
            fontSize: 12
          },
          data: ['渠道一', '渠道二', '渠道三']
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '13%',
          containLabel: true // 防止标签溢出
        },
        // 标题
        title: {
          text: '用户来源分析',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: 'white',
            fontStyle: 'normal',
            fontWeight: 100,
            fontSize: 20 // 主题文字字体大小，默认为18px
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
          axisTick: {
            alignWithLabel: true
          },
          data: ['6-21', '6-22', '6-23', '6-24', '6-25', '6-26', '6-27']
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
            name: '渠道一',
            type: 'line',
            symbolSize: 0, // 拐点的大小
            smooth: true, // 是否是平滑曲线
            data: [20, 22, 25, 22, 18, 20, 21]
          },
          {
            name: '渠道二',
            type: 'line',
            symbolSize: 0, // 拐点的大小
            smooth: true, // 是否是平滑曲线
            data: [40, 42, 45, 42, 44, 43, 40]
          },
          {
            name: '渠道三',
            type: 'line',
            symbolSize: 0, // 拐点的大小
            smooth: true, // 是否是平滑曲线
            data: [30, 34, 32, 28, 30, 34, 38]
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
