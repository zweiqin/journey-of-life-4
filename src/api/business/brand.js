import request from '@/utils/request'

export function listBrand(query) {
	return request({
		url: '/brand/list',
		method: 'get',
		params: query
	})
}

export function createBrand(data) {
	return request({
		url: '/brand/create',
		method: 'post',
		data
	})
}

export function readBrand(data) {
	return request({
		url: '/brand/read',
		method: 'get',
		data
	})
}

export function updateBrand(data) {
	return request({
		url: '/brand/update',
		method: 'post',
		data
	})
}

export function deleteBrand(data) {
	return request({
		url: '/brand/delete',
		method: 'post',
		data
	})
}

export function listCatAndAdmin(brandId) {
	return request({
		url: '/brand/catAndAdmin',
		method: 'get',
		params: { brandId }
	})
}

// 获取门店类型
export function listStoreType() {
	return request({
		url: '/storeType/list',
		method: 'get'
	})
}

// 获取门店类型（新接口）
export function listDtsStoreType() {
	return request({
		url: '/dtsStoreType/typeTree',
		method: 'get'
	})
}
