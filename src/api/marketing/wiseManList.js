import request from '@/utils/request'

// // 达人上传
// export function talentUpload(data) {
// 	return request({
// 		url: '/talent/upload',
// 		method: 'post',
// 		data
// 	})
// }

// // 达人列表
// export function talentList (params) {
//   return request({
//     url: '/talent/list',
//     method: 'get',
//     params
//   })
// }

// 达人列表
export function dtsTalentList(params) {
	return request({
		url: '/dtsTalent/list',
		method: 'get',
		params
	})
}

// // 达人详情
// export function talentInfo(params) {
// 	return request({
// 		url: '/talent/info',
// 		method: 'get',
// 		params
// 	})
// }

// // 修改达人
// export function talentUpdate(params) {
// 	return request({
// 		url: '/talent/update',
// 		method: 'get',
// 		params
// 	})
// }

// // 删
// export function listDelete (data) {
//   return request({
//     url: '/talent/update',
//     method: 'post',
//     data
//   })
// }

// 新增达人
export function dtsTalentSubmitTalent(data) {
	return request({
		url: '/dtsTalent/submitTalent',
		method: 'post',
		data
	})
}

// 修改达人
export function dtsTalentUpdateTalent(data) {
	return request({
		url: '/dtsTalent/updateTalent',
		method: 'post',
		data
	})
}

// 达人详情
export function dtsTalentQueryDetail(params) {
	return request({
		url: '/dtsTalent/queryDetail',
		method: 'get',
		params
	})
}

// 达人审核
export function dtsTalentToExamine(params) {
	return request({
		url: '/dtsTalent/toExamine',
		method: 'get',
		params
	})
}

// // 案例添加
// export function dtsTalentDatailAdd(data) {
// 	return request({
// 		url: '/dtsTalentDatail/add',
// 		method: 'post',
// 		data
// 	})
// }

// 案例列表
export function dtsTalentDatailList(params) {
	return request({
		url: '/dtsTalentDatail/list',
		method: 'get',
		params
	})
}

// 案例添加
export function dtsTalentDatailAddOne(data) {
	return request({
		url: '/dtsTalentDatail/addOne',
		method: 'post',
		data
	})
}

// 案例修改
export function dtsTalentDatailUpdate(data) {
	return request({
		url: '/dtsTalentDatail/update',
		method: 'post',
		data
	})
}

// 案例删除
export function dtsTalentDatailDelete(params) {
	return request({
		url: `/dtsTalentDatail/${params.id}`,
		method: 'delete'
	})
}
