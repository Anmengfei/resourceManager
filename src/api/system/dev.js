import request from '@/utils/request'

// 查询设备(special equipment)列表
export function listDev(query) {
  return request({
    url: '/device/sysDev/list',
    method: 'get',
    params: query
  })
}

// 查询设备(special equipment)详细
export function getDev(devId) {
  return request({
    url: '/device/sysDev/' + devId,
    method: 'get'
  })
}

// 新增设备(special equipment)
export function addDev(data) {
  return request({
    url: '/device/sysDev',
    method: 'post',
    data: data
  })
}

// 修改设备(special equipment)
export function updateDev(data) {
  return request({
    url: '/device/sysDev',
    method: 'put',
    data: data
  })
}

// 删除设备(special equipment)
export function delDev(devId) {
  return request({
    url: '/device/sysDev/' + devId,
    method: 'delete'
  })
}

// 导出设备(special equipment)
export function exportDev(query) {
  return request({
    url: '/device/sysDev/export',
    method: 'get',
    params: query
  })
}
export function departmentDev(query) {
  return request({
    url: '/system/initial/getDeptList',
    method: 'get',
    params: query
  })
}
