<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.userId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入用户ID"
			/>
			<el-input
				v-model="listQuery.valueId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入商品ID"
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
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" min-width="100px" label="用户ID" prop="userId" />

			<el-table-column align="center" min-width="100px" label="商品ID" prop="valueId" />

			<el-table-column align="center" min-width="80px" label="打分" prop="star" sortable />

			<el-table-column align="left" min-width="200px" label="评论内容" prop="content" />

			<el-table-column align="center" min-width="200px" label="评论图片" prop="picUrls">
				<template slot-scope="scope">
					<img v-for="item in scope.row.picUrls" :key="item" :src="common.seamingImgUrl(item)" width="40">
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="120px" label="时间" prop="addTime" />

			<el-table-column align="center" min-width="150px" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleReply(scope.row)">回复</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 评论回复 -->
		<el-dialog :visible.sync="replyFormVisible" title="回复">
			<el-form
				ref="replyForm" :model="replyForm" status-icon label-position="left"
				label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="回复内容" prop="content">
					<el-input v-model="replyForm.content" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="replyFormVisible = false">取消</el-button>
				<el-button type="primary" @click="reply">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listComment, deleteComment, replyComment } from '@/api/business/comment'
import Pagination from '@/components/Pagination'

export default {
	name: 'GoodsComment',
	components: { Pagination },
	data() {
		return {
			list: undefined,
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
			downloadLoading: false,
			replyForm: {
				commentId: 0,
				content: ''
			},
			replyFormVisible: false
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listComment(this.listQuery).then((response) => {
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
		handleReply(row) {
			this.replyForm = { commentId: row.id, content: '' }
			this.replyFormVisible = true
		},
		reply() {
			replyComment(this.replyForm).then((response) => {
				this.replyFormVisible = false
				this.$notify.success({
					title: '成功',
					message: '回复成功'
				})
			})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},
		handleDelete(row) {
			deleteComment(row).then((response) => {
				this.$notify({
					title: '成功',
					message: '删除成功',
					type: 'success',
					duration: 2000
				})
				const index = this.list.indexOf(row)
				this.list.splice(index, 1)
			})
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['评论ID', '用户ID', '商品ID', '评论', '评论图片列表', '评论时间']
				const filterVal = ['id', 'userId', 'valueId', 'content', 'picUrls', 'addTime']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品评论信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>
