<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '98%',
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
          height: '9%',
          fontSize:20* $root.dw+'px',
          borderRadius: 50* $root.dw+'px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #3C01CA 22%, rgba(170,44,254,0.45) 70%, rgba(26,3,72,0.00) 110%)',
      }">
        <span style="width:90%">用户分析</span>
      </div>

      <div
        :style="{
          width: '100%',
          height: '91%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
      }">
        <userChart
          :style="{
            width: '100%',
            height: '48%',
        }"/>
        <upChart
          :style="{
            width: '100%',
            height: '52%',
        }"/>
      </div>
    </div>
  </div>
</template>

<script>
import upChart from './upChart.vue'
import userChart from './userChart.vue'
export default {
  components: {
    upChart,
    userChart
  },
  data () {
    return {

    }
  }

}
</script>

<style>

</style>
