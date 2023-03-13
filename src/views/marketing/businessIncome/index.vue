<template>
  <div>
    1232
    <cs
      :name="'标题'"
      :parameter="number"
    />
  </div>
</template>

<script>
import cs from '@/components/titleNumber'
export default {
  components: {
    cs
  },
  data () {
    return {
      number: (Math.random() * 100).toFixed(2)
    }
  }
}
</script>

<style>
</style>
