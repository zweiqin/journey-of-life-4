<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
  }">
    <div
      :style="{
        width: '95%',
        height: '98%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5* $root.dw+'px',
        background: '#0A0A34',
        border: '0.25px solid #07B9B9',
        boxShadow: 'inset 0px 0px '+5* $root.dw+'px'+' 0px #FFFFFF',
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
            height: '5%',
            fontSize:20* $root.dw+'px',
            borderRadius: 50* $root.dw+'px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            background: 'linear-gradient(90deg, #3C01CA 22%, rgba(170,44,254,0.45) 70%, rgba(26,3,72,0.00) 110%)',
        }">
          <span style="width:25%">数据展示</span>
          <span style="width:70%">总数：{{ tableData.length }}</span>
        </div>
        <div
          :style="{
            width: '100%',
            height: '95%',
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
              v-for="item in tableTitle"
              :show-overflow-tooltip="true"
              :width="'atuo'"
              :key="item.id"
              :label="item.title"
              :prop="item.prop"
              align="center"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchBox from '@/components/searchBox'
import axios from 'axios'
export default {
  name: 'NoSignInList',
  components: {
    searchBox
  },
  data () {
    return {
      serch: '',
      ChartsBgStyles: {
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        // backgroundImage: `url(${require('@/assets/divbg.png')})`,
        // backgroundSize: '100% 100%',

      },
      // beforeTableData: JSON.parse(localStorage.getItem('beforeTableData')) || [],
      beforeTableData: [],
      tableTitle: [],
      tableData: [],
      tableTitle2: [
        {
          id: 1,
          title: '序号',
          prop: 'id'
        },
        {
          id: 2,
          title: '名称',
          prop: 'name'
        },
        {
          id: 3,
          title: '数量',
          prop: 'number'
        },
        {
          id: 4,
          title: '城市',
          prop: 'city'

        }
      ],
      tableData2: [
        {
          id: '1',
          name: '9',
          number: '张三',
          city: '4'
        },
        {
          id: '2',
          name: '3',
          number: '李四',
          city: '2'
        },
        {
          id: '3',
          name: '5',
          number: '赵五',
          city: '0'
        },
        {
          id: '4',
          name: '7',
          number: 'xxx',
          city: '1'
        },
        {
          id: '5',
          name: '9',
          number: 'xxx',
          city: '2'
        },
        {
          id: '6',
          name: '9',
          number: 'xxx',
          city: '2'
        },
        {
          id: '7',
          name: '9',
          number: '7',
          city: '2'
        },
        {
          id: '8',
          name: '9',
          number: 'xxx',
          city: '2'
        },
        {
          id: '9',
          name: '9',
          number: 'xxx',
          city: '2'
        }

      ],
      tableTitle3: [
        {
          id: 1,
          title: '序号',
          prop: 'id'
        },
        {
          id: 2,
          title: '名称',
          prop: 'name'
        },
        {
          id: 3,
          title: '数量',
          prop: 'number'
        }
      ],
      tableData3: [
        {
          id: '1',
          name: '9',
          number: '张三'
        },
        {
          id: '2',
          name: '3',
          number: '李四'
        },
        {
          id: '3',
          name: '5',
          number: '赵五'
        }
      ],
      searchData1: {
        Name: '',
        Address: ''
      },
      searchData: {
        pageNo: 1,
        pageSize: 20
      },
      selectedButton: 0,
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
      // // 表格整体样式
      // tableStyle: {
      //   backgroundColor: 'transparent'
      // },
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
    // 列表滑动
    this.infinitScroll()
    // 获得数据
    this.getList(this.selectedButton)
    this.$bus.$on('selectedButton', (data) => {
      console.log(data)
      if (data != null) {
        this.selectedButton = data.selectedButton
        this.getList(this.selectedButton)
        if (data.searchData != null) {
          this.searchData1.Name = data.searchData
          // console.log(this.searchData1)
        }
      }
    })
  },
  beforeDestroy () {
    this.$bus.$off('selectedButton')
  },
  methods: {
    getList (key) {
      const that = this
      switch (key) {
        case 0:
          axios.post('https://www.tuanfengkeji.cn/TF_WeChatServices/Settings/SettingServer.svc/GetLogistics', this.searchData).then(function (response) {
            console.log(response)
            that.$set(that.$data, 'tableTitle', response.data.tableTitle)
            that.$set(that.$data, 'tableData', response.data.tableData)
          })
            .catch(function (error) {
              console.log(error)
            })
          break
        case 1:
          axios.post('https://www.tuanfengkeji.cn/TF_WeChatServices/Settings/SettingServer.svc/GetMaterial', this.searchData1).then(function (response) {
            console.log(response)
            that.$set(that.$data, 'tableTitle', response.data.tableTitle)
            that.$set(that.$data, 'tableData', response.data.tableData)
          })
            .catch(function (error) {
              console.log(error)
            })
          break
        case 2:
          that.$set(that.$data, 'tableTitle', [])
          that.$set(that.$data, 'tableData', [])
          break
        case 3:
          axios.post('https://www.tuanfengkeji.cn/TF_WeChatServices/Settings/SettingServer.svc/GetOperator', this.searchData1).then(function (response) {
            console.log(response)
            that.$set(that.$data, 'tableTitle', response.data.tableTitle)
            that.$set(that.$data, 'tableData', response.data.tableData)
          })
            .catch(function (error) {
              console.log(error)
            })
          break
        default:
          break
      }
    },
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
