import request from '@/utils/request'

// 查询支持设备列表
export function listDevice(query) {
  return request({
    url: '/device/supportDevice/list',
    method: 'get',
    params: query
  })
}

// 查询支持设备详细
export function getDevice(id) {
  return request({
    url: '/device/supportDevice/' + id,
    method: 'get'
  })
}

// 新增支持设备
export function addDevice(data) {
  return request({
    url: '/device/supportDevice',
    method: 'post',
    data: data
  })
}

// 修改支持设备
export function updateDevice(data) {
  return request({
    url: '/device/supportDevice',
    method: 'put',
    data: data
  })
}

// 删除支持设备
export function delDevice(id) {
  return request({
    url: '/device/supportDevice/' + id,
    method: 'delete'
  })
}

// 导出支持设备
export function exportDevice(query) {
  return request({
    url: '/device/supportDevice/export',
    method: 'get',
    params: query
  })
}
