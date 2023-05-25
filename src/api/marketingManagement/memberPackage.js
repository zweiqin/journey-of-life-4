import request from '@/utils/request'

// 查询会员套餐列表
export function packageMemberList(params) {
	return request({
		url: '/dtsPackageMember/memberList',
		method: 'get',
		params
	})
}

// 添加会员套餐列表
export function packageMemberAdd(data) {
	return request({
		url: '/rolePermission/add',
		method: 'post',
		data
	})
}

// 修改会员套餐列表
export function packageMemberUpdate(data) {
	return request({
		url: '/dtsPackageMember/update',
		method: 'post',
		data
	})
}

// 删除会员套餐列表
export function packageMemberDelete(params) {
	return request({
		url: `/dtsPackageMember/deleted/${params.id}`,
		method: 'delete'
	})
}

// 查询服务套餐
export function packageServiceList(params) {
	return request({
		url: '/dtsPackageService/list',
		method: 'get',
		params
	})
}

// 添加服务套餐
export function packageServiceAdd(data) {
	return request({
		url: '/dtsPackageService/add',
		method: 'post',
		data
	})
}

// 修改服务套餐
export function packageServiceUpdate(data) {
	return request({
		url: '/dtsPackageService/update',
		method: 'post',
		data
	})
}

// 删除会员套餐列表
export function packageServiceDelete(params) {
	return request({
		url: `/dtsPackageService/deleted/${params.id}`,
		method: 'delete'
	})
}
