<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input v-model="listQuery.userId" clearable size="mini" class="filter-item" style="width: 200px;" placeholder="请输入用户ID" />
			<el-input v-model="listQuery.valueId" clearable size="mini" class="filter-item" style="width: 200px;" placeholder="请输入商品ID" />
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">导出</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%">
				<el-table-column align="center" width="100px" label="收藏ID" prop="id" sortable />

				<el-table-column align="center" min-width="100px" label="用户ID" prop="userId" />

				<el-table-column align="center" min-width="100px" label="商品ID" prop="valueId" />

				<el-table-column align="center" min-width="100px" label="添加时间" prop="addTime" />

			</el-table>
		</div>

		<Pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

	</div>
</template>

<script>
import { listCollect } from '@/api/business/user'
import Pagination from '@/components/Pagination'

export default {
	name: 'Collect',
	components: { Pagination },
	data() {
		return {
			list: null,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				userId: undefined,
				valueId: undefined,
				sort: 'add_time',
				order: 'desc'
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
			listCollect(this.listQuery).then((response) => {
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
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['用户ID', '商品ID', '添加时间']
				const filterVal = ['userId', 'valueId', 'addTime']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户收藏信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>
