<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.storeName" clearable size="mini" class="filter-item"
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

			<el-table-column align="center" label="ID" prop="id" sortable />

			<!-- <el-table-column
				align="center"
				label="父等级编号"
				prop="fatherId"
				sortable
				/> -->

			<el-table-column align="center" label="门店类型名称" prop="storeName" />

			<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/admin/update' ]" type="primary" size="mini"
						@click="handleUpdate(scope.row)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="[ 'POST /admin/admin/delete' ]" type="danger" size="mini"
						@click="handleDelete(scope.row)"
					>
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

				<div v-if="dialogStatus != 'create'">
					<el-form-item label="原门店类型" prop="id">
						{{ dataForm.original || '无' }}
					</el-form-item>
				</div>

				<el-form-item label="门店类型层级" prop="level">
					<el-select v-model="dataForm.level" :disabled="disabledLevel" clearable placeholder="请选择门店类型层级" @change="(e) => ((dataForm.tempL1 = '') || (dataForm.tempL2 = '') || (typeLevel2Change = []))">
						<el-option label="一级" value="1" />
						<el-option label="二级" value="2" />
						<el-option label="三级" value="3" />
					</el-select>
				</el-form-item>

				<div v-if="dataForm.level === '2' || dataForm.level === '3'">
					<el-form-item label="所属一级门店类型" prop="tempL1">
						<el-select v-model="dataForm.tempL1" clearable placeholder="请选择所属一级门店类型" @change="handleL1Select">
							<el-option v-for="item in typeLevel1" :key="item.id" :label="item.storeName" :value="item.id" />
						</el-select>
					</el-form-item>
				</div>

				<div v-if="dataForm.level === '3' && dataForm.tempL1">
					<el-form-item label="所属二级门店类型" prop="tempL2">
						<el-select v-model="dataForm.tempL2" clearable placeholder="请选择所属二级门店类型" @change="(e) => dataForm.id = typeLevel2Change.find(item => item.id === e).children[0].id">
							<el-option v-for="item in typeLevel2Change" :key="item.id" :label="item.storeName" :value="item.id" />
						</el-select>
					</el-form-item>
				</div>

				<el-form-item label="门店类型名称" prop="storeType.storeName">
					<el-input v-model="dataForm.storeType.storeName" placeholder="请填写门店类型名称" />
				</el-form-item>

				<el-form-item label="门店类型图片" prop="storeType.picUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="(response) => dataForm.storeType.picUrl = response.data.url"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.storeType.picUrl" :src="common.seamingImgUrl(dataForm.storeType.picUrl)" width="145">
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
import { listDelete, listGet, idGet, dtsStoreTypeAddType, dtsStoreTypeUpdateType } from '@/api/configurationTable/storeType'
import { listDtsStoreType } from '@/api/business/brand'
// import { roleOptions } from '@/api/business/role'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import XeUtils from 'xe-utils'

export default {
	name: 'Admin',
	components: { Pagination },
	data() {
		return {
			typeOptions: [],
			typeLevel1: [],
			typeLevel2: [],
			typeLevel2Change: [],
			uploadPath,
			list: null,
			total: 0,
			roleOptions: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				storeName: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				original: '',
				level: '',
				tempL1: '',
				tempL2: '',
				id: '',
				storeType: {
					id: '',
					storeName: '',
					picUrl: ''
				}
			},
			disabledLevel: false,
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				'level': [ { required: true, message: '层级不能为空', trigger: 'blur' } ],
				'storeType.storeName': [
					{ required: true, message: '门店类型名称不能为空', trigger: 'blur' }
				],
				'storeType.picUrl': [ { required: false, message: '图片不能为空', trigger: 'blur' } ]
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
		// 获取门店类型
		this.getTypeOption()

		// roleOptions()
		//   .then(response => {
		//     this.roleOptions = response.data.data
		//   })
	},
	methods: {
		formatRole(roleId) {
			for (let i = 0; i < this.roleOptions.length; i++) {
				if (roleId === this.roleOptions[i].value) {
					return this.roleOptions[i].label
				}
			}
			return ''
		},
		getTypeOption() {
			listDtsStoreType().then((response) => {
				this.typeOptions = response.data.data
				this.typeLevel1 = XeUtils.filterTree(this.typeOptions, (item) => item.level === '1')
				this.typeLevel2 = XeUtils.filterTree(this.typeOptions, (item) => item.level === '2')
			})
				.catch(() => {
					this.typeOptions = []
				})
		},
		getList() {
			this.listLoading = true
			listGet(this.listQuery)
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
		handleL1Select(e) {
			this.dataForm.tempL2 = ''
			if (this.dataForm.level === '2') {
				this.dataForm.id = this.typeLevel1.find((item) => item.id === e).children[0].id
			} else if (this.dataForm.level === '3') {
				this.typeLevel2Change = this.typeLevel2.filter((item) => (item.pid === this.dataForm.tempL1) && item.children && item.children.length)
			}
		},
		resetForm() {
			this.dataForm = {
				original: '',
				level: '',
				tempL1: '',
				tempL2: '',
				id: '',
				storeType: {
					id: '',
					storeName: '',
					picUrl: ''
				}
			}
		},
		// uploadAvatar: function (response) {
		//   this.dataForm.avatar = response.data.url
		// },
		handleCreate() {
			this.disabledLevel = false
			this.resetForm()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		handleUpdate(row) {
			this.disabledLevel = false
			this.resetForm()
			idGet({ id: row.id })
				.then((response) => {
					this.dataForm = Object.assign(this.dataForm, {
						original: '',
						id: response.data.data.id,
						storeType: {
							id: response.data.data.id,
							storeName: response.data.data.storeName,
							picUrl: response.data.data.picUrl
						}
					})
					const storeTypeItem = XeUtils.findTree(this.typeOptions, (i) => i.id === response.data.data.id)
					if (storeTypeItem !== undefined && Array.isArray(storeTypeItem.nodes)) {
						this.dataForm.original = storeTypeItem.nodes.map((i) => i.storeName).join('/')
						if (storeTypeItem.nodes.length === 1) {
							this.dataForm.level = '1'
							this.disabledLevel = true
						} else if (storeTypeItem.nodes.length === 2) {
							this.dataForm.level = '2'
							this.dataForm.tempL1 = storeTypeItem.nodes[0].id
						} else if (storeTypeItem.nodes.length === 3) {
							this.dataForm.level = '3'
							this.dataForm.tempL1 = storeTypeItem.nodes[0].id
							this.typeLevel2Change = this.typeLevel2.filter((item) => (item.pid === this.dataForm.tempL1) && item.children && item.children.length)
							this.dataForm.tempL2 = storeTypeItem.nodes[1].id
						}
					}
					console.log(storeTypeItem)
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
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					if (this.dataForm.level === '1') {
						// this.dataForm.id = this.typeLevel1[0].id
						return this.$notify.error({
							title: '失败',
							message: '禁止创建一级层级'
						})
					} else if (this.dataForm.level === '2') {
						if (!this.dataForm.tempL1) {
							return this.$notify.error({
								title: '失败',
								message: '请填写所属一级门店类型'
							})
						}
					} else if (this.dataForm.level === '3') {
						if (!this.dataForm.tempL1) {
							return this.$notify.error({
								title: '失败',
								message: '请填写所属一级门店类型'
							})
						} else if (!this.dataForm.tempL2) {
							return this.$notify.error({
								title: '失败',
								message: '请填写所属二级门店类型'
							})
						}
					}
					dtsStoreTypeAddType(this.dataForm)
						.then((response) => {
							this.getList()
							this.getTypeOption()
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '添加门店类型成功'
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
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					if (this.dataForm.level === '1') {
						// this.dataForm.id = this.typeLevel1[0].id
						return this.$notify.error({
							title: '失败',
							message: '禁止编辑一级层级'
						})
					} else if (this.dataForm.level === '2') {
						if (!this.dataForm.tempL1) {
							return this.$notify.error({
								title: '失败',
								message: '请填写所属一级门店类型'
							})
						}
					} else if (this.dataForm.level === '3') {
						if (!this.dataForm.tempL1) {
							return this.$notify.error({
								title: '失败',
								message: '请填写所属一级门店类型'
							})
						} else if (!this.dataForm.tempL2) {
							return this.$notify.error({
								title: '失败',
								message: '请填写所属二级门店类型'
							})
						}
					}
					dtsStoreTypeUpdateType(this.dataForm)
						.then(() => {
							this.getList()
							this.getTypeOption()
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '编辑门店类型成功'
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
						message: '删除佣金关系信息成功'
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
		// handleDownload () {
		//   this.downloadLoading = true
		//   import('@/vendor/Export2Excel').then(excel => {
		//     const tHeader = ['佣金关系信息ID', '佣金关系信息名称', '佣金关系信息头像']
		//     const filterVal = ['id', 'username', 'avatar']
		//     excel.export_json_to_excel2(
		//       tHeader,
		//       this.list,
		//       filterVal,
		//       '佣金关系信息信息'
		//     )
		//     this.downloadLoading = false
		//   })
		// }
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
