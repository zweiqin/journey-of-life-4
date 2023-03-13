<template>
  <div ref="echart" style="width:100% ;height:100%;"/>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/treemap')
export default {
  name: 'ProportionOfPersonalPerformance',
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
      this.chart.setOption(
        {
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: '{b}: {c}'
          },
          legend: {
            data: ['销售部', '技术部', '研发部', '后勤部', '财务部', '人事部', '商务部', '审计部'],
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
            text: '个人业绩占比',
            x: 'left', // 标题位置
            textStyle: { // 标题内容的样式
              color: 'white',
              fontStyle: 'normal',
              fontWeight: 100,
              fontSize: 20 // 主题文字字体大小，默认为18px
            }
          },
          calculable: false,
          series: [
            {
              name: '矩形图',
              type: 'treemap',
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: '{b}: {c}'
                  },
                  borderWidth: 1,
                  borderColor: '#ccc'
                },
                emphasis: {
                  label: {
                    show: true
                  },
                  color: '#cc99cc',
                  borderWidth: 3,
                  borderColor: '#996699'
                }
              },
              data: [
                {
                  name: '销售部',
                  value: 354724.98,
                  itemStyle: {
                    normal: {
                      color: '#BA55D3'
                    }
                  }
                },
                {
                  name: '技术部',
                  value: 316796.86,
                  itemStyle: {
                    normal: {
                      color: '#6495ED'
                    }
                  }
                },
                {
                  name: '研发部',
                  value: 288775.65,
                  itemStyle: {
                    normal: {
                      color: '#0000FF'
                    }
                  }
                },
                {
                  name: '后勤部',
                  value: 266177.56,
                  itemStyle: {
                    normal: {
                      color: '#87CEEB'
                    }
                  }
                },
                {
                  name: '财务部',
                  value: 166055.28,
                  itemStyle: {
                    normal: {
                      color: '#00BFFF'
                    }
                  }
                },
                {
                  name: '人事部',
                  value: 166055.28,
                  itemStyle: {
                    normal: {
                      color: '#40E0D0'
                    }
                  }
                },
                {
                  name: '商务部',
                  value: 100000,
                  itemStyle: {
                    normal: {
                      color: '#D2691E'
                    }
                  }
                },
                {
                  name: '审计部',
                  value: 100000,
                  itemStyle: {
                    normal: {
                      color: '#BDB76B'
                    }
                  }
                }
              ]
            }
          ]
        }

      )
      // 随着屏幕大小调节图表
      window.addEventListener('resize', this.resizeFun)
    },
    resizeFun () {
      this.chart.resize()
    }
  }
}
</script>
