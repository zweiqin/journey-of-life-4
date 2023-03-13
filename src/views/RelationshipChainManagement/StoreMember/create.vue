<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>门店-会员关系添加</h3>
      <el-form
        ref="painting"
        :rules="rules"
        :model="addData"
        label-width="150px"
      >
        <el-form-item
          label="门店账号"
          prop="salesmanId"
        >
          <!-- <el-input v-model="addData.SalesmanId" /> -->
          <el-select
            v-model="addData.salesmanId"
            filterable
            allow-create
            default-first-option
            placeholder="请选择门店"
          >
            <el-option
              v-for="item in SalesmanIdOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="会员账号"
          prop="userId"
        >
          <el-button
            type="primary"
            @click="selectMember"
          >选择会员</el-button>
          <!-- <el-input v-model="addData.salesmanId" /> -->
          <!-- <el-select
            v-model="addData.userId"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择会员"
          >
            <el-option
              v-for="item in UserIdOptions"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>

      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handlePublish"
      >创建</el-button>
    </div>

    <!-- 选择会员对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="选择会员"
    >
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
          label="会员id"
          prop="id"
          sortable
        />

        <el-table-column
          align="center"
          label="会员名称"
          prop="nickname"
        />

        <el-table-column
          align="center"
          label="会员头像"
          prop="userId"
        />

        <el-table-column
          align="center"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="selectedMember(scope.row)"
            >选择</el-button>
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

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus=='transfer'"
          type="primary"
          @click="transferData"
        >转赠</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createData"
        >确定</el-button>
        <el-button
          v-if="dialogStatus=='update'"
          type="primary"
          @click="updateData"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-card {
  margin-bottom: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.avatar-uploader .el-upload {
  width: 145px;
  height: 145px;
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
import { listAdd, listGet, idGet } from '@/api/RelationshipChainManagement/StoreMember'
import { uploadPath } from '@/api/business/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  name: 'PaintingCreate',
  components: { Editor },

  data () {
    return {
      listLoading: false,
      dialogVisible: false,
      SalesmanIdOptions: [],
      UserIdOptions: [],
      uploadPath,
      addData: { salesmanId: '', userId: [] },
      rules: {
        salesmanId: [{ required: true, message: '营销id不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '门店id不能为空', trigger: 'blur' }]
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
  watch: {
    // addData: {
    //   deep: true,
    //   handler (value) {
    //     localStorage.setItem('addData', JSON.stringify(value))
    //   }
    // }
  },
  created () {
    this.getSalesmanIdOptions()
    this.getUserIdOptions()
  },
  methods: {
    selectMember () {
      this.dialogVisible = true
    },
    getSalesmanIdOptions () {
      listGet().then(response => {
        // console.log(response.data.data.item)
        this.SalesmanIdOptions = response.data.data.items
      }).catch(response => {
        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    getUserIdOptions () {
      idGet().then(response => {
        console.log(response.data.data.items)
        this.UserIdOptions = response.data.data.items
      }).catch(response => {
        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    handleCancel: function () {
      this.$router.push({ path: '/RelationshipChainManagement/StoreMember' })
    },
    handlePublish: function () {
      const finalpainting = this.addData
      listAdd(finalpainting).then(response => {
        this.$notify.success({
          title: '成功',
          message: '创建成功'
        })
        this.$router.push({ path: '/RelationshipChainManagement/StoreMember' })
      }).catch(response => {
        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    }
  }
}
</script>
