import request from '@/utils/request'

export function getDtsAdminList(params) {
	return request({
		url: '/dtsAdmin/administrationList',
		method: 'get',
		params
	})
}

export function getUserList(params) {
	return request({
		url: '/dtsAdmin/areaUserList',
		method: 'get',
		params
	})
}

