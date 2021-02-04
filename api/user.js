import { request } from '@/plugins/request'

// 用户登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}
// 用户注册
export const register = (data) => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 获取个人的setting
export const getUser = (data) => {
  return request({
    method: 'GET',
    url: '/api/user',
    data
  })
}

// 更新个人的setting
export const updateUser = (data) => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}