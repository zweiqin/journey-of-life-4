<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.oilcardno" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入用户油卡编号"
			/>
			<el-button
				v-permission="[ 'GET /admin/tuanyou/queryyoukalist' ]" size="mini" class="filter-item" type="primary"
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
		</div>

		<div class="other-container">
			<el-descriptions class="margin-top" title="余额信息" :column="3" size="medium" :content-style="{ 'color': 'red' }">
				<el-descriptions-item label="账户余额（充值+赠送）">{{ accountAmount.accountBalance }}</el-descriptions-item>
				<el-descriptions-item label="充值账户余额">{{ accountAmount.companyDepositBalance }}</el-descriptions-item>
				<el-descriptions-item label="赠送账户余额">{{ accountAmount.companyGivenBalance }}</el-descriptions-item>
			</el-descriptions>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit fixed="right"
			highlight-current-row
		>
			<el-table-column align="center" width="100px" label="ID" prop="id" sortable />
			<el-table-column align="center" min-width="200px" label="用户ID" prop="userid" />
			<el-table-column align="left" min-width="200px" label="油卡手机号" prop="phone" />
			<el-table-column align="left" min-width="200px" label="油卡编号" prop="oilcardno" />
			<el-table-column align="left" min-width="200px" label="创建时间" prop="cet_time" />

			<el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/tuanyou/changeoilcardamount' ]" type="primary" size="mini"
						@click="handleRecharge(scope.row.oilcardno)"
					>
						充值
					</el-button>
					<el-button
						v-permission="[ 'POST /admin/tuanyou/changeoilcardamount' ]" type="primary" size="mini"
						@click="handleRecovery(scope.row.oilcardno)"
					>
						回收
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 充值对话框 -->
		<el-dialog title="油卡充值" :visible.sync="dialogFormVisibleRecharge">
			<el-form
				ref="dataFormRecharge" :rules="rulesRecharge" :model="dataFormRecharge" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="充值金额" prop="amount">
					<el-input v-model="dataFormRecharge.amount" placeholder="请输入充值金额" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleRecharge = false">取消</el-button>
				<el-button type="primary" @click="updateRechargeData">确定</el-button>
			</div>
		</el-dialog>

		<!-- 回收对话框 -->
		<el-dialog title="油卡回收" :visible.sync="dialogFormVisibleRecovery">
			<el-form
				ref="dataFormRecovery" :rules="rulesRecovery" :model="dataFormRecovery" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="回收金额" prop="amount">
					<el-input v-model="dataFormRecovery.amount" placeholder="请输入回收金额" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleRecovery = false">取消</el-button>
				<el-button type="primary" @click="updateRecoveryData">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { queryyoukalist, querycompanyaccountamount, changeoilcardamount } from '@/api/refuelingManagement/oilCardList'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { regFloat } from '@/utils/reg'

export default {
	name: 'OilCardList',
	components: { Pagination },
	data() {
		return {
			downloadLoading: false,
			accountAmount: '',
			list: null,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				oilcardno: undefined
			},

			// // 默认对话框
			// dialogStatus: '',
			// textMap: { update: '编辑', create: '创建' },

			// 充值对话框
			dataFormRecharge: {
				oilCardNo: undefined,
				type: '1',
				amount: ''
			},
			dialogFormVisibleRecharge: false,
			rulesRecharge: {
				amount: [{ required: true, message: '充值金额不能为空', trigger: 'blur' },	{ pattern: regFloat, message: '数值有误' }]
			},

			// 回收对话框
			dataFormRecovery: {
				oilCardNo: undefined,
				type: '-1',
				amount: ''
			},
			dialogFormVisibleRecovery: false,
			rulesRecovery: {
				amount: [{ required: true, message: '回收金额不能为空', trigger: 'blur' },	{ pattern: regFloat, message: '数值有误' }]
			}
		}
	},
	created() {
		this.getList()
		querycompanyaccountamount({}).then((response) => {
			this.accountAmount = response.data.data
		})
			.catch((response) => {
				this.$notify.error({
					title: '获取余额数据失败',
					message: response.data.errmsg
				})
			})
	},
	methods: {
		getList() {
			this.listLoading = true
			queryyoukalist(this.listQuery).then((response) => {
				this.list = response.data.data.items
				this.total = response.data.data.total
				this.listLoading = false
			})
				.catch((response) => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		// handleCreate() {
		// 	this.resetForm()
		// 	this.dialogStatus = 'create'
		// 	this.dialogFormVisible = true
		// 	this.$nextTick(() => {
		// 		this.$refs.dataForm.clearValidate()
		// 	})
		// },

		handleRecharge(data) {
			this.resetFormRecharge()
			this.dataFormRecharge = Object.assign(this.dataFormRecharge, { oilCardNo: data })
			this.dialogFormVisibleRecharge = true
			this.$nextTick(() => {
				this.$refs.dataFormRecharge.clearValidate()
			})
		},
		resetFormRecharge() {
			this.dataFormRecharge = {
				oilCardNo: undefined,
				type: '1',
				amount: ''
			}
		},
		updateRechargeData() {
			this.$refs.dataFormRecharge.validate((valid) => {
				if (valid) {
					changeoilcardamount(this.dataFormRecharge).then(() => {
						this.dialogFormVisibleRecharge = false
						this.resetFormRecharge()
						this.$notify.success({
							title: '成功',
							message: '充值成功'
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

		handleRecovery(data) {
			this.resetFormRecovery()
			this.dataFormRecovery = Object.assign(this.dataFormRecovery, { oilCardNo: data })
			this.dialogFormVisibleRecovery = true
			this.$nextTick(() => {
				this.$refs.dataFormRecovery.clearValidate()
			})
		},
		resetFormRecovery() {
			this.dataFormRecovery = {
				oilCardNo: undefined,
				type: '-1',
				amount: ''
			}
		},
		updateRecoveryData() {
			this.$refs.dataFormRecovery.validate((valid) => {
				if (valid) {
					changeoilcardamount(this.dataFormRecovery).then(() => {
						this.dialogFormVisibleRecovery = false
						this.resetFormRecovery()
						this.$notify.success({
							title: '成功',
							message: '充值成功'
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

		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['ID', '用户ID', '油卡手机号', '油卡编号', '创建时间']
				const filterVal = ['id', 'userid', 'phone', 'oilcardno', 'cet_time']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '油卡列表')
				this.downloadLoading = false
			})
		}
	}
}
</script>
