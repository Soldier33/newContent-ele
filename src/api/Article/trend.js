import request from '@/utils/request'

export function queryDynamicList(list) {
  return request({
    url: '/api/queryDynamicList',
    method: 'get',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addDynamic(temp) {
  return request({
    url: '/api/addDynamic',
    method: 'get',
    params: {
      content: temp.content,
      time: temp.time,
      name: temp.name,
      title: temp.title,
      match_name: temp.match_name
    }
  })
}

export function deleteDynamic(id) {
  return request({
    url: '/api/deleteDynamic',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function updateDynamic(temp) {
  return request({
    url: '/api/updateDynamic',
    method: 'get',
    params: {
      id: temp.id,
      title: temp.title,
      time: temp.time,
      content: temp.content,
      name: temp.name,
      match_name: temp.match_name
    }
  })
}
