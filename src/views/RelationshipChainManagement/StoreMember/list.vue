<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.paint_id" clearable size="mini" class="filter-item" style="width: 200px;" placeholder="请输入画册编号" /> -->
      <el-input
        v-model="listQuery.administratorId"
        clearable
        size="mini"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入需要查询的账号/名称"
      />
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      v-loading="listLoading"
      ref="administrator"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      @expand-change="expand"
    >

      <el-table-column type="expand">
        <template slot-scope="scope">

          <el-table
            v-loading="listLoading"
            ref="salesman"
            :data="listId[scope.row.id]"
            size="small"
            element-loading-text="正在查询中。。。"
            border
            fit
            highlight-current-row
          >

            <el-table-column
              align="center"
              min-width="110"
              label="会员id"
              prop="id"
            />

            <el-table-column
              align="center"
              min-width="110"
              label="会员账号"
              prop="username"
            />

            <!-- <el-table-column
              align="center"
              min-width="50"
              label="会员id"
              prop="salesmanid"
              sortable
            /> -->

            <el-table-column
              align="center"
              min-width="110"
              label="会员名称"
              prop="nickname"
              sortable
            />

            <el-table-column
              :min-width="400*$root.dw+'px'"
              align="center"
              property="avatar"
              label="用户头像"
            >
              <template slot-scope="scope">
                <el-dialog
                  :visible.sync="detailDialogVisible"
                  title="图片预览"
                >
                  <img
                    :src="lookingPicture"
                    width="100%"
                  >
                </el-dialog>
                <div
                  style="width:100%,height:100%"
                  @click="showPicture(scope.row.avatar)"
                >
                  <img
                    :src="scope.row.avatar"
                    :width="100*$root.dw+'px'"
                  >
                </div>
              </template>
            </el-table-column>

            <!-- <el-table-column
              align="center"
              property="img_info"
              label="描述"
            >
              <template slot-scope="scope">
                {{ scope.row.img_info }}
              </template>
            </el-table-column> -->

            <!-- <el-table-column align="center" label="图片查看" prop="paint_info">
              <template slot-scope="scope">
                <el-dialog :visible.sync="detailDialogVisible" title="画册预览">
                  <div v-html="goodsDetail" />
                </el-dialog>
                <el-button type="primary" size="mini" @click="">查看</el-button>
              </template>
            </el-table-column> -->

            <!-- <el-table-column
              align="center"
              label="操作"
              width="150"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleImgUpdate(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleIdDlete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>

        </template>
      </el-table-column>

      <!-- <el-table-column
        align="center"
        min-width="110"
        label="门店账号id"
        prop="id"
      /> -->
      <el-table-column
        align="center"
        min-width="110"
        label="门店id"
        prop="salesmanid"
      />

      <el-table-column
        align="center"
        min-width="200"
        label="门店账号"
        prop="username"
        sortable
      />

      <el-table-column
        align="center"
        min-width="200"
        label="门店名字"
        prop="salesmanname"
        sortable
      />

      <el-table-column
        align="center"
        property="avatar"
        label="用户头像"
      >
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar"
            width="40"
          >
        </template>
      </el-table-column>

      <!-- <el-table-column
        align="center"
        property="paint_info"
        label="简介"
      >
        <template slot-scope="scope">
          {{ scope.row.paint_info }}
        </template>
      </el-table-column> -->

      <el-table-column
        align="center"
        label="会员列表"
        prop=""
      >
        <template slot-scope="scope">
          <!-- <el-dialog :visible.sync="detailDialogVisible" title="画册预览">
            <div v-html="goodsDetail" />
          </el-dialog> -->
          <el-button
            type="primary"
            @click="$refs.administrator.toggleRowExpansion(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="400"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
            type="success"
            @click="handleImgCreate(scope.row)"
          >添加会员</el-button> -->
          <el-button
            type="primary"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <!-- <el-button
            v-show="scope.row.paint_id===1?false:true"
            type="danger"
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

    <el-tooltip
      placement="top"
      content="返回顶部"
    >
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<style scoped>
.el-dialog {
  width: 60%;
}
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 100px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.gallery {
  width: 80px;
  margin-right: 10px;
}
.TXBJW {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.app-container >>> .el-table__expanded-cell {
  padding: 0;
}
</style>

<script>
import { listGet, listDelete, idGet, adminGet } from '@/api/RelationshipChainManagement/StoreMember'
// import { listGetPicture, listDeletePicture } from '@/api/painting/picture'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsList',
  components: { BackToTop, Pagination },
  data () {
    return {
      lookingPicture: '',
      list: [],
      listId: [],
      // listImg: [],
      total: 0,
      listLoading: true,
      listImgLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        // administratorId: undefined,
        // administratorAdiminId: undefined,
        // administratorName: undefined,
        sort: 'add_time',
        order: 'asc' // desc倒序
      },
      listQueryId: {
        // 门店id
        id: undefined,
        // 门店名称
        salesmanname: undefined,
        // 门店系统账户名
        username: undefined
      },
      detailDialogVisible: false,
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      listGet(this.listQuery).then(response => {
        this.list = response.data.data.items
        // console.log(response.data.data.items)
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    // 通过id获取会员列表
    getListOfId (row) {
      this.listLoading = true
      this.listQueryId.id = row.salesmanid
      adminGet(this.listQueryId).then(response => {
        console.log(response)
        this.$set(this.listId, row.id, response.data.data.items)
        console.log(response.data.data.items)
        // this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.listId = []
        // this.total = 0
        this.listLoading = false
      })
    },
    // getPicturesList (id) {
    //   this.listImgLoading = true
    //   this.listQueryImg.paint_id = id
    //   // console.log(this.listQueryImg)

    //   // listGetPicture(this.listQueryImg).then(response => {
    //   //   this.$set(this.listImg, id, response.data.data.items)
    //   //   console.log(this.listImg[id])
    //   //   // this.total = response.data.data.total
    //   //   this.listImgLoading = false
    //   // }).catch(() => {
    //   //   this.listImg = []
    //   //   this.listImg = 0
    //   //   this.listImgLoading = false
    //   // })
    // },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
      // console.log(this.listQuery)
    },
    handleCreate () {
      this.$router.push({ name: 'StoreMemberadd' })
    },
    // handleImgCreate (row) {
    //   this.$router.push({ path: '/painting/imgcreate', query: { id: row.paint_id } })
    // },
    handleUpdate (row) {
      // localStorage.setItem('editData', JSON.stringify(this.listId[row.id]))
      this.$router.push({ name: 'StoreMemberedit', query: { id: row.salesmanid, username: row.username } })
    },
    handleImgUpdate (row) {
      this.$router.push({ path: '/painting/imgedit', query: { img_id: row.img_id, paint_id: row.paint_id } })
    },
    showPicture (url) {
      this.lookingPicture = url
      this.detailDialogVisible = true
    },
    handleDelete (row) {
      this.$confirm('此操作将删除该账户关系信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.getListOfId(row)
        // console.log(this.listId[row.id])
        const deleteData = {
          administratorId: row.salesmanid
        }
        listDelete(deleteData).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleIdDlete (row) {
      this.$confirm('此操作将删除该账户关系信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.getListOfId(row)
        // console.log(this.listId[row.id])
        const deleteData = {
          administratorId: '',
          salesmanId: ''
        }
        listDelete(deleteData).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.listId[row.id].indexOf(row)
          this.listId[row.id].splice(index, 1)
        }).catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['画册ID', '画册编号', '名称', '封面图', '画册简介']
        const filterVal = ['paint_id', 'paint_id', 'paint_title', 'paint_url', 'paint_info']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '画册信息')
        this.downloadLoading = false
      })
    },

    expand (row, expandedRows) {
      // console.log(row.paint_id)
      this.getListOfId(row)
    }
  }
}
</script>
