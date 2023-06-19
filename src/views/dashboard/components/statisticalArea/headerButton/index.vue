<template>
	<div class="Analysis_head">
		<span :class="[ { small: type === 'small' } ]">{{ headerData.name }}</span>
		<div v-if="headerData.list">
			<a
				v-for="(item, index) in headerData.list"
				:key="item"
				href="javascript:;"
				:class="{ isActice: index === AnyDataIndex }"
				@click="(ev) => { switchData(index);onNavClick(ev, index) }"
			>
				{{ item }}
			</a>
		</div>
	</div>
</template>

<script>
//  on-click={{(ev) => { switchData(index); onNavClick(index, ev); }}}
// eslint-disable-next-line no-empty-function
function noop() {}
export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'TableHeader',
	props: {
		type: {
			type: String,
			default: 'normal'
		},
		headerData: Object,
		onNavClick: {
			type: Function,
			default: noop
		}
	},
	data() {
		return {
			AnyDataIndex: 0
		}
	},
	methods: {
		switchData(index) {
			// console.log(this.$props)
			this.AnyDataIndex = index
			// eslint-disable-next-line vue/require-explicit-emits, vue/custom-event-name-casing
		}
	}
}
</script>

<style lang="scss">
/* 分析图的表头 */
.Analysis_head {
  width: 100%;
  height: 1.4063vw;
  display: flex;
  justify-content: space-between;
  font-family: 思源黑体;
  .small {
    font-size: 0.9375vw;
    font-weight: 600;
    line-height: 1.375vw;
    color: #141736;
  }
  > span {
    font-size: 1.0417vw;
    font-weight: 600;
    line-height: 1.375vw;
    color: #141736;
  }
  > div {
    width: 10.3125vw;
    height: 1.4583vw;
    display: flex;
    justify-content: space-between;
    > a {
      border-radius: 0.2083vw;
      display: block;
      text-align: center;
      line-height: 1.4583vw;
      flex: 1;
      font-size: 0.7292vw;
      font-weight: 540;
      letter-spacing: 0em;
      color: #424e66;
    }
    > a:hover {
      color: #0519d4;
    }
    .isActice {
      color: #0519d4;
      background-color: rgba(77, 112, 255, 0.08);
    }
  }
}
</style>
