<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.title" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入文章标题"
			/>
			<el-select v-model="listQuery.type" size="mini" class="filter-item" clearable placeholder="请选择文章类型">
				<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-select v-model="listQuery.isVip" size="mini" class="filter-item" clearable placeholder="请选择文章性质">
				<el-option v-for="item in isVipList" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
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

			<el-table-column align="center" label="文章类型" prop="type" sortable>
				<template slot-scope="scope">
					{{ typeValue[scope.row.type - 1] }}
				</template>
			</el-table-column>

			<el-table-column align="center" label="文章性质" prop="isVip">
				<template slot-scope="scope">
					{{ scope.row.isVip ? '收费' : '免费' }}
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="400px" label="文章标题" prop="title" />

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
import { listArticle, deleteArticle } from '@/api/articleManagement/article'
import Pagination from '@/components/Pagination'

export default {
	name: 'ArticleList',
	components: { Pagination },
	data() {
		return {
			typeList: [{
				value: 1,
				label: '草帽服装'
			}, {
				value: 2,
				label: '餐饮酒店'
			}, {
				value: 3,
				label: '美容美发'
			}, {
				value: 4,
				label: '生活超市'
			}, {
				value: 5,
				label: '健身娱乐'
			}, {
				value: 6,
				label: '装修建材'
			}, {
				value: 7,
				label: '培训学校'
			}, {
				value: 8,
				label: '汽车美容'
			}, {
				value: 9,
				label: '爆粉秘籍'
			}, {
				value: 10,
				label: '抖音实例'
			}, {
				value: 11,
				label: '营销课程'
			}, {
				value: 12,
				label: '赚钱教程'
			}, {
				value: 13,
				label: '购买协议'
			}],
			isVipList: [{
				value: 'true',
				label: '收费'
			}, {
				value: 'false',
				label: '免费'
			}],
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				title: undefined,
				type: undefined,
				isVip: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			typeValue: ['草帽服装', '餐饮酒店', '美容美发', '生活超市', '健身娱乐', '装修建材', '培训学校', '汽车美容', '爆粉秘籍', '抖音实例', '营销课程', '赚钱教程', '购买协议']
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
			this.$router.push({ name: 'teachArticleCreate' })
		},
		handleUpdate(row) {
			this.$router.push({ name: 'teachArticleEdit', query: { id: row.id } })
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
