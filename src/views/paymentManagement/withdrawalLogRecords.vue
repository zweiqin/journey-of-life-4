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
				<el-table-column align="center" label="订单创建时间" prop="createTime" />
				<el-table-column align="center" label="最终修改时间" prop="lastUpdateTime" sortable />
				<el-table-column align="center" label="订单状态更改理由" prop="remark" sortable />
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
import { getWithdrawalLogs } from '@/api/paymentManagement'
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
			getWithdrawalLogs(this.listQuery).then((res) => {
				this.list = res.data.limit
				this.total = res.data.total
				this.listLoading = false
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
