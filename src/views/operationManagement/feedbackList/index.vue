<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.username" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入用户名"
			/>
			<el-input
				v-model="listQuery.id" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入反馈ID"
			/>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button
				:loading="downloadLoading" size="mini" class="filter-item" type="warning"
				icon="el-icon-download"
				@click="handleDownload"
			>
				导出
			</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中..."
				border fit
				highlight-current-row height="100%"
			>

				<el-table-column align="center" min-width="80px" label="反馈ID" prop="id" sortable />

				<el-table-column align="center" min-width="200px" label="用户名" prop="username" />

				<el-table-column align="center" min-width="120px" label="手机号码" prop="mobile" />

				<el-table-column align="center" min-width="80px" label="反馈类型" prop="feedType" />

				<el-table-column align="center" min-width="200px" label="反馈内容" prop="content" />

				<el-table-column align="center" min-width="100px" label="反馈图片" prop="picUrls">
					<template slot-scope="scope">
						<div v-if="scope.row.gallery && scope.row.gallery.length">
							<el-image
								:src="common.seamingImgUrl(scope.row.gallery[0])" style="width:40px; height:40px" fit="cover"
								:preview-src-list="scope.row.gallery.map(i => common.seamingImgUrl(i))"
							/>
							<span v-if="scope.row.gallery.length > 1" style="margin-left:8px;">+{{ scope.row.gallery.length }}</span>
						</div>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="120px" label="时间" prop="addTime" />

			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

	</div>
</template>

<script>
import { listFeedback } from '@/api/operationManagement/feedbackList'
import Pagination from '@/components/Pagination'

export default {
	name: 'Feedback',
	components: { Pagination },
	data() {
		return {
			list: undefined,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				username: undefined,
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
			listFeedback(this.listQuery).then((response) => {
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
				const tHeader = ['反馈ID', '用户名称', '反馈内容', '反馈图片列表', '反馈时间']
				const filterVal = ['id', 'username', 'content', 'picUrls', 'addTime']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '意见反馈信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>
