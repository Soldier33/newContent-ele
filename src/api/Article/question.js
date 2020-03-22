import request from '@/utils/request'

export function getQuestionList(list) {
  return request({
    url: '/api/queryQuestionsList',
    method: 'get',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addQuestion(temp) {
  return request({
    url: '/api/addQuestions',
    method: 'get',
    params: {
      content: temp.qcontent,
      answer: temp.answer
    }
  })
}

export function deleteQuestion(id) {
  return request({
    url: '/api/deleteQuestions',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function updateQuestion(temp) {
  return request({
    url: '/api/updateQuestions',
    method: 'get',
    params: {
      id: temp.qid,
      content: temp.qcontent,
      answer: temp.answer
    }
  })
}
