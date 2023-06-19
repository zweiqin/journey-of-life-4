<template>
	<div id="AnalysisEcharts" style="width: 100%; height: 13.0208vw"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
	name: 'AnalysisEchats',
	data() {
		return {
			option: {
				tooltip: {
					trigger: 'item',
					axisPointer: {
						// 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '2%',
					right: '4%',
					bottom: '14%',
					top: '16%',
					containLabel: true
				},
				legend: {
					data: ['本年收益', '上年收益', '收益动态'],
					left: '55%',
					top: '4%',
					textStyle: {
						color: '#666666'
					},
					itemWidth: 15,
					itemHeight: 10,
					itemGap: 25
				},
				xAxis: {
					type: 'category',
					data: [
						'一月',
						'二月',
						'三月',
						'四月',
						'五月',
						'六月',
						'七月',
						'八月',
						'九月',
						'十月',
						'十一月',
						'十二月'
					],
					axisLine: {
						lineStyle: {
							color: '#cdd5e2'
						}
					},
					axisLabel: {
						color: '#666666'
					}
				},

				yAxis: [
					{
						name: '单位(万元)',
						type: 'value',
						nameTextStyle: {
							align: 'right',
							color: '#424E66'
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#cdd5e2'
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#cdd5e2',
								type: 'dashed'
							}
						},
						axisLabel: {
							color: '#666666'
						}
					},
					{
						type: 'value',
						name: '百分比',
						nameTextStyle: {
							align: 'left',
							color: '#666666'
						},
						position: 'right',
						axisLine: {
							lineStyle: {
								color: '#cdd5e2'
							}
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: true,
							formatter: '{value} %', // 右侧Y轴文字显示
							color: '#666666'
						}
					}
				],
				series: [
					{
						name: '本年收益',
						type: 'bar',
						barWidth: '20px',
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: '#165dff'
								},
								{
									offset: 1,
									color: '#5dc1fd'
								}
							])
						},
						data: [
							62000,
							50000,
							45000,
							50000,
							30000,
							70000,
							62000,
							62000,
							50000,
							45000,
							50000,
							30000
						]
					},
					{
						name: '上年收益',
						type: 'bar',
						barWidth: '20px',
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: '#14C9C9'
								},
								{
									offset: 1,
									color: '#5dc1fd'
								}
							])
						},
						data: [
							80000,
							100000,
							40000,
							80000,
							60000,
							63000,
							80000,
							80000,
							100000,
							40000,
							80000,
							60000
						]
					},
					{
						name: '收益动态',
						type: 'line',
						yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
						smooth: false, // 平滑曲线显示

						symbol: 'circle', // 标记的图形为实心圆
						symbolSize: 8, // 标记的大小
						itemStyle: {
							color: '#ffa43a',
							borderColor: 'rgba(255, 234, 0, 0.5)', // 圆点透明 边框
							borderWidth: 5
						},
						lineStyle: {
							color: '#ffa43a'
						},

						data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5, 4.2, 3.8, 4.8, 3.5]
					}
				]
			}
		}
	},
	mounted() {
		const chartDom = echarts.init(document.getElementById('AnalysisEcharts'))
		chartDom.setOption(this.option, true)
		// window.onresize = chartDom.resize
	},
	methods: {}
}
</script>

<style lang="scss">
#AnalysisEcharts {
  margin-top: 1.9792vw;
}
</style>
