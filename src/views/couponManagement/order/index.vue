<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.orderId"
        clearable
        size="mini"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入订单ID"
      />
      <el-input
        v-show="isAdmin"
        v-model="listQuery.userId"
        clearable
        size="mini"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入会员ID"
      />
      <el-select
        v-model="listQuery.status"
        size="mini"
        class="filter-item"
        style="width: 200px;"
        placeholder="请选择状态"
      >
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button
        v-permission="['GET /admin/voucherRecord/list']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
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
        label="编号"
        prop="id"
        sortable
      />

      <el-table-column
        align="center"
        label="订单编号"
        prop="orderId"
      />

      <el-table-column
        align="center"
        label="购买者id"
        prop="userId"
      />

      <el-table-column
        align="center"
        label="购买数量"
        prop="number"
      />

      <el-table-column
        align="center"
        label="状态"
        prop="status"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">未付款</el-tag>
          <el-tag
            v-if="scope.row.status === 1"
            type="info"
          >取消</el-tag>
          <el-tag
            v-if="scope.row.status === 2"
            type="success"
          >已付款</el-tag>
          <el-tag
            v-if="scope.row.status === 3"
            type="danger"
          >代金券未发放</el-tag>
          <el-tag
            v-if="scope.row.status === 4"
            type="success"
          >代金券已发放</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="微信订单编号"
        prop="payId"
      />

      <el-table-column
        align="center"
        label="消费金额"
        prop="payGrade"
      />

      <el-table-column
        align="center"
        label="支付时间"
        prop="payTime"
      />

      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/admin/update']"
            :disabled="scope.row.status !== 3"
            type="primary"
            size="mini"
            @click="handleGrant(scope.row)"
          >发放</el-button>
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
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listGet, grant } from '@/api/couponManagement/order'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/login'
import Pagination from '@/components/Pagination'

export default {
  name: 'CouponManagementOrder',
  components: { Pagination },
  data () {
    return {
      isAdmin: true,
      userId: -1,
      listLoading: true,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        orderId: undefined,
        userId: undefined,
        status: undefined
      },
      statusList: [
        {
          id: 0,
          name: '未付款'
        },
        {
          id: 1,
          name: '取消'
        },
        {
          id: 2,
          name: '已付款'
        },
        {
          id: 3,
          name: '代金券未发放'
        },
        {
          id: 4,
          name: '代金券已发放'
        }
      ]
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
    this.getRoles()
  },
  methods: {
    getRoles () {
      getUserInfo(getToken())
        .then(response => {
          this.isAdmin = response.data.data.roles[0] === '超级管理员'
          this.userId = response.data.data.userId
          if (this.isAdmin) {
            this.getList()
          } else {
            if (this.userId === undefined) {
              this.$notify.error({
                title: '异常',
                message: '没有权限'
              })
              this.listLoading = false
            } else {
              this.listQuery.userId = this.userId
              this.getList()
            }
          }
        })
        .catch()
    },
    getList () {
      listGet(this.listQuery)
        .then(response => {
          this.list = response.data.data.items
          for (const i in this.list) {
            this.list[i].payTime = this.common.splicingDate(this.list[i].payTime)
          }
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
    handleGrant (row) {
      if (row.status === 3) {
        this.$confirm('进行代金券发放, 是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetForm()
          this.dataForm.id = row.id
          this.doGrant()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    doGrant () {
      grant(this.dataForm)
        .then(response => {
          this.$message({
            type: 'success',
            message: response.data.data
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '代金券发放失败'
          })
        })
    },
    resetForm () {
      this.dataForm = {
        id: undefined,
        desc: undefined,
        ratio: undefined,
        enabled: 1
      }
    }
  }
}
</script>

<style scoped>
</style>
