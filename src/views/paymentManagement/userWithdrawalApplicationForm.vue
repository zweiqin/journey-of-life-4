<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.userId" clearable size="mini" class="filter-item"
				style="width: 200px"
				placeholder="申请人ID"
			/>
			<el-select
				v-model="listQuery.status" clearable size="mini" class="filter-item"
				style="width: 200px"
				placeholder="状态"
			>
				<el-option label="申请提现" value="1"></el-option>
				<el-option label="审批通过" value="2"></el-option>
				<el-option label="交易完成" value="3"></el-option>
				<el-option label="审批不通过" value="-1"></el-option>
			</el-select>
			<el-button
				style="margin-left: 1.0417vw" size="mini" class="filter-item" type="primary"
				icon="el-icon-search"
				@click="selectFromData()"
			>
				查找提现用户
			</el-button>
		</div>
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" height="100%" :data="list" size="small"
				element-loading-text="正在查询中。。。" border fit
				highlight-current-row
			>
				<el-table-column align="center" label="订单ID" prop="id" sortable />
				<el-table-column align="center" label="申请人UID" prop="uid" sortable />
				<el-table-column align="center" label="订单创建人" prop="createBy" sortable />
				<el-table-column align="center" min-width="100px" label="订单编号" prop="withdrawOrder" />
				<el-table-column align="center" label="申请时间" prop="withdrawApplyTime" />
				<el-table-column align="center" label="实际金额" prop="withdrawApplyTotal" sortable />
				<el-table-column align="center" label="申请金额" prop="withdrawRealityTotal" sortable />
				<el-table-column align="center" label="提款银行ID" prop="withdrawBankId" />
				<el-table-column align="center" label="申请修改人" prop="updateBy" />
				<el-table-column align="center" label="交易状态 / 订单类型">
					<template slot-scope="scope">
						<el-tag>
							{{
								scope.row.status === 1
									? '申请提现'
									: scope.row.status === 2
										? '通过审批'
										: scope.row.status === 3
											? '交易完成'
											: scope.row.status === -1
												? '审批不通过'
												: ''
							}}
						</el-tag>
						<el-tag>
							{{
								scope.row.type === 0
									? '余额'
									: scope.row.type === 1
										? '佣金'
										: scope.row.type === 2
											? '订单金额'
											: '其他'
							}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
					<template slot-scope="scope">
						<el-button
							v-if="scope.row.status === 1 || scope.row.status === -1" type="primary" size="mini"
							@click="modifyOrderStatus(scope.row, 0, '确定通过提现申请吗?')"
						>
							通过
						</el-button>
						<el-button
							v-if="scope.row.status === 2" type="primary" size="mini"
							@click="modifyOrderStatus(scope.row, 2, '确定订单已完成吗?')"
						>
							交易完成
						</el-button>
						<el-button
							v-if="scope.row.status === 1" v-permission="[ 'POST /admin/applicationManagement/update' ]"
							type="danger" size="mini" @click="modifyOrderStatus(scope.row, 1, '确定拒绝提现申请吗?')"
						>
							拒绝
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
			@pagination="selectFromData()"
		/>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getUserWithdrawal, passWithdrawal } from '@/api/paymentManagement'
export default {
	name: 'UserWithdrawalApplicationForm',
	components: { Pagination },
	data() {
		return {
			total: 0,
			list: [],
			listLoading: true,
			listQuery: {
				userId: '',
				status: '',
				page: 1,
				size: 10
			}
		}
	},
	created() {
		this.selectFromData()
	},
	methods: {
		selectFromData() {
			this.listLoading = true
			getUserWithdrawal(this.listQuery).then((res) => {
				this.list = res.data.limit
				this.total = res.data.total
				this.listLoading = false
			})
		},
		modifyOrderStatus(row, type, remark) {
			this.$confirm(
				`${remark}`,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					// 审核申请表
					passWithdrawal({ id: row.id, type })
						.then((res) => {
							this.$message({
								showClose: true,
								message: '操作成功',
								type: 'success'
							})
							this.selectFromData()
						})
						.catch((err) => {
							this.$notify.error({
								title: '失败',
								message: err.data.errmsg
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

<style lang="scss">
.el-tag {
	margin: .2604vw;
}
</style>
