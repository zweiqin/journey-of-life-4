<template>
	<div v-show="!!total" :class="{ hidden }" class="pagination-container">
		<el-pagination
			:background="background"
			:current-page.sync="currentPage"
			:page-size.sync="pageSize"
			:layout="layout"
			:total="total"
			v-bind="$attrs"
			:page-sizes="pageSizes"
			:small="small"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'

export default {
	name: 'Pagination',
	props: {
		total: {
			required: true,
			type: Number
		},
		page: {
			type: Number,
			default: 1
		},
		limit: {
			type: Number,
			default: 20
		},
		pageSizes: {
			type: Array,
			default() {
				// return [10, 20, 30, 50]
				return [10, 20, 30, 40, 50, 100, 10000]
			}
		},
		layout: {
			type: String,
			default: 'total, sizes, prev, pager, next, jumper'
		},
		background: {
			type: Boolean,
			default: true
		},
		small: {
			type: Boolean,
			default: false
		},
		autoScroll: {
			type: Boolean,
			default: true
		},
		hidden: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		currentPage: {
			get() {
				return this.page
			},
			set(val) {
				this.$emit('update:page', val)
			}
		},
		pageSize: {
			get() {
				return this.limit
			},
			set(val) {
				this.$emit('update:limit', val)
			}
		}
	},
	methods: {
		handleSizeChange(val) {
			this.$emit('pagination', { page: this.currentPage, limit: val })
			if (this.autoScroll) {
				scrollTo(0, 800)
			}
		},
		handleCurrentChange(val) {
			this.$emit('pagination', { page: val, limit: this.pageSize })
			if (this.autoScroll) {
				scrollTo(0, 800)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.pagination-container {
	position: relative;
	// height: 25px;
	// margin-bottom: 10px;
	// margin-top: 15px;
	padding: 20px 20px 0 20px !important;
  background: #fff;
}
.pagination-container.hidden {
  display: none;
}

.pagination-container .el-pagination {
	float: right;
	// right: 0;
	// position: absolute;
}
</style>
