import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView';

import course_list from '@/views/course/course_list.vue';
import course_add from '@/views/course/course_add.vue';
import course_manage from '@/views/course/course_manage.vue';
import course_summary from '@/views/course/course_manage/course_summary.vue';
import course_picture from '@/views/course/course_manage/course_picture.vue';
import course_baseinfo from '@/views/course/course_manage/course_baseinfo.vue';
import course_marketinfo from '@/views/course/course_manage/course_marketinfo.vue';
import course_teacher from '@/views/course/course_manage/course_teacher.vue';
import course_plan from '@/views/course/course_manage/course_plan.vue';
import course_pub from '@/views/course/course_manage/course_pub.vue';


/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  // {
  //   path: '/course_add',
  //   component: (resolve) => require(['@/views/course/course_add'], resolve),
  //   hidden: true
  // },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index_v1'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },


  {
    path: '/course',
    component: Layout,
    name: '课程管理',
    hidden: false,
    iconCls: 'el-icon-document',
    children: [
      { path: '/course/course_list', name: '我的课程',component: course_list,hidden: true, meta: { title: '我的课程' } },
      { path: '/course/add/base', name: '新增课程',component: course_add,hidden: true, meta: { title: '新增课程' } },
      { path: '/course/manager/:courseid', name: '管理课程',component: course_manage,hidden: true ,meta: { title: '管理课程' },
        children: [
          { path: '/course/manage/plan/:courseid', name: '课程计划',component: course_plan,hidden: false ,meta: { title: '课程计划' }},
          { path: '/course/manage/baseinfo/:courseid', name: '基本信息',component: course_baseinfo,hidden: false ,meta: { title: '基本信息' }},
          { path: '/course/manage/picture/:courseid', name: '课程图片',component: course_picture,hidden: false ,meta: { title: '课程图片' }},
          { path: '/course/manage/marketinfo/:courseid', name: '营销信息',component: course_marketinfo,hidden: false ,meta: { title: '营销信息' }},
          { path: '/course/manage/teacher/:courseid', name: '教师信息',component: course_teacher,hidden: false,meta: { title: '教师信息' }},
          { path: '/course/manage/pub/:courseid', name: '发布课程',component: course_pub,hidden: false,meta: { title: '发布课程' }},
          { path: '/course/manage/summary/:courseid', name: '课程首页',component: course_summary,hidden: false ,meta: { title: '课程首页' }}
        ]}
    
    ]
  }


 
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
