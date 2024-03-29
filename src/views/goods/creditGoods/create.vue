<template>
	<div class="app-container">

		<el-card class="box-card">
			<h3>商品介绍</h3>
			<el-form ref="goods" :rules="rules" :model="goods" status-icon label-width="150px">
				<el-form-item label="商品名称" prop="name">
					<el-input v-model="goods.name" />
				</el-form-item>
				<el-form-item label="是否在售" prop="isOnSale">
					<el-radio-group v-model="goods.isOnSale">
						<el-radio :label="true">在售</el-radio>
						<el-radio :label="false">未售</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="商品图片">
					<el-upload
						:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="goods.picUrl" class="avatar" :src="common.seamingImgUrl(goods.picUrl)" style=""
							fit="cover"
							:preview-src-list="[ common.seamingImgUrl(goods.picUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="宣传画廊">
					<el-upload
						:action="uploadPath" :limit="5" :headers="headers" :on-exceed="uploadOverrun"
						:on-success="handleGalleryUrl" :on-remove="handleRemove" multiple accept=".jpg,.jpeg,.png,.gif"
						list-type="picture-card"
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>

				<el-form-item label="商品单位">
					<el-input v-model="goods.unit" placeholder="件 / 个 / 盒" />
				</el-form-item>

				<el-form-item label="商品简介">
					<el-input v-model="goods.brief" />
				</el-form-item>

				<el-form-item label="商品详细介绍">
					<Editor v-model="goods.detail" :init="editorInit" />
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="box-card">
			<h3>商品规格</h3>
			<el-row :gutter="20" type="flex" align="middle" style="padding:20px 0;">
				<el-col :span="10">
					<el-radio-group v-model="multipleSpec" @change="specChanged">
						<el-radio-button :label="false">默认标准规格</el-radio-button>
						<el-radio-button :label="true">多规格支持</el-radio-button>
					</el-radio-group>
				</el-col>
				<el-col v-if="multipleSpec" :span="10">
					<el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>
				</el-col>
			</el-row>

			<el-table :data="specifications">
				<el-table-column property="specification" label="规格名" />
				<el-table-column property="value" label="规格值">
					<template slot-scope="scope">
						<el-tag type="primary">
							{{ scope.row.value }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column property="picUrl" label="规格图片">
					<template slot-scope="scope">
						<img v-if="scope.row.picUrl" :src="common.seamingImgUrl(scope.row.picUrl)" width="40">
					</template>
				</el-table-column>
				<el-table-column v-if="multipleSpec" align="center" label="操作" width="250" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog :visible.sync="specVisiable" title="设置规格">
				<el-form
					ref="specForm" :rules="rules" :model="specForm" status-icon
					label-position="left" label-width="100px"
					style="width: 400px; margin-left:50px;"
				>
					<el-form-item label="规格名" prop="specification">
						<el-input v-model="specForm.specification" />
					</el-form-item>
					<el-form-item label="规格值" prop="value">
						<el-input v-model="specForm.value" />
					</el-form-item>
					<el-form-item label="规格图片" prop="picUrl">
						<el-upload
							:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadSpecPicUrl"
							class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
						>
							<el-image
								v-if="specForm.picUrl" class="avatar" :src="common.seamingImgUrl(specForm.picUrl)" style=""
								fit="cover" :preview-src-list="[ common.seamingImgUrl(specForm.picUrl) ]"
							/>
							<i v-else class="el-icon-plus avatar-uploader-icon" />
						</el-upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="specVisiable = false">取消</el-button>
					<el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
				</div>
			</el-dialog>
		</el-card>

		<el-card class="box-card">
			<h3>商品库存</h3>
			<el-table :data="products">
				<el-table-column property="value" label="货品规格">
					<template slot-scope="scope">
						<el-tag v-for="tag in scope.row.specifications" :key="tag">
							{{ tag }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column property="price" width="100" label="兑换积分" />
				<el-table-column property="number" width="100" label="货品数量" />
				<el-table-column property="url" width="100" label="货品图片">
					<template slot-scope="scope">
						<img v-if="scope.row.url" :src="common.seamingImgUrl(scope.row.url)" width="40">
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="handleProductShow(scope.row)">设置</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog :visible.sync="productVisiable" title="设置货品">
				<el-form
					ref="productForm" :model="productForm" status-icon label-position="left"
					label-width="100px"
					style="width: 400px; margin-left:50px;"
				>
					<el-form-item label="货品规格列" prop="specifications">
						<el-tag v-for="tag in productForm.specifications" :key="tag">
							{{ tag }}
						</el-tag>
					</el-form-item>
					<el-form-item label="货品售价" prop="price">
						<el-input v-model="productForm.price" />
					</el-form-item>
					<el-form-item label="货品数量" prop="number">
						<el-input v-model="productForm.number" />
					</el-form-item>
					<el-form-item label="货品图片" prop="url">
						<el-upload
							:action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadProductUrl"
							class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
						>
							<el-image
								v-if="productForm.url" class="avatar" :src="common.seamingImgUrl(productForm.url)" style=""
								fit="cover" :preview-src-list="[ common.seamingImgUrl(productForm.url) ]"
							/>
							<i v-else class="el-icon-plus avatar-uploader-icon" />
						</el-upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="productVisiable = false">取消</el-button>
					<el-button type="primary" @click="handleProductEdit">确定</el-button>
				</div>
			</el-dialog>
		</el-card>

		<div class="op-container">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handlePublish">上架</el-button>
		</div>

	</div>
</template>

<script>
import { publishGoods } from '@/api/business/creditGoods'
import { uploadPath } from '@/api/business/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
	name: 'CreditGoodsCreate',
	components: { Editor },

	data() {
		return {
			uploadPath,
			goods: { brandId: '', picUrl: '', gallery: [] },
			specVisiable: false,
			specForm: { specification: '', value: '', picUrl: '' },
			multipleSpec: false,
			specifications: [ { specification: '规格', value: '标准', picUrl: '' } ],
			productVisiable: false,
			productForm: { id: 0, specifications: [], price: 0.00, number: 0, url: '' },
			products: [ { id: 0, specifications: [ '标准' ], price: 0.00, number: 0, url: '' } ],
			rules: {
				name: [ { required: true, message: '商品名称不能为空', trigger: 'blur' } ]
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
			if (this.$route.query.lastRouter === 'BrandCreditGoodsShow' || this.$route.query.lastRouter === 'list') {
				this.goods.brandId = this.$route.query.brandId
			}
		},
		handleCancel() {
			if (this.$route.query.lastRouter === 'BrandCreditGoodsShow') {
				this.$router.push({ name: 'BrandCreditGoodsShow', query: { id: this.$route.query.brandId } })
			} else {
				this.$router.push({ name: 'creditGoodsList' })
			}
		},
		handlePublish() {
			this.$refs.goods.validate((valid) => {
				if (valid) {
					const finalGoods = {
						integralGoods: this.goods,
						specifications: this.specifications,
						products: this.products
					}
					publishGoods(finalGoods).then((response) => {
						this.$notify.success({
							title: '成功',
							message: '创建成功'
						})
						if (this.$route.query.lastRouter === 'BrandCreditGoodsShow') {
							this.$router.push({ name: 'BrandCreditGoodsShow', query: { id: this.$route.query.brandId } })
						} else {
							this.$router.push({ name: 'creditGoodsList' })
						}
					})
						.catch((response) => {
							console.log(response)
							MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
								confirmButtonText: '确定',
								type: 'error'
							})
						})
				}
			})
		},
		uploadPicUrl(response) {
			this.goods.picUrl = response.data.url
		},
		uploadOverrun() {
			this.$message({
				type: 'error',
				message: '上传文件个数超出限制!最多上传5张图片!'
			})
		},
		handleGalleryUrl(response, file, fileList) {
			if (response.errno === 0) {
				this.goods.gallery.push(response.data.url)
			}
		},
		handleRemove(file, fileList) {
			for (var i = 0; i < this.goods.gallery.length; i++) {
				// 这里存在两种情况
				// 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
				//    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
				// 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
				var url
				if (file.response === undefined) {
					url = file.url
				} else {
					url = file.response.data.url
				}
				if (this.goods.gallery[i] === url) {
					this.goods.gallery.splice(i, 1)
				}
			}
		},
		specChanged(label) {
			if (label === false) {
				this.specifications = [ { specification: '规格', value: '标准', picUrl: '' } ]
				this.products = [ { id: 0, specifications: [ '标准' ], price: 0.00, number: 0, url: '' } ]
			} else {
				this.specifications = []
				this.products = []
			}
		},
		uploadSpecPicUrl(response) {
			this.specForm.picUrl = response.data.url
		},
		handleSpecificationShow() {
			this.specForm = { specification: '', value: '', picUrl: '' }
			this.specVisiable = true
		},
		handleSpecificationAdd() {
			var index = this.specifications.length - 1
			for (var i = 0; i < this.specifications.length; i++) {
				const v = this.specifications[i]
				if (v.specification === this.specForm.specification) {
					index = i
				}
			}
			this.specifications.splice(index + 1, 0, this.specForm)
			this.specVisiable = false
			this.specToProduct()
		},
		handleSpecificationDelete(row) {
			const index = this.specifications.indexOf(row)
			this.specifications.splice(index, 1)
			this.specToProduct()
		},
		specToProduct() {
			if (this.specifications.length === 0) {
				return
			}
			// 根据specifications创建临时规格列表
			var specValues = []
			var spec = this.specifications[0].specification
			var values = []
			values.push(0)
			for (var i = 1; i < this.specifications.length; i++) {
				const aspec = this.specifications[i].specification
				if (aspec === spec) {
					values.push(i)
				} else {
					specValues.push(values)
					spec = aspec
					values = []
					values.push(i)
				}
			}
			specValues.push(values)
			// 根据临时规格列表生产货品规格
			// 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
			var productsIndex = 0
			var products = []
			var combination = []
			var n = specValues.length
			for (var s = 0; s < n; s++) {
				combination[s] = 0
			}
			var index = 0
			var isContinue = false
			do {
				var specifications = []
				for (var x = 0; x < n; x++) {
					var z = specValues[x][combination[x]]
					specifications.push(this.specifications[z].value)
				}
				products[productsIndex] = { id: productsIndex, specifications, price: 0.00, number: 0, url: '' }
				productsIndex++
				index++
				combination[n - 1] = index
				for (var j = n - 1; j >= 0; j--) {
					if (combination[j] >= specValues[j].length) {
						combination[j] = 0
						index = 0
						if (j - 1 >= 0) {
							combination[j - 1] = combination[j - 1] + 1
						}
					}
				}
				isContinue = false
				for (var p = 0; p < n; p++) {
					if (combination[p] !== 0) {
						isContinue = true
					}
				}
			} while (isContinue)
			this.products = products
		},
		handleProductShow(row) {
			this.productForm = Object.assign({}, row)
			this.productVisiable = true
		},
		uploadProductUrl(response) {
			this.productForm.url = response.data.url
		},
		handleProductEdit() {
			for (var i = 0; i < this.products.length; i++) {
				const v = this.products[i]
				if (v.id === this.productForm.id) {
					this.products.splice(i, 1, this.productForm)
					break
				}
			}
			this.productVisiable = false
		}
	}
}
</script>

<style lang="scss" scoped>
.el-card {
	margin-bottom: 10px;
}

.el-tag+.el-tag {
	margin-left: 10px;
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
