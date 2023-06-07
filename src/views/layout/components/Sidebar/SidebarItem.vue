<template>
	<div
		v-if="!item.hidden && item.children"
		class="menu-wrapper"
	>

		<template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
			<AppLink :to="resolvePath(onlyOneChild.path)">
				<el-menu-item
					:index="resolvePath(onlyOneChild.path)"
					:class="{ 'submenu-title-noDropdown': !isNest }"
				>
					<Item
						v-if="onlyOneChild.meta"
						:icon="onlyOneChild.meta.icon || item.meta.icon"
						:title="generateTitle(onlyOneChild.meta.title)"
					/>
				</el-menu-item>
			</AppLink>
		</template>

		<el-submenu
			v-else
			ref="submenu"
			:index="resolvePath(item.path)"
		>
			<template #title>
				<Item
					v-if="item.meta"
					:icon="item.meta.icon"
					:title="generateTitle(item.meta.title)"
				/>
			</template>
			<!-- 以前在template里多了一行：v-if="!child.hidden" -->
			<!-- 循环判断是否展示 -->
			<template v-for="child in item.children">
				<template v-if="!child.hidden">
					<sidebar-item
						v-if="child.children && child.children.length > 0"
						:key="child.path"
						:is-nest="true"
						:item="child"
						:base-path="resolvePath(child.path)"
						class="nest-menu"
					/>

					<AppLink
						v-else
						:key="child.name"
						:to="resolvePath(child.path)"
					>
						<el-menu-item :index="resolvePath(child.path)">
							<Item
								v-if="child.meta"
								:icon="child.meta.icon"
								:title="generateTitle(child.meta.title)"
							/>
						</el-menu-item>
					</AppLink>
				</template>
			</template>
		</el-submenu>

	</div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
	name: 'SidebarItem',
	components: { Item, AppLink },
	mixins: [ FixiOSBug ],
	props: {
		// route object
		item: {
			type: Object,
			required: true
		},
		isNest: {
			type: Boolean,
			default: false
		},
		basePath: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			onlyOneChild: null
		}
	},
	methods: {
		hasOneShowingChild(children, parent) {
			const showingChildren = children.filter((item) => {
				if (item.hidden) {
					return false
				}
				// Temp set(will be used if only has one showing child)
				this.onlyOneChild = item
				return true
			})

			// When there is only one child router, the child router is displayed by default
			if (showingChildren.length === 1) {
				return true
			}

			// Show parent if there are no child router to display
			if (showingChildren.length === 0) {
				this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
				return true
			}

			return false
		},
		resolvePath(routePath) {
			if (this.isExternalLink(routePath)) {
				return routePath
			}
			return path.resolve(this.basePath, routePath)
		},
		isExternalLink(routePath) {
			return isExternal(routePath)
		},
		generateTitle
	}
}
</script>
