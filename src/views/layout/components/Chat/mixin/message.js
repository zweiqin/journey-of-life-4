import { fileByBase64 } from '@/utils/file'
import { uploadPicByBase64 } from '@/api/laboratory/chat_module/upload'
import { generateUUID } from '@/utils/functions'
export default {
  methods: {
    keepLastIndex(obj) {
      if (window.getSelection) {
        obj.focus()
        var range = window.getSelection()
        range.selectAllChildren(obj)
        range.collapseToEnd()
      } else if (document.selection) {
        var range = document.selection.createRange()
        range.moveToElementText(obj)
        range.collapse(false)
        range.select()
      }
    },
    changeDrawer(contact) {
      return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
      const IMUI = this.$refs.IMUI
      if (IMUI.drawerVisible === true) {
        IMUI.closeDrawer()
      } else {
        const params = {
          render: (contact) => <group-drawer contact={contact}></group-drawer>
        }
        params.offsetY = 1
        IMUI.openDrawer(params)
      }
    },
    initMultiMenu() {
      // 初始化多选工具
      var dom = document.createElement('div')
      dom.setAttribute('class', 'multi')
      dom.setAttribute('style', 'display:none')
      dom.innerHTML =
        '<div class="multi-select"><div class="multi-title"><span">已选中：<span id="checkMessage">0</span> 条消息</span></div><div class="multi-main"><div class="btn-group"><div class="multi-icon pointer"  onClick="mergeForward()"><i class="el-icon-position"></i></div><p>合并转发</p></div><div class="btn-group"><div class="multi-icon pointer" onClick="oneByoneForward()"><i class="el-icon-position"></i></div><p>逐条转发</p></div><div class="btn-group"><div class="multi-icon pointer" onclick="multiDeleteContact()"><i class="el-icon-delete"></i></div><p >批量删除</p></div><div class="btn-group"><div class="multi-icon pointer" onClick="closeMulti()"><i class="el-icon-close" ></i></div><p >关闭</p></div></div></div>'
      const that = this
      window.closeMulti = function () {
        that.closeMulti()
      }
      window.mergeForward = function () {
        that.mergeForward()
      }
      window.oneByoneForward = function () {
        that.oneByoneForward()
      }
      window.multiDeleteContact = function () {
        that.multiDeleteContact()
      }
      document.querySelector('.lemon-editor').appendChild(dom)
    },
    closeMulti() {
      function getChildNode(node, allNodes = []) {
        const nodeList = node.childNodes
        for (let i = 0; i < nodeList.length; i++) {
          const childNode = nodeList[i]
          if (childNode.nodeType == 1) {
            allNodes.push(childNode)
            getChildNode(childNode, allNodes)
          }
        }
        return allNodes
      }
      // $('.lemon-editor')
      //   .find('*')
      //   .each(function (i, o) {
      //     if ($(o).hasClass('lemon-editor__tool')) $(this).show()
      //     if ($(o).hasClass('lemon-editor__inner')) $(this).show()
      //     if ($(o).hasClass('lemon-editor__footer')) $(this).show()
      //     if ($(o).hasClass('multi')) $(this).hide()
      //   })
      getChildNode(document.getElementsByClassName('lemon-editor')[0]).forEach((item, index) => {
        if (item.classList.contains('lemon-editor__tool') || item.classList.contains('lemon-editor__footer')) item.style.display = 'flex'
        if (item.classList.contains('lemon-editor__inner')) item.style.display = 'block'
        if (item.classList.contains('multi')) item.style.display = 'none'
      })
      // $('.lemon-container')
      //   .find('*')
      //   .each(function (i, o) {
      //     if (
      //       $(o).hasClass('lemon-message-text') ||
      //       $(o).hasClass('lemon-message-file') ||
      //       $(o).hasClass('lemon-message-image') ||
      //       $(o).hasClass('lemon-message-forward') ||
      //       $(o).hasClass('lemon-message-video')
      //     ) {
      //       $(this).css('border', '')
      //       $(this).css('margin-top', '')
      //     }
      //   })
      getChildNode(document.getElementsByClassName('lemon-container')[0]).forEach((item, index) => {
        if (item.classList.contains('lemon-message-text') || item.classList.contains('lemon-message-file') || item.classList.contains('lemon-message-image') || item.classList.contains('lemon-message-forward') || item.classList.contains('lemon-message-video') || item.classList.contains('lemon-message-order') || item.classList.contains('lemon-message-goods')) (item.style.border = '') && (item.style.marginTop = '')
      })
      // $('.lemon-container')
      //   .find('*')
      //   .each(function (i, o) {
      //     if (
      //       ($(o).hasClass('lemon-message-text') ||
      //         $(o).hasClass('lemon-message-file') ||
      //         $(o).hasClass('lemon-message-image') ||
      //         $(o).hasClass('lemon-message-forward') ||
      //         $(o).hasClass('lemon-message-video')) &&
      //       !$(o).hasClass('lemon-message--reverse')
      //     ) {
      //       $(this).css('padding-left', '')
      //     }
      //   })
      getChildNode(document.getElementsByClassName('lemon-container')[0]).forEach((item, index) => {
        if ((item.classList.contains('lemon-message-text') || item.classList.contains('lemon-message-file') || item.classList.contains('lemon-message-image') || item.classList.contains('lemon-message-forward') || item.classList.contains('lemon-message-video') || item.classList.contains('lemon-message-order') || item.classList.contains('lemon-message-goods')) && !item.classList.contains('lemon-message--reverse')) item.style.paddingLeft = ''
      })
      this.multiMessage = []
      this.multi = false
      // $('#checkMessage').html(0)
      document.getElementById('checkMessage').innerHTML = 0
    },
    messageInitEvent(data, IMUI) {
      this.user = data.user_info
      this.friend_group = data.friend_group
      // 初始化联系人 (使用lastContentRender将图片 文件类型转换)
      for (let i = 0; i < data.user_contact.length; i++) {
        if (
          data.user_contact[i].lastContent != '' &&
          data.user_contact[i].lastContentType != ''
        ) {
          data.user_contact[i].lastContent = IMUI.lastContentRender({
            type: data.user_contact[i].lastContentType,
            content: data.user_contact[i].lastContent
          })
        }
      }
      for (let i = 0; i < data.user_group.length; i++) {
        // user_group里面的toContactId用的是双等号（==）匹配，而不是全等，所以会有18=="18"
        // {"id": "5AXq8sE8BMPt37FW", // 指聊天室id，对应（收发）消息的toContactId
        // 	"is_group": 1,
        // 	"displayName": "啊啊啊",
        // 	"avatar": "https://hyperf-cms.oss-cn-guangzhou.aliyuncs.com/chat/group/avatar/69344bc3868e000a2136e21fd5761905.jpg",
        // 	"introduction": "",
        // 	"validation": 0,
        // 	"size": 200,
        // 	"uid": 775,
        // 	"index": "[0]群聊",
        // 	"unread": 0,
        // 	"member_total": 4,
        // 	"level": 0,
        // 	"lastContent": "123456 , zero1233276 , guanzhao 加入群聊",
        // 	"lastContentType": "event",
        // 	"lastSendTime": 1677039740000,
        // 	"group_member": [
        // 		{
        // 			"id": 775,
        // 			"desc": "mnb123",
        // 			"avatar": "https://shmily-album.oss-cn-shenzhen.aliyuncs.com/admin_face/face10.png",
        // 			"level": 0
        // 		},
        // 		{
        // 			"id": 4,
        // 			"desc": "123456",
        // 			"avatar": "https://shmily-album.oss-cn-shenzhen.aliyuncs.com/admin_face/face2.png",
        // 			"level": 2
        // 		},
      	// 	]}
        if (
          data.user_group[i].lastContent != '' &&
          data.user_group[i].lastContentType != ''
        ) {
          data.user_group[i].lastContent = IMUI.lastContentRender({
            type: data.user_group[i].lastContentType,
            content: data.user_group[i].lastContent
          })
        }
      }
      const contact = data.user_contact.concat(data.user_group)
      // 初始化用户
      IMUI.initContacts(contact)
      // 自动定位到最新消息
      IMUI.messageViewToBottom()
    },
    messageFriendHistoryEvent(data, IMUI) {
      this.messages = data
      this.next(this.messages.friend_history_message, true)
    },
    messageGroupHistoryEvent(data, IMUI) {
      this.messages = data
      this.next(this.messages.group_history_message, true)
    },
    friendWithdrawMessageEvent(data, IMUI) {
      const message = data.message
      const appendMessag = {
        id: generateRandId(),
        type: 'event',
        content: '"' + message.fromUser.displayName + '" 撤回了一条消息',
        toContactId: message.fromUser.id,
        sendTime: getTime()
      }
      IMUI.removeMessage(message.id)
      IMUI.appendMessage(appendMessag, true)
    },
    friendOnlineMessageEvent(data, IMUI) {
      // 判断是否显示消息通知
      if (
        this.settingDialogData.friendOnlineNotice &&
        !data.message.is_reconnection
      ) {
        this.$notify.warning({
          title: '你的好友 "' + data.message.user_info.desc + '" 已上线',
          duration: 2000,
          position: 'bottom-right',
          offset: 100,
          message: '来自系统通知'
        })
      }
      // 播放收到信息音频
      if (
        this.settingDialogData.friendOnlineNoticeTone &&
        !data.message.is_reconnection
      ) {
        const messageToneType = 'friendOnlineTone.mp3'
        const buttonAudio = document.getElementById('eventAudio')
        buttonAudio.setAttribute('src', '../../../../../../static/audio/' + messageToneType)
        buttonAudio.play()
      }
      IMUI.updateContact({
        id: data.message.uid,
        status: data.message.online_status
      })
    },
    friendOfflineMessageEvent(data, IMUI) {
      IMUI.updateContact({
        id: data.message.uid,
        status: data.message.online_status
      })
    },
    createGroupEvent(data, IMUI) {
      const contact = data.message.group_info
      IMUI.appendContact(contact)
    },
    editGroupEvent(data, IMUI) {
      // 判断是否是创建组
      const groupInfo = data.message.group_info
      IMUI.updateContact({
        id: data.message.toContactId,
        avatar: groupInfo.avatar,
        displayName: groupInfo.group_name,
        introduction: groupInfo.introduction,
        size: groupInfo.size,
        validation: groupInfo.validation
      })
      IMUI.appendMessage(data.message, true)
    },
    newMemberJoinGroupEvent(data, IMUI) {
      const contact = data.message.group_info
      IMUI.appendContact(contact)
    },
    groupMemberExitEvent(data, IMUI) {
      IMUI.appendMessage(data.message, true)
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total
      })
      if (this.user.id == data.message.uid) {
        IMUI.removeContact(data.message.toContactId)
      }
    },
    deleteGroupMemberEvent(data, IMUI) {
      IMUI.appendMessage(data.message, true)
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total
      })
      if (this.user.id == data.message.uid) {
        IMUI.removeContact(data.message.toContactId)
        this.$confirm(
          '你已被移除 "' + data.message.displayName + '" 聊天室',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
      }
    },
    deleteGroup(data, IMUI) {
      IMUI.removeContact(data.message.toContactId)
      if (this.user.id != data.message.uid) {
        this.$confirm(data.message.content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
    },
    changeGroupMemberLevel(data, IMUI) {
      IMUI.appendMessage(data.message, true)
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total
      })
      if (data.message.uid == this.user.id) {
        IMUI.updateContact({
          id: data.message.toContactId,
          level: data.message.level
        })
      }
    },
    changeGroupAvatar(data, IMUI) {
      IMUI.updateContact({
        id: data.message.toContactId,
        avatar: data.message.avatar
      })
    },
    oneByoneSend(data, IMUI) {
      IMUI.appendMessage(data.message, true)
      if (data.message.fromUser.id != this.$store.getters.personId) {
      // 判断是否显示消息通知
        if (this.settingDialogData.messagePagePrompt) {
          this.$notify.warning({
            title: '你有一条新的消息',
            duration: 2000,
            position: 'bottom-right',
            offset: 100,
            message: '来自："' + data.message.fromUser.displayName + '"'
          })
        }
        // 播放收到信息音频
        if (this.settingDialogData.messageTone) {
          const messageToneType = this.settingDialogData.messageToneType
          const buttonAudio = document.getElementById('eventAudio')
          buttonAudio.setAttribute('src', '../../../../../../static/audio/' + messageToneType)
          buttonAudio.play()
        }
      }
      IMUI.messageViewToBottom()
    },
    getSendMessage(data, IMUI) {
      if (data.message.fromUser.id == this.$store.getters.personId) return
      IMUI.appendMessage(data.message, true)
      // 判断是否显示消息通知
      if (this.settingDialogData.messagePagePrompt) {
        this.$notify.warning({
          title: '你有一条新的消息',
          duration: 2000,
          position: 'bottom-right',
          offset: 100,
          message: '来自："' + data.message.fromUser.displayName + '"'
        })
      }
      // 播放收到信息音频
      if (this.settingDialogData.messageTone) {
        const messageToneType = this.settingDialogData.messageToneType
        const buttonAudio = document.getElementById('eventAudio')
        buttonAudio.setAttribute('src', '../../../../../../static/audio/' + messageToneType)
        buttonAudio.play()
      }
      IMUI.messageViewToBottom()
    },
    handlePullMessages(contact, next) {
      // const that = this
      // const uri =
      //   contact.is_group == 0 ? '/friend/pull_message' : '/group/pull_message'
      // const data = {
      //   message: {
      //     contact_id: contact.id,
      //     user_id: this.user.id
      //   },
      //   uri
      // }
      // this.socket.send(JSON.stringify(data))
      this.next = next
      this.initSocket(contact)
    },
    handleSend(message, next, file) {
      // {
      // 	"id": "e2325d99-a706-441b-9c2f-79f25a0d94e1", // 每一条消息的id
      // 	"type": "text",
      // 	"status": "succeed",
      // 	"sendTime": 1677142011288,
      // 	"toContactId": 15, // 聊天室的id
      // 	"fromUser": {
      // 		"avatar": "https://www.tuanfengkeji.cn:9527/dts-admin-api/admin/storage/fetch/zp7zbhidobolzr8z4b90.png",
      // 		"id": 8,
      // 		"displayName": "Tuanfeng"
      // 	},
      // 	"content": "111"
      // }
      const { IMUI } = this.$refs
      // 执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      // 调用你的消息发送业务接口
      // 先判断是否为图片上传，此处主要针对粘贴图片无法重写组件
      message.content = message.content.replace(
        /^(?:[\n\r]*)|(?:[\n\r]*)$/g,
        ''
      )
      if (message.content.indexOf('blob:') != -1) {
        fileByBase64(file, (base64) => {
          const params = {
            savePath: 'chat/group',
            file: base64
          }
          uploadPicByBase64(params)
            .then((response) => {
              if (response.code == 200) {
                message.content = response.data.url
                const uri =
                  typeof message.toContactId === 'number'
                    ? '/friend/send_message'
                    : '/group/send_message'
                this.send(message, uri)
                next()
              }
            })
            .catch(() => {
              next({ status: 'failed' })
            })
        })
      } else {
        // console.log(message, next, file)
        // const uri =
        //   typeof message.toContactId === 'number'
        //     ? '/friend/send_message'
        //     : '/group/send_message'
        IMUI.setEditorValue('')
        // this.send(message, uri)
        this.send({
          id: message.sendTime,
          status: 'succeed',
          type: message.type,
          sendTime: message.sendTime,
          content: message.content,
          toContactId: message.toContactId,
          fileSize: 0,
          fileName: '',
          fromUser: {
            id: message.fromUser.id,
            displayName: message.fromUser.displayName,
            avatar: message.fromUser.avatar
          },
          isGroup: true
        }, '')
        next()
      }
    },
    handleChangeContact(contact, instance) {
      // console.log(contact, instance, instance.getCurrentMessages())
      // 强制锁死contacts的联系人的点击事件（即使其无效）
      // if (this.menuName === 'contacts') {
      //   instance.changeContact(this.messagesContact.id) // 就算用this.$nextTick(()也不行（应该是组件内部问题），就算用setTimeout(()也有bug（因为会切换回来）
      // } else {
      //   this.messagesContact = contact
      //   instance.updateContact({ id: contact.id, unread: 0 })
      // }

      // // 还是有一点缺陷，即必须点发送消息才行，否则直接切回messages则会有停留bug
      // if (this.menuName === 'contacts') {
      //   instance.updateContact({ id: contact.id, unread: 0 })
      // } else {
      //   this.messagesContact = contact
      //   instance.updateContact({ id: contact.id, unread: 0 })
      // }

      // console.log(JSON.stringify(this.messagesContact))
      if (this.menuName === 'messages') {
        this.messagesContact = contact
        instance.updateContact({ id: contact.id, unread: 0 })
      }
      // console.log(JSON.stringify(this.messagesContact))
      // console.log(this.menuName)

      this.historyMessageDialogData.contact_id = contact.id
      instance.closeDrawer()
      instance.messageViewToBottom()
      this.closeMulti()
    },
    handleMessageClick(event, key, Message, instance) {
      if (Message.type == 'image') {
        this.imageSrc = Message.content
        while (this.srcList.length > 0) {
          this.srcList.pop()
        }
        for (let i = 0; i < instance.getCurrentMessages().length; i++) {
          if (instance.getCurrentMessages()[i].type == 'image') { this.srcList.push(instance.getCurrentMessages()[i].content) }
        }
        this.$refs.preview.clickHandler()
      }
    },
    handleCreateGroup(instance) {
      return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
      this.createGroupDialogData.visible = true
      this.createGroupDialogData.contacts = instance.contacts.filter(function (item) {
        if (item.is_group != 1) return item
      })
      this.createGroupDialogData.creator = instance.user
    },
    handleOpenGroupTool(type, contact) {
      return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
      if (type == 'group_file') this.groupTool.groupFileDialogVisible = true
      if (type == 'group_notice') { this.groupTool.groupNoticeDialogVisible = true }
      if (type == 'group_album') this.groupTool.groupAlbumDialogVisible = true
      if (type == 'group_invite') { this.groupTool.groupInviteDialogVisible = true }
      if (type == 'group_member_manage') { this.groupTool.groupMemberManageDialogVisible = true }
      if (type == 'group_edit') this.groupTool.groupEditDialogVisible = true
      if (type == 'group_exit') {
        this.$confirm('确认退出该聊天室，操作不可逆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const message = {
              group_id: contact.id,
              uid: this.user.id
            }
            this.send(message, '/group/exit_group', 'POST')
          })
          .catch(() => {})
      }
      if (type == 'group_delete') {
        this.$confirm('确认解散该聊天室，操作不可逆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const message = {
              group_id: contact.id,
              uid: this.user.id
            }
            this.send(message, '/group/delete_group', 'POST')
          })
          .catch(() => {
            this.$message({ showClose: true, message: '操作失败，请重试', type: 'error' })
          })
      }
      this.groupTool.contact = contact
      this.groupTool.type = type
      this.groupTool.user = this.user
      this.$refs.groupToolRef.init()
    },
    composeValue(type, row) {
      return {
        command: type,
        contact: row
      }
    },
    handleCommand(command) {
      this.handleOpenGroupTool(command.command, command.contact)
    },
    sendEditGroup(group) {
      group.uid = this.user.id
      this.send(group, '/group/edit_group', 'POST')
      this.msgSuccess('修改聊天室公告成功')
    },
    sendCreateGroup(group) {
      group.creator = this.createGroupDialogData.creator
      this.send(group, '/group/create_group', 'POST')
    },
    sendInviteGroupMember(group, newJoinGroupMember) {
      const { IMUI } = this.$refs
      const newGroup = JSON.parse(JSON.stringify(group))
      newGroup.newJoinGroupMember = newJoinGroupMember
      this.send(newGroup, '/group/invite_group_member', 'POST')
    },
    sendDeleteGroupMember(group) {
      this.send(group, '/group/delete_group_member', 'POST')
      this.msgSuccess('删除组员成功')
    },
    sendChangeGroupLevel(group) {
      this.send(group, '/group/change_group_member_level', 'POST')
      this.msgSuccess('更改组员等级成功')
    },
    beforeFileUpload(file, dataObj, type) {
      const { IMUI } = this.$refs
      const tempDate = Date.now()
      const message = {
        // id: dataObj.messageId,
        id: tempDate,
        status: 'going',
        type,
        sendTime: tempDate,
        content: '',
        fileSize: file.size,
        fileName: file.name,
        // fileExt: '',
        toContactId: IMUI.getCurrentContact().id,
        fromUser: {
          id: this.user.id,
          displayName: this.user.displayName,
          avatar: this.user.avatar
        },
        isGroup: !!IMUI.getCurrentContact().is_group
      }
      this.$set(this.messagesToBeSend, message.id, message)
      this.$set(this.fileIdToMessageId, file.uid, message.id)
      IMUI.appendMessage(message, true)
    },
    afterFileUpload(res, file) {
      const { IMUI } = this.$refs
      if (res.errno != 0) {
        this.$message({
          showClose: true,
          message: res.errmsg,
          type: 'error'
        })
        IMUI.updateMessage({
          id: this.fileIdToMessageId[file.uid],
          status: 'failed'
        })
      } else {
        IMUI.updateMessage({
          // id: res.data.messageId,
          id: this.fileIdToMessageId[file.uid],
          content: res.data.url,
          fileExt: res.data.fileExt || '',
          status: 'succeed'
        })
        // const messageId = res.data.messageId
        // const uri =
        //   typeof this.messagesToBeSend[messageId].toContactId === 'number'
        //     ? '/friend/send_message'
        //     : '/group/send_message'
        // this.send(this.messagesToBeSend[messageId], uri)
        this.send(this.messagesToBeSend[this.fileIdToMessageId[file.uid]], '')
      }
      // delete this.messagesToBeSend[res.data.messageId]
      delete this.messagesToBeSend[this.fileIdToMessageId[file.uid]]
      delete this.fileIdToMessageId[file.uid]
    },
    querySearch(queryString, cb) {
      const { IMUI } = this.$refs
      var contacts = IMUI.getContacts()

      var results = queryString
        ? contacts.filter(this.createFilter(queryString))
        : contacts
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (contact) => contact.displayName
        .toLowerCase()
        .indexOf(queryString.toLowerCase()) === 0
    },
    handleSelect(item) {
      const { IMUI } = this.$refs
      IMUI.changeContact(item.id)
    },
    handleChangeMenu(name) {
      const { IMUI } = this.$refs
      // console.log(this.menuName)
      this.menuName === 'contacts' && name === 'messages' ? this.isContactsToMessages = true : this.isContactsToMessages = false
      this.menuName = name
      if (this.isContactsToMessages) {
        IMUI.changeContact(this.messagesContact.id) // 如果该id为假，则不会执行changeContact对应的handleChangeContact
        // 在contacts选择另一个人点击发送消息（相当于执行handleChangeContact，不过由于组件内部原因，会拖到后面等handleChangeMenu执行完之后再次执行）后：
        // 先handleChangeMenu->console(contacts)->【menuName为messages成立】->【contact为原来的】changeContact对应的handleChangeContact[console(messages)]->console(messages)
        // ->【contact为后来的】再次执行handleChangeContact()->console(messages)
      }
      // console.log(this.menuName)
      IMUI.closeDrawer()
      this.closeMulti()
    },
    mergeForward() {
      return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
      const { IMUI } = this.$refs
      // 如果选中消息大于两条才显示
      if (this.multiMessage.length >= 2) {
        for (let i = 0; i < this.multiMessage.length; i++) {
          if (this.multiMessage[i].type == 'forward') {
            this.$notify({
              title: '消息转发',
              message: '会话记录不支持合并转发',
              type: 'warning',
              offset: 100
            })
            return
          }
        }
        this.forwardTool.dialogVisible = true
        this.forwardTool.contact = IMUI.getContacts()
        this.forwardTool.contactsSource = IMUI.getContacts()
        this.forwardTool.multiMessage = this.multiMessage
        this.forwardTool.type = 'mergeForward' // 合并转发
        this.forwardTool.user = this.user
      }
    },
    oneByoneForward(message) {
      const { IMUI } = this.$refs
      if (message != '' && message != undefined && message != null) {
        if (message.type === 'order' || message.type === 'goods') return this.$message({ message: '不支持转发该消息！', type: 'error' })
        // 如果选中消息为真才显示
        this.forwardTool.dialogVisible = true
        this.forwardTool.contact = IMUI.getContacts()
        this.forwardTool.contactsSource = IMUI.getContacts()
        this.forwardTool.multiMessage = [ message ]
        this.forwardTool.type = 'oneByoneForward' // 单条转发
        this.forwardTool.user = this.user
      } else {
        if (this.multiMessage.some((item) => item.type === 'order' || item.type === 'goods')) return this.$message({ message: '包含不支持转发的消息，转发失败！', type: 'error' })
        // 如果选中消息大于两条才显示
        if (this.multiMessage.length >= 2) {
          this.forwardTool.dialogVisible = true
          this.forwardTool.contact = IMUI.getContacts()
          this.forwardTool.contactsSource = IMUI.getContacts()
          this.forwardTool.multiMessage = this.multiMessage // 逐条转发
          this.forwardTool.type = 'oneByoneForward'
          this.forwardTool.user = this.user
        }
      }
    },
    multiDeleteContact() {
      const { IMUI } = this.$refs
      for (let i = 0; i < this.multiMessage.length; i++) {
        IMUI.removeMessage(this.multiMessage[i].id)
      }
      this.closeMulti()
    },
    insertContent(content) {
      if (!content) {
        // 如果插入的内容为空则返回
        return
      }
      let sel = null
      if (document.selection) {
        // IE9以下
        sel = document.selection
        sel.createRange().pasteHTML(content)
      } else {
        sel = window.getSelection()
        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0) // 获取选择范围
          range.deleteContents() // 删除选中的内容
          const el = document.createElement('div') // 创建一个空的div外壳
          el.innerHTML = content // 设置div内容为我们想要插入的内容。
          const frag = document.createDocumentFragment() // 创建一个空白的文档片段，便于之后插入dom树

          const node = el.firstChild
          const lastNode = frag.appendChild(node)
          range.insertNode(frag) // 设置选择范围的内容为插入的内容
          const contentRange = range.cloneRange() // 克隆选区
          contentRange.setStartAfter(lastNode) // 设置光标位置为插入内容的末尾
          contentRange.collapse(true) // 移动光标位置到末尾
          sel.removeAllRanges() // 移出所有选区
          sel.addRange(contentRange) // 添加修改后的选区
        }
      }
    },
    newFriendJoinMessage(data, IMUI) {
      IMUI.appendContact(data.message.contact)
    },
    friendDeleteMessage(data, IMUI) {
      IMUI.removeContact(data.message.contact_id)
    },
    sendLinkMessage(content) {
      const { IMUI } = this.$refs
      const message = {
        id: generateUUID(),
        status: 'succeed',
        type: 'link',
        sendTime: Date.now(),
        content,
        toContactId: IMUI.getCurrentContact().id,
        fromUser: {
          id: this.user.id,
          displayName: this.user.displayName,
          avatar: this.user.avatar
        }
      }
      const uri =
        typeof message.toContactId === 'number'
          ? '/friend/send_message'
          : '/group/send_message'
      this.send(message, uri)
      IMUI.appendMessage(message, true)
      this.linkMessageDialogData.visible = false
    }
  }
}
