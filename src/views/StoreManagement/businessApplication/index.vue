<template>
  <div class="base">
    <div class="title">申请成为高级业务员</div>
    <div class="title">申请条件：xxxxxxxxxxxxxxxxxxx（已达成）</div>
    <el-button
      type="primary"
      round
      @click="sum"
    >
      申请
    </el-button>
  </div>
</template>

<script>
import titleNumber from '@/components/titleNumber'
export default {
  components: {
    titleNumber
  },
  data () {
    return {

    }
  },
  methods: {
    sum () {
      this.$message({
        showClose: true,
        message: '申请成功！请等待管理员审核！',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.base {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.title {
  font-size: 26px;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

