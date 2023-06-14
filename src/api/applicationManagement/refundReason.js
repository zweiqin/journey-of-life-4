import request from '@/utils/request'

export function getRefundReason(params) {
	return request({
		url: '/dtsOrderRefundsReason/list',
		method: 'get',
		params
	})
}

// 增加退款申请信息
export function addRefundReason(data) {
	return request({
		url: '/dtsOrderRefundsReason/add',
		method: 'post',
		data
	})
}

// 修改退款申请信息
export function updataRefundReason(data) {
	return request({
		url: '/dtsOrderRefundsReason/update',
		method: 'post',
		data
	})
}

// 删除退款申请 删除的下标直接拼接
export function deleteRefundReason(data) {
	return request({
		url: `/dtsOrderRefundsReason/delete/${data.id}`,
		method: 'delete'
	})
}
