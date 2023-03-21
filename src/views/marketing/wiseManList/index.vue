<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-cascader v-model="regionArr" :props="regionProps" class="filter-item" size="mini" placeholder="请选择区域" />
      <el-button
        v-permission="['GET /admin/talent/list']"
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
        :action="uploadUrl"
        :show-file-list="false"
        :headers="headers"
        :data="{}"
        :file-list="fileList"
        :before-upload="beforeUploadFile"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        style="display: inline;margin-left: 10px"
        accept=".xlsx,.xls">
        <el-button size="mini" type="primary" class="filter-item">上传达人文件</el-button>
      </el-upload>
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

      <el-table-column align="center" min-width="100px" label="达人ID" prop="id" />

      <el-table-column align="center" min-width="100px" label="达人名称" prop="name" />

      <el-table-column align="center" min-width="100px" property="avatar" label="头像">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="common.splicingImgUrl() + scope.row.avatar" width="80">
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="账号等级" prop="grade" />

      <el-table-column align="center" min-width="100px" label="地区" prop="region" />
      <el-table-column align="center" min-width="100px" label="地区名称" prop="regionName" />

      <el-table-column align="center" min-width="120px" label="介绍" prop="introduce" />

      <el-table-column align="center" label="操作" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['GET /admin/talent/info']"
            type="primary"
            size="mini"
            @click="handleDetail(scope.row)">详情</el-button>
          <el-button
            v-permission="['POST /admin/talent/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList" />

    <!-- 达人详情对话框 -->
    <el-dialog :visible.sync="detailDialogVisible" title="达人详情" width="800">
      <el-form :data="dialogDetail" label-position="left">
        <el-form-item label="达人ID">
          <span>{{ dialogDetail.id }}</span>
        </el-form-item>
        <el-form-item label="达人名称">
          <span>{{ dialogDetail.name }}</span>
        </el-form-item>
        <el-form-item label="头像">
          <template>
            <img v-if="dialogDetail.avatar" :src="common.splicingImgUrl() + dialogDetail.avatar" width="80">
          </template>
        </el-form-item>
        <el-form-item label="地区">
          <span>{{ dialogDetail.region }}</span>
        </el-form-item>
        <el-form-item label="地区名称">
          <span>{{ dialogDetail.regionName }}</span>
        </el-form-item>
        <el-form-item label="介绍">
          <span>{{ dialogDetail.introduce }}</span>
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
        <el-form-item label="达人名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.avatar" :src="common.splicingImgUrl() + dataForm.avatar" width="80">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="账号等级" prop="grade">
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
        <el-form-item label="介绍" prop="introduce">
          <el-input :autosize="{ minRows: 4, maxRows: 8 }" v-model="dataForm.introduce" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button> -->
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style></style>

<script>
import { talentUpload, talentList, talentInfo, talentUpdate } from '@/api/marketing/wiseManList'
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
      uploadUrl: process.env.BASE_API + '/talent/upload',
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
        region: ''
      },
      detailDialogVisible: false,
      dialogDetail: {
        id: '',
        name: '',
        grade: '',
        avatar: '',
        region: '',
        regionName: '',
        introduce: ''
      },
      downloadLoading: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dataForm: {
        id: '',
        name: '',
        grade: '',
        avatar: '',
        region: '',
        introduce: ''
      },
      regionArrDialog: ['', '', ''],
      uploadPath,
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '达人名称不能为空', trigger: 'blur' }],
        avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
        grade: [{ required: true, message: '账号等级不能为空', trigger: 'blur' }],
        region: [{ required: true, message: '地区不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '介绍不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    headers () {
      return {
        'X-Dts-Admin-Token': getToken()
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.region = this.regionArr[2]
      talentList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
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
      talentInfo({ id: row.id }).then(response => {
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
    uploadPicUrl (response) {
      this.dataForm.avatar = response.data.url
    },
    handleUploadSuccess (response) {
      if (response.data.fail.length) {
        this.$notify.error({
          title: '有数据插入失败',
          message: `第${response.data.fail.join('、')}条数据插入失败`
        })
      } else {
        this.$message.success('上传成功')
      }
      this.getList()
    },
    handleUploadError (response) {
      this.$message.error('上传失败')
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          talentUpdate(this.dataForm).then(() => {
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
			  const tHeader = ['达人名称', '头像', '账号等级', '地区', '介绍']
			  const filterVal = ['name', 'avatar', 'grade', 'region', 'introduce']
			  excel.export_json_to_excel2(tHeader, this.list, filterVal, '达人列表')
			  this.downloadLoading = false
			})
    }
  }
}
</script>
