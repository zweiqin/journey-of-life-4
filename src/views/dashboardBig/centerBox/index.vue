<template>
	<div
		:style="{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-around',
			alignItems: 'center'
		}"
	>
		<div
			:style="{
				width: '100%',
				height: '58%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: '5px',
				background: '#031255',
				border: '0.25px solid #00D4FE',
				boxShadow: 'inset 0px 0px 5px 0px #FFFFFF'
			}"
			class="map"
		>
			<Cmap />
		</div>
		<div
			:style="{
				width: '100%',
				height: '40%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}"
		>
			<Bottom />
		</div>
	</div>
</template>

<script>
import bottom from './bottom.vue'
import cmap from './map.vue'
import { getUserInfo } from '@/api/login'
import { getToken } from '@/utils/auth'
export default {
	components: {
		Bottom: bottom,
		Cmap: cmap
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
		// this.getRoles()
	},
	methods: {
		// getRoles () {
		//   getUserInfo(getToken())
		//     .then(response => {
		//       this.role = response.data.roles[0] !== '超级管理员'
		//     })
		//     .catch()
		// }
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
.map{

}
</style>
