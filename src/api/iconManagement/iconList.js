import request from '@/utils/request'

// 查询H5图标列表
export function h5IconList(params) {
	return request({
		url: '/dtsGradePermission/h5IconList',
		method: 'get',
		params
	})
}

// 新增H5图标
export function h5IconAdd(data) {
	return request({
		url: '/dtsGradePermission/h5IconAdd',
		method: 'post',
		data
	})
}

// 修改H5图标
export function h5IconUpdate(data) {
	return request({
		url: '/dtsGradePermission/h5IconUpdate',
		method: 'post',
		data
	})
}

// 案例删除
export function h5IconDeleted(params) {
	return request({
		url: `/dtsGradePermission/h5IconDeleted/${params.id}`,
		method: 'delete'
	})
}
