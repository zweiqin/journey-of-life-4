<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-cascader v-model="regionArr" :props="regionProps" class="filter-item" size="mini" placeholder="请选择区域" />
			<el-button
				v-permission="[ 'GET /admin/talent/list' ]" size="mini" class="filter-item" type="primary"
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
			<!-- <el-upload
				:action="uploadUrl" :show-file-list="false" :headers="headers" :data="{}"
				:file-list="fileList"
				:before-upload="beforeUploadFile" :on-success="handleUploadSuccess" :on-error="() => $message.error('上传失败')"
				style="display: inline;margin-left: 10px" accept=".xlsx,.xls"
				>
				<el-button size="mini" type="primary" class="filter-item">上传达人文件</el-button>
				</el-upload> -->
			<el-button
				size="mini" class="filter-item" type="primary"
				icon="el-icon-edit" @click="handleCreate"
			>
				添加
			</el-button>
		</div>

		<!-- 查询结果 -->
		<div v-tableHeight>
			<el-table
				v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。"
				border fit height="100%"
				highlight-current-row
			>

				<el-table-column align="center" min-width="100px" label="达人ID" prop="id" />

				<el-table-column align="center" min-width="100px" label="达人名称" prop="name" />

				<el-table-column align="center" min-width="100px" property="avatar" label="头像">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.avatar" :src="common.splicingImgUrl() + scope.row.avatar" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.splicingImgUrl() + scope.row.avatar ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>

				<el-table-column align="center" min-width="100px" label="账号等级" prop="grade" />

				<el-table-column align="center" min-width="100px" label="地区" prop="region" />
				<el-table-column align="center" min-width="100px" label="地区名称" prop="regionName" />

				<el-table-column align="center" min-width="120px" label="介绍" prop="introduce" />

				<el-table-column align="center" label="操作" min-width="150px" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/talent/info' ]" type="primary" size="mini"
							@click="handleDetail(scope.row)"
						>
							详情
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/talent/update' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							编辑
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 达人详情对话框 -->
		<el-dialog :visible.sync="detailDialogVisible" title="达人详情" width="800">
			<el-form :data="dialogDetail" label-position="left">
				<el-form-item label="达人ID">
					<span>{{ dialogDetail.id }}</span>
				</el-form-item>
				<el-form-item label="达人名称">
					<span>{{ dialogDetail.name }}</span>
				</el-form-item>
				<el-form-item label="头像">
					<div>
						<el-image
							v-if="dialogDetail.avatar" :src="common.splicingImgUrl() + dialogDetail.avatar" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.splicingImgUrl() + dialogDetail.avatar ]"
						/>
						<span v-else>--</span>
					</div>
				</el-form-item>
				<el-form-item label="账号等级" prop="grade">
					<span>{{ dialogDetail.grade }}</span>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<span>{{ dialogDetail.phone }}</span>
				</el-form-item>
				<el-form-item label="地区">
					<span>{{ dialogDetail.region }}</span>
				</el-form-item>
				<el-form-item label="地区名称">
					<span>{{ dialogDetail.regionName }}</span>
				</el-form-item>
				<el-form-item label="介绍">
					<span>{{ dialogDetail.introduce }}</span>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 修改对话框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="left" label-width="80px"
				style="width: 100%; padding:0 35px;"
			>
				<el-form-item label="达人名称" prop="name">
					<el-input v-model="dataForm.name" />
				</el-form-item>
				<el-form-item label="头像">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataForm.avatar" :src="common.splicingImgUrl() + dataForm.avatar" width="80">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="账号等级" prop="grade">
					<el-input v-model="dataForm.grade" />
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="dataForm.phone" />
				</el-form-item>
				<el-form-item label="地区" prop="region">
					<el-input v-model="dataForm.region" disabled />
				</el-form-item>
				<el-form-item label="地区名称" prop="region">
					<el-cascader
						v-model="regionArrDialog" :props="regionProps" size="mini" placeholder="请选择区域"
						@change="dataForm.region = regionArrDialog[2]"
					/>
				</el-form-item>
				<el-form-item label="介绍" prop="introduce">
					<el-input v-model="dataForm.introduce" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" />
				</el-form-item>
				<el-form-item label="服务案例" prop="dtsTalentDatails">
					<el-table
						:data="dataForm.dtsTalentDatails" size="small" border fit
						height="100%" highlight-current-row
					>
						<el-table-column align="center" min-width="100px" label="案例ID" prop="id" />
						<el-table-column align="center" min-width="100px" label="企业名称" prop="name" />
						<el-table-column align="center" min-width="100px" property="logoUrl" label="logo">
							<template slot-scope="scope">
								<el-image
									v-if="scope.row.logoUrl" :src="common.splicingImgUrl() + scope.row.logoUrl" style="width:40px; height:40px" fit="cover"
									:preview-src-list="[ common.splicingImgUrl() + scope.row.logoUrl ]"
								/>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="100px" label="企业描述" prop="grade" />
						<el-table-column align="center" min-width="120px" property="caseUrl" label="案例图片">
							<template slot-scope="scope">
								<div v-if="scope.row.caseUrl && scope.row.caseUrl.length" style="display: flex;align-items: flex-end;">
									<div v-for="(item, index) in scope.row.caseUrl.substring(1, scope.row.caseUrl.length - 1).split(',').map((section) => section.substring(1, section.length - 1))" :key="index">
										<div v-if="index === 0">
											<el-image
												:src="item" style="width:40px; height:40px" fit="cover"
												:preview-src-list="scope.row.caseUrl.substring(1, scope.row.caseUrl.length - 1).split(',').map((section) => section.substring(1, section.length - 1))"
											/>
										</div>
									</div>
									<span v-if="scope.row.caseUrl.substring(1, scope.row.caseUrl.length - 1).split(',').map((section) => section.substring(1, section.length - 1)).length > 1" style="margin-left:8px;">+{{ scope.row.caseUrl.substring(1, scope.row.caseUrl.length - 1).split(',').map((section) => section.substring(1, section.length - 1)).length }}</span>
								</div>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="120px" label="案例描述" prop="caseDescribe" />
						<el-table-column align="center" min-width="120px" label="更新时间" prop="updateTime" />
						<el-table-column align="center" label="操作" min-width="150px" class-name="small-padding fixed-width">
							<template slot-scope="scope">
								<!-- <el-button
									type="primary" size="mini"
									@click="handleUpdateTalent(scope.row)"
									>
									编辑
									</el-button> -->
								<el-button
									type="danger" size="mini"
									@click="dataForm.dtsTalentDatails.splice(dataForm.dtsTalentDatails.findIndex((item) => scope.row.id === item.id), 1)"
								>
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
				<el-button v-if="dialogStatus == 'update'" type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="新增案例" :visible.sync="dialogFormVisibleTalent">
			<el-form
				ref="dataFormTalent" :rules="rulesTalent" :model="dataFormTalent" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<!-- <el-form-item label="案例ID" prop="id">
					<el-input v-model="dataFormTalent.id" disabled />
					</el-form-item> -->
				<el-form-item label="企业名称" prop="name">
					<el-input v-model="dataFormTalent.name" />
				</el-form-item>
				<el-form-item label="logo">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						:on-error="() => $message.error('上传失败')" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="dataFormTalent.logoUrl" :src="common.splicingImgUrl() + dataFormTalent.logoUrl" width="80">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="企业描述" prop="enterpriseDescribe">
					<el-input v-model="dataFormTalent.enterpriseDescribe" />
				</el-form-item>
				<el-form-item label="案例图片" prop="caseUrl">
					<el-upload
						:action="uploadPath"
						:limit="5"
						:headers="headers"
						:on-exceed="() => $message({ type: 'error', message: '上传文件个数超出限制!最多上传5张图片!' })"
						:on-success="(response, file, fileList) => response.errno === 0 && dataFormTalent.caseUrl.push(response.data.url)"
						:on-remove="handleRemove"
						multiple
						accept=".jpg,.jpeg,.png,.gif"
						list-type="picture-card"
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>
				<el-form-item label="案例描述" prop="caseDescribe">
					<el-input v-model="dataFormTalent.caseDescribe" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleTalent = false">取消</el-button>
				<el-button v-if="dialogStatusTalent == 'create'" type="primary" @click="createDataTalent">确定</el-button>
				<!-- <el-button v-if="dialogStatusTalent == 'update'" type="primary" @click="updateDataTalent">确定</el-button> -->
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { talentUpload, dtsTalentList, talentInfo, talentUpdate } from '@/api/marketing/wiseManList'
import { uploadPath } from '@/api/business/storage'
import { listSubRegion } from '@/api/business/region'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
	name: 'WiseManList',
	components: { Pagination },
	data() {
		return {
			fileList: [],
			uploadUrl: process.env.BASE_API + '/talent/upload',
			regionProps: {
				lazy: true,
				lazyLoad(node, resolve) {
					const { level } = node
					console.log(node)
					listSubRegion({ id: level === 0 ? 0 : node.data.id }).then((response) => {
						resolve(response.data.data.map((item) => ({
							id: item.id,
							value: item.code,
							label: level === 2 ? `${item.name}（${item.code}）` : item.name,
							leaf: level >= 2
						})))
					})
						.catch((response) => {
							this.$notify.error({
								title: '出错了',
								message: response.data.errmsg
							})
						})
				}
			},
			regionArr: ['', '', ''],
			list: undefined,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				region: ''
			},
			detailDialogVisible: false,
			dialogDetail: {
				id: '',
				name: '',
				grade: '',
				phone: '',
				avatar: '',
				region: '',
				regionName: '',
				introduce: '',
				dtsTalentDatails: []
			},
			downloadLoading: false,
			textMap: {
				update: '编辑',
				create: '创建'
			},
			dataForm: {
				id: '',
				name: '',
				grade: '',
				phone: '',
				avatar: '',
				region: '',
				introduce: '',
				dtsTalentDatails: []
			},
			regionArrDialog: ['', '', ''],
			uploadPath,
			dialogStatus: '',
			dialogFormVisible: false,
			rules: {
				name: [ { required: true, message: '达人名称不能为空', trigger: 'blur' } ],
				avatar: [ { required: true, message: '头像不能为空', trigger: 'blur' } ],
				grade: [ { required: true, message: '账号等级不能为空', trigger: 'blur' } ],
				region: [ { required: true, message: '地区不能为空', trigger: 'blur' } ],
				introduce: [ { required: true, message: '介绍不能为空', trigger: 'blur' } ]
			},

			dataFormTalent: {
				name: '',
				logoUrl: '',
				enterpriseDescribe: '',
				caseUrl: '',
				caseDescribe: ''
			},
			dialogStatusTalent: '',
			dialogFormVisibleTalent: false,
			rulesTalent: {
				name: [ { required: true, message: '案例名称不能为空', trigger: 'blur' } ],
				logoUrl: [ { required: true, message: 'logo图片不能为空', trigger: 'blur' } ],
				enterpriseDescribe: [ { required: true, message: '企业描述不能为空', trigger: 'blur' } ],
				caseUrl: [ { required: true, message: '案例图片不能为空', trigger: 'blur' } ],
				caseDescribe: [ { required: true, message: '案例描述不能为空', trigger: 'blur' } ]
			}
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
	},
	methods: {
		getList() {
			this.listLoading = true
			this.listQuery.region = this.regionArr[2]
			dtsTalentList(this.listQuery).then((response) => {
				// this.list = response.data.data.talentList
				this.list = [
					{
						'id': '',
						'name': '刘大写',
						'grade': '0',
						'phone': '1353910241',
						'avatar': 'ath0sw1rndswgr42gzq5.jpg',
						'region': '广东-佛山',
						'introduce': '打字富华大厦萨克解放军和',
						'dtsTalentDatails': [
							{
								'id': '1',
								'name': '团蜂科技',
								'logoUrl': 'https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/xyyn7b17narx0p30tthx.jpg',
								'enterpriseDescribe': '倒计时那幅画四大皆空发哈手打',
								'caseUrl': "['https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/ozq552edz3sdmu36fg67.png','https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/zuxa8mkogdnuczplg5g6.png','https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/35g5jxmhtef0rb787mi2.png']",
								'caseDescribe': '分段函数凤凰首府凯撒开发'
							},
							{
								'id': '2',
								'name': '团蜂科技',
								'logoUrl': 'https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/xyyn7b17narx0p30tthx.jpg',
								'enterpriseDescribe': '倒计时那幅画四大皆空发哈手打',
								'caseUrl': "['https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/ozq552edz3sdmu36fg67.png','https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/zuxa8mkogdnuczplg5g6.png','https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/35g5jxmhtef0rb787mi2.png']",
								'caseDescribe': '分段函数凤凰首府凯撒开发'
							},
							{
								'id': '3',
								'name': '团蜂科技',
								'logoUrl': 'https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/xyyn7b17narx0p30tthx.jpg',
								'enterpriseDescribe': '倒计时那幅画四大皆空发哈手打',
								'caseUrl': "['https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/ozq552edz3sdmu36fg67.png','https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/zuxa8mkogdnuczplg5g6.png','https://www.tuanfengkeji.cn:9527/jf-admin-api/admin/storage/fetch/35g5jxmhtef0rb787mi2.png']",
								'caseDescribe': '分段函数凤凰首府凯撒开发'
							}
						]
					}
				]
				this.total = response.data.data.total || 0
				this.listLoading = false
			})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		handleCreate() {
			this.resetForm()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		resetForm() {
			this.dataForm = {
				id: '',
				name: '',
				grade: '',
				phone: '',
				avatar: '',
				region: '',
				introduce: '',
				dtsTalentDatails: []
			}
		},
		handleRemove(file, fileList) {
			for (let i = 0; i < this.dataFormTalent.caseUrl.length; i++) {
				// 这里存在两种情况
				// 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
				//    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
				// 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
				let url
				if (file.response === undefined) {
					url = file.url
				} else {
					url = file.response.data.url
				}
				if (this.dataFormTalent.caseUrl[i] === url) {
					this.dataFormTalent.caseUrl.splice(i, 1)
				}
			}
		},
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},
		// // 限制上传文件类型
		// beforeUploadFile(file) {
		// 	const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
		// 	const isXls = extension === 'xls'
		// 	const isXlsx = extension === 'xlsx'
		// 	if (!isXls && !isXlsx) {
		// 		this.$message.warning('只能上传excel的文件')
		// 	}
		// 	return isXls || isXlsx
		// },
		handleDetail(row) {
			talentInfo({ id: row.id }).then((response) => {
				this.dialogDetail = response.data.data
			})
			this.detailDialogVisible = true
		},
		handleUpdate(row) {
			this.dataForm = Object.assign({}, row)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		uploadPicUrl(response) {
			this.dataForm.avatar = response.data.url
		},
		// handleUploadSuccess(response) {
		// 	if (response.data.fail.length) {
		// 		this.$notify.error({
		// 			title: '有数据插入失败',
		// 			message: `第${response.data.fail.join('、')}条数据插入失败`
		// 		})
		// 	} else {
		// 		this.$message.success('上传成功')
		// 	}
		// 	this.getList()
		// },
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					talentUpdate(this.dataForm).then(() => {
						this.getList()
						this.dialogFormVisible = false
						this.$notify.success({
							title: '成功',
							message: '更新成功'
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
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['达人名称', '头像', '账号等级', '地区', '介绍']
				const filterVal = ['name', 'avatar', 'grade', 'region', 'introduce']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '达人列表')
				this.downloadLoading = false
			})
		}
	}
}
</script>

<style></style>
