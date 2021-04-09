<template>
  <div style="margin-top:5px;">
    <!--查询表单-->
    <el-form :model="params" style="margin-left:3%;margin-bottom:15px;">
      <!-- 标签：
      <el-input v-model="params.tag" style="width:160px"></el-input> -->
      课件名称：
      <el-input v-model="params.fileOriginalName" style="width:160px"></el-input>
      课件分类：
      <el-cascader
          class="inputWidth"
          expand-trigger="hover"
          :options="categoryList"
          v-model="categoryActive"
          :props="props">
      </el-cascader>
      课件类别：
      <el-select v-model="params.category" placeholder="请选择课件类别">
        <el-option
          v-for="item in typeOptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
     
      <el-button type="primary" v-on:click="query" size="small" style="margin-left:10px;">查询</el-button>
      <el-button type="primary" v-on:click="clearQuery" size="small" style="margin-left:10px;">重置</el-button>
      <!-- <router-link class="mui-tab-item" :to="{path:'/upload'}">
        <el-button  type="primary" size="small" v-if="ischoose != true" style="margin-left:10px;">上传文件</el-button>
      </router-link> -->
    </el-form>
    <!--列表-->
    <el-table :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="prename" label="课件名称" align="center">
      </el-table-column>
      <el-table-column prop="mt" label="方向" width="260">
      </el-table-column>
      <el-table-column prop="st" label="分类" width="260">
      </el-table-column>
      <el-table-column prop="category" label="课件类型" width="150" align="center">
      </el-table-column>
      <!-- <el-table-column prop="name" label="文件名称" width="220">
      </el-table-column> -->
      <!-- <el-table-column prop="url" label="访问url" width="260">
      </el-table-column> -->
      <!-- <el-table-column prop="type" label="课件类型" width="150" align="center">
      </el-table-column> -->
      <!-- <el-table-column prop="size" label="文件大小" width="120">
      </el-table-column>
      <el-table-column prop="status" label="处理状态" width="100" :formatter="formatProcessStatus">
      </el-table-column> -->
      <el-table-column prop="data" label="课件上传时间"  :formatter="formatCreatetime" align="center">
      </el-table-column>
      <el-table-column label="操作" width="200" v-if="ischoose != true">
        <template slot-scope="scope">
          <el-button
            size="small" type="primary" plain @click="process(scope.row.url)">下载
          </el-button>
          <!--<el-link type="success" :href="scope.row.url">成功链接</el-link>-->

        </template>
      </el-table-column>
      <el-table-column label="选择" width="80" v-if="ischoose == true">
        <template slot-scope="scope">
        <el-button
          size="small" type="primary" plain @click="choose(scope.row)">选择</el-button>
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
  </div>
</template>
<script>
  import { shareMedia } from "@/api/media/media";
  import { category_findlist } from "@/api/course/course";
  import utilApi from '@/utils/utils';
  export default{
    props: ['ischoose'],
    data(){
      return {
        typeOptions: ["图片", "视频", "文档"],
        props: {
            value: 'id',
            label:'name',
            children:'children'
          },
        categoryList: [],
        categoryActive: [],
        currentPage:1, //初始页
        pagesize:10,
        params:{
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
        processStatusList:[]
      }
    },
    methods:{
      getCategoryList() {
          category_findlist().then(res=>{
            this.categoryList = res.children;
            console.log(this.categoryList)
          })
        },
      handleSizeChange: function (size) {
                this.pagesize = size;
                console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
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
        this.params.page = page;
        this.query()
      },
      process (id) {
        location.href=id;
        // media_process(id).then((res)=>{
        //   console.log(res)
        //  if(res.success){
        //    this.$message.success('开始处理，请稍后查看处理结果');
        //    this.query()
        //  }else{
        //    this.$message.error('操作失败，请刷新页面重试');
        //  }
        // })
      },
      getList() {
        console.log("加载")
        var params = {
          page: 1,
          size: 10,
          userId: localStorage.getItem('userId')
        }
        shareMedia(params).then((res)=>{
          console.log(res)
          if (res.code === 200) {
            this.total = res.total
            this.list = res.rows
          }
        })
      },
      query(){
        
        this.params.userId = localStorage.getItem('userId')
        this.params.mt = this.categoryActive[0]
         this.params.st = this.categoryActive[1]
        shareMedia(this.params).then((res)=>{
          console.log(res)
          if (res.code === 200) {
            this.total = res.total
            this.list = res.rows
          }
        })
      },
      clearQuery() {
        
        this.params = {
          page:1,//页码
          size:10,//每页显示个数
          tag:'',//标签
          fileName:'',//文件名称
          processStatus:'',//处理状态
          username: '',
          userId: localStorage.getItem('userId'),
          st: '',
          mt: '',
          category: '',
          fileOriginalName: ''
        }
        this.categoryActive = []
        this.getList()
        // shareMedia(this.params).then((res)=>{
        //   console.log("重置", res)
        //   if (res.code === 200) {
        //     this.total = res.total
        //     this.list = res.rows
        //   }
        // })
        
      }
    },
    created(){
        //默认第一页
      
      // this.getCategoryList()
      // this.getList()
      //this.params.page = Number.parseInt(this.$route.query.page||1);
    },
    mounted() {
      //默认查询页面
      this.getCategoryList()
      this.getList()
      
    }
  }
</script>
<style>

</style>
