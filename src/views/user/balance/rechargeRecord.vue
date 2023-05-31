<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.userId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入会员ID"
			/>
			<el-input
				v-model="listQuery.orderId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入订单ID"
			/>
			<el-select
				v-model="listQuery.status" size="mini" clearable class="filter-item"
				style="width: 200px;"
				placeholder="请选择状态"
			>
				<el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.name" />
			</el-select>
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				查找
			</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" label="编号" prop="id" sortable />

			<el-table-column align="center" label="订单编号" prop="orderId" min-width="100px" />

			<el-table-column align="center" label="门店id" prop="brandId" />

			<el-table-column align="center" label="会员id" prop="userId" />

			<el-table-column align="center" label="会员昵称" prop="nickName" />

			<el-table-column align="center" label="充值余额" prop="credit" />

			<el-table-column align="center" label="状态" prop="status">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status === 0">未付款</el-tag>
					<el-tag v-if="scope.row.status === 1" type="info">取消</el-tag>
					<el-tag v-if="scope.row.status === 2" type="success">已付款</el-tag>
					<el-tag v-if="scope.row.status === 3" type="danger">余额未发放</el-tag>
					<el-tag v-if="scope.row.status === 4" type="success">余额已发放</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="支付金额" prop="payGrade" />

			<el-table-column align="center" label="是否为后台操作充值" prop="isBgo">
				<template slot-scope="scope">
					{{ scope.row.isBgo ? '是' : '否' }}
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作人id" prop="operatorid" />

			<el-table-column align="center" label="操作人昵称" prop="operatorname" />

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/buAccount/recharge' ]" :disabled="scope.row.status !== 3" type="primary"
						@click="recharge(scope.row)"
					>
						手动发放
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
import { listRechargeRecord, memberRecharge } from '@/api/business/rechargeRecord'
import Pagination from '@/components/Pagination'

export default {
	name: 'RechargeRecord',
	components: { Pagination },
	data() {
		return {
			listLoading: true,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				limit: 20,
				userId: undefined,
				orderId: undefined,
				status: undefined,
				brandId: undefined
			},
			statusList: [
				{
					id: 0,
					name: '未付款'
				},
				{
					id: 1,
					name: '取消'
				},
				{
					id: 2,
					name: '已付款'
				},
				{
					id: 3,
					name: '余额未发放'
				},
				{
					id: 4,
					name: '余额已发放'
				}
			]
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			listRechargeRecord(this.listQuery)
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
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		recharge(row) {
			var req = {
				orderId: row.orderId
			}
			memberRecharge(req).then((response) => {
				this.$notify.success({
					title: '成功',
					message: '发放成功'
				})
				// 重新获取列表
				this.getList()
			})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		}
	}
}
</script>

<style scoped></style>
