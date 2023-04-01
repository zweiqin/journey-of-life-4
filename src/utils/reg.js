/*
 * @Name: reg
 * @Author: zzw
 * @Date: 2022-04-16 14:16:40
 * @LastEditors: zzw
 * @LastEditTime: 2022-04-18 11:29:05
 * @Description: 正则
 */

// 非0整数正则
export const regInt = /^[1-9]\d*$/
// 0, 正整数正则
export const regZero = /^(0|[1-9][0-9]*)$/
// >0的数字, 最多2位小数正则
export const regFloat = /^0\.\d{0,2}$|^[1-9]\d*\.\d{0,2}$|^[1-9]\d*$/
// 整数位最多十位，小数为最多为两位，可以无小数位
export const regMoney = /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/
