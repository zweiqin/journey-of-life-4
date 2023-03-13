<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '95%',
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
          height: '15%',
          fontSize:20* $root.dw+'px',
          borderRadius: 50* $root.dw+'px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #3C01CA 22%, rgba(170,44,254,0.45) 70%, rgba(26,3,72,0.00) 110%)',
      }">
        <span style="width:90%">热搜关键词榜</span>
      </div>

      <div
        :style="{
          width: '100%',
          height: '85%',
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
            backgroundColor: 'transparent'
          }"
          :cell-style="{
            color: 'white',
            backgroundColor: 'transparent',
            fontSize: 16 * $root.dw + 'px'
          }"
          :style="{
            backgroundColor: 'transparent'
          }"
          :header-row-style="{
            //backgroundColor: 'rgba(102,153,255, 0.1)',
            backgroundColor:'transparent',
            color: 'white',
            fontSize: 18 * $root.dw + 'px',
          }"
          :header-cell-style="{
            //backgroundColor: 'rgba(102,153,255, 0.1)',
            backgroundColor:'transparent',
            color: 'white',
            fontSize: 18 * $root.dw + 'px',
          }"
          :height="'100%'"
          :width="'100%'"
          :size="'mini'"
        >

          <el-table-column
            :show-overflow-tooltip="true"
            :width="'atuo'"
            prop="keyWord"
            label="关键词"
            align="center"
          />

          <el-table-column
            :width="'atuo'"
            :show-overflow-tooltip="true"
            prop="searchNumber"
            label="搜索量"
            align="center"
          />

          <el-table-column
            :width="210*$root.dw+'px'"
            :show-overflow-tooltip="true"
            prop="level"
            label="热度"
            align="left"
          >
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row.level"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                :style="{
                  '--fontSize':18*$root.dw+'px'
                }"
                text-color="#ff9900"
                disabled
                show-score
              />
            </template>
          </el-table-column>

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
      serch: '',
      beforeTableData: [],
      tableData: [
        {
          keyWord: '皮革',
          searchNumber: '1512123',
          level: 5,
          shopNumber: '525',
          clickOver: '55%'
        },
        {
          keyWord: '布料',
          searchNumber: '545345',
          level: 4.5,
          shopNumber: '150',
          clickOver: '67%'
        },
        {
          keyWord: '塑料',
          searchNumber: '45343',
          level: 3,
          shopNumber: '182',
          clickOver: '77%'
        },
        {
          keyWord: '弹簧',
          searchNumber: '213',
          level: 2,
          shopNumber: '257',
          clickOver: '65%'
        },
        {
          keyWord: '海棉',
          searchNumber: '135',
          level: 2,
          shopNumber: '168',
          clickOver: '45%'
        },
        {
          keyWord: '木材',
          searchNumber: '36',
          level: 1,
          shopNumber: '107',
          clickOver: '72%'
        },
        {
          keyWord: '碳钎',
          searchNumber: '2',
          level: 0,
          shopNumber: '128',
          clickOver: '30%'
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
    // 设置列表滑动
    this.infinitScroll()
  },
  beforeDestroy () {
  },
  methods: {
    handleCurrentChange (val) {
      this.currentRow = val
    },
    infinitScroll () {
      // 拿到表格挂载后的真实DOM
      const table = this.$refs.table
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
        // 数据少于表格高度停止滚动
        if (divData.clientHeight >= divData.scrollHeight) {
          return
        }
        t = setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
          if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
          }
        }, 100)
      }
      start()
    },
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
    },
    callback () {

    }
  }
}
</script>

<style scoped>
.wordTitle {
  /* font-size: 2.8vh; */
  width: 100%;
  height: 5%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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
.tabledivstyle >>> .el-rate__icon{
  font-size: var(--fontSize);
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
