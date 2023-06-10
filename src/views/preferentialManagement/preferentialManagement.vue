<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="select_preferentia">
			<div class="filter-container">
				<div v-show="isMerchant">
					<el-input
						v-model="merchantListQuery.brandId"
						clearable
						size="mini"
						class="filter-item"
						style="width: 200px"
						placeholder="店家ID"
					/>
					<el-input
						v-model="merchantListQuery.name"
						clearable
						size="mini"
						class="filter-item"
						style="width: 200px"
						placeholder="优惠卷名字"
					/>
					<el-input
						v-model="merchantListQuery.type"
						clearable
						size="mini"
						class="filter-item"
						style="width: 200px"
						placeholder="店家类型"
					/>
					<el-input
						v-model="merchantListQuery.status"
						clearable
						size="mini"
						class="filter-item"
						style="width: 200px"
						placeholder="店家状态"
					/>
				</div>
				<div v-show="!isMerchant">
					<el-input
						v-model="userListQuery.userId"
						clearable
						size="mini"
						class="filter-item"
						style="width: 200px"
						placeholder="用户ID"
					/>
					<el-input
						v-model="userListQuery.couponId"
						clearable
						size="mini"
						class="filter-item"
						style="width: 200px"
						placeholder="优惠卷ID"
					/>
					<el-input
						v-model="userListQuery.status"
						clearable
						size="mini"
						class="filter-item"
						style="width: 200px"
						placeholder="状态"
					/>
				</div>
				<div class="el-button-item">
					<el-radio v-model="isMerchant" :label="true">查找商家优惠卷</el-radio>
					<el-radio v-model="isMerchant" :label="false">查找用户优惠卷</el-radio>
				<!-- <el-button
					v-permission="[ 'GET /admin/circula/list' ]" size="mini" class="filter-item" type="primary"
					icon="el-icon-search" @click="isMerchant = true"
					>
					查找优惠卷
					</el-button> -->
				</div>
				<el-button
					style="margin-left: 1.0417vw"
					size="mini"
					class="filter-item"
					type="primary"
					icon="el-icon-search"
					@click="selectFromData"
				>
					查找优惠卷
				</el-button>
				<el-button
					v-show="isMerchant"
					style="margin-left: 1.0417vw"
					size="mini"
					class="filter-item"
					type="primary"
					icon="el-icon-edit"
					@click="ClearData"
				>
					添加优惠卷
				</el-button>
			</div>
		</div>
		<!-- 查询结果 -->
		<div v-show="isMerchant" v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="90%"
				highlight-current-row
			>
				<el-table-column align="center" min-width="30px" max-width="40px" label="门店ID" prop="brandId" sortable />
				<el-table-column align="center" min-width="30px" max-width="40px" label="优惠卷ID" prop="id" sortable />
				<el-table-column align="center" min-width="50px" max-width="70px" label="简介" prop="desc" />
				<el-table-column align="center" min-width="50px" max-width="70px" label="优惠卷名字" prop="name" />
				<el-table-column align="center" min-width="50px" max-width="70px" label="使用限制提示" prop="tag" />
				<el-table-column align="center" min-width="50px" max-width="70px" label="优惠金额" prop="discount" />
				<el-table-column align="center" min-width="100px" max-width="120px" prop="brandgenre" label="优惠卷状态 / 优惠卷类型 / 限制领取张数">
					<template slot-scope="scope">
						<el-tag>
							{{ scope.row.status === 0
								? '正常使用'
								: scope.row.status === 1
									? '已过期'
									: scope.row.status === 2
										? '已下架'
										: '' }}
						</el-tag>
						<el-tag>
							{{ scope.row.type === 0
								? '通用卷'
								: scope.row.type === 1
									? '注册赠卷'
									: scope.row.type === 2
										? '优惠码兑换卷'
										: '暂无' }}
						</el-tag>
						<el-tag>
							{{ scope.row.limit === 0
								? '无限制'
								: scope.row.limit === 1
									? '限领一张'
									: '限制领取' + scope.row.limit + '张' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="50px" max-width="80px" prop="brandgenre" label="生效时间">
					<template slot-scope="scope">
						{{ scope.row.startTime }}&nbsp;&nbsp;--&nbsp;&nbsp;{{ scope.row.endTime }}
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="50px" max-width="50px" label="剩余数量" prop="total" />
				<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'POST /admin/brand/update' ]" type="primary" size="mini"
							@click="UpdataFrom(scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/brand/delete' ]" type="danger" size="mini"
							@click="handleDelete(scope.row)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				v-show="total > 0" :total="total" :page.sync="merchantListQuery.page" :limit.sync="merchantListQuery.limit"
				@pagination="selectFromData"
			/>
		</div>
		<!-- 用户优惠卷 -->
		<div v-show="!isMerchant" v-tableHeight>
			<el-table
				v-loading="listLoading" :data="userList" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%"
				highlight-current-row
			>
				<el-table-column align="center" min-width="50px" max-width="70px" label="ID" prop="id" />
				<el-table-column align="center" min-width="30px" max-width="40px" label="用户ID" prop="userId" sortable />
				<el-table-column align="center" min-width="30px" max-width="40px" label="优惠卷ID" prop="couponId" sortable />
				<el-table-column align="center" min-width="50px" max-width="70px" label="门店ID" prop="brandId" />
				<el-table-column align="center" min-width="50px" max-width="70px" label="订单编号" prop="orderSn" />
				<el-table-column align="center" min-width="50px" max-width="70px" label="使用时间" prop="usedTime" />
				<el-table-column align="center" min-width="50px" max-width="80px" prop="brandgenre" label="状态">
					<template slot-scope="scope">
						<el-tag>
							{{ scope.row.status === 0
								? '已使用'
								: scope.row.status === 1
									? '已使用'
									: scope.row.status === 2
										? '已过期'
										: scope.row.status === 3
											? '已下架'
											: '' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="50px" max-width="80px" prop="brandgenre" label="有效时间">
					<template slot-scope="scope">
						{{ scope.row.startTime }}&nbsp;&nbsp;--&nbsp;&nbsp;{{ scope.row.endTime }}
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
					<template slot-scope="scope">
					<el-button
					v-permission="[ 'POST /admin/brand/update' ]" type="primary" size="mini"
					@click="handleUpdate(scope.row)"
					>
					编辑
					</el-button>
					<el-button
					v-permission="[ 'POST /admin/brand/delete' ]" type="danger" size="mini"
					@click="handleDelete(scope.row)"
					>
					删除
					</el-button>
					</template>
					</el-table-column> -->
			</el-table>
			<Pagination
				v-show="userListTotal > 0" :total="userListTotal" :page.sync="userListQuery.page" :limit.sync="userListQuery.limit"
				@pagination="selectFromData"
			/>
		</div>
		<!-- 添加和修改使用的对话框 -->
		<el-dialog
			v-show="openFrom"
			:title="(fromData.id ? '修改' : '创建') + '新优惠卷'"
			:visible.sync="openFrom"
			width="80%"
		>
			<el-form ref="creatFromData" :rules="rules" :model="fromData" :inline="true">
				<el-form-item v-if="fromData.id" label="优惠卷ID" prop="id" label-width="120px">
					<el-input
						v-model="fromData.id"
						disabled
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="优惠卷名称" prop="name" label-width="120px">
					<el-input
						v-model="fromData.name"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="优惠卷简介" prop="desc" label-width="120px">
					<el-input
						v-model="fromData.desc"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="门店ID" prop="brand_id" label-width="120px">
					<el-input
						v-model="fromData.brandId"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="优惠卷限制提示" prop="tag" label-width="120px">
					<el-input
						v-model="fromData.tag"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="优惠卷数量" prop="total" label-width="120px">
					<el-input
						v-model="fromData.total"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="优惠金额" prop="discount" label-width="120px">
					<el-input
						v-model="fromData.discount"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="最少启用金额" prop="min" label-width="120px">
					<el-input
						v-model="fromData.min"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="用户使用次数" prop="limit" label-width="120px">
					<el-input
						v-model="fromData.limit"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="优惠卷赠送类型" prop="type" label-width="120px">
					<el-select v-model="fromData.type" placeholder="请选择优惠卷类型">
						<el-option label="通用卷" value="0"></el-option>
						<el-option label="注册赠卷" value="1"></el-option>
						<el-option label="优惠卷码兑换" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠卷状态" prop="status" label-width="120px">
					<el-select v-model="fromData.status" placeholder="请选择优惠卷状态">
						<el-option label="正常使用" value="0"></el-option>
						<el-option label="过期" value="1"></el-option>
						<el-option label="已下架" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品限制类型" prop="goods_type" label-width="120px">
					<el-select v-model="fromData.goods_type" placeholder="请选择限制类型">
						<el-option label="全商品" value="0"></el-option>
						<el-option label="类目限制" value="1"></el-option>
						<el-option label="商品限制" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠卷时间限制类型" prop="time_type" label-width="150px">
					<el-select v-model="fromData.time_type" placeholder="请选择时间限制类型">
						<el-option label="根据领取优惠卷之后的规定天数过期" value="0"></el-option>
						<el-option label="自定义优惠卷使用时间范围" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="fromData.time_type == 0" prop="days" label="领取后的过期天数" label-width="150px">
					<el-input
						v-model="fromData.days"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item v-if="fromData.time_type == 1" prop="timeValue" label="自定义优惠卷使用时间" label-width="165px">
					<el-date-picker
						v-model="fromData.timeValue"
						value-format="yyyy-MM-dd "
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					>
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button v-if="fromData.id" type="primary" @click="handleUpdate()">
					确定
				</el-button>
				<el-button v-else type="primary" @click="createCoupon()">
					确定
				</el-button>
				<el-button @click="openFrom = false"> 取消 </el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import {
	SelectMerchantPreferential,
	SelectUserPreferential,
	CreatePreferential,
	RedingPreferential,
	UpdataPreferential,
	DeletePreferential
} from '@/api/preferentialManagement'
export default {
	// eslint-disable-next-line vue/match-component-file-name, vue/component-definition-name-casing
	name: 'preferentialManagement',
	components: { Pagination },
	data() {
		return {
			isMerchant: true,
			total: 0,
			userListTotal: 0,
			userTotal: 0,
			openFrom: false,
			listLoading: true,
			timeValue: [],
			list: [],
			userList: [],
			fromData: {
				'id': null,
				'name': '',
				'desc': '',
				'brandId': '',
				'tag': '',
				'total': '',
				'discount': '',
				'min': '',
				'limit': '',
				'type': '',
				'status': '',
				'goods_type': '',
				'goods_value': [],
				'time_type': '',
				'days': '',
				'startTime': null,
				'endTime': null,
				'timeValue': []
			},
			merchantListQuery: {
				brandId: '',
				name: '',
				type: '',
				status: '',
				page: 1,
				limit: 12
			},
			userListQuery: {
				userId: '',
				couponId: '',
				status: '',
				page: 1,
				limit: 12
			},
			rules: {
				id: [
					{ required: true, message: '请输入优惠劵ID', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '请输入优惠卷名字', trigger: 'blur' }
				],
				desc: [
					{ required: true, message: '请输入优惠卷简介', trigger: 'blur' }
				],
				brandId: [
					//  type: 'date',
					{ required: true, message: '请输入商户ID', trigger: 'blur' }
				],
				tag: [
					{ required: true, message: '优惠卷类型', trigger: 'blur' }
				],
				total: [
					{ required: true, message: '请输入优惠卷数量', trigger: 'blur' }
				],
				discount: [
					{ required: true, message: '请输入优惠金额', trigger: 'blur' }
				],
				min: [
					{ required: true, message: '请输入最少启用金额', trigger: 'blur' }
				],
				limit: [
					{ required: true, message: '请输入优惠卷领取数量限制', trigger: 'blur' }
				],
				type: [
					{ required: true, message: '请选择优惠卷类型', trigger: 'blur' }
				],
				status: [
					{ required: true, message: '请选择代金卷状态', trigger: 'blur' }
				],
				goods_type: [
					{ required: true, message: '请选择商品类型', trigger: 'blur' }
				],
				goods_value: [
					{ required: false, message: '请输入商品限制值', trigger: 'blur' }
				],
				timeValue: [
					{ required: true, message: '请选择时间区间', trigger: 'change' },
					{ validator: this.validateTimeRange, trigger: 'change' }
				],
				time_type: [
					{ required: false, message: '请选择优惠卷有效期类型', trigger: 'blur' }
				],
				days: [
					{ required: true, message: '请选择优惠卷有效时间', trigger: 'blur' }
				]
			}
		}
	},
	created() {
		this.selectPreferential()
		// 以下接口的调用均用于测试 如若觉得影响体验可以删除，方法已经完善
		// !搜索商家优惠卷 用户搜索也一致 参数只有页数和条数时获取所有，带上ID name TYPE 时为搜索
		// SelectMerchantPreferential({
		// 	brandId: '',
		// 	name: '',
		// 	type: '0',
		// 	status: '0',
		// 	page: 1,
		// 	limit: 10
		// }).then((res) => {
		// 	window.console.log(res)
		// })
		// !搜索用户优惠卷
		// SelectUserPreferential({
		// 	userId: '',
		// 	couponId: '',
		// 	status: '',
		// 	page: 1,
		// 	limit: 10
		// }).then((res) => {
		// 	window.console.log(res)
		// })
		// !创建优惠卷 在请求增删改查时传递的参数所用的驼峰命名需要以 _* 来更改驼峰的大写字母，否则会报参数错误
		// CreatePreferential({
		// 	'id': '',
		// 	'name': '1',
		// 	'desc': '1',
		// 	'brandId': '1001232',
		// 	'tag': '1',
		// 	'total': '12',
		// 	'discount': '1',
		// 	'min': '1',
		// 	'limit': 1,
		// 	'type': 0,
		// 	'status': 0,
		// 	'goods_type': 0,
		// 	'goods_value': [],
		// 	'time_type': 0,
		// 	'days': '3',
		// 	'start_time': null,
		// 	'endTime': null
		// }).then((res) => {
		// 	window.console.log(res)
		// })
		// 	.catch((err) => {
		// 		window.console.log(err)
		// 	})
		// !修改优惠卷的信息
		// UpdataPreferential({
		// 	'id': 23,
		// 	'name': '测试修改2',
		// 	'desc': '123123',
		// 	'tag': '123',
		// 	'brandId': '',   //! 此参数不用_替代大写字母。。。。
		// 	'total': 100,
		// 	'discount': 0,
		// 	'min': 0,
		// 	'limit': 1,
		// 	'type': 0,
		// 	'status': 0,
		// 	'goodsType': 1, //! 此参数不用_替代大写字母。。。。
		// 	'goods_value': 0,
		// 	'timeType': 0,  // ! 此参数不用_替代大写字母。。。。
		// 	'days': 0,
		// 	'startTime': '2022-05-14',  //! 此参数不用_替代大写字母。。。。
		// 	'endTime': '2022-05-20',    // ! 此参数不用_替代大写字母。。。。
		// 	'add_time': '2022-05-14',
		// 	'deleted': false
		// }).then((res) => {
		// 	window.console.log(res)
		// })
		// 	.catch((err) => {
		// 		console.log(err)
		// 	})
	},
	methods: {
		// 初始请求优惠卷信息
		selectPreferential() {
			this.listLoading = true
			// 初始状态下查询商家优惠卷
			SelectMerchantPreferential(this.merchantListQuery).then((res) => {
				this.list = res.data.items
				this.total = res.data.total
				this.listLoading = false
			})
			// 如果选择了查看用户优惠卷则切换请求改变数据
			SelectUserPreferential(this.userListQuery).then((res) => {
				this.userList = res.data.items
				this.userTotal = res.data.total
				this.listLoading = false
			})
		},
		// 查找优惠卷数据
		selectFromData() {
			if (this.isMerchant) {
				SelectMerchantPreferential(this.merchantListQuery).then((res) => {
					this.list = res.data.items
					this.total = res.data.total
					this.listLoading = false
				})
			} else {
				SelectUserPreferential(this.userListQuery).then((res) => {
					this.userList = res.data.items
					this.userTotal = res.data.total
					this.listLoading = false
				})
			}
		},
		// 删除优惠卷的方法
		handleDelete(row) {
			this.$confirm(
				'确认要进行此操作-删除此优惠卷？',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					// 审核申请表
					DeletePreferential(row)
						.then((response) => {
							this.$message({
								showClose: true,
								message: '操作成功',
								type: 'success'
							})
							this.selectPreferential()
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
		},
		// 时间区间选择器表单验证方法
		validateTimeRange(rule, value, callback) {
			// 自定义校验规则，验证时间区间的逻辑
			if (value && value.length === 2) {
				const startTime = value[0]
				const endTime = value[1]
				if (startTime > endTime) {
					callback(new Error('开始日期不能大于结束日期'))
				} else {
					callback()
				}
			} else {
				callback(new Error('请选择时间区间'))
			}
		},
		// 添加优惠卷
		createCoupon() {
			this.fromData.startTime = this.fromData.timeValue[0]
			this.fromData.endTime = this.fromData.timeValue[1]
			this.$refs.creatFromData.validate((valid) => {
				if (valid) {
					CreatePreferential(this.fromData)
						.then((response) => {
							this.selectPreferential()
							this.openFrom = false
							this.$notify.success({
								title: '成功',
								message: '创建成功'
							})
						})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.errmsg
							})
						})
				} else {
					this.$notify.error({
						title: '失败',
						message: '缺少必填信息'
					})
				}
			})
		},
		// 修改优惠卷时先更改表单
		UpdataFrom(row) {
			this.openFrom = true
			this.fromData = { ...row }
		},
		// 更改优惠卷信息的方法
		handleUpdate(row) {
			this.$refs.creatFromData.validate((valid) => {
				if (valid) {
					UpdataPreferential(this.fromData)
						.then((response) => {
							this.selectPreferential()
							this.openFrom = false
							this.$notify.success({
								title: '成功',
								message: '修改成功'
							})
						})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.errmsg
							})
						})
				} else {
					this.$notify.error({
						title: '失败',
						message: '缺少必填信息'
					})
				}
			})
		},
		// 清空表单的所有数据
		ClearData() {
			this.openFrom = true; this.fromData.id = null
			for (const key in this.fromData) {
				this.fromData[key] = null
			}
			window.console.log(this.fromData)
		}
	}
}
</script>

<style lang="scss">
.select_preferentia {
  .filter-container {
    display: flex;
  }
}
.el-button-item {
  margin-top: 0.2604vw;
  margin-left: 1.0417vw;
}
</style>
