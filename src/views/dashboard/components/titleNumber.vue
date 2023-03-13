<template>
  <div class="base">
    <div :style="{ fontSize: (fontsize?fontsize:18)*$root.dw+'px',width:'100%',height:30*$root.dw+'px'}" class="name">
      {{ name }}
      <img :src="righttopimg">
    </div>
    <div :style="{ fontSize: (fontsize?fontsize+15:26)*$root.dw+'px',width:'100%',height:40*$root.dw+'px'}" class="parameter">
      {{ parameter }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'parameter', 'img', 'righttopimg', 'fontsize'],
  data () {
    return {

    }
  },
  mounted () {

  }
}
</script>

<style scoped>
.base {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  height: 100%;
  width: 100%;
  /* background: #fff; */
}
.name {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  /* color: #212121; */
}
.parameter {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* color: #212121; */
}
</style>
