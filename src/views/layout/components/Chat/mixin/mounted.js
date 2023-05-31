import EmojiData from '../database/emoji'
export default {
  mounted() {
    this.$nextTick(() => {
      const { IMUI } = this.$refs
      this.$watch(
        function () {
          // console.log(IMUI.$refs.editor.$refs);
          return IMUI.$refs.editor.$refs.textarea.textContent
        },
        (val, oval) => {
          // console.log(val);
        },
        {
          deep: true
        }
      )
      // 初始化表情包。
      IMUI.initEmoji(EmojiData)
      IMUI.setLastContentRender('forward', (message) => <span>[会话记录]</span>)
      IMUI.setLastContentRender('video', (message) => <span>[视频]</span>)
      IMUI.setLastContentRender('link', (message) => <span>[链接]</span>)
      IMUI.setLastContentRender('order', (message) => <span>[订单]</span>)
      IMUI.setLastContentRender('goods', (message) => <span>[商品]</span>)
      // 初始化工具栏
      IMUI.initEditorTools([
        {
          name: 'emoji'
        },
        {
          name: 'voice',
          click: () => this.$message({ showClose: true, message: '暂未支持语音消息，敬请期待', type: 'error' }),
          title: '语音上传',
          render: () => <svg-icon class-name="search-icon" icon-class="voice" />
        },
        {
          name: 'uploadImage',
          click: () => {
            // return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            this.$refs.picUploadCom.$refs.fileUpload.$children[0].$refs.input.click()
          }
        },
        {
          name: 'uploadVideo',
          click: () => {
            return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            this.$refs.videoUploadCom.$refs.fileUpload.$children[0].$refs.input.click()
          },
          title: '视频上传',
          render: () => <svg-icon class-name="search-icon" icon-class="video" />
        },
        {
          name: 'uploadFile',
          click: () => {
            return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            this.$refs.fileUploadCom.$refs.fileUpload.$children[0].$refs.input.click()
          }
        },
        {
          name: 'link',
          click: () => {
            return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            this.linkMessageDialogData.visible = true
          },
          title: '链接上传',
          render: () => <svg-icon class-name="search-icon" icon-class="chat_link" />
        },
        {
          name: 'history_message',
          isRight: true,
          title: '历史记录',
          click: () => {
            // return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            this.historyMessageDialogData.visible = true
            this.$refs.historyMessageRef.init()
          },
          render: () => (
            <svg-icon class-name="search-icon" icon-class="history_message" />
          )
        }
      ])
      IMUI.initMenus([
        {
          name: 'messages'
        },
        {
          name: 'contacts'
          // click: () => this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
        },
        {
          name: 'setting',
          title: '设置',
          unread: 0,
          click: () => {
            // return this.$message({ message: '功能未开放，敬请期待！', type: 'warning' })
            this.settingDialogData.visible = true
          },
          render: (menu) => <i class="el-icon-setting"></i>,
          isBottom: true
        }
      ])
      this.initMultiMenu()

      // const that = this
      // $(
      //   "#app > div > div.chatMain > div > div > div.el-dialog__body > div.lemon.lemon-wrapper.lemon-wrapper--theme-blue > div:nth-child(3) div.lemon-sidebar__scroll"
      // ).remove();

      // $(".lemon-editor__input").on("DOMCharacterDataModified", function(e) {
      // let content = $(".lemon-editor__input").text();
      // if (content.charAt(content.length - 1) === "@") {
      //   console.log(1);
      //   console.log($("#linyiyuan"));
      //   if ($("#linyiyuan").length > 0) {
      //     console.log(123);
      //     $("#linyiyuan").show();
      //     return;
      //   }

      //   let imgTag = `<div id="linyiyuan" class="linyiyuan" style="position: absolute;top: 20px;left: 20px;"><select><option>用户1</option><option>用户2</option><option>用户3</option><option>用户4</option><option>用户5</option></select><div>`;
      //   that.insertContent(imgTag);
      // } else {
      //   console.log(2);
      //   $("#linyiyuan").hide();
      // }
      // });
      // document.onkeyup = e => {
      //   if (e.shiftKey && e.key == "@") {
      //     let imgTag = `<div id="linyiyuan" class="linyiyuan" style="position: absolute;top: 20px;left: 20px;"><select><option>用户1</option><option>用户2</option><option>用户3</option><option>用户4</option><option>用户5</option></select><div>`;
      //     that.insertContent(imgTag);
      //   } else {
      //     $("#linyiyuan").hide();
      //   }
      // };
    })
  }
}
