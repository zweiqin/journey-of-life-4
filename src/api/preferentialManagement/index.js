import request from '@/utils/request'

// 搜索商家优惠卷
export function SelectMerchantPreferential(query) {
	return request({
		url: '/coupon/list',
		method: 'get',
		params: query
	})
}

// 搜索用户优惠卷
export function SelectUserPreferential(query) {
	return request({
		url: '/coupon/listuser',
		method: 'get',
		params: query
	})
}

// 商家创建优惠卷
export function CreatePreferential(data) {
	return request({
		url: '/coupon/create',
		method: 'post',
		data
	})
}

// 查看优惠卷详情
export function RedingPreferential(query) {
	return request({
		url: '/coupon/read',
		method: 'get',
		params: query
	})
}

// 修改优惠卷信息
export function UpdataPreferential(data) {
	return request({
		url: '/coupon/update',
		method: 'post',
		data
	})
}

// 删除优惠卷
export function DeletePreferential(data) {
	return request({
		url: '/coupon/delete',
		method: 'post',
		data
	})
}
