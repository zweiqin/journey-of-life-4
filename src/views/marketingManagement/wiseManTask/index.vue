<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-cascader v-model="regionArr" :props="regionProps" class="filter-item" size="mini" placeholder="请选择区域" />
			<el-button
				v-permission="[ 'GET /admin/dtsTalentTask/list' ]" size="mini" class="filter-item" type="primary"
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
			<!-- <el-upload
				v-if="$store.state.user.roles.includes('门店')" :action="uploadUrl" :show-file-list="false" :headers="headers"
				:data="{
				shopId: $store.state.user.userId,
				userId: $store.state.user.userId
				}" :file-list="fileList" :before-upload="beforeUploadFile" :on-success="handleUploadSuccess"
				:on-error="() => $message.error('上传失败')" style="display: inline;margin-left: 10px" accept=".xlsx,.xls"
				>
				<el-button size="mini" type="primary" class="filter-item">上传任务文件</el-button>
				</el-upload>
				<el-button
				v-else-if="$store.state.user.roles.includes('营销策划')" size="mini" type="primary" class="filter-item"
				@click="uploadFormVisible = true"
				>
				上传任务列表
				</el-button> -->
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
				添加
			</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%"
				highlight-current-row
			>
				<el-table-column align="center" min-width="80px" label="任务ID" prop="id" />
				<el-table-column align="center" min-width="120px" label="任务所属门店ID" prop="shopid" />
				<el-table-column align="center" min-width="100px" label="任务上传者ID" prop="userid" />
				<el-table-column align="center" min-width="100px" label="任务名称" prop="name" />
				<el-table-column align="center" min-width="80px" label="单价" prop="unitPrice" />
				<el-table-column align="center" min-width="100px" label="佣金比例" prop="possessGold" />
				<el-table-column align="center" min-width="100px" prop="type" label="类型">
					<template slot-scope="scope">
						<span v-if="scope.row.type === 0">平台任务</span>
						<span v-else-if="scope.row.type === 1">商家任务</span>
						<span v-else-if="scope.row.type === 2">巨蜂任务</span>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="详情" prop="detail" />
				<el-table-column align="center" min-width="100px" label="等级" prop="grade" />
				<el-table-column align="center" min-width="100px" label="地区" prop="region" />
				<el-table-column align="center" min-width="100px" label="地区名称" prop="regionName" />
				<el-table-column align="center" min-width="100px" label="阅读量" prop="viewVolume" />
				<el-table-column align="center" min-width="100px" property="img" label="图片">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.img" :src="common.seamingImgUrl(scope.row.img)" style="width:40px; height:40px"
							fit="cover" :preview-src-list="[ common.seamingImgUrl(scope.row.img) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="创建时间" prop="addTime" />
				<el-table-column align="center" min-width="100px" label="更新时间" prop="updateTime" />
				<el-table-column align="center" label="操作" min-width="180px" class-name="small-padding fixed-width" fixed="right">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/dtsTalentTask/list' ]" type="primary" size="mini"
							@click="handleDetail(scope.row)"
						>
							详情
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/dtsTalentTask/updateBox' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							编辑
						</el-button>
						<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 任务详情对话框 -->
		<el-dialog :visible.sync="detailDialogVisible" title="任务详情" width="800px">
			<el-form :model="dialogDetail" label-position="left" label-width="120px">
				<el-form-item label="任务ID">
					<span>{{ dialogDetail.id }}</span>
				</el-form-item>
				<el-form-item label="任务所属门店ID">
					<span>{{ dialogDetail.shopid }}</span>
				</el-form-item>
				<el-form-item label="任务上传者ID">
					<span>{{ dialogDetail.userid }}</span>
				</el-form-item>
				<el-form-item label="任务名称">
					<span>{{ dialogDetail.name }}</span>
				</el-form-item>
				<el-form-item label="单价">
					<span>{{ dialogDetail.unitPrice }}</span>
				</el-form-item>
				<el-form-item label="佣金比例">
					<span>{{ dialogDetail.possessGold }}</span>
				</el-form-item>
				<el-form-item label="类型">
					<span v-if="dialogDetail.type === 0">平台任务</span>
					<span v-else-if="dialogDetail.type === 1">商家任务</span>
					<span v-else-if="dialogDetail.type === 2">巨蜂任务</span>
					<span v-else>--</span>
				</el-form-item>
				<el-form-item label="详情">
					<span>{{ dialogDetail.detail }}</span>
				</el-form-item>
				<el-form-item label="等级">
					<span>{{ dialogDetail.grade }}</span>
				</el-form-item>
				<el-form-item label="地区">
					<span>{{ dialogDetail.region }}</span>
				</el-form-item>
				<el-form-item label="地区名称">
					<span>{{ dialogDetail.regionName }}</span>
				</el-form-item>
				<el-form-item label="阅读量">
					<span>{{ dialogDetail.viewVolume }}</span>
				</el-form-item>
				<el-form-item label="图片">
					<div>
						<el-image
							v-if="dialogDetail.img" :src="common.seamingImgUrl(dialogDetail.img)"
							style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(dialogDetail.img) ]"
						/>
						<span v-else>--</span>
					</div>
				</el-form-item>
				<el-form-item label="创建时间">
					<span>{{ dialogDetail.addTime }}</span>
				</el-form-item>
				<el-form-item label="更新时间">
					<span>{{ dialogDetail.updateTime }}</span>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 新增和修改对话框 -->
		<el-dialog :title="{ update: '编辑达人任务', create: '创建达人任务' }[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="门店" prop="type">
					<el-select v-model="dataForm.shopid" filterable placeholder="请选择任务所属门店">
						<el-option v-for="item in brandList" :key="item.id" :label="`${item.name}（${item.id}）`" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="任务名称" prop="name">
					<el-input v-model="dataForm.name" placeholder="请输入任务名称" />
				</el-form-item>
				<el-form-item label="单价" prop="unitPrice">
					<el-input v-model="dataForm.unitPrice" placeholder="请输入单价">
						<template #append><span>元</span></template>
					</el-input>
				</el-form-item>
				<el-form-item label="佣金比例" prop="possessGold">
					<el-input v-model="dataForm.possessGold" type="text" placeholder="请输入佣金比例">
						<template #append><span>：1</span></template>
					</el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="dataForm.type" filterable placeholder="请选择任务类型">
						<el-option label="平台任务" value="0" />
						<el-option label="商家任务" value="1" />
						<el-option label="巨蜂任务" value="2" />
					</el-select>
				</el-form-item>
				<el-form-item label="详情" prop="detail">
					<el-input v-model="dataForm.detail" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" maxlength="120" show-word-limit placeholder="请输入任务详情" />
				</el-form-item>
				<el-form-item label="等级" prop="grade">
					<el-input v-model="dataForm.grade" placeholder="请输入等级" />
				</el-form-item>
				<el-form-item label="地区" prop="region">
					<el-input v-model="dataForm.region" disabled />
				</el-form-item>
				<el-form-item label="地区名称" prop="regionName">
					<el-cascader
						v-model="regionArrDialog" :props="regionProps" size="mini" placeholder="请选择区域"
						@change="dataForm.region = regionArrDialog[2]"
					/>
				</el-form-item>
				<el-form-item label="图片">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						:on-error="() => $message.error('上传失败')" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.img"
							class="avatar" :src="common.seamingImgUrl(dataForm.img)" style="" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(dataForm.img) ]"
						/>
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

		<!-- 上传任务对话框 -->
		<!-- <el-dialog title="上传任务" :visible.sync="uploadFormVisible">
			<el-form
			ref="taskDataForm" :rules="rules" :model="taskDataForm" status-icon
			label-position="left"
			label-width="120px" style="width: 400px; margin-left:50px;"
			>
			<el-form-item label="门店" prop="type">
			<el-select v-model="taskDataForm.shopId" filterable placeholder="请选择任务所属门店">
			<el-option v-for="item in brandList" :key="item.id" :label="`${item.name}（${item.id}）`" :value="item.id" />
			</el-select>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			<el-button @click="uploadFormVisible = false">取消</el-button>
			<el-upload
			v-if="taskDataForm.shopId" :action="uploadUrl" :show-file-list="false" :headers="headers"
			:data="{
			shopId: taskDataForm.shopId,
			userId: $store.state.user.userId
			}" :file-list="fileList" :before-upload="beforeUploadFile" :on-success="handleUploadSuccess"
			style="display: inline;margin-left: 10px" accept=".xlsx,.xls"
			>
			<el-button size="mini" type="primary" class="filter-item">上传任务文件</el-button>
			</el-upload>
			</div>
			</el-dialog> -->

	</div>
</template>

<script>
import { listBrand } from '@/api/business/brand'
// import { talentTaskUpload, talentTaskList, talentTaskInfo, talentTaskUpdate, talentTaskDelete } from '@/api/marketingManagement/wiseManTask'
import { talentTaskList, talentTaskDelete, dtsTalentTaskList, dtsTalentTaskUpdateBox, dtsTalentTaskSubmitBox } from '@/api/marketingManagement/wiseManTask'
import { uploadPath } from '@/api/business/storage'
import { listSubRegion } from '@/api/business/region'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
	name: 'WiseManTask',
	components: { Pagination },
	data() {
		return {
			downloadLoading: false,
			uploadUrl: process.env.BASE_API + '/talentTask/upload',
			regionProps: {
				lazy: true,
				lazyLoad(node, resolve) {
					const { level } = node
					listSubRegion({ id: level === 0 ? 0 : node.data.id }).then((response) => {
						resolve(response.data.map((item) => ({
							id: item.id,
							value: item.code,
							label: level === 2 ? `${item.name}（${item.code}）` : item.name,
							leaf: level >= 2
						})))
					})
						.catch((response) => {
							this.$notify.error({
								title: '出错了',
								message: response.data.errmsg
							})
						})
				}
			},
			regionArr: ['', '', ''],
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				region: '',
				shopid: '',
				userId: this.$store.state.user.userId || ''
			},
			brandList: [],

			// 详情对话框
			detailDialogVisible: false,
			dialogDetail: {
				id: '',
				shopid: '',
				userid: '',
				name: '',
				unitPrice: '',
				possessGold: '',
				type: '',
				detail: '',
				grade: '',
				region: '',
				regionName: '',
				viewVolume: '',
				img: '',
				addTime: '',
				updateTime: ''
			},

			// 新增编辑对话框
			dialogStatus: '',
			dialogFormVisible: false,
			rules: {
				shopid: [ { required: true, message: '任务所属门店不能为空', trigger: 'blur' } ],
				name: [ { required: true, message: '任务名称不能为空', trigger: 'blur' } ],
				unitPrice: [ { required: true, message: '单价不能为空', trigger: 'blur' } ],
				possessGold: [ { required: true, message: '佣金比例不能为空', trigger: 'blur' } ],
				type: [ { required: true, message: '类型不能为空', trigger: 'blur' } ],
				detail: [{ required: false, message: '任务详情不能为空', trigger: 'blur' }, { max: 120, message: '120字以内' }],
				grade: [ { required: true, message: '等级不能为空', trigger: 'blur' } ],
				region: [ { required: true, message: '地区不能为空', trigger: 'blur' } ],
				img: [ { required: true, message: '图片不能为空', trigger: 'blur' } ]
			},
			dataForm: {
				id: '',
				shopid: '',
				userid: '',
				name: '',
				unitPrice: '',
				possessGold: '',
				type: '',
				detail: '',
				grade: '',
				region: '',
				img: ''
			},
			regionArrDialog: ['', '', ''],
			uploadPath

			// // 上传文件对话框
			// fileList: [],
			// taskDataForm: {
			// 	shopId: ''
			// },
			// uploadFormVisible: false
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
			this.listQuery.region = this.regionArr[2]
			talentTaskList(this.listQuery).then((response) => {
				this.list = response.data.list
				this.total = response.data.total
				this.listLoading = false
			})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
			listBrand({ page: 1, limit: 9999, sort: 'add_time', order: 'desc' })
				.then((response) => {
					this.brandList = response.data.items
				})
				.catch((response) => {
					this.$notify.error({
						title: '查找门店数据失败',
						message: response.data.errmsg
					})
				})
		},
		handleCreate() {
			this.resetForm()
			this.dataForm = Object.assign(this.dataForm, { userid: this.$store.state.user.userId })
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		handleUpdate(row) {
			this.resetForm()
			this.dataForm = Object.assign(this.dataForm, row)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		handleDetail(row) {
			// talentTaskInfo({ id: row.id }).then((response) => {
			// 	this.dialogDetail = response.data
			// })
			this.dialogDetail = Object.assign({}, row)
			this.detailDialogVisible = true
		},
		resetForm() {
			this.dataForm = {
				id: '',
				shopid: '',
				userid: '',
				name: '',
				unitPrice: '',
				possessGold: '',
				type: '',
				detail: '',
				grade: '',
				region: '',
				img: ''
			}
		},
		uploadPicUrl(response) {
			this.dataForm.img = response.data.url
		},
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					dtsTalentTaskSubmitBox(this.dataForm)
						.then((response) => {
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '创建成功'
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
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					dtsTalentTaskUpdateBox(this.dataForm).then(() => {
						this.dialogFormVisible = false
						this.$notify.success({
							title: '成功',
							message: '更新成功'
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
		// // 限制上传文件类型
		// beforeUploadFile(file) {
		// 	const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
		// 	const isXls = extension === 'xls'
		// 	const isXlsx = extension === 'xlsx'
		// 	if (!isXls && !isXlsx) {
		// 		this.$message.warning('只能上传excel的文件')
		// 	}
		// 	return isXls || isXlsx
		// },
		handleDelete(row) {
			talentTaskDelete({ id: row.id }).then((response) => {
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
		// handleUploadSuccess(response) {
		// 	try {
		// 		if (response.data.fail.length) {
		// 			this.$notify.error({
		// 				title: '有数据插入失败',
		// 				message: `第${response.data.fail.join('、')}条数据插入失败`
		// 			})
		// 		} else {
		// 			this.$message.success('上传成功')
		// 			this.uploadFormVisible = false
		// 		}
		// 		this.getList()
		// 	} catch (err) {
		// 		this.$message.error('上传失败')
		// 	}
		// },
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['任务ID', '任务所属门店ID', '任务上传者ID', '图片', '任务名称', '单价', '拥金比例', '类型', '详情', '等级', '地区', '阅读量']
				const filterVal = ['id', 'shopid', 'userid', 'img', 'name', 'unitPrice', 'possessGold', 'type', 'detail', 'grade', 'region', 'viewVolume']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '达人任务')
				this.downloadLoading = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>

/deep/ .avatar-uploader {
	.el-upload {
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

	.avatar {
		width: 145px;
		height: 145px;
		display: block;
	}
}
</style>
