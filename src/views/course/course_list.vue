<template>
  <section>
    <el-row >
      <el-col :span="8"  :offset=2 >
        <el-card :body-style="{ padding: '10px' }" style="height:250px;margin-top:10px;">
          <img :src="imgUrl" class="imageAdd" height="220px">
          <div style="position:absolute;margin-top:-40px;z-index=200;" >
            <!-- <span>课程名称</span> -->
            <div class="bottom clearfix">
              <time class="time"></time>
              <router-link class="mui-tab-item" :to="{path:'/course/add/base'}">
                  <el-button type="text" class="button" >新增课程</el-button>
              </router-link>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-for="(course, index) in courses" :key="course.id" :offset="index > 0 ? 2 : 2">
        <el-card :body-style="{ padding: '10px' }" style="height:250px;margin-top:10px">
          <img :src="course.pic!=null?'http://'+course.pic:'/cms/static/images/nonepic.jpg'" class="image" height="150px">
          <div style="padding: 10px;">
            <span>{{course.name}}</span>
            <div class="bottom clearfix">
              <time class="time"></time>
              <el-button type="text" class="button" @click="handleManage(course.id)">管理课程</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      
    </el-row>
    <el-row class="secondRow">
      <!--分页-->
      <el-col :span="12"></el-col>
      <el-col :span="12" class="toolbar">
        <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size"
                       :total="total" :current-page="page"
                       style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>
  </section>
</template>
<script>
  import { findCourseList } from "@/api/course/course";

  export default {
    data() {
      return {
        page:1,
        size:7,
        total: 0,
        courses: [
          ],
        params: {
         
        },
        sels: [],//列表选中列
        imgUrl:'http://58.119.112.14:11013/cms-manager/file/avatar/2020/12/22/20201222111630.png'
      }
    },
    methods: {
        //分页方法
      handleCurrentChange(val) {
        this.page = val;
        this.getCourse();
      },
      //获取课程列表
      getCourse() {
        this.params.userId = localStorage.getItem('userId')
        findCourseList(this.page,this.size,this.params).then((res) => {
          if(res.success){

            this.total = res.queryResult.total;
            this.courses = res.queryResult.list;
          }else{
            if (res.code === 10001) {
              window.location.href = 'http://www.zhongkeruitong.top/show/snake_python/#/login/';
            }
          }

        });
      },
      handleManage: function (id) {
        console.log(id)
        this.$router.push({ path: '/course/manager/'+id})
      },
      // jumpAdd() {
      //   this.$router.push({path: '/course/add/base'})
      // }

    },
    created(){

    },
    mounted() {
    //   this.$route.query.username = 'admin'
    //   this.params.username = this.$route.query.username
    //   if (this.params.username === undefined || this.params.username === '') {
    //     this.params.username = localStorage.getItem('username')
    //     if (this.params.username === undefined || this.params.username === ''){
    //       window.location.href = 'http://www.zhongkeruitong.top/show/snake_python/#/login/';
    //     }
    //   }else {
    //     localStorage.setItem('username',this.params.username);
        
    //   }
    //   console.log(this.params.username)
      //查询我的课程
      this.getCourse();
    }
  }
</script>
<style scoped>
  .el-col-8{
    width:20%
  }
  .el-col-offset-2{
    margin-left:2%
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }
  .imageAdd {
    width: 100%;
     display: block;
     z-index: 1;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .secondRow {
    margin-top:60px
  }
</style>
