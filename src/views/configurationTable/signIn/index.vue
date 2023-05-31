<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<!-- <el-input
				v-model="listQuery.name"
				clearable
				size="mini"
				class="filter-item"
				style="width: 200px;"
				placeholder="请输入查询名称"
				/>
				<el-button
				size="mini"
				class="filter-item"
				type="primary"
				icon="el-icon-search"
				@click="handleFilter"
				>查找</el-button> -->
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
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

			<el-table-column align="center" label="连续签到天数" prop="days" />

			<el-table-column align="center" label="奖励的数量" prop="number" />

			<el-table-column align="center" label="奖励的id" prop="awardId" />

			<el-table-column align="center" label="操作人名称" prop="operatorName" />

			<el-table-column align="center" label="操作人id" prop="operatorId" />

			<el-table-column align="center" label="奖励类型" prop="type">
				<template slot-scope="scope">
					{{ typeArr.filter(item => item.id == scope.row.type)[0]
						? typeArr.filter(item => item.id == scope.row.type)[0].name : '' }}
				</template>
			</el-table-column>

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
				label-position="left" label-width="120px"
				style="width: 400px; margin-left:50px;"
			>

				<el-form-item label="连续签到天数" prop="days">
					<el-input v-model="dataForm.days" />
				</el-form-item>

				<el-form-item label="奖励数量" prop="number">
					<el-input v-model="dataForm.number" />
				</el-form-item>

				<el-form-item label="奖励类型" prop="type">
					<el-select v-model="dataForm.type" filterable placeholder="请选择奖励类型">
						<el-option v-for="item in typeArr" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
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
import { listAdd, listDelete, listGet, listedit } from '@/api/configurationTable/signIn'
import Pagination from '@/components/Pagination'

export default {
	name: 'Admin',
	components: { Pagination },
	data() {
		return {
			typeArr: [
				{ id: 1, name: '代金券' },
				{ id: 2, name: '积分' }
			],
			list: null,
			total: 0,
			roleOptions: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				days: undefined,
				number: undefined,
				type: undefined
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				days: [ { required: true, message: '连续签到天数不能为空', trigger: 'blur' } ],
				number: [ { required: true, message: '奖励数量不能为空', trigger: 'blur' } ],
				type: [ { required: true, message: '奖励类型不能为空', trigger: 'blur' } ]
			},
			downloadLoading: false
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
		// handleFilter () {
		//   this.listQuery.page = 1
		//   this.getList()
		// },
		resetForm() {
			this.dataForm = {
				id: undefined,
				days: undefined,
				number: undefined,
				type: undefined
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
								message: '添加每日签到信息成功'
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
								message: '更新每日签到信息成功'
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
		handleDelete(row) {
			listDelete(row)
				.then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除每日签到信息成功'
					})
					const index = this.list.indexOf(row)
					this.list.splice(index, 1)
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
