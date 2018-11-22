import request from '@/utils/request'

export function queryOrderList(params) {
  return request({
    url: '/v1/queryOrderList',
    method: 'get',
    params: params
  })
}

export function queryOrderInfo(params) {
  return request({
    url: '/v1/queryOrderInfo',
    method: 'get',
    params: params
  })
}

export function queryChangedBlackPipeList(params) {
  return request({
    url: '/v1/queryChangedBlackPipeList',
    method: 'get',
    params: params
  })
}

export function checkingOrder(params) {
  return request({
    url: '/v1/checkingOrder',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function processComplete(params) {
  return request({
    url: '/v1/processComplete',
    method: 'post',
    contentType: 'application/json',
    params: params,
    data: {}
  })
}

export function transportComplete(params) {
  return request({
    url: '/v1/transportComplete',
    method: 'post',
    contentType: 'application/json',
    params: params,
    data: {}
  })
}

export function queryTruckPriceList() {
  return request({
    url: '/v1/queryTruckPriceList',
    method: 'get'
  })
}

export function queryTruckPriceInfoById(params) {
  return request({
    url: '/v1/queryTruckPriceInfoById',
    method: 'get',
    params: params
  })
}

export function addOrUpTruckPriceInfo(params) {
  return request({
    url: '/v1/addOrUpTruckPriceInfo',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function delTruckPriceInfo(params) {
  return request({
    url: '/v1/delTruckPriceInfo',
    method: 'delete',
    params: params
  })
}
