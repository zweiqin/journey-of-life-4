<!-- eslint-disable vue/no-undef-properties -->
<template>
	<!-- 统计区 -->
	<div class="statisticsHeader">
		<p>统计区</p>
		<div class="dataBox">
			<!-- 会员统计 -->
			<div v-for="item in dataBoxList" :key="item.name" class="dataBox_item">
				<div v-if="item.isDanger" class="isDanger animation-flash"></div>
				<el-tooltip effect="light" :content="item.dagerText" placement="top">
					<img v-if="item.isDanger" style="display: block" src="@/assets/home/danger.png" alt="" srcset="" class="dangerIcon animate__animated animate__tada" @click="$router.push({ path: item.routerPath })" />
				</el-tooltip>
				<div class="item_header">
					<div><img :src="item.imgSrc" alt="" /></div>
					<span>{{ item.name }}</span>
				</div>
				<div class="item_footer">
					<div v-for="childItem in item.childName" :key="childItem.key">
						<p>{{ childItem.name }}</p>
						<p>{{ item.data[childItem.key] ? item.data[childItem.key] : '0.00' }}</p>
					</div>
				</div>
			</div>
			<!-- 商家代金卷排行 -->
			<div class="dataBox_item">
				<TableHeader type="small" :header-data="volumeRanking" :on-nav-click="getVoucherRankings"></TableHeader>
				<div class="item_footer">
					<div v-for="(item, index) in VoucherRankingsTop" :key="item.id">
						<p>第{{ index + 1 }}名</p>
						<img :src="item.avatar" class="RingkingImg" @error="handleImageError($event, item)">
						<p style="margin-top:0">{{ item.voucher }}</p>
					</div>
				</div>
			</div>
			<el-dialog
				v-show="openRaking"
				title="代金卷排行详情"
				:visible.sync="openRaking"
				width="80%"
			>
				<el-table
					v-loading="listLoading" :data="VoucherRankings" size="small" element-loading-text="正在查询中。。。"
					border fit
					highlight-current-row
				>
					<el-table-column align="center" min-width="30px" max-width="40px" label="ID" prop="id" sortable />
					<el-table-column align="center" min-width="30px" max-width="40px" label="头像" prop="nickname">
						<template slot-scope="scope">
							<img :src="scope.row.avatar" alt="" style="width: 3.125vw;height:3.125vw;" @error="handleImageError($event, scope.row)">
						</template>
					</el-table-column>
					<el-table-column align="center" min-width="30px" max-width="40px" label="nickName" prop="nickname" />
					<el-table-column align="center" min-width="30px" max-width="40px" label="销售额" prop="voucher" />
					<el-table-column align="center" min-width="30px" max-width="40px" label="roleIds" prop="roleIds" />
				</el-table>
				<Pagination
					v-show="total > 0" :total="total" :page.sync="querList.page" :limit.sync="querList.size"
					@pagination="getVoucherRankings()"
				/>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { renderData } from './'
import TableHeader from '../../statisticalArea/headerButton'
import { getStatisticsMemberCount, getStatisticsOrderCount, getStatisticsFinanceCount, getSVoucherCount, getCommissionCount, getSCBusinessCount } from '@/api/dashboard'
export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'HomeTop',
	components: { TableHeader, Pagination },
	// eslint-disable-next-line vue/require-prop-types
	props: [],
	data() {
		return {
			openRaking: false,
			listLoading: true,
			total: 0,
			querList: {
				page: 1,
				size: 10
			},
			volumeRanking: { name: '代金卷排行',
				list: [ '查看排名详情' ] },
			title: 'hellow',
			renderData,
			everyRequest: [getStatisticsMemberCount(),
				getStatisticsOrderCount(),
				getStatisticsFinanceCount(),
				getSVoucherCount(),
				getCommissionCount()],
			VoucherRankings: [],
			VoucherRankingsTop: []
		}
	},
	computed: {
		// 在此处转化一次，将数据中出现错误的数据进行筛选，比如代金卷的购买金额和发行金额为2 : 1 因此需要进一步判断，再做出渲染
		dataBoxList: {
			get() {
				const arr = this.renderData.map((item, index) => {
					if (item.name === '代金卷统计' && ((item.childName[0].value !== (item.childName[0].value * 2)) || (item.childName[1].value !== (item.childName[3].value * 2)))) {
						item.isDanger = true
					}
					return item
				})
				return arr
			}
		}
	},
	// eslint-disable-next-line no-empty-function
	created() {
		try {
			Promise.all(this.everyRequest).then((res) => {
				res.forEach((item, index) => {
					this.$set(this.renderData, index, { ...this.renderData[index], data: item.data })
				})
				// console.log(this.renderData)
			})
				.catch((err) => {
					throw new Error(err)
				})
			this.getVoucherRankings()
			getSCBusinessCount().then((res) => {
				this.VoucherRankingsTop = res.data.limit.slice(0, 3)
				// window.console.log(this.VoucherRankings)
			})
		} catch (error) {
			this.$notify.error({
				title: '失败',
				message: `${error},请求数据错误，请重试或联系管理员`
			})
		}
	},
	methods: {
		getVoucherRankings(index = null, ev = null) {
			// eslint-disable-next-line no-unused-vars
			index === 0 ? this.openRaking = true : false
			getSCBusinessCount(this.querList).then((res) => {
				// console.log(res)
				this.VoucherRankings = res.data.limit
				this.total = res.data.total
				this.listLoading = false
				// window.console.log(this.VoucherRankings)
			})
		},
		// 图片加载错误时使用默认头像
		handleImageError(ev, item) {
			item.avatar = require('@/assets/home/lujing.png')
		}
	}
}
</script>

<style lang="scss" scope>
.el-dialog__body {
  padding: 3.125vw 1.5625vw !important;
}
.statisticsHeader {
  padding: 20px 32px;
  font-family: 思源黑体;
  width: 100%;
  height: 25.625vw;
  background-color: #ffffff;
  > p {
    font-size: 1.0417vw;
    font-weight: 500;
    line-height: 1.25vw;
    letter-spacing: 0em;
    color: #141736;
  }
  .dataBox {
    margin-top: 30px;
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    flex-wrap: wrap;
    .dataBox_item {
      position: relative;
      padding: 0.7813vw;
      width: 30.8%;
      height: 9.1667vw;
      border-radius: 0.6944vw;
      background: #f7f8fa;
      /* 每个数据块的头部图标和文字 */
      .item_header {
        display: flex;
        align-items: center;
        > div {
          width: 2.8125vw;
          height: 2.8125vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border-radius: 50%;
          > img {
            width: 1.4583vw;
            height: 1.4583vw;
          }
        }
        > span {
          margin-left: 13px;
          font-size: 0.9375vw;
          font-weight: 600;
          line-height: 1.0417vw;
          color: #141736;
        }
      }
      /* 每个显示数据的块级 */
      .item_footer {
        margin-top: 0.7292vw;
        display: flex;
        height: 3.5417vw;
        > div {
          text-align: center;
          flex: 1;
          > p:nth-of-type(1) {
            font-size: 0.7292vw;
            font-weight: normal;
            line-height: 1.25vw;
            color: #424e66;
          }
          > p:nth-of-type(2) {
            margin-top: 0.6771vw;
            font-size: 1.1458vw;
            font-weight: normal;
            line-height: 1.6146vw;
            color: #141736;
          }
        }
        .RingkingImg {
          margin-top: 3px;
          width: 2.6042vw;
          height: 2.6042vw;
          border-radius: 50%;
        }
      }
      .isDanger {
        position: absolute;
        box-sizing: border-box;
        border-radius: 0.6944vw;
        top: -0.5%;
        left: -0.5%;
        width: 101%;
        height: 101%;
        box-shadow:#ff0000f6 0px 0px 0.8333vw;
        box-shadow: #000;
      }
      .animation-flash {
          animation: myfirst 1.2s linear;
          -webkit-animation: myfirst 1.2s linear;
          animation-iteration-count:infinite;
          -webkit-animation-iteration-count:infinite;
        }
      @keyframes myfirst{
        0%   { opacity:1; }
        25%  { opacity:0.85; }
        50%  { opacity:0.75; }
        75%  { opacity:0.65; }
        100% { opacity:0.25; }
      }
      @-webkit-keyframes myfirst{
        0%   { opacity:1; }
        25%  { opacity:0.85; }
        50%  { opacity:0.65; }
        75%  { opacity:0.65; }
        100% { opacity:0.25; }
      }
      .dangerIcon {
        position: absolute;
        animation-duration: 1.2s;
        animation-delay: 1s;
        animation-iteration-count: infinite;
        top: 1.3889vw;
        right: 1.7361vw;
        width: 1.4583vw;
        height: 1.4583vw;
      }
    }
  }
}
</style>
