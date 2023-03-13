<template>
  <div
    ref="chart"
    class="charsbase"
  />
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/line')
export default {
  name: 'NumberOfDoneMonth',
  data () {
    return {
      // 图表实例
      chart: null,
      xData: [],
      yData: []
    }
  },
  watch: {

  },
  created () {
  },
  mounted () {
    this.init()
    this.setChart()
    // 监听窗口大小改变图表大小(先移除再监听，防止出错)
    window.removeEventListener('resize', this.setResize)

    window.addEventListener('resize', this.setResize)
  },
  beforeDestroy () {
    // 组件销毁前移除监听
    window.removeEventListener('resize', this.setResize)
  },
  methods: {
    setResize () {
      this.chart.resize()
    },
    init () {
      // 2.初始化
      this.chart = echarts.init(this.$refs.chart)
    },
    setChart () {
      const option = {
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 32,
          containLabel: true
        },
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
          data: ['上月', '本月', '增长率'],
          textStyle: { // 图例中文字的样式
            color: 'white',
            fontSize: 12 * this.$root.dw
          }
        },
        // 标题
        title: {
          text: '用户月增长',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: '#3662EC',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 17 * this.$root.dw// 主题文字字体大小，默认为18px
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['8-27', '8-26', '8-27', '8-28', '8-29', '8-30', '8-31', '9-1', '9-2', '9-3', '9-4', '9-5'],
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
                fontSize: 12 * this.$root.dw,
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
                fontSize: 12 * this.$root.dw,
                color: '#FFF'
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#979797', // 左边线的颜色
                width: 1 * this.$root.dw// 坐标线的宽度
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
              115, 94.9, 117.0, 123.2, 125.6, 176.7, 135.6, 162.2, 132.6, 120.0, 116.4, 73.3
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
              117, 105.9, 139.0, 126.4, 128.7, 70.7, 175.6, 182.2, 148.7, 148.8, 116.0, 112.3
            ]
          },
          {
            name: '增长率',
            type: 'line',
            yAxisIndex: 1,
            // 显示数值
            label: {
              show: true,
              formatter: function (params) {
                return (params.value) + '%'
              }
            },
            itemStyle: {
              color: '#F4A460'
            },
            data: [15.0, 17, 13.3, 18, 16.3, 10.2, 20.3, 17, 23.0, 16.5, 12.0, 16.2]
          }
        ]
      }

      // 4.传入数据
      // option && echarts.setOption(option);
      this.chart.setOption(option)
      var that = this
      this.chart.on('click', function (params) {
        that.$bus.$emit('place', params.name)
      })
    }
  }
}
</script>

<style scoped>
.charsbase {
  height: 100%;
  width: 100%;
  background: transparent;
}
</style>
