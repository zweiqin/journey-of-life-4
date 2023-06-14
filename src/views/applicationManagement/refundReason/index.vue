<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="searchID"
				clearable
				size="small"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入ID"
			/>
			<el-input
				v-model="searchText"
				clearable
				size="small"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入ID"
			/>
			<el-button class="filter-item" size="mini" type="primary" @click="dialogFormVisible = true">点击此处添加退款申请</el-button>
		</div>
		<!-- 搜索结果的数据 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading"
				max-height="100%" :data="selectList(searchID, searchText)" size="small"
				element-loading-text="正在查询中。。。"
				border fit
				highlight-current-row
			>
				<el-table-column align="center" label="ID" prop="id" sortable />
				<el-table-column align="center" label="创建时间" prop="createTime" />
				<el-table-column align="center" label="最后修改时间" prop="modifyTime" />
				<el-table-column align="center" label="退款原因" prop="refundOtherReason" />
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'POST /admin/applicationManagement/update' ]"
							type="primary"
							@click="isUpdata = true; fromData.id = scope.row.id; fromData.refundOtherReason = scope.row.refundOtherReason;"
						>
							<!-- updateData(scope.row, '修改申请') -->
							修改退款原因
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/applicationManagement/update' ]"
							type="danger"
							@click="deleData(scope.row, '是否要删除该申请')"
						>
							删除申请
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				v-show="total > 0"
				:total="total"
				:page.sync="listQuery.page"
				:limit.sync="listQuery.size"
				@pagination="getDataList()"
			/>
		</div>
		<!-- 添加 -->
		<el-dialog
			title="添加退款申请的原因"
			:visible.sync="dialogFormVisible"
			width="80%"
		>
			<el-input
				v-model="refundOtherReason"
				type="textarea"
				placeholder="请输入退款原因"
			/>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addData(refundOtherReason)">
					确定
				</el-button>
				<el-button
					@click="dialogFormVisible = false"
				>
					取消
				</el-button>
			</div>
		</el-dialog>
		<!-- 修改 -->
		<el-dialog
			title="添加退款申请的原因"
			:visible.sync="isUpdata"
			width="80%"
		>
			<el-form ref="creatFromData" :model="fromData">
				<el-form-item label="ID" prop="id" label-width="80px">
					<el-input
						v-model="fromData.id"
						disabled
						style="width: 200px"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item label="退款原因" prop="id" label-width="80px">
					<el-input
						v-model="fromData.refundOtherReason"
						type="textarea"
						placeholder="请输入退款原因"
					/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="updateData()">
					确定
				</el-button>
				<el-button
					@click="isUpdata = false"
				>
					取消
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getRefundReason, addRefundReason, updataRefundReason, deleteRefundReason } from '@/api/applicationManagement/refundReason'
export default {
	// eslint-disable-next-line key-spacing, vue/match-component-file-name
	name:'RefundReason',
	components: { Pagination },
	data() {
		return {
			refundOtherReason: '',
			fromData: { id: '', refundOtherReason: '' },
			list: [ { id: '', refundOtherReason: '' } ],
			isUpdata: false,
			dialogFormVisible: false,
			listLoading: true,
			total: 0,
			searchID: '',
			searchText: '',
			listQuery: {
				page: 1,
				size: 11
			}
		}
	},
	created() {
		this.getDataList()
		// getRefundReason().then((res) => {
		// 	window.console.log(res)
		// })
		// updataRefundReason({ id: '5', refundOtherReason: '为啥不出现' }).then((res) => {
		// 	console.log(res)
		// })
	},
	methods: {
		getDataList() {
			this.listLoading = true
			getRefundReason(this.listQuery).then((res) => {
				this.list = res.data.talentList
				this.total = res.data.totalPages
				this.listLoading = false
			})
				.catch((err) => {
					window.console.log(err)
				})
		},
		// 搜索
		selectList(search, searchText) {
			// eslint-disable-next-line array-callback-return
			return this.list.filter((item) => {
				// 如果postList(title)包含search(输入框) => true
				if (item.id.toString().includes(search) && (item.refundOtherReason || '').includes(searchText)) {
					// 返回item
					return item
				}
			})
		},
		addData(refundOtherReason) {
			addRefundReason({ id: '', refundOtherReason }).then((res) => {
				this.$message({
					showClose: true,
					message: '操作成功',
					type: 'success'
				})
				this.dialogFormVisible = false
				this.refundOtherReason = ''
				this.getDataList()
			})
				.catch((err) => {
					this.$notify.error({
						title: '失败',
						message: err.errmsg
					})
				})
		},
		// 修改
		updateData() {
			updataRefundReason(this.fromData).then((res) => {
				this.$message({
					showClose: true,
					message: '操作成功',
					type: 'success'
				})
				this.isUpdata = false
				this.getDataList()
			})
				.catch((err) => {
					this.$notify.error({
						title: '失败',
						message: err.errmsg
					})
					this.isUpdata = false
				})
		},
		// 删除
		deleData(row, text) {
			this.$confirm(
				text,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					// 审核申请表
					deleteRefundReason({
						id: row.id
					})
						.then((response) => {
							this.$message({
								showClose: true,
								message: '操作成功',
								type: 'success'
							})
							this.getDataList()
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
						message: '已取消'
					})
				})
		}
	}
}
</script>

<style lang="scss">

</style>
