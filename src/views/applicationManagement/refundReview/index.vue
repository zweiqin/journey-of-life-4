<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="listQuery.brandId"
				clearable
				size="small"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入ID"
			/>
			<el-button
				class="filter-item"
				type="primary"
				size="mini"
				icon="el-icon-search"
				@click="getListData()"
			>
				查找
			</el-button>
		</div>
		<div v-tableHeight>
			<el-table
				v-loading="listLoading"
				height="100%"
				:data="list"
				size="small"
				element-loading-text="正在查询中。。。"
				border
				fit
				highlight-current-row
			>
				<el-table-column
					min-width="30px"
					align="center"
					label="ID"
					prop="id"
					sortable
				/>
				<el-table-column
					min-width="70px"
					align="center"
					label="退款金额"
					prop="backMoney"
					sortable
				/>
				<el-table-column
					min-width="70px"
					align="center"
					label="品牌标识"
					prop="brandId"
					sortable
				/>
				<el-table-column
					align="center"
					label="退款原因"
					prop="failureReason"
				/>
				<el-table-column
					align="center"
					label="订单ID"
					prop="orderId"
					sortable
				/>
				<el-table-column
					align="center"
					label="申请退款用户"
					prop="refundTo"
				/>
				<el-table-column
					align="center"
					label="退款理由"
					prop="refundRemark"
				/>
				<el-table-column
					align="center"
					label="退款状态"
					prop="refundStatus"
				/>
				<el-table-column align="center" label="退款状态" prop="refundStatus">
					<template slot-scope="scope">
						<el-tag>
							{{
								scope.row.refundStatus == 0
									? '等待商家同意'
									: scope.row.refundStatus == 1
										? '商家同意'
										: scope.row.refundStatus == -1
											? '商家不同意'
											: scope.row.refundStatus == 2
												? '管理员已处理'
												: ''
							}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					min-width="120px"
					align="center"
					label="退款时间"
					prop="refundTime"
					sortable
				/>
				<el-table-column
					align="center"
					label="服务ID"
					prop="serviceId"
					sortable
				/>
				<el-table-column
					min-width="100px"
					align="center"
					label="商户拒绝退款理由"
					prop="shopRejectReason"
				/>
				<el-table-column align="center" label="类型" prop="refundStatus">
					<template slot-scope="scope">
						<el-tag>
							{{
								scope.row.type == 0
									? '商城'
									: scope.row.type == 1
										? '本地'
										: '其他'
							}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					label="操作"
					class-name="small-padding fixed-width"
					width="250"
				>
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'POST /admin/applicationManagement/update' ]"
							type="primary"
							@click="updateData(scope.row, 0, '通过申请')"
						>
							同意申请
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/applicationManagement/update' ]"
							type="danger"
							@click="updateData(scope.row, 1, '退回申请')"
						>
							退回申请
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import { getRefundApprovalForm, fetAuditOperation } from '@/api/applicationManagement/refundReview'
export default {
	// eslint-disable-next-line vue/match-component-file-name, vue/component-definition-name-casing
	name: 'refundReview',
	data() {
		return {
			list: [],
			listLoading: true,
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
				brandId: ''
			}
		}
	},
	// beforeCreate生命周期期间为创建前，vue的实例还没有创建出来，因此无法读取到data中的数据 created为创建后，可用读取到data中的实例
	created() {
		this.getListData()
	},
	methods: {
		getListData() {
			this.listLoading = true
			getRefundApprovalForm(this.listQuery).then((res) => {
				this.list = res.data.limit
				this.total = res.data.total
				this.listLoading = false
			})
				.catch((err) => {
					window.console.log(err)
				})
		},
		updateData(row, status, operation) {
			this.$confirm(
				'确认要进行此操作?' + operation,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					// 审核申请表
					fetAuditOperation({
						id: row.id,
						status,
						reason: '',
						private: ''
					})
						.then((response) => {
							this.$message({
								showClose: true,
								message: '操作成功',
								type: 'success'
							})
							window.console.log(response)
							this.getListData()
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
