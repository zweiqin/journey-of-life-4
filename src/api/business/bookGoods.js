import request from '@/utils/request'

export function listGoods(query) {
	return request({
		url: '/appoint/list',
		method: 'get',
		params: query
	})
}

export function listAllGoods(query) {
	return request({
		url: '/goods/list',
		method: 'get',
		params: query
	})
}

export function deleteGoods(data) {
	return request({
		url: '/goods/delete',
		method: 'post',
		data
	})
}

export function publishGoods(data) {
	return request({
		url: '/appoint/add',
		method: 'post',
		data
	})
}

export function detailGoods(params) {
	return request({
		url: '/appoint/detail',
		method: 'get',
		params
	})
}

export function editGoods(data) {
	return request({
		url: '/appoint/update',
		method: 'post',
		data
	})
}

export function listCatAndBrand() {
	return request({
		url: '/goods/catAndBrand',
		method: 'get'
	})
}
