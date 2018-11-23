import request from '@/utils/request'

export function queryInfosById(params) {
  return request({
    url: '/v1/queryInfosById',
    method: 'get',
    params: params
  })
}
