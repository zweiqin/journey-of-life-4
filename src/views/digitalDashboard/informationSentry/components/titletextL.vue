<template>
  <div :style="{ width:1680*$root.dw+'px',height:150*$root.dw+'px',background:'#fffffd',margin:10*$root.dw+'px'}" class="basediv">
    <div :style="{width:50*$root.dw+'px',fontSize:26*$root.dw+'px',background:color,letterSpacing:10*$root.dw+'px'}" class="titlediv">
      <i :style="{color:icoColor}" :class="[img]" />
      <div>{{ titletext }}</div>
    </div>
    <el-card :style="{ width:1630*$root.dw+'px',height:150*$root.dw+'px','--direction':direction}" class="itemdiv">
      <slot />
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['titletext', 'img', 'icoColor', 'color', 'direction'],
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.basediv {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
}
.titlediv {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  writing-mode: tb-rl;
  line-height: 1;
  color: #212121;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
  overflow: hidden;
  /* background: #fff; */
}
.icon {
  width: 50%;
  margin: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #212121;
  /* writing-mode: tb-rl; */
  /* background: #fff; */
}
.itemdiv >>> .el-card__body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: var(--direction);
  padding: 0;
}
</style>
