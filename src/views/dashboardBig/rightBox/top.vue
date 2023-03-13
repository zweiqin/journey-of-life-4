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
          height: '20%',
          fontSize:20* $root.dw+'px',
          borderRadius: 50* $root.dw+'px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #3C01CA 22%, rgba(170,44,254,0.45) 70%, rgba(26,3,72,0.00) 110%)',
      }">
        <el-button
          :style="{fontSize:14 * $root.dw + 'px',padding:5* $root.dw + 'px'}"
          type="primary"
          icon="el-icon-search"
          round
          @click="getSelectedButton(0,search)"
        />
        <input
          v-model="search"
          :style="{margin: 5 * $root.dw + 'px',height:30 * $root.dw + 'px',width:'80%',borderRadius:10* $root.dw + 'px', color:'#fff',textAlign: 'center',backgroundColor:`rgba(255,255,255,0.3)`,border:0}"
          type="text"
          @keyup.enter="getSelectedButton(0,search)"
        >
      </div>

      <div
        :style="{
          width: '100%',
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
      }">
        <div
          :style="{
            width: '100%',
            height: '50%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }">
          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="getSelectedButton(0)"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/家具工厂.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
            }">
              家具工厂
            </div>
          </div>

          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="getSelectedButton(1)"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/门店.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
            }">
              材料
            </div>
          </div>

          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="outUrl('https://www.zhult.com/background/#/dashboard')"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/物流.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
              }"
            >
              物流
            </div>
          </div>

          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="outUrl('http://bus.deyisoft.cn:8889/TuanFeng/5s.html')"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/社区.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
              }"
            >
              社区
            </div>
          </div>
        </div>

        <div
          :style="{
            width: '100%',
            height: '50%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }">
          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="outUrl('http://bus.deyisoft.cn:8889/TuanFeng/')"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/数字化门店.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
              }"
            >
              数字化门店
            </div>
          </div>

          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="outUrl('http://bus.deyisoft.cn:8889/TuanFeng/Factory.html')"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/数字化工厂.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
              }"
            >
              数字化工厂
            </div>
          </div>

          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="getSelectedButton(2)"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/注册会员.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
              }"
            >
              注册会员
            </div>
          </div>

          <div
            :style="{
              width: '25%',
              height: '80%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'space-around',
            }"
            @click="getSelectedButton(3)"
          >
            <div
              :style="{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }"
            >
              <img
                :src="require('@/assets/师傅.png')"
                :height="'80%'"
              >
            </div>
            <div
              :style="{
                color:'#fff',
                height:'20%',
                width:'100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:16* $root.dw+'px',
              }"
            >
              师傅
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchBox from '@/components/searchBox'
import titleNumber from '../components/titleNumber.vue'
export default {
  name: 'NoSignInList',
  components: {
    searchBox,
    titleNumber
  },
  data () {
    return {
      search: '',
      ChartsBgStyles: {
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        // backgroundImage: `url(${require('@/assets/divbg.png')})`,
        // backgroundSize: '100% 100%',
        alignItems: 'center', /* 定义body的元素垂直居中*/
        width: '100%',
        height: '95%'
      },
      // beforeTableData: JSON.parse(localStorage.getItem('beforeTableData')) || [],
      beforeTableData: [],
      showData: [{
        id: null,
        name: ''
      }, {
        id: null,
        name: ''
      }, {
        id: null,
        name: ''
      }, {
        id: null,
        name: ''
      }],
      tableData: [
        {
          id: 35124433584,
          name: '员工9',
          station: '5',
          loadCapacity: '4'
        },
        {
          id: 684325464633,
          name: '员工3',
          station: '5',
          loadCapacity: '2'
        },
        {
          id: 635131341,
          name: '员工5',
          station: '5',
          loadCapacity: '0'
        },
        {
          id: 3613513535433,
          name: '员工7',
          station: '6',
          loadCapacity: '1'
        },
        {
          id: 46335416354364,
          name: '员工9',
          station: '7',
          loadCapacity: '2'
        }
      ],
      tableData2: [
        {
          id: 3541636,
          name: '商品9',
          station: '5',
          loadCapacity: '4'
        },
        {
          id: 465136854,
          name: '商品3',
          station: '5',
          loadCapacity: '2'
        },
        {
          id: 486686948,
          name: '商品5',
          station: '5',
          loadCapacity: '0'
        },
        {
          id: 5964686485,
          name: '商品7',
          station: '6',
          loadCapacity: '1'
        },
        {
          id: 46534648653,
          name: '商品9',
          station: '7',
          loadCapacity: '2'
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
      // YYRQ: this.clientWidth(180),
      // ZYH: this.clientWidth(100),
      // XM: this.clientWidth(150),
      // XB: this.clientWidth(80),
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
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
    this.timer()

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
    outUrl (url) {
      window.open(url)
    },
    timer () {
      this.showData[0].id = this.tableData[0].id
      this.showData[0].name = this.tableData[0].name
      this.showData[1].id = '135465131'
      this.showData[1].name = '商品6'
      this.showData[2].id = '4653416564'
      this.showData[2].name = '商品1'
      this.showData[3].id = '5486164'
      this.showData[3].name = '张三'
    },
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
    },
    getSelectedButton (value, data) {
      console.log(value)
      this.$bus.$emit('selectedButton', {
        selectedButton: value,
        searchData: data
      })
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
  justify-content: flex-start;
  align-items: center;
}
.showtext {
  height: 100%;
  width: 40%;
  color: white;
  background: #e65b4d;
  border-radius: 10px;
}
.showtext2 {
  height: 100%;
  width: 40%;
  color: white;
  background: #4d8ce6;
  border-radius: 10px;
}
.showright {
  height: 100%;
  width: 25%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
.TXBJ {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog__wrapper >>> .el-dialog {
  background-color: #424d77;
  /* height: 60%; */
  border-radius: 1vh;
}
.el-dialog__wrapper >>> .el-dialog__title {
  font-size: 3vh;
  color: #fff;
}
.el-dialog__wrapper >>> .el-table__row > td {
  /* 去除表格线 */
  border: 1;
}
.el-dialog__wrapper >>> .el-table th.is-leaf {
  /* 去除上边框 */
  border: 1;
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

/* 闪烁动画 */
/* 定义keyframe动画，命名为blink */
@keyframes blink {
  0% {
    /* opacity: 1; */
    background-color: #424d77;
  }

  100% {
    /* opacity: 0; */
    background-color: var(--tipcolor);
  }
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    /* opacity: 1; */
    background-color: #424d77;
  }

  100% {
    /* opacity: 0; */
    background-color: var(--tipcolor);
  }
}
@-moz-keyframes blink {
  0% {
    /* opacity: 1; */
    background-color: #424d77;
  }

  100% {
    /* opacity: 0; */
    background-color: var(--tipcolor);
  }
}
@-ms-keyframes blink {
  0% {
    /* opacity: 1; */
    background-color: #424d77;
  }

  100% {
    /* opacity: 0; */
    background-color: var(--tipcolor);
  }
}
@-o-keyframes blink {
  0% {
    /* opacity: 1; */
    background-color: #424d77;
  }

  100% {
    /* opacity: 0; */
    background-color: var(--tipcolor);
  }
}
/* 定义blink类*/
.blink {
  /* color: red; */
  /* font-size: 46px; */
  animation: blink 1s linear infinite;
  /* 其它浏览器兼容性前缀 */
  -webkit-animation: blink 1s linear infinite;
  -moz-animation: blink 1s linear infinite;
  -ms-animation: blink 1s linear infinite;
  -o-animation: blink 1s linear infinite;
}
</style>
