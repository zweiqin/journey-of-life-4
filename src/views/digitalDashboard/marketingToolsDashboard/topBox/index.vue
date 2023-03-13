<template>
  <div class="TXBJL">
    <div :style="bgimg1"/>
    <div :style="bgimg2">
      <div :class="['wordTitle']">
        营 销 哨 兵
      </div>
    </div>
    <div :style="bgimg3">
      <el-date-picker
        v-model="value"
        class="input"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBox',
  data () {
    return {
      value: ['2021-8-12', '2022-8-12'], // 默认时间
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
        padding: 5 * this.$root.dw + 'px'
      }
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
.input {
  width: 85%;
  height: 65%;
  background-color: transparent;
  border: 1px solid #205d93;
  color: white;
  box-shadow: 0 0 15px #147598 inset;
}

>>>.el-date-editor .el-range-input {
  background-color: transparent;
  color: white;
}
>>>.el-range-editor.el-input__inner {
  padding: 0;
}
</style>
