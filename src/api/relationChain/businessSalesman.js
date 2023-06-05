import request from '@/utils/request'

export function getPlannerList(params) {
	return request({
		url: '/dtsAdmin/plannerList',
		method: 'get',
		params
	})
}

export function getUserList(params) {
	return request({
		url: 'dtsAdmin/businessUserList',
		method: 'get',
		params
	})
}

