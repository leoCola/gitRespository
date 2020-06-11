<template>
  <el-container class="main">
    <div class="headmenu">
      <el-dropdown v-if="showName" class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided command="goAdmin" v-show="canGoAdmin">后台管理</el-dropdown-item>
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-else class="loginbtn" @click="login()">登录</el-button>
    </div>
    <el-header class="headbg" height="300px" style="line-height: 300px;">大青山抗日革命根据地</el-header>
    <el-container>
      <el-aside width="20%">
        <el-input
          placeholder="请输入搜素文章关键字"
          v-model="seachTitle"
          class="seachName"
          style="width:300px"
        >
          <el-button slot="append" icon="el-icon-search" style="width:50px" @click="seachBytitle"></el-button>
        </el-input>
        <div class="module" :key="module" v-for="module in moduleNames">
          <span class="moduleName" @click="seachModuleArt(module.moduleId)">
            <i class="el-icon-tickets"></i>
            {{module.moduleName}}
          </span>
        </div>
      </el-aside>
      <el-container>
        <el-main>
          <el-carousel :interval="3000" arrow="always" type="card" height="500px">
            <el-carousel-item v-for="item in images" :key="item">
              <img :src="item.url" alt height="500px" />
            </el-carousel-item>
          </el-carousel>
        </el-main>
        <el-footer>内蒙古呼和浩特市武川县大青山抗日革命根据地</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      showName: false,
      moduleNames: [],
      images: [
        {
          url: require("../assets/img/001.jpg")
        },
        {
          url: require("../assets/img/002.jpg")
        },
        {
          url: require("../assets/img/003.jpg")
        },
        {
          url: require("../assets/img/004.jpg")
        }
      ],
      tableData: [],
      params: {
        moduleId: ""
      },
      seachTitle: "",
      canGoAdmin:false
    };
  },
  mounted: function() {
    this.init();
  },

  methods: {
    open(tips) {
      this.$alert(tips, "提示：", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    init() {
      this.username = sessionStorage.getItem("uname");
      if (this.username !== null && this.username != "") {
        this.showName = true;
      }
      if(sessionStorage.getItem("isAdmin") == "1"||sessionStorage.getItem("isAdmin") == "2"){
        this.canGoAdmin = true;
      }
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/findAllModules",
        //data: JSON.stringify(this.params),
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
              if (retcode == "0000") {
                this.moduleNames = response.data.retData;
              }
            } else {
              this.open("服务异常!");
            }
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
    },
    seachBytitle() {
      if (this.seachTitle == "") {
        this.open("请输入查询关键字！");
        return;
      }
      sessionStorage.setItem("seachTitle", this.seachTitle);
      sessionStorage.setItem("seachType", "0");
      this.goNewBlank("/showArtcleList");
    },
    seachModuleArt(moduleId) {
      sessionStorage.setItem("moduleId", moduleId);
      sessionStorage.setItem("seachType", "1");
      this.goNewBlank("/showArtcleList");
    },

    goNewBlank(newpath) {
      let routeUrl = this.$router.resolve({
        path: newpath,
        query: { id: 96 }
      });
      window.open(routeUrl.href, "_blank");
    },

    login() {
      this.$router.push("/login");
    },

    handleCommand(command) {
      if (command == "loginout") {
        sessionStorage.setItem("uname", "");
        this.$router.push("/login");
        return;
      }
      if (command == "goAdmin") {
        this.$router.push("/admin");
        return;
      }
    }
  }
};
</script>

<style scoped>
.main {
  margin-top: -3%;
}
.headmenu {
  width:20%;
  margin-left: 80%;
}
.el-dropdown-link {
  font-size: 30px;
}
.headbg {
  font: bold;
  text-shadow: -1px -1px rgba(197, 223, 248, 0.8),
    -2px -2px rgba(197, 223, 248, 0.8), -3px -3px rgba(197, 223, 248, 0.8),
    -4px -4px rgba(197, 223, 248, 0.8), -5px -5px rgba(197, 223, 248, 0.8),
    -6px -6px rgba(197, 223, 248, 0.8);
  text-align: center;
  background-image: url(../assets/img/head.jpg);
  font-size: 80px;
}
.module {
  margin-top: 20px;
  background-color: red;
}
.moduleName {
  font-size: 40px;
  color: white;
  cursor: pointer;
}
.el-footer {
  background-color: red;
  color: white;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
}
.seachName {
  margin-top: 10px;
}
.el-main {
  height: 600px;
  border-radius: 40px;
  /*border: 1px solid gray;*/
  float: left;
}
</style>