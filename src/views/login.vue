<template>
  <div class="login">
<!--    <h3 class="title">中科瑞通后台</h3>-->
    <div class="login_title">
      <p>资源管理云平台</p>
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">
        用户登录
      </h3>
      <el-form-item prop="username" class="input_kuang">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" class="login-form-input">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 10%;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
<!--      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>-->
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { mapState } from 'vuex'

export default {
  name: "Login",
  computed: {
    ...mapState({
      siteId: state => state.user.siteId
    }),
  },
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
        console.log(this.redirect)
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
           Cookies.set("username", this.loginForm.username, { expires: 30 });
           
          if (this.loginForm.rememberMe) {
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then((res) => {
             
              // var url = 'http://121.36.106.18:38081/'
              // window.open(url,'_self')
              
              if (this.loginForm.username === 'admin-1') {
                this.$router.push('/index')
              } else {
                window.location.href = 'http://121.36.106.18:38081/?siteId='+this.siteId
              }
              

              // console.log('f')
              // console.log(this.siteId)
              // this.$router.push({ path: "/index" });
              // this.$router.push({ path: this.redirect || "/" });
            })
            .catch((e) => {
              
              this.loading = false;
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/image/login.png');
  /*background-image: url("../assets/image/login-background.jpg");*/
  background-size: cover;
}
.title {
  /*margin: 0px auto 30px auto;*/
  /*text-align: center;*/
  /*color: #707070;*/
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
}
.login_title {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
}
.login_title p {
  font-family: "Times New Roman", Times, serif;
  letter-spacing: 0.1em;
  font-size: 52px;
  font-weight: 700;
  background: linear-gradient(
      to bottom,
      rgb(236, 237, 243),
      rgb(174, 180, 207),
      rgb(157, 164, 197)
  );
  -webkit-background-clip: text;
  color: transparent;
}
.login-form {
  /*background-image: url('../assets/image/login.png');*/
  background-image: url('../assets/image/loginBack.png');
  position: absolute;
  left: 60%;
  top: 33%;
  width: 400px;
  background-size: 100% 100%;
  /*border-radius: 6px;*/
  /*background: #ffffff;*/
  /*padding: 25px 25px 5px 25px;*/
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
<style>
  .el-form-item--medium .el-form-item__content {
    width: 80%;
    margin-left: 10%;
  }
  /*.input_kuang .login-form-input .el-input__inner {*/
  /*   background: blue!important;*/
  /*}*/
</style>
