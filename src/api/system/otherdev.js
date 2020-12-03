import request from '@/utils/request'

// 查询绿色施工设备+考勤设备列表
export function listDev(query) {
  return request({
    url: '/device/otherDev/list',
    method: 'get',
    params: query
  })
}

// 查询绿色施工设备+考勤设备详细
export function getDev(id) {
  return request({
    url: '/device/otherDev/' + id,
    method: 'get'
  })
}

// 新增绿色施工设备+考勤设备
export function addDev(data) {
  return request({
    url: '/device/otherDev',
    method: 'post',
    data: data
  })
}

// 修改绿色施工设备+考勤设备
export function updateDev(data) {
  return request({
    url: '/device/otherDev',
    method: 'put',
    data: data
  })
}

// 删除绿色施工设备+考勤设备
export function delDev(id) {
  return request({
    url: '/device/otherDev/' + id,
    method: 'delete'
  })
}

// 导出绿色施工设备+考勤设备
export function exportDev(query) {
  return request({
    url: '/device/otherDev/export',
    method: 'get',
    params: query
  })
}

// 获取部门列表
export function getDeparament(query) {
  return request({
    url: '/system/initial/getDeptList',
    method: 'get',
    params: query
  })
}