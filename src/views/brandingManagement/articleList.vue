<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.title" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入公告标题..."
			/>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFilter">
				查找
			</el-button>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="handleCreate">
				添加
			</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" label="类型" prop="type" sortable>
				<template slot-scope="scope">
					<el-tag v-if="scope.row.type == '1'" type="success">
						公告
					</el-tag>
					<el-tag v-else-if="scope.row.type == '0'" type="success">
						通知
					</el-tag>
					<el-tag v-else type="error">
						其他
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="400px" label="标题" prop="title" />

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
						编辑
					</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">
						删除
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
import { listArticle, deleteArticle } from '@/api/business/article'
import Pagination from '@/components/Pagination'

export default {
	name: 'ArticleList',
	components: { Pagination },
	data() {
		return {
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				title: undefined,
				sort: 'add_time',
				order: 'desc'
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listArticle(this.listQuery).then((response) => {
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
		handleCreate() {
			this.$router.push({ name: 'articleCreate' })
		},
		handleUpdate(row) {
			this.$router.push({ name: 'articleEdit', query: { id: row.id } })
		},
		handleDelete(row) {
			deleteArticle(row).then((response) => {
				this.$notify.success({
					title: '成功',
					message: '删除成功'
				})
				const index = this.list.indexOf(row)
				this.list.splice(index, 1)
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
