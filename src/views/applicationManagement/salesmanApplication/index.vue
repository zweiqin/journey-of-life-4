<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<!-- <el-input
				v-model="listQuery.username"
				clearable
				size="mini"
				class="filter-item"
				style="width: 200px;"
				placeholder="请输入管理员名称"
				/>
				<el-button
				v-permission="['GET /admin/admin/list']"
				size="mini"
				class="filter-item"
				type="primary"
				icon="el-icon-search"
				@click="handleFilter"
				>查找</el-button> -->
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
		<el-table :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
			<el-table-column align="center" label="申请人ID" prop="userId" sortable />
			<el-table-column align="center" label="申请人" prop="nickname" sortable />
			<el-table-column align="center" label="申请表ID" prop="id" sortable />
			<el-table-column align="center" label="申请的系统账户名" prop="username">
				<template slot-scope="scope">
					{{
						scope.row.applicationType == 1
							? scope.row.username
							: scope.row.phone
					}}
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" label="申请类型" prop="applicationType">
				<template slot-scope="scope">
				<el-tag>
				{{
				scope.row.applicationType == 1
				? '普通业务员'
				: scope.row.applicationType == 2
				? '高级业务员'
				: '其他'
				}}
				</el-tag>
				</template>
				</el-table-column> -->
			<el-table-column align="center" label="申请时间" prop="createtime" />
			<!-- <el-table-column align="center" label="更新时间" prop="updatetime" /> -->
			<el-table-column align="center" label="状态" prop="status">
				<template slot-scope="scope">
					<el-tag>
						{{
							scope.row.status == 0
								? '待审核'
								: scope.row.status == 1
									? '审核中'
									: scope.row.status == -1
										? '未提交'
										: scope.row.status == -2
											? '用户主动撤销'
											: scope.row.status == -3
												? '已驳回'
												: scope.row.status == -4
													? '注册流程失败'
													: scope.row.status == 2
														? '已通过,等待付款'
														: scope.row.status == 3
															? '已通话，等待付款'
															: scope.row.status == 4
																? '已付款'
																: scope.row.status == 5
																	? '未创建账号'
																	: scope.row.status == 6
																		? '已创建账户'
																		: ''
						}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
				<template slot-scope="scope">
					<el-button
						v-if="scope.row.status == 0 ? true : false"
						v-permission="[ 'POST /admin/applicationManagement/update' ]" type="primary"
						@click="updateData(scope.row, startAudit, '开始审核')"
					>
						开始审核
					</el-button>
					<el-button
						v-if="scope.row.status == 1 ? true : false"
						v-permission="[ 'POST /admin/applicationManagement/update' ]" type="primary" size="mini"
						@click="checking(scope.row)"
					>
						查看
					</el-button>
					<el-button
						v-if="scope.row.status == 2 ? true : false" type="primary" size="mini"
						@click="updateData(scope.row, phonechecked, '已致电')"
					>
						已致电
					</el-button>
					<el-button
						v-if="scope.row.status == 1 ? true : false" type="success" size="mini"
						@click="updateData(scope.row, checked, '通过')"
					>
						通过
					</el-button>
					<el-button
						v-if="scope.row.status == 1 ? true : false"
						v-permission="[ 'POST /admin/applicationManagement/update' ]" type="danger" size="mini"
						@click="updateData(scope.row, rollback, '退回')"
					>
						退回
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>
		<el-dialog
			v-if="dialogFormitem != null" :title="dialogFormitem.nickname + '-申请表内容'" :visible.sync="dialogFormVisible"
			width="80%"
		>
			<el-descriptions :column="2" border>
				<el-descriptions-item label="申请人ID">
					{{ dialogFormitem.userId }}
				</el-descriptions-item>
				<el-descriptions-item label="申请人">
					{{ dialogFormitem.nickname }}
				</el-descriptions-item>
				<el-descriptions-item label="申请表类型">
					{{
						dialogFormitem.applicationType == 1
							? '普通业务员'
							: dialogFormitem.applicationType == 2
								? '高级业务员'
								: '其他'
					}}
				</el-descriptions-item>
				<el-descriptions-item label="申请时间">
					{{ dialogFormitem.createtime }}
				</el-descriptions-item>
				<el-descriptions-item label="申请表ID">
					{{ dialogFormitem.id }}
				</el-descriptions-item>
				<el-descriptions-item label="申请的系统账户名">
					{{
						dialogFormitem.applicationType == 1
							? dialogFormitem.username
							: dialogFormitem.phone
					}}
				</el-descriptions-item>
				<!-- <el-descriptions-item label="系统账户头像">
					<img v-if="dialogFormitem.avatar" :src="dialogFormitem.avatar" width="40" />
					</el-descriptions-item> -->
				<!-- 门店 -->
				<el-descriptions-item label="门店名">
					{{ dialogFormitem.brandname }}
				</el-descriptions-item>
				<el-descriptions-item label="门店类型">
					{{ dialogFormitem.brandgenre }}
				</el-descriptions-item>
				<el-descriptions-item label="门店地址">
					{{ dialogFormitem.address }}
				</el-descriptions-item>
				<el-descriptions-item label="开始营业时间">
					{{ dialogFormitem.startTime }}
				</el-descriptions-item>
				<el-descriptions-item label="结束营业时间">
					{{ dialogFormitem.endTime }}
				</el-descriptions-item>
				<el-descriptions-item label="门店简介">
					{{ dialogFormitem.desc }}
				</el-descriptions-item>
				<el-descriptions-item label="经度">
					{{ dialogFormitem.longitude }}
				</el-descriptions-item>
				<el-descriptions-item label="纬度">
					{{ dialogFormitem.latitude }}
				</el-descriptions-item>
				<el-descriptions-item label="门店logo">
					<el-image
						v-if="dialogFormitem.picUrl" :src="common.seamingImgUrl(dialogFormitem.picUrl)"
						style="width: 100px; height: 100px" fit="contain"
					/>
				</el-descriptions-item>
				<el-descriptions-item label="营业执照">
					<el-image
						v-if="dialogFormitem.licenseUrl" :src="common.seamingImgUrl(dialogFormitem.licenseUrl)"
						style="width: 100px; height: 100px" fit="contain"
					/>
				</el-descriptions-item>
				<el-descriptions-item label="法人身份证正面">
					<el-image
						v-if="dialogFormitem.brandIdcardProsUrl"
						:src="common.seamingImgUrl(dialogFormitem.brandIdcardProsUrl)" style="width: 100px; height: 100px"
						fit="contain"
					/>
				</el-descriptions-item>
				<el-descriptions-item label="法人身份证反面">
					<el-image
						v-if="dialogFormitem.brandIdcardConsUrl"
						:src="common.seamingImgUrl(dialogFormitem.brandIdcardConsUrl)" style="width: 100px; height: 100px"
						fit="contain"
					/>
				</el-descriptions-item>
				<el-descriptions-item label="食品生产许可证">
					<el-image
						v-if="dialogFormitem.productionLicense"
						:src="common.seamingImgUrl(dialogFormitem.productionLicense)" style="width: 100px; height: 100px"
						fit="contain"
					/>
				</el-descriptions-item>
				<el-descriptions-item label="食品经营许可证">
					<el-image
						v-if="dialogFormitem.healthPermit"
						:src="common.seamingImgUrl(dialogFormitem.healthPermit)" style="width: 100px; height: 100px"
						fit="contain"
					/>
				</el-descriptions-item>
				<!-- <el-descriptions-item label="入驻说明" v-if="dialogFormitem.applicationType == 1">
					{{ dialogFormitem.latitude }}
					</el-descriptions-item> -->
			</el-descriptions>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
				<el-button type="success" @click="updateData(dialogFormitem, checked, '通过')">通过</el-button>
				<el-button
					v-permission="[ 'POST /admin/applicationManagement/update' ]" type="danger"
					@click="updateData(dialogFormitem, rollback, '退回')"
				>
					退回
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	listGet,
	listedit
} from '@/api/applicationManagement/salesmanApplication'
import { roleOptions } from '@/api/business/role'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
	name: 'Admin',
	components: { Pagination },
	data() {
		return {
			// 驳回
			rollback: 2,
			// 开始审核 设置为审核中状态
			startAudit: 5,
			// 审核已通过,待付款状态
			checked: 6,
			// 已通话,待付款状态
			phonechecked: 7,
			// 已付款状态
			hadpaid: 8,
			// 未创建账户状态
			notaccount: 9,
			// 已创建账户状态状态
			hadaccount: 10,
			// 查看的当前信息
			dialogFormitem: null,
			uploadPath,
			list: null,
			total: 0,
			roleOptions: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				applicationType: 1,
				// status: 1,
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
			// dialogFormitem: null,
			dialogphoneFormVisible: false,
			radio: 6
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
		roleOptions().then((response) => {
			this.roleOptions = response.data
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
		getList() {
			this.listLoading = true
			console.log(this.listQuery)
			const queryInfo = {}
			const url =
				'/userup/pdlist?page=' +
				this.listQuery.page +
				'&applicationType=' +
				this.listQuery.applicationType
			listGet(url, queryInfo)
				.then((response) => {
					this.list = response.data.items
					this.total = response.data.total
					this.listLoading = false
				})
				.catch(() => {
					this.$message({
						showClose: true,
						message: '请求失败',
						type: 'error'
					})
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
			this.dialogFormitem = row
			this.dialogFormVisible = true
		},
		Pass() {
			this.dialogphoneFormVisible = true
		},
		updateData(row, status, operation) {
			// 退出电话弹窗
			this.dialogphoneFormVisible = false
			// 退出审核弹窗
			this.dialogFormVisible = false
			this.$confirm('确认要进行此操作[' + operation + row.nickname + '的申请表]？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// 审核申请表
				listedit({
					id: row.id,
					stateEnum: status
				}).then((response) => {
					this.$message({
						showClose: true,
						message: '操作成功',
						type: 'success'
					})
					this.getList()
				})
					.catch((response) => {
						this.$notify.error({
							title: '失败',
							message: response.data.errmsg
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
</style>
