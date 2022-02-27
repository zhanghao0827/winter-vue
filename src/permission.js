import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

/**
 * 路由导航守卫
 * 页面刷新时：执行2次
 * 页面跳转时：执行1次
 */
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // token存在且要访问登录页面，直接跳转到首页，无需再次登录
      next({ path: '/' })
      NProgress.done()
    } else {
      // token存在，且要访问非登录页面(即访问系统的页面)，去加载用户的动态路由，然后放行，
      // 目前没有做加载用户的动态路由，直接放行
      // 一定要放行，才可以跳转到首页
      //TODO 加载用户个人信息和用户的动态路由

      /**
       * 路由导航守卫
       * 1.页面刷新时：执行2次
       *   (1)页面刷新时,Vue状态数据被重置，name=''，接着执行if语句内容，获取用户个人信息(name被赋值)，并动态加载路由
       *   (2)name不为空，直接放行next()
       *   根据状态数据name是否为空，决定是否从后台加载路由
       *   可以在执行第2次时无需调用后台，直接放行，减小数据库压力（不需要两次都查找数据库）
       *
       * 2.页面跳转时：执行1次
       *   页面跳转时，name不为空，直接放行next()
       */
      if (store.getters.name === '') {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('user/GetInfo').then(() => {
          store.dispatch('user/GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          /**
           * 由于axios响应拦截器返回了一个Error对象，会在此catch捕获到
           * 前端登出清除token并放行
           * 一定要放行，否则会卡住， 不断向后端发起请求
           * 即：
           * 1.token过期
           * 2.用户刷新页面
           * 3.后端响应401
           * 4.axios响应拦截器返回Error对象
           * 5.路由导航守卫捕获到
           * 6.登出并放行
           * 7.关键在于要执行<b>放行next()操作</br>
           */
          store.dispatch('user/FedLogOut').then(() => {
            next({path: '/'})
          })
        })
      } else {
        //刷新页面时，执行第二次时(name不为空)，必须要放行，如果没有next(),会卡住
        next()
      }

    }
  } else {
    // token不存在，跳转到登录页面
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
