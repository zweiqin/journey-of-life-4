<template>
	<div class="app-container">

		<el-card class="box-card">
			<h3>编辑门店信息</h3>
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="170px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="门店名称" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>
				<el-form-item label="主营类目">
					<el-cascader
						v-model="dataForm.categoryIds" :options="categoryList" expand-trigger="hover"
						@change="handleCategoryChange"
					/>
				</el-form-item>
				<el-form-item label="管理员">
					<el-select v-model="dataForm.adminId">
						<el-option v-for="item in adminList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item label="门店固定电话" prop="phone">
					<el-input v-model="dataForm.phone" />
				</el-form-item>

				<el-form-item label="介绍" prop="simpleDesc">
					<el-input v-model="dataForm.desc" />
				</el-form-item>
				<el-form-item label="门店图片" prop="picUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.picUrl" class="avatar" :src="common.seamingImgUrl(dataForm.picUrl)" style=""
							fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.picUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="最低消费价格" prop="floorPrice">
					<el-input v-model="dataForm.floorPrice" />
				</el-form-item>

				<el-form-item label="门店类型" prop="brandgenre">
					<div v-if="typeOptions && typeOptions.length">
						<el-cascader
							v-model="dataForm.brandgenre" :options="typeOptions"
							:props="{ checkStrictly: true, expandTrigger: 'hover', label: 'storeName', value: 'id', children: 'children' }"
							style="width: 250px;"
						/>
					</div>

				</el-form-item>

				<el-form-item label="开始营业时间" prop="startTime">
					<el-time-picker v-model="dataForm.startTime" placeholder="起始时间" value-format="HH:mm" />

				</el-form-item>

				<el-form-item label="结束营业时间" prop="endTime">
					<el-time-picker v-model="dataForm.endTime" placeholder="结束时间" value-format="HH:mm" />
				</el-form-item>

				<el-form-item label="门店地址" prop="address">
					<el-input v-model="dataForm.address" />
				</el-form-item>

				<el-form-item label="营业执照" prop="licenseUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadLicenseUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.licenseUrl" class="avatar" :src="common.seamingImgUrl(dataForm.licenseUrl)" style=""
							fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.licenseUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="法人身份证正面" prop="idcardProsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardProsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.idcardProsUrl" class="avatar" :src="common.seamingImgUrl(dataForm.idcardProsUrl)"
							style="" fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.idcardProsUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="法人身份证反面" prop="idcardConsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardConsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.idcardConsUrl" class="avatar" :src="common.seamingImgUrl(dataForm.idcardConsUrl)"
							style="" fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.idcardConsUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="食品生产许可证" prop="productionLicense">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false"
						:on-success="uploadProductionLicense" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.productionLicense" class="avatar"
							:src="common.seamingImgUrl(dataForm.productionLicense)" style="" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(dataForm.productionLicense) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="食品经营许可证" prop="healthPermit">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false"
						:on-success="uploadHealthPermit" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.healthPermit" class="avatar"
							:src="common.seamingImgUrl(dataForm.healthPermit)" style="" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(dataForm.healthPermit) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="入驻说明" prop="explain">
					<el-input v-model="dataForm.explain" />
				</el-form-item>

				<el-form-item label="是否支持门店余额充值" prop="enableBalance">
					<el-radio-group v-model="dataForm.enableBalance">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="充值比例" prop="balanceRatio">
					<el-input v-model="dataForm.balanceRatio" />
				</el-form-item>

				<el-form-item label="启用等级" prop="enableLevel">
					<el-radio-group v-model="dataForm.enableLevel">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>

			</el-form>
		</el-card>

		<div class="op-container">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleEdit">更新</el-button>
		</div>

	</div>
</template>

<script>
import { listBrand, listCatAndAdmin, listDtsStoreType, updateBrand } from '@/api/business/brand'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/login'
import XeUtils from 'xe-utils'

export default {
	name: 'BrandSetting',
	data() {
		return {
			typeOptions: [],
			uploadPath,
			categoryList: [],
			adminList: [],
			listQuery: {
				page: 1,
				limit: 20,
				id: undefined,
				name: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				brandgenre: undefined,
				name: '',
				phone: '',
				desc: '',
				picUrl: undefined,
				floorPrice: undefined,
				categoryIds: [],
				adminId: undefined,
				defaultCategoryId: 1,
				address: undefined,
				startTime: undefined,
				endTime: undefined,
				licenseUrl: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				productionLicense: undefined,
				healthPermit: undefined,
				explain: undefined,
				enableBalance: undefined,
				balanceRatio: undefined,
				enableLevel: undefined
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
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					// if (response.data.roles[0] === '超级管理员') {
					// 	this.$router.push({ name: 'brandInfo' })
					// } else {
					// this.getList()
					this.init()
					// }
				})
				.catch()
		},
		init() {
			listCatAndAdmin().then((response) => {
				this.categoryList = response.data.categoryList
				this.adminList = response.data.adminList
				// 获取门店类型
				this.getTypeOption()
			})
		},
		getList() {
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
			listBrand(this.listQuery)
				.then((response) => {
					this.dataForm = response.data.items[0]
					const currentItem = XeUtils.findTree(this.typeOptions, (item) => item.id === this.dataForm.brandgenre)
					if (currentItem && Array.isArray(currentItem.nodes)) {
						this.dataForm.brandgenre = currentItem.nodes.map((v) => v.id)
					}
				})
				.catch(() => {
				})
		},
		getTypeOption() {
			listDtsStoreType().then((response) => {
				XeUtils.eachTree(response.data, (item) => {
					if (Array.isArray(item.children) && item.children.length === 0) {
						item.children = undefined
					}
				})
				this.typeOptions = response.data
				this.getList()
			})
				.catch(() => {
					this.typeOptions = []
				})
		},
		handleCancel() {
			this.getList()
		},
		handleEdit() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					updateBrand({ ...this.dataForm, brandgenre: Array.isArray(this.dataForm.brandgenre) && this.dataForm.brandgenre.length ? this.dataForm.brandgenre[this.dataForm.brandgenre.length - 1] : this.dataForm.brandgenre })
						.then(() => {
							this.getList()
							this.$notify.success({
								title: '成功',
								message: '更新成功'
							})
						})
						.catch((response) => {
							this.getList()
							this.$notify.error({
								title: '失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},
		handleCategoryChange(value) {
			if (value) {
				this.dataForm.defaultCategoryId = value[value.length - 1]
			}
		},
		uploadPicUrl(response) {
			this.dataForm.picUrl = response.data.url
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
		uploadProductionLicense(response) {
			this.dataForm.productionLicense = response.data.url
		},
		uploadHealthPermit(response) {
			this.dataForm.healthPermit = response.data.url
		},
		resetForm() {
			this.dataForm = {
				id: undefined,
				brandgenre: undefined,
				name: '',
				phone: '',
				desc: '',
				picUrl: undefined,
				floorPrice: undefined,
				categoryIds: [],
				adminId: undefined,
				defaultCategoryId: 1,
				address: undefined,
				startTime: undefined,
				endTime: undefined,
				licenseUrl: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				productionLicense: undefined,
				healthPermit: undefined,
				explain: undefined,
				enableBalance: undefined,
				balanceRatio: undefined,
				enableLevel: undefined
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.el-card {
	margin-bottom: 10px;
}

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
