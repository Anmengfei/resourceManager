<template>
  <div id="courseForm" class="courseForm">
    <el-form :model="courseForm" label-width="150px" :rules="courseRules" ref="courseForm" class="marginCenter">
      <el-form-item label="课件名称" prop="prename" >
        <el-input v-model="courseForm.prename" style="width: 200px;" placeholder="请输入课件名称"></el-input>
      </el-form-item>
      <el-form-item label="课件类别" prop="category">
        <el-select v-model="courseForm.category" placeholder="请选择课件类别" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict"
            :label="dict"
            :value="dict"
          />
        </el-select>
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
    </el-form>
    <el-button class="update-button-style" id='pickfiles'>上传课件</el-button>
    <div class="progress">{{progress}}</div>
  </div>
</template>


  <script>
    require("../../assets/js/qiniu.min")
    import { updateMedia } from "@/api/media/media";
    import { category_findlist } from "@/api/course/course";
    
    export default {
      name: 'app',
      data () {
        return {
          props: {
            value: 'id',
            label:'name',
            children:'children'
          },
          categoryList: [],
          categoryActive:[],
          courseForm: {
            
            prename: '',
            category: '',
           
            mt:'',
            st:''
            
          },
          courseRules: {
            prename: [
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

          },
          typeOptions: ["图片", "视频", "文档"],
          progress: '',
          qiniuToken: '',
          mediaFile: {
            mediaId:'',
            name:'',
            prename:'',
            url:'',
            type: '',
            size: '',
            status: '',
            tag: '',
            category: '',
            mt: '',
            st: ''
          },
        }
      },
      mounted () {
       // console.log("七牛",Qiniu)
        this.initQiniu()
        this.getCategoryList()
      },
      methods: {
        getCategoryList() {
          category_findlist().then(res=>{
            this.categoryList = res.children;
            console.log(this.categoryList)

          })
        },
        reset() {
          this.courseForm.prename = undefined
          this.courseForm.category = undefined
          this.courseForm.mt = undefined
          this.courseForm.st = undefined
          this.categoryActive = []
          this.progress = ''
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
                if(this.courseForm.prename === undefined || this.courseForm.category === undefined) {
                 console.log('上传中 file',file);
                } else {
                   this.progress = file.percent + '%';
                }
               
              },
              'FileUploaded': (up, file, info) => {
                 if(this.courseForm.prename === undefined || this.courseForm.category === undefined) {
                  this.$message.error('请填写课件的基本信息，再进行上传！');
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
                this.mediaFile.prename=this.courseForm.prename
                this.mediaFile.category = this.courseForm.category
                this.mediaFile.mt = this.categoryActive[0]
                this.mediaFile.st = this.categoryActive[1]
                this.mediaFile.size=file.size
                this.mediaFile.type=file.type
                this.mediaFile.url=sourceLink
                this.mediaFile.name=res.key
                this.mediaFile.username = localStorage.getItem('userId')
                updateMedia(res.key,this.mediaFile).then((res) => {
                  if(res.success){
                    this.$message.success('文件保存成功');
                    this.reset()
                  }else{
                    this.$message.error('文件保存失败');
                  }
                });
                console.log('文件上传完毕')
                console.log(sourceLink)
              },
              Error: (up, err, errTip) => {
                console.log('上传失败', err);
              },
              Key: (up, file) => {}
            }
          });
        }
      }
    }
  </script>

  <style>
    /* #pickfiles {
      padding: 10px;
      background: #000;
      border-radius: 5px;
      color: #fff;
    } */
    .courseForm {
      
      margin-top: 30px;
      margin-left: 20%;
    }
    .link {
      color: red;
    }
    .progress {
      color: red;
      font-size: 30px;
      margin-top: 20px;
    }
    .update-button-style {
    
    background-color: #f3b143;
    height: 50px;
    font-size: 18px;
    color: white;
    border-radius: 10px;
    font-weight: bold;
    letter-spacing: 3px;
    margin-top: 10px;
    margin-left: 12%;
  }
  </style>

