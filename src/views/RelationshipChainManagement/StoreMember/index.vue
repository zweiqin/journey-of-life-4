<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入账号或名称" @keyup.enter.native="handleFilter()"
			/>
			<el-button
				v-permission="[ '' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search"
				@click="handleFilter()"
			>
				查找
			</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				ref="administrator" v-loading="listLoading" :data="list" size="small"
				element-loading-text="正在查询中。。。" border height="100%"
				fit highlight-current-row @expand-change="expand"
			>

				<el-table-column type="expand">
					<template slot-scope="scope">
						<!-- 二级列表 -->
						<el-input
							v-model="listQueryId.username" clearable size="mini" class="filter-item"
							style="width: 200px;"
							placeholder="请输入名称" @keyup.enter.native="rowHandleFilter(scope.row)"
						/>
						<el-button
							v-permission="[ '' ]" size="mini" class="filter-item" type="primary"
							icon="el-icon-search"
							@click="rowHandleFilter(scope.row)"
						>
							查找
						</el-button>

						<el-table
							ref="salesman" v-loading="listIdLoading" :data="listId[scope.row.salesmanid + 'a']" size="small"
							element-loading-text="正在查询中。。。" border fit highlight-current-row
						>

							<el-table-column align="center" min-width="50" label="id" prop="id" sortable />

							<el-table-column align="center" min-width="170" label="会员账号" prop="username" />

							<el-table-column align="center" min-width="160" label="会员名称" prop="nickname" sortable />

							<el-table-column align="center" min-width="220" label="手机号码" prop="mobile" />

							<el-table-column :min-width="400 * $root.dw + 'px'" align="center" property="avatar" label="用户头像">
								<template slot-scope="scope">
									<div style="width:100%,height:100%">
										<el-image
											v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
											:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
										/>
										<span v-else>--</span>
									</div>
								</template>
							</el-table-column>

							<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
								<template slot-scope="scope">
									<el-button type="danger" @click="handleIdDelete(scope.row)">解绑</el-button>
								</template>
							</el-table-column>
						</el-table>

						<Pagination
							v-show="IdTotal[scope.row.salesmanid + 'a'] > 0" :total="Number(IdTotal[scope.row.salesmanid + 'a'])"
							:page.sync="listQueryId.page" :limit.sync="listQueryId.limit"
							@pagination="getListOfId(scope.row.salesmanid)"
						/>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="110" label="业务员id" prop="salesmanid" />

				<el-table-column align="center" min-width="170" label="业务员账号" prop="username" sortable />

				<el-table-column align="center" min-width="170" label="业务员昵称" prop="salesmanname" sortable />

				<el-table-column align="center" min-width="150" label="身份" prop="roleName" sortable />

				<el-table-column align="center" property="avatar" label="门店头像" min-width="150">
					<template slot-scope="scope">
						<div style="width:100%,height:100%">
							<el-image
								v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
								:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
							/>
							<span v-else>--</span>
						</div>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="170" label="已绑定会员">
					<template slot-scope="scope">
						<el-button type="primary" @click="$refs.administrator.toggleRowExpansion(scope.row)">查看</el-button>
					</template>
				</el-table-column>

				<el-table-column align="center" label="操作" width="360" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="success" @click="handleCreate(scope.row)">批量绑定</el-button>
						<el-button type="danger" @click="handleUpdate(scope.row)">批量解绑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 批量绑定对话框 -->
		<el-dialog :visible.sync="createDialogFormVisible" title="绑定操作">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="100px"
				style="width: 100%; margin-left:0;"
			>
				<el-form-item label="业务员ID" prop="salesmanid">
					{{ dataForm.salesmanid }}
				</el-form-item>

				<el-form-item label="业务员账号" prop="username">
					{{ dataForm.username }}
				</el-form-item>

				<el-form-item label="业务员昵称">
					{{ dataForm.salesmanName }}
				</el-form-item>

				<!-- 批量绑定 -->
				<el-form-item label="选择未绑会员">
					<el-input
						v-model="dataFormListQuery.name" clearable size="mini" class="filter-item"
						style="width: 200px;"
						placeholder="请输入名称" @keyup.enter.native="dialogHandleFilter()"
					/>
					<el-button
						v-permission="[ '' ]" size="mini" class="filter-item" type="primary"
						icon="el-icon-search"
						@click="dialogHandleFilter()"
					>
						查找
					</el-button>

					<el-table
						ref="salesman" v-loading="dataFormListLoading" :data="dataFormList" size="small"
						element-loading-text="正在查询中。。。" border fit highlight-current-row
						@selection-change="bindingDataFormSelectionChange"
					>

						<el-table-column align="center" width="40" type="selection" />

						<el-table-column align="center" min-width="50" label="id" prop="id" sortable />

						<el-table-column align="center" min-width="140" label="会员账号" prop="username" />

						<el-table-column align="center" min-width="100" label="会员名称" prop="nickname" />

						<el-table-column align="center" min-width="180" label="手机号码" prop="mobile" />

						<el-table-column :min-width="200 * $root.dw + 'px'" align="center" property="avatar" label="用户头像">
							<template slot-scope="scope">
								<div style="width:100%,height:100%">
									<el-image
										v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
										:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
									/>
									<span v-else>--</span>
								</div>
							</template>
						</el-table-column>

					</el-table>

					<Pagination
						v-show="addDataFormListTotal[bindingDataForm.salesmanId + 'a'] > 0"
						:total="Number(addDataFormListTotal[bindingDataForm.salesmanId + 'a'])" :page.sync="dataFormListQuery.page"
						:limit.sync="dataFormListQuery.limit" @pagination="GetUnbindingStore"
					/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createDialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="RelationshipListAdd()">确定</el-button>
			</div>
		</el-dialog>

		<!-- 批量解绑对话框 -->
		<el-dialog :visible.sync="updateDialogFormVisible" title="解绑操作">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="100px"
				style="width: 100%; margin-left:0;"
			>
				<el-form-item label="业务员ID" prop="salesmanid">
					{{ dataForm.salesmanid }}
				</el-form-item>

				<el-form-item label="业务员账号" prop="username">
					{{ dataForm.username }}
				</el-form-item>

				<el-form-item label="业务员昵称">
					{{ dataForm.salesmanName }}
				</el-form-item>

				<!-- 批量解绑 -->
				<el-form-item label="已绑定门店">
					<el-table
						ref="salesman" v-loading="listIdLoading" :data="listId[bindingDataForm.salesmanId + 'a']" size="small"
						element-loading-text="正在查询中。。。" border fit highlight-current-row
						@selection-change="bindingDataFormSelectionChange"
					>

						<el-table-column align="center" width="40" type="selection" />

						<el-table-column align="center" min-width="50" label="id" prop="id" sortable />

						<el-table-column align="center" min-width="140" label="会员账号" prop="username" />

						<el-table-column align="center" min-width="100" label="会员名称" prop="nickname" />

						<el-table-column align="center" min-width="180" label="手机号码" prop="mobile" />

						<el-table-column :min-width="200 * $root.dw + 'px'" align="center" property="avatar" label="用户头像">
							<template slot-scope="scope">
								<div style="width:100%;height:100%">
									<el-image
										v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
										:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
									/>
									<span v-else>--</span>
								</div>
							</template>
						</el-table-column>

					</el-table>

					<Pagination
						v-show="deleteDataFormListTotal[bindingDataForm.salesmanId + 'a'] > 0"
						:total="Number(deleteDataFormListTotal[bindingDataForm.salesmanId + 'a'])" :page.sync="dataFormListQuery.page"
						:limit.sync="dataFormListQuery.limit" @pagination="GetUnbindingStore"
					/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="updateDialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="RelationshipListDelete()">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
// 接口
import { listGet, adminGet, idGet, listDelete, listAdd } from '@/api/RelationshipChainManagement/StoreMember'
// import { getToken } from '@/utils/auth'
// 分页组件
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// 按需引入MessageBox，优点：不会失效，若使用this.$messageBox可能失效
import { MessageBox } from 'element-ui'

export default {
	name: 'StoreMember',
	components: { Pagination },
	data() {
		return {
			// 一级列表
			// 列表请求状态
			listLoading: false,
			// 列表数据
			list: [],
			// 列表页
			total: 0,
			// 列表请求参数配置
			listQuery: {
				// 基本分页参数
				page: 1,
				limit: 10,
				sort: 'add_time',
				order: 'desc',
				id: undefined,
				name: undefined
			},

			// 二级列表
			// 列表请求状态
			listIdLoading: false,
			// 二级列表数据
			listId: [],
			// 列表页
			IdTotal: [],
			// 列表请求参数配置
			listQueryId: {
				// 基本分页参数
				page: 1,
				limit: 10,
				sort: 'add_time',
				order: 'desc',
				// 门店id
				id: undefined,
				username: undefined
			},

			// 弹窗展示状态
			createDialogFormVisible: false,
			updateDialogFormVisible: false,
			// 弹窗表单数据
			// 批量新增或解除绑定关系请求参数配置
			bindingDataForm: {
				salesmanId: undefined,
				userId: []
			},
			dataForm: {
				salesmanid: undefined,
				username: undefined,
				salesmanName: undefined
			},
			dataFormList: [],
			// 弹窗列表状态
			dataFormListLoading: false,
			// 弹窗列表数据
			addDataFormListTotal: [],
			deleteDataFormListTotal: [],
			// 弹窗列表请求参数配置
			dataFormListQuery: {
				page: 1,
				limit: 10,
				sort: 'add_time',
				order: 'desc',
				name: undefined
			},
			// 表单校验
			rules: {
				// name: [
				//   { required: true, message: '门店名称不能为空', trigger: 'blur' }
				// ],
				// brandgenre: [
				//   { required: true, message: '门店类型不能为空', trigger: 'blur' }
				// ],
				// licenseUrl: [
				//   { required: true, message: '营业执照不能为空', trigger: 'blur' }
				// ],
				// idcardProsUrl: [
				//   { required: true, message: '法人身份证正面不能为空', trigger: 'blur' }
				// ],
				// idcardConsUrl: [
				//   { required: true, message: '法人身份证反面不能为空', trigger: 'blur' }
				// ],
				// address: [
				//   { required: true, message: '门店地址不能为空', trigger: 'blur' }
				// ]
			}
		}
	},
	created() {
		this.getList()
	},
	mounted() {
	},
	methods: {
		// 重置表单数据
		resetForm() {
			this.dataForm = {
				salesmanid: undefined,
				username: undefined,
				salesmanName: undefined
			}
		},

		// 获取所有业务员列表
		getList() {
			// 列表查询状态
			this.listLoading = true
			listGet(this.listQuery).then((response) => {
				// 设置列表数据
				this.list = response.data.items
				// 设置列表页
				this.total = response.data.total
				// 列表查询状态
				this.listLoading = false
			})
				.catch((response) => {
					MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
						confirmButtonText: '确定',
						type: 'error'
					})
					// 清空列表数据
					this.list = []
					// 清空列表页数
					this.total = 0
					// 列表查询状态
					this.listLoading = false
				})
		},

		// 二级菜单请求
		expand(row, expandedRows) {
			this.getListOfId(row.salesmanid)
		},

		// 通过门店id查询绑定的会员信息
		getListOfId(salesmanid) {
			this.listIdLoading = true
			this.listQueryId.id = salesmanid
			adminGet(this.listQueryId).then((response) => {
				// 设置列表数据
				if (response.data === '当前业务员未绑定任何会员') {
					this.$set(this.listId, salesmanid + 'a', [])
				} else {
					var arr = response.data.items
					for (let i = 0; i < arr.length; i++) {
						this.$set(arr[i], 'salesmanId', response.data.salesmanId)
					}
					this.$set(this.listId, salesmanid + 'a', arr)
				}
				// 设置列表页
				this.$set(this.IdTotal, salesmanid + 'a', response.data.total)
				this.$set(this.deleteDataFormListTotal, salesmanid + 'a', response.data.total)
				// this.IdTotal = response.data.total
				// this.deleteDataFormListTotal = response.data.total
				// 列表查询状态
				this.listIdLoading = false
			})
				.catch((response) => {
					console.log(response)
					// 清空列表数据
					this.$set(this.listId, salesmanid + 'a', [])
					// 清空列表页数
					this.$set(this.IdTotal, salesmanid + 'a', 0)
					// this.IdTotal = 0
					// 列表查询状态
					this.listIdLoading = false
				})
		},

		// 绑定按钮操作
		handleCreate(row) {
			// 获取未绑定的会员列表
			this.GetUnbindingStore()
			// 展示弹窗
			this.createDialogFormVisible = true
			// 表单校验移除
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
			// 弹窗赋值
			this.dataForm.salesmanid = row.salesmanid
			this.dataForm.username = row.username
			this.dataForm.salesmanName = row.salesmanname
			this.bindingDataForm.salesmanId = row.salesmanid
		},

		// 解绑按钮操作
		handleUpdate(row) {
			this.getListOfId(row.salesmanid)
			// this.dialogStatus = 'update'
			this.updateDialogFormVisible = true
			// 表单校验移除
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})

			// 弹窗赋值
			this.dataForm.salesmanid = row.salesmanid
			this.dataForm.username = row.username
			this.dataForm.salesmanName = row.salesmanname
			this.bindingDataForm.salesmanId = row.salesmanid
		},

		// 解除绑定关系
		handleIdDelete(row) {
			this.$confirm('此操作将解绑该账户关系信息, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const deleteData = {
					salesmanId: row.salesmanId,
					userId: [ row.id ]
				}
				listDelete(deleteData).then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除成功'
					})
					// 重新获取列表
					this.getListOfId(row.salesmanId)
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
						message: '已取消删除'
					})
				})
		},

		// 查询未绑定的会员
		GetUnbindingStore() {
			this.dataFormListLoading = true
			idGet(this.dataFormListQuery).then((response) => {
				this.$set(this.addDataFormListTotal, this.bindingDataForm.salesmanId + 'a', response.data.total)
				// this.$set(this.$data, 'addDataFormListTotal', response.data.total)
				this.$set(this.$data, 'dataFormList', response.data.items)
				this.dataFormListLoading = false
			})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
					// 清空列表数据
					this.dataFormList = []
					// 清空列表页数
					this.$set(this.addDataFormListTotal, this.bindingDataForm.salesmanId + 'a', response.data.total)
					// this.$set(this.$data, 'addDataFormListTotal', response.data.total)
					// 列表查询状态
					this.dataFormListLoading = false
				})
		},

		// 批量新增绑定关系
		RelationshipListAdd() {
			listAdd(this.bindingDataForm).then((response) => {
				this.$notify.success({
					title: '成功',
					message: '绑定成功'
				})
				// 重新获取列表
				this.GetUnbindingStore()
				this.getListOfId(this.bindingDataForm.salesmanId)
			})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},

		// 会员多选
		bindingDataFormSelectionChange(val) {
			this.bindingDataForm.userId = []
			for (let i = 0; i < val.length; i++) {
				this.bindingDataForm.userId.push(val[i].id)
			}
		},

		// 批量解除绑定关系
		RelationshipListDelete() {
			this.$confirm('此操作将解绑账户关系信息, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				listDelete(this.bindingDataForm).then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除成功'
					})
					// 重新获取列表
					this.getListOfId(this.bindingDataForm.salesmanId)
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
						message: '已取消删除'
					})
				})
		},

		// 一级查询
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},

		// 二级查询
		rowHandleFilter(row) {
			this.listQueryId.page = 1
			this.getListOfId(row.salesmanid)
		},

		// 弹窗查询
		dialogHandleFilter() {
			this.dataFormListQuery.page = 1
			this.GetUnbindingStore()
		}

	}
}
</script>

<style scoped>
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #20a0ff;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 120px;
	height: 120px;
	line-height: 120px;
	text-align: center;
}

.avatar {
	width: 145px;
	height: 145px;
	display: block;
}
</style>
