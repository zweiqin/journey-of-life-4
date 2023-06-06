import request from '@/utils/request'

export function listGet(query) {
	return request({
		url: '/paintAlbum/list',
		method: 'get',
		params: query
	})
}

// 创建画册
export function listCreate(data) {
	return request({
		url: '/paintAlbum/create',
		method: 'post',
		data
	})
}
// 修改画册
export function listUpdata(data) {
	return request({
		url: '/paintAlbum/update',
		method: 'post',
		data
	})
}
// 删除画册
export function listDeleted(data) {
	return request({
		url: '/paintAlbum/delete',
		method: 'post',
		data
	})
}

// 获取画册对应的图片列表
export function getListImage(params) {
	return request({
		url: '/imgAlbum/list',
		method: 'get',
		params
	})
}

// 获取画册对应的图片详情
export function listImageDetail(params) {
	return request({
		url: '/imgAlbum/detail',
		method: 'get',
		params
	})
}

// 添加画册对应的图片
export function listImageAdd(data) {
	return request({
		url: '/imgAlbum/create',
		method: 'post',
		data
	})
}

// 修改画册对应的图片
export function listImageUpdate(data) {
	return request({
		url: '/imgAlbum/update',
		method: 'post',
		data
	})
}

// 删除画册对应的图片
export function listImageDelete(data) {
	return request({
		url: '/imgAlbum/delete',
		method: 'post',
		data
	})
}

// 图片上传路径
const uploadPath = process.env.BASE_API + '/storage/create'
export { uploadPath }

// 后面的方法暂时保留，在画册开发完毕后考虑等待后期优化还是直接删除
export function listDelete(data) {
	return request({
		url: '/paintAlbum/delete',
		method: 'post',
		data
	})
}

export function listDetail(id) {
	return request({
		url: '/paintAlbum/detail',
		method: 'get',
		params: { id }
	})
}

export function listedit(data) {
	return request({
		url: '/paintAlbum/update',
		method: 'post',
		data
	})
}

export function publishPaintings(data) {
	return request({
		url: '/paintAlbum/create',
		method: 'post',
		data
	})
}
