import request from '@/utils/request'

// 查询工地token列表
export function listToken(query) {
  return request({
    url: '/device/token/list',
    method: 'get',
    params: query
  })
}

// 查询工地token详细
export function getToken(id) {
  return request({
    url: '/device/token/' + id,
    method: 'get'
  })
}

// 新增工地token
export function addToken(data) {
  return request({
    url: '/device/token',
    method: 'post',
    data: data
  })
}

// 修改工地token
export function updateToken(data) {
  return request({
    url: '/device/token',
    method: 'put',
    data: data
  })
}

// 删除工地token
export function delToken(id) {
  return request({
    url: '/device/token/' + id,
    method: 'delete'
  })
}

// 导出工地token
export function exportToken(query) {
  return request({
    url: '/device/token/export',
    method: 'get',
    params: query
  })
}