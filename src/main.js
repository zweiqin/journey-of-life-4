import Vue from 'vue'

// import Cookies from 'js-cookie'
import './styles/reset.scss'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '@/styles/dts.scss'

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js' // 权限判断指令

import 'default-passive-events'// 解决警告

/* 引入公共js,如果是不同作者的js请分开文件分开引入！！！*/

import common from '@/assets/js/common.js'
Vue.prototype.common = common
import './directive/tableHeight'

// Vue.use(Element, {
//   size: Cookies.get('size') || 'medium', // set element-ui default size
//   i18n: (key, value) => i18n.t(key, value)
// })
Vue.directive('permission', permission)

// register global utility filters.
Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 富文本组件上传图片公用方法
import { createStorage } from '@/api/business/storage'
new Vue({
	el: '#app',
	router,
	store,
	i18n,
	data() {
		return {
			dh: this.divh(1),
			dw: this.divw(1),
			// title: '看板管理系统'
			// sidebarLogoimg: require('@/assets/logo/smilLOGO.jpg'),

			// sidebarimg: `url(${require('@/assets/menubg.jpg')})`,
			// sidebarimg: ``,

			// loginimg: require('@/assets/logo/smilsoft.png')

			// ZLWimg: `url(${require('@/assets/logo/ZLW.png')})`
			editorInit: {
				language: 'zh_CN',
				convert_urls: false,
				plugins: [ 'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount' ],
				toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'],
				// contextmenu: 'align backcolor blockformats bold codeformat copy cut forecolor formats fontformats fontsizes italic language lineheight newdocument paste redo removeformat selectall strikethrough subscript superscript underline undo visualaid | a11ycheck | code | advtablesort advtablerownumbering | anchor | restoredraft | casechange | charmap | checklist | code | codesample | addcomment deleteallconversations showcomments | emoticons | export | fullpage | fullscreen | help | hr | image | insertdatetime | link openlink unlink | media | nonbreaking | pagebreak | pageembed | pastetext | configurepermanentpen permanentpen | preview | print | searchreplace | spellchecker spellcheckerlanguage | inserttable inserttabledialog tableprops deletetable cell tablemergecells tablesplitcells tablecellprops column tableinsertcolumnbefore tableinsertcolumnafter tablecutcolumn tablecopycolumn tablepastecolumnbefore tablepastecolumnafter tabledeletecolumn row tableinsertrowbefore tableinsertrowafter tablecutrow tablecopyrow tablepasterowbefore tablepasterowafter tablerowprops tabledeleterow tableclass tablecellclass tablecellvalign tablecellborderwidth tablecellborderstyle tablecaption tablecellbackgroundcolor tablecellbordercolor tablerowheader tablecolheader | template | insertfile | toc | visualblocks | visualchars | wordcount',
				contextmenu: 'copy cut paste | link image inserttable | cell row column deletetable',
				images_upload_handler(blobInfo, success, failure) {
					const formData = new FormData()
					formData.append('file', blobInfo.blob())
					createStorage(formData).then((res) => {
						// 修改拼接key
						success(process.env.BASE_API + '/storage/fetch/' + res.data.data.url)
						// 没修改url之前
						// success(res.data.data.url)
						// console.log(process.env.BASE_API + '/storage/fetch/' + res.data.data.url)
					})
						.catch(() => {
							failure('上传失败，请重新上传')
						})
				}
			}
		}
	},
	beforeCreate() {
		Vue.prototype.$bus = this
	},
	beforeUnmount() {
		// 组件销毁前移除监听
		window.removeEventListener('resize', this.setDwDh)
	},
	mounted() {
		// 监听窗口大小改变图表大小(先移除再监听，防止出错)
		window.removeEventListener('resize', this.setDwDh)

		window.addEventListener('resize', this.setDwDh)
	},
	methods: {
		setDwDh() {
			this.dh = this.divh(1)
			this.dw = this.divw(1)
		},
		divw(res) {
			const clientWidth = document.documentElement.clientWidth
			if (!clientWidth) return
			const fs = clientWidth / 1920
			return res * fs
		},
		divh(res) {
			const clientHeight = document.documentElement.clientHeight
			if (!clientHeight) return
			const fs = clientHeight / 1080
			return res * fs
		}
	},
	render: (h) => h(App)

})
