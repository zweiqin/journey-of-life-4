<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.userId" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入用户ID"
			/>
			<el-input
				v-model="listQuery.orderSn" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入订单编号"
			/>
			<el-select
				v-model="listQuery.orderStatusArray" multiple size="mini" style="width: 200px"
				class="filter-item"
				placeholder="请选择订单状态"
			>
				<el-option v-for="(item, index) in statusMap" :key="index" :label="item.label" :value="item.value" />
			</el-select>
			<el-button
				v-permission="[ 'GET /admin/order/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				:loading="downloadLoading" size="mini" class="filter-item" type="warning"
				icon="el-icon-download"
				@click="handleDownload"
			>
				导出
			</el-button>
			<el-button
				:loading="downloadLoading" size="mini" class="filter-item" type="warning"
				icon="el-icon-download"
				@click="handleDownloadBatchShipment"
			>
				导出批量发货模板
			</el-button>
			<el-upload
				:action="uploadUrl" :show-file-list="false" :headers="headers" :data="{}"
				:file-list="fileList"
				:before-upload="beforeUploadFile" :on-success="handleUploadSuccess" :on-error="() => $message.error('上传失败')"
				style="display: inline;margin-left: 10px" accept=".xlsx,.xls"
			>
				<el-button size="mini" type="primary" class="filter-item">上传批量发货表格</el-button>
			</el-upload>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%"
				highlight-current-row
			>
				<el-table-column align="center" min-width="100" label="订单编号" prop="orderSn" sortable />

				<el-table-column align="center" min-width="100px" label="用户ID" prop="userId" />

				<el-table-column align="center" min-width="160px" label="订单状态" prop="orderStatus">
					<template slot-scope="scope">
						<el-tag>{{ scope.row.orderStatus ? statusMap.find(i => i.value === scope.row.orderStatus).label : '--' }}</el-tag>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="100px" label="订单金额" prop="orderPrice" />

				<el-table-column align="center" min-width="100px" label="支付金额" prop="actualPrice" />

				<el-table-column align="center" min-width="120px" label="支付时间" prop="payTime" />

				<el-table-column align="center" min-width="120px" label="物流单号" prop="shipSn" />

				<el-table-column align="center" min-width="100px" label="物流渠道" prop="shipChannel" />

				<el-table-column align="center" label="操作" min-width="150px" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/order/detail' ]" type="primary" size="mini"
							@click="handleDetail(scope.row)"
						>
							详情
						</el-button>
						<el-button
							v-if="scope.row.orderStatus == 201" v-permission="[ 'POST /admin/order/ship' ]" type="primary"
							size="mini" @click="handleShip(scope.row)"
						>
							发货
						</el-button>
						<el-button
							v-if="scope.row.orderStatus == 202" v-permission="[ 'POST /admin/order/refund' ]" type="primary"
							size="mini" @click="handleRefund(scope.row)"
						>
							退款
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 订单详情对话框 -->
		<el-dialog :visible.sync="orderDialogVisible" title="订单详情" width="800">
			<el-form :data="orderDetail" label-position="left">
				<el-form-item label="订单编号">
					<span>{{ orderDetail.order.orderSn }}</span>
				</el-form-item>
				<el-form-item label="订单状态">
					<template slot-scope="scope">
						<el-tag>{{ scope.order.orderStatus }}</el-tag>
					</template>
				</el-form-item>
				<el-form-item label="订单用户">
					<span>{{ orderDetail.user.nickname }}</span>
				</el-form-item>
				<el-form-item label="用户留言">
					<span>{{ orderDetail.order.message }}</span>
				</el-form-item>
				<el-form-item label="收货信息">
					<span>（收货人）{{ orderDetail.order.consignee }}</span>
					<span>（手机号）{{ orderDetail.order.mobile }}</span>
					<span>（地址）{{ orderDetail.order.address }}</span>
				</el-form-item>
				<el-form-item label="商品信息">
					<el-table :data="orderDetail.orderGoods" size="small" border fit highlight-current-row>
						<el-table-column align="center" label="商品名称" prop="goodsName" />
						<el-table-column align="center" label="商品编号" prop="goodsSn" />
						<el-table-column align="center" label="货品规格" prop="specifications" />
						<el-table-column align="center" label="货品价格" prop="price" />
						<el-table-column align="center" label="货品数量" prop="number" />
						<el-table-column align="center" label="货品图片" prop="picUrl">
							<template slot-scope="scope">
								<el-image
									v-if="scope.row.picUrl" :src="common.seamingImgUrl(scope.row.picUrl)"
									style="width:40px; height:40px" fit="cover"
									:preview-src-list="[ common.seamingImgUrl(scope.row.picUrl) ]"
								/>
								<span v-else>--</span>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item label="费用信息">
					<span>
						(实际费用){{ orderDetail.order.actualPrice }}元 =
						(商品总价){{ orderDetail.order.goodsPrice }}元 +
						(快递费用){{ orderDetail.order.freightPrice }}元 -
						(优惠减免){{ orderDetail.order.couponPrice }}元 -
						(积分减免){{ orderDetail.order.integralPrice }}元
					</span>
				</el-form-item>
				<el-form-item label="支付信息">
					<span>（支付渠道）微信支付</span>
					<span>（支付时间）{{ orderDetail.order.payTime }}</span>
				</el-form-item>
				<el-form-item label="快递信息">
					<span>（快递公司）{{ orderDetail.order.shipChannel }}</span>
					<span>（快递单号）{{ orderDetail.order.shipSn }}</span>
					<span>（发货时间）{{ orderDetail.order.shipTime }}</span>
				</el-form-item>
				<el-form-item label="收货信息">
					<span>（确认收货时间）{{ orderDetail.order.confirmTime }}</span>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 发货对话框 -->
		<el-dialog :visible.sync="shipDialogVisible" title="发货">
			<el-form
				ref="shipForm" :model="shipForm" status-icon label-position="left"
				label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="快递公司" prop="shipChannel">
					<el-select v-model="shipForm.shipChannel">
						<el-option v-for="item in shipChannelList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="快递编号" prop="shipSn">
					<el-input v-model="shipForm.shipSn" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="shipDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmShip">确定</el-button>
			</div>
		</el-dialog>

		<!-- 退款对话框 -->
		<el-dialog :visible.sync="refundDialogVisible" title="退款">
			<el-form
				ref="refundForm" :model="refundForm" status-icon label-position="left"
				label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="退款金额" prop="refundMoney">
					<el-input v-model="refundForm.refundMoney" :disabled="true" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="refundDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmRefund">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listOrder, shipOrder, refundOrder, detailOrder, listShipChannel } from '@/api/orderManagement/order'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
	name: 'OrderList',
	components: { Pagination },
	data() {
		return {
			fileList: [],
			uploadUrl: process.env.BASE_API + '/adminOrder/import',
			list: undefined,
			total: 0,
			listLoading: true,
			shipChannelList: [],
			listQuery: {
				page: 1,
				limit: 20,
				id: undefined,
				name: undefined,
				orderStatusArray: [ 201 ],
				sort: 'add_time',
				order: 'desc'
			},
			statusMap: [{
				value: 101,
				label: '未付款'
			}, {
				value: 102,
				label: '用户取消'
			}, {
				value: 103,
				label: '系统取消'
			}, {
				value: 201,
				label: '已付款'
			}, {
				value: 202,
				label: '申请退款'
			}, {
				value: 203,
				label: '已退款'
			}, {
				value: 301,
				label: '已发货'
			}, {
				value: 401,
				label: '用户收货'
			}, {
				value: 402,
				label: '系统收货'
			}, {
				value: 403,
				label: '已核销'
			}, {
				value: 404,
				label: '已过期'
			}, {
				value: 405,
				label: '待核销（已付款）'
			}, {
				value: 406,
				label: '待核销（未付款）'
			}],
			orderDialogVisible: false,
			orderDetail: {
				order: {},
				user: {},
				orderGoods: []
			},
			shipForm: {
				orderId: undefined,
				shipChannel: undefined,
				shipSn: undefined
			},
			shipDialogVisible: false,
			refundForm: {
				orderId: undefined,
				refundMoney: undefined
			},
			refundDialogVisible: false,
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
		this.getList()
		this.getListShipChannel()
	},
	methods: {
		getList() {
			this.listLoading = true
			listOrder(this.listQuery).then((res) => {
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
		getListShipChannel() {
			listShipChannel().then((res) => {
				this.shipChannelList = res.data.shipChannelList
			})
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		handleDetail(row) {
			detailOrder(row.id).then((res) => {
				this.orderDetail = res.data
			})
			this.orderDialogVisible = true
		},
		handleShip(row) {
			this.shipForm.orderId = row.id
			this.shipForm.shipChannel = row.shipChannel
			this.shipForm.shipSn = row.shipSn

			this.shipDialogVisible = true
			this.$nextTick(() => {
				this.$refs.shipForm.clearValidate()
			})
		},
		confirmShip() {
			this.$refs.shipForm.validate((valid) => {
				if (valid) {
					shipOrder(this.shipForm).then((res) => {
						this.shipDialogVisible = false
						this.$notify.success({
							title: '成功',
							message: '确认发货成功'
						})
						this.getList()
					})
						.catch((err) => {
							this.$notify.error({
								title: '失败',
								message: err.data.errmsg
							})
						})
				}
			})
		},
		handleRefund(row) {
			this.refundForm.orderId = row.id
			this.refundForm.refundMoney = row.actualPrice

			this.refundDialogVisible = true
			this.$nextTick(() => {
				this.$refs.refundForm.clearValidate()
			})
		},
		confirmRefund() {
			this.$refs.refundForm.validate((valid) => {
				if (valid) {
					refundOrder(this.refundForm).then((res) => {
						this.refundDialogVisible = false
						this.$notify.success({
							title: '成功',
							message: '确认退款成功'
						})
						this.getList()
					})
						.catch((err) => {
							this.$notify.error({
								title: '失败',
								message: err.data.errmsg
							})
						})
				}
			})
		},
		// 限制上传文件类型
		beforeUploadFile(file) {
			const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
			const isXls = extension === 'xls'
			const isXlsx = extension === 'xlsx'
			if (!isXls && !isXlsx) {
				this.$message.warning('只能上传excel的文件')
			}
			return isXls || isXlsx
		},
		handleUploadSuccess(response) {
			if (response.data !== '导入成功') {
				this.$notify.error({
					title: '操作失败！',
					message: response.data.errmsg
				})
			} else {
				this.$message.success('上传成功')
			}
			this.getList()
		},

		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
				const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
				excel.export_json_to_excel2(tHeader, this.list.map((item) => ({ ...item, orderStatus: item.orderStatus ? this.statusMap.find((i) => i.value === item.orderStatus).label : '--' })), filterVal, '订单信息')
				this.downloadLoading = false
			})
		},
		handleDownloadBatchShipment() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const headers = [
					{ v: '送货日期', position: 'A1', field: 'deliverTime' },
					{ v: '客户信息', position: 'B1', field: 'customer' },
					{ v: '品名', position: 'C1', field: 'goodsName' },
					{ v: '件数', position: 'D1', field: 'number' },
					{ v: '体积', position: 'E1', field: 'volume' },
					{ v: '重量', position: 'F1', field: 'weight' },
					{ v: '尺寸', position: 'G1', field: 'size' },
					{ v: '易碎品', position: 'H1', field: 'fragile' },
					{ v: '送货要求', position: 'I1', field: 'ask' },
					{ v: '付款方式', position: 'J1', field: 'payment' },
					{ v: '订单编号', position: 'K1', field: 'orderSn' },
					{ v: '物流渠道', position: 'L1', field: 'logisticsChannels' },
					{ v: '物流单号', position: 'M1', field: 'logisticsNumber' },
					{ v: '备注', position: 'N1', field: 'notes' }
				]
				excel.export_json_to_excel3(headers, {
					data: [ {
						deliverTime: 'x月xx日',
						customer: 'xx省xx市xxx',
						goodsName: 'xxx',
						number: '9',
						volume: '9',
						weight: '9',
						size: '9',
						fragile: 'xxx',
						ask: 'xxx',
						payment: 'xxx',
						orderSn: 'xxx',
						logisticsChannels: 'xxx',
						logisticsNumber: 'xxx',
						notes: 'xxx'
					} ],
					A2: '黄色为必填项；查货网站：www.zhult.com；服务号：助力通；注册后并绑定手机号可公众号自动推送运输节点；短信通知；'
				}, '运输表单')
				this.downloadLoading = false
			})
		}
	}
}
</script>
