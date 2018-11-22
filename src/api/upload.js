import request from '@/utils/request'

export function uploadPic(data) {
  return request({
    url: '/v1/upload_pic',
    method: 'post',
    params: {
      pic: data
    }
  })
}
