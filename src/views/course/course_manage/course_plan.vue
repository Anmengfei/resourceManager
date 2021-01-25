<template>
  <div>
    <el-button type="primary" @click="teachplayForm">添加课程计划</el-button>
    <el-tree
      :data="teachplanList"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>

    <el-dialog title="添加课程计划" :visible.sync="teachplayFormVisible" >

      <el-form ref="teachplanForm"  :model="teachplanActive" label-width="140px" style="width:600px;" :rules="teachplanRules" >
        <el-form-item label="上级结点" >
          <el-select v-model="teachplanActive.parentid" placeholder="不填表示根结点">
            <el-option
              v-for="item in teachplanList"
              :key="item.id"
              :label="item.pname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="章节/课时名称" prop="pname">
          <el-input v-model="teachplanActive.pname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程类型" >
          <el-radio-group v-model="teachplanActive.ptype">
            <el-radio class="radio" label='1'>视频</el-radio>
            <el-radio class="radio" label='2'>文档</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程有效期" prop="expires">
          <b v-for="valid in validList">
            <el-radio v-model="teachplanActive.valid" :label="valid.sdId" >{{valid.sdName}}</el-radio>&nbsp;&nbsp;
          </b>
          <br/>
          <!--<el-date-picker :disabled="this.teachplanActive.valid == '204002'?false:true"  type="date" placeholder="选择日期" v-model="teachplanActive.startTime"></el-date-picker>-->
          <!--<br/>-->
          <!--<el-time-picker-->
            <!--is-range-->
            <!--:disabled="this.teachplanActive.valid == '204002'?false:true"-->
            <!--v-model="teachplanActive.time"-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始时间"-->
            <!--end-placeholder="结束时间"-->
            <!--placeholder="选择时间范围">-->
          <!--</el-time-picker>-->
          <el-date-picker
            :disabled="this.teachplanActive.valid == '204002'?false:true"
            
            v-model="teachplanActive.starttime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['09:00:00', '10:00:00']">
          </el-date-picker>


        </el-form-item>
        <el-form-item label="排序字段" >
          <el-input v-model="teachplanActive.orderby" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="章节/课时介绍" prop="description">
          <el-input type="textarea" v-model="teachplanActive.description" ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="teachplanActive.status" >
            <el-radio class="radio" label="0" >未发布</el-radio>
            <el-radio class="radio" label='1'>已发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  >
          <el-button type="primary" v-on:click="addTeachplan">提交</el-button>
          <el-button type="primary" v-on:click="resetForm">重置</el-button>
        </el-form-item>


      </el-form>
    </el-dialog>
    <el-dialog title="选择媒资文件" :visible.sync="mediaFormVisible" >
       <el-tabs v-model="activeName" class="tabs" @tab-click="handleTabs">
        <el-tab-pane label="我的课件" name="first" class="label_top">
          <!-- <media-list v-if="myMediaFlag" v-bind:ischoose="true"></media-list> -->
           <media-list v-if="myMediaFlag" v-bind:ischoose="true" @choosemedia="choosemedia"></media-list>
        </el-tab-pane>
        <el-tab-pane label="共享课件" name="second" class="label_top">
          <!-- <share-media v-if="shareFlag" v-bind:ischoose="true"></share-media> -->
          <share-media v-if="shareFlag" v-bind:ischoose="true" @choosemedia="choosemedia"></share-media>
        </el-tab-pane>

      </el-tabs>
      <!-- <media-list v-bind:ischoose="true" @choosemedia="choosemedia"></media-list> -->
    </el-dialog>
  </div>
</template>
<script>
  let id = 1000;
  
  import { savemedia, addTeachplan, findTeachplanInfo, deleteTeachplanInfo, findTeachplanList } from "@/api/course/course";
  import mediaList from '@/views/media/media_list.vue';
  import shareMedia from '@/views/media/shareMedia.vue';
  export default {
    components:{
      mediaList,
      shareMedia
    },
    data() {
      return {
        activeName: 'first',
      myMediaFlag: true,
      shareFlag: false,
        userId: '',
        courseId: '',
        mediaFormVisible:false,
        teachplayFormVisible:false,//控制添加窗口是否显示
        validList:[
          { "sdName" : "永久有效", "sdId" : "204001", "sd_status" : "1" },
          { "sdName" : "指定时间段", "sdId" : "204002", "sd_status" : "1" }
        ],
        teachplanList : [{
          id: 1,
          pname: '一级 1',
          children: [{
            id: 4,
            pname: '二级 1-1',
            children: [{
              id: 9,
              pname: '三级 1-1-1'
            }, {
              id: 10,
              pname: '三级 1-1-2'
            }]
          }]
        }],
        defaultProps:{
          children: 'children',
          label: 'pname'
        },
        teachplanRules: {
          pname: [
            {required: true, message: '请输入课程计划名称', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ]
        },
        teachplanActive:{
          valid:'',
          starttime: '' ,
        },
        teachplanId:''
      }
    },
    methods: {
      handleTabs(tab, event) {
       console.log(tab, event);
       if(tab.name === 'first') {
         this.myMediaFlag = true
         this.shareFlag = false
       } else {
         this.myMediaFlag = false
         this.shareFlag = true
       } 
    },
        //选择视频，打开窗口
      choosevideo(data){
          //得到当前的课程计划
          this.teachplanId = data.id
//        alert(this.teachplanId)
          this.mediaFormVisible = true;//打开窗口
      },
      teachplayForm(){
        this.teachplanActive={}
        this.teachplayFormVisible=true
      },
      //保存选择的视频
      choosemedia(mediaId,fileOriginalName,mediaUrl){
        console.log("plan选择视频")
        this.mediaFormVisible = false;
        //保存视频到课程计划表中
        let teachplanMedia ={}
        teachplanMedia.mediaId =mediaId;
        teachplanMedia.mediaFileOriginalName =fileOriginalName;
        teachplanMedia.mediaUrl =mediaUrl;
        teachplanMedia.courseId =this.courseid;
        //课程计划
        teachplanMedia.teachplanId=this.teachplanId
        // teachplanMedia.date=this.teachplanActive.startTime



        savemedia(teachplanMedia).then(res=>{
            if(res.success){
                this.$message.success("选择视频成功")
              //查询课程计划
              this.findTeachplan()
            }else{
              this.$message.error(res.message)
            }
        })
      },
      //提交课程计划
      addTeachplan(){
        //校验表单
        this.$refs.teachplanForm.validate((valid) => {
            if (valid) {
                //调用api方法
              //将课程id设置到teachplanActive
              this.teachplanActive.courseid = this.courseid
              if (this.teachplanActive.starttime !== undefined && this.teachplanActive.starttime instanceof Array && this.teachplanActive.starttime.length >1) {
                this.teachplanActive.endtime=this.teachplanActive.starttime[1]
                this.teachplanActive.starttime=this.teachplanActive.starttime[0]
              }

              addTeachplan(this.teachplanActive).then(res=>{
                if(res.success){
                    this.$message.success("添加成功")
                  //清空表单
                    this.teachplanActive={}
                    //刷新树
                    this.findTeachplan()
                    this.teachplayFormVisible=false
                }else{
                  this.$message.error(res.message)
                }

              })
            }
        })
      },
  //重置表单
      resetForm(){
        this.teachplanActive = {}
      },

      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);

      },
      edit(data){
        console.log(data)
        this.teachplanId = data.id
        findTeachplanInfo(this.courseid,this.teachplanId).then(res => {
          this.teachplanActive=res
          if(res.grade === '2'){
            this.teachplanActive.parentid=null
          }
          this.teachplayFormVisible=true
        });
      },
      remove(node, data) {
        // console.log(node)
        console.log(data)
        deleteTeachplanInfo(this.courseid,data.id).then(res=>{
          if(res.success){
            this.$message.success("删除视频成功")
            //查询课程计划
            this.findTeachplan()
          }else{
            this.$message.error(res.message)
          }
        });
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // console.log(index)
        // children.splice(index, 1);

      },
      renderContent(h, { node, data, store }) {
        if (data.grade ==='3') {
          return (
            <span
              style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text"
                         on-click={() => this.choosevideo(data)}>{data.mediaFileOriginalName}&nbsp;&nbsp;&nbsp;&nbsp; 选择视频</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={() => this.edit(data)}>修改</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={() => this.remove(node, data)}>删除</el-button>
            </span>
          </span>);
        }else {
          return (
            <span
              style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text" on-click={() => this.edit(data)}>修改</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={() => this.remove(node, data)}>删除</el-button>
            </span>
          </span>);
        }
      },
      findTeachplan(){
        this.teachplanList = []
        //查询课程计划
        findTeachplanList(this.courseid, this.userId).then(res=>{
            if(res && res.children){
              this.teachplanList = res.children;
            }


        })
      }
    },
    mounted(){
      //课程id
      this.courseid = this.$route.params.courseid;
      this.userId = '1'
      //查询课程计划
      this.findTeachplan()
    }
  }
</script>
<style>

</style>
