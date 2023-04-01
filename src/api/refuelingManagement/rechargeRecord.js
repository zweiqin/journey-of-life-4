import request from '@/utils/request'

export function querycompanyaccountamount(data) {
	return request({
		url: '/tuanyou/queryyoukaczlist',
		method: 'post',
		data
	})
}

