import { queryChatList, queryChatMessage } from '@/api/laboratory/chat_module/chat'
export default {
	methods: {

		async init(socket) {
			// // 实例化socket
			// this.socket = socket
			// // 监听socket连接
			// this.socket.onopen = this.open
			// // 监听socket错误信息
			// this.socket.onerror = this.error
			// // 监听socket消息
			// this.socket.onmessage = this.onmessage
			// // 监听socket 关闭
			// this.socket.onclose = this.close

			const personId = this.$store.getters.personId
			const avatar = this.$store.getters.avatar
			const name = this.$store.getters.name
			const res = await queryChatList({
				page: 1,
				limit: 9999,
				userType: 'ADMIN',
				userId: personId
			})
			// console.log(res.data.items)
			const { IMUI } = this.$refs
			this.messageInitEvent({
				event: 'init',
				friend_group: [],
				user_contact: [],
				user_group: res.data.items.map((item) => ({
					id: item.chatId, // user_group里面的toContactId用的是双等号（==）匹配，而不是全等，所以会有18=="18"
					is_group: 1,
					displayName: item.name,
					avatar: '',
					introduction: '',
					validation: 0,
					size: 200,
					uid: personId,
					index: '[0]聊天室',
					unread: 0,
					member_total: '',
					level: 0,
					lastContent: '欢迎回来',
					lastContentType: 'event',
					lastSendTime: 0,
					group_member: []
				})),
				user_info: {
					avatar,
					id: personId,
					displayName: name
				}
			}, IMUI)
			this.initSocketInfo()
		},
		initSocketInfo() {
			this.socketInfo = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}`)
			// 监听socket连接
			this.socketInfo.onopen = this.openInfo
			// 监听socket错误信息
			this.socketInfo.onerror = this.errorInfo
			// 监听socket消息
			this.socketInfo.onmessage = this.onmessageInfo
			// 监听socket 关闭
			this.socketInfo.onclose = this.closeInfo
		},
		openInfo() {
			// console.log('socketInfo连接成功')
		},
		errorInfo() {
			console.log('socketInfo连接错误')
		},
		onmessageInfo(msg) {
			// console.log(msg.data) // {"chatId":15,"sendUserId":5,"userType":"APP","message":"{\"event\":\"1234\",\"message\":{\"id\":1677132694342,\"status\":\"succeed\",\"type\":\"text\",\"sendTime\":1677132694342,\"content\":\"公司把这个不hj\",\"toContactId\":15,\"fromUser\":{\"id\":5,\"displayName\":\"哈哈哈\",\"avatar\":\"https://www.tuanfengkeji.cn/tfshop/static/img/logo.024b746.png\"}}}"}
			const { IMUI } = this.$refs
			const dataAll = JSON.parse(msg.data)
			// console.log(dataAll) // { "chatId": 15, "sendUserId": 5, "userType": "APP", "message": "{\"event\":\"1234\",\"message\":{\"id\":1677132694342,\"status\":\"succeed\",\"type\":\"text\",\"sendTime\":1677132694342,\"content\":\"公司把这个不hj\",\"toContactId\":15,\"fromUser\":{\"id\":5,\"displayName\":\"哈哈哈\",\"avatar\":\"https://www.tuanfengkeji.cn/tfshop/static/img/logo.024b746.png\"}}}" }
			const data = JSON.parse(dataAll.message)
			console.log(data) // { "event": "1234", "message": { "id": 1677132694342, "status": "succeed", "type": "text", "sendTime": 1677132694342, "content": "公司把这个不hj", "toContactId": 15, "fromUser": { "id": 5, "displayName": "哈哈哈", "avatar": "https://www.tuanfengkeji.cn/tfshop/static/img/logo.024b746.png" } } }
			switch (data.event) {
				// case 'init':
				//   this.messageInitEvent(data, IMUI)
				//   break
				// case 'friend_history_message':
				//   this.messageFriendHistoryEvent(data, IMUI)
				//   break
				// case 'group_history_message':
				//   this.messageGroupHistoryEvent(data, IMUI)
				//   break
				// case 'friend_withdraw_message':
				//   this.friendWithdrawMessageEvent(data, IMUI)
				//   break
				// case 'friend_online_message':
				//   this.friendOnlineMessageEvent(data, IMUI)
				//   break
				// case 'friend_offline_message':
				//   this.friendOfflineMessageEvent(data, IMUI)
				//   break
				// case 'group_withdraw_message':
				//   this.groupWithdrawMessageEvent(data, IMUI)
				//   break
				// case 'create_group':
				//   this.createGroupEvent(data, IMUI)
				//   break
				// case 'edit_group':
				//   this.editGroupEvent(data, IMUI)
				//   break
				// case 'new_member_join_group':
				//   this.newMemberJoinGroupEvent(data, IMUI)
				//   break
				// case 'group_member_exit':
				//   this.groupMemberExitEvent(data, IMUI)
				//   break
				// case 'delete_group_member':
				//   this.deleteGroupMemberEvent(data, IMUI)
				//   break
				// case 'change_group_member_level':
				//   this.changeGroupMemberLevel(data, IMUI)
				//   break
				// case 'delete_group':
				//   this.deleteGroup(data, IMUI)
				//   break
				// case 'change_group_avatar':
				//   this.changeGroupAvatar(data, IMUI)
				//   break
				// case 'new_friend_join_message':
				//   this.newFriendJoinMessage(data, IMUI)
				//   break
				// case 'friend_delete_message':
				//   this.friendDeleteMessage(data, IMUI)
				//   break
				// default:
				//   this.getSendMessage(data, IMUI)
				//   break
				case 'oneByoneSend':
					this.oneByoneSend(data, IMUI)
					break
				default:
					this.getSendMessage(data, IMUI)
					break
			}
		},
		closeInfo() {
			console.log('socketInfo连接关闭, 正在重连...')
			setTimeout(() => {
				// this.socket = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}?chat=${contact.id}`)
				this.initSocketInfo()
			}, 2000)
		},

		initSocket(contact, isReconnection = false) {
			// console.log(contact) // contact.id为接口返回给组件后再返回的数值类型
			// if (!isReconnection) this.socket = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}?chat=${contact.id}`)
			if (this.socket) {
				if (Object.keys(this.socket).length) {
					if (Object.keys(this.socket).includes(String(contact.id))) {
						this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}?chat=${contact.id}`)
					} else {
						this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}?chat=${contact.id}`)
					}
				} else {
					this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}?chat=${contact.id}`)
				}
			} else {
				this.socket = {}
				this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}?chat=${contact.id}`)
			}
			// 监听socket连接
			this.socket[contact.id].onopen = this.open(contact)
			// 监听socket错误信息
			this.socket[contact.id].onerror = this.error
			// 监听socket消息
			this.socket[contact.id].onmessage = this.onmessage
			// 监听socket 关闭
			this.socket[contact.id].onclose = this.close(contact)
		},
		open(contact) {
			return async () => {
				const res = await queryChatMessage({
					chatId: contact.id,
					limit: 30,
					endTime: '', // 查这个时间之后的
					order: 'desc' // 无则从头开始查，有则从最新开始查
				})
				console.log(res)
				// const tempDate = Date.parse(new Date())
				const tempDate = Date.now()
				this.messages = {
					group_history_message: [
						...res.data.items.map((item) => JSON.parse(item.message).message).reverse(),
						{
							id: tempDate, // 每一条消息的id
							status: 'succeed',
							type: 'event',
							sendTime: tempDate,
							content: '欢迎回来~',
							toContactId: contact.id,
							fileSize: 0,
							fileName: '',
							isGroup: true,
							fromUser: {
								id: '',
								avatar: '',
								displayName: ''
							}
						}
					],
					event: 'group_history_message'
				}
				this.next(this.messages.group_history_message, true)
			}
		},
		error() {
			console.log('连接错误')
		},
		onmessage(msg) {
			console.log('onmessage：', msg.data)
		},
		close(contact) {
			return async () => {
				console.log('连接关闭, 正在重连...')
				setTimeout(() => {
					// this.socket = new WebSocket(`${this.path}/ADMIN/${this.$store.getters.personId}?chat=${contact.id}`)
					this.initSocket(contact, true)
				}, 2000)
			}
		},
		// send(message, uri, method = 'GET') {
		send(message, event, contactObj = null) {
			const data = {
				message,
				event
				// uri,
				// method
			}
			const { IMUI } = this.$refs
			if (contactObj) {
				this.socket[contactObj.id] ? this.socket[contactObj.id].send(JSON.stringify(data)) : this.$message({ message: `发送到 ${contactObj.displayName}（id：${contactObj.id}）失败`, type: 'error' })
			} else {
				this.socket[IMUI.getCurrentContact().id].send(JSON.stringify(data))
			}
		}
	}
}
