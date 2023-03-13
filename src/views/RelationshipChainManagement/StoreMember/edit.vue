<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>门店-会员关系修改</h3>
      <el-form
        ref="editData"
        :rules="rules"
        :model="editData"
        label-width="150px"
      >
        <el-form-item
          label="门店账号"
          prop="administratorId"
        >
          <div>{{ editData.salesmanName }}</div>
          <!-- <el-input
            v-model=""
            disabled
          /> -->
        </el-form-item>
        <el-form-item
          label="会员账号"
          prop="salesmanId"
        >
          <!-- <el-input v-model="editData.salesmanId" /> -->
          <el-select
            v-model="editData.new_user_id"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择会员"
          >
            <el-option
              v-for="item in userIdOptions"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handleEdit"
      >修改</el-button>
    </div>
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
import { listedit, adminGet, idGet } from '@/api/RelationshipChainManagement/StoreMember'
import { uploadPath } from '@/api/business/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  name: 'GoodsEdit',
  components: { Editor },
  data () {
    return {
      userIdOptions: [],
      uploadPath,
      editData: { salesmanId: '', salesmanName: '', old_user_id: [], new_user_id: [] },
      rules: {
        administratorId: [{ required: true, message: '营销id不能为空', trigger: 'blur' }],
        salesmanId: [{ required: true, message: '门店账号不能为空', trigger: 'blur' }]
      },
      listQueryId: {
        // 营销id
        id: undefined,
        // 营销名称
        salesmanname: undefined,
        // 营销系统账户名
        username: undefined
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
    // editData: {
    //   deep: true,
    //   handler (value) {
    //     localStorage.setItem('editData', JSON.stringify(value))
    //   }
    // }
  },
  created () {
    this.getUserIdOptions()
    this.getHeadUid(this.$route.query.id)
  },
  mounted () {
    this.init()
  },
  methods: {
    init: function () {
      if (this.$route.query.id == null) {
        return
      }

      this.editData.salesmanId = this.$route.query.id
      this.editData.salesmanName = this.$route.query.username

      // listDetail(this.administratorId).then(response => {
      //   this.editData.salesmanId = response.data.data.salesmanId
      // })
      // console.log(this.editData.salesmanId)
    },
    getUserIdOptions () {
      idGet().then(response => {
        console.log(response.data.data.items)
        this.userIdOptions = response.data.data.items
      }).catch(response => {
        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    getHeadUid (id) {
      this.listQueryId.id = id
      adminGet(this.listQueryId).then(response => {
        this.userIdOptions = response.data.data.items
        this.editData.old_user_id = response.data.data.items.map((item) => {
          return item.id
        })
        this.editData.new_user_id = response.data.data.items.map((item) => {
          return item.id
        })
        // console.log(this.editData.old_brand_id)
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
    handleEdit: function () {
      // const finalpanting = {
      //   administratorId: this.administratorId,
      //   salesmanId: this.salesmanId
      // }
      listedit(this.editData)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '修改成功'
          })
          this.$router.push({ path: '/RelationshipChainManagement/StoreMember' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    }
  }
}
</script>
