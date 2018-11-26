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
    path: '/infos',
    component: Layout,
    redirect: '/infos/1',
    name: '镀锌管管理',
    meta: { title: '内容管理', icon: 'example' },
    children: [
      {
        path: '/1',
        name: 'Rapid 7',
        component: () => import('@/views/infos/infos'),
        meta: { title: 'Rapid 7', icon: 'table' }
      },
      {
        path: '/2',
        name: 'Fortinet',
        component: () => import('@/views/infos/infos'),
        meta: { title: 'Fortinet', icon: 'table' }
      },
      {
        path: '/3',
        name: 'DELL EMC',
        component: () => import('@/views/infos/infos'),
        meta: { title: 'DELL EMC', icon: 'table' }
      },
      {
        path: '/4',
        name: '亚信安全',
        component: () => import('@/views/infos/infos'),
        meta: { title: '亚信安全', icon: 'table' }
      },
      {
        path: '/5',
        name: 'ForeScout',
        component: () => import('@/views/infos/infos'),
        meta: { title: 'ForeScout', icon: 'table' }
      },
      {
        path: '/6',
        name: 'Symantec',
        component: () => import('@/views/infos/infos'),
        meta: { title: 'Symantec', icon: 'table' }
      },
      {
        path: '/7',
        name: '制造业',
        component: () => import('@/views/infos/infos'),
        meta: { title: '制造业', icon: 'table' }
      },
      {
        path: '/8',
        name: '企业',
        component: () => import('@/views/infos/infos'),
        meta: { title: '企业', icon: 'table' }
      },
      {
        path: '/9',
        name: '互联网行业',
        component: () => import('@/views/infos/infos'),
        meta: { title: '互联网行业', icon: 'table' }
      },
      {
        path: '/10',
        name: '基础架构评估',
        component: () => import('@/views/infos/infos'),
        meta: { title: '基础架构评估', icon: 'table' }
      },
      {
        path: '/11',
        name: '安全评估',
        component: () => import('@/views/infos/infos'),
        meta: { title: '安全评估', icon: 'table' }
      },
      {
        path: '/12',
        name: 'RMA备件服务',
        component: () => import('@/views/infos/infos'),
        meta: { title: 'RMA备件服务', icon: 'table' }
      },
      {
        path: '/13',
        name: '现场技术支持服务',
        component: () => import('@/views/infos/infos'),
        meta: { title: '现场技术支持服务', icon: 'table' }
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
