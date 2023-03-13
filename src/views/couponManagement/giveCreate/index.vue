<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>转赠</h3>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-width="150px"
      >
        <el-form-item
          label="赠与方id"
          prop="holdId"
        >
          <el-input :disabled="!isAdmin" v-model="dataForm.holdId" />
        </el-form-item>
        <el-form-item
          label="被赠与方id"
          prop="userId"
        >
          <el-input v-model="dataForm.userId" />
        </el-form-item>
        <el-form-item
          label="数量"
          prop="number"
        >
          <el-input v-model="dataForm.number" />
        </el-form-item>

      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handlePublish"
      >转赠</el-button>
    </div>
  </div>
</template>

<script>
import { transfer } from '@/api/couponManagement/give'

export default {
  name: 'CouponManagementGiveCreate',
  data () {
    return {
      isAdmin: true,
      userId: undefined,
      dataForm: {
        holdId: undefined,
        userId: undefined,
        voucherId: 1,
        number: undefined
      },
      rules: {
        holdId: [
          { required: true, message: '赠与方id不能为空', trigger: 'blur' }
        ],
        userId: [{ required: true, message: '被赠与方id不能为空', trigger: 'blur' }],
        voucherId: [{ required: true, message: '代金券id不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.resetForm()
      this.isAdmin = this.$route.query.isAdmin
      this.userId = this.$route.query.userId
      if (!this.isAdmin) {
        this.dataForm.holdId = this.userId
      }
    },
    resetForm () {
      this.dataForm = {
        holdId: this.userId,
        userId: undefined,
        voucherId: 1,
        number: undefined
      }
    },
    handleCancel () {
      this.$router.push({ name: 'couponManagementGive' })
    },
    handlePublish () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          transfer(this.dataForm)
            .then((response) => {
              this.$notify.success({
                title: response.data.errmsg,
                message: response.data.data
              })
              setTimeout(this.handleCancel, 1000)
            })
            .catch(response => {
              this.$notify.error({
                title: response.data.errmsg,
                message: response.data.data
              })
            })
        }
      })
    }
  }

}
</script>

<style scoped>
.el-card {
  margin-bottom: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
