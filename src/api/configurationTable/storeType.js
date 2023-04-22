import request from '@/utils/request'

// // 增
// export function listAdd(data) {
// 	return request({
// 		url: '/storeType/create',
// 		method: 'post',
// 		data
// 	})
// }

// 增
export function dtsStoreTypeAddType(data) {
	return request({
		url: '/dtsStoreType/addType',
		method: 'post',
		data
	})
}

// // 改
// export function listedit(data) {
// 	return request({
// 		url: '/storeType/update',
// 		method: 'post',
// 		data
// 	})
// }

// 改
export function dtsStoreTypeUpdateType(data) {
	return request({
		url: '/dtsStoreType/updateType',
		method: 'post',
		data
	})
}

// 删
export function listDelete(data) {
	return request({
		url: '/storeType/delete',
		method: 'post',
		data
	})
}

// 查
// 查询列表
export function listGet(query) {
	return request({
		url: '/storeType/list',
		method: 'get',
		params: query
	})
}

// 通过id查询列表
export function idGet(query) {
	return request({
		url: '/storeType/detail',
		method: 'get',
		params: query
	})
}
