import request from '@/utils/request'

export function media_list(page, size, query) {
    return request({
      url: `/media/file/list/${page}/${size}`,
      method: 'get',
      params: query
    })
}
export function updateMedia(id, mediaFile) {
    return request({
      url: `/filesystem/saveMedia/${id}`,
      method: 'post',
      data: mediaFile
    })
}

export function shareMedia(query) {
  return request({
    url: `/media/file/commonlist`,
    method: 'get',
    params: query
  })
}


export function allMedia(id) {
  return request({
    url: `/media/file/alllist?deptId=${id}`,
    method: 'get'
  })
}

export function searchAllMedia(data) {
  return request({
    url: `/media/file/alllist`,
    method: 'get',
    params: data
  })
}

export function assignDept(data) {
  return request({
    url: `/media/file/addMediaDept`,
    method: 'post',
    data: data
  })
}

export function assignPeople(data) {
  return request({
    url: `/media/file/addMediaUser`,
    method: 'post',
    params: data
  })
}



