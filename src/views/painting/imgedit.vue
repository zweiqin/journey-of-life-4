<template>
	<div class="app-container">

		<el-card class="box-card">
			<h3>图片修改</h3>
			<el-form ref="img" :rules="rules" :model="img" label-width="150px">
				<!-- <el-form-item label="画册编号" prop="img_id">
					<el-input v-model="img.img_id" />
					</el-form-item> -->
				<el-form-item label="图片名称" prop="img_title">
					<el-input v-model="img.img_title" />
				</el-form-item>

				<el-form-item label="图片">
					<el-upload
						:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<img v-if="img.img_url" :src="common.seamingImgUrl(img.img_url)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="图片简介">
					<el-input v-model="img.img_info" />
				</el-form-item>
			</el-form>
		</el-card>

		<div class="op-container">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleEdit">修改</el-button>
		</div>
	</div>
</template>

<script>
import { listDetailPicture, listeditPicture } from '@/api/painting/picture'
import { uploadPath } from '@/api/business/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
	name: 'GoodsEdit',
	components: { Editor },
	data() {
		return {
			uploadPath,
			img_id: null,
			img: { paint_id: null, img_url: '', img_title: '', img_info: '' },
			rules: {
				// img_id: [{ required: true, message: '画册编号不能为空', trigger: 'blur' }],
				img_title: [ { required: true, message: '画册名称不能为空', trigger: 'blur' } ]
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
	mounted() {
		this.init()
	},
	methods: {
		init() {
			if (this.$route.query.img_id == null || this.$route.query.paint_id == null) {
				return
			}

			this.img_id = this.$route.query.img_id
			this.img.paint_id = this.$route.query.paint_id
			listDetailPicture(this.img_id).then((response) => {
				// console.log(response.data.img_title)
				this.img.img_title = response.data.img_title
				this.img.img_url = response.data.img_url
				this.img.img_info = response.data.img_info
			})
			console.log(this.img.img_title)
		},
		handleCancel() {
			this.$router.push({ name: 'paintingList' })
		},
		handleEdit() {
			const finalpanting = {
				img_id: this.img_id,
				paint_id: this.img.paint_id,
				img_title: this.img.img_title,
				img_url: this.img.img_url,
				img_info: this.img.img_info
			}
			listeditPicture(finalpanting)
				.then((response) => {
					this.$notify.success({
						title: '成功',
						message: '修改成功'
					})
					this.$router.push({ name: 'paintingList' })
				})
				.catch((response) => {
					MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
						confirmButtonText: '确定',
						type: 'error'
					})
				})
		},
		uploadPicUrl(response) {
			this.img.img_url = response.data.url
		}
	}
}
</script>

<style>
.el-card {
	margin-bottom: 10px;
}

.el-tag+.el-tag {
	margin-left: 10px;
}

.input-new-keyword {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}

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
