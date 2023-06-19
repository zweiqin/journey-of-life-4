import request from '@/utils/request'

// 总部会员统计
export function getStatisticsMemberCount(params) {
	return request({
		url: '/statistics/memberCount',
		method: 'get',
		params
	})
}

// 订单统计数量
export function getStatisticsOrderCount(params) {
	return request({
		url: '/statistics/orderCount',
		method: 'get',
		params
	})
}

// 财务统计
export function getStatisticsFinanceCount(params) {
	return request({
		url: '/statistics/financeCount',
		method: 'get',
		params
	})
}

// 佣金统计
export function getCommissionCount(params) {
	return request({
		url: '/statistics/commissionCount',
		method: 'get',
		params
	})
}

// 代金卷统计
export function getSVoucherCount(params) {
	return request({
		url: '/statistics/voucherCount',
		method: 'get',
		params
	})
}

// 代金卷排行
export function getSCBusinessCount(params) {
	return request({
		url: '/statistics/commissionBusinessCount',
		method: 'get',
		params
	})
}

// 图形
export function getSGStatistics(params) {
	return request({
		url: '/statistics/graphStatistics',
		method: 'get',
		params
	})
}

// 关系链地区分布
export function getSRDistribution(params) {
	return request({
		url: '/statistics/regionalDistribution',
		method: 'get',
		params
	})
}

// 关系链地区分布分类
export function getSRDType(params) {
	return request({
		url: '/statistics/regionalDistributionType',
		method: 'get',
		params
	})
}

// 关系链用户详情
export function getRegDetails(params) {
	return request({
		url: '/statistics/regionalDistributionDetails',
		method: 'get',
		params
	})
}

// 区域搜索
export function getAreaSearch(params) {
	return request({
		url: '/statistics/areaSearch',
		method: 'get',
		params
	})
}

// 商品销量排行
export function getGoodsRanking(params) {
	return request({
		url: '/statistics/goodsRanking',
		method: 'get',
		params
	})
}

// 商家营业额排行
export function getBusinessRanking(params) {
	return request({
		url: '/statistics/businessRanking',
		method: 'get',
		params
	})
}
