import request from '@/utils/request'

// 单级分类查询
export function customerCategorySingleStage(params) {
	return request({
		url: '/dtsCustomerCategory/singleStage',
		method: 'get',
		params
	})
}

// 分类树查询
export function customerCategoryTree(params) {
	return request({
		url: '/dtsCustomerCategory/categoryTree',
		method: 'get',
		params
	})
}

// 根据分类ID查询
export function customerCategorySelectId(params) {
	return request({
		url: '/dtsCustomerCategory/selectId',
		method: 'get',
		params
	})
}

// 新增分类
export function customerCategoryAddCategory(data) {
	return request({
		url: '/dtsCustomerCategory/addCategory',
		method: 'post',
		data
	})
}

// 修改分类
export function customerCategoryUpdateCategory(data) {
	return request({
		url: '/dtsCustomerCategory/updateCategory',
		method: 'post',
		data
	})
}

// 删除分类
export function customerCategoryDelete(params) {
	return request({
		url: `/dtsCustomerCategory/delete/${params.id}`,
		method: 'delete'
	})
}
