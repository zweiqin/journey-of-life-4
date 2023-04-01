<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.orderno" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入订单号"
			/>
			<el-input
				v-model="listQuery.oilcardno" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入用户油卡编号"
			/>
			<el-button
				v-permission="[ 'GET /admin/tuanyou/queryyoukalist' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
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

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit fixed="right"
			highlight-current-row
		>
			<el-table-column align="center" width="100px" label="ID" prop="id" sortable />
			<el-table-column align="center" min-width="200px" label="订单号" prop="orderno" />
			<el-table-column align="center" min-width="200px" label="油卡号" prop="oilcardno" />

			<el-table-column align="left" min-width="200px" label="充值类型" prop="type">
				<template slot-scope="scope">
					<span v-if="scope.row.type == 0">后台管理员充值</span>
					<span v-else-if="scope.row.type == 1">前台H5小程序自己充值</span>
					<span v-else>--</span>
				</template>
			</el-table-column>

			<el-table-column align="left" min-width="200px" label="充值金额" prop="amount" />

			<el-table-column align="left" min-width="200px" label="充值结果" prop="status">
				<template slot-scope="scope">
					<span v-if="scope.row.status == 0">成功</span>
					<span v-else-if="scope.row.status == 1">失败</span>
					<span v-else-if="scope.row.status == 2">未支付</span>
					<span v-else>--</span>
				</template>
			</el-table-column>

			<el-table-column align="left" min-width="200px" label="失败原因" prop="msg" />
			<el-table-column align="left" min-width="200px" label="操作人ID" prop="optuserid" />
			<el-table-column align="left" min-width="200px" label="创建时间" prop="cet_time" />
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

	</div>
</template>

<script>
import { querycompanyaccountamount } from '@/api/refuelingManagement/rechargeRecord'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
	name: 'RechargeRecord',
	components: { Pagination },
	data() {
		return {
			accountAmount: '',
			list: null,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				orderno: '',
				oilcardno: ''
			},
			downloadLoading: false
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			querycompanyaccountamount(this.listQuery).then((response) => {
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
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
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
