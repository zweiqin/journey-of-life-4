<template>
  <div :style="ChartsBgStyles">
    <div :class="['wordTitle']">
      营销工具
    </div>
    <div class="base">
      <titleNumber
        :name="'代金券使用'"
        :parameter="number[0]+'%'"
        class="divitem"
      />
      <titleNumber
        :name="'红包发放'"
        :parameter="number[1]+'个'"
        class="divitem"
      />
      <titleNumber
        :name="'发放金额'"
        :parameter="number[2]+'个'"
        class="divitem"
      />
      <titleNumber
        :name="'签到率'"
        :parameter="number[3]+'%'"
        class="divitem"
      />
    </div>
    <div class="base2">
      <div class="showitem">
        <div class="showtitle" />
        <div
          :style="{fontSize:20*$root.dw+'px'}"
          class="showtext"
        >天</div>
        <div
          :style="{fontSize:20*$root.dw+'px'}"
          class="showtext"
        >周</div>
        <div
          :style="{fontSize:20*$root.dw+'px'}"
          class="showtext"
        >月</div>
      </div>
      <div class="showitem">

        <div class="showtitle">参与人数</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '5' }}个</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '10' }}个</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '20' }}个</div>
      </div>
      <div class="showitem">

        <div class="showtitle">活动金额</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '46' }}元</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '566' }}元</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '1461' }}元</div>
      </div>
      <div class="showitem">

        <div class="showtitle">活动次数</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '6' }}次</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '12' }}次</div>
        <div
          :style="{fontSize:26*$root.dw+'px'}"
          class="showtext"
        >{{ '36' }}次</div>
      </div>
    </div>
  </div>
</template>

<script>
import titleNumber from '../components/titleNumber.vue'
export default {
  name: 'MarketingTools',
  components: {
    titleNumber
  },
  data () {
    return {
      number: [],
      ChartsBgStyles: {
        width: '100%',
        height: '95%'
      },
      // beforeTableData: JSON.parse(localStorage.getItem('beforeTableData')) || [],
      beforeTableData: [],
      tableData: [
        {
          id: 35124433584,
          goodsname: '9',
          station: '5',
          loadCapacity: '4'
        },
        {
          id: 684325464633,
          goodsname: '3',
          station: '5',
          loadCapacity: '2'
        },
        {
          id: 635131341,
          goodsname: '5',
          station: '5',
          loadCapacity: '0'
        },
        {
          id: 3613513535433,
          goodsname: '7',
          station: '6',
          loadCapacity: '1'
        },
        {
          id: 46335416354364,
          goodsname: '9',
          station: '7',
          loadCapacity: '2'
        },
        {
          id: 46335416354364,
          goodsname: '9',
          station: '7',
          loadCapacity: '2'
        }
        // {
        //   id: 643435134336435,
        //   goodsname: '郭先生',
        //   station: '广州-成都',
        //   loadCapacity: '1.2吨'
        // },
        // {
        //   id: 643435134336435,
        //   goodsname: '宋先生',
        //   station: '广州-成都',
        //   loadCapacity: '2吨'
        // }

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
      // YYRQ: this.clientWidth(180),
      // ZYH: this.clientWidth(100),
      // XM: this.clientWidth(150),
      // XB: this.clientWidth(80),
      centerDialogVisible: false,
      icoType: 'primary',
      icon: 'el-icon-more',
      watchStatus: JSON.parse(localStorage.getItem('watchStatus')) || false
      // Tipbutton: this.watchStatus ? Tipbutton : Watchbutton
      // Tipbutton: require('@/assets/newicon.gif')
      // Watchbutton: require('@/assets/watch.gif')
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
  mounted () {
    for (let index = 0; index < 29; index++) {
      this.number.push((Math.random() * 100).toFixed(0))
    }
    // this.infinitScroll()

    // 获得数据
    // this.$bus.$on('makeAppointmentPatientsObj', (makeAppointmentPatientsObj) => {
    //   if (makeAppointmentPatientsObj != null) {
    //     const data = makeAppointmentPatientsObj.map((item) => {
    //       return {
    //         patientId: item.patientId,
    //         patientName: item.patientName,
    //         gender: item.gender,
    //         date: item.subscribeTime
    //       }
    //     })
    //     if (this.tableData.length == 0) {
    //       this.tableData = data
    //     }
    //     const arrIsEqual = this.arrIsEqual(data, this.tableData)
    //     if (!arrIsEqual) {
    //       this.watchStatus = true
    //       this.tableData = data
    //     }
    //   } else {
    //     this.watchStatus = false
    //   }
    // })
  },
  beforeDestroy () {
    this.$bus.$off('makeAppointmentPatientsObj')
  },
  methods: {
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // infinitScroll() {
    //   // 拿到表格挂载后的真实DOM
    //   const table = this.$refs.table
    //   // 拿到表格中承载数据的div元素
    //   const divData = table.bodyWrapper
    //   divData.onmouseover = function () {
    //     clearInterval(t)
    //   } // 鼠标移入，停止滚动
    //   divData.onmouseout = function () {
    //     start()
    //   } // 鼠标移出，继续滚动

    //   // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
    //   let t
    //   function start() {
    //     // 数据少于表格高度停止滚动
    //     if (divData.clientHeight >= divData.scrollHeight) {
    //       return
    //     }
    //     t = setInterval(() => {
    //       // 元素自增距离顶部1像素
    //       divData.scrollTop += 1
    //       // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
    //       if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
    //         // 重置table距离顶部距离
    //         divData.scrollTop = 0
    //       }
    //     }, 100)
    //   }
    //   start()
    // },
    // 比较两个数组对象
    arrIsEqual (obj, obj2) {
      if (obj.length != obj2.length) {
        return false
      }
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 判断ojb子元素是否为对象，如果是，递归比较
            if (obj[key] && typeof obj[key] === 'object') {
              if (this.arrIsEqual(obj[key], obj2[key]) == false) {
                return false
              }
            } else {
              // 如果不是，简单比较
              if (obj[key] != obj2[key]) {
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
    }
  }
}
</script>

<style scoped>
.wordTitle {
  font-size: 3vh;
  width: 100%;
  height: 15%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.base {
  width: 100%;
  height: 20%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.divitem {
  height: 100%;
  width: 25%;
}
.base2 {
  width: 100%;
  height: 65%;
  background: #2d3968;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.showitem {
  margin-top: 2%;
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.showtitle {
  margin-right: 5%;
  font-size: 2vh;
  height: 100%;
  width: 30%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.showtext {
  height: 100%;
  width: 40%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.tabledivstyle {
  width: 100%;
  /* height: 85%; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* font-size: auto; */
  /* margin-top: 1vh; */
  /* margin-bottom: 1vh; */
}
.tabledivstyle >>> .el-table__row > td {
  /* 去除表格线 */
  border: none;
}
.tabledivstyle >>> .el-table th.is-leaf {
  /* 去除上边框 */
  border: none;
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
