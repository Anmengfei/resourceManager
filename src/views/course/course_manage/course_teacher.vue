<template>
  <div>
    <el-form :model="courseForm" label-width="80px" :rules="courseRules" ref="courseForm" >
      <br/>
      <el-form-item label="头像" prop="name">

        <el-upload
          class="avatar-uploader"
          :action="'http://58.119.112.14:11020/cms/filesystem/upload?userId=' + this.userId + '&courseId=' + this.courseid"
          :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="setuploaddata"
          name="multipartFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="名称" prop="teachername">
        <el-input type="textarea" v-model="courseForm.teachername" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="textarea" v-model="courseForm.email" ></el-input>
      </el-form-item>
      <el-form-item label="介绍" prop="des">
        <el-input type="textarea" v-model="courseForm.des" ></el-input>
      </el-form-item>
      

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click.native="save" :loading="editLoading">提交</el-button>
    </div>
  </div>
</template>

<script >

  import { updateTeacher, getTeacherById } from "@/api/course/course";

  export default {
    name: 'adatar',
    data() {
      return {
        userId: '',
        
        editLoading: false,
        courseForm: {
          id: '',
          teachername: '',
          des: '',
          src: "",
          email: ''
        },
        // picmax:1,//最大上传文件的数量
        courseid: '',
        imageUrl: '',
        courseRules: {
          teachername: [
            {required: true, message: '请输入教师名称', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入教师邮箱', trigger: 'blur'}
          ]

        }
        // dialogImageUrl: '',
        // dialogVisible: false,
        // fileList:[],
        // uploadval:{filetag:"course"},//上传提交的额外的数据 ，将uploadval转成key/value提交给服务器
      }
    },
    methods: {

      //在上传前设置上传请求的数据
      setuploaddata(){

      },
      save () {
        //修改课程
        this.$refs.courseForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              updateTeacher(this.courseid,this.courseForm).then((res) => {
                this.editLoading = false;
                if(res.success){
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                }else{
                  if(res.message){
                    this.$message.error(res.message);
                  }else{
                    this.$message.error('提交失败');
                  }
                }
              });
            });
          }
        });
      },
      //上传成功的钩子方法
      handleSuccess(response, file){
        console.log("1222222",response)
//        alert('上传成功')
        //调用课程管理的保存图片接口，将图片信息保存到课程管理数据库course_pic中
        //从response得到新的图片文件的地址
        if(response.success){
          // let fileId = response.fileSystem.fileId;
          this.courseForm.src = response.path;
          this.imageUrl = 'http://' + this.courseForm.src;

          updateTeacher(this.courseid,this.courseForm).then(res=>{
            if(res.success){
              this.$message.success("上传图片")
            }else{
              this.$message.error(res.message)
            }

          })
        }

      },
      //上传失败执行的钩子方法
      handleError(err, file){
        this.$message.error('上传失败');
        //清空文件队列
        this.fileList = []
      }
    },
    mounted() {
      //课程id
      this.courseid = this.$route.params.courseid;
      this.courseForm.id=this.$route.params.courseid;
      this.userId = '1'
      //查询课程
      getTeacherById(this.courseid).then(res => {
        if (res && res.src) {
          
          this.imageUrl = 'http://' + res.src
        }
        if(res) {
          this.courseForm = res;
        }
        
      })
    }
  }
</script>
<style lang="less">
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }


</style>
