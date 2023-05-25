import Vue from 'vue'
import * as tipTools from './tipTools'

Vue.prototype.$tableCommonOptions = {
  stripe: true,
  size: 'small',
  border: true,
  fit: true,
  highlightCurrentRow: true,
}

Object.keys(tipTools).forEach(key => {
  Vue.prototype[`$${key}`] = tipTools[key]
})
