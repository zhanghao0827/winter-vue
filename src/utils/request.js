import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

//创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 超时请求
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  config => {
    // 发起请求之前的回调  每个请求都要携带token，发送到后端
    if (store.getters.token) {
      // 如果store的token存在，就把token放在请求的header中
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor  响应拦截器
service.interceptors.response.use(response => {
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200
    // 获取错误信息
    if (code === 401) {
      MessageBox.alert('登录状态过期，请重新登录!', '确定登出', {
        confirmButtonText: '确定',
        callback: () => {
          //登出
          store.dispatch('user/Logout').then(() => {
            location.href = '/index'
            // 为了重新实例化vue-router对象 避免bug
            location.reload()
          })
        }
      })
    } else if (code !== 200) {
      // code !== 200 (例如 500业务上的错误，401没有权限等)
      const msg = response.data.message || 'error'
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else {
      // code === 200 请求成功
      const msg = response.data.message
      if (msg && msg !== 'success') {
        //如果后端有message就弹出消息
        Message.success({ message: msg })
      }
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
