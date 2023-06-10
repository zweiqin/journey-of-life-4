<template>
	<div>
		优惠卷列表
	</div>
</template>

<script>
import { getCouponList } from '@/api/marketingManagement/mapRedEnvelope'
export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'MapRedEnvelope',
	created() {
		getCouponList({ redId: '3920922439051856168' }).then((res) => {
			window.console.log(res)
		})
			.catch((err) => {
				window.console.log(err)
			})
	}
}
</script>

<style lang="scss">

</style>
