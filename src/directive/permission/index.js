import hasRole from './hasRole'
import hasPermission from './hasPermission'

const install = function(Vue) {
  Vue.directive('hasPermission', hasPermission)
  Vue.directive('hasRole', hasRole)
}

if (window.Vue) {
  window['hasPermission'] = hasPermission
  window['hasRole'] = hasRole
  Vue.use(install); // eslint-disable-line
}

hasPermission.install = install
hasRole.install = install
export default hasPermission
