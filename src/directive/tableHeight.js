import Vue from 'vue'

// v-tableHeight: table自适应高度
Vue.directive('tableHeight', {
	update(el, binding) {
		function changeElHeight() {
			let height = 0
			if (!binding.value) {
				const navbarHeight = 50 * (document.documentElement.clientWidth / 1920) + 10
				const tabsHeight = 50
				const searchHeight = document.querySelector('.app-container>.filter-container') ? document.querySelector('.app-container>.filter-container').offsetHeight : 0
				// const pageHeight = document.querySelector('.app-container>.pagination-container') ? 75 : 20
				// const pageHeight = document.querySelector('.app-container>.pagination-container') ? document.querySelector('.app-container>.pagination-container').offsetHeight : document.querySelector('.flexColumnPageWrap>.pagination-container') ? document.querySelector('.flexColumnPageWrap>.pagination-container').offsetHeight : 20
				// const pageHeight = document.querySelector('.app-container>.pagination-container') ? 55 : document.querySelector('.flexColumnPageWrap>.pagination-container') ? 55 : 20
				const pageHeight = document.querySelector('.app-container>.pagination-container') ? 75 : 25
				const otherHeight = document.querySelector('.app-container>.other-container') ? document.querySelector('.app-container>.other-container').offsetHeight : 0
				const toolsHeight = document.querySelector('.app-container>.table-tools') ? document.querySelector('.app-container>.table-tools').offsetHeight : 0
				height = navbarHeight + tabsHeight + searchHeight + pageHeight + otherHeight + toolsHeight
				// console.log(searchHeight, pageHeight, otherHeight, toolsHeight)
			} else {
				height = binding.value
			}
			el.style.height = `${window.innerHeight - height > 230 ? window.innerHeight - height : 230}px`
		}
		changeElHeight()
		window.onresize = () => {
			changeElHeight()
		}
	}
})
