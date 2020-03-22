import request from '@/utils/request'

export function getMatchtableList(list) {
  return request({
    url: '/api/getAllMatchMes',
    method: 'get',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addMatch(temp) {
  console.log(temp)
  return request({
    url: '/api/addMatchMes',
    method: 'get',
    params: {
      name: temp.name,
      project: temp.project,
      now: temp.now,
      type: temp.type,
      start_date: temp.start_date,
      end_date: temp.end_date,
      club_name: temp.club_name,
      number: temp.number,
      content: temp.content,
      poster: temp.poster,
      url: temp.url
    }
  })
}

export function deleteMatch(id) {
  return request({
    url: '/api/deleteMatchMes',
    method: 'get',
    params: {
      mid: id
    }
  })
}

export function updateMatch(temp) {
  return request({
    url: '/api/updateMatchMes',
    method: 'get',
    params: {
      mid: temp.mid,
      name: temp.name,
      project: temp.project,
      now: temp.now,
      type: temp.type,
      start_date: temp.start_date,
      end_date: temp.end_date,
      club_name: temp.club_name,
      number: temp.number,
      content: temp.content,
      poster: temp.poster,
      url: temp.url
    }
  })
}
