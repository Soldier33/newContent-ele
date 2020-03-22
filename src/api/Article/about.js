import request from '@/utils/request'

export function getAboutList() {
  return request({
    url: '/api/queryAboutUsList',
    method: 'get'
  })
}

export function addAbout(temp) {
  return request({
    url: '/api/addAboutUs',
    method: 'get',
    params: {
      content: temp.content
    }
  })
}

export function deleteAbout(id) {
  return request({
    url: '/api/deleteAboutUs',
    method: 'get',
    params: {
      id: id
    }
  })
}
