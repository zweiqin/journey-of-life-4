export const renderData = [{
	name: '会员统计',
	imgSrc: require('@/assets/home/VIP.png'),
	childName: [{ name: '会员总量', key: 'memberCount', value: '' },
		{ name: '分公司', key: 'branchTotal', value: '' },
		{ name: '营销策划师', key: 'seniorTotal', value: '' },
		{ name: '商家', key: 'businessTotal', value: '' },
		{ name: '普通会员', key: 'ordinaryCount', value: '' }],
	data: {},
	isDanger: false,
	dagerText: '统计数据有问题，点击查看会员统计详情'
},
{
	name: '订单统计',
	imgSrc: require('@/assets/home/wenjian.png'),
	childName: [{ name: '订单总量', key: 'orderShoppingTotal', value: '' },
		{ name: '今日单量', key: 'toDayCompleteShopping', value: '' },
		{ name: '异常订单', key: 'toDayCompleteLocality', value: '' },
		{ name: '完成订单', key: 'orderLocalityTotal', value: '' }],
	data: {},
	isDanger: false,
	dagerText: '订单统计有问题，点击查看订单详情'
},
{
	name: '财务统计',
	imgSrc: require('@/assets/home/add.png'),
	childName: [{ name: '总交易额', key: 'localityTurnover', value: '' },
		{ name: '今日交易', key: 'shoppingCountToDay', value: '' },
		{ name: '总提取', key: 'shoppingTurnover', value: '' },
		{ name: '总支出', key: 'Withdrawal', value: '' }],
	data: {},
	isDanger: false,
	dagerText: '财务统计有问题，点击查看财务详情'
},
{
	name: '代金卷统计',
	imgSrc: require('@/assets/home/money.png'),
	childName: [{ name: '总发行', key: 'voucherCount', value: '' },
		{ name: '今日发行', key: 'toDayVoucherCount', value: '' },
		{ name: '总购买金额', key: 'purchaseCount', value: '' },
		{ name: '今日购买金额', key: 'toDayPurchaseCount', value: '' }],
	data: {},
	isDanger: false,
	routerPath: '/marketingManagement/couponManagement/couponManagementOrder',
	dagerText: '代金卷统计比例有误，点击查看代金卷订单详情'
},
{
	name: '佣金统计',
	imgSrc: require('@/assets/home/xingqi.png'),
	childName: [{ name: '总佣金', key: 'allAmount', value: '' },
		{ name: '今日佣金总额', key: 'toTaDayAmount', value: '' },
		{ name: '佣金提现总额', key: 'toTaDayWithdrawal Amount', value: '' },
		{ name: '佣金购买总额', key: 'withdrawalAmount', value: '' }],
	data: {},
	isDanger: false,
	dagerText: '佣金统计有问题，点击查看佣金详情'
}]

// getStatisticsMemberCount().then((res) => {
// 	this.membershipStatistics = res.data
// })
// getStatisticsOrderCount().then((res) => {
// 	this.orderStatistics = res.data
// })
// getStatisticsFinanceCount().then((res) => {
// 	this.financialStatistics = res.data
// })
// getSVoucherCount().then((res) => {
// 	this.voucherStatistics = res.data
// })
// getCommissionCount().then((res) => {
// 	this.commissionStatistics = res.data
// })
// getSCBusinessCount().then((res) => {
// 	this.merchantDepositRollRanking = res.data
// })

// const keyIndex = []
// const keyValue = []
// this.$set(this.renderData, index, { ...this.renderData[index], data: item.data })
// this.$set(this.renderData, index, { ...this.renderData[index], data: item.data })
// for (const key in item.data) {
// 	keyIndex.push(key)
// 	keyValue.push(item.data[key])
// }
// this.renderData[index].childName.forEach((childrenItem, index) => {
// 	childrenItem.key = keyIndex[index]
// 	childrenItem.value = keyValue[index]
// })

/* <div style="height: 90%;margin-top:0.2604vw">
<el-table
  v-loading="listLoading" :data="VoucherRankings" size="small" element-loading-text="正在查询中。。。"
  border fit height="90%"
  highlight-current-row
>
  <el-table-column align="center" min-width="30px" max-width="40px" label="排名" prop="brandId" sortable />
  <el-table-column align="center" min-width="30px" max-width="40px" label="门店名字" prop="brandName" sortable />
  <el-table-column align="center" min-width="30px" max-width="40px" label="消费卷金额" prop="voucher" sortable />
</el-table>
</div> */

// checkImageURL(imageURL) {  // 监听图片加载错误的方法之一
//   return new Promise((resolve, reject) => {
//     const img = new Image()
//     img.onload = function () {
//       resolve(true) // 图片加载成功
//     }
//     img.onerror = function () {
//       resolve(false) // 图片加载失败
//     }
//     // img.src = imageURL
//   })
// }
