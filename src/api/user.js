import request from '@/utils/request'
import axios from 'axios'

// 登录
export function login(data) {
  return request({
    url: 'http://132.232.89.22:8080/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: 'http://132.232.89.22:8080/getadmin',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 创建用户
export function register(data) {
  return axios.post('http://132.232.89.22:8080/register', data)
}

// 获取所有管理员信息
export function getAllAdmin() {
  return axios.get('http://132.232.89.22:8080/getAllAdmin')
}

// 删除管理员
export function delAdmin(data) {
  return axios.post('http://132.232.89.22:8080/delAdmin', { _id: data })
}
