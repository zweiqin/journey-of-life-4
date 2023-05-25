<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-button
				v-permission="[ 'GET /admin/dtsPackageMember/memberList' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="listQuery.page = 1 && getList()"
			>
				查找
			</el-button>
			<el-button
				:loading="downloadLoading" size="mini" class="filter-item" type="warning"
				icon="el-icon-download"
				@click="handleDownload"
			>
				导出
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/dtsPackageMember/update' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%" highlight-current-row
			>
				<el-table-column align="center" min-width="100px" label="会员套餐ID" prop="id" />
				<el-table-column align="center" min-width="100px" label="标题" prop="title" />
				<el-table-column align="center" min-width="100px" label="金额" prop="amount" />
				<el-table-column align="center" min-width="100px" property="avatar" label="会员套餐图标">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="创建时间" prop="createTime" />
				<el-table-column align="center" label="操作" min-width="270px" fixed="right" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'POST /admin/dtsPackageMember/update' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/dtsPackageMember/update' ]" type="danger" size="mini"
							@click="handleDelete(scope.row)"
						>
							删除
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/dtsPackageService/list' ]" type="success" size="mini"
							@click="handleOpenService(scope.row)"
						>
							服务套餐
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
			@pagination="getList"
		/>

		<!-- 新增修改会员套餐对话框 -->
		<el-dialog :title="{ update: '编辑会员套餐', create: '创建会员套餐' }[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="right" label-width="120px"
				style="width: 100%; padding:0 35px;"
			>
				<el-form-item label="会员套餐标题" prop="title">
					<el-input v-model="dataForm.title" placeholder="请输入套餐标题" />
				</el-form-item>
				<el-form-item label="金额" prop="amount">
					<el-input v-model="dataForm.amount" placeholder="请输入金额" />
				</el-form-item>
				<el-form-item label="角色" prop="roleIds">
					<el-select v-model="dataForm.roleIds" clearable filterable placeholder="请选择角色">
						<el-option v-for="item in roleList" :key="item.id" :label="`${item.name}`" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="会员套餐图标">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="(response) => dataForm.iconUrl = response.data.url"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.iconUrl" :src="common.seamingImgUrl(dataForm.iconUrl)" width="145">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
				<el-button v-if="dialogStatus == 'update'" type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>

		<!-- 查看服务套餐信息 -->
		<el-dialog title="服务套餐" :visible.sync="dialogFormVisibleService" width="800px">
			<div>
				<el-button
					size="mini" class="filter-item" type="primary"
					icon="el-icon-edit" @click="handleCreateServe"
				>
					新增
				</el-button>
				<div style="height: 60vh;">
					<el-table
						:data="dataFormService.serviceList" size="small" border fit
						height="100%" highlight-current-row
					>
						<el-table-column align="center" min-width="100px" label="服务ID" prop="id" />
						<el-table-column align="center" min-width="100px" label="服务标题" prop="title" />
						<el-table-column align="center" min-width="120px" label="服务描述" prop="describe" />
						<el-table-column align="center" min-width="100px" property="iconUrl" label="服务图标">
							<template slot-scope="scope">
								<el-image
									v-if="scope.row.iconUrl" :src="common.seamingImgUrl(scope.row.iconUrl)" style="width:40px; height:40px" fit="cover"
									:preview-src-list="[ common.seamingImgUrl(scope.row.iconUrl) ]"
								/>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="120px" label="所属会员套餐ID" prop="memberId" />
						<el-table-column align="center" min-width="120px" label="创建时间" prop="creatTime" />
						<el-table-column align="center" label="操作" min-width="150px" class-name="small-padding fixed-width" fixed="right">
							<template slot-scope="scope">
								<el-button
									type="primary" size="mini"
									@click="handleUpdateServe(scope.row)"
								>
									编辑
								</el-button>
								<el-button
									type="danger" size="mini"
									@click="handleDeleteServe(scope.row)"
								>
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<Pagination
					v-show="serviceTotal > 0" :total="serviceTotal" :page.sync="serviceQuery.page" :limit.sync="serviceQuery.size"
					@pagination="getServiceList"
				/>
			</div>
		</el-dialog>

		<!-- 新增或编辑服务 -->
		<el-dialog :title="{ update: '编辑服务', create: '新增服务' }[dialogStatus]" :visible.sync="dialogFormVisibleServe" width="800px">
			<el-form
				ref="dataFormServe" :rules="rulesServe" :model="dataFormServe" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<!-- <el-form-item label="ID" prop="id">
					<el-input v-model="dataFormServe.id" disabled />
					</el-form-item> -->
				<el-form-item label="服务标题" prop="title">
					<el-input v-model="dataFormServe.title" placeholder="请输入服务标题" />
				</el-form-item>
				<el-form-item label="服务描述" prop="describe">
					<el-input v-model="dataFormServe.describe" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" maxlength="120" show-word-limit placeholder="请输入企业描述" />
				</el-form-item>
				<el-form-item label="服务图标" prop="iconUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="(response) => dataFormServe.iconUrl = response.data.url"
						:on-error="() => $message.error('上传失败')" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataFormServe.iconUrl" :src="common.seamingImgUrl(dataFormServe.iconUrl)" width="145">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleServe = false">取消</el-button>
				<el-button v-if="dialogStatusServe == 'create'" type="primary" @click="createDataServe">确定</el-button>
				<el-button v-if="dialogStatusServe == 'update'" type="primary" @click="updateDataServe">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { packageMemberList, packageMemberAdd, packageMemberUpdate, packageMemberDelete, packageServiceList, packageServiceAdd, packageServiceUpdate, packageServiceDelete } from '@/api/marketingManagement/memberPackage'
import { listRole } from '@/api/business/role'
import { uploadPath } from '@/api/business/storage'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
	name: 'MemberPackage',
	components: { Pagination },
	data() {
		return {
			downloadLoading: false,
			uploadPath,
			list: undefined,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				size: 20
			},
			roleList: [],

			// 新增或编辑会员套餐信息对话框
			dialogStatus: '',
			dialogFormVisible: false,
			dataForm: {
				id: '',
				title: '',
				amount: '',
				roleIds: '',
				iconUrl: ''
			},
			rules: {
				title: [ { required: true, message: '会员套餐标题不能为空', trigger: 'blur' } ],
				amount: [ { required: true, message: '会员套餐金额为空', trigger: 'blur' } ],
				roleIds: [ { required: true, message: '关联角色不能为空', trigger: 'blur' } ],
				iconUrl: [ { required: true, message: '会员套餐图标不能为空', trigger: 'blur' } ]
			},

			// 查看服务套餐对话框
			dataFormService: {
				id: '',
				memberId: '',
				title: '',
				amount: '',
				roleIds: '',
				iconUrl: '',
				serviceList: []
			},
			dialogFormVisibleService: false,
			serviceQuery: {
				page: 1,
				size: 20,
				memberId: ''
			},
			serviceTotal: 0,
			serviceListLoading: true,

			// 新增或编辑服务套餐
			dataFormServe: {
				id: '',
				memberId: '',
				title: '',
				describe: '',
				iconUrl: ''
			},
			dialogStatusServe: '',
			dialogFormVisibleServe: false,
			rulesServe: {
				title: [ { required: false, message: '服务标题不能为空', trigger: 'blur' } ],
				describe: [{ required: true, message: '服务描述不能为空', trigger: 'blur' }, { max: 120, message: '120字以内' }],
				iconUrl: [ { required: true, message: '服务图标不能为空', trigger: 'blur' } ]
			}

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
		listRole({ page: 1, limit: 99999 })
			.then((response) => {
				this.roleList = response.data.data.items
			})
			.catch(() => {
				this.roleList = []
			})
	},
	methods: {
		getList() {
			this.listLoading = true
			packageMemberList(this.listQuery).then((response) => {
				this.list = response.data.data.limit
				this.total = response.data.data.total
				this.listLoading = false
			})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		handleCreate() {
			this.resetForm()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		handleUpdate(row) {
			this.resetForm()
			this.dataForm = Object.assign(this.dataForm, {
				id: row.id || '',
				title: row.title || '',
				amount: row.amount || '',
				roleIds: row.roleIds || '',
				iconUrl: row.iconUrl || ''
			})
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		resetForm() {
			this.dataForm = {
				id: '',
				title: '',
				amount: '',
				roleIds: '',
				iconUrl: ''
			}
		},
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					packageMemberAdd(this.dataForm)
						.then((response) => {
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '创建会员套餐成功'
							})
							this.getList()
						})
						.catch((response) => {
							this.$notify.error({
								title: '创建会员套餐失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					packageMemberUpdate(this.dataForm).then(() => {
						this.getList()
						this.dialogFormVisible = false
						this.$notify.success({
							title: '成功',
							message: '更新会员套餐成功'
						})
					})
						.catch((response) => {
							this.$notify.error({
								title: '更新会员套餐失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},

		async handleDelete(row) {
			await this.$elConfirm('确认删除?')
			packageMemberDelete({ id: row.id }).then((response) => {
				this.$notify.success({
					title: '成功',
					message: '删除成功'
				})
				this.getList()
			})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},

		handleOpenService(row) {
			this.resetFormService()
			this.serviceQuery.memberId = row.id
			this.dataFormService = Object.assign(this.dataFormService, row)
			this.getServiceList()
			this.dialogFormVisibleService = true
		},
		async getServiceList() {
			this.serviceTotal = 0
			this.serviceListLoading = true
			await packageServiceList(this.serviceQuery).then((response) => {
				this.dataFormService.serviceList = response.data.data.limit
				this.serviceTotal = response.data.data.total
				this.serviceListLoading = false
			})
				.catch(() => {
					this.list = []
					this.serviceTotal = 0
					this.serviceListLoading = false
				})
		},
		resetFormService() {
			this.dataFormService = {
				id: '',
				memberId: '',
				title: '',
				amount: '',
				roleIds: '',
				iconUrl: '',
				serviceList: []
			}
		},

		handleCreateServe() {
			this.resetFormServe()
			this.dataFormServe.memberId = this.dataFormService.id
			this.dialogStatusServe = 'create'
			this.dialogFormVisibleServe = true
			this.$nextTick(() => {
				this.$refs.dataFormServe.clearValidate()
			})
		},
		handleUpdateServe(row) {
			this.resetFormServe()
			this.dataFormServe = Object.assign(this.dataFormServe, {
				id: row.id,
				memberId: row.memberId,
				title: row.title,
				describe: row.describe,
				iconUrl: row.iconUrl
			})
			this.dialogStatusServe = 'update'
			this.dialogFormVisibleServe = true
			this.$nextTick(() => {
				this.$refs.dataFormServe.clearValidate()
			})
		},
		async handleDeleteServe(row) {
			await this.$elConfirm('确认删除?')
			packageServiceDelete({ id: row.id })
				.then((response) => {
					this.handleOpenService(this.dataFormService)
					this.$notify.success({
						title: '成功',
						message: '删除服务成功'
					})
				})
				.catch((response) => {
					this.handleOpenService(this.dataFormService)
					this.$notify.error({
						title: '删除服务失败',
						message: response.data.errmsg
					})
				})
		},
		resetFormServe() {
			this.dataFormServe = {
				id: '',
				memberId: '',
				title: '',
				describe: '',
				iconUrl: ''
			}
		},

		createDataServe() {
			this.$refs.dataFormServe.validate((valid) => {
				if (valid) {
					if (!this.dataFormServe.memberId) return this.$message({ type: 'error', message: '缺少所属会员套餐信息!' })
					packageServiceAdd({ ...this.dataFormServe })
						.then((response) => {
							this.dialogFormVisibleServe = false
							// this.dialogFormVisibleService = false
							this.$notify.success({
								title: '成功',
								message: '创建服务成功'
							})
							this.handleOpenService(this.dataFormService)
							// setTimeout(() => {
							// 	this.dialogFormVisibleService = true
							// }, 2000)
						})
						.catch((response) => {
							this.$notify.error({
								title: '创建服务失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},
		updateDataServe() {
			this.$refs.dataFormServe.validate((valid) => {
				if (valid) {
					if (!this.dataFormServe.memberId) return this.$message({ type: 'error', message: '缺少所属会员套餐信息!' })
					packageServiceUpdate({ ...this.dataFormServe })
						.then(() => {
							this.dialogFormVisibleServe = false
							// this.dialogFormVisibleService = false
							this.$notify.success({
								title: '成功',
								message: '更新服务成功'
							})
							this.handleOpenService(this.dataFormService)
							// setTimeout(() => {
							// 	this.dialogFormVisibleService = true
							// }, 2000)
						})
						.catch((response) => {
							this.$notify.error({
								title: '更新服务失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},

		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['标题', '金额', '关联角色', '图标']
				const filterVal = ['title', 'amount', 'roleIds', 'iconUrl']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '会员套餐')
				this.downloadLoading = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
/deep/ .avatar-uploader {
	.el-upload {
		width: 145px;
		height: 145px;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.el-upload:hover {
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
}
</style>
