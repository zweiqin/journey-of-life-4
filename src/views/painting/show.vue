<template>
	<div class="base">
		<Showmenu style="width:100%;height: 10%;" />
		<div class="TXBJW" style="width:100%;height: 30%;">
			<div class="TXBJW " :style="{ width: '100%', margin: '2%' }">
				<div style="width:95%;height:100%">
					<el-carousel :interval="4000" :height="300 * $root.dw + 'px'" :width="800 * $root.dw + 'px'" type="card">
						<el-carousel-item v-for="item, index in banner" :key="index">
							<!-- <router-link :id="index" :to="pathstr[index]">
								</router-link> -->
							<img v-if="item" :src="common.seamingImgUrl(item.img_url)" style="width:100%;height:100%">
						</el-carousel-item>
					</el-carousel>
				</div>
			</div>
		</div>
		<div :style="{ padding: 10 * $root.dw + 'px' }" class="fristdiv">
			<div v-for="value, index in list" :key="list[index].paint_id" :style="{ padding: 20 * $root.dw + 'px' }" class="divitem">
				<el-card :body-style="{ padding: '0px', height: '100%', width: '100%', cursor: 'pointer' }">
					<img
						:src="common.seamingImgUrl(list[index].paint_url)" style="width:100%;height:100%"
						@click="paintClick(value.paint_id)"
					>
					<div class="TXBJW">
						<span>{{ list[index].paint_title }}</span>
						<!-- <div class="bottom clearfix">
							<time class="time">{{ currentDate }}</time>
							<el-button type="text" class="button">操作按钮</el-button>
							</div> -->
					</div>
				</el-card>
			</div>
		</div>

	</div>
</template>

<script>
import { listGet } from '@/api/painting/painting'
import { listGetPicture } from '@/api/painting/picture'
import showmenu from './showmenu.vue'

export default {
	name: 'PaintingShow',
	components: { Showmenu: showmenu },
	data() {
		return {
			banner: [],
			img2: require('@/assets/image/tuanfeng.png'),
			bannerimg: [require('@/assets/image/tfkj.png'), require('@/assets/image/tfkj.png'), require('@/assets/image/tfkj.png')],
			pathstr: ['', '', ''],
			list: [],
			total: 0,
			listLoading: true,
			listLoading2: true,
			listQuery: {
				page: 1,
				limit: 20,
				paint_id: undefined,
				paint_title: undefined,
				sort: 'add_time',
				order: 'asc' // desc倒序
			},
			listQueryImg: {
				page: 1,
				limit: 0,
				paint_id: undefined,
				// img_id: undefined,
				// img_title: undefined,
				sort: 'add_time',
				order: 'asc' // desc倒序
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			listGet(this.listQuery).then((response) => {
				this.list = response.data.items
				this.banner = this.list[0]
				this.listQueryImg.paint_id = this.banner.paint_id
				this.getListImg()
				this.list.splice(0, 1)
				// console.log(this.listQueryImg.paint_id)
				// console.log(response.data.items)
				this.total = response.data.total
				this.listLoading = false
			})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},
		getListImg() {
			this.listLoading2 = true
			listGetPicture(this.listQueryImg).then((response) => {
				this.banner = response.data.items
				// console.log(response.data.items)
				this.listLoading2 = false
			})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading2 = false
				})
		},
		paintClick(id) {
			// const routein = this.$router.resolve({ path: '/' + this.$route.name })
			// console.log(this.$route.name)
			if (this.$route.name === 'paintingshow') {
				this.$router.push({ name: 'pictureShow', query: { id } })
			} else {
				// 方案2 备用需配置
				// console.log(process.env.BASE_SHOWAPI)
				// window.open('http://bus.deyisoft.cn:8889/TFshop/#/pictureShow_out?id=' + id, '_self')
				// 方案1 不需配置
				this.$router.push({ name: 'pictureShow_out', query: { id } })
			}
		}
	}
}
</script>

<style scoped>
.base {
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
}

.el-carousel__item h3 {
	color: #475669;
	font-size: 14px;
	opacity: 0.75;
	line-height: 150px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}

.wmenu>>>.el-button {
	color: #000;
	border-color: rgba(0, 0, 0, 0.8);
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 50px;
	/* transform: scale(2, 2); */
}

.Mytitle {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #ccd9ff;
	font-weight: bold;
}

.TXBJW {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.TXBJL {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.maxdiv {
	width: 100%;
	height: 100%;
}

.fristdiv {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: start;
	align-content: stretch;
	height: 95%;
	width: 95%;
	/* background-color: #3b637a; */
	/* background-color: rgba(52, 65, 76, 1); */
	/* background-color: rgba(47, 47, 57, 0.8); */
}

.divitem {
	width: 25%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
</style>
