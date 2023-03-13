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
  name: 'ProductPerformance',
  data () {
    return {
      chart: null
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
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['上月', '本月'],
          textStyle: { // 图例中文字的样式
            color: 'white',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '15%',
          bottom: '6%',
          containLabel: true // 防止标签溢出
        },
        // 标题
        title: {
          text: '产品提供业绩',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: 'white',
            fontStyle: 'normal',
            fontWeight: 100,
            fontSize: 20 // 主题文字字体大小，默认为18px
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['产品一', '产品二', '产品三', '产品四', '产品五', '产品六', '产品七', '产品八', '产品九', '产品十'],
            axisPointer: {
              type: 'shadow'
            },
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
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 250,
            interval: 50,
            // axisLabel: {
            //  formatter: '{value} ml'
            // },
            axisLabel: {
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
            splitLine: { // 自定义网格线样式
              lineStyle: {
                type: 'dashed',
                color: 'rgba(233, 233, 233, 0.2)'
              }
            }
          },
          {
            type: 'value',
            // axisLabel: {
            //  formatter: '{value} °C'
            // },
            show: false,
            splitLine: {
              show: false // 不显示网格线
            }
          }
        ],
        series: [
          {
            name: '上月',
            type: 'bar',
            barWidth: '20%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              }
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#87CEFA' },
                { offset: 0.5, color: '#87CEEB' },
                { offset: 1, color: '#00BFFF' }
              ])
            },
            data: [
              115, 94.9, 117.0, 123.2, 125.6, 176.7, 135.6, 162.2, 132.6, 120.0
            ]
          },
          {
            name: '本月',
            type: 'bar',
            barWidth: '20%',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              }
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FAFAD2' },
                { offset: 0.5, color: '#FFFFE0' },
                { offset: 1, color: '#FFFF00' }
              ])
            },
            data: [
              117, 105.9, 139.0, 126.4, 128.7, 70.7, 175.6, 182.2, 148.7, 148.8
            ]
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

