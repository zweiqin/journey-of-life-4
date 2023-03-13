<template>
  <div style="width:100%;height:100%;">
    <div>
      <el-date-picker
        v-model="value"
        class="input"
        type="date"
        placeholder="选择日期"/>
    </div>
    <div ref="echart" style="width:100%;height:100%;"/>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/bar')

export default {
  name: 'MarketingActivities',
  data () {
    return {
      chart: null,
      value: '',
      xData: [90, 80, 70, 60, 50, 40, 30], // 横坐标
      yData: ['活动次数', '活动次数', '活动次数', '活动次数', '优惠券发放个数', '红包发放数量', '代金券发放总数'] // 数据
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
          text: '营销活动',
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
            type: 'bar', // 形状为柱状图
            barWidth: '30%',
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
                { offset: 0, color: '#DDA0DD' },
                { offset: 0.5, color: '#EE82EE' },
                { offset: 1, color: '#BA55D3' }
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

<style scoped>
.input {
  z-index:999;
  float:right;
  width:35%;
  height: 27px;
  padding-left: 10px;
  background-color: transparent;
  border: 1px solid #285f90;
  border-radius: 5px;
  color: white;
  box-shadow: 0 0 15px #4373ad inset;
}

>>>.el-date-editor {
  background-color: transparent;
  color: white;
}
>>>.el-input__inner {
  background-color: transparent;
  color: white;
  height: 27px;
  padding: 0;
  border: none;
}
>>>.el-input__icon{
  display: none;
}
</style>
