<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        clearable
        size="mini"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入门店ID"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        size="mini"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入门店名称"
      />
      <el-button
        v-permission="['GET /admin/brand/list']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['POST /admin/brand/create']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <!-- <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">导出</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >

      <el-table-column
        align="center"
        min-width="100px"
        label="门店ID"
        prop="id"
        sortable
      />

      <el-table-column
        align="center"
        min-width="150px"
        label="门店名称"
        prop="name"
      />

      <el-table-column
        align="center"
        min-width="100px"
        property="picUrl"
        label="门店图片"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.picUrl"
            :src="scope.row.picUrl"
            width="80"
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="350px"
        label="介绍"
        prop="desc"
      />

      <el-table-column
        align="center"
        min-width="80px"
        label="底价"
        prop="floorPrice"
      />

      <el-table-column
        align="center"
        prop="brandgenre"
        label="门店类型"
      >
        <template slot-scope="scope">
          {{ scope.row.brandgenreName }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="100px"
        property="licenseUrl"
        label="营业执照"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.licenseUrl"
            :src="scope.row.licenseUrl"
            width="80"
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="100px"
        property="idcardProsUrl"
        label="法人身份证正面"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.idcardProsUrl"
            :src="scope.row.idcardProsUrl"
            width="80"
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="100px"
        property="idcardConsUrl"
        label="法人身份证反面"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.idcardConsUrl"
            :src="scope.row.idcardConsUrl"
            width="80"
          >
        </template>
      </el-table-column>

      <!-- <el-table-column
        align="center"
        min-width="80px"
        label="入驻说明"
        prop="explain"
      /> -->

      <el-table-column
        align="center"
        label="操作"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="shareUrlDetail(scope.row)"
          >推广码</el-button>
          <el-button
            v-permission="['POST /admin/brand/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['POST /admin/brand/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 店铺二维展示框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="shareUrlDialogVisible"
      width="700"
    >
      <el-form
        :data="dataForm"
        label-position="left"
      >
        <el-form-item label="推广二维码">
          <img
            :src="dataForm.shareUrl"
            width="300"
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="门店名称"
          prop="name"
        >
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="主营类目">
          <el-cascader
            :options="categoryList"
            v-model="dataForm.categoryIds"
            expand-trigger="hover"
            @change="handleCategoryChange"
          />
        </el-form-item>
        <el-form-item label="管理员">
          <el-select v-model="dataForm.adminId">
            <el-option
              v-for="item in adminList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="介绍"
          prop="simpleDesc"
        >
          <el-input v-model="dataForm.desc" />
        </el-form-item>
        <el-form-item
          label="门店图片"
          prop="picUrl"
        >
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img
              v-if="dataForm.picUrl"
              :src="dataForm.picUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>

        <el-form-item
          label="底价"
          prop="floorPrice"
        >
          <el-input v-model="dataForm.floorPrice" />
        </el-form-item>

        <el-form-item
          label="门店类型"
          prop="brandgenre"
        >
          <el-select
            v-model="dataForm.brandgenre"
            filterable
            placeholder="请选择门店类型"
          >
            <el-option
              v-for="item in TypeOptions"
              :key="item.id"
              :label="item.storeName"
              :value="item.id"
            />
          </el-select>

        </el-form-item>

        <el-form-item
          label="开始营业时间"
          prop="startTime"
        >
          <el-time-picker
            v-model="dataForm.startTime"
            placeholder="起始时间"
          />

        </el-form-item>

        <el-form-item
          label="结束营业时间"
          prop="endTime"
        >
          <el-time-picker
            v-model="dataForm.endTime"
            placeholder="结束时间"
          />

        </el-form-item>

        <el-form-item
          label="门店地址"
          prop="address"
        >
          <el-input v-model="dataForm.address" />
        </el-form-item>

        <el-form-item
          label="营业执照"
          prop="licenseUrl"
        >
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadLicenseUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img
              v-if="dataForm.licenseUrl"
              :src="dataForm.licenseUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>

        <el-form-item
          label="法人身份证正面"
          prop="idcardProsUrl"
        >
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIdcardProsUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img
              v-if="dataForm.idcardProsUrl"
              :src="dataForm.idcardProsUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>

        <el-form-item
          label="法人身份证反面"
          prop="idcardConsUrl"
        >
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIdcardConsUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img
              v-if="dataForm.idcardConsUrl"
              :src="dataForm.idcardConsUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>

        <el-form-item
          label="入驻说明"
          prop="explain"
        >
          <el-input v-model="dataForm.explain" />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createData"
        >确定</el-button>
        <el-button
          v-else
          type="primary"
          @click="updateData"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
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

<script>
import { listBrand, createBrand, updateBrand, deleteBrand, listCatAndAdmin, listStoreType } from '@/api/business/brand'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Brand',
  components: { Pagination },
  data () {
    return {
      TypeOptions: [],
      uploadPath,
      list: undefined,
      total: 0,
      categoryList: [],
      adminList: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: '',
        desc: '',
        floorPrice: undefined,
        picUrl: undefined,
        categoryIds: [],
        defaultCategoryId: undefined,
        adminId: undefined,
        brandgenre: undefined,
        startTime: undefined,
        endTime: undefined,
        licenseUrl: undefined,
        idcardProsUrl: undefined,
        idcardConsUrl: undefined,
        explain: undefined,
        address: undefined
      },
      dialogFormVisible: false,
      shareUrlDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        shareUrl: '店铺推广码'
      },
      rules: {
        name: [
          { required: true, message: '门店名称不能为空', trigger: 'blur' }
        ],
        brandgenre: [
          { required: true, message: '门店类型不能为空', trigger: 'blur' }
        ],
        licenseUrl: [
          { required: true, message: '营业执照不能为空', trigger: 'blur' }
        ],
        idcardProsUrl: [
          { required: true, message: '法人身份证正面不能为空', trigger: 'blur' }
        ],
        idcardConsUrl: [
          { required: true, message: '法人身份证反面不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '门店地址不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false
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
    this.init()
  },
  mounted () {

  },
  methods: {
    init: function () {
      listCatAndAdmin().then(response => {
        this.categoryList = response.data.data.categoryList
        this.adminList = response.data.data.adminList
        // 获取门店类型
        this.getTypeOption()
      })
    },
    getTypeOption () {
      listStoreType().then(response => {
        console.log(response.data.data.items)
        this.TypeOptions = response.data.data.items
      })
        .catch(() => {
          this.TypeOptions = []
        })
    },
    getList () {
      this.listLoading = true
      listBrand(this.listQuery)
        .then(response => {
          this.list = response.data.data.items
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm () {
      this.dataForm = {
        id: undefined,
        name: '',
        desc: '',
        floorPrice: undefined,
        picUrl: undefined,
        categoryIds: [],
        defaultCategoryId: undefined,
        adminId: undefined,
        brandgenre: undefined,
        startTime: undefined,
        endTime: undefined,
        licenseUrl: undefined,
        idcardProsUrl: undefined,
        idcardConsUrl: undefined,
        explain: undefined,
        address: undefined
      }
    },
    handleCreate () {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    uploadPicUrl: function (response) {
      this.dataForm.picUrl = response.data.url
    },
    uploadLicenseUrl: function (response) {
      this.dataForm.licenseUrl = response.data.url
    },
    uploadIdcardProsUrl: function (response) {
      this.dataForm.idcardProsUrl = response.data.url
    },
    uploadIdcardConsUrl: function (response) {
      this.dataForm.idcardConsUrl = response.data.url
    },
    createData () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createBrand(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '创建成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate (row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 时间格式转换
    // add0 (m) { return m < 10 ? '0' + m : m },
    // format (shijianchuo) {
    //   // shijianchuo是整数，否则要parseInt转换
    //   var time = new Date(shijianchuo) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    //   var h = time.getHours()
    //   var mm = time.getMinutes()
    //   var s = time.getSeconds()
    //   return this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
    // },
    updateData () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateBrand(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleDelete (row) {
      deleteBrand(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    },
    handleCategoryChange (value) {
      this.dataForm.defaultCategoryId = value[value.length - 1]
    },
    shareUrlDetail (row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'shareUrl'
      this.shareUrlDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '门店ID',
          '门店名称',
          '介绍',
          '低价',
          '门店图片'
        ]
        const filterVal = ['id', 'name', 'desc', 'floorPrice', 'picUrl']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '门店信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
