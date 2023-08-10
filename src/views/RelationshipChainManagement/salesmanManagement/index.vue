<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店名称"
			/>
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
			ref="salesman" v-loading="listLoading" :data="list" size="small"
			element-loading-text="正在查询中。。。" border fit
			highlight-current-row
		>

			<el-table-column align="center" label="门店ID" prop="salesmanid" sortable />

			<el-table-column align="center" label="门店名称" prop="salesmanname" />

			<el-table-column align="center" label="门店封面" prop="avatar">
				<template slot-scope="scope">
					<div style="width:100%;height:100%;">
						<el-image
							v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
						/>
						<span v-else>--</span>
					</div>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="danger" @click="handleIdDelete(scope.row)">解绑</el-button>
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
import { getUserInfo } from '@/api/login'
import { idGet, listGet, listDelete } from '@/api/marketingManagement/salesmanManagement'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
	name: 'SalesmanManagement',
	components: { Pagination },
	data() {
		return {
			lookingPicture: '',
			list: [],
			total: 0,
			listLoading: false,
			listQuery: {
				id: undefined,
				name: undefined,
				page: 1,
				limit: 20,
				sort: 'add_time',
				order: 'desc'
			},
			downloadLoading: false
		}
	},
	created() {
		this.getAdminName()
	},
	methods: {
		getAdminName() {
			getUserInfo(getToken())
				.then((response) => {
					idGet(response.data.name).then((response) => {
						this.listQuery.id = response.data.id
						this.getList()
					})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.data.errmsg
							})
							this.listQuery.id = ''
						})
				})
				.catch()
		},

		// 获取门店列表
		getList() {
			this.listLoading = true
			listGet(this.listQuery).then((response) => {
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

		// 解除绑定关系
		handleIdDelete(row) {
			this.$confirm('此操作将解绑该账户关系信息, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const deleteData = {
					administratorId: this.listQuery.id,
					salesmanId: [ row.salesmanid ]
				}
				listDelete(deleteData).then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除成功'
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
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},

		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['门店ID', '门店名称', '门店封面']
				const filterVal = ['salesmanid', 'salesmanname', 'avatar']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '门店信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>
