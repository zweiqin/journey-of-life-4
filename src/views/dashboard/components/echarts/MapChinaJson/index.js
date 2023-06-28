var dataMap = [
	{
		areaId: 'CN-9684',
		areaColor: '#90baf2',
		areaName: '天津市',
		selected: false
	},
	{
		areaId: 'CN-1',
		areaColor: '#458ef1',
		areaName: '上海市',
		selected: false
	},
	{
		areaId: 'CN-43459',
		areaColor: '#5c9bf1',
		areaName: '青海省',
		selected: false
	},
	{
		areaId: 'CN-18757',
		areaColor: '#ccd9eb',
		areaName: '新疆',
		selected: false
	},
	{
		areaId: 'CN-19840',
		areaColor: '#5c9bf1',
		areaName: '江苏省',
		selected: false
	},
	{
		areaId: 'CN-21395',
		areaColor: '#458ef1',
		areaName: '江西省',
		selected: false
	},
	{
		areaId: 'CN-33784',
		areaColor: '#90baf2',
		areaName: '甘肃省',
		selected: false
	},
	{
		areaId: 'CN-11966',
		areaColor: '#a7c7f2',
		areaName: '山东省',
		selected: false
	},
	{
		areaId: 'CN-41593',
		areaColor: '#90baf2',
		areaName: '陕西省',
		selected: false
	},
	{
		areaId: 'CN-3475',
		areaColor: '#76abf4',
		areaName: '北京市',
		selected: false
	},
	{
		areaId: 'CN-31233',
		areaColor: '#2e81f3',
		areaName: '湖南省',
		selected: false
	},
	{
		areaId: 'CN-15591',
		areaColor: '#276fd3',
		areaName: '广东省',
		selected: true
	},
	{
		areaId: 'CN-10215',
		areaColor: '#76abf4',
		areaName: '安徽省',
		selected: false
	},
	{
		areaId: 'CN-3815',
		areaColor: '#a7c7f2',
		areaName: '吉林省',
		selected: false
	},
	{
		areaId: 'CN-40518',
		areaColor: '#2e81f3',
		areaName: '重庆市',
		selected: false
	},
	{
		areaId: 'CN-17313',
		areaColor: '#2a78e3',
		areaName: '广西',
		selected: false
	},
	{
		areaId: 'CN-29887',
		areaColor: '#5c9bf1',
		areaName: '湖北省',
		selected: false
	},
	{
		areaId: 'CN-35288',
		areaColor: '#2a78e3',
		areaName: '福建省'
	},
	{
		areaId: 'CN-29627',
		areaColor: '#2467c3',
		areaName: '海南省',
		selected: false
	},
	{
		areaId: 'CN-237',
		areaColor: '#458ef1',
		areaName: '云南省',
		selected: false
	},
	{
		areaId: 'CN-28009',
		areaColor: '#276fd3',
		areaName: '浙江省',
		selected: false
	},
	{
		areaId: 'CN-38897',
		areaColor: '#a7c7f2',
		areaName: '辽宁省',
		selected: false
	},
	{
		areaId: 'CN-1815',
		areaColor: '#ccd9eb',
		areaName: '内蒙古',
		selected: false
	},
	{
		areaId: 'CN-43919',
		areaColor: '#a7c7f2',
		areaName: '黑龙江省',
		selected: false
	},
	{
		areaId: 'CN-14059',
		areaColor: '#90baf2',
		areaName: '山西省',
		selected: false
	},
	{
		areaId: 'CN-4771',
		areaColor: '#2e81f3',
		areaName: '四川省',
		selected: false
	},
	{
		areaId: 'CN-36492',
		areaColor: '#5c9bf1',
		areaName: '西藏',
		selected: false
	},
	{
		areaId: 'CN-23078',
		areaColor: '#90baf2',
		areaName: '河北省',
		selected: false
	},
	{
		areaId: 'CN-9947',
		areaColor: '#a7c7f2',
		areaName: '宁夏',
		selected: false
	},
	{
		areaId: 'CN-25475',
		areaColor: '#76abf4',
		areaName: '河南省',
		selected: false
	},
	{
		areaId: 'CN-37257',
		areaColor: '#2a78e3',
		areaName: '贵州省',
		selected: false
	},
	{
		areaId: 'CN-49921',
		areaColor: '#2a78e3',
		areaName: '台湾省',
		selected: false
	}
]

var dataList = dataMap.map(function (item) {
	const i = {
		name: item.areaName.replace(/['市','省']/g, ''),
		value: 0,
		itemStyle: {
			areaColor: item.areaColor
		},
		emphasis: {
			label: {
				normal: {
					show: false
				}
			},
			itemStyle: {
				normal: {
					areaColor: '#e95d20',
					opacity: 0.8
				}
			}
		},
		selected: item.selected
	}
	return i
})

dataList.push({
	name: '南海诸岛',
	value: 0,
	itemStyle: {
		areaColor: '#ccd9eb'
	}
})

export default dataList
