import request from '@/utils/request'

export function login(account, password) {
  return request({
    url: '/v1/adminLogin',
    method: 'post',
    contentType: 'application/json',
    data: {
      account,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/v1/queryAdminInfo',
    method: 'get',
    params: {
      'token': token
    }
  })
}

// export function logout() {
//   return request({
//     url: '/v1/admins/logout',
//     method: 'post',
//     contentType: 'application/json'
//   })
// }
