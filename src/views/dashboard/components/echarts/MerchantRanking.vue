<template>
	<div class="CommodityTab">
		<div id="MerchantRankingTab"></div>
	</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'MerchantRanking',
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
					right: 10,
					textStyle: {
						color: 'black'
					},
					data: [ '销售额' ]
				},
				grid: {
					left: '0%',
					// right: '20%',
					bottom: '0%',
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
					},
					backgroundColor: '#fff',
					extraCssText: 'box-shadow: 2px 2px 5px 0px rgba(19, 78, 195, 0.1);',
					padding: [
						5,  // 上
						10, // 右
						5,  // 下
						10 // 左
					],
					textStyle: { // 提示框浮层的文本样式。
						color: 'black',
						fontStyle: 'normal',
						fontWeight: 'normal',
						fontFamily: 'sans-serif',
						fontSize: 14
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
							color: '#165DFF',
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
				],
				dataZoom: [
					{
						// start: 1, // 默认为0
						// end: 100, // 默认为100
						type: 'slider',
						show: true,
						yAxisIndex: [0, 1],
						handleSize: 0, // 滑动条的 左右2个滑动条的大小
						width: '10',
						height: '90%', // 组件高度
						// left: 1800, // 左边的距离
						right: 0, // 右边的距离
						top: 20, // 上边边的距离
						borderColor: '#f4f7fc',
						fillerColor: '#bec0c2', // 滑动块的颜色
						backgroundColor: '#f4f7fcb3', // 两边未选中的滑动条区域的颜色
						showDataShadow: false, // 是否显示数据阴影 默认auto
						showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
						realtime: true, // 是否实时更新
						filterMode: 'filter',
						maxValueSpan: 4, // 显示数据的条数(默认显示10个)
						startValue: 0, // 从头开始。
						endValue: 4, // 最多六个
						minValueSpan: 4, // 放大到最少几个
						zoomOnMouseWheel: true, // 滚轮是否触发缩放
						moveOnMouseMove: true, // 鼠标滚轮触发滚动
						moveOnMouseWheel: true
					},
					// 滑块的属性
					{
						type: 'inside',
						show: true,
						zoomOnMouseWheel: true, // 滚轮是否触发缩放
						moveOnMouseMove: true, // 鼠标滚轮触发滚动
						moveOnMouseWheel: true,
						yAxisIndex: [0, 1]
						// start: 1, // 默认为1
						// end: 100 // 默认为100
					}
				]
			}
		}

	},
	watch: {
		shopDataName(newValue) {
			this.shopDataNames = newValue
			// window.console.log(newValue)
		},
		shopDataValue(newValue) {
			this.shopDataValues = newValue
			const EDom = document.getElementById('MerchantRankingTab')
			// const chartDom = echarts.init(EDom)
			this.chartDom.clear()
			this.chartDom.setOption(this.option, true)
			// this.chartDom.resize({
			// 	height: EDom.style.height = this.shopDataName.length * 80 + 100 + 'px'
			// })
		}
	},
	created() {
		this.shopDataNames = this.shopDataName
		this.shopDataValues = this.shopDataValue
	},
	mounted() {
		const EDom = document.getElementById('MerchantRankingTab')
		const chartDom = echarts.init(EDom)
		this.chartDom = chartDom
		chartDom.setOption(this.option, true)
		// chartDom.resize({
		// 	height: EDom.style.height = this.shopDataName.length * 80 + 100 + 'px'
		// })
	}
}
</script>

<style lang="scss">
.CommodityTab {
  margin-top: 1.3021vw;
  width: 100%;
  height: 80%;
  overflow: hidden;
  /* overflow-y: scroll; */
  #MerchantRankingTab {
    width: 100%;
    height: 18.2292vw;
    /* height: 8000px; */
  }
}
</style>
