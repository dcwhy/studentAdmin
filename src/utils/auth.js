// import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

// 获取 TokenKey 信息
export function getToken() {
  return localStorage.getItem(TokenKey)
}

// 设置 TokenKey 信息
export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

// 移除 TokenKey 信息
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
