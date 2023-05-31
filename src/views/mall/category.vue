<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.id" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入类目ID"
			/>
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入类目名称"
			/>
			<el-button
				v-permission="[ 'GET /admin/category/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/category/create' ]" size="mini" class="filter-item" type="primary"
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
				border fit height="100%"
				highlight-current-row
			>

				<el-table-column align="center" label="类目ID" prop="id" sortable />

				<el-table-column align="center" label="类目名" prop="name" />

				<el-table-column align="center" property="appIconUrl" label="H5类目图标">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.iconUrl" :src="common.seamingImgUrl(scope.row.appIconUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.appIconUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" property="iconUrl" label="类目图标">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.iconUrl" :src="common.seamingImgUrl(scope.row.iconUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.iconUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" property="picUrl" label="类目图片">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.picUrl" :src="common.seamingImgUrl(scope.row.picUrl)" style="width:80px; height:80px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.picUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="关键字" prop="keywords" />

				<el-table-column align="center" min-width="100" label="简介" prop="desc" />

				<el-table-column align="center" label="级别" prop="level">
					<template slot-scope="scope">
						<el-tag :type="scope.row.level === 'L1' ? 'primary' : 'info'">
							{{ scope.row.level === 'L1' ? '一级类目'
								: scope.row.level === 'L2' ? '二级类目' : '三级类目' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column align="center" label="父类目ID" prop="pid" />

				<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'POST /admin/category/update' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-if="scope.row.id != 1 && scope.row.id != 2" v-permission="[ 'POST /admin/category/delete' ]"
							type="danger" size="mini" @click="handleDelete(scope.row)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

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
				<el-form-item label="类目名称" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>
				<el-form-item label="关键字" prop="keywords">
					<el-input v-model="dataForm.keywords" />
				</el-form-item>
				<el-form-item label="级别" prop="level">
					<el-select v-model="dataForm.level" @change="onLevelChange">
						<el-option label="一级类目" value="L1" />
						<el-option label="二级类目" value="L2" />
						<el-option label="三级类目" value="L3" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="dataForm.level === 'L2'" label="父类目" prop="pid">
					<el-select v-model="dataForm.pid">
						<el-option v-for="item in catL1" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="dataForm.level === 'L3'" label="一级类目" prop="parentId">
					<el-select v-model="dataForm.parentId" @change="onLevel1Change">
						<el-option v-for="item in catL1" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="dataForm.level === 'L3'" label="二级类目" prop="pid">
					<el-select v-model="dataForm.pid">
						<el-option v-for="item in catL2" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="H5类目图标" prop="appIconUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadAppIconUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.appIconUrl" :src="common.seamingImgUrl(dataForm.appIconUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="类目图标" prop="iconUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIconUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.iconUrl" :src="common.seamingImgUrl(dataForm.iconUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="类目图片" prop="picUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.picUrl" :src="common.seamingImgUrl(dataForm.picUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="类目简介" prop="desc">
					<el-input v-model="dataForm.desc" />
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
import { listCategory, listCatL1, listCatL2, createCategory, updateCategory, deleteCategory } from '@/api/business/category'
import { uploadPath } from '@/api/business/storage'
import { getUserInfo } from '@/api/login'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
	name: 'Category',
	components: { Pagination },
	data() {
		return {
			uploadPath,
			list: undefined,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				id: undefined,
				name: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			catL1: {},
			catL2: {},
			dataForm: {
				id: undefined,
				name: '',
				keywords: '',
				level: '',
				pid: undefined,
				parentId: undefined,
				desc: '',
				appIconUrl: undefined,
				iconUrl: undefined,
				picUrl: undefined
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				name: [ { required: true, message: '类目名不能为空', trigger: 'blur' } ]
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
		this.getRoles()
		// this.getList()
		// this.getCatL1()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					if (response.data.roles[0] === '超级管理员') {
						this.$router.push({ name: 'brandCategory' })
					} else if (response.data.roles[0] === '门店' || response.data.roles[0] === '营销策划') {
						this.getList()
						this.getCatL1()
					}
				})
				.catch()
		},
		getList() {
			this.listLoading = true
			listCategory(this.listQuery)
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
		getCatL1() {
			listCatL1().then((response) => {
				this.catL1 = response.data
			})
		},
		getCatL2(id) {
			listCatL2({
				parentId: id
			}).then((response) => {
				this.catL2 = response.data
			})
		},
		onLevel1Change() {
			this.getCatL2(this.dataForm.parentId)
			this.dataForm.pid = undefined
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		resetForm() {
			this.dataForm = {
				id: undefined,
				name: '',
				keywords: '',
				level: 'L2',
				pid: undefined,
				pid1: undefined,
				desc: '',
				appIconUrl: undefined,
				iconUrl: undefined,
				picUrl: undefined
			}
		},
		onLevelChange(value) {
			if (value === 'L1') {
				this.pid = 'L1'
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
		uploadAppIconUrl(response) {
			this.dataForm.appIconUrl = response.data.url
		},
		uploadIconUrl(response) {
			this.dataForm.iconUrl = response.data.url
		},
		uploadPicUrl(response) {
			this.dataForm.picUrl = response.data.url
		},
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					console.log(this.dataForm)
					createCategory(this.dataForm)
						.then((response) => {
							this.getList()
							// 更新L1L2目录
							this.getCatL1()
							this.getCatL2()
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
					updateCategory(this.dataForm)
						.then(() => {
							this.getList()
							// 更新L1目录
							this.getCatL1()
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
		handleDelete(row) {
			deleteCategory(row)
				.then((response) => {
					// 更新L1目录
					this.getCatL1()
					this.$notify.success({
						title: '成功',
						message: '删除成功'
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
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = [
					'类目ID',
					'名称',
					'关键字',
					'级别',
					'父类目ID',
					'类目图标',
					'类目图片',
					'简介'
				]
				const filterVal = [
					'id',
					'name',
					'keywords',
					'level',
					'pid',
					'iconUrl',
					'picUrl',
					'desc'
				]
				excel.export_json_to_excel2(
					tHeader,
					this.list,
					filterVal,
					'商品类目信息'
				)
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
