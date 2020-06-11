<template>
  <div>
    <header>
      <!-- 用户名下拉菜单 -->
      <el-dropdown v-if="showName" class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided command="goAdmin">后台管理</el-dropdown-item>
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-else class="loginbtn" @click="login()">登录</el-button>
    </header>
    <div class="m_head">大青山抗日革命根据地</div>
    <div class="m_slide">
      <el-carousel :interval="3000" arrow="always" height="500px">
        <el-carousel-item v-for="item in images" :key="item">
          <img :src="item.url" alt height="500px" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="m_title">
      <el-row>
        <el-col :span="6">
          <div class="module">
            <i class="el-icon-tickets"></i> 英雄事迹
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="title">
          <template slot-scope="scope">
            <i class="el-icon-tickets"></i>
            <span class="stitle" @click="showArticle(scope.row.id)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fy"
        layout="prev, pager, next"
        @current-change="current_change"
        :total="total"
        :page-size="pagesize"
        background
      ></el-pagination>
    </div>
    <div class="m_title">
      <el-row>
        <el-col :span="6">
          <div class="module">
            <i class="el-icon-tickets"></i> 经典战役
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData.slice((currentPage1-1)*pagesize,currentPage1*pagesize)"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="title">
          <template slot-scope="scope">
            <i class="el-icon-tickets"></i>
            <span class="stitle">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fy"
        layout="prev, pager, next"
        @current-change="current_change1"
        :total="total"
        :page-size="pagesize"
        background
      ></el-pagination>
    </div>
    <div class="m_title">
      <el-row>
        <el-col :span="6">
          <div class="module">
            <i class="el-icon-tickets"></i> 勿忘国耻
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData.slice((currentPage2-1)*pagesize,currentPage2*pagesize)"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="title">
          <template slot-scope="scope">
            <i class="el-icon-tickets"></i>
            <span class="stitle">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fy"
        layout="prev, pager, next"
        @current-change="current_change2"
        :total="total"
        :page-size="pagesize"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      showName: false,
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
      total: 100, //默认数据总数
      pagesize: 5, //每页的数据条数
      currentPage: 1, //默认开始页面
      currentPage1: 1,
      currentPage2: 1,
      tableData: [],
      loading: true,
      params:{
        id:""
      }
    };
  },
  mounted: function() {
    this.init();
  },

  methods: {
    init() {
      this.username = localStorage.getItem("uname");
      //this.username ='123';
      if (this.username !== null && this.username != "") {
        this.showName = true;
      }
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/quryAllArt",
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
              if (retcode != "0000") {
                this.open(msg);
              } else {
                this.tableData = response.data.retData;
                this.total = this.tableData.length;
                this.loading = false;
                //console.log(response.data.retData.length);
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
    current_change: function(currentPage) {
      this.currentPage = currentPage;
    },
    current_change1: function(currentPage1) {
      this.currentPage1 = currentPage1;
    },
    current_change2: function(currentPage2) {
      this.currentPage2 = currentPage2;
    },
    login() {
      this.$router.push("/login");
    },
    showArticle: function(id) {
      console.log("文章id==" + id);
      this.params.id = id;
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/findArtByid",
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
              if (retcode != "0000") {
                this.open(msg);
              } else {
                var artdata = response.data.retData[0];
                localStorage.setItem('date',artdata.date);
                localStorage.setItem('content',artdata.content);
                localStorage.setItem('author',artdata.author);
                localStorage.setItem('title',artdata.title);
                this.seeshowArticle();
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
    seeshowArticle() {
      let routeUrl = this.$router.resolve({
        path: "/showArticle",
        query: { id: 96 }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.setItem("uname", "");
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
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
}
.user-name {
  text-align: right;
  font-size: 30px;
  margin-left: 80%;
  margin-top: 10px;
}
.loginbtn {
  font-size: 30px;
  margin-bottom: 10px;
  margin-left: 80%;
}
.m_head {
  font-size: 80px;
  line-height: 300px;
  font: bold;
  color: gold;
  text-shadow: -1px -1px rgba(197, 223, 248, 0.8),
    -2px -2px rgba(197, 223, 248, 0.8), -3px -3px rgba(197, 223, 248, 0.8),
    -4px -4px rgba(197, 223, 248, 0.8), -5px -5px rgba(197, 223, 248, 0.8),
    -6px -6px rgba(197, 223, 248, 0.8);
  width: 100%;
  height: 300px;
  border-radius: 5px;
  background-image: url(../assets/img/head.jpg);
}
.m_slide {
  width: 46%;
  height: 500px;
  border-radius: 40px;
  /*border: 1px solid gray;*/
  margin-top: 10px;
  float: left;
  margin-left: 2%;
}
.m_title {
  width: 46%;
  height: 500px;
  border-radius: 40px;
  /*border: 1px solid gray;*/
  margin-top: 10px;
  float: left;
  margin-left: 2%;
}
.el-table-column {
  font-size: 20px;
}
.stitle {
  margin-left: 10px;
  font-size: 20px;
  font-family: cursive;
  font: bold;
}
.module {
  background-color: red;
  height: 50px;
  text-align: left;
  line-height: 50px;
  color: aliceblue;
  padding-left: 20px;
}
</style>