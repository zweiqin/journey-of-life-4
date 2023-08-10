<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.username" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入会员名"
			/>
			<el-input
				v-model="listQuery.mobile" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入手机号"
			/>
			<el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button class="filter-item" type="primary" size="mini" icon="el-icon-s-promotion">推送</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中..."
				border height="100%" fit
				highlight-current-row
			>
				<el-table-column align="center" min-width="80" label="会员id" prop="id" sortable />

				<el-table-column align="center" min-width="170" label="会员账号" prop="username" />

				<el-table-column align="center" min-width="160" label="会员名称" prop="nickname" sortable />

				<el-table-column align="center" min-width="220" label="手机号码" prop="mobile" />

				<el-table-column align="center" label="性别" prop="gender">
					<template slot-scope="scope">
						{{ genderDic[scope.row.gender] }}
					</template>
				</el-table-column>

				<el-table-column :min-width="300 * $root.dw + 'px'" align="center" property="avatar" label="用户头像">
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

				<el-table-column align="center" label="生日" prop="roleName" />

				<el-table-column align="center" label="用户等级" prop="userLevel">
					<template slot-scope="scope">
						{{ levelDic[scope.row.userLevel] }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="状态" prop="status">
					<template slot-scope="scope">
						{{ statusDic[scope.row.status] }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="danger" @click="handleIdDelete(scope.row)">解绑</el-button>
					</template>
				</el-table-column>

			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="Number(total)" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

	</div>
</template>

<script>
import { getUserInfo } from '@/api/login'
import { idGet } from '@/api/marketingManagement/salesmanManagement'
import { adminGet, listDelete } from '@/api/StoreManagement/MemberManagement'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
	name: 'MemberManagement',
	components: { Pagination },
	data() {
		return {
			list: null,
			total: 0,
			listLoading: false,
			listQuery: {
				id: undefined,
				username: undefined,
				mobile: undefined,
				page: 1,
				limit: 20,
				sort: 'add_time',
				order: 'desc'
			},
			genderDic: ['未知', '男', '女'],
			levelDic: ['普通用户', 'VIP用户', '代理'],
			statusDic: ['可用', '禁用', '注销', '代理申请']
		}
	},
	mounted() {
		this.getAdminName()
	},
	methods: {
		getAdminName() {
			getUserInfo(getToken())
				.then((response) => {
					idGet(response.data.name).then((response) => {
						this.listQuery.id = response.data.id
						this.getList()
					})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.data.errmsg
							})
							this.listQuery.id = ''
						})
				})
				.catch()
		},

		getList() {
			this.listLoading = true
			adminGet(this.listQuery).then((response) => {
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

		// 解除绑定关系
		handleIdDelete(row) {
			this.$confirm('此操作将解绑该账户关系信息, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const deleteData = {
					salesmanId: this.listQuery.id,
					userId: [ row.id ]
				}
				listDelete(deleteData).then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除成功'
					})
					// 重新获取列表
					this.getList()
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
		}
	}
}
</script>
