<template>
  <div class="app-container">
    <div style="margin-bottom: 10px;" v-show="!showSearch">
      <div class="baseInfo">项目情况:</div>
      <el-row>
        <el-col :span="4">
          <el-tag type="danger" effect="dark">工程造价</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{baseInfo.proCost}}万</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="danger" effect="dark">合同工期</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{hetongTime}}天</el-tag>       
        </el-col>
        <el-col :span="4">
          <el-tag type="danger" effect="dark">建筑规模</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{baseInfo.proArea}}㎡</el-tag>        
        </el-col>
        </el-col>
        <el-col :span="6">
          <el-tag type="danger" effect="dark">工程类别</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{gongchengLeibie(baseInfo.protier)}}</el-tag>        
        </el-col>
        </el-col>
        <el-col :span="6">
          <el-tag type="danger" effect="dark">备案编号</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{baseInfo.proCode}}</el-tag>        
        </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:6px;">
        <el-col :span="8">
          <el-tag type="danger" effect="dark">建设单位</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{baseInfo.constructionUnitJs}}</el-tag>        
        </el-col>
        </el-col>
        <el-col :span="8">
          <el-tag type="danger" effect="dark">监理单位</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{baseInfo.constructionControlUnit}}</el-tag>        
        </el-col>
        </el-col>
        <el-col :span="8">
          <el-tag type="danger" effect="dark">施工单位</el-tag><el-tag style="margin-left:20px;" effect="dark" type="warning">{{baseInfo.constructionUnitSg}}</el-tag>        
        </el-col>
        
        </el-col>
      </el-row>
      <div class="updateInfo">
        <el-button
            type="primary"
            size="medium"
            @click="updateInfo"
           
          >修改</el-button>
      </div>
    </div>

    <!-- 修改基本信息的Form -->
    <el-dialog title="修改项目基本信息" :visible.sync="showUpdateInfo" width="65%" >
      <el-form :model="baseInfo" ref="baseInfo" :inline="true" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="工程造价" prop="proCost">
              <el-input v-model="baseInfo.proCost" placeholder="请输入工程造价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑规模" prop="proArea">
              <el-input v-model="baseInfo.proArea" placeholder="请输入建筑规模" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
          <el-form-item label="合同开始时间" prop="starttime">
            <el-date-picker v-model="baseInfo.starttime" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同截止时间" prop="endtime">
              <el-date-picker v-model="baseInfo.endtime" type="date" placeholder="选择截止日期" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
          <el-form-item label="工程类别" prop="protier">
              <el-select v-model="baseInfo.protier" placeholder="请选择工程类别" clearable>
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备案编号" prop="proCode">
              <el-input v-model="baseInfo.proCode" placeholder="请输入建筑规模" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="建设单位" prop="constructionUnitJs">
              <el-input v-model="baseInfo.constructionUnitJs" placeholder="请输入工程造价" style="width:300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监理单位" prop="constructionControlUnit">
              <el-input v-model="baseInfo.constructionControlUnit" placeholder="请输入工程造价" style="width:300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="施工单位" prop="constructionUnitSg">
              <el-input v-model="baseInfo.constructionUnitSg" placeholder="请输入工程造价" style="width:300px;"/>
            </el-form-item>
          </el-col>
          
        </el-row>
        <div style="margin-left: 45%;">
          <el-button type="primary"  @click="showUpdateInfo = false">返回</el-button>
           <el-button type="primary"  @click="submitBaseInfo">提交</el-button>
        </div> 
        
      </el-form>
    </el-dialog>  


    <!-- 查询 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="项目名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="项目状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="width:500px;">
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="warning" icon="el-icon-s-promotion" size="mini" @click="initSubmit">初始化</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      >
      <div>
        <el-input class="input-init" size="small" placeholder="请输入项目名称" v-model="proName"></el-input>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="getInitData">搜索</el-button>
        <el-table
          :data="tableData"
          border
          style="width: 100%;margin-top: 10px">
          <el-table-column
            prop="pro_name"
            label="工程"
            width="180"
          align="center">
          </el-table-column>
          <el-table-column
            prop="address_all"
            label="位置"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="check_time"
            label="时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="success" size="mini">初始化</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" v-show="showSearch"></right-toolbar>
    </el-row>
<div>
    <el-table
      v-loading="loading"
      :data="deptList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)"
      row-key="deptId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" label="项目名称" width="260"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />-->
</div>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild, queryInitData, setInitData, getBaseInfo, updateBaseInfo, getTime } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Cookies from "js-cookie";
import axios from 'axios'
import {decrypt} from "@/utils/jsencrypt";

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      typeList: [
        {
          value: 1,
          label: '省重点项目'
        },
        {
          value: 2,
          label: '市重点项目'
        },
        {
          value: 3,
          label: '一般项目'
        },
        {
          value: 4,
          label: '国家重点项目'
        }
      ],
      showUpdateInfo: false,
      hetongTime: '',
      baseInfo: {
        proCost: '',
        proArea: '',
        protier: '',
        proCode: '',
        constructionUnitJs: '',
        constructionControlUnit: '',
        constructionUnitSg: '',
        starttime: '',
        endtime: '',

      },
      // 初始化输入
      proName: '',
      username:'',
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: false,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      total: '0',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 初始化弹出层
      dialogVisible: false,
      // 初始化表格数据
      tableData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCookie();
    this.getList();
    this.getBaseInfo();

    // this.getTime();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },

  methods: {
    getCookie() {
      this.username = Cookies.get("username");
      if(this.username =='admin-1'){
        this.showSearch = true;
      }
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        console.log('ceshi',response)
        this.total = response.data.length;
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    // 初始化弹出层
    initSubmit() {
      this.getInitData()
    },
    // 查询初始化数据
    getInitData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var data = {
        proName: this.proName
      }
      queryInitData(data).then((res) => {
        this.tableData = res.data
        loading.close()
        this.dialogVisible = true
        console.log(res.data)
      })
    },
    // 初始化设置
    handleClick(row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var data = {
        proid: row.guid,
        proName: row.pro_name
      }
      setInitData(data).then((res) => {
        console.log(res.code)
        if (res.code === 200) {
          this.$message.success('初始化成功！')
          loading.close()
          this.dialogVisible = false
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加部门";
      listDept().then(response => {
	        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门";
      });
      listDeptExcludeChild(row.deptId).then(response => {
	        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDept(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDept(row.deptId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },


    getBaseInfo() {
      //console.log("deptId", localStorage.getItem("deptId"))
      var deptId = localStorage.getItem("deptId")
      if(deptId !== '100') {
        this.getTime()
      }
      getBaseInfo(deptId).then(res => {
        console.log("list", res)
        this.baseInfo.proCost = res.proCost
        this.baseInfo.proArea = res.proArea
        this.baseInfo.protier = res.protier
        this.baseInfo.proCode = res.proCode
        this.baseInfo.constructionUnitJs = res.constructionUnitJs
        this.baseInfo.constructionControlUnit = res.constructionControlUnit
        this.baseInfo.constructionUnitSg = res.constructionUnitSg
        this.baseInfo.starttime = res.starttime
        this.baseInfo.endtime = res.endtime
      })
    },
    gongchengLeibie(num) {
      if(num === 1) {
        return '省重点项目'
      } else if(num === 2) {
        return '市重点项目'
      } else if(num === 3) {
        return '一般项目'
      } else {
        return '国家重点项目'
      }
    },
    updateInfo() {
      this.showUpdateInfo = true
    },
    submitBaseInfo() {
      // console.log("deptId111", localStorage.getItem("deptId"))
      var deptId = localStorage.getItem("deptId")
      // console.log("baseInfo", this.baseInfo)
      updateBaseInfo(deptId, this.baseInfo).then(res => {
        console.log("Ceshishis,", res)
        if(res.code === 200) {
          this.$message({
            message: "修改成功",
            type: 'success'
          });
          this.showUpdateInfo = false
        } else {
          this.$message({
            message: res.msg,
            type: 'danger'
          });
        }
        
      })
    },
    getTime() {
      var deptId = localStorage.getItem("deptId")
      getTime(deptId).then(res => {
        console.log("time", res)
        var str = res.msg
        this.hetongTime = str.slice(0, 3)
      })
    }
  }
};
</script>
<style>
  .input-init {
    width: 250px;
    margin-right: 10px;
  }
  .baseInfo {
    margin-bottom: 10px;
    font-size: 18px;
  }
  .updateInfo {
   display: flex;
   justify-content: center;
   align-items: center;
    margin-top: 5px;
  }
</style>
