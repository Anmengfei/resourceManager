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


