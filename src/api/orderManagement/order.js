import request from '@/utils/request'
import Qs from 'qs'

export function listOrder(query) {
	return request({
		url: '/order/list',
		method: 'get',
		params: query,
		paramsSerializer(params) {
			return Qs.stringify(params, { arrayFormat: 'repeat' })
		}
	})
}

export function detailOrder(id) {
	return request({
		url: '/order/detail',
		method: 'get',
		params: { id }
	})
}

export function shipOrder(data) {
	return request({
		url: '/order/ship',
		method: 'post',
		data
	})
}

export function refundOrder(data) {
	return request({
		url: '/order/refund',
		method: 'post',
		data
	})
}

export function listShipChannel() {
	return request({
		url: '/order/listShipChannel',
		method: 'get'
	})
}
