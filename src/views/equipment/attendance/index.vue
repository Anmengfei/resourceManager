<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <!--<div class="head-container">-->
          <!--<el-input v-model="deptName" placeholder="请设备名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />-->
        <!--</div>-->
        <div class="head-container header_tree">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--      <el-col :span="4" :xs="24">-->
      <!--        <div class="head-container">-->
      <!--          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />-->
      <!--        </div>-->
      <!--        <div class="head-container">-->
      <!--          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />-->
      <!--        </div>-->
      <!--      </el-col>-->
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <div v-show="showSearch" style="padding: 10px">
          <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">设备名称</span><el-input v-model="queryParams.devName" placeholder="请输入设备名称" clearable size="small" style="width: 200px;margin-right: 10px" />
          <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">设备型号</span><el-input v-model="queryParams.devModel" placeholder="请输入设备型号" clearable size="small" style="width: 200px;margin-right: 10px"  />
          <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">状态</span>
          <el-select v-model="queryParams.status" placeholder="设备状态" clearable size="small" style="width: 200px;margin-right: 10px">
            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </div>
        <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->
          <!--<el-form-item label="设备名称" prop="devName">-->
            <!--<el-input v-model="queryParams.devName" placeholder="请输入设备名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="设备型号" prop="phonenumber">-->
            <!--<el-input v-model="queryParams.devModel" placeholder="请输入设备编号" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="状态" prop="status">-->
            <!--<el-select v-model="queryParams.status" placeholder="设备状态" clearable size="small" style="width: 240px">-->
              <!--<el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="进厂时间" prop="entryTime">-->
            <!--<el-date-picker v-model="queryParams.entryTime" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="datetime"  placeholder="请选择日期"></el-date-picker>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
            <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
          </el-col>
          <!--<el-col :span="1.5">-->
            <!--<el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">修改</el-button>-->
          <!--</el-col>-->
          <!--<el-col :span="1.5">-->
            <!--<el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>-->
          <!--</el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <!--<el-table-column label="工地ID" align="center" prop="constructionSiteId" />-->
          <!--<el-table-column label="工地名称" align="center" prop="constructionSiteName" />-->
          <el-table-column label="产权单位" align="center" prop="devFactory"  />
          <el-table-column label="设备类型" align="center" prop="devType" />
          <el-table-column label="设备型号" align="center" prop="devModel" />
          <el-table-column label="设备名称" align="center" prop="devName" />
<!--          <el-table-column label="维修周期" align="center" prop="repairCycle"  />-->
          <el-table-column label="负责人" align="center" prop="personInCharge"  />
          <el-table-column label="联系方式" align="center" prop="phone"  />
          <el-table-column label="传输状态" align="center" prop="status" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
              <el-tag  v-if="scope.row.status===1" type="success">启用</el-tag>
              <el-tag  v-if="scope.row.status===0" type="danger">未启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="进厂时间" align="center" prop="entryTime"  />
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']">修改</el-button>
              <el-button v-if="scope.row.id !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">删除</el-button>
              <!--<el-button size="mini" type="text" icon="el-icon-goods" @click="handleDetail(scope.row)" v-hasPermi="['system:user:detail']">详情</el-button>-->
              <!--<el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']">重置</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body class="addForm">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="产权单位" prop="devFactory">
              <el-input v-model="form.devFactory" placeholder="产权单位"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称"  prop="devName">
              <el-input v-model="form.devName" placeholder="设备名称"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="devModel">
              <el-input v-model="form.devModel" placeholder="设备型号"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工地名称" prop="constructionSiteId">
              <el-select v-model="form.constructionSiteId" placeholder="工地名称" @change="selectName" style="width: 240px">
                <el-option
                  v-for="item in options2"
                  :key="item.deptId"
                  :label="item.name"
                  :value="item.deptId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="personInCharge">
              <el-input v-model="form.personInCharge" placeholder="请输入负责人名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="devType">
              <el-select v-model="form.devType" placeholder="设备类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="进厂时间" prop="entryTime">
              <el-date-picker
                v-model="form.entryTime"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd:hh:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">-->
          <!--<el-form-item label="归属部门" prop="deptId">-->
          <!--<treeselect v-model="form.deptId" :options="deptOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择归属部门" />-->
          <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="传输状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">未启用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="资质证明" >-->
<!--              &lt;!&ndash;              <el-input v-model="form.equipmentID" placeholder="设备编号" maxlength="11" />&ndash;&gt;-->
<!--              <el-upload-->
<!--                class="upload-demo"-->
<!--                multiple-->
<!--                :limit="3"-->
<!--                :file-list="fileList"-->
<!--              >-->
<!--                <el-button size="small" type="primary">点击上传</el-button>-->
<!--              </el-upload>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

        </el-row>
        <!--<el-row>-->
        <!--<el-col :span="12">-->
        <!--<el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">-->
        <!--<el-input v-model="form.userName" placeholder="请输入用户名称" />-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">-->
        <!--<el-input v-model="form.password" placeholder="请输入用户密码" type="password" />-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row>-->
        <!--<el-col :span="12">-->
        <!--<el-form-item label="用户性别">-->
        <!--<el-select v-model="form.sex" placeholder="请选择">-->
        <!--<el-option v-for="dict in sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<el-form-item label="状态">-->
        <!--<el-radio-group v-model="form.status">-->
        <!--<el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row>-->
        <!--<el-col :span="12">-->
        <!--<el-form-item label="岗位">-->
        <!--<el-select v-model="form.postIds" multiple placeholder="请选择">-->
        <!--<el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId" :disabled="item.status == 1"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<el-form-item label="角色">-->
        <!--<el-select v-model="form.roleIds" multiple placeholder="请选择">-->
        <!--<el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.status == 1"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row>-->
        <!--<el-col :span="24">-->
        <!--<el-form-item label="备注">-->
        <!--<el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="submitForm">确 定</el-button>-->
        <!--<el-button @click="cancel">取 消</el-button>-->
      <!--</div>-->
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
  import { listDev, getDev, delDev, addDev, updateDev, exportDev, getDeparament } from "@/api/system/otherdev";
import { getToken } from "@/utils/auth";
import { getLeftColumn } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from 'vuex'

export default {
  name: "attendance",
  components: { Treeselect },
  computed: {
    ...mapState({
      username: state => state.user.name
    }),
  },
  data() {
    return {
      fileList:[],
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      options: [{
        value: '虹膜识别设备',
        label: '虹膜识别设备'
      }, {
        value: '人脸设备',
        label: '人脸设备'
      }, {
        value: '刷卡设备',
        label: '刷卡设备'
      }],
      options2: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      selection: [],
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
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: [],
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {
          dictValue: 0,
          dictLabel: '未启用'
        },
        {
          dictValue: 1,
          dictLabel: '启用'
        }
      ],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        constructionSiteId: undefined,
        // constructionSiteName:'石家庄宝能中心项目二标段',
        devFactory:'',
        devModel: '',
        devName: '',
        devType: '',
        entryTime: '',
        imgUrl: '',
        personInCharge: '',
        phone: '',
        status: 0,
        type: '',
      },
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
        constructionSiteId: undefined,
        // constructionSiteName:'石家庄宝能中心项目二标段',
        devFactory:'',
        devModel: '',
        devName: '',
        devType: '',
        entyrTime: '',
        imgUrl: '',
        personInCharge: '',
        phone: '',
        status: '',
        type: '',
      },
      // 表单校验
      rules: {
        devFactory: [
          { required: true, message: "产权单位不能为空", trigger: "blur" },
        ],
        devName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        devModel: [
          { required: true, message: "设备型号不能为空", trigger: "blur" },
        ],
        constructionSiteId: [
          { required: true, message: "请选择工地名称", trigger: "change" },
        ],
        personInCharge: [
          { required: true, message: "负责人不能为空", trigger: "blur" },
        ],
        entryTime: [
          { required: true, message: "进厂时间不能为空", trigger: "blur" },
        ],

        phone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
        ],
        devType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],

        status: [
          { required: true, message: "请选择传输状态", trigger: "change" },
        ],
        // email: [
        //   { required: true, message: "邮箱地址不能为空", trigger: "blur" },
        //   {
        //     type: "email",
        //     message: "'请输入正确的邮箱地址",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // tel: [
        //   { required: true, message: "手机号码不能为空", trigger: "blur" },
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur",
        //   },
        // ],
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
    // this.getDicts("sys_normal_disable").then((response) => {
    //   this.statusOptions = response.data;
    // });
    // this.getDicts("sys_user_sex").then((response) => {
    //   this.sexOptions = response.data;
    // });
    // this.getConfigKey("sys.user.initPassword").then((response) => {
    //   this.initPassword = response.msg;
    // });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      var deptId = localStorage.getItem("deptId")
      console.log("deptId", deptId)
      var params = {
        constructionSiteId: deptId,
        type: '考勤设备'
      }
      this.loading = true;
      listDev(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

      // this.loading = true;
      // listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
      //   (response) => {
      //     this.userList = response.rows;
      //     this.total = response.total;
      //     this.loading = false;
      //   }
      // );
    },
    selectName(val,e) {
      console.log(val,e)
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      // console.log(this.username)
      var data = {
        username: this.username,
        status: 2
      }
      getLeftColumn(data).then((response) => {
        this.deptOptions.push(response.data)
      });
    },
    // getTreeselect() {
    //   // this.deptOptions = [{"id":100,"label":"设备总览","children":[{"id":205,"label":"塔吊"},{"id":101,"label":"起重机"},{"id":102,"label":"升降机"}]}]
    //   treeselect().then((response) => {
    //     this.deptOptions = response.data;
    //   });
    //
    // },
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
      if(data.flag === 1) {

        var params = {
          constructionSiteId: data.deptId,
          devType: data.name,
          type: '考勤设备'

        }

      } else {
        var params = {
          constructionSiteId: data.deptId,

          type: '考勤设备'

        }
      }


      this.loading = true;
      listDev(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
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
        constructionSiteId:undefined,
        constructionSiteName:undefined,
        devFactory:undefined,
        devModel: undefined,
        devName: undefined,
        devType: undefined,
        entyrTime: undefined,
        imgUrl: undefined,
        personInCharge: undefined,
        phone: undefined,
        status: undefined,
        type: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.queryParams.constructionSiteId = localStorage.getItem("deptId")
      this.queryParams.type = "考勤设备"
      // console.log(this.queryParams.devName)
      this.loading = true;
      listDev(this.queryParams).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.devName = '';
      this.queryParams.devModel = ''
      this.queryParams.status = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.constructionSiteId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // this.getTreeselect();
      this.open = true;
      this.title = "添加设备";
      this.getDeparamentList()
      // getUser().then((response) => {
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.open = true;
      //   this.title = "添加设备";
      //   this.form.password = this.initPassword;
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = row
      this.open = true;
      this.title = "修改设备";
      this.getDeparamentList()
      // this.reset();
      // this.getTreeselect();
      // const userId = row.userId || this.ids;
      // getUser(userId).then((response) => {
      //   this.form = response.data;
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.form.postIds = response.postIds;
      //   this.form.roleIds = response.roleIds;
      //   this.open = true;
      //   this.title = "修改设备";
      //   this.form.password = "";
      // });
      console.log(row)
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：" + value);
            }
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.type = '考勤设备'
          if (this.form.id != undefined) {
            updateDev(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDev(this.form).then((response) => {
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
      const userIds = row.id ;
      this.$confirm(
        '是否确认删除设备编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delDev(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.queryParams.constructionSiteId = localStorage.getItem("deptId")
      this.queryParams.type = "考勤设备"
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportDev(queryParams);
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
    getDeparamentList() {
     
      var params = {
        username: this.username
      }
      getDeparament(params).then(response => {
        if(response.code === 200) {
          this.options2 = response.data.childs
          console.log(this.options2)
        }
      })
    }
  },
};
</script>
<style lang="css" scoped>
.header_tree {
  overflow:auto;
  max-height: 600px;
}
.header_tree .el-tree {
  min-width: 100%;
  display: inline-block;
}
.addForm >>> .el-form-item--medium .el-form-item_content {
  width:60%;
}
</style>
