<template>
	<div class="app-container">

		<!-- 超级管理员端查询操作 -->
		<div v-show="isAdmin" class="filter-container">
			<el-input
				v-model="listQuery.id" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店ID"
			/>
			<el-input
				v-model="listQuery.name" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店名称"
			/>
			<el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">
				查找
			</el-button>
		</div>

		<!-- 门店端查询操作 -->
		<div v-show="!isAdmin" class="filter-container">
			<el-input
				v-model="listIdQuery.levelId" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店等级ID"
			/>
			<el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">
				查找
			</el-button>
		</div>

		<!-- 超级管理员端查询结果 -->
		<el-table
			v-show="isAdmin" v-loading="listLoading" :data="list" size="small"
			element-loading-text="正在查询中..." border
			fit highlight-current-row @expand-change="expand"
		>

			<el-table-column type="expand">
				<template slot-scope="scope">
					<!-- 二级列表 -->
					<el-table
						ref="salesman" v-loading="listIdLoading" :data="listId[scope.row.id]" size="small"
						element-loading-text="正在查询中。。。" border fit highlight-current-row
					>

						<el-table-column align="center" width="100px" label="编号" prop="id" sortable />

						<el-table-column align="center" label="门店id" prop="brandId" />

						<el-table-column align="center" label="会员id" prop="userId" />

						<el-table-column align="center" label="会员昵称" prop="nickName" />

						<el-table-column align="center" label="门店等级id" prop="levelId" />

						<el-table-column align="center" label="等级名称" prop="levelName" />

						<el-table-column align="center" label="当前余额" prop="totalBalance" />

						<el-table-column align="center" label="总充值余额" prop="remainBalance" />

						<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
							<template slot-scope="scope">
								<el-button
									v-permission="[ 'POST /admin/buAccount/topUp' ]" type="primary" size="mini"
									@click="recharge(scope.row)"
								>
									充值
								</el-button>
							</template>
						</el-table-column>
					</el-table>

					<Pagination
						v-show="totalId[scope.row.id] > 0" :total="Number(totalId[scope.row.id])"
						:page.sync="listIdQuery.page" :limit.sync="listIdQuery.limit" @pagination="getListOfId(scope.row.id)"
					/>
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="100px" label="门店ID" prop="id" sortable />

			<el-table-column align="center" min-width="150px" label="门店名称" prop="name" />

			<el-table-column align="center" min-width="100px" property="picUrl" label="门店图片">
				<template slot-scope="scope">
					<img v-if="scope.row.picUrl" :src="common.splicingImgUrl() + scope.row.picUrl" width="80">
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="350px" label="介绍" prop="desc" />

			<el-table-column align="center" min-width="80px" label="最低消费价格" prop="floorPrice" />

			<el-table-column align="center" prop="brandgenre" label="门店类型">
				<template slot-scope="scope">
					{{ scope.row.brandgenreName }}
				</template>
			</el-table-column>

			<!-- <el-table-column
				align="center"
				min-width="100px"
				property="licenseUrl"
				label="营业执照"
				>
				<template slot-scope="scope">
				<img
				v-if="scope.row.licenseUrl"
				:src="common.splicingImgUrl()+scope.row.licenseUrl"
				width="80"
				>
				</template>
				</el-table-column> -->

			<!-- <el-table-column
				align="center"
				min-width="100px"
				property="idcardProsUrl"
				label="法人身份证正面"
				>
				<template slot-scope="scope">
				<img
				v-if="scope.row.idcardProsUrl"
				:src="common.splicingImgUrl()+scope.row.idcardProsUrl"
				width="80"
				>
				</template>
				</el-table-column>

				<el-table-column
				align="center"
				min-width="100px"
				property="idcardConsUrl"
				label="法人身份证反面"
				>
				<template slot-scope="scope">
				<img
				v-if="scope.row.idcardConsUrl"
				:src="common.splicingImgUrl()+scope.row.idcardConsUrl"
				width="80"
				>
				</template>
				</el-table-column> -->

		</el-table>

		<Pagination
			v-show="isAdmin && total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 门店端查询结果 -->
		<el-table
			v-show="!isAdmin" v-loading="listIdLoading" :data="listId[1]" size="small"
			element-loading-text="正在查询中..."
			border fit highlight-current-row
		>
			<el-table-column align="center" width="100px" label="编号" prop="id" sortable />

			<el-table-column align="center" label="门店id" prop="brandId" />

			<el-table-column align="center" label="会员id" prop="userId" />

			<el-table-column align="center" label="会员昵称" prop="nickName" />

			<el-table-column align="center" label="门店等级id" prop="levelId" />

			<el-table-column align="center" label="等级名称" prop="levelName" />

			<el-table-column align="center" label="当前余额" prop="totalBalance" />

			<el-table-column align="center" label="总充值余额" prop="remainBalance" />

			<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/buAccount/topUp' ]" type="primary" size="mini"
						@click="recharge(scope.row)"
					>
						充值
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<Pagination
			v-show="!isAdmin && totalId[1] > 0" :total="Number(totalId[1])" :page.sync="listIdQuery.page"
			:limit.sync="listIdQuery.limit" @pagination="getListOfId(1)"
		/>

		<!-- 充值 -->
		<el-dialog :visible.sync="rechargeVisible" title="充值中心" width="40%">
			<el-form
				ref="rechargeForm" :model="rechargeForm" status-icon label-position="left"
				label-width="100px"
				style="width: 350px; margin-left:50px;"
			>
				<el-form-item label="会员id" prop="userId">
					{{ rechargeForm.userId }}
				</el-form-item>
				<el-form-item label="门店id" prop="brandId">
					{{ rechargeForm.brandId }}
				</el-form-item>
				<el-form-item label="充值金额" prop="credit">
					<el-input v-model="rechargeForm.credit" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="rechargeVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmRecharge">
					确定
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { listStore, listMember, memberRecharge } from '@/api/business/recharge'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/login'
import Pagination from '@/components/Pagination'

export default {
	name: 'Recharge',
	components: { Pagination },
	data() {
		return {
			list: [],
			isAdmin: false,
			total: 0,
			listLoading: false,
			listQuery: {
				page: 1,
				limit: 20,
				id: undefined,
				name: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			listId: [],
			// 列表页
			totalId: [],
			listIdLoading: false,
			listIdQuery: {
				page: 1,
				limit: 20,
				brandId: undefined,
				levelId: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			rechargeVisible: false,
			rechargeForm: {
				userId: undefined,
				brandId: undefined,
				credit: undefined
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
					this.isAdmin = response.data.data.roles[0] === '超级管理员'
					if (this.isAdmin) {
						this.getList()
					} else {
						this.getListOfId(1)
					}
				})
				.catch()
		},
		getList() {
			this.listLoading = true
			listStore(this.listQuery)
				.then((response) => {
					this.list = response.data.data.items
					this.total = response.data.data.total
					this.listLoading = false
				})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},

		// 二级菜单请求
		expand(row, expandedRows) {
			this.getListOfId(row.id)
		},

		getListOfId(id) {
			this.listIdLoading = true
			if (this.isAdmin) {
				this.listIdQuery.brandId = id
			}
			listMember(this.listIdQuery).then((response) => {
				this.$set(this.listId, id, response.data.data.items)
				this.$set(this.totalId, id, response.data.data.total)
				this.listIdLoading = false
			})
				.catch(() => {
					// 清空列表数据
					this.$set(this.listId, id, [])
					// 清空列表页数
					this.$set(this.totalId, id, 0)
					this.listIdLoading = false
				})
		},

		handleFilter() {
			if (this.isAdmin) {
				this.listQuery.page = 1
				if (!this.listQuery.id) {
					this.listQuery.id = undefined
				}
				this.getList()
			} else {
				this.listIdQuery.page = 1
				this.getListOfId(1)
			}
		},

		recharge(row) {
			this.rechargeForm = {
				userId: row.userId,
				brandId: row.brandId,
				credit: undefined
			}
			this.rechargeVisible = true
		},

		// 充值
		confirmRecharge() {
			memberRecharge(this.rechargeForm).then((response) => {
				this.$notify.success({
					title: '成功',
					message: '充值成功'
				})
				this.rechargeVisible = false
				// 重新获取列表
				this.getList()
			})
				.catch((response) => {
					this.$notify.error({
						title: '失败',
						message: response.data.errmsg
					})
				})
		}
	}
}
</script>
