export default {

	// 时间戳转时间
	setStringDate(time) {
		if (time === undefined || time === '') {
			return ''
		}
		const date = new Date(time)
		const y = date.getFullYear()
		const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
		const d = date.getDate()
		const H = date.getHours()
		const M = date.getMinutes()
		const S = date.getSeconds()
		return `${y}-${m}-${d} ${H}:${M}:${S}`
	},

	// 拼接时间字符串
	splicingDate(time) {
		if (time === undefined || time === null || time.length !== 14) {
			return ''
		}
		return time.substring(0, 4) + '-' +
      time.substring(4, 6) + '-' +
      time.substring(6, 8) + ' ' +
      time.substring(8, 10) + ':' +
      time.substring(10, 12) + ':' +
      time.substring(12, 14)
	},

	// 拼接展示图片url
	splicingImgUrl() {
		return process.env.BASE_PIC_API
	},
	seamingImgUrl(url) {
		if (!url) return ''
		return url.startsWith('https://') ? url : process.env.BASE_PIC_API + url
	},
	shearingImgUrl(url) {
		if (!url) return ''
		return url.startsWith(process.env.BASE_PIC_API) ? url.substring(process.env.BASE_PIC_API.length) : url
	}
}
