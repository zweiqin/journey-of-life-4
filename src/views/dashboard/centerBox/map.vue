<template>
  <div
    ref="chart"
    :style="{height:height,width:width}"
    class="charsbase"
  />
</template>

<script>
import 'echarts/map/js/china.js'
// import '@/utils/china.js'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/line')
export default {
  name: 'NumberOfDoneMonth',
  props: ['height', 'width'],
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
    // 窗口变化时执行的函数
    window.onresize = () => {
      return (() => {
        this.chart.resize()
      })()
    }
    // this.$bus.$on('gaugeRecordMonthlyObj', (gaugeRecordMonthlyObj) => {
    //   if (gaugeRecordMonthlyObj != null) {
    //     for (let i = 0; i < gaugeRecordMonthlyObj.length; i++) {
    //       // 获取数据
    //       this.xData[i] = gaugeRecordMonthlyObj[i].date
    //       this.yData[i] = gaugeRecordMonthlyObj[i].number * 1
    //     }
    //     this.setChart()
    //   }
    // })
    // window.addEventListener('resize', () => {
    //   this.chart.resize()
    // })
  },
  beforeDestroy () {
    this.$bus.$off('gaugeRecordMonthlyObj')
    window.removeEventListener('resize', () => {
      this.chart.resize()
    })
  },
  methods: {
    // 控制组件的字体随屏幕的缩放而改变大小
    ChartfontSize (res) {
      const clientHeight = document.documentElement.clientHeight
      if (!clientHeight) return
      const fs = (clientHeight / 1080)
      return res * fs
    },
    init () {
      // 2.初始化
      this.chart = echarts.init(this.$refs.chart)
    },
    setChart () {
      var geoCoordMap = {
        '福州': [119.4543, 25.9222],
        '太原': [112.3352, 37.9413],
        '长春': [125.8154, 44.2584],
        '重庆': [107.7539, 30.1904],
        '西安': [109.1162, 34.2004],
        '成都': [103.9526, 30.7617],
        '常州': [119.4543, 31.5582],
        '北京': [116.4551, 40.2539],
        '北海': [109.314, 21.6211],
        '海口': [110.3893, 19.8516],
        '广州': [113.5107, 23.2196]
      }

      var GZData = [
        [{ name: '广州' }, { name: '福州', value: 95 }],
        [{ name: '广州' }, { name: '太原', value: 90 }],
        [{ name: '广州' }, { name: '长春', value: 80 }],
        [{ name: '广州' }, { name: '重庆', value: 70 }],
        [{ name: '广州' }, { name: '西安', value: 60 }],
        [{ name: '广州' }, { name: '成都', value: 50 }],
        [{ name: '广州' }, { name: '常州', value: 40 }],
        [{ name: '广州' }, { name: '北京', value: 30 }],
        [{ name: '广州' }, { name: '北海', value: 20 }],
        [{ name: '广州' }, { name: '海口', value: 10 }]
      ]

      var convertData = function (data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i]
          var fromCoord = geoCoordMap[dataItem[0].name]
          var toCoord = geoCoordMap[dataItem[1].name]
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord]
            })
          }
        }
        return res
      }

      var color = ['#46bee9']
      var series = [];
      [['广州', GZData]].forEach(function (item, i) {
        series.push(
          {
            name: item[0] + ' Top10',
            type: 'lines',
            zlevel: 2,
            symbol: ['none', 'arrow'],
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: 'arrow',
              symbolSize: 5
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0] + ' Top10',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
              }
            },
            symbolSize: function (val) {
              return val[2] / 8
            },
            itemStyle: {
              normal: {
                color: color[i]
              }
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              }
            })
          })
      })

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item'
        },
        geo: {
          // 地图放大
          zoom: 1.3,
          map: 'china',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: 'rgba(50, 60, 72, 0.8)',
              borderColor: '#404a59'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: series
      }

      // 4.传入数据
      // option && echarts.setOption(option);
      this.chart.setOption(option)
      var that = this
      this.chart.on('click', function (params) {
        that.$bus.$emit('place', params.name)
        // if (!params.data.ename) {
        //   alert('暂无' + params.name + '地图数据')
        //   return
        // }
        // this.$router.push({
        //   path: '/province',
        //   query: { provinceName: params.data.ename, province: params.name }
        // })
      })
    }
  }
}
</script>

<style scoped>
.charsbase {
  background: transparent;
}
</style>
