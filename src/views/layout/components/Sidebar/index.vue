<template>
	<el-scrollbar wrap-class="scrollbar-wrapper">
		<el-menu
			:show-timeout="200"
			:default-active="$route.path"
			:collapse="isCollapse"
			mode="vertical"
			background-color="#304156"
			text-color="#bfcbd9"
			active-text-color="#409EFF"
		>
			<SidebarItem v-for="route in menuList" :key="route.path" :item="route" :base-path="route.path" />
		</el-menu>
	</el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import XeUtils from 'xe-utils'

export default {
	components: { SidebarItem },
	computed: {
		...mapGetters([
			'permission_routers',
			'sidebar',
			'roles'
		]),
		isCollapse() {
			return !this.sidebar.opened
		},
		menuList() {
			const isAdmin = this.roles.includes('超级管理员')
			const routers = XeUtils.mapTree(this.permission_routers, (item) => {
				if (item._ROLES) {
					if (item._ROLES.includes('USER')) {
						item.hidden = isAdmin
					}
					if (item._ROLES.includes('ADMIN')) {
						item.hidden = !isAdmin
					}
				}
				return item
			})
			return routers
		}
	}
}
</script>
