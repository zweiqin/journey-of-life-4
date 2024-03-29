<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.title" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入专题标题"
			/>
			<el-input
				v-model="listQuery.subtitle" clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="请输入专题子标题"
			/>
			<el-button
				v-permission="[ 'GET /admin/topic/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				v-permission="[ 'POST /admin/topic/create' ]" size="mini" class="filter-item" type="primary"
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
			<el-table-column align="center" label="专题标题" min-width="200" prop="title" />

			<el-table-column align="center" label="专题子标题" min-width="200" prop="subtitle" />

			<el-table-column align="center" property="picUrl" label="图片">
				<template slot-scope="scope">
					<img :src="common.seamingImgUrl(scope.row.picUrl)" width="100">
				</template>
			</el-table-column>

			<el-table-column align="center" label="专题详情" prop="content">
				<template slot-scope="scope">
					<el-dialog :visible.sync="contentDialogVisible" title="专题详情">
						<div v-html="contentDetail" />
					</el-dialog>
					<el-button type="primary" size="mini" @click="showContent(scope.row.content)">
						查看
					</el-button>
				</template>
			</el-table-column>

			<el-table-column align="center" label="价格" prop="price" />

			<el-table-column align="center" label="阅读数量" prop="readCount" sortable />

			<el-table-column align="center" label="操作" min-width="150" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						v-permission="[ 'POST /admin/topic/update' ]" type="primary" size="mini"
						@click="handleUpdate(scope.row)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="[ 'POST /admin/topic/delete' ]" type="danger" size="mini"
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
				<el-form-item label="专题标题" prop="title">
					<el-input v-model="dataForm.title" />
				</el-form-item>
				<el-form-item label="专题子标题" prop="subtitle">
					<el-input v-model="dataForm.subtitle" />
				</el-form-item>
				<el-form-item label="专题图片" prop="picUrl">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.picUrl" class="avatar" :src="common.seamingImgUrl(dataForm.picUrl)" style=""
							fit="cover" :preview-src-list="[ common.seamingImgUrl(dataForm.picUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="商品序号或ID">
					<el-tag v-for="tag in dataForm.goods" :key="tag" closable type="primary" @close="handleClose(tag)">
						{{ tag }}
					</el-tag>
					<el-input
						v-if="newGoodsVisible" ref="newGoodsInput" v-model="newGoodIdSn" class="input-new-goods"
						size="small"
						@keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"
					/>
					<el-button v-else class="button-new-keyword" size="small" type="primary" @click="showInput">
						+ 增加
					</el-button>
				</el-form-item>
				<el-form-item style="width: 700px;" label="专题内容">
					<Editor v-model="dataForm.content" :init="editorInit" />
				</el-form-item>
				<el-form-item label="商品价格" prop="price">
					<el-input v-model="dataForm.price" />
				</el-form-item>
				<el-form-item label="阅读量" prop="readCount">
					<el-input v-model="dataForm.readCount" />
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
import { listTopic, createTopic, updateTopic, deleteTopic } from '@/api/business/topic'
import { uploadPath } from '@/api/business/storage'
import Editor from '@tinymce/tinymce-vue'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
	name: 'Topic',
	components: { Editor, Pagination },
	data() {
		return {
			uploadPath,
			newGoodsVisible: false,
			newGoodIdSn: '',
			list: undefined,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				title: undefined,
				subtitle: undefined,
				sort: 'add_time',
				order: 'desc'
			},
			dataForm: {
				id: undefined,
				titile: undefined,
				subtitle: undefined,
				picUrl: undefined,
				content: '',
				price: undefined,
				readCount: undefined,
				goods: []
			},
			contentDetail: '',
			contentDialogVisible: false,
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '编辑',
				create: '创建'
			},
			rules: {
				title: [
					{ required: true, message: '专题标题不能为空', trigger: 'blur' }
				],
				subtitle: [
					{ required: true, message: '专题子标题不能为空', trigger: 'blur' }
				],
				content: [
					{ required: true, message: '专题内容不能为空', trigger: 'blur' }
				]
			},
			downloadLoading: false,
			editorInit: this.$root.editorInit
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
			listTopic(this.listQuery)
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
				titile: undefined,
				subtitle: undefined,
				picUrl: undefined,
				content: '',
				price: undefined,
				readCount: undefined,
				goods: []
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
		uploadPicUrl(response) {
			this.dataForm.picUrl = response.data.url
		},
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					createTopic(this.dataForm)
						.then((response) => {
							this.list.unshift(response.data)
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '创建专题成功'
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
		showContent(content) {
			this.contentDetail = content
			this.contentDialogVisible = true
		},
		handleUpdate(row) {
			this.dataForm = Object.assign({}, row)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					updateTopic(this.dataForm)
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
								message: '更新专题成功'
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
			deleteTopic(row)
				.then((response) => {
					this.$notify.success({
						title: '成功',
						message: '删除专题成功'
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
		},
		handleClose(tag) {
			this.dataForm.goods.splice(this.dataForm.goods.indexOf(tag), 1)
		},
		showInput() {
			this.newGoodsVisible = true
			this.$nextTick((_) => {
				this.$refs.newGoodsInput.$refs.input.focus()
			})
		},
		handleInputConfirm() {
			const newGoodIdSn = this.newGoodIdSn
			if (newGoodIdSn) {
				this.dataForm.goods.push(newGoodIdSn)
			}
			this.newGoodsVisible = false
			this.newGoodIdSn = ''
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = [
					'专题ID',
					'专题标题',
					'专题子标题',
					'专题内容',
					'专题图片',
					'商品低价',
					'阅读量',
					'专题商品'
				]
				const filterVal = [
					'id',
					'title',
					'subtitle',
					'content',
					'picUrl',
					'price',
					'readCount',
					'goods'
				]
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '专题信息')
				this.downloadLoading = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.el-dialog {
	width: 800px;
}

/deep/ .avatar-uploader {
	.el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.el-upload:hover {
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
}
</style>
