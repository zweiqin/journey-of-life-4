<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="listQuery.memberName" clearable size="small" class="filter-item"
				style="width: 200px"
				placeholder="请输入分销员名称"
			/>
			<el-select
				v-model="listQuery.distributionStatus" clearable placeholder="请选择" filterable
				size="small"
				class="filter-item"
			>
				<el-option label="申请中" value="APPLY" />
				<el-option label="已清退" value="RETREAT" />
				<el-option label="审核拒绝" value="REFUSE" />
				<el-option label="审核通过" value="PASS" />
			</el-select>
			<el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="getListData">
				查找
			</el-button>
		</div>
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" height="100%" :data="list" size="small"
				element-loading-text="正在查询中。。。" border fit
				highlight-current-row
			>
				<el-table-column min-width="60px" align="center" label="ID" prop="id" sortable />
				<el-table-column min-width="120px" align="center" label="层级" prop="level" sortable />
				<el-table-column min-width="120px" align="center" label="创建者ID" prop="createBy" sortable />
				<el-table-column min-width="130px" align="center" label="创建时间" prop="createTime">
					<template slot-scope="scope">
						{{ new Date(scope.row.createTime).toLocaleString() || '--' }}
					</template>
				</el-table-column>
				<el-table-column min-width="120px" align="center" label="更新者ID" prop="updateBy" />
				<el-table-column min-width="130px" align="center" label="创建时间" prop="updateTime">
					<template slot-scope="scope">
						{{ new Date(scope.row.updateTime).toLocaleString() || '--' }}
					</template>
				</el-table-column>
				<el-table-column min-width="120px" align="center" label="分销码" prop="distributionCode" />
				<el-table-column min-width="120px" align="center" label="可提现金额" prop="canRebate" />
				<el-table-column min-width="120px" align="center" label="冻结金额" prop="commissionFrozen" />
				<el-table-column min-width="120px" align="center" label="状态" prop="distributionStatus">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.distributionStatus === 'APPLY'">申请中</el-tag>
						<el-tag v-if="scope.row.distributionStatus === 'RETREAT'" type="info">已清退</el-tag>
						<el-tag v-if="scope.row.distributionStatus === 'REFUSE'" type="danger">审核拒绝</el-tag>
						<el-tag v-if="scope.row.distributionStatus === 'PASS'" type="success">审核通过</el-tag>
					</template>
				</el-table-column>
				<el-table-column min-width="120px" align="center" label="用户ID" prop="memberId" />
				<el-table-column min-width="120px" align="center" label="用户名称" prop="memberName" />
				<el-table-column min-width="120px" align="center" label="分销总额" prop="rebateTotal" />
				<el-table-column min-width="200px" align="center" label="身份证号" prop="idNumber" />
				<el-table-column min-width="120px" align="center" label="姓名" prop="name" />
				<el-table-column min-width="120px" align="center" label="分销订单数" prop="distributionOrderCount" />
				<el-table-column min-width="120px" align="center" label="关联银行名称" prop="settlementBankAccountName" />
				<el-table-column min-width="180px" align="center" label="银行卡号" prop="settlementBankAccountNum" />
				<el-table-column min-width="120px" align="center" label="支行名称" prop="settlementBankBranchName" />
				<el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/dtsDistribution/getByPage' ]" type="primary"
							@click="updateData(scope.row, 'PASS', '通过申请')"
						>
							同意申请
						</el-button>
						<el-button
							v-permission="[ 'GET /admin/dtsDistribution/getByPage' ]" type="danger"
							@click="updateData(scope.row, 'REFUSE', '退回申请')"
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
import { distributionGetByPage, distributionSelectedAudit } from '@/api/configurationTable/distribution'
export default {
	name: 'DistributorReviewed',
	data() {
		return {
			list: [],
			listLoading: true,
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
				status: 'PASS',
				distributionStatus: '',
				memberName: ''
			}
		}
	},
	created() {
		this.getListData()
	},
	methods: {
		getListData() {
			this.listLoading = true
			distributionGetByPage(this.listQuery)
				.then((res) => {
					this.list = res.data.records
					this.total = res.data.total
					this.listLoading = false
				})
				.catch((err) => {
					console.log(err)
				})
		},
		updateData(row, status, operation) {
			this.$confirm(
				`确认要进行【${operation}】操作吗？`,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					distributionSelectedAudit({
						id: row.id,
						status
					})
						.then((response) => {
							this.$message({
								showClose: true,
								message: '操作成功',
								type: 'success'
							})
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

<style lang="scss" scoped></style>
