import request from '@/utils/request'

export function getBusinessList(params) {
	return request({
		url: '/dtsAdmin/businessList',
		method: 'get',
		params
	})
}

