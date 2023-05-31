<template>
	<div class="app-container">
		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" label="编号" prop="id" sortable />

			<el-table-column align="center" label="代金券描述" prop="desc" />

			<el-table-column align="center" label="购买支付比例" prop="ratio" />

			<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/voucher/update' ]" type="primary" size="mini"
						@click="handleUpdate(scope.row)"
					>
						编辑
					</el-button>
					<!-- <el-button
						v-permission="['POST /admin/admin/delete']"
						type="danger"
						size="mini"
						@click="handleDelete(scope.row)"
						>删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>

				<el-form-item v-if="dialogStatus != 'create'" label="编号" prop="id">
					{{ dataForm.id }}
				</el-form-item>

				<el-form-item label="代金券描述" prop="desc">
					<el-input v-model="dataForm.desc" />
				</el-form-item>
				<el-form-item label="购买支付比例" prop="ratio">
					<el-input v-model="dataForm.ratio" />
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">
					确定
				</el-button>
				<el-button v-else type="primary" @click="updateData">
					确定
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listGet, listEdit } from '@/api/configurationTable/coupon'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
	name: 'Coupon',
	components: { Pagination },
	data() {
		return {
			listLoading: true,
			list: [],
			total: 0,
			listQuery: {},
			dataForm: {
				id: undefined,
				desc: undefined,
				ratio: undefined,
				enabled: 1
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				desc: [
					{ required: true, message: '代金券描述不能为空', trigger: 'blur' }
				],
				ratio: [ { required: true, message: '购买支付比例不能为空', trigger: 'blur' } ]
			}
		}
	},
	computed: {
		headers() {
			return {
				'X-Dts-Admin-Token': getToken()
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listGet(this.listQuery)
				.then((response) => {
					this.list = [ response.data ]
					this.total = 1
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
				id: undefined,
				desc: undefined,
				ratio: undefined,
				enabled: 1
			}
		},
		handleUpdate(row) {
			this.resetForm()
			this.dataForm = Object.assign({}, row)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				// 消除表单校验
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					listEdit(this.dataForm)
						.then((response) => {
							for (const v of this.list) {
								if (v.id === this.dataForm.id) {
									const index = this.list.indexOf(v)
									this.list.splice(index, 1, this.dataForm)
									break
								}
							}
							this.dialogFormVisible = false
							this.$notify.success({
								title: response.data.errmsg,
								message: response.data
							})
						})
						.catch((response) => {
							this.$notify.error({
								title: response.data.errmsg,
								message: response.data
							})
						})
				}
			})
		}
	}
}
</script>

<style scoped></style>
