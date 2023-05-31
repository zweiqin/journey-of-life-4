<template>
  <div>
    <div class="goods-message">
      <div class="title">{{ title }}</div>
      <div class="lists">
        <p>
          <span>商品编号：{{ content.goodsSn || '--' }}</span>
        </p>
        <p>
          <span>商品名称：{{ content.goodsName || '--' }}</span>
        </p>
      </div>
      <div class="footer" @click="handleDetail({ id: content.id })">
        <span>
          点击此处查看商品详情
        </span>
      </div>
    </div>
    <!-- 商品详情查看组件 -->
    <DetailModal ref="DetailModal" />
  </div>
</template>

<script>
import DetailModal from './DetailModal'
export default {
  name: 'Message',
  components: { DetailModal },
  props: {
    content: {
      // type: [String, Number]
      type: [ Object ]
    }
  },
  data() {
    return {
      title: '',
      record: []
    }
  },
  created() {
    this.title = '商品信息：'
  },
  methods: {
    handleDetail(row) {
      this.$refs.DetailModal && this.$refs.DetailModal.handleOpen(row)
    }
  }
}
</script>

<style lang="scss" scoped>
/* 会话记录消息 */
.goods-message {
  width: 200px;
  // min-height: 95px;
  max-height: 150px;
  border-radius: 3px;
  background-color: white;
  padding: 3px 10px;
  // cursor: pointer;
  box-shadow: 0 0 5px 0px #e8e4e4;
  text-align: left;
  user-select: none;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #3b3b3b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
  }

  .lists p {
    height: 18px;
		padding-left: 10px;
    line-height: 18px;
    font-size: 10px;
    color: #696565;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 100;
  }

  .footer {
    height: 32px;
    line-height: 35px;
    color: #0897f7;
    border-top: 1px solid #f1ebeb;
    font-size: 12px;
    // margin-top: 12px;
    font-weight: 300;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  cursor: pointer;
  }

  &:hover {
    box-shadow: 0 0 5px 0px #cac6c6;
  }
}
</style>
