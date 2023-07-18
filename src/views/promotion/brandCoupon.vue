<template>
	<div class="app-container">

		<div class="filter-container">
			<el-input
				v-model="listQuery.id" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店ID"
			/>
			<el-input
				v-model="listQuery.name" clearable size="small" class="filter-item"
				style="width: 200px;"
				placeholder="请输入门店名称"
			/>
			<el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">
				查找
			</el-button>
		</div>

		<el-table
			v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中..."
			border fit
			highlight-current-row
		>

			<el-table-column align="center" min-width="90px" label="门店ID" prop="id" sortable />

			<el-table-column align="center" min-width="140px" label="门店名称" prop="name" />

			<el-table-column align="center" min-width="100px" property="picUrl" label="门店图片">
				<template slot-scope="scope">
					<img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="80">
				</template>
			</el-table-column>

			<el-table-column align="center" min-width="110px" label="门店电话" prop="phone" />

			<el-table-column align="center" min-width="270px" label="介绍" prop="desc" />

			<el-table-column align="center" min-width="60px" label="最低消费价格" prop="floorPrice" />

			<el-table-column align="center" prop="brandgenre" label="门店类型">
				<template slot-scope="scope">
					{{ scope.row.brandgenreName }}
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="chooseBrand(scope.row)">选择</el-button>
				</template>
			</el-table-column>

		</el-table>

		<Pagination
			v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList"
		/>
	</div>
</template>

<script>
import { listBrand, listCatAndAdmin } from '@/api/business/brand'
import { getUserInfo } from '@/api/login'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
	name: 'BrandCouponList',
	components: { Pagination },
	data() {
		return {
			list: [],
			total: 0,
			listLoading: false,
			listQuery: {
				page: 1,
				limit: 20,
				id: undefined,
				name: undefined,
				sort: 'add_time',
				order: 'desc'
			}
		}
	},
	created() {
		this.getRoles()
		// this.getList()
		// this.init()
	},
	methods: {
		getRoles() {
			getUserInfo(getToken())
				.then((response) => {
					if (response.data.roles[0] === '超级管理员') {
						this.getList()
						this.init()
					} else if (response.data.roles[0] === '会员商户') {
						this.$router.push({ name: 'coupon' })
					}
				})
				.catch()
		},
		getList() {
			this.listLoading = true
			listBrand(this.listQuery)
				.then((response) => {
					this.list = response.data.items
					this.total = response.data.total
					this.listLoading = false
				})
				.catch(() => {
					this.list = []
					this.total = 0
					this.listLoading = false
				})
		},

		init() {
			listCatAndAdmin().then((response) => {
				this.categoryList = response.data.categoryList
				this.adminList = response.data.adminList
			})
		},

		handleFilter() {
			this.listQuery.page = 1
			this.getList()
		},

		chooseBrand(row) {
			this.$router.push({ name: 'brandCouponShow', query: { id: row.id } })
		}
	}
}
</script>
