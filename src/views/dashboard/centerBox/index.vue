<template>
	<!-- <div class="TXBJL">
		<div :style="bgimg">
		<top />
		</div>
		<div :style="bgimg2">
		<bottom />
		</div>
		</div> -->
	<div v-if="role" class="TXBJL">
		<div :style="bgimg">
			<Top />
		</div>
		<div :style="bgimg2">
			<Bottom />
		</div>
	</div>
	<div v-else class="TXBJL">
		<div :style="bgimg3">
			<Center />
		</div>
	</div>
</template>

<script>
import bottom from './bottom.vue'
import top from './top.vue'
import center from './center.vue'
import { getUserInfo } from '@/api/login'
import { getToken } from '@/utils/auth'
export default {
	components: {
		Bottom: bottom,
		Top: top,
		Center: center
	},
	data() {
		return {
			role: '',
			number: [],
			bgimg: {
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				backgroundImage: `url(${require('@/assets/divbg.png')})`,
				borderRadius: 30 * this.$root.dw + 'px',
				background: `rgba(91, 77, 230, 1)`,
				backgroundSize: '100% 100%',
				padding: 20 * this.$root.dw + 'px',
				color: '#fff',
				width: '98%',
				height: '40%'
			},
			bgimg2: {
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				// backgroundImage: `url(${require('@/assets/divbg.png')})`,
				borderRadius: 30 * this.$root.dw + 'px',
				background: `rgba(255, 255, 255, 0.1)`,
				backgroundSize: '100% 100%',
				padding: 20 * this.$root.dw + 'px',
				color: '#fff',
				width: '98%',
				height: '55%'
			},
			bgimg3: {
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				borderRadius: 30 * this.$root.dw + 'px',
				background: `rgba(255, 255, 255, 0.1)`,
				backgroundSize: '100% 100%',
				padding: 20 * this.$root.dw + 'px',
				color: '#fff',
				width: '98%',
				height: '97%'
			}
		}
	},
	mounted() {
		for (let index = 0; index < 29; index++) {
			this.number.push((Math.random() * 100).toFixed(0))
		}
	},
	created() {
		this.getRoles()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					this.role = response.data.roles[0] !== '超级管理员'
				})
				.catch()
		}
	}
}
</script>

<style scoped>
.TXBJL {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  /* background: #fff;
  color: #fff; */
}
</style>
