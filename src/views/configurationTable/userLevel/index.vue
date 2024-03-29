<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入查询名称"
			/>
			<el-button
				v-permission="[ 'GET /admin/admin/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/admin/create' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
			<!-- <el-button
				:loading="downloadLoading"
				size="mini"
				class="filter-item"
				type="warning"
				icon="el-icon-download"
				@click="handleDownload"
				>导出</el-button> -->
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" label="编号" prop="id" sortable />

			<!-- <el-table-column
				align="center"
				label="父等级编号"
				prop="fatherId"
				sortable
				/> -->

			<el-table-column align="center" label="用户等级名称" prop="name" />

			<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/admin/update' ]" type="primary" size="mini"
						@click="handleUpdate(scope.row)"
					>
						编辑
					</el-button>
					<!-- <el-button
						v-permission="['POST /admin/admin/delete']"
						type="danger"
						size="mini"
						@click="handleDelete(scope.row)"
						>删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>

				<el-form-item v-if="dialogStatus != 'create'" label="编号" prop="id">
					{{ dataForm.id }}
				</el-form-item>

				<el-form-item label="父等级编号" prop="fatherId">
					<el-input v-model="dataForm.fatherId" />
				</el-form-item>
				<el-form-item label="用户等级名称" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">
					确定
				</el-button>
				<el-button v-else type="primary" @click="updateData">
					确定
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listAdd, listGet, idGet, listedit } from '@/api/configurationTable/userLevel'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
	name: 'Admin',
	components: { Pagination },
	data() {
		return {
			list: null,
			total: 0,
			roleOptions: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				name: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				name: undefined,
				fatherId: 0
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				username: [
					{ required: true, message: '用户等级信息账号不能为空', trigger: 'blur' }
				],
				password: [ { required: true, message: '密码不能为空', trigger: 'blur' } ]
			},
			downloadLoading: false
		}
	},
	computed: {
		headers() {
			return {
				'X-Dts-Admin-Token': getToken()
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listGet(this.listQuery)
				.then((response) => {
					this.list = response.data.items
					this.total = response.data.total
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
		resetForm() {
			this.dataForm = {
				id: undefined,
				name: undefined,
				fatherId: 0
			}
		},
		handleCreate() {
			this.resetForm()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					listAdd(this.dataForm)
						.then((response) => {
							this.getList()
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '添加用户等级信息成功'
							})
						})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},
		handleUpdate(row) {
			idGet({ id: row.id })
				.then((response) => {
					this.resetForm()
					this.dataForm = Object.assign({}, row)
					if (response.data !== '未找到对应信息') {
						this.salesmanDataForm = response.data
					}
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					listedit(this.dataForm)
						.then(() => {
							for (const v of this.list) {
								if (v.id === this.dataForm.id) {
									const index = this.list.indexOf(v)
									this.list.splice(index, 1, this.dataForm)
									break
								}
							}
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '更新用户等级信息成功'
							})
						})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.data.errmsg
							})
						})
				}
			})
		}
		// handleDelete (row) {
		//   listDelete(row)
		//     .then(response => {
		//       this.$notify.success({
		//         title: '成功',
		//         message: '删除用户等级信息成功'
		//       })
		//       const index = this.list.indexOf(row)
		//       this.list.splice(index, 1)
		//     })
		//     .catch(response => {
		//       this.$notify.error({
		//         title: '失败',
		//         message: response.data.errmsg
		//       })
		//     })
		// }
		// handleDownload () {
		//   this.downloadLoading = true
		//   import('@/vendor/Export2Excel').then(excel => {
		//     const tHeader = ['用户等级信息ID', '用户等级信息名称', '用户等级信息头像']
		//     const filterVal = ['id', 'username', 'avatar']
		//     excel.export_json_to_excel2(
		//       tHeader,
		//       this.list,
		//       filterVal,
		//       '用户等级信息信息'
		//     )
		//     this.downloadLoading = false
		//   })
		// }
	}
}
</script>
