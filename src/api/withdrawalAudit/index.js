import request from '@/utils/request'

// 查询用户提现数据
export function getUserWithdrawal(params) {
	return request({
		url: '/withdrawal/list',
		method: 'get',
		params
	})
}

// 通过提现审核
export function passWithdrawal(data) {
	return request({
		url: '/withdrawal/toExamine',
		method: 'post',
		data
	})
}

// 查询提现日志记录
export function getWithdrawalLogs(params) {
	return request({
		url: '/withdrawalLogs/list',
		method: 'get',
		params
	})
}

// 查询用户银行卡列表
export function getWithdrawalBank(params) {
	return request({
		url: '/withdrawalBank/list',
		method: 'get',
		params
	})
}
