<template>
  <div>
    <template>
      <div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>课程预览</span>
          </div>
          <div class="text item">
            <el-button type="primary"  @click.native="preview" >课程预览</el-button>
            <br/><br/>
            <span v-if="previewurl && previewurl!=''" style="color:red;"><a :href="previewurl" target="_blank">点我查看课程预览页面 </a> </span>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>课程发布</span>
          </div>
          <div class="text item">
            <div v-if="course.status == '未发布'">
              状态：制作中<br/>
              <el-button type="primary"  @click.native="publish" >新课程发布</el-button>
            </div>
            <div v-else-if="course.status == '已发布'">
              状态：已发布<br/>
              <el-button type="primary"  @click.native="publish" >修改发布</el-button>
              <br/><br/>
              <span style="color:red;"><a :href="'http://www.qingcheng.net.cn/qingcheng/#/videoclass?class_id='+ this.courseid + '&userId=' + this.userId" target="_blank">点我查看课程详情页面 </a> </span>
            </div>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>
<script>
 
  import { preview, publish, findCourseView } from "@/api/course/course";
export default{

  data() {
    return {
      dotype: '',
      courseid: '',
      course: {"id": "", "name": "", "status": ""},
      previewurl: '',
      userName: '',
      userId: ''
    }
  },
  methods:{
    //预览
    preview(){
        //调用课程管理服务的预览接口，得到课程预览url
      preview(this.courseid, this.userId).then((res) => {
        if(res.success){
          this.$message.success('预览页面生成成功，请点击下方预览链接');
          if(res.previewUrl){
            //预览url
            this.previewurl = res.previewUrl
          }
        }else{
          this.$message.error(res.message);
        }
      });
    },
    publish(){
      //课程发布
      publish(this.courseid, this.userId).then(res=>{
          if(res.success){
              this.$message.success("发布成功，请点击下边的链接查询课程详情页面")
            //查询课程信息
            // this.getcourse()
          }else{
            this.$message.error(res.message)
          }

      })
    },
    getCourseView(){
      findCourseView(this.courseid, this.userId).then(res=>{
        if(res && res.courseBase){
            //获取课程状态
            this.course.status = res.courseBase.status;
        }

      })
    }

  },
  mounted(){
    //课程id
    this.courseid = this.$route.params.courseid;
    this.userName = 'admin';
    this.userId = localStorage.getItem('userId');
    //查询课程信息
    this.getCourseView();
  }

  }
</script>
<style>

</style>
