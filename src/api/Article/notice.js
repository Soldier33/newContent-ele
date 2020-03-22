import request from '@/utils/request'

export function getNoticeList(list) {
  return request({
    url: '/api/queryNoticeList',
    method: 'get',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addNotice(temp) {
  return request({
    url: '/api/addNotice',
    method: 'get',
    params: {
      title: temp.title,
      time: temp.time,
      content: temp.content,
      name: temp.name,
      match_name: temp.match_name,
      match_project: temp.match_project
    }
  })
}

export function deleteNotice(id) {
  return request({
    url: '/api/deleteNotice',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function updataNotice(temp) {
  console.log(temp)
  return request({
    url: '/api/updateNotice',
    method: 'get',
    params: {
      id: temp.id,
      title: temp.title,
      time: temp.time,
      content: temp.content,
      name: temp.name,
      match_name: temp.match_name,
      match_project: temp.match_project
    }
  })
}
