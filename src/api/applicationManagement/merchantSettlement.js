import request from '@/utils/request'
// 审核申请集合方法

// 查询商家申请列表
export function upgradeRequestList(params) {
	return request({
		url: '/dtsUpgradeRequest/list',
		method: 'get',
		params
	})
}

// 查询商家申请审核内容
export function upgradeRequestListOne(params) {
	return request({
		url: '/dtsUpgradeRequest/listOne',
		method: 'get',
		params
	})
}

// 审核商家申请
export function upgradeRequestCareful(data) {
	return request({
		url: '/dtsUpgradeRequest/careful',
		method: 'post',
		data
	})
}

// 审核营销策划师
export function UpgradeRequestMarketing(data) {
	return request({
		url: '/dtsUpgradeRequest/marketing',
		method: 'post',
		data
	})
}

// 区域审核
export function UpgradeRequestRegionalAgent(data) {
	return request({
		url: '/dtsUpgradeRequest/regionalAgent',
		method: 'post',
		data
	})
}
