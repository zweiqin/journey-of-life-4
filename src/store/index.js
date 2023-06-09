import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'
import chat from './modules/chat'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		app,
		permission,
		tagsView,
		user,
		chat
	},
	getters
})

export default store
