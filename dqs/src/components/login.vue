<template>
  <div class="loginbg">
    <header>
      <el-row>
        <el-col :span="3" offset="21"><span style="cursor:pointer" @click="goHome">返回首页</span></el-col>
      </el-row>
    </header>
    <div class="login">
      <div>
        <el-input placeholder="请输入用户名" v-model="uname" clearable class="input_style">{{uname}}</el-input>
        <br />
        <span v-if="error.name" class="err-msg">{{error.name}}</span>
      </div>
      <div>
        <el-input
          placeholder="请输入密码"
          v-model="password"
          show-password
          class="input_style"
        >{{password}}</el-input>
        <br />
        <span v-if="error.pwd" class="err-msg">{{error.pwd}}</span>
      </div>
      <div>
        <el-button type="primary" @click="login" class="login_style">登录</el-button>
        <br>
        <span @click="doregister" style="font-size:20px;color:red;cursor:pointer">未注册？点击注册</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",

  data() {
    return {
      uname: "",
      password: "",
      error: {
        name: "",
        pwd: ""
      },
      params: {
        uname: "",
        upassword: ""
      }
    };
  },
  methods: {
    goHome(){
      sessionStorage.setItem("uname",'');
      this.$router.push("/");
    },
    login() {
      this.params.uname = this.uname;
      this.params.upassword = this.password;
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/login",
        data: JSON.stringify(this.params),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(
          function(response) {
            console.log(response);
            if (response.status == "200") {
              var retcode = response.data.retCode;
              var msg = response.data.retMsg;
              if(retcode != "0000"){
                this.open(msg);
              }else{
                sessionStorage.setItem('role',response.data.retData[0].role);
                sessionStorage.setItem('isAdmin',response.data.retData[0].isAdmin);
                sessionStorage.setItem('uname',response.data.retData[0].uname);
                this.$router.push('/');
              }
              
            }else{
              this.open("服务异常!");
            }
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
    },

    doregister(){
      this.$router.push('/register');
    },

    open(tips) {
        this.$alert(tips, '提示：', {
          confirmButtonText: '确定',
          callback: action => {
            
          }
        });
      }

    
  }
};
</script>


<style scoped>
.loginbg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -10;
  background-image: url(../assets/img/loginbg.jpg);
}
.login {
  margin-top: 200px;
}
.input_style {
  width: 300px;
  margin-bottom: 20px;
}
.login_style {
  width: 300px;
}
</style>
