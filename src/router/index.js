/* eslint-disable vue/max-len */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */

import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
		perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
		title: 'title'               the name show in submenu and breadcrumb (recommend set)
		icon: 'svg-name'             the icon show in the sidebar,
		noCache: true                if true ,the page will no be cached(default is false)
	}
**/

export const constantRouterMap = [
	{
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [
			{
				path: '/redirect/:path*',
				component: () => import('@/views/redirect/index')
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/dashboardBig',
		name: 'dashboardBig',
		component: () => import('@/views/dashboardBig/index'),
		hidden: true
	},
	{
		path: '/paintingshow_out',
		alwaysShow: true,
		name: 'paintingshow_out',
		component: () => import('@/views/painting/show'),
		hidden: true
	},
	{
		path: '/pictureShow_out',
		alwaysShow: true,
		name: 'pictureShow_out',
		component: () => import('@/views/painting/pictureShow'),
		hidden: true
	},
	{
		path: '/auth-redirect',
		component: () => import('@/views/login/authredirect'),
		hidden: true
	},

	{
		path: '/404',
		component: () => import('@/views/errorPage/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () => import('@/views/errorPage/401'),
		hidden: true
	},
	{
		path: '',
		component: Layout,
		redirect: 'homepage',
		_ROLES: [ 'ADMIN' ],
		children: [
			{
				path: 'homepage',
				component: () => import('@/views/dashboard/index'),
				name: 'Homepage',
				meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
			}
		]
	},
	{
		path: '/dashboard_out',
		alwaysShow: true,
		name: 'dashboard_out',
		component: () => import('@/views/dashboard/index'),
		hidden: true
	}
]

export default new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRouterMap
})

export const asyncRouterMap = [
	{
		path: '/memberSystem',
		component: Layout,
		alwaysShow: true,
		redirect: 'noredirect',
		meta: { title: '会员系统', icon: 'peoples', noCache: true },
		children: [
			{
				path: 'userManagement',
				component: () => import('@/views/children'),
				redirect: 'noredirect',
				alwaysShow: true,
				name: 'userManagement',
				meta: {
					title: '用户管理',
					icon: 'peoples'
				},
				children: [
					{
						path: 'memberList',
						component: () => import('@/views/user/user'),
						name: 'MemberList',
						meta: {
							perms: ['GET /admin/user/list', 'GET /admin/user/detailApprove', 'POST /admin/user/approveAgency'],
							title: '会员列表',
							icon: 'user',
							noCache: true
						}
					},
					{
						path: 'vipUser',
						component: () => import('@/views/user/vipUser'),
						name: 'vipUser',
						meta: {
							perms: ['GET /admin/user/levelList', 'GET /admin/user/detailApprove', 'POST /admin/user/approveAgency'],
							title: 'VIP会员管理',
							icon: 'people',
							noCache: true
						}
					},
					{
						path: 'address',
						component: () => import('@/views/user/address'),
						name: 'address',
						meta: {
							perms: [ 'GET /admin/address/list' ],
							title: '收货地址',
							icon: 'email',
							noCache: true
						}
					},
					{
						path: 'collect',
						component: () => import('@/views/user/collect'),
						name: 'collect',
						meta: {
							perms: [ 'GET /admin/collect/list' ],
							title: '会员收藏',
							icon: 'star',
							noCache: true
						}
					},
					{
						path: 'footprint',
						component: () => import('@/views/user/footprint'),
						name: 'footprint',
						meta: {
							perms: [ 'GET /admin/footprint/list' ],
							title: '会员足迹',
							icon: 'guide',
							noCache: true
						}
					},
					{
						path: 'history',
						component: () => import('@/views/user/history'),
						name: 'history',
						meta: {
							perms: [ 'GET /admin/history/list' ],
							title: '搜索历史',
							icon: 'drag',
							noCache: true
						}
					}
				]
			},
			{
				path: 'paymentManagement',
				component: () => import('@/views/children'),
				name: 'PaymentManagement',
				redirect: 'noredirect',
				alwaysShow: true,
				meta: {
					title: '款项',
					icon: 'money',
					noCache: true
				},
				children: [
					{
						path: 'userWithdrawalApplicationForm',
						component: () => import('@/views/paymentManagement/userWithdrawalApplicationForm'),
						name: 'userWithdrawalApplicationForm',
						meta: {
							perms: ['GET /admin/withdrawal/list', 'POST /admin/withdrawal/toExamine'],
							title: '用户提现审核表',
							noCache: true
						}
					},
					{
						path: 'withdrawalLogRecords',
						component: () => import('@/views/paymentManagement/withdrawalLogRecords'),
						name: 'withdrawalLogRecords',
						meta: {
							perms: [ 'GET /admin/withdrawalLogs/list' ],
							title: '提现日志',
							noCache: true
						}
					},
					{
						path: 'bankCardList',
						component: () => import('@/views/paymentManagement/bankCardList'),
						name: 'bankCardList',
						meta: {
							perms: [ 'GET /admin/withdrawalBank/list' ],
							title: '用户银行卡列表',
							noCache: true
						}
					},
					{
						path: 'userCommission',
						component: () => import('@/views/paymentManagement/userCommission'),
						name: 'UserCommission',
						meta: {
							perms: ['GET /admin/brokerage/list', 'POST /admin/brokerage/approve'],
							title: '用户佣金',
							noCache: true
						}
					}
				]
			},
			{
				path: 'RelationshipChainManagement',
				alwaysShow: true,
				component: () => import('@/views/children'),
				redirect: 'noredirect',
				meta: { title: '关系链管理', icon: 'tree', noCache: true },
				children: [
					{
						path: 'MarketingStores',
						component: () => import('@/views/RelationshipChainManagement/MarketingStores'),
						name: 'MarketingStores',
						meta: {
							title: '营销-门店',
							icon: 'tree-table',
							noCache: true,
							perms: ['POST /admin/smmanage/add', 'POST /admin/smmanage/delect', 'GET /admin/smmanage/smlist', 'GET /admin/smmanage/bdlist', 'GET /admin/smmanage/unlist']
						}
					},
					{
						path: 'StoreMember',
						component: () => import('@/views/RelationshipChainManagement/StoreMember'),
						name: 'StoreMember',
						meta: {
							title: '业务员-会员',
							icon: 'tree-table',
							noCache: true,
							perms: ['GET /admin/salesman/brandlist', 'GET /admin/salesman/userlist', 'POST /admin/bduser/add', 'POST /admin/bduser/delect', 'GET /admin/bduser/unlist']
						}
					},
					{
						path: 'salesmanManagement',
						component: () => import('@/views/RelationshipChainManagement/salesmanManagement'),
						name: 'salesmanManagement',
						meta: {
							title: '所属门店',
							icon: 'tree-table',
							noCache: true,
							perms: ['GET /admin/salesman/introsp', 'GET /admin/sexclusive/bdlist', 'POST /admin/sexclusive/delect']
						}
					},
					{
						path: 'MemberManagement',
						component: () => import('@/views/RelationshipChainManagement/MemberManagement'),

						name: 'MemberManagement',
						meta: {
							title: '所属会员',
							icon: 'tree-table',
							noCache: true,
							perms: ['GET /admin/brands/userlist', 'POST /admin/brands/delect']
						}
					}
				]
			}
		]
	},
	{
		path: '/goods',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		name: 'goodsManagement',
		meta: {
			perms: ['POST /admin/goods/update', 'POST /admin/goods/delete', 'POST /admin/goods/create', 'GET /admin/goods/list', 'GET /admin/goods/detail'],
			title: '商品管理',
			icon: 'tab'
		},
		children: [
			{
				path: 'goodsApproveList',
				component: () => import('@/views/goods/goodsApproveList'),
				name: 'GoodsApproveList',
				meta: {
					perms: ['GET /admin/adminGoods/list', 'POST /admin/goods/approve'],
					title: '商品审核',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'goodsCategory',
				component: () => import('@/views/goods/goodsCategory'),
				name: 'GoodsCategory',
				meta: {
					perms: ['GET /admin/category/list', 'POST /admin/category/create', 'GET /admin/category/read', 'POST /admin/category/update', 'POST /admin/category/delete'],
					title: '商品类目',
					icon: 'list',
					noCache: true
				}
			},
			{
				path: 'brandCategory',
				component: () => import('@/views/goods/brandCategory'),
				name: 'BrandCategory',
				hidden: true,
				meta: {
					perms: ['GET /admin/brand/list', 'GET /admin/brand/catAndAdmin'],
					title: '门店-商品类目',
					icon: 'list',
					noCache: true
				}
			},
			{
				path: 'brandCategoryShow',
				component: () => import('@/views/goods/brandCategoryShow'),
				name: 'BrandCategoryShow',
				hidden: true,
				meta: {
					perms: ['GET /admin/category/list', 'GET /admin/category/l1', 'GET /admin/category/l2', 'POST /admin/category/create', 'POST /admin/category/update', 'POST /admin/category/delete'],
					title: '门店-商品类目展示',
					icon: 'list',
					noCache: true
				}
			},
			{
				path: 'list',
				component: () => import('@/views/goods/list'),
				name: 'goodsList',
				meta: {
					perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
					title: '商品列表',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'brandList',
				component: () => import('@/views/goods/brandList'),
				name: 'brandGoodsList',
				hidden: true,
				meta: {
					perms: ['GET /admin/brand/list', 'GET /admin/brand/catAndAdmin'],
					title: '门店-商品',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'brandGoodsListShow',
				component: () => import('@/views/goods/brandGoodsListShow'),
				name: 'BrandGoodsListShow',
				hidden: true,
				meta: {
					perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
					title: '门店-商品展示',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'create',
				component: () => import('@/views/goods/create'),
				name: 'goodsCreate',
				hidden: true,
				meta: {
					perms: [ 'POST /admin/goods/create' ],
					title: '商品上架',
					icon: '',
					noCache: true
				}
			},
			{
				path: '',
				component: () => import('@/views/goods/edit'),
				name: 'goodsEdit',
				hidden: true,
				meta: {
					perms: ['GET /admin/goods/detail', 'POST /admin/goods/update', 'POST /admin/goods/catAndBrand'],
					title: '商品编辑',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'goodsComment',
				component: () => import('@/views/goods/comment'),
				name: 'GoodsComment',
				meta: {
					perms: ['GET /admin/comment/list', 'POST /admin/comment/delete'],
					title: '商品评论',
					icon: '',
					noCache: true
				}
			}
		]
	},
	{
		path: '/orderManagement',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		meta: {
			title: '订单管理',
			icon: 'shopping',
			noCache: true
		},
		children: [
			{
				path: 'orderList',
				component: () => import('@/views/orderManagement/orderList'),
				name: 'OrderList',
				meta: {
					perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/refund', 'POST /admin/order/reply', 'POST /admin/order/ship', 'GET /admin/order/listShipChannel'],
					title: '订单列表',
					icon: 'nested',
					noCache: true
				}
			}
		]
	},
	{
		path: '/operationManagement',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		meta: {
			title: '运营管理',
			icon: 'log',
			noCache: true
		},
		children: [
			{
				path: 'feedbackList',
				component: () => import('@/views/operationManagement/feedbackList'),
				name: 'FeedbackList',
				meta: {
					perms: [ 'GET /admin/feedback/list' ],
					title: '意见反馈',
					icon: 'message',
					noCache: true
				}
			},
			{
				path: 'issueList',
				component: () => import('@/views/operationManagement/issueList'),
				name: 'IssueList',
				meta: {
					perms: ['GET /admin/issue/list', 'POST /admin/issue/create', 'POST /admin/issue/update', 'POST /admin/issue/delete'],
					title: '通用问题',
					icon: 'qq',
					noCache: true
				}
			},
			{
				path: 'keyword',
				component: () => import('@/views/operationManagement/keyword'),
				name: 'keyword',
				meta: {
					perms: ['GET /admin/keyword/list', 'POST /admin/keyword/create', 'GET /admin/keyword/read', 'POST /admin/keyword/update', 'POST /admin/keyword/delete'],
					title: '关键词',
					icon: 'bug',
					noCache: true
				}
			},
			{
				path: 'region',
				component: () => import('@/views/operationManagement/region'),
				name: 'region',
				meta: {
					perms: [ 'GET /admin/region/list' ],
					title: '行政区域',
					icon: 'international',
					noCache: true
				}
			},
			{
				path: 'couponManagement',
				alwaysShow: true,
				component: () => import('@/views/children'),
				redirect: 'noredirect',
				meta: { title: '代金券管理', icon: '', noCache: true },
				children: [
					{
						path: 'couponManagementGive',
						component: () => import('@/views/couponManagement/give'),
						name: 'couponManagementGive',
						meta: {
							perms: [ 'GET /admin/circula/list' ],
							title: '转增记录',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'couponManagementOrder',
						component: () => import('@/views/couponManagement/order'),
						name: 'couponManagementOrder',
						meta: {
							perms: ['GET /admin/voucherRecord/list', 'POST /admin/hold/add'],
							title: '订单记录',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'couponManagementPossess',
						component: () => import('@/views/couponManagement/possess'),
						name: 'couponManagementPossess',
						meta: {
							perms: [ 'GET /admin/hold/list' ],
							title: '持有管理',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'couponManagementGiveCreate',
						component: () => import('@/views/couponManagement/giveCreate'),
						name: 'CouponManagementGiveCreate',
						hidden: true,
						meta: {
							perms: [ 'POST /admin/circula/circula' ],
							title: '转增创建',
							icon: '',
							noCache: true
						}
					}
				]
			}
		]
	},
	{
		path: '/applicationManagement',
		component: Layout,
		redirect: 'noredirect',
		meta: {
			title: '申请管理',
			icon: 'log',
			noCache: true
		},
		children: [
			{
				path: 'merchantSettlement',
				component: () => import('@/views/applicationManagement/merchantSettlement'),
				name: 'MerchantSettlement',
				meta: {
					perms: ['GET /admin/dtsUpgradeRequest/list', 'POST /admin/dtsUpgradeRequest/careful'],
					title: '商家入驻审核',
					noCache: true
				}
			},
			{
				path: 'marketingPlannerApplication',
				component: () => import('@/views/applicationManagement/marketingPlannerApplication'),
				name: 'marketingPlannerApplication',
				meta: {
					perms: ['GET /admin/dtsUpgradeRequest/list', 'POST /admin/dtsUpgradeRequest/marketing'],
					title: '策划师申请审核',
					noCache: true
				}
			},
			{
				path: 'regionalAgentApplication',
				component: () => import('@/views/applicationManagement/regionalAgentApplication'),
				name: 'regionalAgentApplication',
				meta: {
					perms: ['GET /admin/dtsUpgradeRequest/list', 'POST /admin/dtsUpgradeRequest/regionalAgent'],
					title: '区域代理申请审核',
					noCache: true
				}
			},
			{
				path: 'distributorReviewed',
				component: () => import('@/views/applicationManagement/distributorReviewed'),
				name: 'DistributorReviewed',
				meta: {
					perms: [ 'GET /admin/dtsDistribution/getByPage' ],
					title: '分销员审核',
					noCache: true
				}
			},
			{
				path: 'applicationRecord',
				component: () => import('@/views/children'),
				redirect: 'noredirect',
				name: 'ApplicationRecord',
				alwaysShow: true,
				meta: {
					title: '申请记录',
					noCache: true
				},
				children: [
					{
						path: 'administrativeBranch',
						component: () => import('@/views/applicationRecord/administrativeBranch'),
						name: 'administrativeBranch',
						meta: {
							perms: ['GET /admin/dtsAdmin/administrationList', 'GET /admin/dtsAdmin/areaUserList'],
							title: '行政-分公司',
							noCache: true
						}
					},
					{
						path: 'businessSalesman',
						component: () => import('@/views/applicationRecord/businessSalesman'),
						name: 'businessSalesman',
						meta: {
							perms: ['GET /admin/dtsAdmin/plannerList', 'GET /admin/dtsAdmin/businessUserList'],
							title: '业务-营销员',
							noCache: true
						}
					},
					{
						path: 'businessMerchant',
						component: () => import('@/views/applicationRecord/businessMerchant'),
						name: 'businessMerchant',
						meta: {
							perms: [ 'GET /admin/dtsAdmin/businessList' ],
							title: '业务-商户',
							noCache: true
						}
					}
				]
			},
			{
				path: 'ShopUpCreate',
				component: () => import('@/views/applicationManagement/ShopUpCreate'),
				name: 'ShopUpCreate',
				meta: {
					perms: ['POST /admin/userup/save', 'GET /admin/user/upList', 'GET /admin/userup/read'],
					title: '提交申请',
					icon: 'edit',
					noCache: true
				}
			},
			{
				path: 'advancedSalesmanApplication',
				component: () => import('@/views/applicationManagement/advancedSalesmanApplication'),
				name: 'advancedSalesmanApplication',
				meta: {
					perms: ['GET /admin/userup/pdlist', 'POST /admin/userup/manage'],
					title: '营销申请管理',
					icon: 'validCode',
					noCache: true
				}
			},
			{
				path: 'salesmanApplication',
				component: () => import('@/views/applicationManagement/salesmanApplication'),
				name: 'salesmanApplication',
				meta: {
					perms: ['GET /admin/userup/pdlist', 'POST /admin/userup/manage'],
					title: '门店申请管理',
					icon: 'validCode',
					noCache: true
				}
			},
			{
				path: 'applicationHistory',
				component: () => import('@/views/applicationManagement/history'),
				name: 'applicationHistory',
				meta: {
					perms: ['POST /admin/userup/list', 'GET /admin/dtsStoreType/typeTree', 'GET /admin/role/options'],
					title: '申请表查询',
					icon: 'skill',
					noCache: true
				}
			},
			{
				path: 'UpHistory',
				component: () => import('@/views/applicationManagement/UpHistory'),
				name: 'UpHistory',
				meta: {
					perms: ['POST /admin/upRecord/list', 'POST /admin/userup/signin', 'POST /admin/userup/userUpVip', 'GET /admin/dtsStoreType/typeTree', 'GET /admin/role/options'],
					title: '升级记录表查询',
					icon: 'skill',
					noCache: true
				}
			}
		]
	},
	{
		path: '/brand',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		meta: {
			title: '门店管理', icon: 'shopping', noCache: true
		},
		children: [
			{
				path: 'brandInfo',
				component: () => import('@/views/brandManagement/brand'),
				name: 'brandInfo',
				meta: {
					perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
					title: '门店列表',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'brandSetting',
				component: () => import('@/views/brandManagement/brandSetting'),
				name: 'brandSetting',
				hidden: true,
				meta: {
					perms: ['GET /admin/brand/list', 'POST /admin/brand/update'],
					title: '门店信息配置(用户)',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'complain',
				component: () => import('@/views/brandManagement/complain'),
				name: 'complain',
				meta: {
					perms: ['GET /admin/dtsBrandInforms/selectComplaint', 'POST /admin/dtsBrandInforms/handle'],
					title: '投诉管理',
					noCache: true
				}
			},
			{
				path: 'balance',
				component: () => import('@/views/user/balance'),
				name: 'balance',
				meta: {
					title: '余额管理',
					icon: '',
					noCache: true
				},
				children: [
					{
						path: 'recharge',
						component: () => import('@/views/user/balance/recharge'),
						name: 'recharge',
						meta: {
							perms: ['GET /admin/buAccount/list', 'POST /admin/buAccount/topUp', 'POST /admin/buAccount/recharge'],
							title: '余额充值',
							icon: 'user',
							noCache: true
						}
					},
					{
						path: 'rechargeRecord',
						component: () => import('@/views/user/balance/rechargeRecord'),
						name: 'rechargeRecord',
						meta: {
							perms: [ 'GET /admin/brandBalance/list' ],
							title: '充值记录',
							icon: 'validCode',
							noCache: true
						}
					}
				]
			},
			{
				path: 'storeLevel',
				component: () => import('@/views/brandManagement/storeLevel'),
				name: 'storeLevel',
				meta: {
					perms: ['POST /admin/brandLevel/create', 'GET /admin/brandLevel/list', 'POST /admin/brandLevel/update', 'POST /admin/brandLevel/delete'],
					title: '门店等级配置',
					icon: '',
					noCache: true
				}
			}
		]
	},

	{
		path: '/customerServiceSystem',
		component: Layout,
		redirect: 'noredirect',
		name: 'CustomerServiceSystem',
		meta: {
			title: '客服系统',
			icon: 'logininfor'
		},
		children: [
			{
				path: 'problemClassificationList',
				component: () => import('@/views/customerServiceSystem/problemClassificationList'),
				name: 'ProblemClassificationList',
				meta: {
					title: '问题分类',
					icon: '',
					noCache: true,
					perms: ['GET /admin/dtsCustomerCategory/singleStage', 'GET /admin/dtsCustomerCategory/categoryTree', 'POST /admin/dtsCustomerCategory/addCategory', 'POST /admin/dtsCustomerCategory/updateCategory']
				}
			},
			{
				path: 'suggestionsList',
				component: () => import('@/views/customerServiceSystem/suggestionsList'),
				name: 'SuggestionsList',
				meta: {
					title: '建议列表',
					icon: '',
					noCache: true,
					perms: ['GET /admin/dtsCustomerFeedback/customerList', 'GET /admin/dtsCustomerFeedback/updateStatus']
				}
			}
		]
	},
	{
		path: '/configurationTable',
		alwaysShow: true,
		component: Layout,
		redirect: 'noredirect',
		meta: { title: '配置管理', icon: 'dict', noCache: true },
		children: [
			{
				path: 'upgradeMoney',
				component: () => import('@/views/configurationTable/upgradeMoney'),
				name: 'upgradeMoney',
				meta: {
					perms: ['POST /admin/upgradeMoney/update', 'POST /admin/upgradeMoney/delete', 'POST /admin/upgradeMoney/create', 'GET /admin/upgradeMoney/list', 'GET /admin/upgradeMoney/detail'],
					title: '升级金额',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'storeType',
				component: () => import('@/views/configurationTable/storeType'),
				name: 'storeType',
				meta: {
					perms: ['POST /admin/storeType/update', 'POST /admin/storeType/delete', 'POST /admin/storeType/create', 'GET /admin/storeType/list', 'GET /admin/storeType/detail'],
					title: '门店分类',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'brokerageInfo',
				component: () => import('@/views/configurationTable/brokerageInfo'),
				name: 'brokerageInfo',
				meta: {
					perms: ['POST /admin/brokerageInfo/update', 'POST /admin/brokerageInfo/delete', 'POST /admin/brokerageInfo/create', 'GET /admin/brokerageInfo/list', 'GET /admin/brokerageInfo/detail'],
					title: '佣金比例',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'coupon',
				component: () => import('@/views/configurationTable/coupon'),
				name: 'Coupon',
				meta: {
					perms: ['GET /admin/voucher/list', 'POST /admin/voucher/update'],
					title: '代金券设置',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'signIn',
				component: () => import('@/views/configurationTable/signIn'),
				name: 'signIn',
				meta: {
					perms: ['POST /admin/signInConfig/add', 'POST /admin/signInConfig/update', 'POST /admin/signInConfig/delete', 'GET /admin/signInConfig/list'],
					title: '签到设置',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'refundReview',
				component: () => import('@/views/configurationTable/refundReview'),
				name: 'refundReview',
				meta: {
					perms: ['GET /admin/dtsOrderRefunds/getRefundsList', 'POST /admin/dtsOrderRefunds/toExamine'],
					title: '退款审核',
					noCache: true
				}
			},
			{
				path: 'refundReason',
				component: () => import('@/views/configurationTable/refundReason'),
				name: 'refundReason',
				meta: {
					perms: ['GET /admin/dtsOrderRefundsReason/list', 'POST /admin/dtsOrderRefundsReason/add', 'POST /admin/dtsOrderRefundsReason/update'],
					title: '退款原因管理',
					noCache: true
				}
			},
			{
				path: 'distributionSetting',
				component: () => import('@/views/configurationTable/distributionSetting'),
				name: 'DistributionSetting',
				meta: {
					perms: ['GET /admin/dtsSettingController/get/DISTRIBUTION_SETTING', 'POST /admin/dtsSettingController/put/WECHAT_CONNECT'],
					title: '分销设置',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'userLevel',
				component: () => import('@/views/configurationTable/userLevel'),
				name: 'userLevel',
				meta: {
					perms: ['POST /admin/userLevel/update', 'POST /admin/userLevel/delete', 'POST /admin/userLevel/create', 'GET /admin/userLevel/list', 'GET /admin/userLevel/detail'],
					title: '用户等级配置',
					icon: '',
					noCache: true
				}
			}
		]
	},
	{
		path: '/sys',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		name: 'sysManage',
		meta: {
			title: '系统管理',
			icon: 'component'
		},
		children: [
			{
				path: 'iconManagement',
				component: () => import('@/views/children'),
				redirect: 'noredirect',
				alwaysShow: true,
				meta: {
					title: '图标管理',
					icon: '',
					noCache: true
				},
				children: [
					{
						path: 'iconList',
						component: () => import('@/views/iconManagement/iconList'),
						name: 'IconList',
						meta: {
							title: '图标列表',
							icon: '',
							noCache: true,
							perms: ['GET /admin/dtsGradePermission/h5IconList', 'POST /admin/dtsGradePermission/h5IconAdd', 'POST /admin/dtsGradePermission/h5IconUpdate']
						}
					},
					{
						path: 'iconAuthorization',
						component: () => import('@/views/iconManagement/iconAuthorization'),
						name: 'IconAuthorization',
						meta: {
							title: '图标授权',
							icon: '',
							noCache: true,
							perms: ['GET /admin/rolePermission/selectH5RoleEmpower', 'POST /admin/rolePermission/h5RoleEmpower']
						}
					}
				]
			},
			{
				path: 'admin',
				component: () => import('@/views/sys/admin'),
				name: 'admin',
				meta: {
					perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete', 'GET /admin/admin/read'],
					title: '管理员',
					icon: 'people',
					noCache: true
				}
			},
			{
				path: 'role',
				component: () => import('@/views/sys/role'),
				name: 'role',
				meta: {
					perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete', 'GET /admin/role/permissions', 'POST /admin/role/permissions', 'GET /admin/role/read'],
					title: '角色管理',
					icon: 'qq',
					noCache: true
				}
			},
			{
				path: 'os',
				component: () => import('@/views/sys/os'),
				name: 'os',
				meta: {
					perms: ['POST /admin/storage/update', 'POST /admin/storage/delete', 'POST /admin/storage/read', 'GET /admin/storage/list'],
					title: '对象存储',
					icon: 'lock',
					noCache: true
				}
			}
		]
	},
	{
		path: '/marketingManagement',
		component: Layout,
		redirect: 'noredirect',
		meta: { title: '营销管理', icon: 'table', noCache: true },
		children: [
			{
				path: 'preferentialManagement',
				component: () => import('@/views/preferentialManagement/preferentialManagement.vue'),
				name: 'PreferentialManagement',
				meta: {
					perms: ['GET /admin/coupon/list', 'GET /admin/coupon/listuser', 'POST /admin/coupon/create', 'POST /admin/coupon/update', 'POST /admin/coupon/delete'],
					title: '优惠卷管理',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'bookGoods',
				component: () => import('@/views/children'),
				meta: {
					title: '商品预约',
					icon: '',
					noCache: true
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/goods/bookGoods/list'),
						name: 'bookGoodsList',
						meta: {
							perms: ['GET /admin/appoint/list', 'POST /admin/goods/delete'],
							title: '预约商品列表',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'create',
						component: () => import('@/views/goods/bookGoods/create'),
						name: 'bookGoodsCreate',
						meta: {
							perms: ['POST /admin/appoint/add', 'GET /admin/coupon/list'],
							title: '预约商品上架',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'edit',
						component: () => import('@/views/goods/bookGoods/edit'),
						name: 'bookGoodsEdit',
						hidden: true,
						meta: {
							perms: ['POST /admin/appoint/update', 'GET /admin/appoint/detail', 'GET /admin/coupon/list'],
							title: '预约商品编辑',
							icon: '',
							noCache: true
						}
					}
					// {
					//   path: 'comment',
					//   component: () => import('@/views/goods/bookGoods/comment'),
					//   name: 'bookGoodsComment',
					//   meta: {
					//     perms: [],
					//     title: '预约商品评论',
					//     icon: '',
					//     noCache: true
					//   }
					// }
				]
			},
			{
				path: 'creditGoods',
				component: () => import('@/views/children'),
				meta: {
					title: '积分商品',
					icon: '',
					noCache: true
				},
				children: [
					{
						path: 'list',
						component: () => import('@/views/goods/creditGoods/list'),
						name: 'creditGoodsList',
						meta: {
							perms: ['GET /admin/integralGoods/list', 'POST /admin/integralGoods/delete'],
							title: '积分商品列表',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'create',
						component: () => import('@/views/goods/creditGoods/create'),
						name: 'creditGoodsCreate',
						meta: {
							perms: [ 'POST /admin/integralGoods/create' ],
							title: '积分商品上架',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'edit',
						component: () => import('@/views/goods/creditGoods/edit'),
						name: 'creditGoodsEdit',
						hidden: true,
						meta: {
							perms: ['GET /admin/integralGoods/detail', 'POST /admin/integralGoods/update'],
							title: '积分商品编辑',
							icon: '',
							noCache: true
						}
					}
				]
			},
			{
				path: 'groupBuyingManagement',
				component: () => import('@/views/children'),
				meta: {
					title: '拼团活动',
					icon: '',
					noCache: true
				},
				children: [
					{
						path: 'grouponRule',
						component: () => import('@/views/groupBuyingManagement/grouponRule'),
						name: 'grouponRule',
						meta: {
							perms: ['GET /admin/groupon/list', 'POST /admin/groupon/create', 'POST /admin/groupon/update', 'POST /admin/groupon/delete', 'GET /admin/groupon/listRecord'],
							title: '团购规则',
							icon: 'table',
							noCache: true
						}
					},
					{
						path: 'groupon-activity',
						component: () => import('@/views/groupBuyingManagement/grouponActivity'),
						name: 'grouponActivity',
						meta: {
							perms: [ 'GET /admin/groupon/listRecord' ],
							title: '团购活动',
							icon: 'theme',
							noCache: true
						}
					}
				]
			},
			{
				path: 'memberPackage',
				component: () => import('@/views/marketingManagement/memberPackage'),
				name: 'MemberPackage',
				meta: {
					perms: ['GET /admin/dtsPackageMember/memberList', 'POST /admin/rolePermission/add', 'POST /admin/dtsPackageMember/update', 'GET /admin/dtsPackageService/list', 'POST /admin/dtsPackageService/add', 'POST /admin/dtsPackageService/update'],
					title: '会员套餐',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'mapRedEnvelopeManagement',
				alwaysShow: true,
				component: () => import('@/views/children'),
				name: 'MapRedEnvelopeManagement',
				redirect: 'noredirect',
				meta: {
					title: '地图红包管理',
					icon: '',
					noCache: true
				},
				children: [{
					path: 'mapRedEnvelope',
					component: () => import('@/views/marketingManagement/mapRedEnvelope/mapRedEnvelope'),
					name: 'mapRedEnvelope',
					meta: {
						perms: ['GET /admin/adminDtsWrapRed/list', 'GET /admin/adminDtsWrapRed/redList'],
						title: '查询红包列表',
						icon: '',
						noCache: true
					}
				}, {
					path: 'listDiscountPapers',
					component: () => import('@/views/marketingManagement/mapRedEnvelope/listDiscountPapers'),
					name: 'listDiscountPapers',
					meta: {
						perms: [ 'GET /admin/adminDtsWrapRed/couponList' ],
						title: '查询优惠卷列表',
						icon: '',
						noCache: true
					}
				}]
			},
			{
				path: 'discountCouponManagement',
				// alwaysShow: true,
				component: () => import('@/views/children'),
				name: 'DiscountCouponManagement',
				meta: {
					title: '核销券',
					icon: '',
					noCache: true
				},
				children: [
					{
						path: 'coupon',
						component: () => import('@/views/discountCouponManagement/coupon'),
						name: 'coupon',
						meta: {
							perms: ['POST /admin/coupon/update', 'POST /admin/coupon/delete', 'POST /admin/coupon/create', 'GET /admin/coupon/list'],
							title: '核销优惠券',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'brandCoupon',
						component: () => import('@/views/discountCouponManagement/brandCoupon'),
						name: 'brandCoupon',
						hidden: true,
						meta: {
							perms: ['POST /admin/coupon/update', 'POST /admin/coupon/delete', 'POST /admin/coupon/create', 'GET /admin/coupon/list'],
							title: '门店-核销优惠券',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'brandCouponShow',
						component: () => import('@/views/discountCouponManagement/brandCouponShow'),
						name: 'brandCouponShow',
						hidden: true,
						meta: {
							perms: ['POST /admin/coupon/update', 'POST /admin/coupon/delete', 'POST /admin/coupon/create', 'GET /admin/coupon/list'],
							title: '门店-核销优惠券展示',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'couponDetail',
						component: () => import('@/views/discountCouponManagement/couponDetail'),
						name: 'couponDetail',
						hidden: true,
						meta: {
							perms: ['GET /admin/coupon/read', 'GET /admin/coupon/listuser'],
							title: '核销优惠券详情',
							icon: 'tab',
							noCache: true
						}
					},
					{
						path: 'couponCard',
						component: () => import('@/views/errorPage/developing'),
						name: 'couponCard',
						meta: {
							perms: [ '/admin/developing' ],
							title: '核销卡',
							icon: '',
							noCache: true
						}
					}
				]
			},
			{
				path: 'wiseManTask',
				component: () => import('@/views/marketingManagement/wiseManTask'),
				name: 'WiseManTask',
				meta: {
					perms: ['POST /admin/talentTask/upload', 'GET /admin/talentTask/list', 'GET /admin/talentTask/info', 'GET /admin/talentTask/update', 'GET /admin/talentTask/delete'],
					title: '达人任务',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'wiseManList',
				component: () => import('@/views/marketingManagement/wiseManList'),
				name: 'WiseManList',
				meta: {
					perms: ['POST /admin/talent/upload', 'GET /admin/talent/list', 'GET /admin/talent/info', 'GET /admin/talent/update'],
					title: '达人列表',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'flashSale',
				alwaysShow: true,
				component: () => import('@/views/errorPage/developing'),
				name: 'flashSale',
				meta: {
					perms: [ '/admin/developing' ],
					title: '限时抢购',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'CrosstownAllianceCard',
				alwaysShow: true,
				component: () => import('@/views/errorPage/developing'),
				name: 'CrosstownAllianceCard',
				meta: {
					perms: [ '/admin/developing' ],
					title: '同城联盟卡',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'tkb',
				component: () => import('@/views/errorPage/developing'),
				name: 'tkb',
				meta: {
					perms: [ '/admin/developing' ],
					title: '拓客宝',
					icon: '',
					noCache: true
				}
			}
		]
	},
	{
		path: '/dataStatisticsDashboard',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		name: 'dataStatisticsDashboard',
		meta: {
			title: '情报数据看板',
			icon: 'server'
		},
		hidden: false,
		children: [
			{
				path: '',
				component: () => import('@/views/digitalDashboard/informationSentry'),
				_ROLES: [ 'ADMIN' ],
				name: 'informationSentry',
				meta: {
					perms: [ '/admin/developing' ],
					title: '信息哨兵',
					icon: ''
				}
			},
			{
				path: '/performanceControlDashboard',
				component: () => import('@/views/digitalDashboard/performanceControlDashboard'),
				_ROLES: [ 'ADMIN' ],
				name: 'performanceControlDashboard',
				meta: {
					perms: [ '/admin/developing' ],
					title: '业绩看板',
					icon: ''
				}
			},
			{
				path: '/marketingToolsDashboard',
				component: () => import('@/views/digitalDashboard/marketingToolsDashboard'),
				_ROLES: [ 'ADMIN' ],
				name: 'marketingToolsDashboard',
				meta: {
					perms: [ '/admin/developing' ],
					title: '营销画像',
					icon: ''
				}
			},
			{
				path: '/userPortraitDashboard',
				component: () => import('@/views/digitalDashboard/userPortraitDashboard'),
				_ROLES: [ 'ADMIN' ],
				name: 'userPortraitDashboard',
				meta: {
					perms: [ '/admin/developing' ],
					title: '用户看板',
					icon: ''
				}
			},
			{
				path: 'stat',
				component: () => import('@/views/stat'),
				redirect: 'noredirect',
				alwaysShow: true,
				name: 'statManage',
				meta: {
					title: '统计',
					icon: ''
				},
				children: [
					{
						path: 'user',
						component: () => import('@/views/stat/user'),
						name: 'statUser',
						meta: {
							perms: [ 'GET /admin/stat/user' ],
							title: '用户统计',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'order',
						component: () => import('@/views/stat/order'),
						name: 'statOrder',
						meta: {
							perms: [ 'GET /admin/stat/order' ],
							title: '订单统计',
							icon: '',
							noCache: true
						}
					},
					{
						path: 'goods',
						component: () => import('@/views/stat/goods'),
						name: 'statGoods',
						meta: {
							perms: [ 'GET /admin/stat/goods' ],
							title: '商品统计',
							icon: '',
							noCache: true
						}
					}
					// ,
					// {
					// 	path: 'goods',
					// 	component: () => import('@/views/stat/goods'),
					// 	name: 'statGoods',
					// 	meta: {
					// 		// perms: [ 'GET /admin/stat/goods' ],
					// 		title: '总部统计',
					// 		icon: '',
					// 		noCache: true
					// 	}
					// }
				]
			}
		]
	},
	{
		path: '/brandingManagement',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		name: 'BrandingManagement',
		meta: {
			title: '品牌推广',
			icon: 'guide'
		},
		children: [
			{
				path: 'teachArticleManagement',
				component: () => import('@/views/articleManagement'),
				redirect: 'noredirect',
				alwaysShow: true,
				name: 'teachArticleManagement',
				meta: {
					title: '软文推广',
					icon: 'size'
				},
				children: [
					{
						path: 'teachArticleList',
						component: () => import('@/views/articleManagement/articleList'),
						name: 'teachArticleList',
						meta: {
							perms: ['GET /admin/richText/list', 'POST /admin/richText/delete'],
							title: '文章列表',
							icon: 'language',
							noCache: true
						}
					},
					{
						path: 'teachArticleCreate',
						component: () => import('@/views/articleManagement/articleCreate'),
						name: 'teachArticleCreate',
						meta: {
							perms: [ 'POST /admin/richText/create' ],
							title: '发布文章',
							icon: 'link',
							noCache: true
						}
					},
					{
						path: 'teachArticleEdit',
						component: () => import('@/views/articleManagement/articleEdit'),
						name: 'teachArticleEdit',
						hidden: true,
						meta: {
							perms: ['GET /admin/richText/detail', 'POST /admin/richText/update'],
							title: '文章编辑',
							icon: 'form',
							noCache: true
						}
					}
				]
			},
			{
				path: 'articleManagement',
				component: () => import('@/views/children'),
				redirect: 'noredirect',
				alwaysShow: true,
				name: 'articleManagement',
				meta: {
					title: '公告管理',
					icon: 'language'
				},
				children: [
					{
						path: 'articleList',
						component: () => import('@/views/brandingManagement/articleList'),
						name: 'articleList',
						meta: {
							perms: ['GET /admin/article/list', 'POST /admin/article/delete'],
							title: '公告列表',
							icon: 'language',
							noCache: true
						}
					},
					{
						path: 'articleCreate',
						component: () => import('@/views/brandingManagement/articleCreate'),
						name: 'articleCreate',
						meta: {
							perms: [ 'POST /admin/article/create' ],
							title: '发布公告',
							icon: 'link',
							noCache: true
						}
					},
					{
						path: 'articleEdit',
						component: () => import('@/views/brandingManagement/articleEdit'),
						name: 'articleEdit',
						hidden: true,
						meta: {
							perms: ['GET /admin/article/detail', 'POST /admin/article/update'],
							title: '公告通知编辑',
							icon: 'form',
							noCache: true
						}
					}
				]
			},
			{
				path: 'ad',
				component: () => import('@/views/brandingManagement/ad'),
				name: 'ad',
				meta: {
					perms: ['GET /admin/ad/list', 'POST /admin/ad/create', 'GET /admin/ad/read', 'POST /admin/ad/update', 'POST /admin/ad/delete'],
					title: '广告管理',
					icon: 'clipboard',
					noCache: true
				}
			},
			{
				path: 'topic',
				component: () => import('@/views/brandingManagement/topic'),
				name: 'topic',
				meta: {
					perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
					title: '专题管理',
					icon: 'icon',
					noCache: true
				}
			},
			{
				path: 'painting',
				component: () => import('@/views/children'),
				redirect: 'noredirect',
				alwaysShow: true,
				name: 'painting',
				meta: {
					title: '智能画册',
					icon: 'picture'
				},
				children: [
					{
						path: 'list',
						// component: () => import('@/views/painting/list'),
						component: () => import('@/views/painting/newList'),
						name: 'paintingList',
						meta: {
							title: '画册列表',
							icon: 'list',
							noCache: true
						},
						children: [
							{
								path: 'create',
								component: () => import('@/views/painting/create'),
								name: 'paintingCreate',
								hidden: true,
								meta: {
									perms: [ 'POST /admin/paintAlbum/create' ],
									title: '画册设置',
									icon: 'link',
									noCache: true
								}
							},
							{
								path: 'edit',
								component: () => import('@/views/painting/edit'),
								name: 'paintingEdit',
								hidden: true,
								meta: {
									perms: ['GET /admin/paintAlbum/detail', 'POST /paintAlbum/update'],
									title: '画册编辑',
									icon: 'form',
									noCache: true
								}
							},
							{
								path: 'imgcreate',
								component: () => import('@/views/painting/imgcreate'),
								name: 'imgcreate',
								hidden: true,
								meta: {
									perms: [ 'POST /admin/imgAlbum/create' ],
									title: '添加图片',
									icon: 'link',
									noCache: true
								}
							},
							{
								path: 'imgedit',
								component: () => import('@/views/painting/imgedit'),
								name: 'imgedit',
								hidden: true,
								meta: {
									perms: ['GET /admin/imgAlbum/detail', 'POST /admin/imgAlbum/update'],
									title: '图片编辑',
									icon: 'form',
									noCache: true
								}
							}
						]
					},
					{
						path: 'paintingshow',
						name: 'paintingshow',
						component: () => import('@/views/painting/show'),
						meta: {
							perms: ['GET /admin/imgAlbum/list', 'GET /admin/paintAlbum/list'],
							title: '画册展示',
							icon: 'form',
							noCache: true
						}
					},
					{
						path: 'pictureShow',
						component: () => import('@/views/painting/pictureShow'),
						name: 'pictureShow',
						hidden: true,
						meta: {
							perms: [ 'GET /admin/imgAlbum/list' ],
							title: '图片展示',
							icon: 'form',
							noCache: true
						}
					},
					{
						path: 'QRCode',
						name: 'QRCode',
						component: () => import('@/views/painting/QRCode'),
						meta: {
							perms: [ 'GET /admin/paintAlbum/list' ],
							title: '二维码生成',
							icon: 'wechat',
							noCache: true
						}
					}
				]
			}
		]
	},

	{
		path: '/salesManagement',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		meta: { title: '业务员管理', icon: 'log', noCache: true },
		children: [
			{
				path: 'salesInventory',
				component: () => import('@/views/salesManagement/salesInventory'),
				name: 'SalesInventory',
				meta: {
					perms: ['POST /admin/salesman/update', 'POST /admin/salesman/delete', 'GET /admin/salesman/bound', 'POST /admin/salesman/create', 'GET /admin/salesman/unBound', 'GET /admin/salesman/smlist'],
					title: '业务员清单',
					icon: '',
					noCache: true
				}
			},
			{
				path: '',
				component: () => import('@/views/salesManagement/salesList'),
				name: 'salesList',
				meta: {
					perms: ['GET /admin/brandSalesman/list', 'GET /admin/user/query', 'GET /admin/brand/query', 'POST /admin/brandSalesman/delete', 'POST /admin/brandSalesman/create', 'POST /admin/brandSalesman/update'],
					title: '业务员列表',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'subordinateManagement',
				component: () => import('@/views/salesManagement/subordinateManagement'),
				name: 'subordinateManagement',
				hidden: true,
				meta: {
					perms: [ 'GET /admin/brandSalesman/bidList' ],
					title: '所属业务员',
					icon: '',
					noCache: true
				}
			}
		]
	},
	{
		path: '/refuelingManagement',
		component: Layout,
		redirect: 'noredirect',
		meta: { title: '加油服务', icon: 'oil', noCache: true },
		children: [
			{
				path: 'oilCardList',
				component: () => import('@/views/refuelingManagement/oilCardList'),
				name: 'oilCardList',
				meta: {
					perms: ['POST /admin/tuanyou/querycompanyaccountamount', '/admin/tuanyou/changeoilcardamount', 'POST /admin/tuanyou/queryyoukalist'],
					title: '油卡列表',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'rechargeRecord',
				component: () => import('@/views/refuelingManagement/rechargeRecord'),
				name: 'rechargeRecord',
				meta: {
					perms: [ 'POST /admin/tuanyou/queryyoukaczlist' ],
					title: '充值记录',
					icon: '',
					noCache: true
				}
			}
		]
	},
	{
		path: '/stockSellStorage',
		component: Layout,
		redirect: 'noredirect',
		meta: { title: '进销存管理', icon: 'form', noCache: true },
		children: [
			{
				path: 'product',
				component: () => import('@/views/errorPage/developing'),
				name: 'product',
				meta: {
					perms: [ '/admin/developing' ],
					title: '产品',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'user',
				component: () => import('@/views/errorPage/developing'),
				name: 'user',
				meta: {
					perms: [ '/admin/developing' ],
					title: '用户',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'purchase',
				component: () => import('@/views/errorPage/developing'),
				name: 'purchase',
				meta: {
					perms: [ '/admin/developing' ],
					title: '采购',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'sell',
				component: () => import('@/views/errorPage/developing'),
				name: 'sell',
				meta: {
					perms: [ '/admin/developing' ],
					title: '销售',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'rdg',
				component: () => import('@/views/errorPage/developing'),
				name: 'rdg',
				meta: {
					perms: [ '/admin/developing' ],
					title: '收发货',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'inventory',
				component: () => import('@/views/errorPage/developing'),
				name: 'inventory',
				meta: {
					perms: [ '/admin/developing' ],
					title: '库存',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'forms',
				component: () => import('@/views/errorPage/developing'),
				name: 'stockSellStorageForms',
				meta: {
					perms: [ '/admin/developing' ],
					title: '报表',
					icon: '',
					noCache: true
				}
			}
		]
	},
	{
		path: '/financialSystem',
		component: Layout,
		redirect: 'noredirect',
		meta: { title: '财务系统', icon: 'money', noCache: true },
		children: [
			{
				path: 'notesReceivable',
				component: () => import('@/views/errorPage/developing'),
				name: 'notesReceivable',
				meta: {
					perms: [ '/admin/developing' ],
					title: '应收单',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'notesPayable',
				component: () => import('@/views/errorPage/developing'),
				name: 'notesPayable',
				meta: {
					perms: [ '/admin/developing' ],
					title: '应付单',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'receipt',
				component: () => import('@/views/errorPage/developing'),
				name: 'receipt',
				meta: {
					perms: [ '/admin/developing' ],
					title: '收款单',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'paymentOrder',
				component: () => import('@/views/errorPage/developing'),
				name: 'paymentOrder',
				meta: {
					perms: [ '/admin/developing' ],
					title: '付款单',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'paymentRequest',
				component: () => import('@/views/errorPage/developing'),
				name: 'paymentRequest',
				meta: {
					perms: [ '/admin/developing' ],
					title: '付款申请',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'borrowMoney',
				component: () => import('@/views/errorPage/developing'),
				name: 'borrowMoney',
				meta: {
					perms: [ '/admin/developing' ],
					title: '借款',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'reimburse',
				component: () => import('@/views/errorPage/developing'),
				name: 'reimburse',
				meta: {
					perms: [ '/admin/developing' ],
					title: '报销',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'costBreakdown',
				component: () => import('@/views/errorPage/developing'),
				name: 'costBreakdown',
				meta: {
					perms: [ '/admin/developing' ],
					title: '费用明细',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'pcs',
				component: () => import('@/views/errorPage/developing'),
				name: 'pcs',
				meta: {
					perms: [ '/admin/developing' ],
					title: '费用汇总',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'commission',
				component: () => import('@/views/errorPage/developing'),
				name: 'commission',
				meta: {
					perms: [ '/admin/developing' ],
					title: '业务员佣金',
					icon: '',
					noCache: true
				}
			},
			{
				path: 'setCommission',
				component: () => import('@/views/errorPage/developing'),
				name: 'setCommission',
				meta: {
					perms: [ '/admin/developing' ],
					title: '业务员佣金设置',
					icon: '',
					noCache: true
				}
			}
		]
	},
	{
		path: '/profile',
		component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		hidden: true,
		children: [
			{
				path: 'password',
				component: () => import('@/views/profile/password'),
				name: 'password',
				meta: {
					title: '修改密码',
					noCache: true,
					perms: [ 'POST /admin/profile/password' ]
				}
			},
			{
				name: 'userInfo',
				path: 'userInfo',
				component: () => import('@/views/profile/userInfo'),
				meta: {
					title: '个人中心',
					noCache: true,
					perms: [ 'GET /admin/personal/info' ]
				}
			}
		]
	},
	{
		path: 'external-link',
		// component: Layout,
		redirect: 'noredirect',
		alwaysShow: true,
		name: 'externalLink',
		hidden: true,
		meta: {
			title: '外链',
			icon: 'link'
		},
		children: [
			{
				path: 'https://cloud.tencent.com/product/cos',
				meta: {
					title: '腾讯云存储',
					icon: 'link',
					perms: [ 'POST /admin/role/permissions' ]
				}
			},
			{
				path: 'https://cloud.tencent.com/product/sms',
				meta: {
					title: '腾讯云短信',
					icon: 'link',
					perms: [ 'POST /admin/role/permissions' ]
				}
			},
			{
				path: 'https://pay.weixin.qq.com/index.php/core/home/login',
				meta: {
					title: '微信支付',
					icon: 'link',
					perms: [ 'POST /admin/role/permissions' ]
				}
			},
			{
				path: 'https://mpkf.weixin.qq.com/',
				meta: {
					title: '小程序客服',
					icon: 'link',
					perms: [ 'POST /admin/role/permissions' ]
				}
			},
			{
				path: 'https://www.alibabacloud.com/zh/product/oss',
				meta: {
					title: '阿里云存储',
					icon: 'link',
					perms: [ 'POST /admin/role/permissions' ]
				}
			},
			{
				path: 'https://www.qiniu.com/products/kodo',
				meta: {
					title: '七牛云存储',
					icon: 'link',
					perms: [ 'POST /admin/role/permissions' ]
				}
			},
			{
				path: 'http://www.kdniao.com/api-track',
				meta: {
					title: '快递鸟',
					icon: 'link',
					perms: [ 'POST /admin/role/permissions' ]
				}
			}
		]
	},
	{ path: '*', redirect: '/404', hidden: true }
]
