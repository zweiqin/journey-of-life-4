<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入业务员名称"
			/>
			<el-button
				v-permission="[ 'GET /admin/brandSalesman/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/brandSalesman/add' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" min-width="50px" label="ID" prop="id" sortable />

			<el-table-column align="center" min-width="100px" label="所属门店id" prop="brandId" />

			<el-table-column align="center" min-width="100px" label="系统账户id" prop="adminId" />

			<el-table-column align="center" min-width="100px" label="上级id" prop="bid" />

			<el-table-column align="center" min-width="100px" label="姓名" prop="name" />

			<el-table-column align="center" min-width="50px" label="性别" prop="gender">
				<template slot-scope="scope">
					{{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '未知' }}
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="150px" label="联系电话" prop="phone" />

			<el-table-column
				align="center" min-width="160px" label="入职时间" prop="entryDate"
				value-format="yyyy-MM-dd HH:mm:ss"
			/>

			<el-table-column align="center" min-width="100px" label="状态" prop="status">
				<template slot-scope="scope">
					{{
						scope.row.status === -1 ? '离职' : scope.row.status === 0 ? '全职在职' : scope.row.status === 1 ? '兼职在职'
							: scope.row.status === 2 ? '其他' : '异常'
					}}
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="100px" label="业务员类型" prop="type">
				<template slot-scope="scope">
					{{ scope.row.type === 0 ? '普通业务员' : scope.row.type === 1 ? '高级业务员' : '异常' }}
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="100px" label="所得佣金" prop="commission" />

			<el-table-column align="center" min-width="100px" label="抽佣比例" prop="commissionRate" />

			<el-table-column align="center" min-width="100px" label="所属会员ID" prop="userId" />

			<el-table-column align="center" label="操作" min-width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/brandSalesman/update' ]" type="primary" size="mini"
						@click="handleUpdate(scope.row)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="[ 'POST /admin/brandSalesman/delete' ]" type="danger" size="mini"
						@click="handleDelete(scope.row)"
					>
						删除
					</el-button>
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
				label-position="left" label-width="200px"
				style="width: 500px; margin-left:50px;"
			>
				<el-form-item v-if="dialogStatus !== 'create'" label="ID" prop="id">
					{{ dataForm.id }}
					<!-- <el-input v-model="dataForm.id" /> -->
				</el-form-item>

				<el-form-item label="账户名" prop="username">
					<el-input v-model="dataForm.username" />
				</el-form-item>

				<el-form-item label="密码" prop="password">
					<el-input v-model="dataForm.password" show-password />
				</el-form-item>

				<el-form-item label="头像" prop="avatar">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadAvatar"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.avatar" class="avatar" :src="common.seamingImgUrl(dataForm.avatar)" style=""
							fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.avatar) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="所属门店" prop="brandId">
					<el-select v-model="dataForm.brandId" placeholder="请选择" filterable @change="getAdSalesman(dataForm.brandId)">
						<el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="所属上级" prop="bid">
					<el-select
						v-model="dataForm.bid" :disabled="selectBrandId !== '' ? false : true" placeholder="请选择" filterable
						clearable
					>
						<el-option v-for="item in AdSalesmanOptions" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="姓名" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>

				<el-form-item label="性别" prop="gender">
					<el-select v-model="dataForm.gender" placeholder="请选择" filterable>
						<el-option v-for="item in sexOptions" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="电话" prop="phone" oninput="value=value.replace(/^0|[^\d]/g,'')">
					<el-input v-model="dataForm.phone" />
				</el-form-item>

				<el-form-item label="抽佣比例(%)" prop="commissionRate" oninput="value=value.replace(/^0|[^\d]/g,'')">
					<div
						:style="{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }"
					>
						<el-input v-model="dataForm.commissionRate" :style="{ width: '50%' }" />%
					</div>
				</el-form-item>

				<el-form-item label="入职日期" prop="entryDate">
					<el-date-picker
						v-model="dataForm.entryDate" type="date" placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					/>
				</el-form-item>

				<el-form-item label="离职日期" prop="leaveDate">
					<el-date-picker
						v-model="dataForm.leaveDate" type="date" placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					/>
				</el-form-item>

				<el-form-item label="状态" prop="status">
					<el-select v-model="dataForm.status" placeholder="请选择" filterable>
						<el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="业务员类型" prop="type">
					<el-select v-model="dataForm.type" placeholder="请选择" filterable>
						<el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="居住地址" prop="address">
					<el-input v-model="dataForm.address" />
				</el-form-item>

				<el-form-item label="身份证正面" prop="idcardProsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardProsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.idcardProsUrl" class="avatar" :src="common.seamingImgUrl(dataForm.idcardProsUrl)"
							style="" fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.idcardProsUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="身份证反面" prop="idcardConsUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadIdcardConsUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.idcardConsUrl" class="avatar" :src="common.seamingImgUrl(dataForm.idcardConsUrl)"
							style="" fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.idcardConsUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="描述" prop="desc">
					<el-input v-model="dataForm.desc" />
				</el-form-item>

				<el-form-item label="绑定的会员id" prop="userId">
					<el-input v-model="dataForm.userId" @change="userGet(dataForm.userId)" />
					{{ dataForm.nickname !== null ? dataForm.nickname : '未找到该会员!' }}
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
				<el-button v-else type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listGet, listDelete, listAdd, listUpdate, userGet, brandGet } from '@/api/salesManagement/salesManagement'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/login'
import Pagination from '@/components/Pagination'

export default {
	name: 'SalesManagement',
	components: { Pagination },
	data() {
		return {
			selectBrandId: '',
			sexOptions: [
				{
					id: 0,
					name: '未知'
				},
				{
					id: 1,
					name: '男'
				},
				{
					id: 2,
					name: '女'
				}
			],
			statusOptions: [
				{
					id: -1,
					name: '离职'
				},
				{
					id: 0,
					name: '全职在职'
				},
				{
					id: 1,
					name: '兼职在职'
				},
				{
					id: 2,
					name: '其他'
				}
			],
			typeOptions: [
				{
					id: 0,
					name: '普通业务员'
				},
				{
					id: 1,
					name: '高级业务员'
				}
			],
			brandOptions: [],
			AdSalesmanOptions: [],
			uploadPath,
			list: undefined,
			total: 0,
			categoryList: [],
			adminList: [],
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				name: undefined,
				brandId: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				username: undefined,
				password: null,
				avatar: undefined,
				brandId: undefined,
				bid: undefined,
				name: undefined,
				gender: undefined,
				phone: undefined,
				entryDate: undefined,
				leaveDate: undefined,
				status: undefined,
				type: undefined,
				address: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				desc: undefined,
				userId: undefined,
				commissionRate: undefined,
				nickname: undefined
			},
			dialogFormVisible: false,
			shareUrlDialogVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建',
				shareUrl: '店铺推广码'
			},
			rules: {
				username: [
					// { required: true, message: '账户名不能为空', trigger: 'blur' },
					{ pattern: /^[\w\u4e00-\u9fa5]{6,20}(?<!_)$/, message: '格式不正确，请用6~20位的字母或数字' }
				],
				password: [
					// { required: true, message: '密码不能为空', trigger: 'blur' },
					{ pattern: /^[\x00-\xff]{6,20}(?<!_)$/, message: '格式不正确，请用6~20位密码' }
				],
				name: [
					{ required: true, message: '名称不能为空', trigger: 'blur' }
				],
				status: [
					{ required: true, message: '状态不能为空', trigger: 'blur' }
				],
				type: [
					{ required: true, message: '业务员类型不能为空', trigger: 'blur' }
				],
				userId: [
					{ required: true, message: '所属会员不能为空', trigger: 'blur' }
				],
				commissionRate: [
					{ required: true, message: '抽佣比例不能为空', trigger: 'blur' }
				]
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
		this.getRoles()
	},
	mounted() {
		this.getbrand()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					if (response.data.roles[0] === '高级业务员') {
						this.$router.push({ name: 'subordinateManagement' })
					} else {
						this.getList()
					}
				})
		},
		getList() {
			this.listLoading = true
			listGet(this.listQuery)
				.then((response) => {
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
		uploadAvatar(response) {
			this.dataForm.avatar = response.data.url
		},
		uploadIdcardProsUrl(response) {
			this.dataForm.idcardProsUrl = response.data.url
		},
		uploadIdcardConsUrl(response) {
			this.dataForm.idcardConsUrl = response.data.url
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		resetForm() {
			this.dataForm = {
				username: undefined,
				password: null,
				avatar: undefined,
				brandId: undefined,
				bid: undefined,
				name: undefined,
				gender: undefined,
				phone: undefined,
				entryDate: undefined,
				leaveDate: undefined,
				status: undefined,
				type: undefined,
				address: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined,
				desc: undefined,
				userId: undefined,
				commissionRate: undefined,
				nickname: undefined
			}
		},
		handleCreate() {
			this.resetForm()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					listAdd(this.dataForm)
						.then((response) => {
							this.list.unshift(response.data)
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '创建成功'
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
		handleUpdate(row) {
			this.dataForm = Object.assign({}, row)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					listUpdate(this.dataForm)
						.then(() => {
							for (const v of this.list) {
								if (v.id === this.dataForm.id) {
									const index = this.list.indexOf(v)
									this.list.splice(index, 1, this.dataForm)
									break
								}
							}
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '更新成功'
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
		handleDelete(row) {
			listDelete(row)
				.then((response) => {
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
		getAdSalesman(id, name = undefined) {
			this.selectBrandId = id
			this.AdSalesmanOptions = []
			var data = {
				page: -1,
				brandId: id,
				type: 1,
				name
			}
			listGet(data)
				.then((response) => {
					this.AdSalesmanOptions = response.data.items
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},
		getbrand() {
			brandGet()
				.then((response) => {
					this.brandOptions = response.data.items
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},
		userGet(condition) {
			userGet({ condition })
				.then((response) => {
					if (response.data.items !== null) {
						this.dataForm.nickname = response.data.items[0].nickname
					}
				})
				.catch((response) => {
					this.dataForm.nickname = null
				})
		}
	}
}
</script>

<style lang="scss" scoped>
/deep/ .avatar-uploader {
	.el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.el-upload:hover {
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
}
</style>
