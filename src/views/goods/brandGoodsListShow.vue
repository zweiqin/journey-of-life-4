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
			<el-select v-model="listQuery.goodType" size="mini" class="filter-item" clearable placeholder="请选择商品类型">
				<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-select v-model="listQuery.approveStatus" size="mini" class="filter-item" clearable placeholder="请选择审批状态">
				<el-option label="全部" value="" />
				<el-option label="未提交" :value="4" />
				<el-option label="待审批" :value="0" />
				<el-option label="审批通过" :value="1" />
				<el-option label="审批拒绝" :value="2" />
			</el-select>
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

			<el-table-column align="center" label="商品归属" prop="brandType">
				<template slot-scope="scope">
					<span v-if="scope.row.brandType === 0">商城商品</span>
					<span v-else-if="scope.row.brandType === 1">本地生活商品</span>
					<span v-else>--</span>
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="150" label="名称" prop="name" sortable />

			<el-table-column align="center" min-width="110" label="商品主类" prop="goodsType" sortable>
				<template slot-scope="scope">
					{{ typeValue[scope.row.goodsType - 1] }}
				</template>
			</el-table-column>

			<el-table-column align="center" property="iconUrl" label="图片">
				<template slot-scope="scope">
					<el-image
						v-if="scope.row.picUrl" :src="common.seamingImgUrl(scope.row.picUrl)" style="width:40px; height:40px" fit="cover"
						:preview-src-list="[ common.seamingImgUrl(scope.row.picUrl) ]"
					/>
					<span v-else>--</span>
				</template>
			</el-table-column>

			<!-- <el-table-column align="center" property="iconUrl" label="分享图">
				<template slot-scope="scope">
				<img :src="scope.row.shareUrl" width="40">
				</template>
				</el-table-column> -->

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

			<el-table-column align="center" label="审核状态" prop="approveStatus">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.approveStatus === 4" type="info">未提交</el-tag>
					<el-tag v-else-if="scope.row.approveStatus === 0" type="warning">待审批</el-tag>
					<el-tag v-else-if="scope.row.approveStatus === 1" type="success">审批通过</el-tag>
					<el-tag v-else-if="scope.row.approveStatus === 2" type="danger">审批拒绝</el-tag>
					<div v-else>--</div>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" fixed="right" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button :disabled="scope.row.approveStatus !== 0" type="warning" size="mini" @click="handleExamine(scope.row)">审核</el-button>
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 商品审核对话框 -->
		<el-dialog title="商品审核" :visible.sync="dialogFormVisibleExamine" width="800px">
			<el-form
				ref="dataFormExamine" :rules="rulesExamine" :model="dataFormExamine" status-icon
				label-position="left" label-width="80px"
				style="width: 100%; padding:0 35px;"
			>
				<el-form-item label="审核状态" prop="status">
					<el-select
						v-model="dataFormExamine.status"
						class="filter-item"
					>
						<el-option label="审批通过" :value="1" />
						<el-option label="审批拒绝" :value="2" />
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleExamine = false">取消</el-button>
				<el-button type="primary" @click="confirmExamine">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listGoods, deleteGoods, goodsApprove } from '@/api/business/goods'
import Pagination from '@/components/Pagination'

export default {
	name: 'BrandGoodsListShow',
	components: { Pagination },
	data() {
		return {
			typeList: [{
				value: 1,
				label: '家具'
			}, {
				value: 2,
				label: '材料'
			}],
			typeValue: ['家具', '材料'],
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				goodsSn: undefined,
				name: undefined,
				goodType: undefined,
				cateId: undefined,
				brandId: undefined,
				sort: 'add_time',
				order: 'desc',
				approveStatus: ''
			},
			goodsDetail: '',
			detailDialogVisible: false,
			downloadLoading: false,

			// 商品审核对话框
			dialogFormVisibleExamine: false,
			dataFormExamine: {
				gid: '',
				status: ''
			},
			rulesExamine: {
				id: [ { required: true, message: '审核商品ID不能为空', trigger: 'blur' } ],
				status: [ { required: true, message: '审核状态不能为空', trigger: 'blur' } ]
			}
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
			this.$router.push({ name: 'goodsCreate', query: { lastRouter: 'BrandGoodsListShow', brandId: this.listQuery.brandId } })
		},

		handleUpdate(row) {
			this.$router.push({ name: 'goodsEdit', query: { id: row.id, lastRouter: 'BrandGoodsListShow', brandId: this.listQuery.brandId } })
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
		},

		handleExamine(row) {
			this.resetFormExamine()
			this.dataFormExamine = Object.assign(this.dataFormExamine, {
				gid: row.id || '',
				status: ''
			})
			this.dialogFormVisibleExamine = true
			this.$nextTick(() => {
				this.$refs.dataFormExamine.clearValidate()
			})
		},
		resetFormExamine() {
			this.dataFormExamine = {
				gid: '',
				status: ''
			}
		},
		confirmExamine() {
			this.$refs.dataFormExamine.validate((valid) => {
				if (valid) {
					goodsApprove(this.dataFormExamine)
						.then((res) => {
							this.dialogFormVisibleExamine = false
							this.$notify.success({
								title: '成功',
								message: '操作成功'
							})
							this.getList()
						})
						.catch((err) => {
							this.$notify.error({
								title: '操作失败',
								message: err.data.errmsg
							})
						})
				}
			})
		}
	}
}
</script>
