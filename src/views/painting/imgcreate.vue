<template>
	<div class="app-container">

		<el-card class="box-card">
			<h3>添加图片</h3>
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
						<el-image
							v-if="img.img_url" class="avatar" :src="common.seamingImgUrl(img.img_url)" style=""
							fit="cover"
							:preview-src-list="[ common.seamingImgUrl(img.img_url) ]"
						/>
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
			<el-button type="primary" @click="handlePublish">创建</el-button>
		</div>

	</div>
</template>

<script>
import { publishPaintingsPicture } from '@/api/painting/picture'
import { uploadPath } from '@/api/business/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
	name: 'ImgCreate',
	components: { Editor },

	data() {
		return {
			uploadPath,
			img: { paint_id: null, img_url: '', img_title: '', img_info: '' },
			rules: {
				// img_id: [{ required: true, message: '画册编号不能为空', trigger: 'blur' }],
				// img_title: [{ required: true, message: '画册名称不能为空', trigger: 'blur' }],
				img_url: [ { required: true, message: '图片不能为空', trigger: 'blur' } ]

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
	},
	mounted() {
		if (this.$route.query.id) {
			this.img.paint_id = this.$route.query.id
		}
	},
	methods: {
		handleCancel() {
			this.$router.push({ name: 'paintingList' })
		},
		handlePublish() {
			const finalimg = this.img
			publishPaintingsPicture(finalimg).then((response) => {
				this.$notify.success({
					title: '成功',
					message: '创建成功'
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

<style lang="scss" scoped>
.el-card {
	margin-bottom: 10px;
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
