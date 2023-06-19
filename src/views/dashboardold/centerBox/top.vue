<template>
  <div class="base">
    <div class="maindivitem">
      <titleNumber :name="'成交总金额(元)'" :parameter="number[0]" :fontsize="35" />
    </div>
    <titleNumber :name="'销售数量'" :parameter="number[1]" class="divitem" />
    <titleNumber :name="'销售金额'" :parameter="number[2]" class="divitem" />
    <titleNumber :name="'销售人数'" :parameter="number[3]" class="divitem" />
    <titleNumber :name="'人均消费'" :parameter="number[4]" class="divitem" />
    <titleNumber :name="'累计进店'" :parameter="number[5]" class="divitem" />
    <titleNumber :name="'活动次数'" :parameter="number[6]" class="divitem" />
    <titleNumber :name="'业绩达标率'" :parameter="number[7]" class="divitem" />
    <titleNumber :name="'热销产品数'" :parameter="number[8]" class="divitem" />

  </div>
</template>

<script>
import titleNumber from './../components/titleNumber.vue'
export default {
  components: {
    titleNumber
  },
  data () {
    return {
      number: []
    }
  },
  mounted () {
    for (let index = 0; index < 29; index++) {
      this.number.push((Math.random() * 100).toFixed(0))
    }
  }
}
</script>

<style scoped>
.base {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.maindivitem {
  height: 50%;
  width: 100%;
}
.divitem {
  height: 25%;
  width: 25%;
}
</style>
