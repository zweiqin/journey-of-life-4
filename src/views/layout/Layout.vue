<template>
	<div :class="classObj" class="app-wrapper">
		<div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
		<Sidebar class="sidebar-container" />
		<div class="main-container">
			<Navbar />
			<TagsView />
			<AppMain />
			<div class="chat">
				<el-badge is-dot class="item">
					<el-button
						icon="el-icon-chat-dot-square"
						type="primary"
						size="medium"
						@click="chatDialogData.dialogVisible = true"
					>
						我的聊天
					</el-button>
				</el-badge>
			</div>
		</div>
		<Chat ref="chat" :chat-dialog-data="chatDialogData"></Chat>
	</div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, Chat } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
	name: 'Layout',
	components: {
		Navbar,
		Sidebar,
		AppMain,
		TagsView,
		Chat
	},
	mixins: [ ResizeMixin ],
	data() {
		return {
			chatDialogData: {
				dialogVisible: true
			},
			// path: process.env.VUE_APP_WS_API,
			path: process.env.BASE_WS_API,
			socket: ''
		}
	},
	computed: {
		sidebar() {
			return this.$store.state.app.sidebar
		},
		device() {
			return this.$store.state.app.device
		},
		classObj() {
			return {
				// 控制class的出现或隐藏 从cookie中或取状态 1为false 0为true 由于加了!号因此结果再次倒转为1为true 0为false
				hideSidebar: !this.sidebar.opened,
				openSidebar: this.sidebar.opened,
				withoutAnimation: this.sidebar.withoutAnimation,
				mobile: this.device === 'mobile'
			}
		}
	},
	mounted() {
		this.chatDialogData.dialogVisible = false
		if (typeof WebSocket === 'undefined') {
			alert('您的浏览器不支持socket')
		} else {
			// 实例化socket
			// this.socket = new WebSocket(this.path, [ this.$store.getters.token ])
			// this.$refs.chat.init(this.socket)
			// this.$refs.chat.init(this.path)
		}
	},
	methods: {
		handleClickOutside() {
			this.$store.dispatch('closeSideBar', { withoutAnimation: false })
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  // background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.main-container {
  height: 100%;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  // background: #000;
}
.chat {
  position: fixed;
  // right: 30px;
  // bottom: 0px;
  right: 300px;
  top: 0px;
  background-color: #fff;
  cursor: pointer;
  z-index: 10;
	/deep/ .el-badge__content.is-fixed.is-dot {
		top: 6px;
	}
}
</style>
