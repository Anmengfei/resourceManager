<template>
  <div style="margin-top:5px;">
    <!--查询表单-->
    <el-form :model="queryParams" style="margin-left:3%;margin-bottom:15px;">
     
      学生名称：
      <el-input v-model="queryParams.user_name" style="width:160px"></el-input>
      手机号：
      <el-input v-model="queryParams.phonenumber" style="width:160px"></el-input>
     
      <el-button type="primary" v-on:click="query" size="small" style="margin-left:10px;">查询</el-button>
      <el-button type="primary" v-on:click="clearQuery" size="small" style="margin-left:10px;">重置</el-button>
      
    </el-form>
    <br />
    
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="user_name" label="学生名称" align="center" >
      </el-table-column>
      <el-table-column prop="phonenumber" label="手机号" align="center" >
      </el-table-column>
      <el-table-column prop="content" label="性别" align="center"  :show-overflow-tooltip="true">
           <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.sex === '1' ">女</el-tag>
            <el-tag type="success" v-else-if="scope.row.sex === '0'">男</el-tag>
            <el-tag type="success" v-else>未设置</el-tag>
            </template>
      </el-table-column>
      <el-table-column prop="homework_count" label="作业提交数" align="center"  :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="操作"  align="center" >
        <template slot-scope="scope">
          <el-button
            size="small" type="success"  @click="viewDetail(scope.row)">查看详情
          </el-button>
          
         

        </template>
      </el-table-column>
      
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <el-pagination
            v-show="total>0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]" 
            :page-size="pagesize"         
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">    
        </el-pagination>
    </el-col>


    <el-dialog :visible.sync="open" :title="dialogTitle" width="40%">
      <div style="height: 413px; overflow-y: scroll; ">
        <el-form :model="currentInfo" :rules="rules" ref="currentInfo" label-width="120px">
          <el-form-item label="作业名称" prop="workName">
            <el-input v-model="currentInfo.workName" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="截止日期" prop="endTime" >
            <el-date-picker
              v-model="currentInfo.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="作业描述" prop="content">
            <el-input type="textarea" v-model="currentInfo.content" style="width: 90%; " ></el-input>
          </el-form-item>
         
            
          <el-form-item label="上传附件">
              <el-button class="update-button-style" id='pickfiles'>上传作业附件</el-button>
              <div class="progress">{{progress}}</div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitEdit('currentInfo')">提交</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
        
      </div>
    </el-dialog>

   




    <!-- 作业详情 -->
    <el-dialog title="作业详情" :visible.sync="workOpen" width="1200px" append-to-body>
        <el-row :gutter="20">
         
          <el-col :span="24">

             <el-form :model="queryParams2" style="margin-left:3%;margin-bottom:15px;">
     
              作业名称：
              <el-input v-model="queryParams2.work_name" style="width:160px"></el-input>
              批改状态：
              <el-select v-model="queryParams2.checkStatus" placeholder="请选择批改状态">
                <el-option
                  v-for="(item, key) in statusOptions"
                  :key="key"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            
              <el-button type="primary" v-on:click="queryWork" size="small" style="margin-left:10px;">查询</el-button>
              <el-button type="primary" v-on:click="clearQueryWork" size="small" style="margin-left:10px;">重置</el-button>
              
            </el-form>

          </el-col>
        </el-row>
        

        <el-table  :data="userList2" >
         <el-table-column type="index" label="序号" width="80" align="center" />
          <!-- <el-table-column label="学生名称" align="center" prop="userName" :show-overflow-tooltip="true"/> -->
          <el-table-column label="作业名称" align="center" prop="work_name" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="提交状态" align="center"  :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.homeworkStatus === 0" type="danger">未提交</el-tag>
               <el-tag v-else type="success">已提交</el-tag>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="批改状态" align="center"  :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.checkStatus === 0" type="danger">未批改</el-tag>
               <el-tag v-else type="success">已批改</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="作业附件" align="center"  :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button
                size="small" type="success" v-if="scope.row.homeworkStatus === 1"  @click="viewLink2(scope.row)">查看附件
              </el-button>
               <el-tag v-else type="danger">未提交作业</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="提交时间" align="center" prop="submit_time" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="操作" width="400" align="center" >
            <template slot-scope="scope">
              <el-button
                size="small" type="primary" :disabled="scope.row.homeworkStatus === 0"  @click="dealWork(scope.row)">批改回复
              </el-button>
        
            
            </template>
          </el-table-column> -->
         
          
        </el-table>

        <!--分页-->
  
        <el-pagination
            v-show="total2>0"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="currentPage2"
            :page-sizes="[5, 10, 20, 40]" 
            :page-size="pagesize2"         
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2">    
        </el-pagination>
    

      
    </el-dialog>





  </div>
</template>
<script>
  
  import { getStdList, getStdDetail, upWork, deleteWork, searchList, searchStd, checkAdd, checkUpdate } from "@/api/homework/homework";
  import utilApi from '@/utils/utils';
  export default{
    props: ['ischoose'],
    data(){
      return {
        alreadyCheck: false,
        responseForm: {
          homeworkId: undefined,
          checkContent: ''
        },
        responseOpen: false,
        responseFormRules: {
          checkContent: [
            { required: true, message: '请输入回复内容', trigger: 'blur' }
          ]
        },
        stdId: undefined,
        statusOptions: [
          {
            label: '已批改',
            value: 1
          },
          {
            label: '未批改',
            value: 0
          }
        ],
        queryParams2: {
          pageNum: 10,
          pageSize: 1,
          userName: '',
          checkStatus: undefined
        },
        total2: undefined,
        userList2: [],
        workOpen: false,
        courseid: '',
        typeOptions: ["图片", "视频", "文档"],
        props: {
            value: 'id',
            label:'name',
            children:'children'
          },
        categoryList: [],
        categoryActive: [],
        currentPage:1, //初始页
        currentPage2: 1,
        pagesize2: 10,
        pagesize:10,
        queryParams:{
          page:1,//页码
          size:10,//每页显示个数
          tag:'',//标签
          fileName:'',//文件名称
          processStatus:'',//处理状态
          username: '',
          userId: ''
        },
        listLoading:false,
        list:[],
        total:0,
        processStatusList:[],
        open: false,
        dialogTitle: '',
        progress: '',
        qiniuToken: '',
        currentInfo: {
          id: undefined,
          courseId: '',
          workName: '',
          endTime: '',
          content: '',
          workLink: ''
        },
        rules: {
          workName: [
            { required: true, message: '请输入作业名称', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择截止日期', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请输入作业描述', trigger: 'change' } 
          ]
        },
      }
    },
    methods:{
      
      cancel() {
        this.open = false
        this.currentInfo = {
          id: undefined,
          courseId: '',
          workName: '',
          endTime: '',
          content: '',
          workLink: ''
        }
      },
      cancelResponse() {
        this.responseOpen = false
        this.responseForm.homeworkId = ''
        this.responseForm.checkContent = ''
      },

      
      
      handleSizeChange: function (size) {
                this.pagesize = size;
                this.getList()
                console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                this.getList()
                console.log(this.currentPage)  //点击第几页
        },

        handleSizeChange2: function (size) {
                this.pagesize2 = size;
                this.getStdInfo(this.stdId)
                console.log(this.pagesize2)  //每页下拉显示数据
        },
        handleCurrentChange2: function(currentPage){
                this.currentPage2 = currentPage;
                this.getStdInfo(this.stdId)
                console.log(this.currentPage2)  //点击第几页
        },
      formatCreatetime(row, column){
        var createTime = new Date(row.date);
        if (createTime) {
          return utilApi.formatDate(createTime, 'yyyy-MM-dd hh:mm:ss');
        }
      },
      formatProcessStatus(row,column){
        var processStatus = row.status;
        if (processStatus) {
            if(processStatus == '100'){
              return "处理中";
            }else if(processStatus == '101'){
              return "处理成功";
            }else if(processStatus == '103'){
              return "处理失败";
            }else if(processStatus == '102'){
              return "无需处理";
            }
        }
      },
      choose(mediaFile){
          if(mediaFile.status !='102' && mediaFile.status !='101'){
            this.$message.error('该文件未处理，不允许选择');
            return ;
          }
        if(!mediaFile.url){
          this.$message.error('该文件的访问url为空，不允许选择');
          return ;
        }
        //调用父组件的choosemedia方法
        this.$emit('choosemedia',mediaFile.mediaId,mediaFile.prename,mediaFile.url);
      },
      changePage(page){
        this.queryParams.page = page;
        this.query()
      },

      
      viewLink2(row) {
        console.log("查看链接2", row)
        window.open(row.homeworkLink) 
      },
      dealWork(row) {
        console.log("SAA", row)
        this.responseForm.checkContent = row.checkContent
        this.responseForm.homeworkId = row.id
        if(row.checkStatus === 0) {
          this.alreadyCheck = false
        } else {
          this.alreadyCheck = true
        }
        this.responseOpen = true
       
      },
      
      
      
      getStdInfo(id) {
          getStdDetail(this.currentPage2, this.pagesize2, id).then((res) => {
              console.log("ASASA", res)
              this.userList2 = res.data.rows
              this.total2 = res.data.total
          })
      },
      viewDetail(row) {
          console.log("row", row)
          this.stdId = row.user_id
          this.getStdInfo(this.stdId)
           this.workOpen = true
      },
    
      
      getList() {
        
          getStdList(this.currentPage, this.pagesize, this.courseid).then(res=>{
            console.log("res", res.data)
            this.list = res.data.rows
            this.total = res.data.total
            console.log("总数", this.total)
            
          })
      },
      resetForm() {
        this.currentInfo = {
          id: undefined,
          courseId: '',
          workName: '',
          endTime: '',
          content: '',
          workLink: ''
        }
      },
      resetResponseForm() {
        this.responseForm = {
          homeworkId: undefined,
          checkContent: ''
        }
      },
      queryWork() {},
      query(){
        
       var params = {
         courseId: this.courseid,
         endTime: this.queryParams.endTime,
         workName: this.queryParams.workName
       }
        findWorkList(this.currentPage, this.pagesize, params).then((res)=>{
          console.log(res)
          if (res.code === 200) {
           
            this.list = res.data.rows
            this.total = res.data.total
          }
        })
      },
     
      clearQueryWork() {},
      clearQuery() {
        
        this.queryParams = {
          page:1,//页码
          size:10,//每页显示个数
          workName: '',
          endTime: '',
          courseId: ''
        }
        this.getList()
        
        
      }
    },
    created(){
        
    },
    mounted() {
      //默认查询页面
       this.courseid = this.$route.params.courseid;
       console.log("courseId", this.courseid)
    
      this.getList()
      
      
    }
  }
</script>
<style>
.progress {
    color: red;
    font-size: 30px;
    margin-top: 20px;
  }
</style>
