<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="searchID"
				clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="红包ID"
			/>
			<el-input
				v-model="searchName"
				clearable size="mini" class="filter-item"
				style="width: 200px;"
				placeholder="红包简介"
			/>
			<div />
			<!-- 查询结果 -->
			<el-table
				v-loading="listLoading" :data="selectList(searchID, searchName)" size="small"
				element-loading-text="正在查询中。。。"
				border fit
				highlight-current-row
			>
				<el-table-column align="center" min-width="160px" label="功能按钮">
					<template slot-scope="scope">
						<el-button type="primary" @click="selectItemRedPack(scope.row.id)">点击查看小红包</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="150px" label="红包ID" prop="id" sortable />
				<el-table-column align="center" min-width="100px" label="发布用户ID" prop="userId" sortable />
				<el-table-column align="center" min-width="100px" label="发布者名称" prop="publisherName" />
				<el-table-column class-name="small-padding fixed-width" align="center" min-width="120px" prop="brandgenre" label="红包类型">
					<template slot-scope="scope">
						<el-tag :type="scope.row.wrapType === 0 ? 'success' : ''">
							{{ scope.row.wrapType === 0 ? '普通红包' : '携带优惠卷红包' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="经度/纬度" prop="longitude" />
				<el-table-column align="center" min-width="100px" label="模板ID" prop="magicId" />
				<el-table-column align="center" min-width="100px" label="红包个数" prop="redpackNumber" sortable />
				<el-table-column class-name="small-padding fixed-width" align="center" min-width="100px" prop="brandgenre" label="单个红包金额">
					<template slot-scope="scope">
						<el-tag :type="scope.row.isRandom === 0 ? 'success' : ''">
							{{ (scope.row.isRandom === 0 ? '随机' : '定额') + (scope.row.redpackMonkey ? scope.row.redpackMonkey : '') }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="红包总金额" prop="redpackAllmonkey" sortable />
				<el-table-column class-name="small-padding fixed-width" align="center" min-width="300px" prop="brandgenre" label="是否已领取完毕 / 是否已支付">
					<template slot-scope="scope">
						<el-tag>
							{{ scope.row.isIntact === 0 ? '未领取玩' : '已领完' }}
						</el-tag>
						<el-tag v-if="scope.row.isPay === 0">
							已支付
						</el-tag>
						<el-tag v-else type="danger">
							未支付
						</el-tag>
						<!-- 返回的数据暂时没有这个字段因此隐藏    / 是否已过期  -->
						<!-- <el-tag v-if="scope.row.isExpired === 0">
							未过期
							</el-tag>
							<el-tag v-else type="danger">
							已过期
							</el-tag> -->
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="140px" prop="imageUrl" label="红包默认图片">
					<template slot-scope="scope">
						<img v-if="scope.row.imageUrl" :src="common.seamingImgUrl(scope.row.imageUrl)" class="avatar">
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="100px" label="红包默认文字" prop="remark" />
				<el-table-column align="center" min-width="100px" label="红包有效距离" prop="effectiveDistance" />
				<el-table-column align="center" min-width="100px" label="红包订单号" prop="orderNo" />
				<el-table-column align="center" min-width="200px" label="最后更新时间" prop="updateTime" />
				<el-table-column align="center" min-width="220px" label="创建时间 / 过期时间" prop="createTime">
					<template slot-scope="scope">
						<p>{{ scope.row.createTime }}</p>
						<p>{{ scope.row.expirationTime }}</p>
					</template>
				</el-table-column>
			</el-table>
			<!-- <Pagination
				v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
				@pagination="selectFromData"
				/> -->
		</div>
		<el-dialog title="小红包详情" :visible.sync="dialogFormVisible">
			<el-table
				v-loading="listLoading" :data="smallRedPackLists" size="small"
				element-loading-text="正在查询中。。。"
				border fit
				highlight-current-row
			>
				<el-table-column align="center" min-width="130px" label="123" prop="id" sortable />
				<el-table-column align="center" min-width="170px" label="创建时间" prop="createTime" sortable />
				<el-table-column align="center" min-width="100px" label="最后修改时间" prop="updateTime" />
				<el-table-column align="center" min-width="100px" label="发送人ID" prop="publisherId" sortable />
				<el-table-column align="center" min-width="100px" label="红包标识ID" prop="wrapId" sortable />
				<el-table-column align="center" min-width="100px" label="红包金额" prop="wrapMonkey" sortable />
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getRedEnvelopeListData, getSmallRedList } from '@/api/marketingManagement/mapRedEnvelope'
export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'MapRedEnvelope',
	components: { Pagination },
	data() {
		return {
			listLoading: false,
			dialogFormVisible: false,
			searchID: '',
			searchName: '',
			list: [ { id: '123', remark: '123' } ],
			smallRedPackLists: [],
			total: 0,
			listQuery: {
				redId: '',
				page: 1,
				limit: 5
			}
		}
	},
	created() {
		// getRedEnvelopeListData().then((res) => {
		// 	window.console.log(res)
		// })
		// 	.catch((err) => {
		// 		window.console.log(err)
		// 	})
		// getSmallRedList({ redId: '2875041159792643963' }).then((res) => {
		// 	window.console.log(res)
		// })
		// 	.catch((err) => {
		// 		window.console.log(err)
		// 	})
		// getCouponList({ redId: '2875041159792643963' }).then((res) => {
		// 	window.console.log(res)
		// })
		// 	.catch((err) => {
		// 		window.console.log(err)
		// 	})
		this.getDataList()
	},
	methods: {
		getDataList() {
			this.listLoading = true
			getRedEnvelopeListData().then((res) => {
				this.list = res.data
				this.total = res.data.total || 0
				this.listLoading = false
			})
				.catch((err) => {
					window.console.log(err)
				})
		},
		selectFromData() {
			alert('点几把，还没开发完呢！！')
		},
		// 手动搜索
		selectList(search, searchName) {
			// eslint-disable-next-line array-callback-return
			return this.list.filter((item) => {
				// 如果postList(title)包含search(输入框) => true
				if (item.id.includes(search) && item.remark.includes(searchName)) {
					// 返回item
					return item
				}
			})
		},
		rowHandleFilter(row) {
			getSmallRedList({ redId: row.id })
		},
		selectItemRedPack(id) {
			getSmallRedList({ redId: id }).then((res) => {
				this.smallRedPackLists = res.data
				this.dialogFormVisible = true
			})
				.catch((err) => {
					console.log(err)
				})
		}
	}
}
</script>

<style lang="scss">
.avatar {
	width: 120px;
	height: 60px;
	display: block;
}
</style>
