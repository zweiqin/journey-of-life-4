<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.goodsSn" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入商品编号"
			/>
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入商品名称"
			/>
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
						<el-form-item label="关键字">
							<span>{{ scope.row.keywords }}</span>
						</el-form-item>
						<el-form-item label="类目ID">
							<span>{{ scope.row.categoryId }}</span>
						</el-form-item>
						<el-form-item label="品牌商ID">
							<span>{{ scope.row.brandId }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="110" label="商品编号" prop="goodsSn" />

			<el-table-column align="center" min-width="200" label="名称" prop="name" sortable />

			<el-table-column align="center" property="iconUrl" label="图片">
				<template slot-scope="scope">
					<img :src="common.seamingImgUrl(scope.row.picUrl)" width="40">
				</template>
			</el-table-column>

			<el-table-column align="center" property="iconUrl" label="分享图">
				<template slot-scope="scope">
					<img :src="common.seamingImgUrl(scope.row.shareUrl)" width="40">
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

			<el-table-column align="center" label="专柜价格" prop="counterPrice" />

			<el-table-column align="center" label="当前价格" prop="retailPrice" />

			<el-table-column align="center" label="是否新品" prop="isNew">
				<template slot-scope="scope">
					<el-tag :type="scope.row.isNew ? 'success' : 'error'">{{ scope.row.isNew ? '新品' : '非新品' }}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="是否热品" prop="isHot">
				<template slot-scope="scope">
					<el-tag :type="scope.row.isHot ? 'success' : 'error'">{{ scope.row.isHot ? '热品' : '非热品' }}</el-tag>
				</template>
			</el-table-column>

			<!-- <el-table-column align="center" label="是否在售" prop="isOnSale">
				<template slot-scope="scope">
				<el-tag :type="scope.row.isOnSale ? 'success' : 'error' ">{{ scope.row.isOnSale ? '在售' : '未售' }}</el-tag>
				</template>
				</el-table-column> -->

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
import { listGoods, deleteGoods } from '@/api/business/bookGoods'
import Pagination from '@/components/Pagination'

export default {
	name: 'BookGoodsList',
	components: { Pagination },
	data() {
		return {
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				goodsSn: undefined,
				name: undefined,
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
			this.$router.push({ name: 'bookGoodsCreate' })
		},
		handleUpdate(row) {
			this.$router.push({ name: 'bookGoodsEdit', query: { id: row.id } })
		},
		showDetail(detail) {
			this.goodsDetail = detail
			this.detailDialogVisible = true
		},
		handleDelete(row) {
			deleteGoods(row).then((response) => {
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
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['商品ID', '商品编号', '名称', '专柜价格', '当前价格', '是否新品', '是否热品', '是否在售', '首页主图', '宣传图片列表', '商品介绍', '详细介绍', '商品图片', '商品单位', '关键字', '类目ID', '品牌商ID']
				const filterVal = ['id', 'goodsSn', 'name', 'counterPrice', 'retailPrice', 'isNew', 'isHot', 'isOnSale', 'listPicUrl', 'gallery', 'brief', 'detail', 'picUrl', 'goodsUnit', 'keywords', 'categoryId', 'brandId']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>
