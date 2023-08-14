<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.brandId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店ID"
			/>
			<el-button
				:disabled="isAdmin" size="mini" class="filter-item" type="primary"
				icon="el-icon-search"
				@click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-show="!isAdmin" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit"
				@click="handleCreate"
			>
				添加
			</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" label="编号" prop="id" sortable />

			<el-table-column align="center" label="门店id" prop="brandId" />

			<el-table-column align="center" label="等级层级" prop="levelTier" sortable />

			<el-table-column align="center" label="等级名称" prop="name" />

			<el-table-column align="center" label="等级折扣" prop="discount" />

			<el-table-column align="center" label="等级描述" prop="description" />

			<el-table-column align="center" label="等级所需充值总额" prop="gradeCriterion" />

			<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
						编辑
					</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">
						删除
					</el-button>
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
				label-position="left" label-width="140px"
				style="width: 400px; margin-left:50px;"
			>

				<el-form-item v-if="dialogStatus != 'create'" label="编号" prop="id">
					{{ dataForm.id }}
				</el-form-item>

				<el-form-item v-if="dialogStatus != 'create'" label="门店id" prop="brandId">
					{{ dataForm.brandId }}
				</el-form-item>

				<el-form-item v-if="dialogStatus != 'create'" label="等级层级" prop="levelTier">
					{{ dataForm.levelTier }}
				</el-form-item>

				<el-form-item label="等级名称" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>

				<el-form-item label="等级折扣" prop="discount">
					<el-input v-model="dataForm.discount" />
				</el-form-item>

				<el-form-item label="等级描述" prop="description">
					<el-input v-model="dataForm.description" />
				</el-form-item>

				<el-form-item label="等级所需充值总额" prop="gradeCriterion">
					<el-input v-model="dataForm.gradeCriterion" />
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
import { listAdd, listDelete, listGet, listEdit } from '@/api/brandManagement/storeLevel'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/login'
import Pagination from '@/components/Pagination'

export default {
	name: 'StoreLevel',
	components: { Pagination },
	data() {
		return {
			list: null,
			isAdmin: false,
			total: 0,
			listLoading: false,
			listQuery: {
				brandId: undefined,
				page: 1,
				limit: 20,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				brandId: undefined,
				levelTier: undefined,
				name: undefined,
				discount: undefined,
				description: undefined,
				gradeCriterion: undefined
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				name: [ { required: true, message: '等级名称不能为空', trigger: 'blur' } ],
				discount: [ { required: true, message: '等级折扣不能为空', trigger: 'blur' } ],
				description: [ { required: true, message: '等级描述不能为空', trigger: 'blur' } ],
				gradeCriterion: [ { required: true, message: '等级所需充值金额不能为空', trigger: 'blur' } ]
			},
			downloadLoading: false
		}
	},
	created() {
		this.getRoles()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					this.isAdmin = response.data.roles[0] === '超级管理员'
					if (!this.isAdmin) {
						this.getList()
					}
				})
				.catch()
		},
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
				brandId: undefined,
				levelTier: undefined,
				name: undefined,
				discount: undefined,
				description: undefined,
				gradeCriterion: undefined
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
						.then(() => {
							this.getList()
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '添加门店等级信息成功'
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
			this.dataForm = Object.assign({}, row)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					listEdit(this.dataForm)
						.then(() => {
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '更新门店等级信息成功'
							})
							this.getList()
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
		handleDelete(row) {
			listDelete(row)
				.then(() => {
					this.$notify.success({
						title: '成功',
						message: '删除门店等级信息成功'
					})
					this.getList()
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		}
	}
}
</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #20a0ff;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 120px;
	height: 120px;
	line-height: 120px;
	text-align: center;
}

.avatar {
	width: 145px;
	height: 145px;
	display: block;
}
</style>
