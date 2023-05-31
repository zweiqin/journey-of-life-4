<template>
  <div>
    <el-upload
      ref="fileUpload"
      style="display:none"
      :action="action"
      :data="dataObj"
      :headers="headers"
      list-type="text"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    ></el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { fileByBase64, generateUUID } from '@/utils/functions'
export default {
  name: 'FileUpload',
  props: {
    value: String,
    savePath: {
      default: 'test'
    }
  },
  data() {
    return {
      dataObj: {
        savePath: this.savePath,
        messageId: ''
      },
      dialogVisible: false,
      action:
        process.env.VUE_APP_BASE_API + 'laboratory/chat_module/upload_file',
      headers: { Authorization: 'Bearer ' + getToken() }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1)
      }
      return null
    },
    fileList() {
      return [
        {
          name: this.imageName,
          url: this.imageUrl
        }
      ]
    },
    showFileList: {
      get() {
        return (
          this.value !== null && this.value !== '' && this.value !== undefined
        )
      },
      set(newValue) {}
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('')
    },
    handlePreview(file) {
      this.dialogVisible = true
    },
    handleUploadSuccess(res, file) {
      const data = res.data
      this.showFileList = true
      this.fileList.pop()
      this.fileList.push({ name: data.fileName, url: data.url })
      this.emitInput(this.fileList[0].url)
      this.$parent.$parent.afterFileUpload(res, file)
    },
    handleBeforeUpload(file) {
      this.dataObj.messageId = generateUUID()
      this.$parent.$parent.beforeFileUpload(file, this.dataObj, 'file')
    }
  }
}
</script>

<style>
</style>

