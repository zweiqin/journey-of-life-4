import request from '@/utils/request'

export const api = {
	// queryCustomer: '/ws/queryCustomer', // 查客服列表
	// createChat: '/ws/createChat', // 创建聊天
	queryChatList: '/ws/queryChatList', // 聊天列表
	queryChatMessage: '/ws/queryChatMessage', // 查消息
	addChatMessage: '/messageList/addMessage' // 新增聊天对象
}

// 创建房间：https://www.tuanfengkeji.cn:8098/dts-admin-api/admin/ws/createChat?userType=APP&userId=5&chatName=牛牛牛&chatId=&friendId=8&friendUserType=ADMIN

// 聊天列表
export function queryChatList(query) {
	return request({
		url: '/messageList/getMessageList',
		method: 'GET',
		params: query
	})
}

// 查消息
export function queryChatMessage(query) {
	return request({
		url: '/messageList/getMessageDetailsList',
		method: 'GET',
		params: query
	})
}

// 新增聊天对象
export function addChatMessage(data) {
	return request({
		url: '/messageList/addMessage',
		method: 'POST',
		data
	})
}
