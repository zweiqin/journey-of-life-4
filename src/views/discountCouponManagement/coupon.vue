<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入优惠券标题"
			/>
			<el-select
				v-model="listQuery.type" clearable size="mini" style="width: 200px"
				class="filter-item"
				placeholder="请选择优惠券类型"
			>
				<el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
			</el-select>
			<el-select
				v-model="listQuery.status" clearable size="mini" style="width: 200px"
				class="filter-item"
				placeholder="请选择优惠券状态"
			>
				<el-option v-for="type in statusOptions" :key="type.value" :label="type.label" :value="type.value" />
			</el-select>
			<el-button
				v-permission="[ 'GET /admin/coupon/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/coupon/create' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
			<el-button
				:loading="downloadLoading" size="mini" class="filter-item" type="warning"
				icon="el-icon-download"
				@click="handleDownload"
			>
				导出
			</el-button>
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>

			<el-table-column align="center" min-width="100px" label="优惠券ID" prop="id" sortable />

			<el-table-column align="center" min-width="100px" label="优惠券名称" prop="name" />
			<!-- <el-table-column align="center" min-width="80px" label="介绍" prop="desc"/>

				<el-table-column align="center" min-width="100px" label="标签" prop="tag"/> -->
			<el-table-column align="center" min-width="100px" label="最低消费" prop="min">
				<template slot-scope="scope">满{{ scope.row.min }}元可用</template>
			</el-table-column>

			<el-table-column align="center" min-width="100px" label="满减金额" prop="discount">
				<template slot-scope="scope">减免{{ scope.row.discount }}元</template>
			</el-table-column>

			<el-table-column align="center" min-width="80px" label="每人限领" prop="limit">
				<template slot-scope="scope">{{ scope.row.limit != 0 ? scope.row.limit : "不限" }}</template>
			</el-table-column>

			<el-table-column align="center" min-width="100px" label="商品使用范围" prop="goodsType">
				<template slot-scope="scope">{{ scope.row.goodsType | formatGoodsType }}</template>
			</el-table-column>

			<el-table-column align="center" min-width="100px" label="优惠券类型" prop="type">
				<template slot-scope="scope">{{ scope.row.type | formatType }}</template>
			</el-table-column>

			<el-table-column align="center" min-width="120px" label="优惠券数量" prop="total" sortable>
				<template slot-scope="scope">{{ scope.row.total != 0 ? scope.row.total : "不限" }}</template>
			</el-table-column>

			<el-table-column align="center" min-width="60px" label="状态" prop="status">
				<template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
			</el-table-column>

			<el-table-column align="center" min-width="250px" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'GET /admin/coupon/read' ]" type="primary" size="mini"
						@click="handleDetail(scope.row)"
					>
						详情
					</el-button>
					<el-button
						v-permission="[ 'POST /admin/coupon/update' ]" type="info" size="mini"
						@click="handleUpdate(scope.row)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="[ 'POST /admin/coupon/delete' ]" type="danger" size="mini"
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
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="优惠券名称" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>
				<el-form-item label="介绍" prop="desc">
					<el-input v-model="dataForm.desc" />
				</el-form-item>
				<el-form-item label="标签" prop="tag">
					<el-input v-model="dataForm.tag" />
				</el-form-item>
				<el-form-item label="最低消费" prop="min">
					<el-input v-model="dataForm.min">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="满减金额" prop="discount">
					<el-input v-model="dataForm.discount">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="每人限领" prop="limit">
					<el-input v-model="dataForm.limit">
						<template #append>张</template>
					</el-input>
				</el-form-item>
				<el-form-item label="分发类型" prop="type">
					<el-select v-model="dataForm.type">
						<el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="优惠券数量" prop="total">
					<el-input v-model="dataForm.total">
						<template #append>张</template>
					</el-input>
				</el-form-item>
				<el-form-item label="有效期">
					<el-radio-group v-model="dataForm.timeType">
						<el-radio-button :label="0">领券相对天数</el-radio-button>
						<el-radio-button :label="1">指定绝对时间</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-show="dataForm.timeType === 0">
					<el-input v-model="dataForm.days">
						<template #append>天</template>
					</el-input>
				</el-form-item>
				<el-form-item v-show="dataForm.timeType === 1">
					<el-col :span="11">
						<el-date-picker
							v-model="dataForm.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
							style="width: 100%;"
						/>
					</el-col>
					<el-col :span="2" class="line">
						至
					</el-col>
					<el-col :span="11">
						<el-date-picker
							v-model="dataForm.endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
							style="width: 100%;"
						/>
					</el-col>
				</el-form-item>
				<el-form-item label="商品限制范围">
					<el-radio-group v-model="dataForm.goodsType">
						<el-radio-button :label="0">全场通用</el-radio-button>
						<el-radio-button :label="1">指定分类</el-radio-button>
						<el-radio-button :label="2">指定商品</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-show="dataForm.goodsType === 1">
					目前不支持
				</el-form-item>
				<el-form-item v-show="dataForm.goodsType === 2">
					目前不支持
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
import { listCoupon, createCoupon, updateCoupon, deleteCoupon } from '@/api/business/coupon'
import { getUserInfo } from '@/api/login'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

const defaultTypeOptions = [
	{
		label: '通用领券',
		value: 0
	},
	{
		label: '注册赠券',
		value: 1
	},
	{
		label: '兑换码',
		value: 2
	},
	{
		label: '购物赠券',
		value: 3
	}
]

const defaultStatusOptions = [
	{
		label: '正常',
		value: 0
	},
	{
		label: '已过期',
		value: 1
	},
	{
		label: '已下架',
		value: 2
	}
]

export default {
	name: 'Coupon',
	components: { Pagination },
	filters: {
		formatType(type) {
			for (let i = 0; i < defaultTypeOptions.length; i++) {
				if (type === defaultTypeOptions[i].value) {
					return defaultTypeOptions[i].label
				}
			}
			return ''
		},
		formatGoodsType(goodsType) {
			if (goodsType === 0) {
				return '全场通用'
			} else if (goodsType === 1) {
				return '指定分类'
			}
			return '指定商品'
		},
		formatStatus(status) {
			if (status === 0) {
				return '正常'
			} else if (status === 1) {
				return '已过期'
			}
			return '已下架'
		}
	},
	data() {
		return {
			typeOptions: Object.assign({}, defaultTypeOptions),
			statusOptions: Object.assign({}, defaultStatusOptions),
			list: undefined,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				name: undefined,
				type: undefined,
				status: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				name: undefined,
				desc: undefined,
				tag: undefined,
				total: 0,
				discount: 0,
				min: 0,
				limit: 1,
				type: 0,
				status: 0,
				goodsType: 0,
				// goodsValue: [],
				timeType: 0,
				days: 0,
				startTime: null,
				endTime: null
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				name: [
					{ required: true, message: '优惠券标题不能为空', trigger: 'blur' }
				]
			},
			downloadLoading: false
		}
	},
	created() {
		this.getRoles()
		// this.getList()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					if (response.data.roles[0] === '超级管理员') {
						this.$router.push({ name: 'brandCoupon' })
					} else if (response.data.roles[0] === '会员商户') {
						this.getList()
					}
				})
				.catch()
		},
		getList() {
			this.listLoading = true
			listCoupon(this.listQuery)
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
		},
		resetForm() {
			this.dataForm = {
				id: undefined,
				name: undefined,
				desc: undefined,
				tag: undefined,
				total: 0,
				discount: 0,
				min: 0,
				limit: 1,
				type: 0,
				status: 0,
				goodsType: 0,
				// goodsValue: [],
				timeType: 0,
				days: 0,
				startTime: null,
				endTime: null
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
					createCoupon(this.dataForm)
						.then((response) => {
							this.getList()
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '创建优惠券成功'
							})
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
				if (this.dataForm.days === 0) {
					this.dataForm.daysType = 1
				} else {
					this.dataForm.daysType = 0
				}
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					updateCoupon(this.dataForm)
						.then(() => {
							this.getList()
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '更新优惠券成功'
							})
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
			deleteCoupon(row)
				.then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除优惠券成功'
					})
					this.getList()
				})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		},
		handleDetail(row) {
			this.$router.push({ name: 'couponDetail', query: { id: row.id } })
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = [
					'优惠券ID',
					'名称',
					'内容',
					'标签',
					'最低消费',
					'减免金额',
					'每人限领',
					'优惠券数量'
				]
				const filterVal = [
					'id',
					'name',
					'desc',
					'tag',
					'min',
					'discount',
					'limit',
					'total'
				]
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '优惠券信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>
