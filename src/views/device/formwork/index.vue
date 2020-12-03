<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <!--<div class="head-container">-->
          <!--<el-input v-model="deptName" placeholder="请输入设备名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />-->
        <!--</div>-->
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->

      <el-col :span="20" :xs="24">
        <div v-show="showSearch" style="margin-bottom: 20px">
          <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">产权单位</span><el-input v-model="queryParams.devFactory" placeholder="请输入产权单位名称" clearable size="small" style="width: 200px;margin-right: 10px"/>
          <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">设备类型</span>
          <el-select v-model="queryParams.devType" placeholder="请选择设备类型" clearable size="small" style="width: 200px;margin-right: 10px">
            <el-option v-for="dict in deviceStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictLabel" />
          </el-select>
          <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">设备型号</span>
          <el-input v-model="queryParams.devModel" placeholder="请输入设备型号" clearable size="small" style="width: 200px;margin-right: 10px"/>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </div>
        <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" style="margin-left: 20px;">-->
          <!--<el-form-item label="设备厂商" prop="devFactory">-->
            <!--<el-input v-model="queryParams.devFactory" placeholder="请输入设备厂商名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="设备类型" prop="deviceName">-->
            <!--<el-select v-model="queryParams.devType" placeholder="请选择设备类型" clearable size="small" style="width: 240px">-->
              <!--<el-option v-for="dict in deviceStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictLabel" />-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="设备型号" prop="devModel">-->
            <!--<el-input v-model="queryParams.devModel" placeholder="请输入设备型号" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />-->
            <!--<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery" style="margin-left: 10px;">搜索</el-button>-->
            <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
          <!--</el-form-item>-->

          <!--&lt;!&ndash; <el-form-item label="创建时间">-->
            <!--<el-date-picker v-model="queryParams.createTime" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="date"  placeholder="创建时间" ></el-date-picker>-->
          <!--</el-form-item> &ndash;&gt;-->
          <!--&lt;!&ndash; <el-form-item>-->
            <!--<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
            <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
          <!--</el-form-item> &ndash;&gt;-->
        <!--</el-form>-->

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
          </el-col> -->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
          <el-select v-model="queryParams.model" placeholder="请选择数据对接模板类型" clearable size="small" style="width: 240px">
            <el-option v-for="dict in deviceStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictLabel" />
          </el-select>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button type="primary"  icon="el-icon-download" size="mini" @click="handledown" v-hasPermi="['system:user:down']"  plain >下载数据对接模板</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading"  :data="dataList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)" @selection-change="handleSelectionChange">

          <el-table-column label="设备编号" align="center" prop="id" />
          <el-table-column label="产权单位" align="center" prop="devFactory" :show-overflow-tooltip="true" />
          <el-table-column label="设备类型" align="center" prop="devType" :show-overflow-tooltip="true" />
          <el-table-column label="设备型号" align="center" prop="devModel" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="手机号码" align="center" prop="phonenumber" width="120" /> -->
          <el-table-column label="启用" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']">修改</el-button>
              <el-button  size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">删除</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']">重置</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-row>

            <el-col :span="12">
                <el-form-item  label="产权单位" prop="makefactory">
                    <el-input v-model="form.devFactory" placeholder="请输入产权单位名称" style="width:250px;"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="设备类型">
                    <el-select v-model="form.devType" placeholder="请选择设备类型" style="width:250px;">
                        <el-option v-for="dict in deviceStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictLabel" ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="devModel">
              <el-input v-model="form.devModel" placeholder="请输入设备型号" style="width:250px;"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row >
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


import { listDevice, getDevice, delDevice, addDevice, updateDevice, exportDevice } from "@/api/system/device";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import { getLeftColumn } from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from 'vuex'
import { unionTypeAnnotation } from '@babel/types';

export default {
  name: "Formwork",
  components: { Treeselect },
  computed: {
  ...mapState({
    username: state => state.user.name
  }),
},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      dataList: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: [],
      // 设备树选项
      deviceOptions: [{
        id: 100,
        label: "企业总览",
        children: [{
          id: 200,
          label: "河北创巨圆科技发展有限公司",
          children: [{
            id: 101,
            label: "特种设备",
            children: [{
              id: 102,
              label: "起重机"
            }, {
              id: 103,
              label: "塔吊"
            }, {
              id: 104,
              label: "升降机"
            }, {
              id: 105,
              label: "物料提升机"
            }]
          }, {
            id: 201,
            label: "视频设备",
            children: [{
              id: 202,
              label: "摄像头"
            }, {
              id: 203,
              label: "人脸识别设备"
            }]
          }, {
            id: 301,
            label: "环境检测设备",
            children: [{
              id: 302,
              label: "水质检测设备"
            }, {
              id: 303,
              label: "大气采样设备"
            }]
          }]
        }]
      }],
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
      deviceModelOptions:[{
        dictValue: 0,
        dictLabel: '起重机'
      },{
        dictValue: 1,
        dictLabel: '塔吊'
      },{
        dictValue: 2,
        dictLabel: '升降机'
      },{
        dictValue: 3,
        dictLabel: '物料提升机'
      },{
        dictValue: 4,
        dictLabel: '摄像头'
      },{
        dictValue: 5,
        dictLabel: '人脸识别设备'
      },{
        dictValue: 6,
        dictLabel: '水质检测设备'
      },{
        dictValue: 7,
        dictLabel: '大气采样设备'
      }],
      deviceStatusOptions:[
          {
            dictValue: 0,
            dictLabel: '塔式起重机'
          },{
              dictValue: 1,
              dictLabel: '物料提升机'
          },{
              dictValue: 2,
              dictLabel: '施工升降机'
          },{
              dictValue: 3,
              dictLabel: '虹膜识别设备'
          },{
              dictValue: 4,
              dictLabel: '人脸识别设备'
          },{
              dictValue: 5,
              dictLabel: '刷卡设备'
          },{
              dictValue: 6,
              dictLabel: '噪音检测设备'
          },{
              dictValue: 7,
              dictLabel: '大气采样设备'
          }
      ],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "childs",
        label: "name",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        devFactory: '',
        devType: '',
        devModel: '',
        // userName: undefined,
        // phonenumber: undefined,
        // status: undefined,
        // model:undefined,
        // deptId: undefined,
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "归属部门不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** 查询支持设备列表 */
    getList() {
      var deptId = localStorage.getItem("deptId")
      console.log("deptId", deptId)
      var params = {
        deptId: deptId
      }
      this.loading = true;
      listDevice(params).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
  // console.log(this.username)
      var data = {
        username: this.username,
        status: 4
      }
      getLeftColumn(data).then((response) => {
        this.deptOptions.push(response.data)
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, node, e) {
      console.log("data",data)
      console.log(node)
      console.log(e)
      // var params = {
      //   devType: data.name,
      // }
      if(data.flag === null) {
        var params = {
          constructionSiteId: data.deptId,
        }
      } else if(data.flag === 1){
        var params = {
          constructionSiteId: data.deptId,
          devType: data.name

        }
      } else {
        var params = {
          constructionSiteId: data.deptId,
          type: data.name

        }
      }
      this.loading = true;
      listDevice(params).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '' + '"该设备吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          console.log("123")
          var tmp = ''
          if(row.status === '0') {
            tmp = '1'
          } else {
            tmp = '0'
          }
          var form = {
            id: row.id,
            status: tmp
          }

          updateDevice(form);
        })
        .catch(function () {
          console.log("456")
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
        id: undefined,
        devFactory: undefined,
        devType: undefined,
        devModel: undefined,
        content: undefined,
        status: undefined

      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {

      this.queryParams.page = 1;
      this.loading = true;
      listDevice(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.dateRange = [];
      // this.resetForm("queryForm");
      this.queryParams.devFactory = ''
      this.queryParams.devType = ''
      this.queryParams.devModel = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
        this.open = true;
        this.title = "新增设备";
        console.log(this.form)

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
        console.log(row)


      this.form.id = row.id
      this.form.devFactory = row.devFactory
      this.form.devType = row.devType
      this.form.devModel = row.devModel
      this.form.content = row.content


      this.open = true
    },
    /** 重置密码按钮操作 */

    /** 提交按钮 */
    submitForm: function () {

      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDevice(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.reset()
                this.getList();
              }
            });
          } else {
            addDevice(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.reset()
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id ;
      this.$confirm(
        '是否确认删除该数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
            // for(let i = 0; i < this.dataList.length; i++) {
            //     let obj = this.dataList[i]
            //     if(obj.userId === userIds) {
            //         this.dataList.splice(i, 1)
            //     }
            // }
          return delDevice(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {

          return exportDevice(queryParams);
        })
        .then((response) => {


          window.location.href = response.msg
        })
        .catch(function () {
          console.log("789")
        });
    },
    /**  下载按钮操作 */
    handledown() {
      console.log("Aaaaa")
      var queryParams = this.queryParams;
      console.log("aaa", queryParams)

      this.$confirm("是否下载数据对接模板?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportDevice(queryParams);
        })
        .then((response) => {
          window.location.href = response.msg
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
