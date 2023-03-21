<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-cascader v-model="regionArr" :props="regionProps" class="filter-item" size="mini" placeholder="请选择区域" />
      <el-button
        v-permission="['GET /admin/talentTask/list']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">查找</el-button>
      <el-button
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="handleDownload">导出</el-button>
      <el-upload
        v-if="isShopRole"
        :action="uploadUrl"
        :show-file-list="false"
        :headers="headers"
        :data="{
          shopId:this.$store.state.user.userId,
          userId:this.$store.state.user.userId,
        }"
        :file-list="fileList"
        :before-upload="beforeUploadFile"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        style="display: inline;margin-left: 10px"
        accept=".xlsx,.xls">
        <el-button size="mini" type="primary" class="filter-item">上传任务文件</el-button>
      </el-upload>
      <el-button v-else-if="isPlanner" size="mini" type="primary" class="filter-item" @click="handleUploadTask">上传任务列表</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row>

      <el-table-column align="center" min-width="100px" label="任务ID" prop="id" />

      <el-table-column align="center" min-width="100px" label="任务所属门店ID" prop="shopId" />
      <el-table-column align="center" min-width="100px" label="任务上传者ID" prop="userId" />

      <el-table-column align="center" min-width="100px" property="img" label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="common.splicingImgUrl() + scope.row.img" width="80">
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="任务名称" prop="name" />
      <el-table-column align="center" min-width="100px" label="单价" prop="unitPrice" />
      <el-table-column align="center" min-width="100px" label="佣金比例" prop="possessGold" />
      <el-table-column align="center" min-width="100px" label="类型" prop="type" />
      <el-table-column align="center" min-width="100px" label="等级" prop="grade" />
      <el-table-column align="center" min-width="100px" label="地区" prop="region" />

      <el-table-column align="center" min-width="100px" label="地区名称" prop="regionName" />
      <el-table-column align="center" label="操作" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['GET /admin/talentTask/info']"
            type="primary"
            size="mini"
            @click="handleDetail(scope.row)">详情</el-button>
          <el-button
            v-permission="['POST /admin/talentTask/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList" />

    <!-- 任务详情对话框 -->
    <el-dialog :visible.sync="detailDialogVisible" title="任务详情" width="800">
      <el-form :data="dialogDetail" label-position="left">
        <el-form-item label="任务ID">
          <span>{{ dialogDetail.id }}</span>
        </el-form-item>
        <el-form-item label="任务所属门店ID">
          <span>{{ dialogDetail.shopId }}</span>
        </el-form-item>
        <el-form-item label="任务上传者ID">
          <span>{{ dialogDetail.userId }}</span>
        </el-form-item>
        <el-form-item label="图片">
          <template>
            <img v-if="dialogDetail.img" :src="common.splicingImgUrl() + dialogDetail.img" width="80">
          </template>
        </el-form-item>
        <el-form-item label="任务名称">
          <span>{{ dialogDetail.name }}</span>
        </el-form-item>
        <el-form-item label="单价">
          <span>{{ dialogDetail.unitPrice }}</span>
        </el-form-item>
        <el-form-item label="佣金比例">
          <span>{{ dialogDetail.possessGold }}</span>
        </el-form-item>
        <el-form-item label="类型">
          <span>{{ dialogDetail.type }}</span>
        </el-form-item>
        <el-form-item label="等级">
          <span>{{ dialogDetail.grade }}</span>
        </el-form-item>
        <el-form-item label="地区">
          <span>{{ dialogDetail.region }}</span>
        </el-form-item>
        <el-form-item label="地区名称">
          <span>{{ dialogDetail.regionName }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="图片">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            :on-error="handleUploadError"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.avatar" :src="common.splicingImgUrl() + dataForm.avatar" width="80">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input v-model="dataForm.unitPrice" />
        </el-form-item>
        <el-form-item label="佣金比例" prop="possessGold">
          <el-input v-model="dataForm.possessGold" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="dataForm.type" />
        </el-form-item>
        <el-form-item label="等级" prop="grade">
          <el-input v-model="dataForm.grade" />
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <el-input v-model="dataForm.region" disabled />
        </el-form-item>
        <el-form-item label="地区名称" prop="region">
          <el-cascader
            v-model="regionArrDialog"
            :props="regionProps"
            size="mini"
            placeholder="请选择区域"
            @change="dataForm.region = regionArrDialog[2]" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button> -->
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!-- 上传任务对话框 -->
    <el-dialog
      :title="'上传任务'"
      :visible.sync="uploadFormVisible"
    >
      <el-form
        ref="taskDataForm"
        :rules="rules"
        :model="taskDataForm"
        status-icon
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="门店"
          prop="type"
        >
          <el-select
            v-model="taskDataForm.shopId"
            filterable
            placeholder="请选择任务所属门店"
          >
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="`${item.name}（${item.id}）`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="uploadFormVisible = false">取消</el-button>
        <el-upload
          v-if="taskDataForm.shopId"
          :action="uploadUrl"
          :show-file-list="false"
          :headers="headers"
          :data="{
            shopId:this.taskDataForm.shopId,
            userId:this.$store.state.user.userId,
          }"
          :file-list="fileList"
          :before-upload="beforeUploadFile"
          :on-success="handleUploadSuccess"
          style="display: inline;margin-left: 10px"
          accept=".xlsx,.xls">
          <el-button size="mini" type="primary" class="filter-item">上传任务文件</el-button>
        </el-upload>
      </div>
    </el-dialog>

  </div>
</template>

<style></style>

<script>
import { listBrand } from '@/api/business/brand'
import { talentTaskUpload, talentTaskList, talentTaskInfo, talentTaskUpdate, talentTaskDelete } from '@/api/marketing/wiseManTask'
import { uploadPath } from '@/api/business/storage'
import { listSubRegion } from '@/api/business/region'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
  name: 'Order',
  components: { Pagination },
  data () {
    return {
      fileList: [],
      uploadUrl: process.env.BASE_API + '/talentTask/upload',
      regionProps: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          console.log(node)
          listSubRegion({ id: level === 0 ? 0 : node.data.id }).then(response => {
            resolve(response.data.data.map(item => ({
              id: item.id,
              value: item.code,
              label: level === 2 ? `${item.name}（${item.code}）` : item.name,
              leaf: level >= 2
            })))
          }).catch((response) => {
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
        region: '',
        shopId: '',
        userId: this.$store.state.user.userId
      },
      detailDialogVisible: false,
      dialogDetail: {
        id: '',
        shopId: '',
        userId: '',
        img: '',
        name: '',
        unitPrice: '',
        possessGold: '',
        type: '',
        grade: '',
        region: '',
        regionName: ''
      },
      downloadLoading: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dataForm: {
        id: '',
        img: '',
        name: '',
        unitPrice: '',
        possessGold: '',
        type: '',
        grade: '',
        region: ''
      },
      regionArrDialog: ['', '', ''],
      uploadPath,
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
        possessGold: [{ required: true, message: '佣金比例不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        grade: [{ required: true, message: '等级不能为空', trigger: 'blur' }],
        region: [{ required: true, message: '地区不能为空', trigger: 'blur' }]
      },
      // 上传文件对话框
      brandList: [],
      taskDataForm: {
        shopId: ''
      },
      uploadFormVisible: false
    }
  },
  computed: {
    headers () {
      return {
        'X-Dts-Admin-Token': getToken()
      }
    },
    isAdminRole () {
      return this.$store.state.user.roles.includes('超级管理员')
    },
    isShopRole () {
      return this.$store.state.user.roles.includes('门店')
    },
    isPlanner () {
      return this.$store.state.user.roles.includes('营销策划')
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.region = this.regionArr[2]
      talentTaskList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
      listBrand({ page: 1, limit: 9999, sort: 'add_time', order: 'desc' })
        .then(response => {
          this.brandList = response.data.data.items
        })
        .catch(response => {
          this.$notify.error({
            title: '查找门店数据失败',
            message: response.data.errmsg
          })
        })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleUploadTask () {
      this.uploadFormVisible = true
    },
    // 限制上传文件类型
    beforeUploadFile (file) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isXls = extension === 'xls'
      const isXlsx = extension === 'xlsx'
      if (!isXls && !isXlsx) {
        this.$message.warning('只能上传excel的文件')
      }
      return isXls || isXlsx
    },
    handleDetail (row) {
      talentTaskInfo({ id: row.id }).then(response => {
        this.dialogDetail = response.data.data
      })
      this.detailDialogVisible = true
    },
    handleUpdate (row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete (row) {
      talentTaskDelete({ id: row.id }).then(response => {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    uploadPicUrl (response) {
      this.dataForm.avatar = response.data.url
    },
    handleUploadSuccess (response) {
      try {
        if (response.data.fail.length) {
          this.$notify.error({
            title: '有数据插入失败',
            message: `第${response.data.fail.join('、')}条数据插入失败`
          })
        } else {
          this.$message.success('上传成功')
          this.uploadFormVisible = false
        }
        this.getList()
      } catch (err) {
        this.$message.error('上传失败')
      }
    },
    handleUploadError (response) {
      this.$message.error('上传失败')
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          talentTaskUpdate(this.dataForm).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleDownload () {
      this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
			  const tHeader = ['图片', '任务名称', '单价', '拥金比例', '类型', '等级', '地区']
			  const filterVal = ['img', 'name', 'unitPrice', 'possessGold', 'type', 'grade', 'region']
			  excel.export_json_to_excel2(tHeader, this.list, filterVal, '达人任务')
			  this.downloadLoading = false
			})
    }
  }
}
</script>
