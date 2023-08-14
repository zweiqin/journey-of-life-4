<template>
	<div class="app-container">

		<!-- 查询和其他操作 -->
		<div class="filter-container">
			<el-cascader v-model="regionArr" :props="regionProps" class="filter-item" size="mini" placeholder="请选择区域" />
			<el-button
				v-permission="[ 'GET /admin/dtsTalent/list' ]" size="mini" class="filter-item" type="primary"
				icon="el-icon-search" @click="listQuery.page = 1 && getList()"
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
				v-permission="[ 'POST /admin/dtsTalent/submitTalent' ]" size="mini" class="filter-item" type="primary"
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
				<el-table-column align="center" min-width="100px" label="手机号" prop="phone" />
				<el-table-column align="center" min-width="100px" label="账号等级" prop="grade" />
				<el-table-column align="center" min-width="100px" property="avatar" label="头像">
					<template slot-scope="scope">
						<el-image
							v-if="scope.row.avatar" :src="common.seamingImgUrl(scope.row.avatar)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(scope.row.avatar) ]"
						/>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="地区" prop="region" />
				<el-table-column align="center" min-width="100px" label="地区名称" prop="regionName" />
				<el-table-column align="center" min-width="220px" label="介绍" prop="introduce" />
				<el-table-column align="center" min-width="220px" label="关联用户ID" prop="userId" />
				<el-table-column align="center" min-width="100px" prop="status" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.status === 0">待审核</span>
						<span v-else-if="scope.row.status === 1">审核通过</span>
						<span v-else-if="scope.row.status === 2">暂停使用</span>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="140px" label="创建时间" prop="addTime" />
				<el-table-column align="center" min-width="140px" label="更新时间" prop="updateTime" />
				<el-table-column align="center" label="操作" min-width="270px" fixed="right" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button
							v-permission="[ 'GET /admin/dtsTalent/queryDetail' ]" type="primary" size="mini"
							@click="handleDetail(scope.row)"
						>
							详情
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/dtsTalent/updateTalent' ]" type="primary" size="mini"
							@click="handleUpdate(scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/dtsTalent/toExamine' ]" type="warning" size="mini"
							@click="handleExamine(scope.row)"
						>
							审核
						</el-button>
						<el-button
							v-permission="[ 'POST /admin/dtsTalentDatail/list' ]" type="success" size="mini"
							@click="handleOpenService(scope.row)"
						>
							服务案例
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
		<el-dialog :visible.sync="detailDialogVisible" title="达人详情" width="1000px">
			<el-form :model="dialogDetail" label-position="left" label-width="120px">
				<el-form-item label="达人ID" prop="id">
					<span>{{ dialogDetail.id }}</span>
				</el-form-item>
				<el-form-item label="达人名称" prop="name">
					<span>{{ dialogDetail.name }}</span>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<span>{{ dialogDetail.phone }}</span>
				</el-form-item>
				<el-form-item label="账号等级" prop="grade">
					<span>{{ dialogDetail.grade }}</span>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					<div>
						<el-image
							v-if="dialogDetail.avatar" :src="common.seamingImgUrl(dialogDetail.avatar)" style="width:40px; height:40px" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(dialogDetail.avatar) ]"
						/>
						<span v-else>--</span>
					</div>
				</el-form-item>
				<el-form-item label="地区" prop="region">
					<span>{{ dialogDetail.region }}</span>
				</el-form-item>
				<el-form-item label="地区名称">
					<span>{{ dialogDetail.regionName }}</span>
				</el-form-item>
				<el-form-item label="介绍" prop="introduce">
					<span>{{ dialogDetail.introduce }}</span>
				</el-form-item>
				<el-form-item label="关联用户ID" prop="userId">
					<span>{{ dialogDetail.userId }}</span>
				</el-form-item>
				<el-form-item label="审核状态" prop="status">
					<span v-if="dialogDetail.status === 0">待审核</span>
					<span v-else-if="dialogDetail.status === 1">审核通过</span>
					<span v-else-if="dialogDetail.status === 2">暂停使用</span>
					<span v-else>--</span>
				</el-form-item>
				<el-form-item label="创建时间" prop="addTime">
					<span>{{ dialogDetail.addTime }}</span>
				</el-form-item>
				<el-form-item label="更新时间" prop="updateTime">
					<span>{{ dialogDetail.updateTime }}</span>
				</el-form-item>
				<el-form-item label="服务案例" prop="dtsTalentDatail">
					<el-table
						:data="dialogDetail.dtsTalentDatail" size="small" border fit
						height="100%" highlight-current-row
					>
						<el-table-column align="center" min-width="100px" label="案例ID" prop="id" />
						<el-table-column align="center" min-width="100px" label="企业名称" prop="name" />
						<el-table-column align="center" min-width="100px" property="logoUrl" label="logo">
							<template slot-scope="scope">
								<el-image
									v-if="scope.row.logoUrl" :src="common.seamingImgUrl(scope.row.logoUrl)" style="width:40px; height:40px" fit="cover"
									:preview-src-list="[ common.seamingImgUrl(scope.row.logoUrl) ]"
								/>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="100px" label="企业描述" prop="enterpriseDescribe" />
						<el-table-column align="center" min-width="100px" label="案例名称" prop="caseName" />
						<el-table-column align="center" min-width="120px" property="caseUrl" label="案例图片">
							<template slot-scope="scope">
								<div v-if="scope.row.caseUrl && scope.row.caseUrl.length">
									<el-image
										:src="scope.row.caseUrl[0]" style="width:40px; height:40px" fit="cover"
										:preview-src-list="scope.row.caseUrl ? scope.row.caseUrl.map(item => common.seamingImgUrl(item)) : ''"
									/>
									<span v-if="scope.row.caseUrl.length > 1" style="margin-left:8px;">+{{ scope.row.caseUrl.length }}</span>
								</div>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="120px" label="案例描述" prop="caseDescribe" />
						<el-table-column align="center" min-width="100px" label="产品名称" prop="productName" />
						<el-table-column align="center" min-width="120px" label="产品描述" prop="productDescribe" />
						<el-table-column align="center" min-width="120px" property="caseUrl" label="产品图片">
							<template slot-scope="scope">
								<div v-if="scope.row.productUrl && scope.row.productUrl.length">
									<el-image
										:src="common.seamingImgUrl(scope.row.productUrl[0])" style="width:40px; height:40px" fit="cover"
										:preview-src-list="scope.row.productUrl ? scope.row.productUrl.map(item => common.seamingImgUrl(item)) : ''"
									/>
									<span v-if="scope.row.productUrl.length > 1" style="margin-left:8px;">+{{ scope.row.productUrl.length }}</span>
								</div>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="120px" label="创建时间" prop="createTime" />
						<el-table-column align="center" min-width="120px" label="更新时间" prop="updateTime" />
					</el-table>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 新增修改达人信息对话框 -->
		<el-dialog :title="{ update: '编辑达人信息', create: '创建达人信息' }[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
			<el-form
				ref="dataForm" :rules="rules" :model="dataForm" status-icon
				label-position="right" label-width="100px"
				style="width: 100%; padding:0 35px;"
			>
				<el-form-item label="达人名称" prop="name">
					<el-input v-model="dataForm.name" placeholder="请输入达人名称" />
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="dataForm.phone" placeholder="请输入手机号" />
				</el-form-item>
				<el-form-item label="账号等级" prop="grade">
					<el-input v-model="dataForm.grade" placeholder="请输入账号等级" />
				</el-form-item>
				<el-form-item label="头像">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="(response) => dataForm.avatar = response.data.url"
						class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataForm.avatar"
							class="avatar" :src="common.seamingImgUrl(dataForm.avatar)" style="" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(dataForm.avatar) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="地区" prop="region">
					<el-input v-model="dataForm.region" disabled />
				</el-form-item>
				<el-form-item label="地区名称" prop="regionName">
					<el-cascader
						v-model="regionArrDialog" :props="regionProps" size="mini" placeholder="请选择区域"
						@change="dataForm.region = regionArrDialog[2]"
					/>
				</el-form-item>
				<el-form-item label="介绍" prop="introduce">
					<el-input v-model="dataForm.introduce" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" maxlength="120" show-word-limit placeholder="请输入介绍" />
				</el-form-item>
				<el-form-item label="关联用户" prop="userId">
					<el-select v-model="dataForm.userId" class="filter-item" filterable>
						<el-option
							v-for="item in userFetchlist"
							:key="item.id"
							:label="`${item.username}（${item.mobile}）`"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus == 'create'" type="primary" @click="createData">确定</el-button>
				<el-button v-if="dialogStatus == 'update'" type="primary" @click="updateData">确定</el-button>
			</div>
		</el-dialog>

		<!-- 达人审核对话框 -->
		<el-dialog title="达人审核" :visible.sync="dialogFormVisibleExamine" width="800px">
			<el-form
				ref="dataFormExamine" :rules="rulesExamine" :model="dataFormExamine" status-icon
				label-position="left" label-width="80px"
				style="width: 100%; padding:0 35px;"
			>
				<el-form-item label="审核状态" prop="status">
					<el-select
						v-model="dataFormExamine.status"
						class="filter-item"
					>
						<el-option label="待审核" :value="0" />
						<el-option label="通过审核" :value="1" />
						<el-option label="冻结达人" :value="2" />
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleExamine = false">取消</el-button>
				<el-button type="primary" @click="confirmExamine">确定</el-button>
			</div>
		</el-dialog>

		<!-- 查看服务案例信息 -->
		<el-dialog title="服务案例" :visible.sync="dialogFormVisibleService" width="800px">
			<div>
				<el-button
					size="mini" class="filter-item" type="primary"
					icon="el-icon-edit" @click="handleCreateCase"
				>
					新增
				</el-button>
				<div style="height: 60vh;">
					<el-table
						:data="dataFormService.dtsTalentDatail" size="small" border fit
						height="100%" highlight-current-row
					>
						<el-table-column align="center" min-width="100px" label="案例ID" prop="id" />
						<el-table-column align="center" min-width="100px" label="企业名称" prop="name" />
						<el-table-column align="center" min-width="100px" property="logoUrl" label="logo">
							<template slot-scope="scope">
								<el-image
									v-if="scope.row.logoUrl" :src="common.seamingImgUrl(scope.row.logoUrl)" style="width:40px; height:40px" fit="cover"
									:preview-src-list="[ common.seamingImgUrl(scope.row.logoUrl) ]"
								/>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="100px" label="企业描述" prop="enterpriseDescribe" />
						<el-table-column align="center" min-width="120px" label="案例名称" prop="caseName" />
						<el-table-column align="center" min-width="100px" label="案例描述" prop="caseDescribe" />
						<el-table-column align="center" min-width="120px" property="caseUrl" label="案例图片">
							<template slot-scope="scope">
								<div v-if="scope.row.caseUrl && scope.row.caseUrl.length">
									<el-image
										:src="common.seamingImgUrl(scope.row.caseUrl[0])" style="width:40px; height:40px" fit="cover"
										:preview-src-list="scope.row.caseUrl ? scope.row.caseUrl.map(item => common.seamingImgUrl(item)) : ''"
									/>
									<span v-if="scope.row.caseUrl.length > 1" style="margin-left:8px;">+{{ scope.row.caseUrl.length }}</span>
								</div>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="100px" label="产品名称" prop="productName" />
						<el-table-column align="center" min-width="120px" label="产品描述" prop="productDescribe" />
						<el-table-column align="center" min-width="120px" property="productUrl" label="产品图片">
							<template slot-scope="scope">
								<div v-if="scope.row.productUrl && scope.row.productUrl.length">
									<el-image
										:src="common.seamingImgUrl(scope.row.productUrl[0])" style="width:40px; height:40px" fit="cover"
										:preview-src-list="scope.row.productUrl ? scope.row.productUrl.map(item => common.seamingImgUrl(item)) : ''"
									/>
									<span v-if="scope.row.productUrl.length > 1" style="margin-left:8px;">+{{ scope.row.productUrl.length }}</span>
								</div>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" min-width="120px" label="更新时间" prop="updateTime" />
						<el-table-column align="center" label="操作" min-width="150px" class-name="small-padding fixed-width" fixed="right">
							<template slot-scope="scope">
								<el-button
									type="primary" size="mini"
									@click="handleUpdateCase(scope.row)"
								>
									编辑
								</el-button>
								<el-button
									type="danger" size="mini"
									@click="handleDeleteCase(scope.row)"
								>
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</el-dialog>

		<!-- 新增或编辑服务案例 -->
		<el-dialog :title="{ update: '编辑服务案例', create: '新增服务案例' }[dialogStatus]" :visible.sync="dialogFormVisibleCase" width="800px">
			<el-form
				ref="dataFormCase" :rules="rulesCase" :model="dataFormCase" status-icon
				label-position="left" label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<!-- <el-form-item label="案例ID" prop="id">
					<el-input v-model="dataFormCase.id" disabled />
					</el-form-item> -->
				<el-form-item label="企业名称" prop="name">
					<el-input v-model="dataFormCase.name" placeholder="请输入企业名称" />
				</el-form-item>
				<el-form-item label="logo" prop="logo">
					<el-upload
						:headers="headers" :action="uploadPath" :show-file-list="false" :on-success="(response) => dataFormCase.logoUrl = response.data.url"
						:on-error="() => $message.error('上传失败')" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif"
					>
						<el-image
							v-if="dataFormCase.logoUrl"
							class="avatar" :src="common.seamingImgUrl(dataFormCase.logoUrl)" style="" fit="cover"
							:preview-src-list="[ common.seamingImgUrl(dataFormCase.logoUrl) ]"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon" />
					</el-upload>
				</el-form-item>
				<el-form-item label="企业描述" prop="enterpriseDescribe">
					<el-input v-model="dataFormCase.enterpriseDescribe" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" maxlength="120" show-word-limit placeholder="请输入企业描述" />
				</el-form-item>
				<el-form-item label="案例名称" prop="caseName">
					<el-input v-model="dataFormCase.caseName" placeholder="请输入案例名称" />
				</el-form-item>
				<el-form-item label="案例图片" prop="caseUrl">
					<el-upload
						:action="uploadPath"
						:limit="5"
						:file-list="caseUrlList"
						:headers="headers"
						:on-exceed="() => $message({ type: 'error', message: '上传文件个数超出限制!最多上传5张图片!' })"
						:on-success="(response, file, fileList) => response.errno === 0 && dataFormCase.caseUrl.push(response.data.url)"
						:on-remove="handleRemoveCaseUrl"
						multiple
						accept=".jpg,.jpeg,.png,.gif"
						list-type="picture-card"
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>
				<el-form-item label="案例描述" prop="caseDescribe">
					<el-input v-model="dataFormCase.caseDescribe" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" maxlength="120" show-word-limit placeholder="请输入案例描述" />
				</el-form-item>
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="dataFormCase.productName" placeholder="请输入产品名称" />
				</el-form-item>
				<el-form-item label="产品图片" prop="productUrl">
					<el-upload
						:action="uploadPath"
						:limit="5"
						:file-list="productUrlList"
						:headers="headers"
						:on-exceed="() => $message({ type: 'error', message: '上传文件个数超出限制!最多上传5张图片!' })"
						:on-success="(response, file, fileList) => response.errno === 0 && dataFormCase.productUrl.push(response.data.url)"
						:on-remove="handleRemoveProductUrl"
						multiple
						accept=".jpg,.jpeg,.png,.gif"
						list-type="picture-card"
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>
				<el-form-item label="产品描述" prop="productDescribe">
					<el-input v-model="dataFormCase.productDescribe" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" maxlength="120" show-word-limit placeholder="请输入产品描述" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleCase = false">取消</el-button>
				<el-button v-if="dialogStatusCase == 'create'" type="primary" @click="createDataCase">确定</el-button>
				<el-button v-if="dialogStatusCase == 'update'" type="primary" @click="updateDataCase">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { dtsTalentList, dtsTalentQueryDetail, dtsTalentSubmitTalent, dtsTalentUpdateTalent, dtsTalentToExamine, dtsTalentDatailList, dtsTalentDatailAddOne, dtsTalentDatailUpdate, dtsTalentDatailDelete } from '@/api/marketingManagement/wiseManList'
import { fetchList } from '@/api/business/user'
import { uploadPath } from '@/api/business/storage'
import { listSubRegion } from '@/api/operationManagement/region'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
	name: 'WiseManList',
	components: { Pagination },
	data() {
		return {
			downloadLoading: false,
			uploadPath,
			fileList: [],
			uploadUrl: process.env.BASE_API + '/talent/upload',
			regionProps: {
				lazy: true,
				lazyLoad(node, resolve) {
					const { level } = node
					listSubRegion({ id: level === 0 ? 0 : node.data.id }).then((response) => {
						resolve(response.data.map((item) => ({
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
			userFetchlist: [],

			// 达人详情对话框
			detailDialogVisible: false,
			dialogDetail: {
				id: '',
				name: '',
				phone: '',
				grade: '',
				avatar: '',
				region: '',
				regionName: '',
				introduce: '',
				userId: '',
				status: '',
				addTime: '',
				updateTime: '',
				dtsTalentDatail: []
			},

			// 新增或编辑达人信息对话框
			dialogStatus: '',
			dialogFormVisible: false,
			dataForm: {
				id: '',
				name: '',
				grade: '',
				phone: '',
				avatar: '',
				region: '',
				introduce: '',
				userId: '',
				dtsTalentDatail: []
			},
			regionArrDialog: ['', '', ''],
			rules: {
				name: [ { required: true, message: '达人名称不能为空', trigger: 'blur' } ],
				avatar: [ { required: true, message: '头像不能为空', trigger: 'blur' } ],
				grade: [ { required: true, message: '账号等级不能为空', trigger: 'blur' } ],
				region: [ { required: true, message: '地区不能为空', trigger: 'blur' } ],
				introduce: [{ required: true, message: '介绍不能为空', trigger: 'blur' }, { max: 120, message: '120字以内' }],
				userId: [ { required: true, message: '关联用户不能为空', trigger: 'blur' } ]
			},

			// 达人审核对话框
			dialogFormVisibleExamine: false,
			dataFormExamine: {
				id: '',
				status: ''
			},
			rulesExamine: {
				id: [ { required: true, message: '达人ID不能为空', trigger: 'blur' } ],
				status: [ { required: true, message: '审核状态不能为空', trigger: 'blur' } ]
			},

			// 查看案例对话框
			dataFormService: {
				id: '',
				name: '',
				grade: '',
				phone: '',
				avatar: '',
				region: '',
				introduce: '',
				dtsTalentDatail: []
			},
			dialogFormVisibleService: false,

			// 新增或编辑服务案例
			caseUrlList: [],
			productUrlList: [],
			dataFormCase: {
				id: '',
				name: '',
				userId: '',
				logoUrl: '',
				enterpriseDescribe: '',
				caseName: '',
				caseUrl: [],
				caseDescribe: '',
				productName: '',
				productUrl: [],
				productDescribe: ''
			},
			dialogStatusCase: '',
			dialogFormVisibleCase: false,
			rulesCase: {
				name: [ { required: true, message: '企业不能为空', trigger: 'blur' } ],
				logoUrl: [ { required: false, message: 'logo图片不能为空', trigger: 'blur' } ],
				enterpriseDescribe: [{ required: true, message: '企业描述不能为空', trigger: 'blur' }, { max: 120, message: '120字以内' }],
				caseName: [ { required: true, message: '案例名称不能为空', trigger: 'blur' } ],
				caseUrl: [ { required: false, message: '案例图片不能为空', trigger: 'blur' } ],
				caseDescribe: [{ required: true, message: '案例描述不能为空', trigger: 'blur' }, { max: 120, message: '120字以内' }],
				productName: [ { required: true, message: '产品名称不能为空', trigger: 'blur' } ],
				productUrl: [ { required: false, message: '产品图片不能为空', trigger: 'blur' } ],
				productDescribe: [{ required: true, message: '产品描述不能为空', trigger: 'blur' }, { max: 120, message: '120字以内' }]
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
		fetchList({ page: 1, limit: 99999, username: undefined, mobile: undefined, sort: 'add_time', order: 'desc' })
			.then((response) => {
				this.userFetchlist = response.data.items || []
			})
			.catch(() => {})
	},
	methods: {
		getList() {
			this.listLoading = true
			this.listQuery.region = this.regionArr[2]
			dtsTalentList(this.listQuery).then((response) => {
				this.list = response.data.list
				this.total = response.data.total
				this.listLoading = false
			})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		async handleDetail(row) {
			this.dialogDetail = {
				id: '',
				name: '',
				phone: '',
				grade: '',
				avatar: '',
				region: '',
				regionName: '',
				introduce: '',
				userId: '',
				status: '',
				addTime: '',
				updateTime: '',
				dtsTalentDatail: []
			}
			await dtsTalentQueryDetail({ id: row.id }).then((response) => {
				this.dialogDetail = response.data
				this.dialogDetail.dtsTalentDatail = this.dialogDetail.dtsTalentDatail.map((item) => ({
					...item,
					caseUrl: item.caseUrl ? item.caseUrl.substring(1, item.caseUrl.length - 1).split(',')
						.map((section) => section.substring(1, section.length - 1)) : [],
					productUrl: item.productUrl ? item.productUrl.substring(1, item.productUrl.length - 1).split(',')
						.map((section) => section.substring(1, section.length - 1)) : []
				}))
			})
			this.detailDialogVisible = true
		},
		handleCreate() {
			this.resetForm()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		handleUpdate(row) {
			this.resetForm()
			this.dataForm = Object.assign(this.dataForm, {
				id: row.id || '',
				name: row.name || '',
				grade: row.grade || '',
				phone: row.phone || '',
				avatar: row.avatar || '',
				region: row.region || '',
				introduce: row.introduce || '',
				userId: row.userId || '',
				dtsTalentDatail: row.dtsTalentDatail || []
			})
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate()
			})
		},
		resetForm() {
			this.dataForm = {
				id: '',
				name: '',
				phone: '',
				grade: '',
				avatar: '',
				region: '',
				introduce: '',
				userId: '',
				dtsTalentDatail: []
			}
		},
		createData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					dtsTalentSubmitTalent(this.dataForm)
						.then((response) => {
							this.dialogFormVisible = false
							this.$notify.success({
								title: '成功',
								message: '创建达人成功'
							})
							this.getList()
						})
						.catch((response) => {
							this.$notify.error({
								title: '创建达人失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},
		updateData() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					dtsTalentUpdateTalent(this.dataForm).then(() => {
						this.getList()
						this.dialogFormVisible = false
						this.$notify.success({
							title: '成功',
							message: '更新达人成功'
						})
					})
						.catch((response) => {
							this.$notify.error({
								title: '更新达人失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},

		handleExamine(row) {
			this.resetFormExamine()
			this.dataFormExamine = Object.assign(this.dataFormExamine, {
				id: row.id || '',
				status: row.status
			})
			this.dialogFormVisibleExamine = true
			this.$nextTick(() => {
				this.$refs.dataFormExamine.clearValidate()
			})
		},
		resetFormExamine() {
			this.dataFormExamine = {
				id: '',
				status: ''
			}
		},
		confirmExamine() {
			this.$refs.dataFormExamine.validate((valid) => {
				if (valid) {
					dtsTalentToExamine(this.dataFormExamine)
						.then((response) => {
							this.dialogFormVisibleExamine = false
							this.$notify.success({
								title: '成功',
								message: '操作成功'
							})
							this.getList()
						})
						.catch((response) => {
							this.$notify.error({
								title: '操作失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},

		async handleOpenService(row) {
			this.resetFormService()
			this.dataFormService = Object.assign(this.dataFormService, row)
			await dtsTalentDatailList({ id: row.id }).then((response) => {
				// { ...response.data, caseUrl: response.data.caseUrl ? JSON.stringify(response.data.caseUrl) : [], productUrl: response.data.productUrl ? JSON.stringify(response.data.productUrl) : [] }
				// imageUrl: `[${this.images.map((item) => `'${item}'`).join(',')}]`,
				// scope.row.caseUrl.substring(1, scope.row.caseUrl.length - 1).split(',').map((section) => section.substring(1, section.length - 1))
				this.dataFormService.dtsTalentDatail = response.data.map((item) => ({
					...item,
					caseUrl: item.caseUrl ? item.caseUrl.substring(1, item.caseUrl.length - 1).split(',')
						.map((section) => section.substring(1, section.length - 1)) : [],
					productUrl: item.productUrl ? item.productUrl.substring(1, item.productUrl.length - 1).split(',')
						.map((section) => section.substring(1, section.length - 1)) : []
				}))
			})
			this.dialogFormVisibleService = true
		},
		resetFormService() {
			this.dataFormService.dtsTalentDatail = []
		},

		handleCreateCase() {
			this.resetFormCase()
			this.caseUrlList = []
			this.productUrlList = []
			this.dataFormCase.userId = this.dataFormService.id
			this.dialogStatusCase = 'create'
			this.dialogFormVisibleCase = true
			this.$nextTick(() => {
				this.$refs.dataFormCase.clearValidate()
			})
		},
		handleUpdateCase(row) {
			this.resetFormCase()
			this.caseUrlList = JSON.parse(JSON.stringify(row.caseUrl)).map((item) => ({ name: this.common.seamingImgUrl(item), url: this.common.seamingImgUrl(item) }))
			this.productUrlList = JSON.parse(JSON.stringify(row.productUrl)).map((item) => ({ name: this.common.seamingImgUrl(item), url: this.common.seamingImgUrl(item) }))
			this.dataFormCase = Object.assign(this.dataFormCase, {
				id: row.id,
				name: row.name,
				userId: row.userId,
				logoUrl: row.logoUrl,
				enterpriseDescribe: row.enterpriseDescribe,
				caseName: row.caseName,
				caseUrl: row.caseUrl,
				caseDescribe: row.caseDescribe,
				productName: row.productName,
				productUrl: row.productUrl,
				productDescribe: row.productDescribe
			})
			this.dialogStatusCase = 'update'
			this.dialogFormVisibleCase = true
			this.$nextTick(() => {
				this.$refs.dataFormCase.clearValidate()
			})
		},
		handleDeleteCase(row) {
			dtsTalentDatailDelete({ id: row.id })
				.then((response) => {
					this.handleOpenService(this.dataFormService)
					this.$notify.success({
						title: '成功',
						message: '删除服务案例成功'
					})
				})
				.catch((response) => {
					this.handleOpenService(this.dataFormService)
					this.$notify.error({
						title: '删除服务案例失败',
						message: response.data.errmsg
					})
				})
		},
		resetFormCase() {
			this.dataFormCase = {
				id: '',
				name: '',
				userId: '',
				logoUrl: '',
				enterpriseDescribe: '',
				caseName: '',
				caseUrl: [],
				caseDescribe: '',
				productName: '',
				productUrl: [],
				productDescribe: ''
			}
		},

		createDataCase() {
			this.$refs.dataFormCase.validate((valid) => {
				if (valid) {
					dtsTalentDatailAddOne({ ...this.dataFormCase, caseUrl: JSON.stringify(this.dataFormCase.caseUrl), productUrl: JSON.stringify(this.dataFormCase.productUrl) })
						.then((response) => {
							this.dialogFormVisibleCase = false
							// this.dialogFormVisibleService = false
							this.$notify.success({
								title: '成功',
								message: '创建服务案例成功'
							})
							this.handleOpenService(this.dataFormService)
							// setTimeout(() => {
							// 	this.dialogFormVisibleService = true
							// }, 2000)
						})
						.catch((response) => {
							this.$notify.error({
								title: '创建服务案例失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},
		updateDataCase() {
			this.$refs.dataFormCase.validate((valid) => {
				if (valid) {
					dtsTalentDatailUpdate({ ...this.dataFormCase, caseUrl: JSON.stringify(this.dataFormCase.caseUrl), productUrl: JSON.stringify(this.dataFormCase.productUrl) })
						.then(() => {
							this.dialogFormVisibleCase = false
							// this.dialogFormVisibleService = false
							this.$notify.success({
								title: '成功',
								message: '更新服务案例成功'
							})
							this.handleOpenService(this.dataFormService)
							// setTimeout(() => {
							// 	this.dialogFormVisibleService = true
							// }, 2000)
						})
						.catch((response) => {
							this.$notify.error({
								title: '更新服务案例失败',
								message: response.data.errmsg
							})
						})
				}
			})
		},

		handleRemoveCaseUrl(file, fileList) {
			for (let i = 0; i < this.dataFormCase.caseUrl.length; i++) {
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
				if (this.common.seamingImgUrl(this.dataFormCase.caseUrl[i]) === url) {
					this.dataFormCase.caseUrl.splice(i, 1)
				}
			}
		},
		handleRemoveProductUrl(file, fileList) {
			for (let i = 0; i < this.dataFormCase.productUrl.length; i++) {
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
				if (this.common.seamingImgUrl(this.dataFormCase.productUrl[i]) === url) {
					this.dataFormCase.productUrl.splice(i, 1)
				}
			}
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

		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then((excel) => {
				const tHeader = ['达人名称', '头像', '手机号', '账号等级', '头像', '地区', '介绍', '状态', '创建时间', '更新时间']
				const filterVal = ['name', 'avatar', 'phone', 'grade', 'avatar', 'region', 'introduce', 'status', 'addTime', 'updateTime']
				excel.export_json_to_excel2(tHeader, this.list, filterVal, '达人列表')
				this.downloadLoading = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>

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
