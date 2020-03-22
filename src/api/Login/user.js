import request from '@/utils/request'

export function login() {
  return request({
    url: '/api/loginCheck',
    method: 'post',
    params: {
      username: 'user2',
      password: 123456
    }
  })
}

