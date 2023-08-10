<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="filter-container" style="display: flex; align-items: center">
			<el-input
				v-model="listqueryInfo.userId" clearable size="mini" class="filter-item"
				style="width: 200px; margin-right: 10px; margin-bottom: 0px" placeholder="请输入完整的申请人Id"
			/>
			<el-button
				size="mini" class="filter-item" type="primary" icon="el-icon-search"
				style="margin-bottom: 0px"
				@click="handleFilter"
			>
				查找
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
			:data="list" size="small" element-loading-text="正在查询中。。。" border
			fit highlight-current-row
			@expand-change="expandchange"
		>
			<el-table-column type="expand">
				<template slot-scope="scope">
					<el-descriptions v-if="scope.row.userUpgradeInfo != ''" :column="2" title="申请表" border>
						<el-descriptions-item label="申请人ID">
							{{ scope.row.userId }}
						</el-descriptions-item>
						<el-descriptions-item label="申请人">
							{{ scope.row.nickname }}
						</el-descriptions-item>
						<el-descriptions-item label="申请表类型">
							{{
								scope.row.userUpgradeInfo.applicationType == 1
									? '门店'
									: scope.row.userUpgradeInfo.applicationType == 2
										? '营销'
										: '其他'
							}}
						</el-descriptions-item>
						<el-descriptions-item label="申请时间">
							{{ scope.row.userUpgradeInfo.createtime }}
						</el-descriptions-item>
						<el-descriptions-item label="申请表ID">
							{{ scope.row.id }}
						</el-descriptions-item>
						<el-descriptions-item label="申请的系统账户名">
							{{
								scope.row.userUpgradeInfo.applicationType == 1
									? scope.row.userUpgradeInfo.username
									: scope.row.userUpgradeInfo.phone
							}}
						</el-descriptions-item>
						<!-- <el-descriptions-item label="系统账户头像">
							<img v-if="scope.row.avatar" :src="scope.row.avatar" width="40" />
							</el-descriptions-item> -->
						<!-- 门店 -->
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="门店名">
							{{ scope.row.userUpgradeInfo.brandname }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="门店类型">
							{{ scope.row.userUpgradeInfo.brandgenreval }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="门店地址">
							{{ scope.row.userUpgradeInfo.address }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="开始营业时间">
							{{ scope.row.userUpgradeInfo.startTime }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="结束营业时间">
							{{ scope.row.userUpgradeInfo.endTime }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="门店简介">
							{{ scope.row.userUpgradeInfo.desc }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="经度">
							{{ scope.row.userUpgradeInfo.longitude }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="纬度">
							{{ scope.row.userUpgradeInfo.latitude }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="门店logo">
							<el-image
								v-if="scope.row.userUpgradeInfo.picUrl"
								:src="common.seamingImgUrl(scope.row.userUpgradeInfo.picUrl)" style="width: 100px; height: 100px"
								fit="contain"
							/>
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="营业执照">
							<el-image
								v-if="scope.row.userUpgradeInfo.licenseUrl"
								:src="common.seamingImgUrl(scope.row.userUpgradeInfo.licenseUrl)" style="width: 100px; height: 100px"
								fit="contain"
							/>
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="法人身份证正面">
							<el-image
								v-if="scope.row.userUpgradeInfo.brandIdcardProsUrl"
								:src="common.seamingImgUrl(scope.row.userUpgradeInfo.brandIdcardProsUrl)"
								style="width: 100px; height: 100px" fit="contain"
							/>
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 1" label="法人身份证反面">
							<el-image
								v-if="scope.row.userUpgradeInfo.brandIdcardConsUrl"
								:src="common.seamingImgUrl(scope.row.userUpgradeInfo.brandIdcardConsUrl)"
								style="width: 100px; height: 100px" fit="contain"
							/>
						</el-descriptions-item>
						<!-- <el-descriptions-item label="入驻说明" v-if="scope.row.applicationType == 1">
							{{ scope.row.latitude }}
							</el-descriptions-item> -->

						<!-- 业务员信息 -->
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="姓名">
							{{ scope.row.userUpgradeInfo.salesmanname }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="性别">
							{{ scope.row.userUpgradeInfo.gender }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="联系电话">
							{{ scope.row.userUpgradeInfo.salesmanPhone }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="微信号">
							{{ scope.row.userUpgradeInfo.wechat }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="邮箱">
							{{ scope.row.email }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="生日">
							{{ scope.row.userUpgradeInfo.birthday }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="身份证正面">
							<el-image
								v-if="scope.row.userUpgradeInfo.idcardProsUrl"
								:src="common.seamingImgUrl(scope.row.userUpgradeInfo.idcardProsUrl)"
								style="width: 100px; height: 100px" fit="contain"
							/>
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.userUpgradeInfo.applicationType == 2" label="身份证反面">
							<el-image
								v-if="scope.row.userUpgradeInfo.idcardConsUrl"
								:src="common.seamingImgUrl(scope.row.userUpgradeInfo.idcardConsUrl)"
								style="width: 100px; height: 100px" fit="contain"
							/>
						</el-descriptions-item>
					</el-descriptions>
					<el-descriptions v-if="scope.row.upgradeOrder != ''" :column="2" title="支付订单" border>
						<el-descriptions-item label="订单编号">
							{{ scope.row.orderId }}
						</el-descriptions-item>
						<el-descriptions-item label="交易状态">
							{{
								scope.row.upgradeOrder.payStatus == 0
									? '未付款'
									: scope.row.upgradeOrder.payStatus == 1
										? '取消'
										: scope.row.upgradeOrder.payStatus == 2
											? '已付款'
											: '其他'
							}}
						</el-descriptions-item>
						<el-descriptions-item label="微信支付编号">
							{{ scope.row.upgradeOrder.payId }}
						</el-descriptions-item>
						<el-descriptions-item label="升级备注">
							{{ scope.row.upgradeOrder.name }}
						</el-descriptions-item>
						<el-descriptions-item label="实际付款">
							{{ scope.row.upgradeOrder.orderGrade }}元
						</el-descriptions-item>
						<el-descriptions-item label="创建时间">
							{{ scope.row.upgradeOrder.updateTime }}
						</el-descriptions-item>
					</el-descriptions>
				</template>
			</el-table-column>
			<el-table-column align="center" label="申请人ID" prop="userId" sortable width="100" />
			<!-- <el-table-column align="center" label="申请人" prop="nickname" sortable /> -->
			<el-table-column align="center" label="升级表ID" prop="id" sortable width="100" />
			<el-table-column align="center" label="原等级" prop="oldGradename" />
			<el-table-column align="center" label="新等级" prop="newGradename" />
			<!-- <el-table-column align="center" label="申请时间" prop="createtime" /> -->
			<el-table-column align="center" label="更新时间" prop="updateTime" />
			<el-table-column align="center" label="状态" prop="status">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.status == 0 ? '' : scope.row.status == 1 ? 'success' : scope.row.status == -1 ? 'warning' : scope.row.status == 2 ? 'Danger' : 'info'"
					>
						{{
							scope.row.status == 0
								? '审核中'
								: scope.row.status == 1
									? '升级成功'
									: scope.row.status == -1
										? '失败'
										: scope.row.status == 2
											? '升级异常'
											: ''
						}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<!-- 审核内容对话框 -->
					<el-button
						v-if="scope.row.status != 1 && scope.row.newGrade == 4"
						v-permission="[ 'POST /admin/applicationManagement/update' ]" type="primary" size="mini"
						@click="upgrade(scope.row)"
					>
						升级
					</el-button>
					<el-button
						v-if="
							(scope.row.status != 1 && scope.row.status != -1) &&
								(scope.row.newGrade == 1 || scope.row.newGrade == 2)
						" v-permission="[ 'POST /admin/applicationManagement/update' ]" type="primary" size="mini"
						@click="sign(scope.row)"
					>
						注册
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>
	</div>
</template>

<script>
import { listGet, signin, vipUp } from '@/api/applicationManagement/uphistory'
import { listDtsStoreType } from '@/api/business/brand'
import { roleOptions } from '@/api/business/role'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import XeUtils from 'xe-utils'

export default {
	name: 'UpHistory',
	components: { Pagination },
	data() {
		return {
			// 开始审核
			startAudit: 4,
			// 审核完成
			checked: 6,
			// 驳回
			rollback: 2,
			// 查看的当前信息
			checkInfo: null,
			uploadPath,
			list: null,
			total: 0,
			roleOptions: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				status: [],
				// username: undefined,
				sort: 'CreateTime',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				username: undefined,
				password: undefined,
				avatar: undefined,
				roleIds: []
			},
			salesmanDataForm: {
				id: undefined,
				name: undefined,
				phone: undefined,
				wechat: undefined,
				salemanstateid: undefined,
				operatorid: undefined,
				operatorname: undefined,
				updatatime: undefined,
				royalties: undefined,
				adminId: undefined
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				username: [
					{ required: true, message: '管理员账号不能为空', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			},
			downloadLoading: false,
			listqueryInfo: {
				userId: '',
				status: [],
				applicationType: 0
			},
			applicationTypeoptions: [
				// 类型options
				{
					value: 0,
					label: '全部类型'
				},
				{
					value: 1,
					label: '门店'
				},
				{
					value: 2,
					label: '营销策划师'
				}
			],
			TypeOptions: []
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
		listDtsStoreType()
			.then((response) => {
				console.log(response)
				this.TypeOptions = response.data // .items
				this.getList()
			})
			.catch((error) => {
				this.$message({
					showClose: true,
					message: error,
					type: 'error'
				})
			})

		roleOptions()
			.then((response) => {
				this.roleOptions = response.data
			})
			.catch((error) => {
				this.$message({
					showClose: true,
					message: error,
					type: 'error'
				})
			})
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

		/**
		 * 获取升级审核表
		 */

		getList() {
			this.listLoading = true
			const queryInfo = {}
			if (this.listqueryInfo.userId !== '') {
				var str = /^[0-9]*$/
				if (str.test(this.listqueryInfo.userId)) {
					queryInfo.userId = parseInt(this.listqueryInfo.userId)
				} else {
					this.$message({
						showClose: true,
						message: '请输入正确的申请人ID(只能包含数字)',
						type: 'error'
					})
				}
			}
			if (this.listqueryInfo.applicationType !== 0) {
				queryInfo.newGrade = this.listqueryInfo.applicationType
			}
			listGet(queryInfo, this.listQuery.page)
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

		/**
		 * 点击查询查询
		 */

		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		resetForm() {
			this.dataForm = {
				id: undefined,
				username: undefined,
				password: undefined,
				avatar: undefined,
				roleIds: []
			}
			this.salesmanDataForm = {
				id: undefined,
				name: undefined,
				phone: undefined,
				wechat: undefined,
				salemanstateid: undefined,
				operatorid: undefined,
				operatorname: undefined,
				updatatime: undefined,
				royalties: undefined,
				adminId: undefined
			}
		},
		uploadAvatar(response) {
			this.dataForm.avatar = response.data.url
		},
		checking(row) {
			this.dialogFormVisible = true
			this.scope.row = row
			this.checkInfo = row
		},
		expandchange(item) {
			// const StoreType = this.listStoreType.find((p) => p.id === item.userUpgradeInfo.brandgenre)
			// item.userUpgradeInfo.brandgenreval = StoreType === undefined ? '' : StoreType.storeName
			const storeTypeItem = XeUtils.findTree(this.TypeOptions, (i) => i.id === item.userUpgradeInfo.brandgenre)
			item.userUpgradeInfo.brandgenreval = storeTypeItem !== undefined && Array.isArray(storeTypeItem.nodes) ? storeTypeItem.nodes.map((i) => i.storeName).join('/') : '--'
		},
		sign(row) {
			this.$confirm('进行注册业务员, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// 注册业务员
				const data = {
					userId: row.userId,
					id: row.ticketsId
				}
				signin(data)// ticketsId 申请表ID
					.then((response) => {
						this.$message({
							type: 'success',
							message: '注册成功!'
						})
						this.getList()
					})
					.catch((response) => {
						console.log(response)
						this.$notify.error({
							title: '注册失败',
							message: response.data.errmsg
						})
					})
				vipUp({ userId: row.userId }).then(() => {

				})
					.catch(() => {

					})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					})
				})
		},
		upgrade(row) {
			this.$confirm('进行注册vip会员, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				vipUp({ userId: row.userId }).then(() => {
					this.$message({
						type: 'success',
						message: '注册成功!'
					})
				})
					.catch(() => {
						this.$message({
							type: 'error',
							message: '注册失败'
						})
					})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					})
				})
		}
	}
}
</script>

<style scoped>
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

.app-container>>>.el-descriptions__header {
	margin: 10px;
}
</style>
