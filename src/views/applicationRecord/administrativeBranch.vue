<template>
	<div class="app-container">
		<div v-tableHeight>
			<el-table height="100%" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
				<el-table-column align="center" label="申请人ID" prop="userId" sortable />
				<el-table-column align="center" label="申请人姓名" prop="username" />
				<el-table-column align="center" property="avatar" label="用户头像">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)"
							style="width: 40px; height: 40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="地址ID" prop="areaId" />
				<el-table-column align="center" label="申请表ID" prop="id" sortable />
				<el-table-column align="center" label="电话号码" prop="mobile">
					<template slot-scope="scope">
						{{
							scope.row.applicationType === 1
								? scope.row.username
								: scope.row.mobile
									? scope.row.mobile
									: scope.row.phone
						}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="申请时间" prop="addTime" />
				<el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/dtsAdmin/areaUserList' ]" type="primary" size="mini"
							@click="checking(scope.row)"
						>
							查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
			@pagination="getList"
		/>
		<el-dialog
			v-if="dialogFormitem !== null" :title="listName + '旗下的营销策划师'" :visible.sync="dialogFormVisible"
			width="80%"
		>
			<el-table
				height="100%" :data="dialogFormitem" size="small" element-loading-text="正在查询中。。。"
				border fit
				highlight-current-row
			>
				<el-table-column align="center" label="策划师ID" prop="userId" sortable />
				<el-table-column align="center" label="策划师姓名" prop="nickname" />
				<el-table-column align="center" property="avatar" label="策划师头像">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)"
							style="width: 40px; height: 40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" property="avatar" label="性别">
					<template slot-scope="scope">
						{{ scope.row.gender === 0 ? '男' : '女' }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="地址代号" prop="areaId" />
				<el-table-column align="center" label="电话号码" prop="mobile" />
				<el-table-column align="center" label="生日" prop="birthday" />
				<el-table-column align="center" label="加入时间" prop="addTime" />
			</el-table>
			<Pagination
				v-show="totals > 0" :total="totals" :page.sync="UserListQuery.page" :limit.sync="UserListQuery.size"
				@pagination="getList"
			/>
		</el-dialog>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
	getDtsAdminList,
	getUserList
} from '@/api/applicationRecord/administrativeBranch'
export default {
	name: 'AdministrativeBranch',
	components: { Pagination },
	data() {
		return {
			list: [],
			listName: '',
			dialogFormitem: null,
			dialogFormVisible: false,
			total: 0,
			totals: 0,
			roleOptions: null,
			listLoading: true,
			listQuery: {
				page: 1,
				size: 10
			},
			UserListQuery: {
				page: 1,
				size: 10
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			getDtsAdminList(this.listQuery)
				.then((response) => {
					this.list = response.data.limit
					this.total = response.data.total
					// window.console.log(this.list)
					this.listLoading = false
				})
				.catch((err) => {
					window.console.log(err)
				})
		},
		checking(row) {
			this.dialogFormVisible = false
			getUserList({ ...this.UserListQuery, areaId: row.areaId }).then((res) => {
				this.listName = row.username
				this.dialogFormitem = res.data.limit
				this.totals = res.data.total
				this.dialogFormVisible = true
			})
		}
	}
}
</script>

<style lang="scss">
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
