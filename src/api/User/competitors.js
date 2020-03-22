import request from '@/utils/request'

export function getCompetitors(list) {
  return request({
    url: '/api/getUserMes',
    method: 'get',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addCompetitors(temp) {
  return request({
    url: '/api/addQuestions',
    method: 'get',
    params: {
      content: temp.qcontent,
      answer: temp.answer
    }
  })
}

export function deleteCompetitors(id) {
  return request({
    url: '/api/delUserMesbyid',
    method: 'get',
    params: {
      uid: id
    }
  })
}

export function updateCompetitors(temp) {
  console.log('temp:' + temp)
  return request({
    url: '/api/updateUserMes',
    method: 'get',
    params: {
      uid: temp.uid,
      password: temp.password,
      number: temp.number,
      username: temp.username,
      school: temp.school,
      college: temp.college,
      major: temp.major,
      email: temp.email,
      phone: temp.phone,
      register_date: temp.register_date,
      match_id: temp.match_id
    }
  })
}
