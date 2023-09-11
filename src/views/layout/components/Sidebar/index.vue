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
			let routers
			if (this.roles.includes('超级管理员')) {
				routers = XeUtils.mapTree(this.permission_routers, (item) => {
					if (item._ROLES) {
						if (item._ROLES.includes('ADMIN')) {
							item.hidden = false
						} else {
							item.hidden = true
						}
					}
					return item
				})
			} else if (this.roles.includes('初级营销策划师')) {
				routers = XeUtils.mapTree(this.permission_routers, (item) => {
					if (item._ROLES) {
						if (item._ROLES.includes('PLANNER')) {
							item.hidden = false
						} else {
							item.hidden = true
						}
					}
					return item
				})
			} else if (this.roles.includes('会员商户')) {
				routers = XeUtils.mapTree(this.permission_routers, (item) => {
					if (item._ROLES) {
						if (item._ROLES.includes('USER')) {
							item.hidden = false
						} else {
							item.hidden = true
						}
					}
					return item
				})
			} else if (this.roles.includes('分公司管理员')) {
				routers = XeUtils.mapTree(this.permission_routers, (item) => {
					if (item._ROLES) {
						if (item._ROLES.includes('BRANCH')) {
							item.hidden = false
						} else {
							item.hidden = true
						}
					}
					return item
				})
			}
			return routers
		}
	}
}
</script>
