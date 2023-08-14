<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="listqueryInfo.userId"
				disabled
				size="small"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入userId"
			/>
			<el-input
				v-model="listqueryInfo.handleId"
				size="small"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入处理人ID"
			/>
			<el-input
				v-model="listqueryInfo.brandId"
				disabled
				size="small"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入店铺Id"
			/>
			<el-select v-model="listqueryInfo.status" size="small" class="filter-item" placeholder="请选择申请类型" style="margin-right: 10px">
				<el-option v-for="item in statusIndex" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-button
				size="mini" class="filter-item" type="primary" icon="el-icon-search"
				style="margin-bottom: 0px"
				@click="handleFilter()"
			>
				查找
			</el-button>
		</div>
		<div v-tableHeight>
			<el-table
				height="100%"
				:data="listData"
				size="small"
				element-loading-text="正在查询中。。。"
				border
				fit
				highlight-current-row
			>
				<el-table-column align="center" min-width="30px" label="处理人ID" prop="finalHandleStaffId" sortable />
				<el-table-column align="center" min-width="50px" label="商户名" prop="brandName" />
				<el-table-column align="center" label="商品名称" prop="goodName" />
				<el-table-column align="center" label="投诉申请时间" prop="finalHandleTime" />
				<el-table-column align="center" min-width="30px" max-width="40px" label="头像" prop="nickname">
					<template slot-scope="scope">
						<img :src="scope.row.informAnnex" alt="" style="width: 3.125vw;height:3.125vw;" @error="handleImageError($event, scope.row)">
					</template>
				</el-table-column>
				<el-table-column align="center" label="投诉内容" prop="informContent" />
				<el-table-column align="center" label="相关问题" prop="informText" />
				<el-table-column align="center" label="答复内容" prop="respondContent" />
				<el-table-column align="center" label="状态" prop="status">
					<template slot-scope="scope">
						<el-tag>
							{{ scope.row.finalHandleStatus === 0
								? '审核中'
								: scope.row.finalHandleStatus === 1
									? '已通过'
									: "已退回"
							}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-if="scope.row.finalHandleStatus < 1"
							type="primary"
							@click="passComplain(scope.row)"
						>
							回复
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				v-show="total > 0" :total="total" :page.sync="listqueryInfo.page" :limit.sync="listqueryInfo.size"
				@pagination="getListData()"
			/>
		</div>
		<!-- 修改 -->
		<el-dialog
			title="添加退款申请的原因"
			:visible.sync="isUpdata"
			width="80%"
		>
			<el-form ref="creatFromData" :model="fromData">
				<el-form-item label="ID" prop="id" label-width="80px">
					<el-input
						v-model="fromData.id"
						disabled
						style="width: 200px"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item label="ID" prop="处理人ID" label-width="80px">
					<el-input
						v-model="fromData.finalHandleStaffId"
						disabled
						style="width: 200px"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item label="处理答复" prop="id" label-width="80px">
					<el-input
						v-model="fromData.respondContent"
						type="textarea"
						placeholder="请输入处理答复"
					/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="updateData()">
					确定
				</el-button>
				<el-button
					@click="isUpdata = false"
				>
					取消
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getListData, complaintReview } from '@/api/brandManagement/complain'
export default {
	name: 'Complain',
	data() {
		return {
			isUpdata: false,
			fromData: { id: '', respondContent: '', finalHandleStaffId: '' },
			listLoading: true,
			statusIndex: [{ label: '待处理', value: 0 }, { label: '已处理', value: 1 }, { label: '撤销', value: 2 }],
			listqueryInfo: {
				page: 1,
				size: 10,
				userId: '',
				handleId: '',
				brandId: '',
				status: 0
			},
			listData: [],
			total: 0
		}
	},
	created() {
		this.getListData()
	},
	methods: {
		// 请求数据
		getListData() {
			this.listLoading = true
			getListData(this.listqueryInfo).then((res) => {
				this.listData = res.data.limit
				this.total = res.data.total
				this.listLoading = false
				this.$message({
					showClose: true,
					message: '查询成功',
					type: 'success'
				})
			})
				.catch((err) => {
					console.log(err)
					this.$message({
						showClose: true,
						message: '查询失败',
						type: 'error'
					})
				})
		},
		// 点击搜索数据
		handleFilter() {
			this.getListData()
		},
		// 图片加载错误时使用默认头像
		handleImageError(ev, item) {
			item.avatar = require('@/assets/home/lujing.png')
		},
		passComplain(data) {
			this.isUpdata = true
			this.fromData.id = data.id
			this.fromData.finalHandleStaffId = data.finalHandleStaffId
		},
		// 修改
		updateData() {
			complaintReview(this.fromData).then((res) => {
				this.$message({
					showClose: true,
					message: '操作成功',
					type: 'success'
				})
				this.isUpdata = false
				this.getListData()
			})
				.catch((err) => {
					this.$notify.error({
						title: '失败',
						message: err.errmsg
					})
					this.isUpdata = false
				})
		}
	}
}
</script>

<style lang="scss">

</style>
