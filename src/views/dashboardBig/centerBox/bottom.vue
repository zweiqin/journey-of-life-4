<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '95%',
      borderRadius: '5px',
      background: '#090933',
      border: '0.25px solid #00D4FE',
      boxShadow: 'inset 0px 0px 5px 0px #FFFFFF',
  }">
    <div
      :style="{
        width: '95%',
        height: '95%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }">
      <div
        :style="{
          width: '100%',
          height: '12%',
          fontSize:20* $root.dw+'px',
          borderRadius: 50* $root.dw+'px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #3C01CA 22%, rgba(170,44,254,0.45) 70%, rgba(26,3,72,0.00) 110%)',
      }">
        <span style="width:90%">访问数据</span>
      </div>

      <div
        :style="{
          width: '100%',
          height: '88%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }"
        class="tabledivstyle">
        <el-table
          id="table"
          ref="table"
          :show-overflow-tooltip="true"
          :data="tableData"
          :default-sort="{prop: 'date', order: 'descending'}"
          :row-style="{
            color: 'white',
            fontSize: 16 * $root.dw + 'px',
            backgroundColor: 'transparent',
            lineHeight: 16 * $root.dw+'px',
          }"
          :cell-style="{
            color: 'white',
            backgroundColor: 'transparent',
            fontSize: 16 * $root.dw + 'px',
            lineHeight: 16 * $root.dw+'px',
          }"
          :style="{
            backgroundColor: 'transparent',
            overflow:'hidden',
          }"
          :header-row-style="{
            //backgroundColor: 'rgba(102,153,255, 0.1)',
            backgroundColor:'transparent',
            color: 'white',
            fontSize: 18 * $root.dw + 'px',
            lineHeight: 18 * $root.dw+'px',
          }"
          :header-cell-style="{
            //backgroundColor: 'rgba(102,153,255, 0.1)',
            backgroundColor:'transparent',
            color: 'white',
            fontSize: 18 * $root.dw + 'px',
            lineHeight: 18 * $root.dw+'px',
          }"
          :height="'100%'"
          :width="'100%'"
          :size="'mini'"
        >

          <el-table-column
            :show-overflow-tooltip="true"
            :width="'atuo'"
            prop="time"
            label="时间"
            align="center"
          />

          <el-table-column
            :width="'atuo'"
            :show-overflow-tooltip="true"
            prop="clickNumber"
            label="点击量"
            align="center"
          />

          <el-table-column
            :width="'atuo'"
            :show-overflow-tooltip="true"
            prop="overNumber"
            label="成交订单"
            align="center"
          />

          <el-table-column
            :width="'atuo'"
            :show-overflow-tooltip="true"
            prop="shopNumber"
            label="交易人数"
            align="center"
          />

          <el-table-column
            :width="160*$root.dw+'px'"
            :show-overflow-tooltip="true"
            prop="clickOver"
            label="点击-成交转化率"
            align="center"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import searchBox from '@/components/searchBox'
export default {
  name: 'NoSignInList',
  components: {
    searchBox
  },
  data () {
    return {
      // beforeTableData: JSON.parse(localStorage.getItem('beforeTableData')) || [],
      beforeTableData: [],
      tableData: [],
      // YYRQ: this.clientWidth(180),
      // ZYH: this.clientWidth(100),
      // XM: this.clientWidth(150),
      // XB: this.clientWidth(80),
      centerDialogVisible: false,
      icoType: 'primary',
      icon: 'el-icon-more'
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
    }
  },
  mounted () {
    this.tableData = [
      {
        time: '2022-08-05',
        clickNumber: '510505',
        overNumber: '500',
        shopNumber: '525',
        clickOver: '55%'
      },
      {
        time: '2022-08-06',
        clickNumber: '510781',
        overNumber: '300',
        shopNumber: '150',
        clickOver: '67%'
      },
      {
        time: '2022-08-07',
        clickNumber: '610008',
        overNumber: '108',
        shopNumber: '182',
        clickOver: '77%'
      },
      {
        time: '2022-08-08',
        clickNumber: '110012',
        overNumber: '580',
        shopNumber: '257',
        clickOver: '65%'
      },
      {
        time: '2022-08-09',
        clickNumber: '210064',
        overNumber: '105',
        shopNumber: '168',
        clickOver: '45%'
      },
      {
        time: '2022-08-10',
        clickNumber: '710073',
        overNumber: '110',
        shopNumber: '107',
        clickOver: '72%'
      },
      {
        time: '2022-08-11',
        clickNumber: '53433',
        overNumber: '200',
        shopNumber: '128',
        clickOver: '30%'
      }

    ]
    this.$nextTick(() => {
      this.infinitScroll()
    })
  },
  beforeDestroy () {
    this.$bus.$off('makeAppointmentPatientsObj')
  },
  methods: {
    infinitScroll () {
      var that = this
      // 拿到表格挂载后的真实DOM
      const table = that.$refs.table
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper
      divData.onmouseover = function () {
        clearInterval(t)
      } // 鼠标移入，停止滚动
      divData.onmouseout = function () {
        start()
      } // 鼠标移出，继续滚动

      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      let t
      function start () {
        const divData = that.$refs.table.bodyWrapper
        console.log(that.$refs.table.$children)
        // 数据少于表格高度停止滚动
        if (divData.clientHeight >= divData.scrollHeight) {
          clearInterval(t)
          return
        } else {
          t = setInterval(() => {
          // 元素自增距离顶部1像素
            divData.scrollTop += 1
            // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
            if (divData.clientHeight + divData.scrollTop === divData.scrollHeight) {
            // 重置table距离顶部距离
              divData.scrollTop = 0
            }
          }, 100)
        }
      }
      start()
    },
    // 比较两个数组对象
    arrIsEqual (obj, obj2) {
      if (obj.length !== obj2.length) {
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
              if (obj[key] !== obj2[key]) {
                return false
              }
            }
          }
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
.base {

}
.wordTitle {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 15%;
  color: white;
}
.tabledivstyle {
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
.imgitem {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.tabledivstyle >>> .el-table__row > td {
  /* 去除表格线 */
  border: 1;
}
.tabledivstyle >>> .el-table th.is-leaf {
  /* 去除上边框 */
  border: 1 ;
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
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
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
