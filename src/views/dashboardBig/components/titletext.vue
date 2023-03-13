<template>
  <div :style="{ width:830*$root.dw+'px',height:200*$root.dw+'px',background:'#fffffd',margin:10*$root.dw+'px'}" class="basediv">
    <div :style="{width:50*$root.dw+'px',fontSize:26*$root.dw+'px',background:color,letterSpacing:10*$root.dw+'px'}" class="titlediv">
      <i :style="{color:icoColor}" :class="[img]" />
      <!-- <i :style="{color:icoColor}" class="'el-icon-user-solid'" /> -->
      <div>{{ titletext }}</div>
    </div>
    <el-card :style="{ width:780*$root.dw+'px',height:200*$root.dw+'px','--direction':direction,display: 'flex'}" class="itemdiv">
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
  },
  mounted () {
    console.log(this.img)
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
/* .icon {
  width: 50%;
  margin: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #212121;
} */
.itemdiv >>> .el-card__body {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: var(--direction);
  padding: 0;
}
</style>
