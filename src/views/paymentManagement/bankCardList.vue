<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.carId" clearable size="mini" class="filter-item"
				style="width: 200px"
				placeholder="银行卡编号"
			/>
			<el-input
				v-model="listQuery.userId" clearable size="mini" class="filter-item"
				style="width: 200px"
				placeholder="用户ID"
			/>
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
				<el-table-column align="center" label="银行代号" prop="bankCode" sortable />
				<el-table-column align="center" min-width="100px" label="银行名字" prop="bankName" />
				<el-table-column align="center" label="银行卡号" prop="bankNumber" />
				<el-table-column align="center" label="用户名字" prop="cnname" sortable />
				<el-table-column align="center" label="创建时间" prop="createTime" sortable />
				<el-table-column align="center" label="类型">
					<template slot-scope="scope">
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
import { getWithdrawalBank } from '@/api/paymentManagement'
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
				carId: '',
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
			getWithdrawalBank(this.listQuery).then((res) => {
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
