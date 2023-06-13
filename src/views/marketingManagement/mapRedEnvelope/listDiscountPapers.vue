<template>
	<div class="app-container">
		<el-table
			v-loading="listLoading" :data="smallRedPackLists" size="small"
			element-loading-text="正在查询中。。。"
			border fit
			highlight-current-row
		>
			<el-table-column align="center" min-width="130px" label="ID" prop="id" sortable />
			<el-table-column align="center" min-width="170px" label="创建时间" prop="createTime" sortable />
			<el-table-column align="center" min-width="100px" label="最后修改时间" prop="updateTime" />
			<el-table-column align="center" min-width="100px" label="发送人ID" prop="publisherId" sortable />
			<el-table-column align="center" min-width="100px" label="红包标识ID" prop="wrapId" sortable />
			<el-table-column align="center" min-width="100px" label="红包金额" prop="wrapMonkey" sortable />
		</el-table>
	</div>
</template>

<script>
import { getCouponList } from '@/api/marketingManagement/mapRedEnvelope'
export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'MapRedEnvelope',
	data() {
		return {
			listLoading: true,
			dialogFormVisible: false,
			smallRedPackLists: []
		}
	},
	created() {
		getCouponList({ }).then((res) => {
			this.smallRedPackLists = res.data
			this.dialogFormVisible = true
			this.listLoading = false
		})
			.catch((err) => {
				window.console.log(err)
			})
	}
}
</script>

<style lang="scss">

</style>
