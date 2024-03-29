import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
	state: {
		user: '',
		status: '',
		code: '',
		name: '',
		avatar: '',
		userId: '',
		personId: '',
		brandId: '',
		introduction: '',
		roles: [],
		perms: [],
		setting: {
			articlePlatform: []
		}
	},

	mutations: {
		SET_CODE: (state, code) => {
			state.code = code
		},
		SET_INTRODUCTION: (state, introduction) => {
			state.introduction = introduction
		},
		SET_SETTING: (state, setting) => {
			state.setting = setting
		},
		SET_STATUS: (state, status) => {
			state.status = status
		},
		SET_NAME: (state, name) => {
			state.name = name
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
		},
		SET_USERID: (state, userId) => {
			state.userId = userId
		},
		SET_PERSONID: (state, personId) => {
			state.personId = personId
		},
		SET_BRANDID: (state, brandId) => {
			state.brandId = brandId || ''
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
		},
		SET_PERMS: (state, perms) => {
			state.perms = perms
		}
	},

	actions: {
		// 用户名登录
		LoginByUsername({ commit }, userInfo) {
			const username = userInfo.username.trim()
			const password = userInfo.password
			const code = userInfo.code
			const uuid = userInfo.uuid
			return new Promise((resolve, reject) => {
				loginByUsername(username, password, code, uuid).then((response) => {
					const token = response.data
					setToken(token)
					resolve()
				})
					.catch((error) => {
						reject(error)
					})
			})
		},

		// 获取用户信息
		GetUserInfo({ commit, state }) {
			return new Promise((resolve, reject) => {
				getUserInfo(getToken()).then((response) => {
				// const response = { data: { data: {
				// 	'roles': [
				// 		'超级管理员'
				// 	],
				// 	'name': 'xxx',
				// 	'perms': [
				// 		'*'
				// 	],
				// 	'avatar': 'xxx/28frxec24ilpqbgq4fgy.png',
				// 	'userId': null
				// } } }
					const data = response.data
					if (data.perms && data.perms.length > 0) { // 验证返回的perms是否是一个非空数组
						commit('SET_PERMS', data.perms)
					} else {
						reject('getInfo: perms must be a non-null array !')
					}
					commit('SET_ROLES', data.roles)
					commit('SET_NAME', data.name)
					commit('SET_AVATAR', data.avatar)
					commit('SET_USERID', data.userId)
					commit('SET_PERSONID', data.id)
					commit('SET_BRANDID', data.brandId)
					commit('SET_INTRODUCTION', data.introduction)
					resolve(response)
				})
					.catch((error) => {
						reject(error)
					})
			})
		},

		// 第三方验证登录
		// LoginByThirdparty({ commit, state }, code) {
		//   return new Promise((resolve, reject) => {
		//     commit('SET_CODE', code)
		//     loginByThirdparty(state.status, state.email, state.code).then(response => {
		//       setToken(response.data.token)
		//       resolve()
		//     }).catch(error => {
		//       reject(error)
		//     })
		//   })
		// },

		// 登出
		LogOut({ commit, state }) {
			return new Promise((resolve, reject) => {
				logout(state.token).then((res) => {
					// commit('SET_ROLES', [])
					// commit('SET_PERMS', [])
					removeToken()
					resolve()
				})
					.catch((error) => {
						reject(error)
					})
			})
		},

		// 前端 登出
		FedLogOut({ commit }) {
			return new Promise((resolve) => {
				removeToken()
				resolve()
			})
		},

		// 动态修改权限
		ChangeRoles({ commit, dispatch }, token) {
			return new Promise((resolve) => {
				setToken(token)
				getUserInfo(token).then((response) => {
					const data = response.data
					commit('SET_ROLES', data.roles)
					commit('SET_PERMS', data.perms)
					commit('SET_NAME', data.name)
					commit('SET_AVATAR', data.avatar)
					commit('SET_PERSONID', data.personId)
					commit('SET_INTRODUCTION', data.introduction)
					dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
					resolve()
				})
			})
		}
	}
}

export default user
