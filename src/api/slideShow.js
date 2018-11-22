import request from '@/utils/request'

export function querySlideShowList() {
  return request({
    url: '/v1/querySlideShowList',
    method: 'get'
  })
}
export function querySlideShowById(params) {
  return request({
    url: '/v1/querySlideShowById',
    method: 'get',
    params: params
  })
}
export function delSlideShowInfo(params) {
  return request({
    url: '/v1/delSlideShowInfo',
    method: 'delete',
    params: params
  })
}
export function addOrUpSlideShowInfo(params) {
  return request({
    url: '/v1/addOrUpSlideShowInfo',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

