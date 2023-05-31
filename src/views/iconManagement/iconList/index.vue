<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<!-- <el-input
				v-model="listQuery.keyword" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入关键字"
				/>
				<el-button
				v-permission="[ 'GET /admin/dtsGradePermission/h5IconList' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
				>
				查找
				</el-button> -->
			<el-button
				v-permission="[ 'POST /admin/dtsGradePermission/h5IconAdd' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
			<el-button
				:loading="downloadLoading" size="mini" class="filter-item" type="warning"
				icon="el-icon-download"
				@click="handleDownload"
			>
				导出
			</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%" highlight-current-row
			>
				<el-table-column align="center" width="150px" label="图标ID" prop="id" sortable />

				<el-table-column align="center" min-width="100px" label="图标类型" prop="type">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.type === 0" type="success">我的工具</el-tag>
						<el-tag v-else-if="scope.row.type === 1" type="info">我的服务</el-tag>
						<el-tag v-else-if="scope.row.type === 2" type="warning">数字化营销门店</el-tag>
						<el-tag v-else-if="scope.row.type === 3" type="danger">营销工具</el-tag>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="100px" label="图标名称" prop="iconName" />

				<el-table-column align="center" property="iconUrl" label="图标图片">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.iconUrl" :src="common.seamingImgUrl(scope.row.iconUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.iconUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="100px" label="创建时间" prop="createTime" />

				<el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'POST /admin/dtsGradePermission/h5IconUpdate' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/dtsGradePermission/h5IconUpdate' ]" type="danger" size="mini"
							@click="handleDelete(scope.row)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
			@pagination="getList"
		/>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="图标类型" prop="type">
					<el-select v-model="dataForm.type" placeholder="请选择">
						<el-option :value="0" label="我的工具" />
						<el-option :value="1" label="我的服务" />
						<el-option :value="2" label="数字化营销门店" />
						<el-option :value="3" label="营销工具" />
					</el-select>
				</el-form-item>
				<el-form-item label="图标名称" prop="iconName">
					<el-input v-model="dataForm.iconName" placeholder="请输入图标名称" />
				</el-form-item>
				<el-form-item label="图标图片" prop="iconUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="(e) => dataForm.iconUrl = e.data.url"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.iconUrl" :src="common.seamingImgUrl(dataForm.iconUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
				<el-button v-else type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { h5IconList, h5IconAdd, h5IconUpdate, h5IconDeleted } from '@/api/iconManagement/iconList'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'

export default {
	name: 'IconList',
	components: { Pagination },
	data() {
		return {
			uploadPath,
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				size: 20
			},
			dataForm: {
				id: '',
				type: '',
				iconName: '',
				iconUrl: ''
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				type: [ { required: true, message: '请选择图标类型', trigger: 'blur' } ],
				iconName: [ { required: true, message: '请输入图标名称', trigger: 'blur' } ],
				iconUrl: [ { required: true, message: '请选择图标图片', trigger: 'blur' } ]
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
			h5IconList(this.listQuery).then((response) => {
				this.list = response.data.limit
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
				id: '',
				type: '',
				iconName: '',
				iconUrl: ''
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
					h5IconAdd(this.dataForm).then((response) => {
						this.getList()
						this.dialogFormVisible = false
						this.$notify.success({
							title: '成功',
							message: '创建成功'
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
					h5IconUpdate(this.dataForm).then(() => {
						this.getList()
						this.dialogFormVisible = false
						this.$notify.success({
							title: '成功',
							message: '更新成功'
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
		async handleDelete(row) {
			await this.$elConfirm('确认删除?')
			h5IconDeleted({ id: row.id }).then((response) => {
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
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['图标ID', '图标类型', '图标名称', '图标图片', '创建时间']
				const filterVal = ['id', 'type', 'iconName', 'iconUrl', 'creatTime']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '图标列表')
				this.downloadLoading = false
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

