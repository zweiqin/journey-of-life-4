<template>
  <div :style="ChartsBgStyles">
    <div :class="['wordTitle']">
      营销哨兵
      <el-button
        type="primary"
        icon="el-icon-tickets"
        round
        @click="details"
      >详细</el-button>
    </div>
    <div class="tabledivstyle">
      <el-table
        id="table"
        ref="table"
        :show-overflow-tooltip="true"
        :data="tableData"
        :default-sort="{prop: 'date', order: 'descending'}"
        :row-style="{
          color: 'white',
          fontSize: 16 * this.$root.dw + 'px',
          backgroundColor: 'transparent'
        }"
        :cell-style="{
          color: 'white',
          backgroundColor: 'transparent',
          fontSize: 16 * this.$root.dw + 'px'
        }"
        :style="tableStyle"
        :header-row-style="{
          //backgroundColor: 'rgba(102,153,255, 0.1)',
          backgroundColor:'transparent',
          color: 'white',
          fontSize: 18 * this.$root.dw + 'px',
        }"
        :header-cell-style="{
          //backgroundColor: 'rgba(102,153,255, 0.1)',
          backgroundColor:'transparent',
          color: 'white',
          fontSize: 18 * this.$root.dw + 'px',
        }"
        :height="180*$root.dw+'px'"
        :size="'mini'"
      >

        <el-table-column
          :show-overflow-tooltip="true"
          :width="'atuo'"
          prop="name"
          label="活动名称"
          align="center"
        />

        <el-table-column
          :width="90*$root.dw+'px'"
          :show-overflow-tooltip="true"
          prop="time"
          label="时间"
          align="center"
        />

        <el-table-column
          :width="70*$root.dw+'px'"
          :show-overflow-tooltip="true"
          prop="attendance"
          label="到场人数"
          align="center"
        />

        <el-table-column
          :width="80*$root.dw+'px'"
          :show-overflow-tooltip="true"
          prop="state"
          label="状态"
          align="center"
        />

        <el-table-column
          :width="80*$root.dw+'px'"
          :show-overflow-tooltip="true"
          prop="totalSinglePerformance"
          label="单场总业绩"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoSignInList',
  data () {
    return {
      ChartsBgStyles: {
        alignItems: 'center', /* 定义body的元素垂直居中*/
        width: '100%',
        height: '95%'
      },
      beforeTableData: [],
      tableData: [
        {
          name: '活动一',
          time: '2022-7-1',
          attendance: '5',
          state: '开始',
          totalSinglePerformance: '4'
        },
        {
          name: '活动二',
          time: '2022-7-1',
          attendance: '5',
          state: '结束',
          totalSinglePerformance: '4'
        },
        {
          name: '活动三',
          time: '2022-7-1',
          attendance: '5',
          state: '进行中',
          totalSinglePerformance: '4'
        },
        {
          name: '活动四',
          time: '2022-7-1',
          attendance: '6',
          state: '开始',
          totalSinglePerformance: '4'
        },
        {
          name: '活动五',
          time: '2022-7-1',
          attendance: '7',
          state: '开始',
          totalSinglePerformance: '4'
        }

      ],
      // 表头样式
      headerRowStyle: {
        backgroundColor: 'rgba(102,153,255, 0.1)',
        color: 'white',
        fontSize: '1.8vh'
      },
      headerCellStyle: {
        backgroundColor: 'transparent'
      },
      // 单数行样式
      rowStyle: {
        color: 'white',
        // fontWeight: '500',
        fontSize: '1.5vh',
        backgroundColor: 'rgba(1,1,1, 0.3)'
      },
      // 双数行样式
      cellStyle: {
        color: 'white',
        backgroundColor: 'rgba(14,34,101,0.3)',
        fontSize: '1.5vh'
      },
      // 表格整体样式
      tableStyle: {
        backgroundColor: 'transparent',
        width: 'auto'
      },
      centerDialogVisible: false,
      icoType: 'primary',
      icon: 'el-icon-more',
      watchStatus: JSON.parse(localStorage.getItem('watchStatus')) || false
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler (value) {
        // localStorage.setItem('tableData', JSON.stringify(value))
      }
    },
    watchStatus: {
      deep: true,
      handler (value) {
        localStorage.setItem('watchStatus', JSON.stringify(value))
      }
    }
  },
  updated () {
    if (this.tableData.length > 0) {
      this.watchStatus = true
    } else {
      this.watchStatus = false
    }
  },
  beforeDestroy () {
    this.$bus.$off('makeAppointmentPatientsObj')
  },
  methods: {
    handleCurrentChange (val) {
      this.currentRow = val
    },
    arrIsEqual (obj, obj2) {
      if (obj.length !== obj2.length) {
        return false
      }
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 判断ojb子元素是否为对象，如果是，递归比较
            if (obj[key] && typeof obj[key] === 'object') {
              if (this.arrIsEqual(obj[key], obj2[key]) === false) {
                return false
              }
            } else {
              // 如果不是，简单比较
              if (obj[key] !== obj2[key]) {
                return false
              }
            }
          }
        }
      }
      return true
    },
    // 深度复制数组
    deepClone (obj) {
      const objClone = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = this.deepClone(obj[key])
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key]
            }
          }
        }
      }
      return objClone
    },
    // 控制组件的字体随屏幕的缩放而改变大小
    clientHeight (res) {
      const clientHeight = document.documentElement.clientHeight
      if (!clientHeight) return
      const fs = (clientHeight / 1080)
      return res * fs
    },
    // 控制组件的字体随屏幕的缩放而改变大小
    clientWidth (res) {
      const clientWidth = document.documentElement.clientWidth
      if (!clientWidth) return
      const fs = (clientWidth / 1920)
      return res * fs
    },
    Onclick () {
      // this.watchStatus = false
      this.centerDialogVisible = true
    },
    callback () {

    },
    details () {
      this.$router.push({ name: 'marketingToolsDashboard' })
    }
  }
}
</script>

<style scoped>
.wordTitle {
  font-size: 2.8vh;
  width: 100%;
  height: 20%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.tabledivstyle {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}
.searchdiv >>> .el-button {
  font-size: var(--fontsize);
  border-radius: var(--radius);
  padding: var(--padding);
}
.searchdiv {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.tabledivstyle >>> .el-table__row > td {
  /* 去除表格线 */
  border: 1;
}
.tabledivstyle >>> .el-table th.is-leaf {
  /* 去除上边框 */
  border: 1;
}
.tabledivstyle >>> .el-table::before {
  /* 去除下边框 */
  height: 0;
}
.tabledivstyle >>> th.el-table__cell {
  background-color: transparent;
}
.tabledivstyle >>> .el-table .cell {
  line-height: 4vh;
  color: #fff;
}
.TXBJ {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog__wrapper >>> .el-dialog {
  background-color: #181b1f;
  /* height: 60%; */
  border-radius: 1vh;
}
.el-dialog__wrapper >>> .el-dialog__title {
  font-size: 3vh;
  color: #18d190;
}
.el-dialog__wrapper >>> .el-table__row > td {
  /* 去除表格线 */
  border: none;
}
.el-dialog__wrapper >>> .el-table th.is-leaf {
  /* 去除上边框 */
  border: none;
}
.el-dialog__wrapper >>> .el-table::before {
  /* 去除下边框 */
  height: 0;
}
.el-dialog__wrapper >>> th.el-table__cell {
  background-color: transparent;
}

.el-dialog__wrapper >>> .el-table .cell {
  line-height: 4vh;
}

/* //滚动条的宽度 */
.tabledivstyle >>> .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* //滚动条的滑块 */

.tabledivstyle >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}

/* // 如果是整个页面的滚动条风格是一致的，直接改全局的滚动条样式也可以有效果
//滚动条的宽度 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/* //滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #fff;
  border-radius: 3px;
}
</style>
