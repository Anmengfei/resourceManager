import request from '@/utils/request'

export function findCourseList(page, size, query) {
    return request({
      url: `/course/coursebase/list/${page}/${size}`,
      method: 'get',
      params: query
    })
}

export function addCourseBase(query) {
    return request({
      url: '/course/coursebase/add',
      method: 'post',
      data:query
    })
}

export function category_findlist() {
    return request({
      url: '/category/list',
      method: 'get'
    })
}

export function findTeachplanList(id, userid) {
  return request({
    url: `/course/teachplan/list/${id}?userid=${userid}`,
    method: 'get'
  })
}

export function addTeachplan(teachplah) {
  return request({
    url: '/course/teachplan/add',
    method: 'post',
    data:teachplah
  })
}

export function findTeachplanInfo(courseid, teachplanId) {
  return request({
    url: `/course/teachplan/teachplanInfo/${courseid}/${teachplanId}`,
    method: 'get'
  })
}

export function deleteTeachplanInfo (courseid, teachplanId) {
  return request({
    url: `/course/teachplan/delteachplanInfo/${courseid}/${teachplanId}`,
    method: 'get'
  })
}

export function addCoursePic(courseId, pic) {
  return request({
    url: `/course/coursepic/add?courseId=${courseId}&pic=${pic}`,
    method: 'post',
  })
}

export function findCoursePicList (courseid) {
  return request({
    url: `/course/coursepic/list/${courseid}`,
    method: 'get'
  })
}

export function deleteCoursePic (courseid) {
  return request({
    url: `/course/coursepic/delete?courseId=${courseid}`,
    method: 'delete'
  })
}

export function preview(id) {
  return request({
    url: `/course/preview/${id}`,
    method: 'post',
  })
}

export function publish(id) {
  return request({
    url: `/course/publish/${id}`,
    method: 'post',
  })
}

export function findCourseView (courseid, username) {
  return request({
    url: `/course/courseview/${courseid}/${username}`,
    method: 'get'
  })
}

export function savemedia(teachplanMedia) {
  return request({
    url: '/course/savemedia',
    method: 'post',
    data: teachplanMedia
  })
}

export function getCoursebaseById(courseId) {
  return request({
    url: `/course/coursebase/get/${courseId}`,
    method: 'get'
  })
}

export function updateCoursebase(id, courseForm) {
  return request({
    url: `/course/coursebase/update/${id}`,
    method: 'put',
    data: courseForm
  })
}

export function getCourseMarketById(id) {
  return request({
    url: `/course/coursemarket/get/${id}`,
    method: 'get'
  })
}

export function updateCourseMarket(id, courseMarket) {
  return request({
    url: `/course/coursemarket/update/${id}`,
    method: 'post',
    data: courseMarket
  })
}

export function getTeacherById(id) {
  return request({
    url: `/course/teacher/get/${id}`,
    method: 'get'
  })
}

export function updateTeacher(id, teacher) {
  return request({
    url: `/course/teacher/update/${id}`,
    method: 'post',
    data: teacher
  })
}

// // 更新课程营销信息
// export const updateTeacher =(id,teacher) => {
//   return http.requestPost(apiUrl+'/course/teacher/update/'+id,teacher)
// }
