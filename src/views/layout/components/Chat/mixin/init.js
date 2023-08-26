import { queryChatList, queryChatMessage, addChatMessage } from '@/api/laboratory/chat_module/chat'
export default {
	methods: {
		async init(socket) {
			const personId = this.$store.getters.userId // personId
			const avatar = this.common.seamingImgUrl(this.$store.getters.avatar)
			const name = this.$store.getters.name
			const res = await queryChatList({
				userId: personId
			})
			const { IMUI } = this.$refs
			this.messageInitEvent({
				event: 'init',
				friend_group: [],
				// user_contact: [],
				user_contact: res.data && res.data.length ? res.data.map((item) => ({
					id: item.toUserId, // user_group里面的toContactId用的是双等号（==）匹配，而不是全等，所以会有18=="18"
					is_group: 0,
					displayName: item.toUsername,
					avatar: this.common.seamingImgUrl(item.toAvatarImage),
					index: '用户',
					friend_group: 0,
					unread: 0,
					status: 0, // 离线或在线
					lastContent: item.msgType === 'image' ? this.common.seamingImgUrl(item.contentText) : item.contentText,
					lastContentType: item.msgType,
					lastSendTime: Date.parse(item.sendTime)
				})) : [],
				user_group: [],
				// user_group: res.data.items.map((item) => ({
				//   id: item.chatId, // user_group里面的toContactId用的是双等号（==）匹配，而不是全等，所以会有18=="18"
				//   is_group: 1,
				//   displayName: item.name,
				//   avatar: '',
				//   introduction: '',
				//   validation: 0,
				//   size: 200,
				//   uid: personId,
				//   index: '[0]聊天室',
				//   unread: 0,
				//   member_total: '',
				//   level: 0,
				//   lastContent: '欢迎回来',
				//   lastContentType: 'event',
				//   lastSendTime: 0,
				//   group_member: []
				// })),
				user_info: {
					avatar,
					id: personId,
					displayName: name
				}
			}, IMUI)
			this.initSocketInfo()
		},
		initSocketInfo() {
			this.socketInfo = new WebSocket(`${this.path}/${this.user.id}`)
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
			const { IMUI } = this.$refs
			// const dataAll = JSON.parse(msg.data)
			// console.log(dataAll) // { "chatId": 15, "sendUserId": 5, "userType": "APP", "message": "{\"event\":\"1234\",\"message\":{\"id\":1677132694342,\"status\":\"succeed\",\"type\":\"text\",\"sendTime\":1677132694342,\"content\":\"公司把这个不hj\",\"toContactId\":15,\"fromUser\":{\"id\":5,\"displayName\":\"哈哈哈\",\"avatar\":\"https://www.tuanfengkeji.cn/tfshop/static/img/logo.024b746.png\"}}}" }
			let data = JSON.parse(msg.data) // dataAll.message
			console.log(data) // { "event": "1234", "message": { "id": 1677132694342, "status": "succeed", "type": "text", "sendTime": 1677132694342, "content": "公司把这个不hj", "toContactId": 15, "fromUser": { "id": 5, "displayName": "哈哈哈", "avatar": "https://www.tuanfengkeji.cn/tfshop/static/img/logo.024b746.png" } } }
			if (data.status == 10400) {
				this.$message({ message: '网络不给力，请检查网络连接', type: 'error' })
			} else if (data.status == 13140) {
				data = {
					event: '',
					message: {
						id: data.data.sendTime,
						status: 'succeed',
						type: data.data.msgType,
						sendTime: data.data.sendTime,
						content: data.data.msgType === 'image' ? this.common.seamingImgUrl(data.data.contentText) : data.data.contentText,
						toContactId: Number(data.data.fromUserId),
						fileSize: 0,
						fileName: '',
						fromUser: {
							id: Number(data.data.fromUserId),
							displayName: data.data.fromUserName,
							avatar: this.common.seamingImgUrl(data.data.fromAvatarImage)
						},
						isGroup: false
					}
				}
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
			}
		},
		closeInfo() {
			console.log('socketInfo连接关闭, 正在重连...')
			setTimeout(() => {
				this.initSocketInfo()
			}, 2000)
		},

		initSocket(contact, isReconnection = false) {
			this.open(contact)()
			// console.log(contact) // contact.id为接口返回给组件后再返回的数值类型
			// if (this.socket) {
			//   if (Object.keys(this.socket).length) {
			//     if (Object.keys(this.socket).includes(String(contact.id))) {
			//       this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.user.id}?chat=${contact.id}`)
			//     } else {
			//       this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.user.id}?chat=${contact.id}`)
			//     }
			//   } else {
			//     this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.user.id}?chat=${contact.id}`)
			//   }
			// } else {
			//   this.socket = {}
			//   this.socket[contact.id] = new WebSocket(`${this.path}/ADMIN/${this.user.id}?chat=${contact.id}`)
			// }
			// // 监听socket连接
			// this.socket[contact.id].onopen = this.open(contact)
			// // 监听socket错误信息
			// this.socket[contact.id].onerror = this.error
			// // 监听socket消息
			// this.socket[contact.id].onmessage = this.onmessage
			// // 监听socket 关闭
			// this.socket[contact.id].onclose = this.close(contact)
		},
		open(contact) {
			return async () => {
				const res = await queryChatMessage({
					foUserId: this.user.id,
					toUserId: contact.id
					// chatId: contact.id,
					// limit: 30,
					// endTime: '', // 查这个时间之后的
					// order: 'desc', // 无则从头开始查，有则从最新开始查
				})
				console.log(res)
				// const tempDate = Date.parse(new Date())
				const tempDate = Date.now()
				this.messages = {
					group_history_message: [
						...res.data.map((item) => ({
							id: Date.parse(item.sendTime),
							status: 'succeed',
							type: item.msgType,
							sendTime: Date.parse(item.sendTime),
							content: item.msgType === 'image' ? this.common.seamingImgUrl(item.contentText) : item.contentText,
							toContactId: item.toUserId,
							fileSize: 0,
							fileName: '',
							isGroup: false,
							fromUser: {
								id: item.fromUserId,
								displayName: item.fromUserName,
								avatar: this.common.seamingImgUrl(item.fromAvatarImage)
							}
						}))
						// ...res.data.items.map((item) => JSON.parse(item.message).message).reverse(),
						// {
						//   id: tempDate, // 每一条消息的id
						//   status: 'succeed',
						//   type: 'event',
						//   sendTime: tempDate,
						//   content: '欢迎回来~',
						//   toContactId: contact.id,
						//   fileSize: 0,
						//   fileName: '',
						//   isGroup: true,
						//   fromUser: {
						//     id: '',
						//     avatar: '',
						//     displayName: ''
						//   }
						// }
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
					this.initSocket(contact, true)
				}, 2000)
			}
		},
		// send(message, uri, method = 'GET') {
		async send(message, event, contactObj = null) {
			// const data = {
			//   message,
			//   event
			// }
			// const { IMUI } = this.$refs
			// if (contactObj) {
			//   this.socket[contactObj.id] ? this.socket[contactObj.id].send(JSON.stringify(data)) : this.$message({ message: `发送到 ${contactObj.displayName}（id：${contactObj.id}）失败`, type: 'error' })
			// } else {
			//   this.socket[IMUI.getCurrentContact().id].send(JSON.stringify(data))
			// }
			const data = {
				contentText: message.type === 'image' ? this.common.shearingImgUrl(message.content) : message.content,
				fromAvatarImage: this.common.shearingImgUrl(message.fromUser.avatar),
				fromUserName: message.fromUser.displayName,
				fromUserId: message.fromUser.id,
				sendTime: message.sendTime,
				toUserId: message.toContactId,
				toUsername: '',
				toAvatarImage: '',
				msgType: message.type,
				exp: ''
			}
			await addChatMessage(data)
			this.socketInfo.send({
				status: 13140,
				message: '发送消息',
				data
			})
		}
	}
}
