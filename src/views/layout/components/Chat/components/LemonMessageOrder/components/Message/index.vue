<template>
  <div>
    <div class="order-message">
      <div class="title">{{ title }}</div>
      <div class="lists">
        <p>
          <span>订单编号：{{ content.orderSn || '--' }}</span>
        </p>
        <p>
          <span>订单状态：{{ content.orderStatusText || '--' }}</span>
        </p>
        <p>
          <span>商品总费用：{{ content.goodsPrice || '--' }}</span>
        </p>
        <p>
          <span>实付费用：{{ content.actualPrice || '--' }}</span>
        </p>
        <p>
          <span>收货人手机号：{{ content.mobile || '--' }}</span>
        </p>
      </div>
      <div class="footer">
        <span>
          <a class="linkClass" :href="`./#/orderManagement/orderDetail?id=${content.id}`" target="_blank">
            点击此处查看订单详情
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    content: {
      type: [String, Number]
    }
  },
  data() {
    return {
      title: '',
      record: []
    }
  },
  created() {
    this.title = '订单信息：'
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
/* 会话记录消息 */
.order-message {
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
  }

  &:hover {
    box-shadow: 0 0 5px 0px #cac6c6;
  }
}
</style>
