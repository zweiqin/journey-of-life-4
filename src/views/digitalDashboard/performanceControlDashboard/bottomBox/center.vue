<template>
  <div ref="echart" style="width:100% ;height:100%;"/>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/line')
export default {
  name: 'MonthlyProfitOfStores',
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
      this.chart = echarts.init(this.$refs.echart)
      this.chart.setOption({
        color: ['#32dadd'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '15%',
          bottom: '5%',
          containLabel: true // 防止标签溢出
        },
        // 标题
        title: {
          text: '门店月利润',
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
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#979797', // 左边线的颜色
              width: '1'// 坐标线的宽度
            }
          },
          axisLabel: {
            rotate: 40,
            textStyle: {
              fontSize: '12',
              color: '#fff'
            }
          }
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
            textStyle: {
              fontSize: '12',
              color: '#fff'
            }
          }
        },
        series: [{
          name: '一次付费平均停留',
          symbolSize: 0, // 拐点的大小
          data: [10, 5, 13, 16, 13, 12, 10, 5, 13, 16, 13, 12],
          type: 'line',
          areaStyle: {}
        }
        ]
      })
      // 随着屏幕大小调节图表
      window.addEventListener('resize', this.resizeFun)
    },
    resizeFun () {
      this.chart.resize()
    }
  }
}
</script>
