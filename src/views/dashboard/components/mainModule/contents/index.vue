<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
	<div class="ContainerDataBox">
		<!-- 左边图表部分 -->
		<div class="dataBox_left">
			<!-- 分析图 -->
			<div class="Analysis">
				<!-- 表头 -->
				<TableHeader
					:header-data="AnyList"
					:on-nav-click="getAnyListData"
				></TableHeader>
				<AnalysisEchats></AnalysisEchats>
				<!-- 表未数据展示区 -->
				<div v-if="AnalysisChart" class="Analysis_footer">
					<!-- <div v-for="item in listArray" :key="item.value" class="Af_item">
						<p>{{ item.name }}</p>
						<p>
						<span>{{ item.value }}</span>{{ unit[analysisDataIndex] }}
						</p>
						<p>
						<img src="@/assets/home/down.png" alt="" /><span>11.2%</span>较昨日
						</p>
						</div> -->
					<div class="Af_item">
						<p>{{ anyListDataNameIndex < 2 ? anyListDataNames : anyListDataName }}新增用户</p>
						<p><span>{{ AnalysisChart.userNum }}</span>人</p>
						<!-- <p>
							<img src="@/assets/home/down.png" alt="" /><span>11.2%</span>较上月
							</p> -->
					</div>
					<div class="Af_item">
						<p>{{ anyListDataNameIndex < 2 ? anyListDataNames : anyListDataName }}订单数</p>
						<p><span>{{ AnalysisChart.orderNum }}</span>笔</p>
						<!-- <p>
							<img src="@/assets/home/down.png" alt="" /><span>11.2%</span>较上年
							</p> -->
					</div>
					<div class="Af_item">
						<p>{{ anyListDataNameIndex < 2 ? anyListDataNames : anyListDataName }}订单交易额</p>
						<p><span>{{ AnalysisChart.orderAmount ? AnalysisChart.orderAmount : 0 }}</span>元</p>
						<!-- <p>
							<img src="@/assets/home/down.png" alt="" /><span>11.2%</span>较上月
							</p> -->
					</div>
					<div class="Af_item">
						<p>{{ anyListDataNameIndex < 2 ? anyListDataNames : anyListDataName }}用户交易额</p>
						<p><span>{{ AnalysisChart.userAmount ? AnalysisChart.userAmount : 0 }}</span>元</p>
						<!-- <p>
							<img src="@/assets/home/down.png" alt="" /><span>11.2%</span>较上月
							</p> -->
					</div>
				</div>
			</div>
			<!-- 商家排行榜 -->
			<div class="CommodityRanking">
				<!-- 表头的日期选择 -->
				<TableHeader
					:header-data="Commodity"
					:on-nav-click="getCommodityData"
				></TableHeader>
				<CommodityEachats
					:shop-data-name="CommodityArray[0]"
					:shop-data-value="CommodityArray[1]"
				></CommodityEachats>
			</div>
		</div>
		<!-- 右边图表部分 -->
		<div class="dataBox_right">
			<!-- 中国地图选择 -->
			<div class="DotStatistics">
				<TableHeader
					:header-data="{ name: '分公司区域分布', list: [] }"
				></TableHeader>
				<div class="DSquantity">
					<p><span></span>网点数量</p>
					<p><span>{{ addresMerchantRanking.length }}</span>家</p>
				</div>
				<!-- <div class="DSquantity">
					<p><span style="background-color: #165dff"></span>师傅数量</p>
					<p><span>445566</span>人</p>
					</div> -->
				<div class="addresSelect">
					<img src="@/assets/home/select.png" alt="" @click="addresSelect(addres)"><input v-model="addres" type="text" placeholder="请输入地址" @keyup.enter="addresSelect(addres)">
				</div>
				<MapChina @replaAddres="getAddres"></MapChina>
			</div>
			<!-- 商家排行榜 -->
			<div class="CommodityRanking">
				<TableHeader
					:header-data="MerchantRanking"
					:on-nav-click="getMerchantRanking"
				></TableHeader>
				<MerchantRankingTab
					:shop-data-name="MerchantRankingArray[0]"
					:shop-data-value="MerchantRankingArray[1]"
				></MerchantRankingTab>
			</div>
		</div>
	</div>
</template>

<script>
// 所有图表的日期选择
import TableHeader from '../../statisticalArea/headerButton'
// 分析图
import AnalysisEchats from '../../echarts/AnalysisEchats.vue'
// 商品排行
import CommodityEachats from '../../echarts/CommodityEachats.vue'
// 商家排行
import MerchantRankingTab from '../../echarts/MerchantRanking.vue'
// 中国地图
import MapChina from '../../echarts/MapChina.vue'
// eslint-disable-next-line no-unused-vars
import { getSGStatistics, getAreaSearch, getGoodsRanking, getBusinessRanking } from '@/api/dashboard'
export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'Contents',
	components: { TableHeader, AnalysisEchats, CommodityEachats, MapChina, MerchantRankingTab },
	data() {
		return {
			addres: '顺德区', // 初始地址
			addresMerchantRanking: [],  // 使用地址请求后的数据
			anyListDataName: '',  // 分析表数据
			anyListDataNameIndex: 0, // 用于判断分析表查询时间的下标
			Commodity: { // 头部时间选择按钮的数据 ---- 商品排行榜
				name: '商品排行榜',
				list: ['今日', '近七日', '自定义']
			},
			MerchantRanking: { // 头部时间选择按钮的数据 ---- 商家排行榜
				name: '商家排行榜',
				list: ['今日', '近七日', '自定义']
			},
			CommodityArray: [[], []],
			MerchantRankingArray: [[], []], // 商家排行的数据
			AnyList: { name: '分析图', list: ['今日', '近七日', '自定义'] }, // 分析图切换按钮
			AnalysisChart: null // 分析表下方的展示数据
		}
	},
	computed: {
		anyListDataNames: {
			get() {
				this.anyListDataNameIndex === 0 && this.anyListDataNameIndex < 2 ? '今天' : '近七天'
				return this.anyListDataNameIndex === 0 && this.anyListDataNameIndex < 2 ? '今天' : '近七天'
			},
			set(value) {
				this.anyListDataName = value
				// console.log(this.anyListDataName)
			}
		}
	},
	created() {
		this.getAnyListData(0)
		this.addresSelect(this.addres)
		this.getMerchantRanking()
		this.getCommodityData()
	},
	methods: {
		DaysNum(index) {
			if (index < 2) {
				return index == 0 ? 1 : 7
			}
		},
		// 分析图天选择
		getAnyListData(index = null, ev) {
			if (index < 2) {
				this.anyListDataNameIndex = index
				getSGStatistics({ days: this.DaysNum(index) }).then((res) => {
					this.AnalysisChart = res.data
					// console.log(res)
				})
			} else {
				this.$prompt('请输入天数', '自定义查询的天数', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
					// inputPattern: /^(?:\d|[1-9]\d{0,1}|[12]\d{2}|3[0-6]\d)$/,
					// inputErrorMessage: '最多允许查询一年记录'
				}).then(({ value }) => {
					this.anyListDataNameIndex = index
					getSGStatistics({ days: value }).then((res) => {
						this.AnalysisChart = res.data
						this.$message({
							type: 'success',
							message: '查询成功'
						})
						this.anyListDataNames = '近' + value + '天'
						// console.log(res)
					})
						.catch((err) => {
							this.$message.error('查询失败' + err.errmsg)
						})
				})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						})
					})
			}
		},
		// 商品排行榜天数选择
		getCommodityData(index = '', ev) {
			const arr = [[], []]
			if (index < 2) {
				getGoodsRanking({ days: this.DaysNum(index) }).then((res) => {
					for (const key in res.data) {
						arr[0].push(key)
						arr[1].push(res.data[key])
					}
					this.CommodityArray = arr
				})
			} else {
				this.$prompt('请输入天数', '自定义查询的天数', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
					// inputPattern: /^(?:\d|[1-9]\d{0,1}|[12]\d{2}|3[0-6]\d)$/,
					// inputErrorMessage: '最多允许查询一年记录'
				}).then(({ value }) => {
					getGoodsRanking({ days: value }).then((res) => {
						for (const key in res.data) {
							arr[0].push(key)
							arr[1].push(res.data[key])
						}
						this.$message({
							type: 'success',
							message: '查询成功'
						})
						this.CommodityArray = arr
					})
						.catch((err) => {
							this.$message.error('查询失败' + err.errmsg)
						})
				})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						})
					})
			}
		},
		// 商家排行榜天数选择
		getMerchantRanking(index = '', ev) {
			const arr = [[], []]
			if (index < 2) {
				getBusinessRanking({ days: this.DaysNum(index) }).then((res) => {
					for (const key in res.data) {
						arr[0].push(key)
						arr[1].push(res.data[key])
					}
					this.MerchantRankingArray = arr
				})
			} else {
				this.$prompt('请输入天数', '自定义查询的天数', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
					// inputPattern: /^(?:\d|[1-9]\d{0,1}|[12]\d{2}|3[0-6]\d)$/,
					// inputErrorMessage: '最多允许查询一年记录'
				}).then(({ value }) => {
					getBusinessRanking({ days: value }).then((res) => {
						for (const key in res.data) {
							arr[0].push(key)
							arr[1].push(res.data[key])
						}
						this.$message({
							type: 'success',
							message: '查询成功'
						})
						this.MerchantRankingArray = arr
					})
						.catch((err) => {
							this.$message.error('查询失败' + err.errmsg)
						})
				})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						})
					})
			}
		},
		// 区域搜索
		addresSelect(addressName) {
			getAreaSearch({ addressName }).then((res) => {
				this.addresMerchantRanking = res.data
				// console.log(res.data)
			})
		},
		// 获取地图选择的地址
		getAddres(addressName) {
			// console.log(addressName);
			this.addres = addressName
			getAreaSearch({ addressName }).then((res) => {
				this.addresMerchantRanking = res.data
				// console.log(res.data)
			})
		}
	}
}
</script>

<style lang="scss">
.ContainerDataBox {
  margin-top: 1.0417vw;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 左边数据表格的样式 */
  .dataBox_left {
    width: 52.22%;
    height: 52.6042vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* 分析图表区域样式 */
    .Analysis {
      padding: 38px 32px 17px 32px;
      width: 100%;
      height: 49%;
      background-color: white;
      /* 表尾的数据展示区 */
      .Analysis_footer {
        margin-top: 1.1458vw;
        width: 100%;
        height: 4.7917vw;
        display: flex;
        .Af_item {
          width: 10vw;
          height: 4.7917vw;
          font-family: 思源黑体;
          color: #424e66;
          > p:nth-of-type(1) {
            font-size: 0.8333vw;
            font-weight: normal;
            line-height: 1.25vw;
            display: flex;
            align-items: center;
          }
          > p:nth-of-type(2) {
            > span {
              font-size: 1.6667vw;
              font-weight: normal;
              line-height: 2.0833vw;
              color: #141736;
            }
          }
          > p:nth-of-type(3) {
            margin-top: 0.4167vw;
            font-size: 0.6771vw;
            display: flex;
            align-items: center;
            > span {
              box-sizing: content-box;
              font-weight: normal;
              line-height: 1.0417vw;
              color: #f53f3f;
              padding-right: 0.2083vw;
            }
          }
        }
      }
    }
    .CommodityRanking {
      padding: 38px 32px 17px 32px;
      width: 100%;
      height: 48.6%;
      background-color: white;
    }
  }
  /* 右边表格的整体大小样式 */
  .dataBox_right {
    width: 46.6%;
    height: 52.6042vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .CommodityRanking {
        box-sizing: border-box;
        padding: 38px 32px 17px 32px;
        width: 100%;
        height: 48.6%;
        background-color: white;
      }
    .DotStatistics {
      padding: 38px 32px 17px 32px;
      background-color: white;
      position: relative;
      width: 100%;
      height: 25.7292vw;
      font-family: 思源黑体;
      .DSquantity {
        margin-top: 1.1458vw;
        margin-bottom: 0.7813vw;
        > p:nth-of-type(1) {
          display: flex;
          align-items: center;
          font-size: 0.9375vw;
          font-weight: normal;
          line-height: 1.25vw;
          color: #424e66;
          > span {
            margin: 3px;
            display: inline-block;
            width: 0.8333vw;
            height: 0.8333vw;
            border-radius: 50%;
            background-color: #14c9c9;
          }
        }
        > p:nth-of-type(2) {
          font-size: 1.0417vw;
          font-weight: normal;
          line-height: 2.1875vw;
          color: #141736;
          > span {
            margin-top: 0.4688vw;
            margin-right: 3px;
            font-size: 1.5625vw;
          }
        }
      }
      .addresSelect {
        z-index: 9;
        position: absolute;
        top: 30px;
        right: 60px;
        width: 12.7604vw;
        height: 1.9271vw;
        border-radius: 2.6042vw;
        opacity: 1;
        background: #e1e8f7;
        display: flex;
        align-items: center;
        justify-content: center;
        > input {
          margin-left: 5px;
          border: none;
          background: none;
          outline: none;
        }
        > img {
          cursor: pointer;
          width: 18px;
          height: 18px;
        }
      }
    }
    .address {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .DataArea {
      width: 100%;
      height: 7.5vw;
      padding: 19px 0 19px 0;
      display: flex;
      justify-content: space-between;
      .DataArea_item {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-evenly;
        > img {
          width: 1.6667vw;
          height: 1.6667vw;
        }
        > p:nth-of-type(1) {
          font-family: 思源黑体;
          font-size: 0.7292vw;
          font-weight: normal;
          line-height: 1.0417vw;
          color: #424e66;
        }
        > p:nth-of-type(2) {
          font-family: 思源黑体;
          font-size: 1.4583vw;
          font-weight: normal;
          line-height: 1.6667vw;
          color: #141736;
        }
      }
    }
    .tableView {
      position: relative;
      padding: 1.5625vw;
      width: 100%;
      height: 17.1875vw;
      display: flex;
      > img:nth-of-type(1) {
        width: 20.1042vw;
        height: 100%;
      }
    }
  }
}
</style>
