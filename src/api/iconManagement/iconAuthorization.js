import request from '@/utils/request'

// 查询授权列表
export function selectH5RoleEmpower(params) {
	return request({
		url: '/rolePermission/selectH5RoleEmpower',
		method: 'get',
		params
	})
}

// h5图标授权
export function permissionH5RoleEmpower(data) {
	return request({
		url: '/rolePermission/h5RoleEmpower',
		method: 'post',
		data
	})
}
