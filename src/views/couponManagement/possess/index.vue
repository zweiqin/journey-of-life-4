<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.userId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入持有用户编号ID"
			/>
			<el-button
				v-permission="[ 'GET /admin/hold/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
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

			<el-table-column align="center" label="持有数量" prop="number" />

			<!-- <el-table-column
				align="center"
				label="操作"
				class-name="small-padding fixed-width"
				>
				<template slot-scope="scope">
				<el-button
				v-permission="['POST /admin/admin/update']"
				type="primary"
				size="mini"
				@click="handleUpdate(scope.row)"
				>编辑</el-button>
				<el-button
				v-permission="['POST /admin/admin/delete']"
				type="danger"
				size="mini"
				@click="handleDelete(scope.row)"
				>删除</el-button>
				</template>
				</el-table-column> -->
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

	</div>
</template>

<script>
import { listGet } from '@/api/couponManagement/possess'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
	name: 'CouponManagementPossess',
	components: { Pagination },
	data() {
		return {
			listLoading: true,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				limit: 20,
				userId: undefined
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
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listGet(this.listQuery)
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
		}
	}
}
</script>

<style scoped></style>
