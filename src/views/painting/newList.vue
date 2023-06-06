<template>
	<div class="app-container">
		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-input
				v-model="listQuery.paint_title"
				clearable
				size="mini"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入画册名称"
			/>
			<el-input
				v-model="listQuery.paint_id"
				clearable
				size="mini"
				class="filter-item"
				style="width: 200px"
				placeholder="请输入画册ID"
			/>
			<el-button
				size="mini"
				class="filter-item"
				type="primary"
				icon="el-icon-search"
				@click="handleFilter"
			>
				查找
			</el-button>
			<el-button
				size="mini"
				class="filter-item"
				type="primary"
				icon="el-icon-edit"
				@click="handleCreate"
			>
				添加
			</el-button>
		</div>
		<div v-tableHeight>
			<!-- 查询结果 -->
			<el-table
				ref="painting"
				v-loading="listLoading"
				:data="list"
				size="small"
				element-loading-text="正在查询中。。。"
				border
				fit
				highlight-current-row
			>
				<!-- 查询结果 -->
				<el-table-column
					align="center"
					min-width="30"
					label="画册ID"
					prop="paint_id"
					sortable
				/>
				<el-table-column
					align="center"
					min-width="200"
					label="画册名称"
					prop="paint_title"
				/>

				<el-table-column align="center" property="paint_url" label="画册封面图">
					<template slot-scope="scope">
						<img :src="common.seamingImgUrl(scope.row.paint_url)" width="40" />
					</template>
				</el-table-column>

				<el-table-column align="center" property="paint_info" label="简介">
					<template slot-scope="scope">
						{{ scope.row.paint_info }}
					</template>
				</el-table-column>

				<el-table-column align="center" label="图片列表" prop="paint_info">
					<template slot-scope="scope">
						<el-button
							type="primary"
							@click="ViewPhotos(scope.row.paint_id)"
						>
							查看画册图片
						</el-button>
					</template>
				</el-table-column>

				<el-table-column
					align="center"
					label="操作"
					width="400"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="scope">
						<el-button type="primary" @click="addListItemImage(scope.row.paint_id)">
							添加画册图片
						</el-button>
						<el-button @click="handleUpdata(scope.row)">
							编辑
						</el-button>
						<el-button type="danger" @click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				v-show="total > 0"
				:total="total"
				:page.sync="listQuery.page"
				:limit.sync="listQuery.limit"
				@pagination="getList"
			/>
		</div>
		<!-- 添加画册 -->
		<el-dialog
			v-show="isCreatedList"
			title="创建新画册"
			:visible.sync="isCreatedList"
			width="80%"
		>
			<el-form ref="CreateList" :model="Createform">
				<el-form-item label="画册名称" label-width="120px">
					<el-input
						v-model="Createform.paint_title"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="画册简介" label-width="120px">
					<el-input
						v-model="Createform.paint_info"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="用户ID(user_id)" label-width="120px">
					<el-input v-model="Createform.user_id" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="画册封面" label-width="120px" prop="imageUrl">
					<el-upload
						:headers="headers"
						:action="uploadPath"
						:show-file-list="false"
						:on-success="uploadLogoUrl"
						class="avatar-uploader"
						accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="Createform.paint_url"
							:src="common.seamingImgUrl(Createform.paint_url)"
							class="avatar"
						/>
						<!-- <i class="el-icon-zoom-in"></i> -->
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="CreatedateData()">
					确定
				</el-button>
				<el-button @click="isCreatedList = false"> 取消 </el-button>
			</div>
		</el-dialog>
		<!-- 修改画册信息 -->
		<el-dialog
			v-show="isUpdataFrom"
			title="修改画册信息"
			:visible.sync="isUpdataFrom"
			width="80%"
		>
			<el-form ref="UpdataList" :model="Updataform">
				<el-form-item label="画册名称" label-width="120px">
					<el-input
						v-model="Updataform.paint_title"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="画册简介" label-width="120px">
					<el-input
						v-model="Updataform.paint_info"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="用户ID(user_id)" label-width="120px">
					<el-input v-model="Updataform.user_id" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="画册封面" label-width="120px" prop="imageUrl">
					<el-upload
						:headers="headers"
						:action="uploadPath"
						:show-file-list="false"
						:on-success="UpdataUploadLogoUrl"
						class="avatar-uploader"
						accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="Updataform.paint_url"
							:src="common.seamingImgUrl(Updataform.paint_url)"
							class="avatar"
						/>
						<!-- <i class="el-icon-zoom-in"></i> -->
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="SubUpDataFrom(Updataform)">
					确定
				</el-button>
				<el-button @click="isUpdataFrom = false"> 取消 </el-button>
			</div>
		</el-dialog>
		<!-- 画册图片展示 -->
		<el-dialog
			v-show="isViewPhotos"
			title="查看画册图片"
			:visible.sync="isViewPhotos"
			width="80%"
		>
			<el-table
				height="420px"
				:data="ListItemImgArr"
				size="small"
				element-loading-text="正在查询中。。。"
				border
				fit
				highlight-current-row
			>
				<el-table-column
					align="center"
					label="图片ID"
					prop="img_id"
					sortable
				/>
				<el-table-column
					align="center"
					label="照片title"
					prop="img_title"
					sortable
				/>
				<el-table-column
					align="center"
					label="照片简介"
					prop="img_info"
					sortable
				/>
				<el-table-column align="center" property="avatar" label="照片详情">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.img_url"
							:src="common.seamingImgUrl(scope.row.img_url)"
							style="width: 40px; height: 40px"
							fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.img_url) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					label="操作"
					class-name="small-padding fixed-width"
					width="250"
				>
					<template slot-scope="scope">
						<el-button
							type="primary"
							size="mini"
							@click="upDateImage(scope.row)"
						>
							修改
						</el-button>
						<el-button
							type="danger"
							size="mini"
							@click="deleteImage(scope.row.img_id)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				v-show="imgTotals > 0" :total="imgTotals" :page.sync="listQueryImg.page" :limit.sync="listQueryImg.limit"
				@pagination="getListItemImage"
			/>
		</el-dialog>
		<!-- 添加画册图片及信息 -->
		<el-dialog
			v-show="isCreatedListItemImage"
			title="创建新画册"
			:visible.sync="isCreatedListItemImage"
			width="80%"
		>
			<el-form ref="CreateListImg" :model="ImageCreateform">
				<el-form-item label="图片名称" label-width="120px">
					<el-input
						v-model="ImageCreateform.img_title"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="图片简介" label-width="120px">
					<el-input
						v-model="ImageCreateform.img_info"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="画册图片" label-width="120px" prop="imageUrl">
					<el-upload
						:headers="headers"
						:action="uploadPath"
						:show-file-list="false"
						:on-success="uploadImgUrl"
						class="avatar-uploader"
						accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="ImageCreateform.img_url"
							:src="common.seamingImgUrl(ImageCreateform.img_url)"
							class="avatar"
						/>
						<!-- <i class="el-icon-zoom-in"></i> -->
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="createListItemImage()">
					确定
				</el-button>
				<el-button @click="isCreatedListItemImage = false"> 取消 </el-button>
			</div>
		</el-dialog>
		<!-- 修改画册图片信息 -->
		<el-dialog
			v-show="isUpdataImage"
			title="修改图片信息"
			:visible.sync="isUpdataImage"
			width="80%"
		>
			<el-form ref="UpdataImage" :model="ImageUpdataform">
				<el-form-item label="图片名称" label-width="120px">
					<el-input
						v-model="ImageUpdataform.img_title"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="图片简介" label-width="120px">
					<el-input
						v-model="ImageUpdataform.img_info"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="修改图片" label-width="120px" prop="imageUrl">
					<el-upload
						:headers="headers"
						:action="uploadPath"
						:show-file-list="false"
						:on-success="UpdataUploadLogoUrl"
						class="avatar-uploader"
						accept=".jpg,.jpeg,.png,.gif"
					>
						<img
							v-if="ImageUpdataform.img_url"
							:src="common.seamingImgUrl(ImageUpdataform.img_url)"
							class="avatar"
						/>
						<!-- <i class="el-icon-zoom-in"></i> -->
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="SubUpDataListItemImage()">
					确定
				</el-button>
				<el-button @click="isUpdataImage = false"> 取消 </el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
// 获取token
import { getToken } from '@/utils/auth'
// 分页选择器
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import {
	listGet,
	listCreate,
	listUpdata,
	listDeleted,
	uploadPath,
	getListImage,
	listImageAdd,
	listImageUpdate,
	listImageDelete
} from '@/api/painting/painting'
// Secondary package based on el-pagination

export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'NewList',
	components: { Pagination },
	data() {
		return {
			uploadPath,
			list: [],
			total: 0,
			imgTotals: 0,
			isCreatedList: false,
			isUpdataFrom: false,
			isViewPhotos: false,
			isUpdataImage: false,
			isCreatedListItemImage: false,
			listLoading: [],
			Createform: {
				paint_id: '',
				paint_info: '',
				paint_title: '',
				paint_url: '',
				user_id: ''
			},
			Updataform: {
				paint_id: '',
				paint_info: '',
				paint_title: '',
				paint_url: '',
				user_id: ''
			},
			listQuery: {
				page: 1,
				limit: 20,
				paint_id: null,
				paint_title: null,
				user_id: null,
				sort: 'add_time',
				order: 'asc' // desc倒序
			},
			ListItemImgArr: [],
			listQueryImg: {
				page: 1,
				limit: 10,
				paint_id: 1,
				sort: 'add_time',
				order: 'asc' // desc倒序
			},
			ImageCreateform: {
				'img_id': '',
				'paint_id': '',
				'img_url': '',
				'img_title': '',
				'img_info': ''
			},
			ImageUpdataform: {
				'img_id': '',
				'paint_id': '',
				'img_url': '',
				'img_title': '',
				'img_info': ''
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
		// 测试搜索 此搜索为每个画册对应的画册id进行搜索，返回的值为对应的画册下面的图片数据
		// getListImage({
		// 	page: 1,
		// 	limit: 10,
		// 	paint_id: 4,
		// 	sort: 'add_time',
		// 	order: 'asc' // desc倒序
		// })
		// 测试添加
		// listImageAdd({
		// 	'img_id': '',
		// 	'paint_id': '4',
		// 	'img_url': 'asw6pxeod1cyv01y58q0.jpg',
		// 	'img_title': '哈哈哈哈',
		// 	'img_info': '哈哈哈哈'
		// })
		// 测试图片详情
		// listImageDetail({ id: '40' }).then((res) => {
		// 	window.console.log(res)
		// })
		// 测试修改
		listUpdata({
			'img_id': '11',
			'paint_id': '1',
			'img_url': 'zl5s0a1p2pnh0dmfjtat.jpg',
			'img_title': '123',
			'img_info': '312'
		})
		// 测试图片删除  // 可以只传图片的ID
		// listImageDelete({
		// 	'img_id': '40'
		// })
		// listGet({ id: '2' }).then((res) => {
		// 	window.console.log(res)
		// })  // 经过测试发现请求的数据和getList一样，暂时不作使用
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listGet(this.listQuery)
				.then((response) => {
					this.list = response.data.items
					window.console.log(response.data)
					this.total = response.data.total
					this.listLoading = false
				})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		// 搜索方法
		handleFilter() {
			this.listQuery.page = 1
			this.getList()
			// console.log(this.listQuery)
		},
		// 创建画册方法
		handleCreate() {
			this.isCreatedList = true
		},
		// 图片上传
		uploadLogoUrl(response) {
			this.Createform.paint_url = response.data.url
			window.console.log(response)
		},
		// 表单提交 添加
		CreatedateData() {
			this.$refs.CreateList.validate((valid) => {
				if (valid) {
					// window.console.log(this.Createform)  qdu2lmty1osmyapsbxda.jpg
					// listCreate({ ...this.Createform, paintUrl: JSON.stringify(this.Createform.paintUrl) })
					listCreate(this.Createform)
						.then(() => {
							this.getList()
							this.isCreatedList = false
							this.$notify.success({
								title: '成功',
								message: '更新成功'
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
		// 编辑画册 listUpdata
		handleUpdata(row) {
			this.isUpdataFrom = true
			// 需要格式化，否则会因为引用同一个地址导致表格上的图片改变
			this.Updataform = JSON.parse(JSON.stringify(row))
		},
		// 修改画册封面图片
		UpdataUploadLogoUrl(response) {
			this.Updataform.paint_url = response.data.url
		},
		// 添加图片时的图片上传
		uploadImgUrl(response) {
			this.ImageCreateform.img_url = response.data.url
		},
		// 提交修改
		SubUpDataFrom() {
			this.$refs.UpdataList.validate((valid) => {
				if (valid) {
					// window.console.log(this.Createform)  qdu2lmty1osmyapsbxda.jpg
					// listCreate({ ...this.Createform, paintUrl: JSON.stringify(this.Createform.paintUrl) })
					listUpdata(this.Updataform)
						.then(() => {
							this.getList()
							this.$notify.success({
								title: '成功',
								message: '更新成功'
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
				this.isUpdataFrom = false
			})
		},
		// 删除
		handleDelete(params) {
			this.$confirm('确认要进行此操作-删除该画册？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					listDeleted(params)
						.then((response) => {
							this.$message({
								showClose: true,
								message: '成功删除',
								type: 'success'
							})
							this.getList()
						})
						.catch((response) => {
							this.$notify.error({
								title: '失败',
								message: response.errmsg
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
		// 查看画册图片
		ViewPhotos(paint_id) {
			this.isViewPhotos = true
			this.listQueryImg.paint_id = paint_id
			getListImage(this.listQueryImg).then((res) => {
				this.imgTotals = res.data.total
				this.ListItemImgArr = res.data.items
				window.console.log(this.ListItemImgArr)
			})
				.catch((err) => {
					window.console.log(err)
				})
		},
		// 分页选择器触发的事件
		getListItemImage() {
			getListImage(this.listQueryImg).then((res) => {
				this.ListItemImgArr = res.data.items
				window.console.log(this.ListItemImgArr)
			})
				.catch((err) => {
					console.log(err)
				})
		},
		// 添加画册图片
		addListItemImage(id) {
			this.isCreatedListItemImage = true
			this.ImageCreateform.paint_id = id
			// listImageAdd
		},
		// 提交画册图片的添加
		createListItemImage() {
			this.$refs.CreateListImg.validate((valid) => {
				if (valid) {
					listImageAdd(this.ImageCreateform)
						.then(() => {
							this.$notify.success({
								title: '成功',
								message: '更新成功'
							})
							getListImage(this.listQueryImg).then((res) => {
								this.imgTotals = res.data.total
								this.ListItemImgArr = res.data.items
							})
							this.$refs.CreateListImg.resetFields()
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
				this.isCreatedListItemImage = false
			})
		},
		// 删除图片
		deleteImage(id) {
			this.$confirm(
				'确定要删除吗？',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					// 删除图片
					listImageDelete({ 'img_id': id })
						.then((response) => {
							this.$message({
								showClose: true,
								message: '操作成功',
								type: 'success'
							})
							getListImage(this.listQueryImg).then((res) => {
								this.imgTotals = res.data.total
								this.ListItemImgArr = res.data.items
							})
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
		// 修改画册图片信息
		SubUpDataListItemImage() {
			this.$refs.UpdataImage.validate((valid) => {
				if (valid) {
					// window.console.log(this.Createform)  qdu2lmty1osmyapsbxda.jpg
					// listCreate({ ...this.Createform, paintUrl: JSON.stringify(this.Createform.paintUrl) })
					listUpdata(this.ImageUpdataform)
						.then(() => {
							this.$notify.success({
								title: '成功',
								message: '更新成功'
							})
							getListImage(this.listQueryImg).then((res) => {
								this.imgTotals = res.data.total
								this.ListItemImgArr = res.data.items
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
				this.isUpdataFrom = false
			})
			this.$refs.UpdataImage.resetFields()
		},
		upDateImage(row) {
			this.isUpdataImage = true
			// 需要格式化，否则会因为引用同一个地址导致表格上的图片改变
			this.ImageUpdataform = JSON.parse(JSON.stringify(row))
		}
	}
}
</script>

<style>
.el-dialog {
  width: 60%;
}

.table-expand {
  font-size: 0;
}

.table-expand label {
  width: 100px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}

.gallery {
  width: 80px;
  margin-right: 10px;
}

.TXBJW {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.app-container >>> .el-table__expanded-cell {
  padding: 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff !important;
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
