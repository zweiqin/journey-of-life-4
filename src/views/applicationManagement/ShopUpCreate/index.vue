<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.id" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入编号"
			/>
			<el-input
				v-model="listQuery.nickname" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入昵称"
			/>
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" label="编号" prop="id" width="80px" sortable />

			<el-table-column align="center" label="性别" width="80px" prop="gender">
				<template slot-scope="scope">
					{{ genderDic[scope.row.gender] }}
				</template>
			</el-table-column>

			<el-table-column align="center" label="用户层级" width="100px" prop="userLevel">
				<template slot-scope="scope">
					{{ memberLevel[scope.row.userLevel] }}
				</template>
			</el-table-column>

			<el-table-column align="center" label="当前升级状态" prop="upStatus" />

			<el-table-column align="center" label="昵称" prop="nickname" />

			<el-table-column align="center" label="电话" prop="mobile" />

			<el-table-column align="center" label="会员头像" prop="avatar">
				<template slot-scope="scope">
					<img v-if="scope.row.avatar" :src="scope.row.avatar" width="40">
				</template>
			</el-table-column>

			<el-table-column align="center" label="微信登录openid" prop="weixinOpenid" />

			<el-table-column align="center" label="操作" min-width="160px" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" @click="storeHandleUpdate(scope.row)">门店提交</el-button>
					<el-button type="danger" @click="marketHandleUpdate(scope.row)">营销提交</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 门店提交对话框 -->
		<el-dialog :visible.sync="storeDialogFormVisible" title="门店端提交申请">
			<el-form
				ref="storeDataForm" :rules="storeRules" :model="storeDataForm" status-icon
				label-position="left"
				label-width="140px" style="width: 400px; margin-left:50px;"
			>

				<!-- <el-form-item
					label="工单编号"
					prop="id"
					>
					{{ storeDataForm.id }}
					</el-form-item> -->
				<el-form-item label="申请的用户层级" prop="applicationType">
					{{ storeDataForm.applicationType }}
				</el-form-item>
				<el-form-item label="申请的会员id" prop="userId">
					{{ storeDataForm.userId }}
				</el-form-item>
				<el-form-item label="申请的系统账户名" prop="username">
					<el-input v-model="storeDataForm.username" />
				</el-form-item>
				<el-form-item label="系统账户密码" prop="password">
					<el-input v-model="storeDataForm.password" type="password" auto-complete="new-password" />
				</el-form-item>
				<el-form-item label="账户头像" prop="avatar">
					<el-upload
						:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadAvatarUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="storeDataForm.avatar" :src="common.seamingImgUrl(storeDataForm.avatar)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="门店名称" prop="brandname">
					<el-input v-model="storeDataForm.brandname" />
				</el-form-item>
				<el-form-item label="门店类型" prop="brandgenre">
					<el-cascader
						v-model="!storeDataForm.brandgenreArr ? storeDataForm.brandgenre : storeDataForm.brandgenreArr"
						:options="TypeOptions"
						:props="{ checkStrictly: true, lazy: 'true', lazyLoad: (node, resolve) => resolve({ value: node.data.id, label: node.data.storeName, leaf: !node.data.children || node.data.children.length === 0 }), expandTrigger: 'hover', label: 'storeName', value: 'id', children: 'children' }"
						style="width: 250px;"
						@change="(value) => ((storeDataForm.brandgenre = value[value.length - 1]) && (storeDataForm.brandgenreArr = value))"
					/>
				</el-form-item>
				<el-form-item label="门店联系电话" prop="brandPhone">
					<el-input v-model="storeDataForm.brandPhone" />
				</el-form-item>
				<el-form-item label="门店地址" prop="address">
					<el-input v-model="storeDataForm.address" />
				</el-form-item>
				<el-form-item label="开始营业时间" prop="startTime">
					<el-time-picker v-model="storeDataForm.startTime" value-format="HH:mm:ss" placeholder="营业开始时间" />
				</el-form-item>
				<el-form-item label="结束营业时间" prop="endTime">
					<el-time-picker v-model="storeDataForm.endTime" value-format="HH:mm:ss" placeholder="营业结束时间" />
				</el-form-item>
				<el-form-item label="门店logo" prop="picUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="storeDataForm.picUrl" :src="common.seamingImgUrl(storeDataForm.picUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="门店描述" prop="desc">
					<el-input v-model="storeDataForm.desc" />
				</el-form-item>
				<el-form-item label="营业执照" prop="licenseUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadLicenseUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="storeDataForm.licenseUrl" :src="common.seamingImgUrl(storeDataForm.licenseUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="法人身份证正面" prop="brandIdcardProsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false"
						:on-success="uploadBrandIdcardProsUrl" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="storeDataForm.brandIdcardProsUrl" :src="common.seamingImgUrl(storeDataForm.brandIdcardProsUrl)"
							class="avatar"
						>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="法人身份证反面" prop="brandIdcardConsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false"
						:on-success="uploadBrandIdcardConsUrl" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="storeDataForm.brandIdcardConsUrl" :src="common.seamingImgUrl(storeDataForm.brandIdcardConsUrl)"
							class="avatar"
						>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="入驻描述" prop="explain">
					<el-input v-model="storeDataForm.explain" />
				</el-form-item>
				<el-form-item label="业务员名称" prop="salesmanname">
					<el-input v-model="storeDataForm.salesmanname" />
				</el-form-item>
				<el-form-item label="性别" prop="gender">
					<el-radio-group v-model="storeDataForm.gender">
						<el-radio :label="0">未知</el-radio>
						<el-radio :label="1">男</el-radio>
						<el-radio :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="业务员联系电话" prop="salesmanPhone">
					<el-input v-model="storeDataForm.salesmanPhone" />
				</el-form-item>
				<el-form-item label="微信号" prop="wechat">
					<el-input v-model="storeDataForm.wechat" />
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="storeDataForm.email" />
				</el-form-item>
				<el-form-item label="生日" prop="birthday">
					<el-date-picker v-model="storeDataForm.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="storeDialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="storeSaveData">保存</el-button>
				<el-button type="danger" @click="storeUpdateData">提交</el-button>
			</div>
		</el-dialog>

		<!-- 营销提交对话框 -->
		<el-dialog :visible.sync="marketDialogFormVisible" title="营销端提交申请">
			<el-form
				ref="marketDataForm" :rules="marketRules" :model="marketDataForm" status-icon
				label-position="left"
				label-width="140px" style="width: 400px; margin-left:50px;"
			>

				<!-- <el-form-item
					label="工单编号"
					prop="id"
					>
					{{ marketDataForm.id }}
					</el-form-item> -->
				<el-form-item label="申请的用户层级" prop="applicationType">
					{{ marketDataForm.applicationType }}
				</el-form-item>
				<el-form-item label="申请的会员id" prop="userId">
					{{ marketDataForm.userId }}
				</el-form-item>
				<el-form-item label="业务员名" prop="salesmanname">
					<el-input v-model="marketDataForm.salesmanname" />
				</el-form-item>
				<el-form-item label="性别" prop="gender">
					<el-radio-group v-model="marketDataForm.gender">
						<el-radio :label="0">未知</el-radio>
						<el-radio :label="1">男</el-radio>
						<el-radio :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="业务员号码" prop="salesmanPhone">
					<el-input v-model="marketDataForm.salesmanPhone" />
				</el-form-item>
				<el-form-item label="业务员所属地区" prop="areaname">
					<el-cascader v-model="selectedAreaOptions" :options="areaOptions" size="large" @change="handleChange" />
				</el-form-item>
				<el-form-item label="微信号" prop="wechat">
					<el-input v-model="marketDataForm.wechat" />
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="marketDataForm.email" />
				</el-form-item>
				<el-form-item label="生日" prop="birthday">
					<el-date-picker v-model="marketDataForm.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
				</el-form-item>
				<el-form-item label="业务员住址" prop="salesmanAddress">
					<el-input v-model="marketDataForm.salesmanAddress" />
				</el-form-item>
				<el-form-item label="身份证正面" prop="idcardProsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardProsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="marketDataForm.idcardProsUrl" :src="common.seamingImgUrl(marketDataForm.idcardProsUrl)"
							class="avatar"
						>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="身份证反面" prop="idcardConsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardConsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="marketDataForm.idcardConsUrl" :src="common.seamingImgUrl(marketDataForm.idcardConsUrl)"
							class="avatar"
						>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="marketDataForm.phone" />
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="marketDialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="marketSaveData">保存</el-button>
				<el-button type="danger" @click="marketUpdateData">提交</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { memberListGet, listAdd, InfoGet } from '@/api/applicationManagement/shopUpCreate'
import { listDtsStoreType } from '@/api/business/brand'
import { listGet } from '@/api/configurationTable/userLevel'
import { uploadPath } from '@/api/business/storage'
import { regionData, CodeToText } from 'element-china-area-data'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
	name: 'ShopUpCreate',
	components: { Pagination },
	data() {
		return {
			uploadPath,
			list: null,
			total: 0,
			roleOptions: null,
			listLoading: false,
			listQuery: {
				page: 1,
				limit: 20,
				nickname: undefined,
				mobile: undefined,
				id: undefined,
				userLevel: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			storeDataForm: {
				id: undefined,
				username: undefined,
				password: undefined,
				avatar: undefined,
				brandname: undefined,
				brandgenre: undefined,
				brandPhone: undefined,
				address: undefined,
				startTime: undefined,
				endTime: undefined,
				picUrl: undefined,
				desc: undefined,
				longitude: undefined,
				latitude: undefined,
				licenseUrl: undefined,
				brandIdcardProsUrl: undefined,
				brandIdcardConsUrl: undefined,
				explain: undefined,
				salesmanname: undefined,
				gender: undefined,
				salesmanPhone: undefined,
				wechat: undefined,
				email: undefined,
				birthday: undefined,
				applicationType: undefined,
				userId: undefined
			},
			marketDataForm: {
				id: undefined,
				salesmanname: undefined,
				gender: undefined,
				salesmanPhone: undefined,
				areaname: undefined,
				wechat: undefined,
				email: undefined,
				birthday: undefined,
				salesmanAddress: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				applicationType: undefined,
				userId: undefined,
				phone: undefined
			},
			storeDialogFormVisible: false,
			marketDialogFormVisible: false,
			genderDic: ['未知', '男', '女'],
			TypeOptions: [],
			selectedAreaOptions: [],
			memberLevel: {}, // 会员等级列表
			areaOptions: regionData,
			storeRules: {
				username: [ { required: true, message: '申请的系统账号名称不能为空', trigger: 'blur' } ],
				password: [ { required: true, message: '密码不能为空', trigger: 'blur' } ],
				brandname: [ { required: true, message: '门店名称不能为空', trigger: 'blur' } ],
				brandgenre: [ { required: true, message: '门店类型不能为空', trigger: 'blur' } ],
				brandPhone: [ { required: true, message: '门店联系电话不能为空', trigger: 'blur' } ],
				address: [ { required: true, message: '门店地址不能为空', trigger: 'blur' } ],
				startTime: [ { required: true, message: '开始营业时间不能为空', trigger: 'blur' } ],
				endTime: [ { required: true, message: '结束营业时间不能为空', trigger: 'blur' } ],
				picUrl: [ { required: true, message: '门店logo不能为空', trigger: 'blur' } ],
				desc: [ { required: true, message: '门店描述不能为空', trigger: 'blur' } ],
				licenseUrl: [ { required: false, message: '营业执照不能为空', trigger: 'blur' } ],
				brandIdcardProsUrl: [ { required: false, message: '法人身份证正面不能为空', trigger: 'blur' } ],
				brandIdcardConsUrl: [ { required: false, message: '法人身份证反面不能为空', trigger: 'blur' } ]
			},
			marketRules: {
				salesmanPhone: [ { required: true, message: '业务员号码不能为空', trigger: 'blur' } ],
				areaname: [ { required: true, message: '业务员所属地区不能为空', trigger: 'blur' } ],
				idcardProsUrl: [ { required: true, message: '身份证正面不能为空', trigger: 'blur' } ],
				idcardConsUrl: [ { required: true, message: '身份证反面不能为空', trigger: 'blur' } ],
				phone: [ { required: true, message: '电话不能为空', trigger: 'blur' } ]
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
		this.getMemberLevelList()
		this.getStoreTypeList()
	},
	methods: {
		getMemberLevelList() {
			listGet()
				.then((response) => {
					for (let i = 0; i < response.data.data.items.length; i++) {
						this.$set(this.memberLevel, response.data.data.items[i].id, response.data.data.items[i].name)
					}
					this.getList()
				})
				.catch(() => {
					this.memberLevel = {}
				})
		},
		getList() {
			this.listLoading = true
			memberListGet(this.listQuery)
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
		getStoreTypeList() {
			listDtsStoreType()
				.then((response) => {
					this.TypeOptions = response.data.data
				})
				.catch((error) => {
					this.$message({
						showClose: true,
						message: error,
						type: 'error'
					})
				})
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		storeHandleUpdate(row) {
			this.resetStoreForm()
			// this.storeDataForm = Object.assign(this.storeDataForm, row)
			this.storeDataForm.userId = row.id
			this.storeDataForm.applicationType = 1
			InfoGet({ userId: row.id, applicationType: 1 })
				.then((response) => {
					if (response.data.data) {
						this.storeDataForm = Object.assign({}, response.data.data)
					}
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
			this.storeDialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.storeDataForm.clearValidate()
			})
		},
		marketHandleUpdate(row) {
			this.resetMarketForm()
			// this.marketDataForm = Object.assign(this.marketDataForm, row)
			this.marketDataForm.userId = row.id
			this.marketDataForm.applicationType = 2
			InfoGet({ userId: row.id, applicationType: 2 })
				.then((response) => {
					if (response.data.data) {
						this.marketDataForm = Object.assign({}, response.data.data)
					}
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
			this.marketDialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.marketDataForm.clearValidate()
			})
		},
		storeSaveData() {
			listAdd(false, this.storeDataForm)
				.then(() => {
					this.storeDialogFormVisible = false
					this.$notify.success({
						title: '成功',
						message: '保存申请信息成功'
					})
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},
		storeUpdateData() {
			this.$refs.storeDataForm.validate((valid) => {
				if (valid) {
					listAdd(true, this.storeDataForm)
						.then(() => {
							this.storeDialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '提交申请信息成功'
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
		marketSaveData() {
			listAdd(false, this.marketDataForm)
				.then(() => {
					this.marketDialogFormVisible = false
					this.$notify.success({
						title: '成功',
						message: '保存申请信息成功'
					})
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},
		marketUpdateData() {
			this.$refs.marketDataForm.validate((valid) => {
				if (valid) {
					listAdd(true, this.marketDataForm)
						.then(() => {
							this.marketDialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '提交申请信息成功'
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
		resetStoreForm() {
			this.storeDataForm = {
				id: undefined,
				username: undefined,
				password: undefined,
				avatar: undefined,
				brandname: undefined,
				brandgenre: undefined,
				brandPhone: undefined,
				address: undefined,
				startTime: undefined,
				endTime: undefined,
				picUrl: undefined,
				desc: undefined,
				longitude: undefined,
				latitude: undefined,
				licenseUrl: undefined,
				brandIdcardProsUrl: undefined,
				brandIdcardConsUrl: undefined,
				explain: undefined,
				salesmanname: undefined,
				gender: undefined,
				salesmanPhone: undefined,
				wechat: undefined,
				email: undefined,
				birthday: undefined,
				applicationType: undefined,
				userId: undefined
			}
		},
		resetMarketForm() {
			this.marketDataForm = {
				id: undefined,
				salesmanname: undefined,
				gender: undefined,
				salesmanPhone: undefined,
				areaname: undefined,
				wechat: undefined,
				email: undefined,
				birthday: undefined,
				salesmanAddress: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				applicationType: undefined,
				userId: undefined,
				phone: undefined
			}
		},
		uploadAvatarUrl(response) {
			this.storeDataForm.avatar = response.data.url
		},
		uploadPicUrl(response) {
			this.storeDataForm.picUrl = response.data.url
		},
		uploadLicenseUrl(response) {
			this.storeDataForm.licenseUrl = response.data.url
		},
		uploadBrandIdcardProsUrl(response) {
			this.storeDataForm.brandIdcardProsUrl = response.data.url
		},
		uploadBrandIdcardConsUrl(response) {
			this.storeDataForm.brandIdcardConsUrl = response.data.url
		},
		uploadIdcardProsUrl(response) {
			this.marketDataForm.idcardProsUrl = response.data.url
		},
		uploadIdcardConsUrl(response) {
			this.marketDataForm.idcardConsUrl = response.data.url
		},
		handleChange(value) {
			this.getCodeToText(null, value)
		},
		getCodeToText(codeStr, codeArray) {
			if (codeStr === null && codeArray === null) {
				return null
			} else if (codeArray === null) {
				codeArray = codeStr.split(',')
			}
			let area = ''
			switch (codeArray.length) {
				case 1:
					area += CodeToText[codeArray[0]]
					break
				case 2:
					area += CodeToText[codeArray[0]] + '/' + CodeToText[codeArray[1]]
					break
				case 3:
					area +=
						CodeToText[codeArray[0]] +
						'/' +
						CodeToText[codeArray[1]] +
						'/' +
						CodeToText[codeArray[2]]
					break
				default:
					break
			}
			this.marketDataForm.areaname = area
			return area
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
