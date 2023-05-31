<script>
import Message from './components/Message'
export default {
  // 组件的name必须以lemonMessage开头，后面跟上 Message.type
  name: 'LemonMessageOrder',
  components: {
    Message
  },
  // 如果需要使用父组件的方法，可以使用注入。
  inject: [ 'IMUI' ],
  inheritAttrs: false,
  render() {
    // lemon-message-basic 组件对气泡框、头像、事件等信息进行了公共的处理。
    // "main": "dist/index.umd.min.js", // props={{ ...this.$attrs }}
    // console.log(this.$attrs)
    return (
      <lemon-message-basic
        class="lemon-message-order"
        message={ this.$attrs.message }
        reverse={ this.$attrs.reverse }
        hideTime={ this.$attrs.hideTime }
        hideName={ this.$attrs.hideName }
        timeFormat={ this.$attrs.timeFormat }
        scopedSlots={{
          content: (props) =>
            // 返回HTML结构
            <message content={props.content}></message>

        }}
      />
    )
  }
}
</script>

<style lang="scss">
.lemon-message.lemon-message-order {
  user-select: none;

  .lemon-message__content {
    border: 2px dashed #ceec5f;
    font-size: 12px;
    // cursor: pointer;
		white-space: normal;

    &::before {
      display: none;
    }
  }
}
</style>
