<template>
  <div id="app">
    <br/>
    <br/>
    <span id='pickfiles'>上传按钮</span>
    <div class="progress">{{progress}}</div>
  </div>
</template>


  <script>
    require('../../assets/js/qiniu.min')
    import { updateMedia } from "@/api/media/media";
    // import qiniu from 'qiniu-js';
    // import Qiniu from 'qiniu-js';
    // require('qiniu-js')
    // import * as Qiniu from "@/assets/js/qiniu.js";
    export default {
      name: 'app',
      data () {
        return {
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
            tag: ''
          },
        }
      },
      mounted () {
        this.initQiniu()
      },
      methods: {
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
            uptoken_url: '/cms/filesystem/getToken',
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
              BeforeUpload: (up, file) => {
                console.log('上传之前', file);
              },
              UploadProgress: (up, file) => {
                console.log('上传中 file',file);
                this.progress = file.percent + '%';
              },
              FileUploaded: (up, file, info) => {
                var domain = up.getOption('domain');
                var res = eval('(' + info + ')');
                var sourceLink = domain + res.key;//获取上传文件的链接地址
                this.mediaFile.prename=file.name
                this.mediaFile.size=file.size
                this.mediaFile.type=file.type
                this.mediaFile.url=sourceLink
                this.mediaFile.name=res.key
                this.mediaFile.username = localStorage.getItem('username')
                updateMedia(res.key,this.mediaFile).then((res) => {
                  if(res.success){
                    this.$message.success('文件保存成功');
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
    #pickfiles {
      padding: 10px;
      background: #000;
      border-radius: 5px;
      color: #fff;
    }
    .link {
      color: red;
    }
    .progress {
      color: red;
      font-size: 30px;
      margin-top: 20px;
    }
  </style>

