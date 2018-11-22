import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [
      { path: 'dashboard', component: () => import('@/views/dashboard/index') }
    ]
  },
  {
    path: '/black_pipe',
    component: Layout,
    redirect: '/black_pipe/list',
    name: '镀锌管管理',
    meta: { title: '镀锌管管理', icon: 'example' },
    children: [
      {
        path: 'brandList',
        name: '品牌管理',
        component: () => import('@/views/blackPipe/brandList'),
        meta: { title: '镀锌管品牌列表', icon: 'table' }
      },
      {
        path: 'specList',
        name: '规格列表',
        component: () => import('@/views/blackPipe/specList'),
        meta: { title: '规格列表', icon: 'table' }
      },
      {
        path: 'priceList',
        name: '价格管理',
        component: () => import('@/views/blackPipe/priceList'),
        meta: { title: '价格管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/allList',
    name: '订单管理',
    meta: { title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'freightList',
        name: '运费管理',
        component: () => import('@/views/order/freightList'),
        meta: { title: '运费管理', icon: 'table' }
      },
      {
        path: 'orderList',
        name: '全部订单列表',
        component: () => import('@/views/order/orderList'),
        meta: { title: '全部订单列表', icon: 'table' }
      },
      {
        path: 'checkingList',
        name: '待验收列表',
        component: () => import('@/views/order/checkingList'),
        meta: { title: '待验收列表', icon: 'table' }
      },
      {
        path: 'checkingErrorList',
        name: '验收异常列表',
        component: () => import('@/views/order/checkingErrorList'),
        meta: { title: '验收异常列表', icon: 'table' }
      },
      {
        path: 'processingList',
        name: '加工中列表',
        component: () => import('@/views/order/processingList'),
        meta: { title: '加工中列表', icon: 'table' }
      },
      {
        path: 'transportList',
        name: '配送/自提列表',
        component: () => import('@/views/order/transportList'),
        meta: { title: '配送/自提列表', icon: 'table' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/userList',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'userList',
        name: '用户信息列表',
        component: () => import('@/views/user/userList'),
        meta: { title: '用户信息列表', icon: 'table' }
      }
    ]
  },
  {
    path: '/slideShow',
    component: Layout,
    redirect: '/slideShow/slideShowList',
    name: '轮播图管理',
    meta: { title: '轮播图管理', icon: 'example' },
    children: [
      {
        path: 'slideShowList',
        name: '轮播图列表',
        component: () => import('@/views/slideShow/slideShowList'),
        meta: { title: '轮播图列表', icon: 'table' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
