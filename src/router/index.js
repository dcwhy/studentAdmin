import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Grtt */
// eslint-disable-next-line no-unused-vars

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes headmaster mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 公共
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 登录-修改密码
  {
    path: '/changepassword',
    component: () => import('@/views/changepassword/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/yourprofile ',
    component: Layout,
    children: [
      {
        path: '/yourprofile',
        name: 'Yourprofile',
        component: () => import('@/views/yourprofile/index'),
        meta: { title: '个人中心' },
        hidden: true
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  // 学生查询
  {
    path: '/student',
    component: () => import('@/views/student/index'),
    hidden: true
  }
]

// 权限
export const asyncRoutes = [
  // 管理员路由
  {
    path: '/administrators',
    component: Layout,
    redirect: '/administrators/role',
    alwaysShow: true, // 将始终显示根菜单
    name: 'Administrators',
    meta: { title: '管理员', icon: 'admin', roles: ['1'] },
    children: [
      {
        path: 'role',
        component: () => import('@/views/administrators/role'),
        name: 'RoleAdministrators',
        meta: {
          title: '管理员列表',
          icon: 'adminList',
          roles: ['1']
        }
      },
      {
        path: 'page',
        component: () => import('@/views/administrators/page'),
        name: 'PageAdministrators',
        meta: {
          title: '添加管理员',
          icon: 'addAdmin',
          roles: ['1'] // or you can only set roles in sub nav
        }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'All',
    meta: { title: '学生操作', icon: 'studentOption', roles: ['1', '2', '3'] },
    children: [
      {
        path: 'table',
        name: '学生列表',
        component: () => import('@/views/table'),
        meta: { title: '所有学生', icon: 'studentList', roles: ['1', '2', '3'] }
      },
      {
        path: 'tree',
        name: 'Add',
        component: () => import('@/views/tree/index'),
        meta: { title: '添加学生', icon: 'addStudent', roles: ['1', '2'] }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    redirect: '/form/index',
    name: '班级信息',
    meta: { title: '班级信息', icon: 'classgl', roles: ['1', '2', '3'] },
    children: [
      {
        path: 'index',
        name: '班级列表',
        component: () => import('@/views/form/index'),
        meta: { title: '班级列表', icon: 'classlb', roles: ['1', '2', '3'] }
      },

      {
        path: 'classstudent',
        name: '班级成员',
        component: () => import('@/views/form/classstudent/index'),
        meta: { title: '班级成员', icon: 'form', roles: ['1', '2', '3'] },
        hidden: true
      },
      {
        path: 'addlist',
        name: '创建班级',
        component: () => import('@/views/form/addlist/index'),
        meta: { title: '创建班级', icon: 'tjclass', roles: ['1', '2'] }
      }
    ]
  },

  {
    path: '/headmaster',
    component: Layout,
    redirect: '/headmaster/menu1',
    name: '班主任',
    meta: { title: '班主任', icon: 'headMaster', roles: ['1', '2', '3'] },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/headmaster/menu1/index'), // Parent router-view
        name: 'toHeads',
        meta: { title: '班主任列表', icon: 'headmasterList', roles: ['1', '2', '3'] }
      },
      {
        path: 'menu2',
        component: () => import('@/views/headmaster/menu2/index'),
        name: 'addHeads',
        meta: { title: '添加班主任', icon: 'addHeadmaster', roles: ['1', '2'] }
      }
    ]
  },
  {
    path: '/lecturer',
    component: Layout,
    redirect: '/lecturer/menu1',
    name: '讲师',
    meta: { title: '讲师', icon: 'lecturer', roles: ['1', '2', '3'] },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/lecturer/menu1/index'), // Parent router-view
        name: 'toLecturers',
        meta: { title: '讲师列表', icon: 'lecturerList', roles: ['1', '2', '3'] }
      },
      {
        path: 'menu2',
        component: () => import('@/views/lecturer/menu2/index'),
        name: 'addLecturers',
        meta: { title: '添加讲师', icon: 'addLecturer', roles: ['1', '2'] }
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/market/menu1',
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/market/menu1/index'), // Parent router-view
        name: '市场部',
        meta: { title: '市场部', icon: 'market', roles: ['1', '2', '3'] }
      }
    ]
  },
  {
    path: '/major',
    component: Layout,
    redirect: '/major/menu1',
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/major/menu1/index'), // Parent router-view
        name: '专业',
        meta: { title: '专业', icon: 'major', roles: ['1', '2', '3'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// eslint-disable-next-line eol-last
export default router