<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入商品名称"
			/>
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
			<el-button
				size="mini" class="filter-item" type="primary" icon="el-icon-caret-left"
				@click="handleCancel"
			>
				返回
			</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column type="expand">
				<template slot-scope="scope">
					<el-form label-position="left" class="table-expand">
						<el-form-item label="宣传画廊">
							<div v-if="scope.row.gallery && scope.row.gallery.length">
								<el-image
									v-for="item in scope.row.gallery" :key="item"
									:src="common.seamingImgUrl(item)" style="width:80px;height:80px;margin-right: 10px;" fit="cover"
									:preview-src-list="scope.row.gallery.map(i => common.seamingImgUrl(i))"
								/>
							</div>
							<span v-else>--</span>
						</el-form-item>
						<el-form-item label="商品介绍">
							<span>{{ scope.row.brief }}</span>
						</el-form-item>
						<el-form-item label="商品单位">
							<span>{{ scope.row.unit }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="110" label="商品id" prop="id" />

			<el-table-column align="center" min-width="150" label="名称" prop="name" sortable />

			<el-table-column align="center" property="iconUrl" label="图片">
				<template slot-scope="scope">
					<img :src="common.seamingImgUrl(scope.row.picUrl)" width="40">
				</template>
			</el-table-column>

			<el-table-column align="center" label="详情" prop="detail">
				<template slot-scope="scope">
					<el-dialog :visible.sync="detailDialogVisible" title="商品详情">
						<div v-html="goodsDetail" />
					</el-dialog>
					<el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
				</template>
			</el-table-column>

			<el-table-column align="center" label="已销售总量" prop="sales" />

			<el-table-column align="center" label="浏览量" prop="browse" />

			<el-table-column align="center" label="是否在售" prop="isOnSale">
				<template slot-scope="scope">
					<el-tag :type="scope.row.isOnSale ? 'success' : 'error'">{{ scope.row.isOnSale ? '在售' : '未售' }}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
import { listGoods, deleteGoods } from '@/api/business/creditGoods'
import Pagination from '@/components/Pagination'

export default {
	name: 'BrandCreditGoodsShow',
	components: { Pagination },
	data() {
		return {
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				name: undefined,
				brandId: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			goodsDetail: '',
			detailDialogVisible: false,
			downloadLoading: false
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			if (!this.$route.query.id) return
			this.listQuery.brandId = this.$route.query.id
			this.listLoading = true
			listGoods(this.listQuery).then((response) => {
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
			this.$router.push({ name: 'creditGoodsCreate', query: { lastRouter: 'BrandCreditGoodsShow', brandId: this.listQuery.brandId } })
		},

		handleUpdate(row) {
			this.$router.push({ name: 'creditGoodsEdit', query: { id: row.id, lastRouter: 'BrandCreditGoodsShow', brandId: this.listQuery.brandId } })
		},
		showDetail(detail) {
			this.goodsDetail = detail
			this.detailDialogVisible = true
		},
		handleDelete(row) {
			deleteGoods(row).then((res) => {
				this.$notify.success({
					title: '成功',
					message: '删除成功'
				})
				const index = this.list.indexOf(row)
				this.list.splice(index, 1)
			})
				.catch((err) => {
					this.$notify.error({
						title: '失败',
						message: err.data.errmsg
					})
				})
		},
		handleCancel() {
			this.$router.push({ name: 'brandGoodsList', query: { pageType: 'default' } })
		}

	}
}
</script>
