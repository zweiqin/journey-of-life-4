<template>
	<div
		:style="{
			backgroundRepeat: 'no-repeat',
			backgroundSize: '101.25% 180%'
		}"
		class="main"
	>
		<HomeTop></HomeTop>
		<Contents></Contents>
	</div>
</template>

<script>
import HomeTop from './components/mainModule/homeTop/HomeTop.vue'
import contents from './components/mainModule/contents/index.vue'
// eslint-disable-next-line vue/require-name-property
export default {
	components: { HomeTop, Contents: contents }

}
</script>

<style lang="scss">
.main {
  background-color: #f4f7fc;
  padding: 0px 24px 16px 16px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
}
</style>
