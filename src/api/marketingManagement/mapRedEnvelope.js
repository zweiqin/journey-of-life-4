import request from '@/utils/request'

// 地图红包列表
export function getRedEnvelopeListData(params) {
	return request({
		url: '/adminDtsWrapRed/list',
		method: 'get',
		params
	})
}

// 地图小红包列表
export function getSmallRedList(params) {
	return request({
		url: '/adminDtsWrapRed/redList',
		method: 'get',
		params
	})
}

// 优惠卷列表
export function getCouponList(params) {
	return request({
		url: '/adminDtsWrapRed/couponList',
		method: 'get',
		params
	})
}
