<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="20%" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '2']" :default-active="$route.path" router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>用户管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/userlist_admin">用户授权</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>文章管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/articlelist_admin">文章列表</el-menu-item>
            <el-menu-item index="/addArticle">文章添加</el-menu-item>
            <el-menu-item index="/addModule">模块添加</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown trigger="click" @command="handleCommand">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="goHome">返回首页</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{uname}}</span>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  data() {
    
    return {
      uname:""
    };
  },

 mounted: function() {
    this.init();
  },
  methods:{
    init(){
      this.uname = sessionStorage.getItem("uname");
    },
    handleCommand(command) {
      if (command == "goHome") {
        this.$router.push("/");
        return;
      }
      
    }
  }
  
};
</script>


<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

