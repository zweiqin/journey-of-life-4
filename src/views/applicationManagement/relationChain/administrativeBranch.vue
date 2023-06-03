<template>
	<div class="app-container">
		<div v-tableHeight>
			<el-table
				height="100%"
				:data="list"
				size="small"
				element-loading-text="正在查询中。。。"
				border
				fit
				highlight-current-row
			>
				<el-table-column
					align="center"
					label="申请人ID"
					prop="userId"
					sortable
				/>
				<el-table-column align="center" label="申请人姓名" prop="nickname" />
				<el-table-column align="center" property="avatar" label="用户头像">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
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
							scope.row.applicationType === 1 ? scope.row.username : scope.row.mobile ? scope.row.mobile : scope.row.phone
						}}
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="申请类型" prop="applicationType">
					<template slot-scope="scope">
					<el-tag>
					{{
					scope.row.applicationType == 1
					? '普通业务员'
					: scope.row.applicationType == 2
					? '高级业务员'
					: '其他'
					}}
					</el-tag>
					</template>
					</el-table-column> -->
				<el-table-column align="center" label="申请时间" prop="addTime" />
				<el-table-column
					align="center"
					label="操作"
					class-name="small-padding fixed-width"
					width="250"
				>
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/dtsAdmin/areaUserList' ]"
							type="primary"
							size="mini"
							@click="checking(scope.row)"
						>
							查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog
			v-if="dialogFormitem !== null"
			:title="dialogFormitem.nickname + '旗下的营销策划师'"
			:visible.sync="dialogFormVisible"
			width="80%"
		>
		</el-dialog>
		<!-- <Pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.size"
			@pagination="getListData"
			/> -->
	</div>
</template>

<script>
import {
	getDtsAdminList,
	getUserList
} from '@/api/relationChain/administrativeBranch'
export default {
	// eslint-disable-next-line vue/component-definition-name-casing, vue/match-component-file-name
	name: 'administrativeBranch',
	data() {
		return {
			list: [],
			dialogFormitem: null,
			dialogFormVisible: false,
			total: 0,
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
			getDtsAdminList(this.listQuery).then((response) => {
				this.list = response.data.limit
				this.total = response.data.total
				window.console.log(this.list)
				this.listLoading = false
			})
				.catch((err) => {
					window.console.log(err)
				})
		},
		checking(row) {
			getUserList({ ...this.UserListQuery, areaId: row.areaId }).then((res) => {
				window.console.log(res)
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
