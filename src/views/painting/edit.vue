<template>
	<div class="app-container">

		<el-card class="box-card">
			<h3>画册设置</h3>
			<el-form ref="painting" :rules="rules" :model="painting" label-width="150px">
				<!-- <el-form-item label="画册编号" prop="paint_id">
					<el-input v-model="painting.paint_id" />
					</el-form-item> -->
				<el-form-item label="画册名称" prop="paint_title">
					<el-input v-model="painting.paint_title" />
				</el-form-item>

				<el-form-item label="画册封面">
					<el-upload
						:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="painting.paint_url" class="avatar" :src="common.seamingImgUrl(painting.paint_url)" style=""
							fit="cover" :preview-src-list="[ common.seamingImgUrl(painting.paint_url) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="画册简介">
					<el-input v-model="painting.paint_info" />
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
import { listDetail, listedit } from '@/api/painting/painting'
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
			paint_id: null,
			painting: { paint_url: '', paint_title: '', paint_info: '' },
			rules: {
				// paint_id: [{ required: true, message: '画册编号不能为空', trigger: 'blur' }],
				paint_title: [ { required: true, message: '画册名称不能为空', trigger: 'blur' } ]
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
			if (!this.$route.query.id) return
			this.paint_id = this.$route.query.id
			listDetail(this.paint_id).then((response) => {
				// console.log(response.data.paint_title)
				this.painting.paint_title = response.data.paint_title
				this.painting.paint_url = response.data.paint_url
				this.painting.paint_info = response.data.paint_info
			})
			console.log(this.painting.paint_title)
		},
		handleCancel() {
			this.$router.push({ name: 'paintingList' })
		},
		handleEdit() {
			const finalpanting = {
				paint_id: this.paint_id,
				paint_title: this.painting.paint_title,
				paint_url: this.painting.paint_url,
				paint_info: this.painting.paint_info
			}
			listedit(finalpanting)
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
			this.painting.paint_url = response.data.url
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
