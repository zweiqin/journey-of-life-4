<template>
	<div class="CommodityTab">
		<div id="CommodityTab"></div>
	</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
	name: 'CommodityEachats',
	// eslint-disable-next-line vue/require-prop-types
	props: ['shopDataName', 'shopDataValue'],
	data() {
		return {
			chartDom: '',
			shopDataNames: {},
			shopDataValues: {}
		}
	},
	computed: {
		option() {
			return {
				backgroundColor: '#fff',
				legend: {
					position: 'top',
					right: 20,
					textStyle: {
						color: 'black'
					},
					data: [ '销售额' ]
				},
				grid: {
					left: '0%',
					right: '20%',
					containLabel: true
				},
				tooltip: {
					show: 'true',
					trigger: 'axis',
					axisPointer: {
						shadowStyle: {
							color: '#ecf2fc60'
						},
						// 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				xAxis: {
					type: 'value',
					axisTick: { show: false },
					axisLine: {
						show: false,
						lineStyle: {
							color: '#fff'
						}
					},
					splitLine: {
						show: false
					}
				},
				yAxis: [
					{
						type: 'category',
						offset: 0,
						axisTick: { show: false },
						axisLabel: {
							align: 'right'
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: 'black'
							}
						},
						data: this.shopDataNames
					// eslint-disable-next-line comma-dangle
					},
					{
						type: 'category',
						axisLine: { show: false },
						axisLabel: { show: false },
						axisTick: { show: false },
						splitArea: { show: false },
						splitLine: { show: false },
						data: this.shopDataNames
					}
				],
				series: [
					{
						name: '销售额',
						type: 'bar',
						yAxisIndex: 1,
						barWidth: 10,
						itemStyle: {
							show: true,
							borderRadius: 3,
							color: '#FFC117',
							// color: '#165DFF',
							borderWidth: 0,
							borderColor: '#333'
						},
						barGap: '0%',
						data: this.shopDataValues
					// eslint-disable-next-line comma-dangle
					},
					// {
					// 	name: '上年销售额',
					// 	type: 'bar',
					// 	barWidth: 10,
					// 	itemStyle: {
					// 		borderRadius: 3,
					// 		show: true,
					// 		color: '#FFC117',
					// 		borderWidth: 0,
					// 		borderColor: '#333'
					// 	},
					// 	barGap: '0',
					// 	data: this.shopDataValues
					// }
				]
			}
		}
	},
	watch: {
		shopDataName(newValue) {
			this.shopDataNames = newValue
			window.console.log(newValue)
		},
		shopDataValue(newValue) {
			this.shopDataValues = newValue
			const EDom = document.getElementById('CommodityTab')
			// const chartDom = echarts.init(EDom)
			this.chartDom.clear()
			this.chartDom.setOption(this.option, true)
			this.chartDom.resize({
				height: EDom.style.height = this.shopDataName.length * 80 + 'px'
			})
		}
	},
	created() {
		this.shopDataNames = this.shopDataName
		this.shopDataValues = this.shopDataValue
	},
	mounted() {
		const EDom = document.getElementById('CommodityTab')
		const chartDom = echarts.init(EDom)
		this.chartDom = chartDom
		chartDom.setOption(this.option, true)
		chartDom.resize({
			height: EDom.style.height = this.shopDataName.length * 80 + 'px'
		})
	}
}
</script>

<style lang="scss">
.CommodityTab {
  margin-top: 1.3021vw;
  width: 100%;
  height: 80%;
  overflow-y: scroll;
  #CommodityTab {
    color: #ecf2fc60;
    width: 100%;
    height: 8000px;
  }
}
</style>
