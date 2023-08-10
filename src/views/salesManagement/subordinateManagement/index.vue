<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<!-- <el-input
				v-model="listQuery.id"
				clearable
				size="mini"
				class="filter-item"
				style="width: 200px;"
				placeholder="请输入ID"
				/> -->
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入材料名称"
			/>
			<el-button
				v-permission="[ 'GET /admin/pricesView/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<!-- <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">导出</el-button> -->
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
				align="center" min-width="150px" label="入职时间" prop="entryDate"
				value-format="yyyy-MM-dd HH:mm:ss"
			/>

			<el-table-column align="center" min-width="100px" label="状态" prop="status">
				<template slot-scope="scope">
					{{ scope.row.status === -1 ? '离职' : scope.row.status === 0 ? '全职在职' : scope.row.status === 1 ? '兼职在职'
						: scope.row.status === 2 ? '其他' : '异常' }}
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

		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 添加或修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="150px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item v-if="dialogStatus !== 'create'" label="ID" prop="id">
					{{ dataForm.id }}
				</el-form-item>

				<el-form-item label="类名" prop="materialsCategory">
					<el-input v-model="dataForm.materialsCategory" />
				</el-form-item>

				<el-form-item label="品名" prop="materialsName">
					<el-input v-model="dataForm.materialsName" />
				</el-form-item>

				<el-form-item label="规格" prop="materialsSku">
					<el-input v-model="dataForm.materialsSku" />
				</el-form-item>

				<el-form-item label="材质" prop="materialsTexture">
					<el-input v-model="dataForm.materialsTexture" />
				</el-form-item>

				<el-form-item label="品质" prop="materialsQuality">
					<el-input v-model="dataForm.materialsQuality" />
				</el-form-item>

				<el-form-item label="价格" prop="materialsMoney" oninput="value=value.replace(/^0|[^\d]/g,'')">
					<el-input v-model="dataForm.materialsMoney" />
				</el-form-item>

				<el-form-item label="单位" prop="materialsUnit" oninput="value=value.replace(/^0|[^\d]/g,'')">
					<el-input v-model="dataForm.materialsUnit" />
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
import { listGet } from '@/api/salesManagement/subordinateManagement'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/login'
import Pagination from '@/components/Pagination'

export default {
	name: 'SubordinateManagement',
	components: { Pagination },
	data() {
		return {
			TypeOptions: [],
			list: undefined,
			total: 0,
			categoryList: [],
			adminList: [],
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				id: undefined,
				name: undefined,
				status: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				brandId: undefined,
				adminId: undefined,
				bid: undefined,
				name: undefined,
				username: undefined,
				password: null,
				avatar: undefined,
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
				materialsCategory: [
					{ required: true, message: '类名不能为空', trigger: 'blur' }
				],
				materialsMoney: [
					{ required: true, message: '价格不能为空', trigger: 'blur' }
				],
				materialsName: [
					{ required: true, message: '品名不能为空', trigger: 'blur' }
				],
				materialsSku: [
					{ required: true, message: '规格不能为空', trigger: 'blur' }
				],
				materialsTexture: [
					{ required: true, message: '材质不能为空', trigger: 'blur' }
				],
				materialsQuality: [
					{ required: true, message: '品质不能为空', trigger: 'blur' }
				],
				materialsLastmoney: [
					{ required: true, message: '不能为空', trigger: 'blur' }
				],
				materialsUnit: [
					{ required: true, message: '单位不能为空', trigger: 'blur' }
				]
			},
			downloadLoading: false
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
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					this.getList()
				})
				.catch()
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
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		}
	}
}
</script>
