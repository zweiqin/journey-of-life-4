<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.name" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入业务员名称"
			/>
			<el-select v-model="listQuery.type" size="mini" class="filter-item" clearable placeholder="请选择业务员类型">
				<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-button
				v-permission="[ 'GET /admin/salesman/smlist' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/salesman/create' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
			<!-- <el-button
				:loading="downloadLoading"
				size="mini"
				class="filter-item"
				type="warning"
				icon="el-icon-download"
				@click="handleDownload"
				>导出</el-button> -->
		</div>

		<!-- 查询结果 -->
		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>
			<el-table-column align="center" label="ID" prop="id" sortable />

			<el-table-column align="center" label="名称" prop="name" />

			<el-table-column align="center" label="电话" prop="phone" />

			<el-table-column align="center" label="微信号" prop="wechat" />

			<el-table-column align="center" label="邮箱" prop="email" />

			<el-table-column align="center" label="地区" prop="areaname" />

			<el-table-column align="center" label="详细地址" prop="salesmanAddress" />

			<el-table-column align="center" label="入职时间" prop="entrydate" />

			<el-table-column align="center" label="业务员类型" prop="type">
				<template slot-scope="scope">
					{{ scope.row.type == 0 ? '门店' : scope.row.type == 1 ? '营销策划' : '其他' }}
				</template>
			</el-table-column>

			<el-table-column align="center" label="系统账号ID" prop="adminId" />
			<!-- <el-table-column
				align="center"
				label="业务员头像"
				prop="avatar"
				>
				<template slot-scope="scope">
				<img
				v-if="scope.row.avatar"
				:src="scope.row.avatar"
				width="40"
				>
				</template>
				</el-table-column> -->

			<!-- <el-table-column
				align="center"
				label="业务员角色"
				prop="roleIds"
				sortable
				>
				<template slot-scope="scope">
				<el-tag
				v-for="roleId in scope.row.roleIds"
				:key="roleId"
				type="primary"
				style="margin-right: 20px;"
				> {{ formatRole(roleId) }} </el-tag>
				</template>
				</el-table-column> -->

			<el-table-column align="center" label="操作" min-width="90" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/admin/update' ]" type="primary" size="mini"
						@click="handleUpdate(scope.row)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="[ 'POST /admin/admin/delete' ]" type="danger" size="mini"
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
				<el-form-item v-if="dialogStatus != 'create'" align="left" label="ID" prop="id" sortable>
					{{ dataForm.id }}
				</el-form-item>

				<el-form-item align="left" label="名称" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>

				<el-form-item align="left" label="电话" prop="phone">
					<el-input v-model="dataForm.phone" />
				</el-form-item>

				<el-form-item align="left" label="微信号" prop="wechat">
					<el-input v-model="dataForm.wechat" />
				</el-form-item>

				<el-form-item align="left" label="邮箱" prop="email">
					<el-input v-model="dataForm.email" />
				</el-form-item>

				<el-form-item align="left" label="地区" prop="areaname">
					<!-- <el-input v-model="dataForm.areaname" /> -->
					<el-cascader v-model="selectedAreaOptions" :options="areaOptions" size="large" @change="handleChange" />
				</el-form-item>

				<el-form-item align="left" label="详细地址" prop="salesmanAddress">
					<el-input v-model="dataForm.salesmanAddress" />
				</el-form-item>

				<el-form-item align="left" label="入职时间" prop="entrydate">
					<el-date-picker
						v-model="dataForm.entrydate" type="date" placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					/>
				</el-form-item>

				<el-form-item align="left" label="系统账号ID" prop="adminId">
					<el-select
						v-model="dataForm.adminId" filterable placeholder="请选择" clearable
						@change="selectedAdminInfo(adminIdOptions)"
					>
						<el-option v-for="item in adminIdOptions" :key="item.id" :label="item.id" :value="item.id">
							<span style="float: left">{{ item.id }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item align="left" label="业务员类型" prop="type">
					<el-select v-model="selectType" placeholder="请选择" disabled>
						<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
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
import { listAdd, listDelete, listGet, listedit, listGetAdminId } from '@/api/system/SalesmanManagement'
import { roleOptions } from '@/api/business/role'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'

export default {
	name: 'Admin',
	components: { Pagination },
	data() {
		return {
			selectType: undefined,
			selectedAreaOptions: [],
			areaOptions: regionData,
			adminIdOptions: [],
			typeOptions: [
				{
					label: '门店',
					value: 0
				},
				{
					label: '营销策划',
					value: 1
				}
			],
			uploadPath,
			list: null,
			total: 0,
			roleOptions: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				name: undefined,
				type: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				phone: undefined,
				name: undefined,
				gender: undefined,
				wechat: undefined,
				birthday: undefined,
				areaname: undefined,
				salesmanAddress: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined
			},
			// salesmanDataForm: {
			//   id: undefined,
			//   name: undefined,
			//   phone: undefined,
			//   wechat: undefined,
			//   salemanstateid: undefined, // 状态
			//   operatorid: undefined,
			//   operatorname: undefined,
			//   updatatime: undefined,
			//   adminId: undefined,
			//   gender: undefined, // 性别
			//   birthday: undefined,
			//   areaname: undefined,
			//   salesmanAddress: undefined,
			//   idcardProsUrl: undefined,
			//   idcardConsUrl: undefined
			// },
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				name: [
					{ required: true, message: '名称不能为空', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '电话不能为空', trigger: 'blur' }
				],
				areaname: [
					{ required: true, message: '地区不能为空', trigger: 'blur' }
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
		this.getList()
		this.getAdminId()
		roleOptions()
			.then((response) => {
				this.roleOptions = response.data
			})
	},
	methods: {
		// 处理业务员类型
		selectedAdminInfo(adminInfo) {
			const typeData = adminInfo.find((item) => item.id === this.dataForm.adminId)
			console.log(typeData.type)
			this.selectType = typeData.type
		},
		formatRole(roleId) {
			for (let i = 0; i < this.roleOptions.length; i++) {
				if (roleId === this.roleOptions[i].value) {
					return this.roleOptions[i].label
				}
			}
			return ''
		},
		getAdminId() {
			listGetAdminId().then((response) => {
				let data = response.data.items
				// console.log(data)

				// 处理业务员类型
				data = data.map((item) => ({
					id: item.id,
					username: item.username,
					type: item.roleIds[0] - 4
				}))
				this.$set(this.$data, 'adminIdOptions', data)

				// console.log(data)
				// this.listLoading = false
			})
				.catch(() => {
					this.list = []
					this.total = 0
					// this.listLoading = false
				})
		},
		getList() {
			this.listLoading = true
			listGet(this.listQuery)
				.then((response) => {
					const data = response.data.items.map((item) => item.dtsSalesman)
					this.$set(this.$data, 'list', data)
					console.log(this.list)
					this.total = response.data.total
					this.listLoading = false
				})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		handleChange(value) {
			console.log(value)
			this.getCodeToText(null, value)
		},
		getCodeToText(codeStr, codeArray) {
			if (codeStr === null && codeArray === null) {
				return null
			} else if (codeArray === null) {
				codeArray = codeStr.split(',')
			}
			let area = ''
			switch (codeArray.length) {
				case 1:
					area += CodeToText[codeArray[0]]
					break
				case 2:
					area += CodeToText[codeArray[0]] + '/' + CodeToText[codeArray[1]]
					break
				case 3:
					area +=
						CodeToText[codeArray[0]] +
						'/' +
						CodeToText[codeArray[1]] +
						'/' +
						CodeToText[codeArray[2]]
					break
				default:
					break
			}
			console.log(area)
			this.dataForm.areaname = area
			return area
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		resetForm() {
			this.dataForm = {
				id: undefined,
				phone: undefined,
				name: undefined,
				gender: undefined,
				wechat: undefined,
				birthday: undefined,
				areaname: undefined,
				salesmanAddress: undefined,
				idcardProsUrl: undefined,
				idcardConsUrl: undefined
			}
			// this.salesmanDataForm = {
			//   id: undefined,
			//   name: undefined,
			//   phone: undefined,
			//   wechat: undefined,
			//   salemanstateid: undefined, // 状态
			//   operatorid: undefined,
			//   operatorname: undefined,
			//   updatatime: undefined,
			//   adminId: undefined,
			//   gender: undefined, // 性别
			//   birthday: undefined,
			//   areaname: undefined,
			//   salesmanAddress: undefined,
			//   idcardProsUrl: undefined,
			//   idcardConsUrl: undefined
			// }
		},
		uploadAvatar(response) {
			this.dataForm.avatar = response.data.url
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
							// this.list.unshift(response.data.dtsAdmin)
							this.getList()
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '添加业务员成功'
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
			console.log(row)
			if (row.type != null) {
				this.selectType = row.type
			}

			this.dataForm = Object.assign({}, row)
			if (this.dataForm.areaname != null) {
				this.selectedAreaOptions = TextToCode[this.dataForm.areaname.split('/')[0]][this.dataForm.areaname.split('/')[1]][this.dataForm.areaname.split('/')[2]].code
			}

			// if (this.dataForm.adminId != null) {
			//   this.dataForm.adminId = this.dataForm.adminId + ''
			// }
			// console.log(this.dataForm)
			// idGet({
			//   id: row.id
			// })
			//   .then(response => {
			//     // console.log(response)
			//     this.resetForm()
			//     this.dataForm =
			//     // this.dataForm = Object.assign({}, row)
			//     // if (response.data !== '未找到对应业务员') {
			//     //   this.salesmanDataForm = response.data
			//     // }
			//   })
			//   .catch(response => {
			//     this.$notify.error({
			//       title: '失败',
			//       message: response.data.errmsg
			//     })
			//   })
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					listedit(this.dataForm)
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
								message: '更新业务员成功'
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
			listDelete(row)
				.then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除业务员成功'
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
		}
		// handleDownload () {
		//   this.downloadLoading = true
		//   import('@/vendor/Export2Excel').then(excel => {
		//     const tHeader = ['业务员ID', '业务员名称', '业务员头像']
		//     const filterVal = ['id', 'username', 'avatar']
		//     excel.export_json_to_excel2(
		//       tHeader,
		//       this.list,
		//       filterVal,
		//       '业务员信息'
		//     )
		//     this.downloadLoading = false
		//   })
		// }
	}
}
</script>

<style scoped>
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
