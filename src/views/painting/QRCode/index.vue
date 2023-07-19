<template>
	<div class="base">
		<div class="itemdiv" style="width:50%;">
			打开内容：
			<el-input v-model="qrcodeText" />
			中间图标：
			<el-upload
				:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadPicUrl"
				class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
			>
				<el-image
					v-if="url" class="avatar" :src="common.seamingImgUrl(url)" style=""
					fit="cover"
					:preview-src-list="[ common.seamingImgUrl(url) ]"
				/>
				<i v-else class="el-icon-plus avatar-uploader-icon" />
			</el-upload>
			<!-- <el-input v-model="url" /> -->
			<VueQr
				id="qr" :text="qrcodeText" :correct-level="3" :size="250"
				:margin="10" :logo-src="common.seamingImgUrl(url)"
				:logo-scale=".2" :logo-margin="5" color-dark="#000" color-light="white"
				background-color="white"
				background-dimming="white" logo-background-color="white"
			/>
			<el-button type="primary" round @click="downloadImg">保存二维码</el-button>
			<!-- <h2>请用微信扫码支付</h2>
				<h2>￥<b>{{ amount }}</b>元
				</h2> -->
		</div>
	</div>
</template>

<script>
import vueQr from 'vue-qr' // 引入二维码生成组件
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'

export default {
	components: {
		VueQr: vueQr // 二维码生成组件
	},
	data() {
		return {
			uploadPath,
			// imgsrc: '@/assets/logo/smilLOGO.jpg',
			url: null,
			qrcodeText: process.env.BASE_SHOWAPI + '/#/paintingshow_out' // 二维码内容（扫码识别后需要访问的网址）
			// amount: 168// 金额
		}
	},
	computed: {
		headers() {
			return {
				'X-Dts-Admin-Token': getToken()
			}
		}
	},
	methods: {
		downloadImg() {
			this.downloadIamge(document.getElementById('qr'), '家具展示网页二维码')
		},
		// 下载二维码
		downloadIamge(el, name) {
			const img = el
			// // 将图片的src属性作为URL地址
			const url = img.src
			const a = document.createElement('a')
			const event = new MouseEvent('click')
			a.download = name || '下载二维码'
			a.href = url
			a.dispatchEvent(event)
		},
		uploadPicUrl(response) {
			console.log(response.data.url)
			this.url = response.data.url
		}
	}
}
</script>

<style lang="scss" scoped>
.base {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.itemdiv {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
