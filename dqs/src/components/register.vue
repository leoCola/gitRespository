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
      </div>
      <div>
        <el-input placeholder="请输入手机号" v-model="mobile" clearable class="input_style">{{mobile}}</el-input>
      </div>
      <div>
        <el-input
          type="password"
          placeholder="请输入密码,6-20个字母、数字、下划线"
          v-model="password"
          show-password
          class="input_style"
          auto-complete="new-password"
        >{{password}}</el-input>
        
      </div>
      <div>
        <el-input
          type="password"
          placeholder="请确认输入密码,6-20个字母、数字、下划线"
          v-model="password_2"
          show-password
          class="input_style"
          auto-complete="new-password"
        >{{password_2}}</el-input>
        
      </div>
      <div>
        <el-button type="primary" @click="register" class="login_style">注册</el-button>
        <br>
        <span @click="dologin" style="font-size:20px;color:red;cursor:pointer">已注册？点击登录</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",

  data() {
    return {
      uname: "",
      password: "",
      password_2:"",
      mobile:"",
      params: {
        uname: "",
        upassword: "",
        mobile:"",
        role:"0",
        isAdmin:"0"
      }
    };
  },
  methods: {
    goHome(){
      sessionStorage.setItem("uname",'');
      this.$router.push("/");
    },
    register() {
      let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
      let patrn=/^(\w){6,20}$/;

      if(!reg.test(this.mobile)){
        this.open("手机号不合法！");
        return;
      }
    
      if(this.password!=this.password_2){
          this.open("输入的密码不一致！");
          return;
      }

      if(!patrn.test(this.password)){
          this.open("输入的密码不合法！");
          return;
      }

      this.params.uname = this.uname;
      this.params.upassword = this.password;
      this.params.mobile = this.mobile;

      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/register",
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
                this.open("注册成功！");
                sessionStorage.setItem('uname',this.uname);
                this.$router.push('/login');
                
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

    dologin(){
      this.$router.push('/login');
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
