<template>
  <div style="margin-top:5px;">
    <!--查询表单-->
    <el-form :model="queryParams" style="margin-left:3%;margin-bottom:15px;">
     
      作业名称：
      <el-input v-model="queryParams.workName" style="width:160px"></el-input>
      截止时间：
      <el-date-picker
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
      </el-date-picker>
     
      <el-button type="primary" v-on:click="query" size="small" style="margin-left:10px;">查询</el-button>
      <el-button type="primary" v-on:click="clearQuery" size="small" style="margin-left:10px;">重置</el-button>
      
    </el-form>
    <br />
    <el-button  style="margin-left: 20px;margin-bottom:10px;"  type="primary" @click="addWork">新增作业</el-button>
    
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="workName" label="作业名称" align="center" width="260">
      </el-table-column>
      <el-table-column prop="endTime" label="截止时间" align="center" width="260">
      </el-table-column>
      <el-table-column prop="content" label="作业内容" align="center"  :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="作业附件" align="center"  :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button
            size="small" type="success"  @click="viewLink(scope.row)">查看附件
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400" align="center" >
        <template slot-scope="scope">
          <el-button
            size="small" type="warning"  @click="updateWork(scope.row)">修改
          </el-button>
          <el-button
            size="small" type="danger"  @click="delWork(scope.row)">删除
          </el-button>
          <el-button
            size="small" type="success"  @click="viewWork(scope.row)">查看作业
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

    <!-- 批改回复 -->
    <el-dialog :visible.sync="responseOpen" title="批改回复" width="40%">
      <div style="">
        <el-form :model="responseForm" :rules="responseFormRules" ref="responseForm" label-width="120px">
          <el-form-item label="回复内容" prop="checkContent">
            <el-input type="textarea" v-model="responseForm.checkContent" style="width:80%;" ></el-input>
          </el-form-item>
         

          <el-form-item>
            <el-button type="primary" @click="submitResponse('responseForm')">提交</el-button>
            <el-button @click="cancelResponse">取消</el-button>
          </el-form-item>
        </el-form>
        
      </div>
    </el-dialog>




    <!-- 作业详情 -->
    <el-dialog title="作业详情" :visible.sync="workOpen" width="1200px" append-to-body>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-tag type="success" style="cursor:pointer" @click="stdSubmited">已提交</el-tag> | 
            <el-tag type="danger" style="cursor:pointer" @click="stdSubmitNo">未提交</el-tag>
          </el-col>
          <el-col :span="14">

             <el-form :model="queryParams2" style="margin-left:3%;margin-bottom:15px;">
     
              学生名称：
              <el-input v-model="queryParams2.userName" style="width:160px"></el-input>
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
          <el-table-column label="学生名称" align="center" prop="userName" :show-overflow-tooltip="true"/>
          <!-- <el-table-column label="作业名称" align="center" prop="workName" :show-overflow-tooltip="true" width="200"/> -->
          <!-- <el-table-column label="提交状态" align="center"  :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.homeworkStatus === 0" type="danger">未提交</el-tag>
               <el-tag v-else type="success">已提交</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="批改状态" align="center"  :show-overflow-tooltip="true">
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
               <el-tag v-else :disabled="disabledTrue" type="danger">未提交作业</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" align="center" prop="submitTime" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="400" align="center" >
            <template slot-scope="scope">
              <el-button
                size="small" type="primary" :disabled="scope.row.homeworkStatus === 0"  @click="dealWork(scope.row)">批改回复
              </el-button>
             
              <!-- <el-button
                size="small" type="primary" :disabled="scope.row.homeworkStatus === 0"  @click="workDetail(scope.row)">作业详情
              </el-button> -->
            
            </template>
          </el-table-column>
         
          
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
  require("../../../assets/js/qiniu.min")
  import { findWorkList, saveWork, upWork, deleteWork, searchList, searchStd, checkAdd, checkUpdate } from "@/api/homework/homework";
  import utilApi from '@/utils/utils';
  export default{
    props: ['ischoose'],
    data(){
      return {
        disabledTrue: true,
        currentStatus: undefined,
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
        workId: undefined,
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
      stdSubmited() {
        this.currentStatus = 1
        var params = {
          id: this.workId,
          status: this.currentStatus
        }
        this.findStduList(params)
      },
      stdSubmitNo() {
        this.currentStatus = 0
        var params = {
          id: this.workId,
          status: this.currentStatus
        }
        this.findStduList(params)
      },
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
               
                var params = {
                  
                  id: this.workId,
                  status: this.currentStatus
                }
                this.findStduList(params)
                console.log(this.pagesize2)  //每页下拉显示数据
        },
        handleCurrentChange2: function(currentPage){
                this.currentPage2 = currentPage;
                var params = {
                  id: this.workId,
                  status: this.currentStatus
                }
                this.findStduList(params)
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

      initQiniu () {
          console.log("AAA", Qiniu)
          /* eslint-disable */
          Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            flash_swf_url: 'https://cdn.bootcss.com/plupload/2.1.1/Moxie.swf',
            chunk_size: '4mb',
            uptoken: '',
            get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的uptoken
            uptoken_url: 'https://www.zhongkeruitong.top/towerImg/cms/filesystem/getToken',
            uptoken_func: function(){        // 在需要获取uptoken时，该方法会被调用
              // do something(一般是发送手动发送ajax获取到token，如果后端返回格式不跟官方一致又不想该懂源代码可以通过这个方式调整)
              return uptoken;
            },
            domain: 'http://qiniu.zhongkeruitong.top/',
            get_new_uptoken: false,
            auto_start: true,
            max_retries: 3,
            filters: {
              max_file_size: '10000mb',
              prevent_duplicates: false
              // Specify what files to browse for
              // mime_types: [
              //     {title : 'apk files', extensions : 'apk'} // 限定apk后缀上传格式上传
              // ]
            },
            init: {
              'FilesAdded': (up, files) => {
                console.log('文件就绪', files);
                
              },
              'BeforeUpload': (up, file) => {
                console.log('上传之前', file);
                
              },
              'UploadProgress': (up, file) => {
                console.log('上传中 file',file);
                if(this.currentInfo.workName === '' || this.currentInfo.endTime === '') {
                    console.log('上传中 file',file);
                } else {
                   this.progress = file.percent + '%';
                }
               
              },
              'FileUploaded': (up, file, info) => {
                 if(this.currentInfo.workName === '' || this.currentInfo.endTime === '') {
                  this.$message.error('请填写作业的基本信息，再进行上传！');
                  return;
                }
                
                 var res = JSON.parse(info.response)
                
                // console.log("返回的数据3", str)
                //  console.log("返回的数据2", info)
                var domain = up.getOption('domain');
                // var res = eval('(' + info + ')');
                
              console.log("返回的数据", res)

                console.log("CourseForm", this.courseForm)
             
                var sourceLink = domain + res.key;//获取上传文件的链接地址
                
                console.log('文件上传完毕')
                console.log(sourceLink)
                this.currentInfo.workLink = sourceLink
              },
              Error: (up, err, errTip) => {
                console.log('上传失败', err);
              },
              Key: (up, file) => {}
            }
          });
        },


        submitEdit(formName) {
          console.log("提交的数据", this.currentInfo)
          this.$refs[formName].validate((valid) => {
            if(valid) {
              if(this.currentInfo.id === '' || this.currentInfo.id === undefined) {
                console.log("走的新增")
                
                saveWork(this.currentInfo).then((res) => {
                  console.log("新增作业res", res)
                    if(res.code === 200) {
                      this.$message({
                        type: 'success',
                        message: '新增成功！'
                      })
                      this.open = false
                      this.getList()
                      this.resetForm()
                    }
                   
                })
              } else {
                upWork(this.currentInfo).then((res) => {
                  console.log("走的修改")
                  console.log("修改作业res", res)
                  if(res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: '修改成功！'
                    })
                    this.open = false
                    this.getList()
                  }
                })
              }
              
            } else {
              this.$message.error('提交失败！')
            }
          })
        },


        submitResponse(formName) {
          console.log("提交的数据", this.responseForm)
          this.$refs[formName].validate((valid) => {
            if(valid) {
              if(this.alreadyCheck === false) {
                console.log("走的新增")
                
                checkAdd(this.responseForm).then((res) => {
                  console.log("新增作业res", res)
                    if(res.code === 200) {
                      this.$message({
                        type: 'success',
                        message: '新增成功！'
                      })
                      this.responseOpen = false
                      this.stdSubmited()
                      this.resetResponseForm()
                    }
                   
                })
              } else {
                checkUpdate(this.responseForm).then((res) => {
                  console.log("走的修改")
                  console.log("修改作业res", res)
                  if(res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: '修改成功！'
                    })
                    this.responseOpen = false
                    this.stdSubmited()
                  }
                })
              }
              
            } else {
              this.$message.error('提交失败！')
            }
          })
        },






      addWork() {
        this.dialogTitle = '新增作业'
        this.open = true
        this.currentInfo.courseId = this.courseid
         this.$nextTick(() => {
          this.initQiniu()
        })
        
      },
      viewLink(row) {
        console.log("查看链接", row)
        window.open(row.workLink) 
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
      
      updateWork(row) {
        console.log("row", row)
        this.currentInfo = row
        this.open = true
        this.dialogTitle = '修改作业'
        this.$nextTick(() => {
          this.initQiniu()
        })
      },
      delWork(row) {
        
        var params = {
          ids: row.id
        }
        deleteWork(params).then((res) => {
          console.log("删除", res)
          if(res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
           
            this.getList()
          }
        })
      },
      viewWork(row) {
        console.log("查看作业", row)
        this.currentStatus = 1
        this.workId = row.id
        var params = {
          id: row.id,
          status: this.currentStatus
        }
        this.findStduList(params)
        this.workOpen = true
      },
      findStduList(params) {
        searchStd(this.currentPage2, this.pagesize2, params).then((res) => {
          console.log("searchStd", res)
          if(res.code === 200) {
            this.userList2 = res.data.rows
            this.total2 = res.data.total
          } 
        })
      },
      getList() {
        var params = {
            courseId: this.courseid
          }
          findWorkList(this.currentPage, this.pagesize, params).then(res=>{
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
      queryWork() {
        if(this.queryParams2.userName === '' && this.queryParams2.checkStatus !== undefined) {
          var params = {
            checkStatus: this.queryParams2.checkStatus,
            id:this.workId,
            status: this.currentStatus
          }
        } else if(this.queryParams2.userName !== '' && this.queryParams2.checkStatus === undefined) {
          var params = {
            userName: this.queryParams2.userName,
            id:this.workId,
            status: this.currentStatus
          }
        } else if(this.queryParams2.userName !== '' && this.queryParams2.checkStatus !== undefined) {
          var params = {
            userName: this.queryParams2.userName,
            checkStatus: this.queryParams2.checkStatus,
            id:this.workId,
            status: this.currentStatus
          }
        } else {
          var params = {
            id:this.workId,
            status: this.currentStatus
          }
        }
        this.findStduList(params)

      },
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
     
      clearQueryWork() {
        this.queryParams2 = {
          page:1,//页码
          size:10,//每页显示个数
          workName: '',
          endTime: '',
          courseId: ''
        }
        var params = {
          id: this.workId,
          status: this.currentStatus
        }
        this.findStduList(params)
      },
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
