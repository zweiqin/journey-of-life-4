<template>
	<div class="app-container">

		<el-card class="box-card">
			<h3>新增文章信息</h3>
			<el-form ref="article" :rules="rules" :model="article" label-width="150px">
				<el-form-item label="类型" prop="type">
					<el-select v-model="article.type" size="mini" class="filter-item">
						<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="标题" prop="title">
					<el-input v-model="article.title" />
				</el-form-item>
				<el-form-item label="作者" prop="author">
					<el-input v-model="article.author" />
				</el-form-item>
				<el-form-item label="是否收费" prop="isVip">
					<el-radio-group v-model="article.isVip">
						<el-radio label="true">收费</el-radio>
						<el-radio label="false">免费</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="文章封面" prop="imgUrl">
					<el-upload
						:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="article.imgUrl" class="avatar" :src="common.seamingImgUrl(article.imgUrl)" style=""
							fit="cover" :preview-src-list="[ common.seamingImgUrl(article.imgUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<Editor v-model="article.content" :init="editorInit" />
				</el-form-item>
			</el-form>
		</el-card>

		<div class="op-container">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handlePublish">
				发布
			</el-button>
		</div>

	</div>
</template>

<script>
import { publishArticle } from '@/api/articleManagement/article'
import { uploadPath } from '@/api/business/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
	name: 'ArticleCreate',
	components: { Editor },

	data() {
		return {
			uploadPath,
			typeList: [{
				value: 1,
				label: '草帽服装'
			}, {
				value: 2,
				label: '餐饮酒店'
			}, {
				value: 3,
				label: '美容美发'
			}, {
				value: 4,
				label: '生活超市'
			}, {
				value: 5,
				label: '健身娱乐'
			}, {
				value: 6,
				label: '装修建材'
			}, {
				value: 7,
				label: '培训学校'
			}, {
				value: 8,
				label: '汽车美容'
			}, {
				value: 9,
				label: '爆粉秘籍'
			}, {
				value: 10,
				label: '抖音实例'
			}, {
				value: 11,
				label: '营销课程'
			}, {
				value: 12,
				label: '赚钱教程'
			}, {
				value: 13,
				label: '购买协议'
			}],
			article: { type: '', title: '', imgUrl: '', author: '', isVip: 'false', content: '' },
			rules: {
				type: [ { required: true, message: '类型不能为空', trigger: 'blur' } ],
				title: [ { required: true, message: '标题不能为空', trigger: 'blur' } ],
				author: [ { required: true, message: '作者不能为空', trigger: 'blur' } ],
				imgUrl: [ { required: true, message: '文章封面不能为空', trigger: 'blur' } ],
				content: [ { required: true, message: '内容不能为空', trigger: 'blur' } ]
			},
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
		this.init()
	},

	methods: {
		init() {
		},
		handleCancel() {
			this.$router.push({ name: 'teachArticleList' })
		},
		handlePublish() {
			this.$refs.article.validate((valid) => {
				if (valid) {
					publishArticle(this.article).then((response) => {
						console.log(response)
						this.$notify.success({
							title: '成功',
							message: '创建成功'
						})
						this.$router.push({ name: 'teachArticleList' })
					})
						.catch((response) => {
							MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
								confirmButtonText: '确定',
								type: 'error'
							})
						})
				}
			})
		},
		uploadPicUrl(response) {
			this.article.imgUrl = response.data.url
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
