<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.username" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入用户名"
			/>
			<el-input
				v-model="listQuery.mobile" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入手机号"
			/>
			<el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
				border fit height="100%"
				highlight-current-row
			>
				<el-table-column align="center" width="100px" label="用户ID" prop="id" sortable />

				<el-table-column align="center" label="用户名" prop="nickname" />

				<el-table-column align="center" label="手机号码" prop="mobile" />

				<el-table-column align="center" label="性别" prop="gender">
					<template slot-scope="scope">
						{{ genderDic[scope.row.gender] }}
					</template>
				</el-table-column>

				<el-table-column align="center" property="avatar" label="用户头像">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="生日" prop="birthday" />

				<el-table-column align="center" label="用户等级" prop="userLevel">
					<template slot-scope="scope">
						{{ levelDic[scope.row.userLevel] }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="状态" prop="status">
					<template slot-scope="scope">
						{{ statusDic[scope.row.status] }}
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
					<template slot-scope="scope">
					<el-button v-permission="['GET /admin/user/detailApprove']" v-if="scope.row.status==0 && scope.row.userLevel==2" type="primary" size="mini" @click="handleDetail(scope.row)">推广代理</el-button>
					<el-button v-permission="['POST /admin/user/approveAgency']" v-else-if="scope.row.status==3" type="primary" size="mini" @click="handleApproveAgency(scope.row)">审批</el-button>
					<el-button v-permission="['GET /admin/user/detailApprove']" v-else type="info" size="mini" >非代理</el-button>
					</template>
					</el-table-column> -->

			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 详情对话框 -->
		<el-dialog :visible.sync="detailDialogVisible" title="代理详情" width="700">
			<el-form :data="agencyDetail" label-position="left">
				<el-form-item label="佣金比例(%)">
					<span>{{ agencyDetail.settlementRate }}</span>
				</el-form-item>
				<el-form-item label="推广二维码">
					<el-image v-if="agencyDetail.shareUrl" :src="common.seamingImgUrl(agencyDetail.shareUrl)" style="width:80px; height:80px" fit="cover" :preview-src-list="[ common.seamingImgUrl(agencyDetail.shareUrl) ]" />
					<span v-else>--</span>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 代理审批 -->
		<el-dialog :visible.sync="approveDialogVisible" title="代理审批">
			<el-form
				ref="approveForm" :model="approveForm" status-icon label-position="left"
				label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="佣金比例(%)" prop="settlementRate">
					<el-input v-model="approveForm.settlementRate" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="approveDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmApprove">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { fetchList, approveAgency, detailApprove } from '@/api/business/user'
import Pagination from '@/components/Pagination'

export default {
	name: 'User',
	components: { Pagination },
	data() {
		return {
			list: null,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				username: undefined,
				mobile: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			downloadLoading: false,
			genderDic: ['未知', '男', '女'],
			levelDic: ['普通用户', 'VIP用户', '代理'],
			statusDic: ['可用', '禁用', '注销', '代理申请'],
			detailDialogVisible: false,
			agencyDetail: {},
			approveDialogVisible: false,
			approveForm: {
				userId: undefined,
				settlementRate: undefined
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			fetchList(this.listQuery).then((res) => {
				this.list = res.data.items
				this.total = res.data.total
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
		handleDetail(row) {
			this.agencyDetail = {
				shareUrl: undefined,
				settlementRate: undefined
			}
			detailApprove(row.id).then((res) => {
				this.agencyDetail = res.data
			})
			this.detailDialogVisible = true
		},
		handleApproveAgency(row) {
			this.approveForm.userId = row.id

			this.approveDialogVisible = true
			this.$nextTick(() => {
				this.$refs.approveForm.clearValidate()
			})
		},
		confirmApprove() {
			this.$refs.approveForm.validate((valid) => {
				if (valid) {
					approveAgency(this.approveForm).then((res) => {
						this.approveDialogVisible = false
						this.$notify.success({
							title: '成功',
							message: '审批成功'
						})
						this.getList()
					})
						.catch((err) => {
							this.$notify.error({
								title: '审批失败',
								message: err.data.errmsg
							})
						})
				}
			})
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
				const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>
