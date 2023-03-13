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
  name: 'ComparisonOfMarketingVolume',
  data () {
    return {
      chart: null,
      xData1: [90, 80, 70, 60, 50, 40, 30], // 横坐标
      xData2: [70, 60, 40, 70, 80, 50, 20],
      yData: ['商品名称', '商品名称', '商品名称', '商品名称', '商品名称', '商品名称', '商品名称'] // 数据
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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '12%',
          bottom: '12%',
          containLabel: true // 防止标签溢出
        },
        legend: {
          right: 0, // 控制图例出现的距离  默认左上角
          textStyle: { // 图例中文字的样式
            color: 'white',
            fontSize: 12
          }
        },
        // 标题
        title: {
          text: '营销额对比',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: 'white',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 22 // 主题文字字体大小，默认为18px
          }
        },
        xAxis: {
          type: 'value',
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
        yAxis: {
          type: 'category',
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
          data: this.yData
        },
        series: [
          {
            name: '正常销售额',
            type: 'bar', // 形状为柱状图
            barWidth: '20%',
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
                { offset: 0, color: '#87CEFA' },
                { offset: 0.5, color: '#87CEEB' },
                { offset: 1, color: '#00BFFF' }
              ])
            },
            data: this.xData1
          }, {
            name: '活动销售额',
            type: 'bar', // 形状为柱状图
            barWidth: '20%',
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
                { offset: 0, color: '#FAFAD2' },
                { offset: 0.5, color: '#FFFFE0' },
                { offset: 1, color: '#FFFF00' }
              ])
            },
            data: this.xData2
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
