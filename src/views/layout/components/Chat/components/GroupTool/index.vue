<template>
  <div>
    <GroupFile ref="groupFileRef" :group-tool="groupTool"></GroupFile>
    <GroupNotice ref="groupNoticeRef" :group-tool="groupTool"></GroupNotice>
    <GroupAlbum ref="groupAlbumRef" :group-tool="groupTool"></GroupAlbum>
    <GroupInvite ref="groupInviteRef" :group-tool="groupTool"></GroupInvite>
    <GroupMemberManage ref="groupMemberManageRef" :group-tool="groupTool"></GroupMemberManage>
    <GroupEdit ref="groupEditRef" :group-tool="groupTool"></GroupEdit>
  </div>
</template>

<script>
import GroupFile from './components/GroupFile'
import GroupNotice from './components/GroupNotice'
import GroupAlbum from './components/GroupAlbum'
import GroupInvite from './components/GroupInvite'
import GroupMemberManage from './components/GroupMemberManage'
import GroupEdit from './components/GroupEdit'
export default {
  name: 'GroupTool',
  components: {
    GroupFile,
    GroupNotice,
    GroupAlbum,
    GroupInvite,
    GroupMemberManage,
    GroupEdit
  },
  props: {
    groupTool: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {
    init() {
      switch (this.groupTool.type) {
        case 'group_file':
          this.$refs.groupFileRef.init()
          break
        case 'group_notice':
          this.$refs.groupNoticeRef.init()
          break
        case 'group_album':
          this.$refs.groupAlbumRef.init()
          break
        case 'group_invite':
          this.$refs.groupInviteRef.init()
          break
        case 'group_member_manage':
          this.$refs.groupMemberManageRef.init()
          break
        case 'group_edit':
          this.$refs.groupEditRef.init()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

