<template>
  <div class="searchdiv" style="width:100%">
    <el-button :style="{'--fontsize':16 * $root.dw + 'px','--radius':10 * $root.dw + 'px','--padding':5* $root.dw + 'px'}" type="primary" @click="callback">搜索</el-button>
    <input v-model="serch" :style="{margin: 5 * $root.dw + 'px',height:20 * $root.dw + 'px',width:'100%',borderRadius:50* $root.dw + 'px', textAlign: 'center',backgroundColor:`rgba(255,255,255,0.5)`,border:0}" type="text" @keyup.enter="callback">
  </div>
</template>

<script>
export default {
  props: ['callback'],
  data () {
    return {
      serch: ''
    }
  }
}
</script>

<style scoped>
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
</style>
