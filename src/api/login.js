import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/login/self',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/admin/index/info',
    method: 'get',
    params: { token }
  })
}

// 登出
export function logout() {
  return request({
    url: '/admin/index/logout',
    method: 'post'
  })
}

// 获取菜单权限数据
export function getMenu() {
  return request({
    url: '/admin/index/menu',
    method: 'get'
  })
}
