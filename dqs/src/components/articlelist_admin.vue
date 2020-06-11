<template>
  <div>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      stripe
      style="width: 100%"
      v-loading="loading"
      @row-click="getDetails"
    >

      <el-table-column prop="title" label="标题" width="400"></el-table-column>
      <el-table-column prop="author" label="作者" width="150"></el-table-column>
      <el-table-column prop="date" label="创建时间" width="200"></el-table-column>
      <el-table-column prop="moduleName" label="所属模块" width="150"></el-table-column>
      <el-table-column prop="isShow" label="是否审核" width="100"></el-table-column>
      <el-table-column prop="delte" label="删除" width="150">
        <el-button type="primary" @click="deleteRow">删除</el-button>
      </el-table-column>
      <el-table-column prop="update" label="置顶" width="150">
        <el-button type="primary" @click="updateRow">置顶</el-button>
      </el-table-column>
      <el-table-column prop="updateShow" label="审核" width="150">
        <el-button type="primary" @click="updateShow">审核</el-button>
      </el-table-column>
      <el-table-column prop="updateContent" label="编辑" width="150">
        <el-button type="primary" @click="updateContent">编辑</el-button>
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
</template>

<script>
export default {
  data() {
    return {
      total: 100, //默认数据总数
      pagesize: 5, //每页的数据条数
      currentPage: 1, //默认开始页面
      tableData: [],
      loading: true,
      path:"",
      params:{
        author:""
      },
      row:{
        id:""
      },
      action:""

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
      if(sessionStorage.getItem("isAdmin") =="2"){
        this.path="/quryAllArt";
      }else{
        this.path="/quryArticleByAuthor";
        this.params.author = sessionStorage.getItem("uname");
      }

      this.$axios({
        method: "post",
        url: this.GLOBAL.host + this.path,
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
                this.open("暂无数据");
                this.loading = false;
              } else {
                this.tableData = response.data.retData;
                this.total = this.tableData.length;
                this.loading = false;
                for(var i = 0;i<this.tableData.length;i++){
                    this.tableData[i].isShow = this.turnIsShow(this.tableData[i].isShow);
                }
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

    getDetails(row){
      this.row.id = row.id;
      if(this.action == "delete"){
        this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/deleteArtcleById",
        data: JSON.stringify(this.row),
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
                this.$message('删除成功！');
                this.init();
              }
            } else {
              this.open("服务异常!");
            }
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
      }else if(this.action == "update"){
        this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/updateArtDate",
        data: JSON.stringify(this.row),
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
                this.$message('置顶成功！');
                this.init();
              }
            } else {
              this.open("服务异常!");
            }
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
      }else if(this.action =="updateShow"){
        if(sessionStorage.getItem('uname')!='admin'){
          this.open("只有admin用户才能审核！");
          this.action = "";
          return;
        }
        this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/updateIsShow",
        data: JSON.stringify(this.row),
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
                this.$message('审核成功！');
                this.init();
              }
            } else {
              this.open("服务异常!");
            }
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });

      }else if(this.action = "updateContent"){
        sessionStorage.setItem("updateArtId",row.id);
        this.$router.push("/updateArticle");
      }
      this.action = "";
    },

    deleteRow(){
      this.action = "delete";

    },
    updateRow(){
      this.action = "update";
    },
    updateShow(){
      this.action = "updateShow";
    },
    updateContent(){
      this.action = "updateContent";
    },

    current_change: function(currentPage) {
      this.currentPage = currentPage;
    },
    turnIsShow(isShow){
      if(isShow=='1'){
        return '是';
      }else{
        return '否';
      }
    }
  }
};
</script>