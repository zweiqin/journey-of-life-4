<template>
	<div class="map">

		<el-dialog
			:before-close="() => $emit('cancel')" :closable="false" :mask-closable="false" :visible="visible"
			:close-on-click-modal="false" :append-to-body="true" title="填写门店地址" width="828px"
		>
			<el-card header="选择地址">
				<div style="display: flex;justify-content: space-between;">
					<div>
						<div class="address">{{ addrContent.address }}</div>
						<div id="map-container"></div>
					</div>

					<div class="search-con">
						<el-input
							id="input-map"
							v-model="mapSearch"
							placeholder="输入关键字搜索"
						/>
						<ul>
							<li
								v-for="(tip, index) in tips"
								:key="index"
								@click="selectAddr(tip.location)"
							>
								<p>{{ tip.name }}</p>
								<p>{{ tip.district + tip.address }}</p>
							</li>
						</ul>
					</div>
				</div>
			</el-card>
			<div slot="footer">
				<!-- <el-button @click="visible = false">取消</el-button> -->
				<el-button @click="$emit('cancel')">取消</el-button>
				<el-button type="primary" :loading="loading" @click="ok">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
// import { getRegion } from "@/api/common.js";

export default {
	name: 'TMap',
	props: { visible: Boolean },
	data() {
		return {
			// visible: false, // modal显隐
			mapSearch: '', // 地图搜索
			map: null, // 初始化地图
			autoComplete: null, // 初始化搜索方法
			geocoder: null, // 初始化地理、坐标转化
			positionPicker: null, // 地图拖拽选点
			tips: [], // 搜索关键字列表
			addrContent: {}, // 回显地址信息
			loading: false // 加载状态
		}
	},
	watch: {
		mapSearch(val) {
			this.searchOfMap(val)
		},
		visible(val) {
			if (val) {
				this.init()
			} else {
				this.map.destroy()
			}
		}
	},
	// mounted() {
	// 	this.init()
	// },
	// updated() {
	// 	console.log(this.visible)
	// 	// 利用map是否为空判断是否初始化地图，如果没初始化重新初始化
	// 	if (this.map === null) {
	// 		this.init()
	// 	}
	// },
	methods: {
		ok() {
			// 确定选择
			this.loading = true
			// const params = {
			// 	cityCode: this.addrContent.regeocode.addressComponent.citycode,
			// 	townName: this.addrContent.regeocode.addressComponent.township
			// }
			// getRegion(params).then((res) => {
			// 	if (res.success) {
			// 		this.addrContent.addr = res.result.name.replace(/,/g, ' ')
			// 		this.addrContent.addrId = res.result.id
			this.loading = false
			// this.visible = false
			this.$emit('cancel')
			console.log(this.addrContent)
			this.$emit('map-confirm', {
				addr: this.addrContent.address,
				lat: this.addrContent.position.lat,
				lng: this.addrContent.position.lng
			})
			// 	}
			// })
		},
		// 初始化地图组件
		init() {
			console.log('init')
			AMapLoader.load({
				key: '3b84da70f85b1024deb934d8835b03ad', // 申请好的Web端开发者Key，首次调用 load 时必填
				version: '', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
				plugins: [
					'AMap.ToolBar',
					'AMap.Autocomplete',
					'AMap.PlaceSearch',
					'AMap.Geolocation',
					'AMap.Geocoder'
				], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
				AMapUI: {
					// 是否加载 AMapUI，缺省不加载
					version: '1.1', // AMapUI 缺省 1.1
					plugins: [ 'misc/PositionPicker' ] // 需要加载的 AMapUI ui插件
				}
			}).then((AMap) => {
				const that = this
				this.map = new AMap.Map('map-container', {
					zoom: 12
				})
				that.map.addControl(new AMap.ToolBar())
				that.map.addControl(new AMap.Autocomplete())
				that.map.addControl(new AMap.PlaceSearch())
				that.map.addControl(new AMap.Geocoder())

				// 实例化Autocomplete
				const autoOptions = {
					city: '全国'
				}
				that.autoComplete = new AMap.Autocomplete(autoOptions) // 搜索
				that.geocoder = new AMap.Geocoder(autoOptions)

				that.positionPicker = new AMapUI.PositionPicker({
					// 拖拽选点
					mode: 'dragMap',
					map: that.map
				})
				that.positionPicker.start()

				/**
           *
           * 所有回显数据，都在positionResult里面
           * 需要字段可以查找
           *
           */

				that.positionPicker.on('success', function (positionResult) {
					that.addrContent = positionResult
				})
			})
				.catch((e) => {})
		},
		searchOfMap(val) {
			// 地图搜索
			const that = this
			this.autoComplete.search(val, function (status, result) {
				// 搜索成功时，result即是对应的匹配数据
				if (status == 'complete' && result.info == 'OK') {
					that.tips = result.tips
				} else {
					that.tips = []
				}
			})
		},
		selectAddr(location) {
			// 选择坐标
			if (!location) {
				// this.$Message.warning('请选择正确点位')
				this.$notify.error({
					title: '失败',
					message: '请选择正确点位'
				})
				return false
			}
			const lnglat = [location.lng, location.lat]
			this.positionPicker.start(lnglat)
		}
	}
}
</script>

<style lang="scss" scoped>
#map-container {
  width: 500px;
  height: 400px;
}

.search-con {
  width: 260px;
  ul {
    width: 260px;
    height: 400px;
    overflow: scroll;
    li {
      padding: 5px;
      p:nth-child(2) {
        color: #999;
        font-size: 12px;
      }
      &:hover {
        background-color: #eee;
        cursor: pointer;
      }
    }
  }
}

.address {
  margin-bottom: 10px;
  // color: $theme_color;
  font-weight: bold;
}
</style>
