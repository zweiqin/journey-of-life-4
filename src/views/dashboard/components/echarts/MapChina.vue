<template>
	<div id="map_cn"></div>
</template>

<script>
// 导入地图数据
import dataList from './MapChinaJson/index'
// 中国地图
// import 'echarts/map/js/china'
// import chainData from '../MapChinaJson/100000.json'
import * as echarts from 'echarts'
import chinaMapData from 'echarts/map/js/china' // 这是原生数据 不需要，报错，有个大病sb玩意儿
export default {
	name: 'MapChina',
	data() {
		return {
			chart: null,
			option: {
				tooltip: {
					trigger: 'item'
				},
				series: [
					{
						name: '区域价格',
						type: 'map',
						map: 'china',
						data: dataList,
						tooltip: {
							formatter(param) {
								// 显示当前选中区域的名字
								return param.data.name
							}
						},
						itemStyle: {
							normal: {
								borderColor: '#000',
								borderWidth: 0
							}
						},
						label: {
							show: false
						},
						// selectedMode: 'multiple' // 多选模式
						selectedMode: 'single'
					}
				]
			}
		}
	},
	beforeCreate() {
		// console.log(dataList)
		// console.log(chainData)
	},
	mounted() {
		// echarts.registerMap('china', { geoJSON: chinaMapData })
		const chartDom = echarts.init(document.getElementById('map_cn'))
		const that = this
		this.chart = chartDom
		// 设置地图的点击事件
		this.chart.on('click', function (params) {
			// eslint-disable-next-line vue/require-explicit-emits, vue/custom-event-name-casing
			that.$emit('replaAddres', params.data.name)
		})
		// console.log(chartDom)
		chartDom.setOption(this.option, true)
		// window.onresize = chartDom.resize
	}
}
</script>

<style lang="scss">
#map_cn {
  /* z-index: 999; */
  top: -20px;
  right: 100px;
  width: 31.25vw;
  height: 29.6875vw;
  position: absolute;
}
</style>
