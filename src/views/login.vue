<template>
  <div>
    <div style="text-align: center;width: 500px;height: 500px;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%)">
      <img src="../assets/logo/loading.gif" style="width: 100%">
    </div>
  </div>
  <!--<div class="login">-->
    <!--<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">-->
      <!--<h3 class="title">资源管理云平台</h3>-->
      <!--<el-form-item prop="username">-->
        <!--<el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">-->
          <!--<svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />-->
        <!--</el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item prop="password">-->
        <!--<el-input-->
          <!--v-model="loginForm.password"-->
          <!--type="password"-->
          <!--auto-complete="off"-->
          <!--placeholder="密码"-->
          <!--@keyup.enter.native="handleLogin"-->
        <!--&gt;-->
          <!--<svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />-->
        <!--</el-input>-->
      <!--</el-form-item>-->
      <!--&lt;!&ndash; <el-form-item prop="code">-->
        <!--<el-input-->
          <!--v-model="loginForm.code"-->
          <!--auto-complete="off"-->
          <!--placeholder="验证码"-->
          <!--style="width: 63%"-->
          <!--@keyup.enter.native="handleLogin"-->
        <!--&gt;-->
          <!--<svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />-->
        <!--</el-input>-->
        <!--<div class="login-code">-->
          <!--<img :src="codeUrl" @click="getCode" class="login-code-img"/>-->
        <!--</div>-->
      <!--</el-form-item>-->
      <!--<el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> &ndash;&gt;-->
      <!--<el-form-item style="width:100%;">-->
        <!--<el-button-->
          <!--:loading="loading"-->
          <!--size="medium"-->
          <!--type="primary"-->
          <!--style="width:100%;"-->
          <!--@click.native.prevent="handleLogin"-->
        <!--&gt;-->
          <!--<span v-if="!loading">登 录</span>-->
          <!--<span v-else>登 录 中...</span>-->
        <!--</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
    <!--&lt;!&ndash;  底部  &ndash;&gt;-->
    <!--<div class="el-login-footer">-->
      <!--<span>Copyright © 2018-2020 ruoyi.vip All Rights Reserved.</span>-->
    <!--</div>-->
  <!--</div>-->
</template>

<script>
import { getCodeImg, getTokenById } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { setToken, removeToken, getToken } from '@/utils/auth'
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "admin123"

      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],

      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        // this.redirect = route.query && route.query.redirect;
        // console.log("rediret", this.redirect)
        this.redirect = '/index'
      },
      immediate: true
    }
  },
  created() {
    //this.getCode();
    //this.getCookie();
    this.getTokens()
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        localStorage.setItem('deptId', response.data.deptId)
      });
    },
    getTokens() {
      console.log("传递过来的token是", getToken())
      removeToken()
      console.log("删除之后的token是", getToken())
      var str = unescape(window.location.search)
      console.log("urlddd", str)
      var userId = str.split('=')[2]
      // var userId = 1
      localStorage.setItem('userId', userId)
      this.getTokenByUserId(userId)
    },
    getTokenByUserId(id) {

      getTokenById(id).then((res) => {
        console.log("2212121212121", res)
        if(res.token === null) {
          window.location.href = 'http://www.qingcheng.net.cn/qingcheng/#/login'
        } else {
          console.log("")
          setToken(res.token)
          this.getUser()
          //this.$router.push({ path: this.redirect || "/" });
          this.$router.push({path: '/index'})
        }

      })
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
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              localStorage.setItem("password", this.loginForm.password)
              this.getUser()
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              //this.getCode();
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
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
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
