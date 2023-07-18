<template>
	<div class="app-container">

		<el-card class="box-card">
			<h3>商品介绍</h3>
			<el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
				<el-form-item label="商品编号" prop="goodsSn">
					<el-input v-model="goods.goodsSn" />
				</el-form-item>
				<el-form-item label="商品名称" prop="name">
					<el-input v-model="goods.name" />
				</el-form-item>
				<el-form-item label="专柜价格" prop="counterPrice">
					<el-input v-model="goods.counterPrice" placeholder="0.00">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="当前价格" prop="retailPrice">
					<el-input v-model="goods.retailPrice" placeholder="0.00">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="是否新品" prop="isNew">
					<el-radio-group v-model="goods.isNew">
						<el-radio :label="true">新品</el-radio>
						<el-radio :label="false">非新品</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否热卖" prop="isHot">
					<el-radio-group v-model="goods.isHot">
						<el-radio :label="false">普通</el-radio>
						<el-radio :label="true">热卖</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="是否在售" prop="isOnSale">
					<el-radio-group v-model="goods.isOnSale">
						<el-radio :label="true">在售</el-radio>
						<el-radio :label="false">未售</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="是否支持代金券" prop="supportVoucher">
					<el-radio-group v-model="goods.supportVoucher">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="商品图片">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="goods.picUrl"
							class="avatar" :src="common.seamingImgUrl(goods.picUrl)" style="" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(goods.picUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>

				<el-form-item label="宣传画廊">
					<el-upload
						:action="uploadPath" :headers="headers" :limit="5" :file-list="galleryFileList"
						:on-exceed="uploadOverrun" :on-success="handleGalleryUrl" :on-remove="handleRemove" multiple
						accept=".jpg,.jpeg,.png,.gif" list-type="picture-card"
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>

				<el-form-item label="商品单位">
					<el-input v-model="goods.unit" placeholder="件 / 个 / 盒" />
				</el-form-item>

				<el-form-item label="关键字">
					<el-tag v-for="tag in keywords" :key="tag" closable type="primary" @close="handleClose(tag)">
						{{ tag }}
					</el-tag>
					<el-input
						v-if="newKeywordVisible" ref="newKeywordInput" v-model="newKeyword" class="input-new-keyword"
						size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"
					/>
					<el-button v-else class="button-new-keyword" size="small" type="primary" @click="showInput">+ 增加</el-button>
				</el-form-item>

				<el-form-item label="所属分类">
					<el-cascader
						v-model="categoryIds" lable="name" :options="categoryList" filterable
						show-all-levels :props="catepropse" expand-trigger="hover"
						@change="handleCategoryChange"
					>
						<template slot-scope="{ node }">
							<span :class="{ 'is-disabled': node.level === 1 }">
								{{ node.label }}
							</span>
						</template>
					</el-cascader>
				</el-form-item>

				<el-form-item
					v-show="!isBrand && $route.query.lastRouter !== 'brandListShow' && $route.query.lastRouter !== 'list'"
					label="所属品牌商"
				>
					<el-select v-model="goods.brandId">
						<el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
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
			<el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>

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
						<el-image
							v-if="scope.row.picUrl" :src="common.seamingImgUrl(scope.row.picUrl)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.picUrl) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
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
							:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadSpecPicUrl"
							class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
						>
							<el-image
								v-if="specForm.picUrl"
								class="avatar" :src="common.seamingImgUrl(specForm.picUrl)" style="" fit="cover"
								:preview-src-list="[ common.seamingImgUrl(specForm.picUrl) ]"
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
				<el-table-column property="price" width="100" label="货品售价" />
				<el-table-column property="number" width="100" label="货品数量" />
				<el-table-column property="url" width="100" label="货品图片">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.url" :src="common.seamingImgUrl(scope.row.url)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.url) ]"
						/>
						<span v-else>--</span>
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
							:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadProductUrl"
							class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
						>
							<img v-if="productForm.url" :src="common.seamingImgUrl(productForm.url)" class="avatar">
							<el-image
								v-if="productForm.url"
								class="avatar" :src="common.seamingImgUrl(productForm.url)" style="" fit="cover"
								:preview-src-list="[ common.seamingImgUrl(productForm.url) ]"
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

		<el-card class="box-card">
			<el-tabs v-model="activeName">
				<el-tab-pane label="商品参数" name="first">
					<el-button :plain="true" type="primary" @click="handleAttributeShow">添加</el-button>
					<el-table :data="attributes">
						<el-table-column property="attribute" label="商品参数名称" />
						<el-table-column property="value" label="商品参数值" />
						<el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
							<template slot-scope="scope">
								<el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>

					<el-dialog :visible.sync="attributeVisiable" title="设置商品参数">
						<el-form
							ref="attributeForm" :model="attributeForm" status-icon label-position="left"
							label-width="100px"
							style="width: 400px; margin-left:50px;"
						>
							<el-form-item label="商品参数名称" prop="attribute">
								<el-input v-model="attributeForm.attribute" />
							</el-form-item>
							<el-form-item label="商品参数值" prop="value">
								<el-input v-model="attributeForm.value" />
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="attributeVisiable = false">取消</el-button>
							<el-button type="primary" @click="handleAttributeAdd">确定</el-button>
						</div>
					</el-dialog>
				</el-tab-pane>
				<el-tab-pane label="优惠劵" name="second">
					<el-button :plain="true" type="primary" @click="handleGoodsCouponsShow">添加</el-button>
					<el-table :data="goodsCoupons">
						<el-table-column property="couponId" label="优惠券id" />
						<el-table-column property="buyNumber" label="需购物数" />
						<el-table-column property="type" label="赠送类型">
							<template slot-scope="scope">
								{{ goodsCouponsTypeList[scope.row.type] ? goodsCouponsTypeList[scope.row.type].label : '' }}
							</template>
						</el-table-column>
						<el-table-column property="isTimeBox" label="是否有时限">
							<template slot-scope="scope">
								{{ scope.row.isTimeBox ? '是' : '否' }}
							</template>
						</el-table-column>
						<el-table-column property="startTime" label="活动开始时间" />
						<el-table-column property="endTime" label="活动结束时间" />
						<el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
							<template slot-scope="scope">
								<el-button type="danger" size="mini" @click="handleGoodsCouponsDelete(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>

					<el-dialog :visible.sync="goodsCouponsVisiable" title="设置优惠劵">
						<el-form
							ref="goodsCouponsForm" :model="goodsCouponsForm" status-icon label-position="left"
							label-width="100px" style="width: 400px; margin-left:50px;"
						>
							<el-form-item label="优惠券" prop="couponId">
								<el-select v-model="goodsCouponsForm.couponId" class="filter-item">
									<el-option v-for="item in goodsCouponsList" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
							<el-form-item label="需购物数" prop="buyNumber">
								<el-input v-model="goodsCouponsForm.buyNumber" />
							</el-form-item>
							<el-form-item label="赠送类型" prop="type">
								<el-select v-model="goodsCouponsForm.type" class="filter-item">
									<el-option
										v-for="item in goodsCouponsTypeList" :key="item.value" :label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item label="是否有时限" prop="isTimeBox">
								<el-radio-group v-model="goodsCouponsForm.isTimeBox">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item v-show="goodsCouponsForm.isTimeBox" label="活动时间" prop="time">
								<el-date-picker
									v-model="goodsCouponsForm.time" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
									range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
								/>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="goodsCouponsVisiable = false">取消</el-button>
							<el-button type="primary" @click="handleGoodsCouponsAdd">确定</el-button>
						</div>
					</el-dialog>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<!-- <el-card class="box-card">
			<h3>商品参数</h3>
			<el-button
			:plain="true"
			type="primary"
			@click="handleAttributeShow"
			>添加</el-button>
			<el-table :data="attributes">
			<el-table-column
			property="attribute"
			label="商品参数名称"
			/>
			<el-table-column
			property="value"
			label="商品参数值"
			/>
			<el-table-column
			align="center"
			label="操作"
			width="100"
			class-name="small-padding fixed-width"
			>
			<template slot-scope="scope">
			<el-button
			type="danger"
			size="mini"
			@click="handleAttributeDelete(scope.row)"
			>删除</el-button>
			</template>
			</el-table-column>
			</el-table>

			<el-dialog
			:visible.sync="attributeVisiable"
			title="设置商品参数"
			>
			<el-form
			ref="attributeForm"
			:model="attributeForm"
			status-icon
			label-position="left"
			label-width="100px"
			style="width: 400px; margin-left:50px;"
			>
			<el-form-item
			label="商品参数名称"
			prop="attribute"
			>
			<el-input v-model="attributeForm.attribute" />
			</el-form-item>
			<el-form-item
			label="商品参数值"
			prop="value"
			>
			<el-input v-model="attributeForm.value" />
			</el-form-item>
			</el-form>
			<div
			slot="footer"
			class="dialog-footer"
			>
			<el-button @click="attributeVisiable = false">取消</el-button>
			<el-button
			type="primary"
			@click="handleAttributeAdd"
			>确定</el-button>
			</div>
			</el-dialog>
			</el-card> -->

		<div class="op-container">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleEdit">更新商品</el-button>
		</div>

	</div>
</template>

<script>
import { detailGoods, editGoods, getCatAndBrandCategory } from '@/api/business/goods'
import { listCoupon } from '@/api/business/coupon'
import { uploadPath } from '@/api/business/storage'
import { getUserInfo } from '@/api/login'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
	name: 'GoodsEdit',
	components: { Editor },
	data() {
		return {
			catepropse: {
				label: 'name',
				value: 'id',
				children: 'children',
				checkStrictly: true,
				emitPath: false
			},
			server: process.env.BASE_API,
			uploadPath,
			isBrand: undefined,
			newKeywordVisible: false,
			newKeyword: '',
			keywords: [],
			galleryFileList: [],
			categoryList: [],
			brandList: [],
			categoryIds: [],
			goods: { gallery: [], supportVoucher: undefined, categoryId: '' },
			specVisiable: false,
			specForm: { specification: '', value: '', picUrl: '' },
			specifications: [ { specification: '规格', value: '标准', picUrl: '' } ],
			productVisiable: false,
			productForm: {
				id: 0,
				specifications: [],
				price: 0.0,
				number: 0,
				url: ''
			},
			products: [
				{ id: 0, specifications: [ '标准' ], price: 0.0, number: 0, url: '' }
			],
			attributeVisiable: false,
			attributeForm: { attribute: '', value: '' },
			attributes: [],
			goodsCouponsList: [],
			goodsCouponsTypeList: [ {
				value: 0,
				label: '购买商品赠送'
			} ],
			goodsCouponsVisiable: false,
			goodsCouponsForm: { couponId: '', buyNumber: '', type: '', isTimeBox: '', time: '', startTime: '', endTime: '' },
			goodsCoupons: [],
			rules: {
				goodsSn: [ { required: true, message: '商品编号不能为空', trigger: 'blur' } ],
				name: [ { required: true, message: '商品名称不能为空', trigger: 'blur' } ]
			},
			editorInit: this.$root.editorInit,
			activeName: 'first'
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
		this.getRoles()
		this.init()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					this.isBrand = response.data.roles[0] === '会员商户'
				})
				.catch()
		},
		init() {
			if (this.$route.query.id == null) {
				return
			}
			const goodsId = this.$route.query.id
			detailGoods({ id: goodsId }).then((response) => {
				this.goods = response.data.goods
				this.specifications = response.data.specifications
				this.products = response.data.products
				this.attributes = response.data.attributes
				this.goodsCoupons = response.data.goodsCoupons
				this.categoryIds = response.data.categoryIds

				this.galleryFileList = []
				for (var i = 0; i < this.goods.gallery.length; i++) {
					this.galleryFileList.push({
						url: this.common.seamingImgUrl(this.goods.gallery[i])
					})
				}
				const keywords = response.data.goods.keywords
				if (keywords !== null) {
					this.keywords = keywords.split(',')
				}
			})

			if (this.$route.query.lastRouter === 'brandListShow' || this.$route.query.lastRouter === 'list') {
				getCatAndBrandCategory(this.$route.query.brandId).then((response) => {
					this.categoryList = response.data.categoryList
					// 遍历子集，将空的children变为unll
					this.categoryList.forEach((item) => {
						// item.isdasbale = false
						this.setEmptyChildrenToNull(item)
					})
					this.disableFirstLevel()
					// this.categoryList = response.data.categoryList
					// this.brandList = response.data.brandList
				})
				listCoupon({ brandId: this.$route.query.brandId, type: 3, status: 0 }).then((response) => {
					this.goodsCouponsList = response.data.items.map((item) => ({
						value: item.id,
						label: item.name,
						startTime: item.startTime,
						endTime: item.endTime
					}))
				})
			} else {
				getCatAndBrandCategory().then((response) => {
					this.categoryList = response.data.categoryList
					// this.categoryList = response.data.categoryList
					// this.brandList = response.data.brandList
				})
				listCoupon({ type: 3, status: 0 }).then((response) => {
					this.goodsCouponsList = response.data.items.map((item) => ({
						value: item.id,
						label: item.name,
						startTime: item.startTime,
						endTime: item.endTime
					}))
				})
			}
		},
		handleCategoryChange(value) {
			console.log(value)
			this.goods.categoryId = value
		},
		handleCancel() {
			if (this.$route.query.lastRouter === 'brandListShow') {
				this.$router.push({ name: 'brandGoodsListShow', query: { id: this.$route.query.brandId } })
			} else {
				this.$router.push({ name: 'goodsList' })
			}
		},
		handleEdit() {
			this.$refs.goods.validate((valid) => {
				if (valid) {
					const finalGoods = {
						goods: this.goods,
						specifications: this.specifications,
						products: this.products,
						attributes: this.attributes,
						goodsCoupons: this.goodsCoupons
					}
					editGoods(finalGoods)
						.then((response) => {
							this.$notify.success({
								title: '成功',
								message: '编辑成功'
							})
							if (this.$route.query.lastRouter === 'brandListShow') {
								this.$router.push({ name: 'brandGoodsListShow', query: { id: this.$route.query.brandId } })
							} else {
								this.$router.push({ name: 'goodsList' })
							}
						})
						.catch((response) => {
							MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
								confirmButtonText: '确定',
								type: 'error'
							})
						})
				} else {
					this.$message({
						type: 'error',
						message: '请填写完整的商品信息！'
					})
				}
			})
		},
		handleClose(tag) {
			this.keywords.splice(this.keywords.indexOf(tag), 1)
			this.goods.keywords = this.keywords.toString()
		},
		showInput() {
			this.newKeywordVisible = true
			this.$nextTick((_) => {
				this.$refs.newKeywordInput.$refs.input.focus()
			})
		},
		handleInputConfirm() {
			const newKeyword = this.newKeyword
			if (newKeyword) {
				this.keywords.push(newKeyword)
				this.goods.keywords = this.keywords.toString()
			}
			this.newKeywordVisible = false
			this.newKeyword = ''
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
				if (this.common.seamingImgUrl(this.goods.gallery[i]) === url) {
					this.goods.gallery.splice(i, 1)
				}
			}
		},
		specChanged(label) {
			if (label === false) {
				this.specifications = [
					{ specification: '规格', value: '标准', picUrl: '' }
				]
				this.products = [
					{ id: 0, specifications: [ '标准' ], price: 0.0, number: 0, url: '' }
				]
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
				products[productsIndex] = {
					id: productsIndex,
					specifications,
					price: 0.0,
					number: 0,
					url: ''
				}
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
		},
		handleAttributeShow() {
			this.attributeForm = {}
			this.attributeVisiable = true
		},
		handleAttributeAdd() {
			this.attributes.unshift(this.attributeForm)
			this.attributeVisiable = false
		},
		handleAttributeDelete(row) {
			const index = this.attributes.indexOf(row)
			this.attributes.splice(index, 1)
		},
		handleGoodsCouponsShow() {
			this.goodsCouponsForm = {}
			this.goodsCouponsVisiable = true
		},
		handleGoodsCouponsAdd() {
			if (this.goodsCouponsForm.time) {
				this.goodsCouponsForm.startTime = this.goodsCouponsForm.time[0]
				this.goodsCouponsForm.endTime = this.goodsCouponsForm.time[1]
			} else {
				var arr = this.goodsCouponsList.filter((item) => item.value === this.goodsCouponsForm.couponId)
				this.goodsCouponsForm.startTime = arr[0].startTime
				this.goodsCouponsForm.endTime = arr[0].endTime
			}
			this.goodsCoupons.unshift(this.goodsCouponsForm)
			this.goodsCouponsVisiable = false
		},
		handleGoodsCouponsDelete(row) {
			const index = this.goodsCoupons.indexOf(row)
			this.goodsCoupons.splice(index, 1)
		},
		setEmptyChildrenToNull(obj) {
			if (Array.isArray(obj.children)) {
				if (obj.children.length === 0) {
					obj.children = null // 或者设置为 undefined 阻止children为空的值渲染
				} else {
					obj.children.forEach((child) => {
						this.setEmptyChildrenToNull(child)
					})
				}
			}
		},
		disableFirstLevel() {
			const firstLevelRadioGroup = document.querySelectorAll('.el-cascader-menu__list> .el-radio')
			// console.log(firstLevelRadioGroup)
			firstLevelRadioGroup.forEach((radio) => {
				radio.disabled = true
			})
		}
	}
}
</script>

<style>
.is-disabled {
  color: #ccc;
  pointer-events: none !important;
  cursor: not-allowed !important;
}
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
