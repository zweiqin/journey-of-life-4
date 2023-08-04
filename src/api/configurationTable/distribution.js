import request from '@/utils/request'

// 查询
export function settingControllerGet(params) {
	return request({
		url: '/dtsSettingController/get/DISTRIBUTION_SETTING',
		method: 'get',
		params
	})
}

// 改
export function settingControllerPut(data) {
	return request({
		url: '/dtsSettingController/put/WECHAT_CONNECT',
		method: 'put',
		data
	})
}

// 查询分销员列表
export function distributionGetByPage(params) {
	return request({
		url: '/dtsDistribution/getByPage',
		method: 'get',
		params
	})
}

// 分销员审核
export function distributionSelectedAudit(data) {
	return request({
		url: `/dtsDistributionSelectedGoods/audit/${data.id}`,
		method: 'put',
		data
	})
}
