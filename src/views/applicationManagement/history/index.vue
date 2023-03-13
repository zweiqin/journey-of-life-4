<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div
      class="filter-container"
      style="display: flex; align-items: center"
    >
      <el-input
        v-model="listqueryInfo.userId"
        clearable
        size="mini"
        class="filter-item"
        style="width: 200px; margin-right: 10px; margin-bottom: 0px"
        placeholder="请输入完整的申请人Id"
      />
      <el-select
        v-model="listqueryInfo.applicationType"
        size="mini"
        placeholder="请选择申请类型"
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in applicationTypeoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- <el-select
        v-model="value"
        size="mini"
        placeholder="请选择工单状态"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-bottom: 0px"
        @click="handleFilter"
      >查找</el-button>
      <!-- <el-button
        v-permission="['POST /admin/admin/create']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button> -->
      <!-- <el-button
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="申请人ID"
        prop="userId"
        sortable
        width="100"
      />
      <el-table-column
        align="center"
        label="申请人"
        prop="nickname"
        sortable
      />
      <el-table-column
        align="center"
        label="申请表ID"
        prop="id"
        sortable
        width="100"
      />
      <el-table-column
        align="center"
        label="申请的系统账户名"
        prop="username"
      >
        <template slot-scope="scope">
          {{
            scope.row.applicationType == 1
              ? scope.row.username
              : scope.row.phone
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="申请类型"
        prop="applicationType"
      >
        <template slot-scope="scope">
          <el-tag>
            {{
              scope.row.applicationType == 1
                ? '门店'
                : scope.row.applicationType == 2
                  ? '营销策划师'
                  : '其他'
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="申请时间"
        prop="createtime"
      />
      <!-- <el-table-column align="center" label="更新时间" prop="updatetime" /> -->
      <el-table-column
        align="center"
        label="状态"
        prop="status"
      >
        <template slot-scope="scope">
          <el-tag>
            {{
              scope.row.status == 0
                ? '待审核'
                : scope.row.status == 1
                  ? '审核中'
                  : scope.row.status == -1
                    ? '未提交'
                    : scope.row.status == -2
                      ? '用户主动撤销'
                      : scope.row.status == -3
                        ? '已驳回'
                        : scope.row.status == -4
                          ? '注册流程失败'
                          : scope.row.status == 2
                            ? '已通过,等待付款'
                            : scope.row.status == 3
                              ? '已通话，等待付款'
                              : scope.row.status == 4
                                ? '已付款'
                                : scope.row.status == 5
                                  ? '未创建账号'
                                  : scope.row.status == 6
                                    ? '已创建账户'
                                    : ''
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- 审核内容对话框 -->
          <!-- <el-button
            v-permission="['POST /admin/applicationManagement/update']"
            v-if="scope.row.status==0?true:false"
            type="primary"
            @click="updateData(scope.row,startAudit)"
          >开始审核</el-button> -->
          <el-button
            v-permission="['POST /admin/applicationManagement/update']"
            type="primary"
            size="mini"
            @click="checking(scope.row)"
          >查看</el-button>
          <!-- <el-button
            v-permission="['POST /admin/applicationManagement/update']"
            v-if="scope.row.status==1?true:false"
            type="success"
            size="mini"
            @click="updateData(scope.row,rollback)"
          >审核</el-button> -->
          <!-- <el-button
            v-permission="['POST /admin/applicationManagement/update']"
            v-if="scope.row.status==1?true:false"
            type="danger"
            size="mini"
            @click="updateData(scope.row,rollback)"
          >退回</el-button> -->
          <!-- <el-button
            v-permission="['POST /admin/admin/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog
      v-if="dialogFormitem != null"
      :title="dialogFormitem.nickname + '-申请表内容'"
      :visible.sync="dialogFormVisible"
      width="80%"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="申请人ID">
          {{ dialogFormitem.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人">
          {{ dialogFormitem.nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="申请表类型">
          {{
            dialogFormitem.applicationType == 1
              ? '门店'
              : dialogFormitem.applicationType == 2
                ? '营销策划师'
                : '其他'
          }}
        </el-descriptions-item>
        <el-descriptions-item label="申请时间">
          {{ dialogFormitem.createtime }}
        </el-descriptions-item>
        <el-descriptions-item label="申请表ID">
          {{ dialogFormitem.id }}
        </el-descriptions-item>
        <el-descriptions-item label="申请的系统账户名">
          {{
            dialogFormitem.applicationType == 1
              ? dialogFormitem.username
              : dialogFormitem.phone
          }}
        </el-descriptions-item>
        <!-- <el-descriptions-item label="系统账户头像">
          <img v-if="dialogFormitem.avatar" :src="dialogFormitem.avatar" width="40" />
        </el-descriptions-item> -->
        <!-- 门店 -->
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="门店名"
        >
          {{ dialogFormitem.brandname }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="门店类型"
        >
          {{ dialogFormitem.brandgenreval }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="门店地址"
        >
          {{ dialogFormitem.address }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="开始营业时间"
        >
          {{ dialogFormitem.startTime }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="结束营业时间"
        >
          {{ dialogFormitem.endTime }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="门店简介"
        >
          {{ dialogFormitem.desc }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="经度"
        >
          {{ dialogFormitem.longitude }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="纬度"
        >
          {{ dialogFormitem.latitude }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="门店logo"
        >
          <el-image
            v-if="dialogFormitem.picUrl"
            :src="common.splicingImgUrl() +dialogFormitem.picUrl"
            style="width: 100px; height: 100px"
            fit="contain"
          />
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="营业执照"
        >
          <el-image
            v-if="dialogFormitem.licenseUrl"
            :src="common.splicingImgUrl() +dialogFormitem.licenseUrl"
            style="width: 100px; height: 100px"
            fit="contain"
          />
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="法人身份证正面"
        >
          <el-image
            v-if="dialogFormitem.brandIdcardProsUrl"
            :src="common.splicingImgUrl() +dialogFormitem.brandIdcardProsUrl"
            style="width: 100px; height: 100px"
            fit="contain"
          />
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 1"
          label="法人身份证反面"
        >
          <el-image
            v-if="dialogFormitem.brandIdcardConsUrl"
            :src="common.splicingImgUrl() +dialogFormitem.brandIdcardConsUrl"
            style="width: 100px; height: 100px"
            fit="contain"
          />
        </el-descriptions-item>
        <!-- <el-descriptions-item label="入驻说明" v-if="dialogFormitem.applicationType == 1">
                {{ dialogFormitem.latitude }}
              </el-descriptions-item> -->

        <!-- 业务员信息 -->
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="姓名"
        >
          {{ dialogFormitem.salesmanname }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="性别"
        >
          {{ dialogFormitem.gender }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="联系电话"
        >
          {{ dialogFormitem.salesmanPhone }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="微信号"
        >
          {{ dialogFormitem.wechat }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="邮箱"
        >
          {{ dialogFormitem.email }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="生日"
        >
          {{ dialogFormitem.birthday }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="身份证正面"
        >
          <el-image
            v-if="dialogFormitem.idcardProsUrl"
            :src="common.splicingImgUrl() +dialogFormitem.idcardProsUrl"
            style="width: 100px; height: 100px"
            fit="contain"
          />
        </el-descriptions-item>
        <el-descriptions-item
          v-if="dialogFormitem.applicationType == 2"
          label="身份证反面"
        >
          <el-image
            v-if="dialogFormitem.idcardConsUrl"
            :src="common.splicingImgUrl() +dialogFormitem.idcardConsUrl"
            style="width: 100px; height: 100px"
            fit="contain"
          />
        </el-descriptions-item>
      </el-descriptions>
      <!-- <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                type="primary"
                @click="dialogFormVisible = false"
              >取消</el-button>
              <el-button
                v-permission="['POST /admin/applicationManagement/update']"
                type="danger"
                @click="updateData(scope.row,rollback)"
              >退回</el-button>
              <el-button
                type="success"
                @click="updateData(scope.row,rollback)"
              >审核</el-button>
            </div> -->
    </el-dialog>
  </div>
</template>

<style scoped>
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
import { listGet } from '@/api/applicationManagement/history'
import { listStoreType } from '@/api/business/brand'
import { roleOptions } from '@/api/business/role'
import { uploadPath } from '@/api/business/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  data () {
    return {
      // 开始审核
      startAudit: 4,
      // 审核完成
      checked: 6,
      // 驳回
      rollback: 2,
      // 查看的当前信息
      checkInfo: null,
      uploadPath,
      list: null,
      total: 0,
      roleOptions: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: [],
        // username: undefined,
        sort: 'CreateTime',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      },
      salesmanDataForm: {
        id: undefined,
        name: undefined,
        phone: undefined,
        wechat: undefined,
        salemanstateid: undefined,
        operatorid: undefined,
        operatorname: undefined,
        updatatime: undefined,
        royalties: undefined,
        adminId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [
          { required: true, message: '管理员账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      listqueryInfo: {
        userId: '',
        status: [],
        applicationType: 0
      },
      applicationTypeoptions: [
        // 类型options
        {
          value: 0,
          label: '全部类型'
        },
        {
          value: 1,
          label: '门店'
        },
        {
          value: 2,
          label: '营销策划师'
        }
      ],
      dialogFormitem: null,
      listStoreType: []
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
    listStoreType()
      .then((response) => {
        console.log(response)
        this.listStoreType = response.data.data.items
        console.log(this.listStoreType)
        this.getList()
      })
      .catch((error) => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error,
          type: 'error'
        })
      })

    roleOptions().then((response) => {
      this.roleOptions = response.data.data
      console.log(this.roleOptions)
    }).catch((error) => {
      console.log(error)
      this.$message({
        showClose: true,
        message: error,
        type: 'error'
      })
    })
  },
  methods: {
    formatRole (roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label
        }
      }
      return ''
    },
    /**
     * 获取升级审核表
     */
    getList () {
      this.listLoading = true
      console.log(this.listQuery)
      const queryInfo = {}
      const url = '/userup/list?page=' + this.listQuery.page
      console.log(this.listqueryInfo)
      if (this.listqueryInfo.userId != '') {
        var str = /^[0-9]*$/
        if (str.test(this.listqueryInfo.userId)) {
          queryInfo.userId = parseInt(this.listqueryInfo.userId)
        } else {
          this.$message({
            showClose: true,
            message: '请输入正确的申请人ID(只能包含数字)',
            type: 'error'
          })
        }
      }
      if (this.listqueryInfo.applicationType !== 0) {
        queryInfo.applicationType = this.listqueryInfo.applicationType
      }
      console.log(queryInfo)
      listGet(url, queryInfo)
        .then((response) => {
          this.list = response.data.data.items
          console.log(this.list)
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    /**
     * 点击查询查询
     */
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm () {
      this.dataForm = {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      }
      this.salesmanDataForm = {
        id: undefined,
        name: undefined,
        phone: undefined,
        wechat: undefined,
        salemanstateid: undefined,
        operatorid: undefined,
        operatorname: undefined,
        updatatime: undefined,
        royalties: undefined,
        adminId: undefined
      }
    },
    uploadAvatar: function (response) {
      this.dataForm.avatar = response.data.url
    },
    // handleCreate () {
    //   this.resetForm()
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // createData () {
    //   this.$refs['dataForm'].validate(valid => {
    //     if (valid) {
    //       var data = {}
    //       data.dtsAdmin = this.dataForm
    //       data.dtsSalesman = this.salesmanDataForm
    //       listAdd(data)
    //         .then(response => {
    //           // this.list.unshift(response.data.data.dtsAdmin)
    //           this.getList()
    //           this.dialogFormVisible = false
    //           this.$notify.success({
    //             title: '成功',
    //             message: '添加管理员成功'
    //           })
    //         })
    //         .catch(response => {
    //           this.$notify.error({
    //             title: '失败',
    //             message: response.data.errmsg
    //           })
    //         })
    //     }
    //   })
    // },
    // handleUpdate (row) {
    //   idGet(row.username)
    //     .then(response => {
    //       this.resetForm()
    //       this.dataForm = Object.assign({}, row)
    //       if (response.data.data !== '未找到对应业务员') {
    //         this.salesmanDataForm = response.data.data
    //       }
    //     })
    //     .catch(response => {
    //       this.$notify.error({
    //         title: '失败',
    //         message: response.data.errmsg
    //       })
    //     })
    //   this.dialogStatus = 'update'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    checking (row) {
      this.dialogFormVisible = true
      const StoreType = this.listStoreType.find(p => p.id === row.brandgenre)
      row.brandgenreval = StoreType === undefined ? '' : StoreType.storeName
      this.dialogFormitem = row
      this.checkInfo = row
    }
    // updateData (row, status) {
    //   listedit({
    //     'id': row.id,
    //     'stateEnum': status
    //   }).then(response => {
    //     this.getList()
    //   }).catch(response => {
    //     this.$notify.error({
    //       title: '失败',
    //       message: response.data.errmsg
    //     })
    //   })
    // }
    // handleDelete (row) {
    //   // deleteAdmin(row)
    //   //   .then(response => {
    //   //     this.$notify.success({
    //   //       title: '成功',
    //   //       message: '删除管理员成功'
    //   //     })
    //   //     const index = this.list.indexOf(row)
    //   //     this.list.splice(index, 1)
    //   //   })
    //   //   .catch(response => {
    //   //     this.$notify.error({
    //   //       title: '失败',
    //   //       message: response.data.errmsg
    //   //     })
    //   //   })
    // }
    // handleDownload () {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['管理员ID', '管理员名称', '管理员头像']
    //     const filterVal = ['id', 'username', 'avatar']
    //     excel.export_json_to_excel2(
    //       tHeader,
    //       this.list,
    //       filterVal,
    //       '管理员信息'
    //     )
    //     this.downloadLoading = false
    //   })
    // }
  }
}
</script>
