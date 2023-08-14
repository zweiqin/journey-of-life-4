import request from '@/utils/request'

export function getRefundApprovalForm(params) {
	return request({
		url: '/dtsOrderRefunds/getRefundsList',
		method: 'get',
		params
	})
}

export function fetAuditOperation(data) {
	return request({
		url: '/dtsOrderRefunds/toExamine',
		method: 'post',
		data
	})
}
