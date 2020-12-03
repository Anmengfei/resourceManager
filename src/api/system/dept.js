import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}

// 查询初始化数据
export function queryInitData(data) {
  return request({
    url: '/system/initial/list',
    method: 'get',
    params: data
  })
}
// 初始化设置
export function setInitData(data) {
  return request({
    url: '/system/initial/getProjectName',
    method: 'get',
    params: data
  })
}

// 根据用户名获取设备树形结构
export function getLeftColumn(data) {
  return request({
    url: '/system/initial/getLeftColumn',
    method: 'get',
    params: data
  })
}

export function getBaseInfo(deptId) {
  return request({
    url: '/system/dept/getSysProData?deptId=' + deptId,
    method: 'get'
  })
}

export function updateBaseInfo(id, data) {
  return request({
    url: '/system/dept/updateSysProData?deptId=' + id,
    method: 'get',
    params: data
  })
}

export function getTime(deptId) {
  return request({
    url: '/system/dept/getScheduleTime?deptId=' + deptId,
    method: 'get'
  })
}

