<template>
  <div class="base">
    <div
      class="searchdiv"
      style="width:100%"
    >
      <el-button
        :style="{'--fontsize':18 * $root.dw + 'px','--radius':10 * $root.dw + 'px','--padding':10* $root.dw + 'px'}"
        type="primary"
        @click="callback"
      >搜索</el-button>
      <input
        v-model="search"
        :style="{margin: 5 * $root.dw + 'px',height:40 * $root.dw + 'px',width:'80%',borderRadius:10* $root.dw + 'px', textAlign: 'center',backgroundColor:`rgba(255,255,255,0.5)`,border:0}"
        type="text"
        @keyup.enter="callback"
      >
    </div>
    <div :style="{fontSize:30*$root.dw+'px'}">{{ '当前门店：'+shop }}</div>
    <div :class="['map','TXBJL']">
      <div
        :style="{
          position: 'absolute',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${require('@/assets/map.png')})`,
          backgroundSize: '100% 100%',
          width: 418 * this.$root.dw + 'px',
          height: 418 * this.$root.dw + 'px',
          opacity: 0.3
        }"
        class="rotate"
      />
      <div
        :style="{
          position: 'absolute',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${require('@/assets/lbx.png')})`,
          backgroundSize: '100% 100%',
          width: 500 * this.$root.dw + 'px',
          height: 500 * this.$root.dw + 'px'
        }"
        class="rotate2"
      />
      <cmap
        :style="{
          position: 'absolute',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '100% 100%'
        }"
        :height="700 * this.$root.dw + 'px'"
        :width="700 * this.$root.dw + 'px'"
      />
    </div>
  </div>
</template>

<script>
import cmap from './map.vue'
export default {
  name: '',
  components: {
    cmap
  },
  data () {
    return {
      shop: '未选择门店',
      search: ''

    }
  },
  created () {
    this.$bus.$on('place', val => {
      this.$set(this.$data, 'shop', val)
    })
  },
  beforeDestroy () {
    this.$bus.$off('place')
  },
  methods: {
    callback () {

    }
  }
}
</script>

<style scoped>
.base {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
  justify-content: center;
}
.TXBJL {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  /* background: #fff; */
  /* color: #fff; */
}
.map {
  position: relative;
}
.rotate {
  animation: rotate 6s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotateZ(0deg); /*从0度开始*/
  }
  100% {
    transform: rotateZ(360deg); /*360度结束*/
  }
}
.rotate2 {
  animation: rotate2 4s linear infinite;
}
@keyframes rotate2 {
  0% {
    transform: rotateZ(360deg); /*0度结束*/
  }
  100% {
    transform: rotateZ(0deg); /*从360度开始*/
  }
}
</style>

