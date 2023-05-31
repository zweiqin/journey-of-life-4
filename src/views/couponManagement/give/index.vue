<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-show="isAdmin" v-model="listQuery.holdId" clearable size="mini"
				class="filter-item"
				style="width: 200px;" placeholder="请输入赠与方ID"
			/>
			<el-input
				v-model="listQuery.userId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入被赠与方ID"
			/>
			<el-input
				v-model="listQuery.voucherId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入代金券ID"
			/>
			<el-button
				v-permission="[ 'GET /admin/circula/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/circula/circula' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleTransfer"
			>
				转赠
			</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" label="编号" prop="id" sortable />

			<el-table-column align="center" label="赠与方id" prop="holdId" />

			<el-table-column align="center" label="被赠与方id" prop="userId" />

			<el-table-column align="center" label="数量" prop="number" />

			<!-- <el-table-column
				align="center"
				label="操作"
				class-name="small-padding fixed-width"
				>
				<template slot-scope="scope">
				<el-button
				v-permission="['POST /admin/admin/update']"
				v-if="scope.row.status === 3"
				type="primary"
				size="mini"
				@click="handleGrant(scope.row)"
				>发放</el-button>
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
import { listGet } from '@/api/couponManagement/give'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import { getUserInfo } from '@/api/login'

export default {
	name: 'CouponManagementGive',
	components: { Pagination },
	data() {
		return {
			isAdmin: true,
			userId: -1,
			listLoading: true,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				limit: 20,
				holdId: undefined,
				userId: undefined,
				voucherId: undefined
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
		this.getRoles()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					this.isAdmin = response.data.roles[0] === '超级管理员'
					this.userId = response.data.userId
					if (this.isAdmin) {
						this.getList()
					} else if (this.userId === undefined) {
						this.$notify.error({
							title: '异常',
							message: '没有权限'
						})
						this.listLoading = false
					} else {
						this.listQuery.holdId = this.userId
						this.getList()
					}
				})
				.catch()
		},
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
		},
		handleTransfer() {
			this.$router.push({ name: 'CouponManagementGiveCreate', query: { isAdmin: this.isAdmin, userId: this.userId } })
		}
	}
}
</script>

<style scoped></style>
