<template>
  <div ref="echart" style="width:100% ;height:100% ;"/>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/pie')
export default {
  data () {
    return {
      chart: null
    }
  },
  mounted: function () {
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
      // 绘制图表
      this.chart = echarts.init(this.$refs.echart)
      // 指定图表的配置项和数据
      var option = {
        // 标题
        title: {
          text: '用户分析',
          x: 'left', // 标题位置
          textStyle: { // 标题内容的样式
            color: 'white',
            fontStyle: 'normal',
            fontWeight: 100,
            fontSize: 20 // 主题文字字体大小，默认为18px
          }
        },
        // stillShowZeroSum: true,
        // 鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        // 图例
        legend: {// 图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 10, // 控制图例出现的距离  默认左上角
          left: 'center', // 控制图例的位置
          itemWidth: 16, // 图例颜色块的宽度和高度
          itemHeight: 12,
          textStyle: { // 图例中文字的样式
            color: 'white',
            fontSize: 12
          },
          data: ['一次付费', '二次付费', '三次付费', '付费三次以上']// 图例上显示的饼图各模块上的名字
        },
        // 饼图中各模块的颜色
        color: ['#32dadd', '#b6a2de', '#5ab1ef', '#ef6567'],
        // 饼图数据
        series: {
          // name: 'bug分布',
          type: 'pie', // echarts图的类型   pie代表饼图
          radius: '50%', // 饼图中饼状部分的大小所占整个父元素的百分比
          center: ['50%', '50%'], // 整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: [ // 每个模块的名字和值
            { name: '一次付费', value: 60 },
            { name: '二次付费', value: 20 },
            { name: '三次付费', value: 15 },
            { name: '付费三次以上', value: 5 }
          ],
          itemStyle: {
            normal: {
              label: {
                show: true // 饼图上是否出现标注文字 标注各模块代表什么  默认是true
                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true // 官网demo里外部标注上的小细线的显示隐藏    默认显示
              }
            }
          }
        }

      }
      // 使用刚指定的配置项和数据显示图表。
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

<style scoped>

</style>

