<template>
  <div>

    <!-- <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <router-link class="mui-tab-item" :to="{path:'/course/manage/summary/'+this.courseid}">
      <el-menu-item index="1">课程首页</el-menu-item>
      </router-link>
      <router-link class="mui-tab-item" :to="{path:'/course/manage/baseinfo/'+this.courseid}">
      <el-menu-item index="2">基本信息</el-menu-item>
      </router-link>
      <router-link class="mui-tab-item" :to="{path:'/course/manage/picture/'+this.courseid}">
        <el-menu-item index="3">课程图片</el-menu-item>
      </router-link>
      <router-link class="mui-tab-item" :to="{path:'/course/manage/marketinfo/'+this.courseid}">
      <el-menu-item index="4">课程营销</el-menu-item>
      </router-link>
      <router-link class="mui-tab-item" :to="{path:'/course/manage/plan/'+this.courseid}">
      <el-menu-item index="5">课程计划</el-menu-item>
      </router-link>
      <router-link class="mui-tab-item" :to="{path:'/course/manage/teacher/'+this.courseid}">
        <el-menu-item index="6">教师信息</el-menu-item>
      </router-link>
      <router-link class="mui-tab-item" :to="{path:'/course/manage/pub/'+this.courseid}">
        <el-menu-item index="7">发布课程</el-menu-item>
      </router-link>
    </el-menu> -->

    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <!-- <router-link class="mui-tab-item" :to="{path:'/course/manage/summary/'+this.courseid}"> -->
      <!-- <el-menu-item index="1">课程首页</el-menu-item> -->
      <!-- </router-link> -->
      <!-- <router-link class="mui-tab-item" :to="{path:'/course/manage/baseinfo/'+this.courseid}"> -->
      <el-menu-item index="2" >基本信息</el-menu-item>
      <!-- </router-link> -->
      <!-- <router-link class="mui-tab-item" :to="{path:'/course/manage/picture/'+this.courseid}"> -->
        <el-menu-item index="3">课程图片</el-menu-item>
      <!-- </router-link> -->
      <!-- <router-link class="mui-tab-item" :to="{path:'/course/manage/marketinfo/'+this.courseid}"> -->
      <el-menu-item index="4">课程营销</el-menu-item>
      <!-- </router-link> -->
      <!-- <router-link class="mui-tab-item" :to="{path:'/course/manage/plan/'+this.courseid}"> -->
      <el-menu-item index="5">课程计划</el-menu-item>
      <!-- </router-link> -->
      <!-- <router-link class="mui-tab-item" :to="{path:'/course/manage/teacher/'+this.courseid}"> -->
        <el-menu-item index="6">教师信息</el-menu-item>
      <!-- </router-link> -->
      <!-- <router-link class="mui-tab-item" :to="{path:'/course/manage/pub/'+this.courseid}"> -->
        <el-menu-item index="7">发布课程</el-menu-item>
      <!-- </router-link> -->
        <el-menu-item index="8">课程作业</el-menu-item>

        <!-- </router-link> -->
        <el-menu-item index="9">学生列表</el-menu-item>
    </el-menu>
    <!-- <router-view class="main"></router-view> -->
    <div v-if="activeIndex === '2'">
      <course-baseinfo></course-baseinfo>
    </div>
    <div v-if="activeIndex === '3'">
      <course-pictureinfo></course-pictureinfo>
    </div>
    <div v-if="activeIndex === '4'">
      <course-marketinfo></course-marketinfo>
    </div>
    <div v-if="activeIndex === '5'">
      <course-plan></course-plan>
    </div>
    <div v-if="activeIndex === '6'">
      <course-teacher></course-teacher>
    </div>
    <div v-if="activeIndex === '7'">
      <course-pub></course-pub>
    </div>
     <div v-if="activeIndex === '8'">
      <course-work></course-work>
    </div>
    <div v-if="activeIndex === '9'">
      <course-student></course-student>
    </div>
  </div>
</template>
<script>
import courseBaseinfo from '@/views/course/course_manage/course_baseinfo.vue';
import courseMarketinfo from '@/views/course/course_manage/course_marketinfo.vue';
import coursePictureinfo from '@/views/course/course_manage/course_picture.vue';
import coursePlan from '@/views/course/course_manage/course_plan.vue';
import courseTeacher from '@/views/course/course_manage/course_teacher.vue';
import coursePub from '@/views/course/course_manage/course_pub.vue';
import courseWork from '@/views/course/course_manage/course_work.vue';
import courseStudent from '@/views/course/course_manage/course_student.vue';
  export default {
    components: {
      courseBaseinfo,
      courseMarketinfo,
      coursePictureinfo,
      coursePlan,
      courseTeacher,
      coursePub,
      courseWork,
      courseStudent
    },
    data() {
      return {
        activeIndex:'2',
        courseid:''
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log("key", key)
        console.log("keyPath", keyPath)
        var self = this
        self.activeIndex = key
        // if(self.activeIndex === '3') {
        //   console.log("activeIndex:", self.activeIndex)
        //   self.$router.push({
        //     path: '/course/manage/picture/'+self.courseid
        //   })
        // } else if(self.activeIndex === '4') {
        //    console.log("activeIndex:", self.activeIndex)
        //   self.$router.push({
        //     path: '/course/manage/marketinfo/'+self.courseid
        //   })
        // } else if(self.activeIndex === '5') {
        //    console.log("activeIndex:", self.activeIndex)
        //   self.$router.push({
        //     path: '/course/manage/plan/'+self.courseid
        //   })
        // } else if(self.activeIndex === '6') {
        //    console.log("activeIndex:", self.activeIndex)
        //   self.$router.push({
        //     path: '/course/manage/teacher/'+self.courseid
        //   })
        // } else if(self.activeIndex === '7') {
        //    console.log("activeIndex:", self.activeIndex)
        //   self.$router.push({
        //     path: '/course/manage/pub/'+self.courseid
        //   })
        // } else {
        //    console.log("activeIndex:", self.activeIndex)
        //   self.$router.push({
        //     path: '/course/manage/baseinfo/'+self.courseid
        //   })
        // }
        
      },
      gotoBase() {
        console.log("1222121");
        // this.$router.push({
        //     path: '/course/manage/picture/'+this.courseid
        //   })
      }
    },
    mounted(){

      //课程id
      this.courseid = this.$route.params.courseid

      console.log("courseid=" + this.courseid)
      //跳转到课程基本信息
      this.$router.push({ path: '/course/manage/baseinfo/'+this.courseid})

    }
  }
</script>
<style scoped>
.el-menu-demo >>> .el-menu-item {
  float: left;
}

</style>
