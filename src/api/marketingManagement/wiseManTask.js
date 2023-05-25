import request from '@/utils/request'

// // 达人任务上传
// export function talentTaskUpload(data) {
// 	return request({
// 		url: '/talentTask/upload',
// 		method: 'post',
// 		data
// 	})
// }

// 达人任务列表
export function talentTaskList(params) {
	return request({
		url: '/talentTask/list',
		method: 'get',
		params
	})
}

// 达人任务列表
export function dtsTalentTaskList(params) {
	return request({
		url: '/dtsTalentTask/list',
		method: 'get',
		params
	})
}

// // 达人任务详情
// export function talentTaskInfo(params) {
// 	return request({
// 		url: '/talentTask/info',
// 		method: 'get',
// 		params
// 	})
// }

// // 修改达人任务
// export function talentTaskUpdate(params) {
// 	return request({
// 		url: '/talentTask/update',
// 		method: 'get',
// 		params
// 	})
// }

// 新增达人任务
export function dtsTalentTaskSubmitBox(data) {
	return request({
		url: '/dtsTalentTask/submitBox',
		method: 'post',
		data
	})
}

// 修改达人任务
export function dtsTalentTaskUpdateBox(data) {
	return request({
		url: '/dtsTalentTask/updateBox',
		method: 'post',
		data
	})
}

// 删
export function talentTaskDelete(params) {
	return request({
		url: '/talentTask/delete',
		method: 'get',
		params
	})
}
