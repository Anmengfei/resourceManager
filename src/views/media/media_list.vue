<template>
  <div style="margin-top:5px;">
    <!--查询表单-->
    <el-form :model="params">
      标签：
      <el-input v-model="params.tag" style="width:160px"></el-input>
      原始名称：
      <el-input v-model="params.fileOriginalName" style="width:160px"></el-input>
      处理状态：
      <el-select v-model="params.processStatus" placeholder="请选择处理状态">
        <el-option
          v-for="item in processStatusList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
     
      <el-button type="primary" v-on:click="query" size="small" style="margin-left:10px;">查询</el-button>
      <router-link class="mui-tab-item" :to="{path:'/upload'}">
        <el-button  type="primary" size="small" v-if="ischoose != true" style="margin-left:10px;">上传文件</el-button>
      </router-link>
    </el-form>
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="30">
      </el-table-column>
      <el-table-column prop="prename" label="原始文件名称" width="220">
      </el-table-column>
      <el-table-column prop="name" label="文件名称" width="220">
      </el-table-column>
      <el-table-column prop="url" label="访问url" width="260">
      </el-table-column>
      <el-table-column prop="type" label="标签" width="100">
      </el-table-column>
      <el-table-column prop="size" label="文件大小" width="120">
      </el-table-column>
      <el-table-column prop="status" label="处理状态" width="100" :formatter="formatProcessStatus">
      </el-table-column>
      <el-table-column prop="data" label="创建时间" width="110" :formatter="formatCreatetime">
      </el-table-column>
      <el-table-column label="预览" width="100" v-if="ischoose != true">
        <template slot-scope="scope">
          <el-button
            size="small" type="primary" plain @click="process(scope.row.url)">开始处理
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

      <el-pagination background layout="prev, pager, next" @current-change="changePage" :page-size="this.params.size"
                     :total="total" :current-page="this.params.page"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>
<script>
  import { media_list } from "@/api/media/media";
  import utilApi from '@/utils/utils';
  export default{
    props: ['ischoose'],
    data(){
      return {
        params:{
          page:1,//页码
          size:10,//每页显示个数
          tag:'',//标签
          fileName:'',//文件名称
          processStatus:'',//处理状态
          username: ''
        },
        listLoading:false,
        list:[],
        total:0,
        processStatusList:[]
      }
    },
    methods:{
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
      query(){
        this.params.username = localStorage.getItem('username')
        media_list(this.params.page,this.params.size,this.params).then((res)=>{
          console.log(res)
          if (res.success) {
            this.total = res.queryResult.total
            this.list = res.queryResult.list
          }
        })
      }
    },
    created(){
        //默认第一页
      this.params.page = Number.parseInt(this.$route.query.page||1);
    },
    mounted() {
      //默认查询页面
      this.query()
      //初始化处理状态
      this.processStatusList = [
        {
          id:'',
          name:'全部'
        },
        {
          id:'100',
          name:'处理中'
        },
        {
          id:'101',
          name:'处理成功'
        },
        {
          id:'103',
          name:'处理失败'
        },
        {
          id:'102',
          name:'无需处理'
        }
      ]
    }
  }
</script>
<style>

</style>
