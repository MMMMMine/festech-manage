import request from '@/utils/request'

export function queryBlackPipeBrandList(params) {
  return request({
    url: '/v1/queryBlackPipeBrandList',
    method: 'get',
    params: params
  })
}
export function queryBlackPipeBrandById(params) {
  return request({
    url: '/v1/queryBlackPipeBrandById',
    method: 'get',
    params: params
  })
}
export function delBlackPipeBrandInfo(params) {
  return request({
    url: '/v1/delBlackPipeBrandInfo',
    method: 'delete',
    params: params
  })
}
export function addOrUpBlackPipeBrandInfo(params) {
  return request({
    url: '/v1/addOrUpBlackPipeBrandInfo',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}
export function queryBlackPipeList(params) {
  return request({
    url: '/v1/queryBlackPipeList',
    method: 'get',
    params: params
  })
}
export function queryBlackPipeById(params) {
  return request({
    url: '/v1/queryBlackPipeById',
    method: 'get',
    params: params
  })
}
export function delBlackPipeInfo(params) {
  return request({
    url: '/v1/delBlackPipeInfo',
    method: 'delete',
    params: params
  })
}
export function publishBlackPipeInfo(params) {
  return request({
    url: '/v1/publishBlackPipeInfo',
    method: 'put',
    params: params
  })
}
export function addOrUpBlackPipeInfo(params) {
  return request({
    url: '/v1/addOrUpBlackPipeInfo',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}
export function queryBlackPipePriceList(params) {
  return request({
    url: '/v1/queryBlackPipePriceList',
    method: 'get',
    params: params
  })
}
export function updateBlackPipePrice(params) {
  return request({
    url: '/v1/updateBlackPipePrice',
    method: 'put',
    data: params
  })
}

