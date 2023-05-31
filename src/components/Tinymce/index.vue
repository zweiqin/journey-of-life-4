<template>
  <div class="tinymce-container editor-container">
    <textarea :id="tinymceId" v-model="value" class="tinymce-textarea"></textarea>
    <div class="editor-custom-btn-container"></div>
  </div>
</template>

<script>
// import '../../../public/static/tinymce4.7.5/langs/zh_CN' // 无需引入，init的时候会自动找tinymce下的langs下的该文件
// import './zh_CN'
// import { uploadPic } from '@/api/common/upload'
import { createStorage } from '@/api/business/storage'

// const plugins = [
//   `advlist anchor autolink autosave code codesample colorpicker colorpicker
//   contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime
//   legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace
//   spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount`
// ]
const plugins = [
  `advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount`
]
// const toolbar = [
//   `bold italic underline strikethrough alignleft aligncenter
//   alignright outdent indent  blockquote undo redo removeformat`,
//   `hr bullist numlist link image charmap	 preview anchor pagebreak
//     fullscreen insertdatetime media table forecolor backcolor`
// ]
const toolbar = [
  'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
]
export default {
  name: 'Tinymce',
  components: {},
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    hasMenubar: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 360
    },
    width: {
      type: Number,
      required: false,
      default: 720
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  mounted() {
    this.initTinymce()
  },
  // activated() {
  //   this.initTinymce()
  // },
  // deactivated() {
  //   this.destroyTinymce()
  // },
  unmounted() {
    this.destroyTinymce()
  },
  methods: {
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        width: this.width,
        height: this.height,
        language: 'zh_CN',
        convert_urls: false, // 为false则不会自动处理URL
        body_class: 'panel-body ',
        object_resizing: true,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.hasMenubar,
        plugins,
        // contextmenu: 'align backcolor blockformats bold codeformat copy cut forecolor formats fontformats fontsizes italic language lineheight newdocument paste redo removeformat selectall strikethrough subscript superscript underline undo visualaid | a11ycheck | code | advtablesort advtablerownumbering | anchor | restoredraft | casechange | charmap | checklist | code | codesample | addcomment deleteallconversations showcomments | emoticons | export | fullpage | fullscreen | help | hr | image | insertdatetime | link openlink unlink | media | nonbreaking | pagebreak | pageembed | pastetext | configurepermanentpen permanentpen | preview | print | searchreplace | spellchecker spellcheckerlanguage | inserttable inserttabledialog tableprops deletetable cell tablemergecells tablesplitcells tablecellprops column tableinsertcolumnbefore tableinsertcolumnafter tablecutcolumn tablecopycolumn tablepastecolumnbefore tablepastecolumnafter tabledeletecolumn row tableinsertrowbefore tableinsertrowafter tablecutrow tablecopyrow tablepasterowbefore tablepasterowafter tablerowprops tabledeleterow tableclass tablecellclass tablecellvalign tablecellborderwidth tablecellborderstyle tablecaption tablecellbackgroundcolor tablecellbordercolor tablerowheader tablecolheader | template | insertfile | toc | visualblocks | visualchars | wordcount',
        contextmenu: 'copy cut paste | link image inserttable | cell row column deletetable',
        end_container_on_empty_block: false, // 如果设为true，在空的元素中按下回车键将拆分该元素
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        // images_upload_url: 'http://xxx',
        // 使用 images_upload_handler 可自定义上传处理逻辑。使用该配置，则无需使用其他上传配置选项。
        images_upload_handler: (blobInfo, success, failure) => {
          const fd = new FormData()
          fd.append('file', blobInfo.blob())
          createStorage(fd)
            // uploadPic(fd)
            .then((res) => {
              const result = res.data
              success(result.url)
            })
            // .catch((err) => {})
            .catch(() => {
              failure('上传失败，请重新上传')
            })
        },
        link_title: false,
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        }
      })
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach((v) => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}

.tinymce-container ::v-deep .mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 20px;
  top: 2px;
  /*z-index: 2005;*/
}

.editor-upload-btn {
  display: inline-block;
}
</style>
