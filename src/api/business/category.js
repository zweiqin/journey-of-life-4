import request from '@/utils/request'

export function listCategory(query) {
	return request({
		url: '/category/list',
		method: 'get',
		params: query
	})
}

export function listCatL1(params) {
	return request({
		url: '/category/l1',
		method: 'get',
		params
	})
}

export function listCatL2(params) {
	return request({
		url: '/category/l2',
		method: 'get',
		params
	})
}

export function createCategory(data) {
	return request({
		url: '/category/create',
		method: 'post',
		data
	})
}

export function readCategory(data) {
	return request({
		url: '/category/read',
		method: 'get',
		data
	})
}

export function updateCategory(data) {
	return request({
		url: '/category/update',
		method: 'post',
		data
	})
}

export function deleteCategory(data) {
	return request({
		url: '/category/delete',
		method: 'post',
		data
	})
}
