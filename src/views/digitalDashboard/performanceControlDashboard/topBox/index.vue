<template>
  <div class="TXBJL">
    <div :style="bgimg1"/>
    <div :style="bgimg2">
      <div :class="['wordTitle']">
        业 绩 哨 兵
      </div>
    </div>
    <div :style="bgimg3">
      {{ dateFormat(date) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBox',
  data () {
    return {
      date: new Date(),
      bgimg1: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 50 * this.$root.dw + 'px',
        backgroundImage: `url(${require('@/assets/label.png')})`,
        backgroundSize: '68% 65%',
        width: '18%',
        height: '97%'
      },
      bgimg2: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 15px',
        backgroundImage: `url(${require('@/assets/titlebg.png')})`,
        backgroundSize: '100% 100%',
        width: '64%',
        height: '97%'
      },
      bgimg3: {
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        width: '18%',
        height: '97%',
        paddingRight: 20 * this.$root.dw + 'px',
        color: 'white'
      }
    }
  },
  mounted () {
    // 显示当前日期时间
    const _this = this// 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date() // 修改数据date
    }, 1000)
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    dateFormat (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }
  }

}
</script>

<style scoped>
.TXBJL {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}
.wordTitle {
  font-size: 3.8vh;
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

>>>.el-date-editor .el-range-input {
  background-color: transparent;
  color: white;
}
>>>.el-range-editor.el-input__inner {
  padding: 0;
}
</style>

