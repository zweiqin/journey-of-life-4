<template>
  <div class="chatMain">
    <el-dialog
      style="display:none"
      class="text"
      :visible.sync="chatDialogData.dialogVisible"
      width="1000px"
      :center="true"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="true"
      :modal-append-to-body="true"
    >
      <lemon-imui
        ref="IMUI"
        class="lemon"
        width="1050px"
        height="700px"
        loadend-text="只显示最近30条信息"
        :avatar-cricle="settingDialogData.avatarCricle"
        :hide-message-name="settingDialogData.hideMessageName"
        :hide-message-time="settingDialogData.hideMessageTime"
        :theme="settingDialogData.theme"
        :send-key="settingDialogData.sendText == 'Enter' ? (e) => !e.ctrlKey && e.keyCode == 13 : (e) => e.keyCode == 13 && e.ctrlKey"
        :user="user"
        :contextmenu="contextmenu"
        :contact-contextmenu="contactContextmenu"
        @pull-messages="handlePullMessages"
        @send="handleSend"
        @change-contact="handleChangeContact"
        @message-click="handleMessageClick"
        @change-menu="handleChangeMenu"
      >
        <template #message-title="contact">
          <div>
            <div style="line-height:32px">
              <span style="font-size:19px">{{ contact.displayName }}</span>
              <span>
                <el-badge
                  v-if="contact.is_group != 1 && contact.status == 1"
                  is-dot
                  class="item"
                  type="success"
                >
                  (在线)
                </el-badge>
                <el-badge
                  v-if="contact.is_group != 1 && contact.status == 0"
                  is-dot
                  class="item"
                >
                  (离线)
                </el-badge>
              </span>
              <span
                v-if="contact.is_group == 1"
                class="slot-group-menu"
                style="display:block;float:right"
              >
                <span @click="handleOpenGroupTool('group_file', contact)">
                  <el-tooltip class="item" effect="dark" content="聊天室文件" placement="top">
                    <svg-icon icon-class="group_file" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
                <span @click="handleOpenGroupTool('group_notice', contact)">
                  <el-tooltip class="item" effect="dark" content="聊天室公告" placement="top">
                    <svg-icon icon-class="group_notice" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
                <span @click="handleOpenGroupTool('group_album', contact)">
                  <el-tooltip class="item" effect="dark" content="聊天室相册" placement="top">
                    <svg-icon icon-class="group_album" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
                <span
                  v-if="contact.level != 2"
                  @click="handleOpenGroupTool('group_invite', contact)"
                >
                  <el-tooltip class="item" effect="dark" content="聊天室邀请" placement="top">
                    <svg-icon icon-class="group_invite" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>

                <span @click="handleOpenGroupTool('group_setting', contact)">
                  <el-tooltip class="item" effect="dark" content="聊天室设置" placement="top">
                    <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
                      <span class="el-dropdown-link" style="margin:0;border-bottom:0">
                        <svg-icon icon-class="group_setting" style="width:1.8em;height:1.8em"></svg-icon>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="contact.level == 0"
                          icon="el-icon-notebook-1"
                          :command="composeValue('group_member_manage', contact)"
                        >
                          聊天室成员管理
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="contact.level != 2"
                          icon="el-icon-edit"
                          :command="composeValue('group_edit', contact)"
                        >
                          修改聊天室配置
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="contact.level != 0"
                          icon="el-icon-circle-close"
                          :command="composeValue('group_exit', contact)"
                        >
                          退出该聊天室
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="contact.level == 0"
                          icon="el-icon-delete"
                          :command="composeValue('group_delete', contact)"
                        >
                          解散该聊天室
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-tooltip>
                </span>
                <span style="margin-right:10px" @click="changeDrawer(contact, $refs.IMUI)">
                  <el-tooltip class="item" effect="dark" content="聊天室抽屉" placement="top">
                    <svg-icon icon-class="hamburger" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
              </span>
            </div>
            <div
              style="display: block;height: 1px;width: 100%;background-color: #DCDFE6;position: relative;margin-top:5px"
            ></div>
          </div>
        </template>
        <template #editor-footer>
          <div>
            <span>使用 {{ settingDialogData.sendText }} 快捷发送消息</span>
          </div>
        </template>
        <template #message-after="Message">
          <div v-if="multi" class="multiContact">
            <el-checkbox
              v-if="Message.fromUser.id != user.id"
              v-model="multiMessage"
              :label="Message"
              style="position: absolute; left:-70px"
            ></el-checkbox>
            <el-checkbox
              v-else
              v-model="multiMessage"
              :label="Message"
              style="position: absolute; right:636px"
            ></el-checkbox>
          </div>
        </template>
        <template #cover>
          <div
            class="cover"
            style="width:690px;height:790px;text-align: center;position: relative;"
          >
            <img
              src="https://hyperf-cms.oss-cn-guangzhou.aliyuncs.com/chat_cover.png"
              alt
              style="width: auto;height: auto;max-width: 100%;max-height: 100%;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);opacity: 0.3;"
            />
          </div>
        </template>
        <template #sidebar-message-fixedtop="instance">
          <div style="margin-bottom:10px">
            <p style="margin-top:10px;margin-left:10px;">
              <el-autocomplete
                v-model="filterContact"
                size="small"
                popper-class="my-autocomplete"
                :fetch-suggestions="querySearch"
                placeholder="请输入搜索联系人"
                :popper-append-to-body="false"
                @select="handleSelect"
              >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <template slot-scope="{ item }">
                  <div :title="item.displayName" class="lemon-contact">
                    <span class="lemon-contact__avatar">
                      <span
                        class="lemon-avatar"
                        style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;"
                      >
                        <img :src="item.avatar" />
                      </span>
                    </span>
                    <div class="lemon-contact__inner">
                      <p class="lemon-contact__label">
                        <span class="lemon-contact__name">{{ item.displayName }}</span>
                      </p>
                    </div>
                  </div>
                </template>
              </el-autocomplete>
              <el-dropdown trigger="click" size="small" style="margin-left:10px">
                <span class="el-dropdown-link" style="cursor: pointer;">
                  <i
                    class="el-icon-plus"
                    style="font-size:20px;vertical-align: middle; font-weight:bold"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item divided>
                    <span style="display: block" @click="handleCreateGroup(instance)">创建聊天室</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
        </template>
        <template #sidebar-contact-fixedtop="instance">
          <div style="margin-bottom:10px">
            <p style="margin-top:10px;margin-left:10px;">
              <el-autocomplete
                v-model="filterContact"
                size="small"
                popper-class="my-autocomplete"
                :fetch-suggestions="querySearch"
                placeholder="请输入搜索联系人"
                :popper-append-to-body="false"
                @select="handleSelect"
              >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <template slot-scope="{ item }">
                  <div :title="item.displayName" class="lemon-contact">
                    <span class="lemon-contact__avatar">
                      <span
                        class="lemon-avatar"
                        style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;"
                      >
                        <img :src="item.avatar" />
                      </span>
                    </span>
                    <div class="lemon-contact__inner">
                      <p class="lemon-contact__label">
                        <span class="lemon-contact__name">{{ item.displayName }}</span>
                      </p>
                    </div>
                  </div>
                </template>
              </el-autocomplete>
              <el-dropdown trigger="click" size="small" style="margin-left:10px">
                <span class="el-dropdown-link" style="cursor: pointer;">
                  <i
                    class="el-icon-plus"
                    style="font-size:20px;vertical-align: middle; font-weight:bold"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item divided>
                    <span style="display: block" @click="handleCreateGroup(instance)">创建聊天室</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
        </template>
      </lemon-imui>
      <HistoryMessage ref="historyMessageRef" :history-message-dialog-data="historyMessageDialogData"></HistoryMessage>
      <LinkMessage ref="linkMessageRef" :link-message-dialog-data="linkMessageDialogData"></LinkMessage>
      <Setting ref="settingRef" :setting-dialog-data="settingDialogData"></Setting>
      <CreateGroup ref="createGroupRef" :create-group-dialog-data="createGroupDialogData"></CreateGroup>
      <FileUpload ref="fileUploadCom" save-path="chat/file"></FileUpload>
      <VideoUpload ref="videoUploadCom" save-path="chat/video"></VideoUpload>
      <PicUpload ref="picUploadCom" save-path="chat/pic"></PicUpload>
      <GroupTool ref="groupToolRef" :group-tool="groupTool"></GroupTool>
      <ForwardTool ref="forwardToolRef" :forward-tool="forwardTool"></ForwardTool>
      <el-image
        ref="preview"
        :src="imageSrc"
        fit="fill"
        :preview-src-list="srcList"
        :z-index="2050"
      ></el-image>
    </el-dialog>
  </div>
</template>

<script>
import HistoryMessage from './components/HistoryMessage'
import LinkMessage from './components/LinkMessage'
import GroupDrawer from './components/GroupDrawer'
import FileUpload from './components/FileUpload'
import VideoUpload from './components/VideoUpload'
import PicUpload from './components/PicUpload'
import Setting from './components/Setting'
import GroupTool from './components/GroupTool'
import CreateGroup from './components/CreateGroup'
import ForwardTool from './components/ForwardTool'
import { download, fileByBase64 } from '@/utils/file'
import init from './mixin/init'
import message from './mixin/message'
import mounted from './mixin/mounted'

const generateRandId = () => Math.random().toString(36)
  .substr(-8)
const getTime = () => new Date().getTime()
export default {
  name: 'Chat',
  components: {
    HistoryMessage,
    LinkMessage,
    GroupDrawer,
    FileUpload,
    PicUpload,
    VideoUpload,
    Setting,
    CreateGroup,
    GroupTool,
    ForwardTool
  },
  mixins: [init, message, mounted],
  props: {
    chatDialogData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // path: process.env.VUE_APP_WS_API,
      path: process.env.BASE_WS_API,
      recorder: false,
      menuName: 'messages',
      isContactsToMessages: false,
      messagesContact: {},
      IMUI: '',
      filterContact: '',
      user: {},
      messages: [],
      messagesToBeSend: {},
      fileIdToMessageId: {},
      timeer: '',
      next: '',
      imgUrl: '',
      multiMessage: [],
      multi: false,
      historyMessageDialogData: {
        visible: false,
        contact_id: null
      },
      linkMessageDialogData: {
        visible: false,
        content: null
      },
      mulite: false,
      drawerOpen: false,
      settingDialogData: {
        visible: false,
        sendText: this.$store.state.chat.sendText,
        theme: this.$store.state.chat.theme,
        avatarCricle: this.$store.state.chat.avatarCricle,
        hideMessageName: this.$store.state.chat.hideMessageName,
        hideMessageTime: this.$store.state.chat.hideMessageTime,
        messagePagePrompt: this.$store.state.chat.messagePagePrompt,
        messageTone: this.$store.state.chat.messageTone,
        messageToneType: this.$store.state.chat.messageToneType,
        friendOnlineNotice: this.$store.state.chat.friendOnlineNotice,
        friendOnlineNoticeTone: this.$store.state.chat.friendOnlineNoticeTone
      },
      createGroupDialogData: {
        visible: false,
        contacts: [],
        creator: [],
        checkedContacts: []
      },
      searchGroupDialogData: {
        visible: false
      },
      groupTool: {
        type: '',
        groupFileDialogVisible: false,
        groupNoticeDialogVisible: false,
        groupAlbumDialogVisible: false,
        groupInviteDialogVisible: false,
        groupMemberManageDialogVisible: false,
        groupEditDialogVisible: false,
        contact: [],
        user: []
      },
      forwardTool: {
        dialogVisible: false,
        contact: [],
        contactsSource: [],
        user: [],
        type: ''
      },
      imageSrc: '',
      srcList: [],
      imageDialogVisible: false,
      contextmenu: [
        {
          click: (e, instance, hide) => {
            this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            // const { IMUI, message } = instance
            // if (getTime() - message.sendTime > 120000) {
            //   this.$message({
            //     message: '发送时间超出两分钟，不允许撤回',
            //     type: 'error'
            //   })
            // } else {
            //   const data = {
            //     id: generateRandId(),
            //     type: 'event',
            //     // 使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
            //     content: (
            //       <div>
            //         <span>
            //           你撤回了一条消息{' '}
            //           <span
            //             v-show={message.type == 'text'}
            //             style="color:#333;cursor:pointer"
            //             content={message.content}
            //             on-click={(e) => {
            //               IMUI.setEditorValue(e.target.getAttribute('content'))
            //             }}
            //           >
            //             重新编辑
            //           </span>
            //         </span>
            //       </div>
            //     ),
            //     toContactId: message.toContactId,
            //     sendTime: getTime()
            //   }
            //   this.send(message, '/friend/withdraw_message')
            //   IMUI.removeMessage(message.id)
            //   IMUI.appendMessage(data, true)
            // }
            // hide()
          },
          visible: (instance) => instance.message.fromUser.id == this.user.id &&
            instance.message.sendTime >=
            Date.now() - 2 * 60 * 1000,
          text: "<i class='el-icon-s-flag' style='margin-right:10px'></i><span>撤回消息</span>"
        },
        {
          visible: (instance) => instance.message.type == 'image',
          text: "<i class='el-icon-picture-outline' style='margin-right:10px'></i><span>下载图片</span>",
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            const fileExtension = message.content.substring(message.content.lastIndexOf('.') + 1)
            download(message.content, message.content, fileExtension, false)
            hide()
          }
        },
        {
          visible: (instance) => instance.message.type == 'file',
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            const fileExtension = message.content.substring(message.content.lastIndexOf('.') + 1)
            download(message.content, message.fileName, fileExtension, true)
            hide()
          },
          text: "<i class='el-icon-download' style='margin-right:10px'></i><span>下载文件</span>"
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            IMUI.removeMessage(message.id)
            hide()
          },
          color: '#606266',
          text: "<i class='el-icon-delete' style='margin-right:10px'></i><span>删除</span>"
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            this.oneByoneForward(message)
            hide()
          },
          color: '#606266',
          text: "<i class='el-icon-s-promotion' style='margin-right:10px'></i><span>转发</span>"
        },
        {
          click: (e, instance, hide) => {
            this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            // const { IMUI, message } = instance
            // hide()
          },
          color: '#606266',
          text: "<i class='el-icon-connection' style='margin-right:10px'></i><span>引用</span>"
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance

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
            //     // 调用.find()需要选择器表达式参数。如果我们需要检索所有的后代元素，我们可以通过在普遍选择器'*'来完成。
            //     // .each() 方法用来让DOM循环结构更简单更不易出错。它会迭代jQuery对象中的每一个DOM元素。每次回调函数执行时，会传递当前循环次数作为参数(从0开始计数)。更重要的是，回调函数是在当前DOM元素为上下文的语境中触发的。因此关键字 this 总是指向这个元素。
            //     // hasClass，如果匹配元素上有指定的样式，那么.hasClass() 方法将返回 true ， 即使元素上可能还有其他样式。
            //     // jQuery( element ) 一个用于封装成jQuery对象的DOM元素。
            //     // .hide()如果没有参数，.hide()方法是最简单的方法来隐藏一个元素。匹配的元素将被立即隐藏，没有动画。这大致相当于调用.css('display', 'none')，但display属性值保存在jQuery的数据缓存中，所以display可以方便以后可以恢复到其初始值。如果一个元素的display属性值为inline，那么隐藏再显示时，这个元素将再次显示inline。
            //     if ($(o).hasClass('lemon-editor__tool')) $(this).hide() // 原flex,none
            //     if ($(o).hasClass('lemon-editor__inner')) $(this).hide() // 原block,none
            //     if ($(o).hasClass('lemon-editor__footer')) $(this).hide() // 原flex,none
            //     if ($(o).hasClass('multi')) $(this).show() // 原none,flex
            //   })
            // console.log($('.lemon-editor').find('*'), '--', document.getElementsByClassName('lemon-editor')[0].childNodes,getChildNode(document.getElementsByClassName('lemon-editor')[0]))
            getChildNode(document.getElementsByClassName('lemon-editor')[0]).forEach((item, index) => {
              // console.log(typeof item.className === 'string' ? item.classList.includes('lemon-editor__tool') : item.className, index)
              // if (typeof item.className === 'string' ? item.className.includes('lemon-editor__tool') || item.className.includes('lemon-editor__inner') || item.className.includes('lemon-editor__footer') : false) item.style.display = 'none'
              if (item.classList.contains('lemon-editor__tool') || item.classList.contains('lemon-editor__inner') || item.classList.contains('lemon-editor__footer')) item.style.display = 'none'
              if (item.classList.contains('multi')) item.style.display = 'flex'
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
            //       $(this).css('border', '1px dashed #409EFF')
            //       $(this).css('margin-top', '5px')
            //     }
            //   })
            getChildNode(document.getElementsByClassName('lemon-container')[0]).forEach((item, index) => {
              if (item.classList.contains('lemon-message-text') || item.classList.contains('lemon-message-file') || item.classList.contains('lemon-message-image') || item.classList.contains('lemon-message-forward') || item.classList.contains('lemon-message-video') || item.classList.contains('lemon-message-order') || item.classList.contains('lemon-message-goods')) (item.style.border = '1px dashed #409EFF') && (item.style.marginTop = '5px')
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
            //       $(this).css('padding-left', '30px')
            //     }
            //   })
            getChildNode(document.getElementsByClassName('lemon-container')[0]).forEach((item, index) => {
              if ((item.classList.contains('lemon-message-text') || item.classList.contains('lemon-message-file') || item.classList.contains('lemon-message-image') || item.classList.contains('lemon-message-forward') || item.classList.contains('lemon-message-video') || item.classList.contains('lemon-message-order') || item.classList.contains('lemon-message-goods')) && !item.classList.contains('lemon-message--reverse')) item.style.paddingLeft = '30px'
            })
            this.multi = true
            hide()
          },
          color: '#606266',
          text: "<i class='el-icon-finished' style='margin-right:10px'></i><span>多选</span>"
        }
      ],
      contactContextmenu: [
        {
          text: "<i class='el-icon-chat-line-round' style='margin-right:10px'></i><span>好友信息</span>",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            hide()
            this.$msgbox({
              title: '好友信息',
              message: h({
                data() { return { value: '' } },
                render(h) {
                  return h('div', { }, [
                    h('div', { }, `ID：${contact.id}`),
                    h('div', { }, `是否聊天室：${contact.is_group == 1 ? '是' : '否'}`),
                    h('div', { }, `聊天对象展示名字：${contact.displayName}`),
                    h('div', { }, `聊天对象头像链接：${contact.avatar ? contact.avatar : '无'}`),
                    h('div', { }, `聊天对象索引：${contact.index}`),
                    h('div', { }, `未读条数：${contact.unread}`)
                  ])
                }
              }),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose(action, instance, done) {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true
                  instance.confirmButtonText = '执行中...'
                  IMUI.updateContact({
                    id: contact.id,
                    displayName: this.$children[2].value || this.$children[3].value
                  })
                  done()
                  instance.confirmButtonLoading = false
                } else { done() }
              }
            }).then((action) => { })
          },
          visible: (instance) => instance.contact.is_group == 0
        },
        {
          text: "<i class='el-icon-edit' style='margin-right:10px'></i><span>修改备注</span>",
          click: (e, instance, hide) => {
            hide()
            const { IMUI, contact } = instance
            this.$msgbox({
              title: '修改备注',
              message: h({
                data() { return { value: '' } },
                render(h) {
                  return h('el-input', { attrs: { placeholder: '请输入备注' }, props: { value: this.value }, on: { input: (event) => { this.value = event } } }, [])
                }
              }),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose(action, instance, done) {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true
                  instance.confirmButtonText = '执行中...'
                  IMUI.updateContact({
                    id: contact.id,
                    displayName: this.$children[2].value || this.$children[3].value
                  })
                  done()
                  instance.confirmButtonLoading = false
                } else { done() }
              }
            }).then((action) => { })
          },
          visible: (instance) => instance.contact.is_group == 0
        },
        {
          text: "<i class='el-icon-upload2' style='margin-right:10px'></i><span>会话置顶</span>",
          click: (e, instance, hide) => {
            // console.log(e, instance, hide) // 此instance非IMUI，且IMUI在该instance里
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              // lastContent: null
              lastContent: '[置顶]',
              lastContentType: 'event',
              lastSendTime: Date.now()
            })
            hide()
          }
        },
        {
          text: "<i class='el-icon-close-notification' style='margin-right:10px'></i><span>消息免打扰</span>",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null,
              lastContentType: '',
              lastSendTime: 0
            })
            hide()
          }
        },
        {
          text: " <el-divider></el-divider><i class='el-icon-circle-close' style='color:#F56C6C' ><span style='padding-left:10px;'>退出聊天室</span></i>",
          click: (e, instance, hide) => {
            return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null
            })
            hide()
          },
          visible: (instance) => instance.contact.is_group == 1 &&
            instance.contact.uid != this.user.id

        }
      ],
      friend_group: []
    }
  },
  watch: {
    multiMessage(val) {
      // .html( htmlString ) 用来设置每个匹配元素的一个HTML 字符串
      document.getElementById('checkMessage').innerHTML = `<span>${val.length}</span>`
      // $('#checkMessage').html('<span>' + val.length + '</span>')
    }
  },
  created() {
    var _this = this
    document.onkeydown = function (e) {
      const { IMUI } = _this.$refs
      // 按下回车提交
      const key = window.event.keyCode
      // 事件中keycode=13为回车事件
      if (
        _this.settingDialogData.sendText == 'Enter' &&
        key == 13 &&
        e.ctrlKey
      ) {
        let message = IMUI.getEditorValue()
        message = message + '\n\n'
        IMUI.setEditorValue(message)
        _this.keepLastIndex(e.target)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.chatMain
  ::v-deep
  .el-autocomplete-suggestion
  .el-autocomplete-suggestion__list
  li {
  padding: 0px;
}
.chatMain
  ::v-deep
  .el-autocomplete-suggestion
  .el-autocomplete-suggestion__wrap {
  margin-right: 0px;
}
.chatMain ::v-deep .lemon-editor__emoji-item {
  cursor: pointer;
  width: 30px;
  padding: 4px;
  border-radius: 4px;
}
.chatMain ::v-deep .lemon-message-text .lemon-message__content img {
  width: 22px;
  height: 18px;
  display: inline-block;
  background: transparent;
  position: relative;
  top: -1px;
  padding: 0 2px;
  vertical-align: middle;
}
.chatMain ::v-deep .lemon-wrapper--theme-blue .lemon-menu {
  background-color: #409eff;
}
.chatMain ::v-deep .search-icon {
  cursor: pointer;
  font-size: 17px;
  vertical-align: middle;
}
.text ::v-deep .el-dialog__header {
  display: none;
}
.text ::v-deep .el-dialog__body {
  padding: 0;
  height: 0;
  overflow-y: visible;
}
.chatMain ::v-deep .multi-select {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid #f5f5f5;
}
.chatMain ::v-deep .multi-select .multi-main {
  margin-top: 10px;
}
.chatMain ::v-deep .multi-select .multi-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #878484;
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 10px;
}
.chatMain ::v-deep .multi-select .multi-main .btn-group {
  display: inline-block;
  width: 70px;
  height: 70px;
  margin-right: 15px;
}

.chatMain ::v-deep .multi-select .multi-main .btn-group .multi-icon {
  width: 60px;
  height: 60px;
  font-size: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 50%;
  margin: 0 auto;
  border: 1px solid transparent;
  cursor: pointer;
}
.chatMain ::v-deep .multi-select .multi-main .btn-group .multi-icon:hover {
  color: red;
  border: 1px solid red;
  font-size: 20px;
}
.chatMain ::v-deep .multi-select .multi-main .btn-group p {
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
}

.chatMain .multiContact ::v-deep .el-checkbox__label {
  display: none;
}

.chatMain .multiContact ::v-deep .el-checkbox__label {
  display: none;
}

.chatMain ::v-deep .el-image__preview {
  display: none;
}

.chatMain ::v-deep .el-image__error {
  display: none;
}
</style>

<style lang="scss">
.content a {
  pointer-events: none;
  cursor: pointer;
}

.slot-group {
  width: 200px;
  border-left: 1px solid #ddd;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;

  .slot-search {
    margin: 5px 0;
  }
}

.slot-group-notice {
  color: #999;
  height: 100px;
  overflow: hidden;
  padding: 6px 0;
  font-size: 12px;
  line-height: 15px;
}

.slot-group-title {
  font-size: 14px;
  color: #000;
}

.slot-group-member {
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 10px;
}

.slot-group-menu span {
  display: inline-block;
  cursor: pointer;
  color: #888;
  margin: 4px 30px 0 0;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #000;
    border-color: #333;
  }
}

.slot-contact-fixedtop {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.slot-search {
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #bbb;
  padding: 5px 10px;
}
</style>
