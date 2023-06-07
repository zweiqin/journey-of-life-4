<template>
	<div
		:style="showwebh"
		class="base"
	>
		<LeftBox style="width:30%;height:100%;" />
		<CenterBox style="width:45%;height:100%" />
		<RightBox style="width:30%;height:100%" />
	</div>
</template>

<script>
import leftBox from './leftBox'
import centerBox from './centerBox'
import rightBox from './rightBox'
import titleNumber from './components/titleNumber.vue'
export default {
	components: {
		TitleNumber: titleNumber,
		LeftBox: leftBox,
		CenterBox: centerBox,
		RightBox: rightBox
	},
	data() {
		return {
			number: [],
			showwebh: {
				width: '100%',
				// height: 884 * this.$root.dw + 'px',
				height: '100%',
				// backgroundImage: `url(${require('@/assets/bodybg.jpg')})`,
				background: '#2d3968',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			}
		}
	},
	// inject: [
	//   'reload'
	// ],
	mounted() {
		for (let index = 0; index < 29; index++) {
			this.number.push((Math.random() * 100).toFixed(0))
		}
		// 窗口变化时执行的函数
		// window.onresize = () => {
		//   return (() => {
		//     this.reload()
		//   })()
		// }
	}
}
</script>

<style scoped>
.base {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
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
.item {
  width: 30%;
  height: 50%;
  margin-left: 3.3%;
}
</style>
