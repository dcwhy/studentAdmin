/* eslint-disable no-empty */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取令牌
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login', '/auth-redirect', '/student'] // 无重定向白名单, '/changepassword'

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/login' })      
      NProgress.done()
    } else {
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // eslint-disable-next-line no-unused-vars
        const isLogin = await store.dispatch('user/getInfo')
        next()
      } else {
        try {
          // 获取用户信息
          // 注意：角色必须是对象数组例如：['admin']或，['developer'，'editor']
          const { roles, loginFlag } = await store.dispatch('user/getInfo')
          // 判断 loginFlag为true还是false
          // 如果是true就走 next(`/changepassword`) 修改页面
          // 如果是 false 就直接进去首页给用户分配权限路由
          if (loginFlag) {
            next(`/changepassword`)
          } else {
            // 基于角色生成可访问路由图
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

            // 动态添加可访问路由
            router.addRoutes(accessRoutes)

            // 确保addRoutes完整的hack方法
            // 设置replace:true，这样导航就不会留下历史记录
            next({ ...to, replace: true })
          }
        } catch (error) {
          // 移除令牌并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在登录白名单中，直接进入
      next()
    } else {
      //  否则全部重定向到登录页
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
