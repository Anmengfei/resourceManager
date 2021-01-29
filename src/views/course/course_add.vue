<template>
  <div class="marginCenter">
    <el-form :model="courseForm" label-width="150px" :rules="courseRules" ref="courseForm" class="marginCenter">
      <el-form-item label="课程名称" prop="name" >
        <el-input v-model="courseForm.name" auto-complete="off" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="二级标题" prop="subtitle">
        <el-input v-model="courseForm.subtitle" auto-complete="off" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="适用人群" prop="users">
        <el-input type="textarea" v-model="courseForm.users" auto-complete="off" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryActive">
        <el-cascader
          class="inputWidth"
          expand-trigger="hover"
          :options="categoryList"
          v-model="categoryActive"
          :props="props">
        </el-cascader>
      </el-form-item>
      <el-form-item label="难度" prop="grade">
        <b v-for="grade in gradeList">
          <el-radio v-model="courseForm.grade" :label="grade.sdId" >{{grade.sdName}}</el-radio>&nbsp;&nbsp;
        </b>
      </el-form-item>
      <el-form-item label="学习模式" prop="studymodel">
        <b v-for="studymodel_v in studymodelList">
          <el-radio v-model="courseForm.studymodel" :label="studymodel_v.sdId" >{{studymodel_v.sdName}}</el-radio>&nbsp;&nbsp;
        </b>

      </el-form-item>

      <el-form-item label="课程介绍" prop="description">
        <el-input type="textarea" v-model="courseForm.description" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="技术储备要求 " prop="requireskill">
        <el-input type="requireskill" v-model="courseForm.requireskill" class="inputWidth"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click.native="save" >提交</el-button>
    </div>
  </div>
</template>
<script>

  import { addCourseBase, category_findlist } from "@/api/course/course";
  export default {

    data() {
      return {
        studymodelList:[
          { "sdName" : "自由学习", "sdId" : "201001", "sdStatus" : "1" },
          { "sdName" : "任务式学习", "sdId" : "201002", "sdStatus" : "1" }
        ],
        gradeList:[
          {
            "sdName" : "低级",
            "sdId" : "200001",
            "sdStatus" : "1"
          },
          {
            "sdName" : "中级",
            "sdId" : "200002",
            "sdStatus" : "1"
          },
          {
            "sdName" : "高级",
            "sdId" : "200003",
            "sdStatus" : "1"
          }
        ],
        props: {
          value: 'id',
          label:'name',
          children:'children'
        },
        categoryList: [],
        categoryActive:[],
        courseForm: {
          id:'',
          name: '',
          users: '',
          grade:'',
          studymodel:'',
          mt:'',
          st:'',
          description: '',
          username: ''
          
        },
        courseRules: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '请选择课程分类', trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择课程等级', trigger: 'blur'}
          ],
          studymodel: [
            {required: true, message: '请选择学习模式', trigger: 'blur'}
          ],
          subtitle: [
            {required: true, message: '请输入二级标题', trigger: 'blur'}
          ],
          categoryActive: [
            {required: true, message: '请选择课程分类', trigger: 'blur'}
          ],
          requireskill: [
            {required: true, message: '请输入技术储备', trigger: 'blur'}
          ]

        }
      }
    },
    methods: {
        //新增课程提交
      save () {
          //处理课程分类
          // 选择课程分类存储到categoryActive
           this.courseForm.mt=  this.categoryActive[0]//大分类
           this.courseForm.st=  this.categoryActive[1]//小分类
           console.log("ASASA", localStorage.getItem('userId'))
           this.courseForm.username= localStorage.getItem('userId')
          
           console.log("ceshi", this.courseForm)
          addCourseBase(this.courseForm).then(res=>{
              if(res.success){
                  this.$message.success("提交成功")
                //跳转到我的课程
                this.$router.push({ path: '/course/course_list'})
               // this.resetForm()
                
              }else{
                this.$message.error(res.message)
              }

          })
      },
      resetForm() {
        this.courseForm.id = '',
        this.courseForm.name = '',
        this.courseForm.users = '',
        this.courseForm.grade = '',
        this.courseForm.studymodel = '',
        this.courseForm.mt = '',
        this.courseForm.st = '',
        this.courseForm.description = '',
        this.courseForm.username = '',
       
        this.courseForm.name = '',
        this.courseForm.users = ''
        
        
    
         
      },
      getCategoryList() {
        category_findlist().then(res=>{
          this.categoryList = res.children;
          console.log(this.categoryList)

        })
      }
    },
    created(){

    },
    mounted(){
      // 查询课程分类
      
      this.getCategoryList()

      //查询数据字典
      //查询课程等级
      // systemApi.sys_getDictionary("200").then(res=>{

      //   this.gradeList = res.dvalue;
      // })
      //查询学习模式
      // systemApi.sys_getDictionary("201").then(res=>{

      //   this.studymodelList = res.dvalue;
      // })

    }
  }
</script>
<style scoped>
.marginCenter {
  margin-top:5%;
  margin-left:5%;
}
.inputWidth {
  width:400px;
}
.dialog-footer {
  margin-left:20%;
}
</style>

