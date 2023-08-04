<template>
	<div class="app-container">
		<div class="filter-container">
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
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%"
				highlight-current-row
			>
				<el-table-column align="center" width="150px" label="建议ID" prop="id" sortable />
				<el-table-column align="center" min-width="100px" label="建议类型" prop="typeStr" />
				<el-table-column align="center" min-width="100px" label="问题描述" prop="describe" />
				<el-table-column align="center" min-width="100px" label="用户ID" prop="userId" />
				<el-table-column align="center" property="picUrl" label="反馈图片">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.picUrl" :src="common.seamingImgUrl(scope.row.picUrl)"
							style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.picUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="状态" prop="statusType">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.type == 0" type="warning">待处理</el-tag>
						<el-tag v-else-if="scope.row.type == 1" type="success">已处理</el-tag>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="有用无用比" prop="statistics" />
				<el-table-column align="center" min-width="100px" label="反馈号码" prop="phone" />
				<el-table-column align="center" min-width="100px" label="创建时间" prop="creatTime" />
				<el-table-column align="center" label="操作" width="60" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/dtsCustomerFeedback/updateStatus' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							审核
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
			@pagination="getList"
		/>

		<!-- 处理建议对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="是否通过" prop="statusType">
					<el-radio-group v-model="dataForm.statusType">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { customerFeedbackList, customerFeedbackUpdateStatus } from '@/api/customerServiceSystem/suggestionsList'
import Pagination from '@/components/Pagination'

export default {
	name: 'SuggestionsList',
	components: { Pagination },
	data() {
		return {
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				size: 20
			},
			dataForm: {
				id: '',
				statusType: ''
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				statusType: [ { required: true, message: '请选择是否通过', trigger: 'blur' } ]
			},
			downloadLoading: false
		}
	},
	computed: {},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			customerFeedbackList(this.listQuery)
				.then((response) => {
					this.list = response.data.limit
					this.total = response.data.total
					this.listLoading = false
				})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		resetForm() {
			this.dataForm = {
				id: '',
				statusType: ''
			}
		},
		handleUpdate(row) {
			this.dataForm = Object.assign({}, {
				id: row.id,
				statusType: row.statusType
			})
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					customerFeedbackUpdateStatus(this.dataForm)
						.then(() => {
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '操作成功'
							})
							this.getList()
						})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['建议ID', '建议类型', '问题描述', '用户ID', '反馈图片', '状态', '有用无用比', '反馈号码', '创建时间']
				const filterVal = ['id', 'typeStr', 'describe', 'userId', 'picUrl', 'statusType', 'statistics', 'phone', 'creatTime']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '建议列表')
				this.downloadLoading = false
			})
		}
	}
}
</script>

