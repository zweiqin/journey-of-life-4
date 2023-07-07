import request from '@/utils/request'
// http://pc-20230204bcta:8080/demo/ws/queryCustomer

export const api = {
	// queryCustomer: '/ws/queryCustomer', // 查客服列表
	// createChat: '/ws/createChat', // 创建聊天
	queryChatList: '/ws/queryChatList', // 聊天列表
	queryChatMessage: '/ws/queryChatMessage' // 查消息
}

// 创建房间：https://xxx/admin/ws/createChat?userType=APP&userId=5&chatName=牛牛牛&chatId=&friendId=8&friendUserType=ADMIN

// 聊天列表
export function queryChatList(query) {
	return request({
		url: '/ws/queryChatList',
		method: 'GET',
		params: query
	})
}

// 查消息
export function queryChatMessage(query) {
	return request({
		url: '/ws/queryChatMessage',
		method: 'GET',
		params: query
	})
}

// export function queryChatMessage(data) {
// 	return request({
// 		url: '/ws/queryChatMessage',
// 		method: 'POST',
// 		data
// 	})
// }
