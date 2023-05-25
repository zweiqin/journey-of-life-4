<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.id" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店ID"
			/>
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店名称"
			/>
			<el-button
				v-permission="[ 'GET /admin/brand/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/brand/create' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
			<!-- <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">导出</el-button> -->
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%"
				highlight-current-row
			>

				<el-table-column align="center" min-width="100px" label="门店ID" prop="id" sortable />

				<el-table-column align="center" min-width="150px" label="门店名称" prop="name" />

				<el-table-column align="center" min-width="100px" property="picUrl" label="门店图片">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.picUrl" :src="common.seamingImgUrl(scope.row.picUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.picUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="120px" label="门店电话" prop="phone" />

				<el-table-column align="center" min-width="280px" label="门店简介" prop="desc" />

				<el-table-column align="center" min-width="80px" label="最低消费价格" prop="floorPrice" />

				<el-table-column align="center" prop="brandgenre" label="门店类型">
					<template slot-scope="scope">
						{{ scope.row.brandgenreName }}
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="100px" property="licenseUrl" label="营业执照">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.licenseUrl" :src="common.seamingImgUrl(scope.row.licenseUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.licenseUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="100px" property="idcardProsUrl" label="法人身份证正面">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.idcardProsUrl" :src="common.seamingImgUrl(scope.row.idcardProsUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.idcardProsUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="100px" property="idcardConsUrl" label="法人身份证反面">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.idcardConsUrl" :src="common.seamingImgUrl(scope.row.idcardConsUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.idcardConsUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<!-- <el-table-column
					align="center"
					min-width="80px"
					label="入驻说明"
					prop="explain"
					/> -->

				<el-table-column align="center" label="操作" min-width="220" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="shareUrlDetail(scope.row)">推广码</el-button>
						<el-button
							v-permission="[ 'POST /admin/brand/update' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/brand/delete' ]" type="danger" size="mini"
							@click="handleDelete(scope.row)"
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

		<!-- 店铺二维展示框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="shareUrlDialogVisible" :append-to-body="true" width="700">
			<el-form :data="dataForm" label-position="left">
				<el-form-item label="推广二维码">
					<el-image
						v-if="dataForm.shareUrl" :src="common.seamingImgUrl(dataForm.shareUrl)" style="width:300px; height:300px" fit="cover"
						:preview-src-list="[ common.seamingImgUrl(dataForm.shareUrl) ]"
					/>
					<span v-else>--</span>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<TMap :visible="showMap" @cancel="showMap = false" @map-confirm="confirmLocation" />
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="150px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="门店名称" prop="name">
					<el-input v-model="dataForm.name" placeholder="请输入门店名称" />
				</el-form-item>
				<el-form-item label="主营类目">
					<el-cascader
						v-model="dataForm.categoryIds" :options="categoryList" expand-trigger="hover"
						placeholder="请选择主营类目" @change="handleCategoryChange"
					/>
				</el-form-item>
				<el-form-item label="管理员">
					<el-select v-model="dataForm.adminId" placeholder="请选择管理员">
						<el-option v-for="item in adminList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item label="门店固定电话" prop="phone">
					<el-input v-model="dataForm.phone" placeholder="请输入门店固定电话" />
				</el-form-item>

				<el-form-item label="门店简介" prop="simpleDesc">
					<el-input v-model="dataForm.desc" placeholder="请输入门店简介" />
				</el-form-item>

				<el-form-item label="门店图片" prop="picUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.picUrl" :src="common.seamingImgUrl(dataForm.picUrl)" style="width:146px; height:146px" fit="contain"
							:preview-src-list="[ common.seamingImgUrl(dataForm.picUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="门店详情图片" prop="bgUrl">
					<el-upload
						:action="uploadPath"
						:limit="5"
						:file-list="bgUrlList"
						:headers="headers"
						:on-exceed="() => $message({ type: 'error', message: '上传文件个数超出限制!最多上传5张图片!' })"
						:on-success="(response, file, fileList) => response.errno === 0 && dataForm.bgUrl.push(response.data.url)"
						:on-remove="handleRemoveBgUrl"
						multiple
						accept=".jpg,.jpeg,.png,.gif"
						list-type="picture-card"
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>

				<el-form-item label="门店Logo" prop="logoUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadLogoUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.logoUrl" :src="common.seamingImgUrl(dataForm.logoUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="最低消费价格" prop="floorPrice">
					<el-input v-model="dataForm.floorPrice" placeholder="请输入最低消费价格" />
				</el-form-item>

				<el-form-item label="门店类型" prop="brandgenre">
					<el-cascader
						v-model="!dataForm.brandgenreArr ? dataForm.brandgenre : dataForm.brandgenreArr"
						:options="typeOptions"
						:props="{ checkStrictly: true, lazy: true, lazyLoad: (node, resolve) => resolve({ value: node.data.id, label: node.data.storeName, leaf: !node.data.children || node.data.children.length === 0 }), expandTrigger: 'hover', label: 'storeName', value: 'id', children: 'children' }"
						style="width: 250px;"
						@change="(value) => ((dataForm.brandgenre = value[value.length - 1]) && (dataForm.brandgenreArr = value))"
					/>
				</el-form-item>

				<el-form-item label="开始营业时间" prop="startTime">
					<el-time-picker v-model="dataForm.startTime" placeholder="起始时间" value-format="HH:mm:ss" />
				</el-form-item>

				<el-form-item label="结束营业时间" prop="endTime">
					<el-time-picker v-model="dataForm.endTime" placeholder="结束时间" value-format="HH:mm:ss" />

				</el-form-item>

				<el-form-item label="门店地址" prop="address">
					{{ dataForm.address }}
					<el-button type="primary" @click="showMapDialog()">选择详细地址</el-button>

				</el-form-item>

				<!-- <el-form-item
					label="经度"
					prop="longitude"
					>
					{{ dataForm.longitude }}
					</el-form-item>

					<el-form-item
					label="纬度"
					prop="latitude"
					>
					{{ dataForm.latitude }}
					</el-form-item> -->

				<el-form-item label="营业执照" prop="licenseUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadLicenseUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.licenseUrl" :src="common.seamingImgUrl(dataForm.licenseUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="法人身份证正面" prop="idcardProsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardProsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.idcardProsUrl" :src="common.seamingImgUrl(dataForm.idcardProsUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="法人身份证反面" prop="idcardConsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardConsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.idcardConsUrl" :src="common.seamingImgUrl(dataForm.idcardConsUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="是否支持余额充值" prop="enableBalance">
					<el-radio-group v-model="dataForm.enableBalance">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="余额兑换现金比例" prop="balanceRatio">
					1：
					<el-input v-model="dataForm.balanceRatio" :style="{ width: '50%' }" />
				</el-form-item>

				<el-form-item label="是否支持等级优惠" prop="enableLevel">
					<el-radio-group v-model="dataForm.enableLevel">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="是否支持代金券" prop="supportVoucher">
					<el-radio-group v-model="dataForm.supportVoucher">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="入驻说明" prop="explain">
					<el-input v-model="dataForm.explain" placeholder="请输入入驻说明" />
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
import TMap from '@/components/TMap/index.vue'
import { listBrand, createBrand, updateBrand, deleteBrand, listCatAndAdmin, listDtsStoreType } from '@/api/business/brand'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/login'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
	name: 'Brand',
	components: { Pagination, TMap },
	data() {
		return {
			typeOptions: [],
			uploadPath,
			list: undefined,
			total: 0,
			categoryList: [],
			adminList: [],
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				id: undefined,
				name: undefined,
				sort: 'add_time',
				order: 'desc'
			},

			bgUrlList: [],
			dataForm: {
				id: undefined,
				name: '',
				phone: '',
				desc: '',
				floorPrice: undefined,
				picUrl: undefined,
				bgUrl: [],
				categoryIds: [],
				defaultCategoryId: undefined,
				adminId: undefined,
				brandgenre: undefined,
				startTime: undefined,
				endTime: undefined,
				licenseUrl: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				explain: undefined,
				address: undefined,
				prefix: undefined,
				longitude: undefined,
				latitude: undefined,
				enableBalance: undefined,
				balanceRatio: undefined,
				enableLevel: undefined,
				supportVoucher: undefined,
				logoUrl: undefined
			},
			dialogFormVisible: false,
			shareUrlDialogVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建',
				shareUrl: '店铺推广码'
			},
			rules: {
				name: [
					{ required: true, message: '门店名称不能为空', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '门店固定电话不能为空', trigger: 'blur' }
				],
				brandgenre: [
					{ required: true, message: '门店类型不能为空', trigger: 'blur' }
				],
				licenseUrl: [
					{ required: true, message: '营业执照不能为空', trigger: 'blur' }
				],
				idcardProsUrl: [
					{ required: true, message: '法人身份证正面不能为空', trigger: 'blur' }
				],
				idcardConsUrl: [
					{ required: true, message: '法人身份证反面不能为空', trigger: 'blur' }
				],
				address: [
					{ required: true, message: '门店地址不能为空', trigger: 'blur' }
				]
			},
			downloadLoading: false,
			showMap: false,
			stadiumData: {
				latitude: '',
				longitude: '',
				addr: ''
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
		this.getRoles()
		// this.getList()
		// this.init()
	},
	mounted() {
		// var that = this
		// setTimeout(() => { that.showMap = false }, 3000)
	},
	methods: {
		showMapDialog() {
			this.showMap = true
		},
		confirmLocation(e) {
			console.log(e)
			this.stadiumData.latitude = e.lat
			this.stadiumData.longitude = e.lng
			this.stadiumData.addr = e.addr
			this.dataForm.latitude = this.stadiumData.latitude
			this.dataForm.longitude = this.stadiumData.longitude
			this.dataForm.address = this.stadiumData.addr
			console.log('dataForm', this.dataForm)
			this.showMap = false
		},
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					if (response.data.data.roles[0] === '超级管理员') {
						this.getList()
						this.init()
					} else {
						this.$router.push({ name: 'brandSetting' })
					}
				})
				.catch()
		},
		init() {
			listCatAndAdmin().then((response) => {
				this.categoryList = response.data.data.categoryList
				this.adminList = response.data.data.adminList
				// 获取门店类型
				this.getTypeOption()
			})
				.catch(() => {
				})
		},
		getTypeOption() {
			listDtsStoreType().then((response) => {
				this.typeOptions = response.data.data
			})
				.catch(() => {
					this.typeOptions = []
				})
		},
		getList() {
			this.listLoading = true
			listBrand(this.listQuery)
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
		resetForm() {
			this.dataForm = {
				id: undefined,
				name: '',
				desc: '',
				floorPrice: undefined,
				picUrl: undefined,
				bgUrl: [],
				categoryIds: [],
				defaultCategoryId: undefined,
				adminId: undefined,
				brandgenre: undefined,
				startTime: undefined,
				endTime: undefined,
				licenseUrl: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				explain: undefined,
				address: undefined,
				prefix: undefined,
				longitude: undefined,
				latitude: undefined,
				enableBalance: undefined,
				balanceRatio: undefined,
				enableLevel: undefined,
				supportVoucher: undefined,
				logoUrl: undefined
			}
		},
		uploadPicUrl(response) {
			this.dataForm.picUrl = response.data.url
		},
		uploadLogoUrl(response) {
			this.dataForm.logoUrl = response.data.url
		},
		uploadLicenseUrl(response) {
			this.dataForm.licenseUrl = response.data.url
		},
		uploadIdcardProsUrl(response) {
			this.dataForm.idcardProsUrl = response.data.url
		},
		uploadIdcardConsUrl(response) {
			this.dataForm.idcardConsUrl = response.data.url
		},
		handleCreate() {
			this.bgUrlList = []
			listCatAndAdmin().then((response) => {
				this.categoryList = response.data.data.categoryList
				this.adminList = response.data.data.adminList
			})
				.catch(() => {
				})
			this.resetForm()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		handleUpdate(row) {
			listCatAndAdmin(row.id).then((response) => {
				this.categoryList = response.data.data.categoryList
				this.adminList = response.data.data.adminList
			})
				.catch(() => {
				})
			this.dataForm = Object.assign({}, row, {
				bgUrl: row.bgUrl ? row.bgUrl.substring(1, row.bgUrl.length - 1).split(',')
					.map((section) => section.substring(1, section.length - 1)) : []
			})
			this.bgUrlList = JSON.parse(JSON.stringify(this.dataForm.bgUrl)).map((item) => ({ name: this.common.seamingImgUrl(item), url: this.common.seamingImgUrl(item) }))
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		// 时间格式转换
		// add0 (m) { return m < 10 ? '0' + m : m },
		// format (shijianchuo) {
		//   // shijianchuo是整数，否则要parseInt转换
		//   var time = new Date(shijianchuo) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		//   var h = time.getHours()
		//   var mm = time.getMinutes()
		//   var s = time.getSeconds()
		//   return this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
		// },
		createData() {
			// this.dataForm.prefix = this.xxx
			this.dataForm.latitude = this.stadiumData.latitude
			this.dataForm.longitude = this.stadiumData.longitude
			this.dataForm.address = this.stadiumData.addr
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					createBrand({ ...this.dataForm, bgUrl: JSON.stringify(this.dataForm.bgUrl) })
						.then((response) => {
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
				} else {
					this.$notify.error({
						title: '失败',
						message: '缺少必填信息'
					})
				}
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					updateBrand({ ...this.dataForm, bgUrl: JSON.stringify(this.dataForm.bgUrl) })
						.then(() => {
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
				} else {
					this.$notify.error({
						title: '失败',
						message: '缺少必填信息'
					})
				}
			})
		},
		handleDelete(row) {
			deleteBrand(row)
				.then((response) => {
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
		handleCategoryChange(value) {
			this.dataForm.defaultCategoryId = value[value.length - 1]
		},
		shareUrlDetail(row) {
			this.dataForm = Object.assign({}, row)
			this.dialogStatus = 'shareUrl'
			this.shareUrlDialogVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},

		handleRemoveBgUrl(file, fileList) {
			for (let i = 0; i < this.dataForm.bgUrl.length; i++) {
				// 这里存在两种情况
				// 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
				//    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
				// 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
				let url
				if (file.response === undefined) {
					url = file.url
				} else {
					url = file.response.data.url
				}
				if (this.common.seamingImgUrl(this.dataForm.bgUrl[i]) === url) {
					this.dataForm.bgUrl.splice(i, 1)
				}
			}
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = [
					'门店ID',
					'门店名称',
					'门店简介',
					'低价',
					'门店图片'
				]
				const filterVal = ['id', 'name', 'desc', 'floorPrice', 'picUrl']
				excel.export_json_to_excel2(
					tHeader,
					this.list,
					filterVal,
					'门店信息'
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
