<template>
  <div class="menubase">
    <img
      :src="img"
      :style="{width:200*$root.dw+'px',padding:10*$root.dw+'px',cursor:'pointer'}"
      @click="($route.name === 'paintingshow' || $route.name === 'pictureShow') ? $router.push({ name: 'paintingshow'}) : $router.push({ name: 'paintingshow_out'})"
    >
    <el-menu
      :default-active="$route.path"
      router
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item :index="($route.name === 'paintingshow' || $route.name === 'pictureShow') ? '/promotion/painting/paintingshow' : '/paintingshow_out'">
        首页
      </el-menu-item>
      <!-- <el-menu-item index="2">公司简介</el-menu-item> -->
      <el-menu-item :index="($route.name === 'paintingshow' || $route.name === 'pictureShow') ? '/promotion/painting/pictureShow' : '/pictureShow_out'">
        产品展示
      </el-menu-item>
      <!-- <el-menu-item index="4">联系我们</el-menu-item> -->
    </el-menu>
    <div :style="{width:200*$root.dw+'px'}" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      img: require('@/assets/image/tfkj.png')
    }
  },
  mounted () {
  }

}
</script>

<style scoped>
.menubase {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
