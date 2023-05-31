<template>
  <div class="drawer-content">
    <div class="slot-group">
      <div style="cursor: pointer;" @click="handleOpenGroupTool('group_notice', contact)">
        <div class="slot-group-title">聊天室公告</div>
        <i class="el-icon-arrow-right" style="float:right"></i>
        <el-tooltip class="item" effect="light" placement="right-start" offset="10">
          <div
            slot="content"
            class="group-notice"
            style="font-size:14px"
            v-html="contact.introduction"
          ></div>
          <div class="slot-group-notice" v-html="contact.introduction"></div>
        </el-tooltip>
      </div>
      <div
        class="slot-group-title"
        style="border-top: 1px solid #999;padding-top:10px;margin-bottom:10px"
      >
        聊天室成员({{ contact.member_total }})
      </div>
      <div class="slot-group-panel" style="height: 449px;overflow: auto;">
        <div v-for="(item, index) in contact.group_member" :key="index" class="slot-group-member">
          <img
            :src="item.avatar"
            alt
            style="width:30px;height:30px;border-radius:20%;margin-right:3px;ver"
          />
          <span>{{ item.desc }}</span>
          <svg-icon
            v-if="item.level == 0"
            icon-class="lord"
            style="width:1.8em;height:1.8em;float:right;margin-top:5px"
          ></svg-icon>
          <svg-icon
            v-if="item.level == 1"
            icon-class="manager"
            style="width:1.8em;height:1.8em;float:right;margin-top:5px"
          ></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupDrawer',
  props: {
    contact: {
      type: Object
    }
  },
  data() {
    return {
      title: '',
      content: ''
    }
  },
  methods: {
    handleOpenGroupTool() {
      this.title = this.contact.displayName
      this.content = this.contact.introduction
      this.$alert(this.content, this.title, {
        customClass: 'msgBox',
        dangerouslyUseHTMLString: true
      })
    }
  }
}
</script>

<style>
.msgBox {
  width: 35%;
}
</style>

