import request from '@/utils/request'

// 建议列表
export function customerFeedbackList(params) {
	return request({
		url: '/dtsCustomerFeedback/customerList',
		method: 'get',
		params
	})
}

// 处理建议
export function customerFeedbackUpdateStatus(params) {
	return request({
		url: '/dtsCustomerFeedback/updateStatus',
		method: 'get',
		params
	})
}
