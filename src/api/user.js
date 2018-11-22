import request from '@/utils/request'

export function queryUserList(params) {
  return request({
    url: '/v1/queryUserList',
    method: 'get',
    params: params
  })
}

export function queryUserInfo(params) {
  return request({
    url: '/v1/queryUserInfo',
    method: 'get',
    params: params
  })
}
