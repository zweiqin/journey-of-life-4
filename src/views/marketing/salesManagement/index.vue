<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.id" clearable size="mini" class="filter-item" style="width: 200px;" placeholder="请输入业务员ID"/>
      <el-input v-model="listQuery.name" clearable size="mini" class="filter-item" style="width: 200px;" placeholder="请输入业务员名称"/>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" width="100px" label="业务员ID" prop="id" sortable/>

      <el-table-column align="center" min-width="100px" label="业务员名称" prop="pid"/>

      <el-table-column align="center" min-width="200px" label="销售数量" prop="code"/>

      <el-table-column align="center" min-width="100px" label="销售人数" prop="code"/>

      <el-table-column align="center" min-width="100px" label="销售金额" prop="code"/>

      <el-table-column align="center" min-width="100px" label="提成" prop="code"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listRegion } from '@/api/business/region'
import Pagination from '@/components/Pagination'

export default {
  name: 'SalesManagement',
  components: { Pagination },
  data () {
    return {
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined
      },
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      listRegion(this.listQuery).then(response => {
        this.list = response.data.data.items
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
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['业务员ID', '业务员名称', '销售数量', '销售人数', '销售金额', '提成']
        const filterVal = ['id', 'pid', 'name', 'type', 'code', '']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售管理信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
