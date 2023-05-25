<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.rolename" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入角色名称"
			/>
			<el-button
				v-permission="[ 'GET /admin/role/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<!-- <el-button
				v-permission="[ 'POST /admin/role/create' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
				>
				添加
				</el-button> -->
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>
			<el-table-column align="center" label="角色名称" prop="name" sortable />

			<el-table-column align="center" label="说明" prop="desc" />

			<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin//rolePermission/h5RoleEmpower' ]" type="warning" size="mini"
						@click="handleIconPermission(scope.row)"
					>
						图标授权
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 权限配置对话框 -->
		<el-dialog :visible.sync="iconPermissionDialogFormVisible" title="权限配置">
			<el-tree
				ref="tree" :data="iconPermissions" :default-checked-keys="assignedIconPermissions" show-checkbox
				node-key="id" highlight-current default-expand-all
			>
				<span slot-scope="{ node, data }" class="custom-tree-node">
					<el-tag v-if="data.id" type="success" size="mini">ID：{{ data.id }}</el-tag>
					<span>{{ data.iconName }}</span>
				</span>
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click="iconPermissionDialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="updateIconPermission">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listRole } from '@/api/business/role'
import { selectH5RoleEmpower, permissionH5RoleEmpower } from '@/api/iconManagement/iconAuthorization'
import Pagination from '@/components/Pagination'
export default {
	name: 'IconAuthorization',
	components: { Pagination },
	data() {
		return {
			list: null,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				rolename: ''
			},
			iconPermissionDialogFormVisible: false,
			iconPermissions: null,
			assignedIconPermissions: null,
			iconPermissionForm: {
				roleId: undefined,
				permissions: []
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listRole(this.listQuery)
				.then((response) => {
					this.list = response.data.data.items
					this.total = response.data.data.total
					this.listLoading = false
				})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		handleIconPermission(row) {
			this.iconPermissionDialogFormVisible = true
			this.iconPermissionForm.roleId = row.id
			selectH5RoleEmpower({ roleId: row.id })
				.then((response) => {
					const iconPermissionsArr = []
					response.data.data.permissions.forEach((item) => {
						if (!iconPermissionsArr[item.type]) {
							iconPermissionsArr[item.type] = {
								iconName: item.type,
								children: [ { ...item } ]
							}
						} else {
							iconPermissionsArr[item.type].children.push(item)
						}
					})
					this.iconPermissions = iconPermissionsArr
					this.assignedIconPermissions = response.data.data.rolePermissions.map((item) => item.iconId)
				})
		},
		updateIconPermission() {
			this.iconPermissionForm.permissions = this.$refs.tree.getCheckedKeys(true)
			permissionH5RoleEmpower(this.iconPermissionForm)
				.then((response) => {
					this.iconPermissionDialogFormVisible = false
					this.$notify.success({
						title: '成功',
						message: '授权成功'
					})
				})
				.catch((response) => {
					this.$notify.error({
						title: '授权失败',
						message: response.data.errmsg
					})
				})
		}
	}
}
</script>
