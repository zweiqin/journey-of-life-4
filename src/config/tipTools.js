import { Message, MessageBox, Loading, Notification } from 'element-ui'

export function elMessage(message = '操作成功', type = 'success', ...options) {
  Message({
    showClose: true,
    message,
    type,
    duration: 2000,
    ...options
  })
}

export function elConfirm(message = '确认更改?', title = '提示', ...options) {
  return new Promise((resolve) => {
    MessageBox.confirm(message, title, {
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      closeOnClickModal: false, // 是否可通过点击遮罩关闭
      closeOnPressEscape: false, // 是否可通过按下 ESC 键关闭
      confirmButtonText: '确定',
      type: 'warning',
      ...options
    }).then(() => {
      resolve(true);
    }).catch(() => {})
  })
}

export function elAlert(message, title = '提示', ...options) {
  return new Promise((resolve) => {
    MessageBox.alert(message, title, {
      dangerouslyUseHTMLString: true,
      closeOnClickModal: false, // 是否可通过点击遮罩关闭
      closeOnPressEscape: false, // 是否可通过按下 ESC 键关闭
      ...options,
      callback: (action) => {
        if (action === 'confirm') {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    }).then().catch(() => {});
  })
}

export function elNotification(message, type = 'warning') {
  Notification({
    title: '警告',
    message,
    duration: 3000,
    type
  })
}

// 封装loading
export function elLoading(text = '提交中，请稍候……') {
  return Loading.service({
    lock: true,
    text,
    spinner: 'el-icon-loading',
    background: 'rgba(256, 256, 256, 0.7)'
  });
}

/**
 * 拒绝窗口
 *showCancelButton	是否显示取消按钮	boolean	—	false（以 confirm 和 prompt 方式调用时为 true）
  showConfirmButton	是否显示确定按钮	boolean	—	true
  cancelButtonText	取消按钮的文本内容	string	—	取消
  confirmButtonText	确定按钮的文本内容	string	—	确定
  cancelButtonClass	取消按钮的自定义类名	string	—	—
  confirmButtonClass	确定按钮的自定义类名	string
  showInput	是否显示输入框	boolean	—	false（以 prompt 方式调用时为 true）
  inputPlaceholder	输入框的占位符	string	—	—
  inputType	输入框的类型	string	—	text
  inputValue	输入框的初始文本	string	—	—
  inputPattern	输入框的校验表达式	regexp	—	—
  inputValidator	输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage	function	—	—
  inputErrorMessage	校验未通过时的提示文本	string	—	输入的数据不合法!
 */
export function elPrompt(clues = '', prompyConfig = {}) {
  return new Promise((resolve) => {
    MessageBox.prompt(clues, prompyConfig.title || '提示', {
      dangerouslyUseHTMLString: true,
      closeOnClickModal: false, // 是否可通过点击遮罩关闭
      closeOnPressEscape: false, // 是否可通过按下 ESC 键关闭
      inputPlaceholder: '请输入',
      inputType: 'textarea',
      ...prompyConfig
    }).then(({ value }) => {
      resolve(value || '')
    }).catch(() => {})
  })
}


// 表单验证
export function validatorForm(formName) {
  return new Promise((resolve) => {
    this.$refs[formName].validate((valid) => {
      if (valid) {
        resolve()
      } else {
        elMessage('请输入相关信息', 'warning')
        return false
      }
    })
  })
}
