<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="课件名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入课件名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属课组" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入所属课组"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="课件类型" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="课件类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" :data="userList.slice((currentPage-1)*pagesize,currentPage*pagesize)" @selection-change="handleSelectionChange">
          <el-table-column type="index" label="用户编号" width="150" align="center" />
          <el-table-column label="课件名称" align="center" prop="prename" :show-overflow-tooltip="true"/>
          <el-table-column label="课件类型" align="center" prop="type" :show-overflow-tooltip="true" />
          <el-table-column label="所属课组" align="center" prop="deptName" :show-overflow-tooltip="true" />
          <el-table-column label="上传时间" align="center" prop="date" :formatter="formatCreatetime" :show-overflow-tooltip="true" />
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-download"
                @click="process(scope.row.url)"
                
              >下载</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-share"
                @click="share(scope.row)"
                
              >分享</el-button>
            </template>
          </el-table-column>
        </el-table>

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
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-row >
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container2">
          <el-tree
            :data="deptOptions2"
            :props="defaultProps2"
            :expand-on-click-node="false"
            :filter-node-method="filterNode2"
            ref="tree2"
            :highlight-current="true"
            default-expand-all
            @node-click="handleNodeClick2"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams2" ref="queryForm2" :inline="true" v-show="showSearch2" label-width="68px">
          <el-form-item label="姓名" prop="userName">
            <el-input
              v-model="queryParams2.userName"
              placeholder="请输入姓名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery2"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading2" :data="userList2.slice((currentPage2-1)*pagesize2,currentPage2*pagesize2)" @selection-change="handleSelectionChange2">
          <el-table-column type="selection" width="80" align="center" />
          <el-table-column label="姓名" align="center" prop="userName" :show-overflow-tooltip="true"/>
          <el-table-column label="所属课组" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
          <el-table-column label="手机号" align="center" prop="phonenumber" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="职位" align="center" prop="remark" :show-overflow-tooltip="true" /> -->
          
        </el-table>

       <pagination
          v-show="total2>0"
          :total="total2"
          :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize"
          @pagination="getList2"
        />
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">分 配</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>

    
  </div>
</template>

<script>
import { allMedia, assignDept, assignPeople } from "@/api/media/media";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import utilApi from '@/utils/utils';
import { listUser } from "@/api/system/user";



export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
        currentMediaId: '',
        currentPage:1, //初始页
        pagesize:10,
        currentPage2:1, //初始页
        pagesize2:10,
        deptId: undefined,
        deptId2: undefined,
      // 遮罩层
      loading: true,
      loading2: true,
      // 选中数组
      ids: [],
      ids2:[],
      // 非单个禁用
      single: true,
      single2: true,
      // 非多个禁用
      multiple: true,
      multiple2: true,
      // 显示搜索条件
      showSearch: true,
      showSearch2: true,
      // 总条数
      total: 0,
      total2: 0,
      // 用户表格数据
      userList: [],
      userList2: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      deptOptions2: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultProps2: {
        children: "children",
        label: "label"
      },
     
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "归属部门不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.deptId = localStorage.getItem('deptId')
    this.getList(this.deptId);
    this.getList2()
    this.getTreeselect();
    this.getTreeselect2()
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
      share(row) {
          this.open = true;
          this.currentMediaId = row.mediaId
      },
      handleSizeChange: function (size) {
                this.pagesize = size;
                console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
        },
    /** 查询用户列表 */
    getList(id) {
      console.log("deptId", id)
      
      this.loading = true;
      allMedia(id).then(response => {
          console.log("返回的数据", response)
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    
    getList2() {
      this.loading2 = true;
      listUser(this.addDateRange(this.queryParams2, this.dateRange2)).then(response => {
          this.userList2 = response.rows;
          this.total2 = response.total;
          this.loading2 = false;
        }
      );
    },
    process (id) {
        location.href=id;
    },
    formatCreatetime(row, column){
        var createTime = new Date(row.date);
        if (createTime) {
          return utilApi.formatDate(createTime, 'yyyy-MM-dd hh:mm:ss');
        }
      },
    
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    getTreeselect2() {
      treeselect().then(response => {
        this.deptOptions2 = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filterNode2(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.deptId = data.id;
      console.log("queryParams", this.queryParams.deptId)
      this.getList(this.deptId);
    },
    handleNodeClick2(data) {
        this.deptId2 = data.id
      this.queryParams2.deptId = data.id;
      console.log("queryParams2", this.queryParams2.deptId)
      this.getList2();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(row.userId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList(this.deptId);
    },
   handleQuery2() {
      this.queryParams2.page = 1;
      this.getList2();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange2 = [];
      this.resetForm2("queryForm2");
      this.handleQuery2();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleSelectionChange2(selection) {
        
      this.ids2 = selection.map(item => item.userId);
       console.log("ASASASASAS", this.ids2)
      this.single2 = selection.length != 1;
      this.multiple2 = !selection.length;
    },
    submitFileForm() {
        if(this.ids2.length === 0 && this.deptId2 === undefined) {
            this.$message({
                message: '请选择左侧课组或者选择右侧人员进行分配',
                type: 'warning'
            });
            return;
        } else {
            if(this.ids2.length === 0) {
                var data = {
                    deptId: this.deptId2,
                    mediaId: this.currentMediaId
                }
                assignDept(data).then((res) => {
                    console.log("分配", res)
                    if(res.code === 200) {
                        this.$message({
                            message: '分配成功',
                            type: 'success'
                        });  
                        this.open = false
                    } else {
                        this.$message({
                            message: '分配失败，请重新分配',
                            type: 'error'
                        });  
                    }
                })
            } else {
                var idsStr = this.ids2.join(',')
                var data = {
                    userids: idsStr,
                    mediaId: this.currentMediaId
                }
                assignPeople(data).then((res) => {
                    console.log("分配人", res)
                    if(res.code === 200) {
                        this.$message({
                            message: '分配成功',
                            type: 'success'
                        });  
                        this.open = false
                    } else {
                        this.$message({
                            message: '分配失败，请重新分配',
                            type: 'error'
                        });  
                    }
                })
            }
        }
    }

    
   
   
   
    
    
  }
};
</script>

<style scoped>
.head-container2 .el-tree >>> .is-current {
    color: red;
}
</style>
