import request from '@/utils/request'

export function listGoods(query) {
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
		url: '/goods/create',
		method: 'post',
		data
	})
}

export function detailGoods(params) {
	return request({
		url: '/goods/detail',
		method: 'get',
		params
	})
}

export function editGoods(data) {
	return request({
		url: '/goods/update',
		method: 'post',
		data
	})
}

export function listCatAndBrand(brandId) {
	return request({
		url: '/goods/catAndBrand',
		method: 'get',
		params: { brandId }
	})
}
