import request from '@/utils/request'


export function findWorkList(page, size, query) {
    return request({
      url: `/homework/teacher/list/${page}/${size}`,
      method: 'get',
      params: query
    })
}


export function saveWork(data) {
    return request({
      url: `/homework/teacher/add`,
      method: 'post',
      data: data
    })
}

export function searchList(data) {
  return request({
    url: `/homework/teacher/search`,
    method: 'get',
    params: data
  })
}

export function upWork(data) {
    return request({
      url: `/homework/teacher/update`,
      method: 'put',
      data: data
    })
}

export function deleteWork(arr) {
    return request({
      url: `/homework/teacher/delete`,
      method: 'delete',
      params: arr
    })
}



// 查看学生提交作业列表
export function searchStd(page, size, params) {
  return request({
    url: `/homework/teacher/list/submit/${page}/${size}`,
    method: 'get',
    params: params
  })
}

export function checkAdd(params) {
  return request({
    url: `/homework/teacher/check/add`,
    method: 'post',
    data: params
  })
}

export function checkUpdate(params) {
  return request({
    url: `/homework/teacher/check/update`,
    method: 'put',
    data: params
  })
}

// 学生列表
export function getStdList(page, pagesize, id) {
  return request({
    url: `/course/studentList/allStudent/${page}/${pagesize}/${id}`,
    method: 'get'
  })
}

export function getStdDetail(page, pagesize, userId) {
  return request({
    url: `/course/studentList/studentSubmitDetail/${page}/${pagesize}/${userId}`,
    method: 'get'
  })
}

