/**
 * 角色权限处理
 */
import store from '@/store'

export default {
  inserted(el, binding) {
    const { value } = binding
    const roles = store.getters.roles  //所属权限

    if (value && value instanceof Array && value.length > 0) {
      const needRoles = value //需要权限
      // 遍历每一个所属权限，判断需要权限是否包含所属权限
      const hasRoles = roles.some(role => {
        return needRoles.includes(role)
      })
      if (!hasRoles) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
