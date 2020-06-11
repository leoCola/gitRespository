<template>
  <div>
    <el-input placeholder="请输入添加的文章模块名" v-model="moduleName" class="inputName" style="width:400px"></el-input>
    <el-button slot="append" @click="addModule">添加</el-button>

    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      stripe
      style="width: 100%"
      v-loading="loading"
      @row-click="getDetails"
    >
      <el-table-column prop="moduleId" label="模块编号" width="100"></el-table-column>
      <el-table-column prop="moduleName" label="模块名称" width="200"></el-table-column>
      <el-table-column prop="delete" label="删除" width="150">
        <el-button type="primary" @click="deleteRow">删除</el-button>
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
      moduleName: "",
      params: { moduleName: "" },
      total: 100, //默认数据总数
      pagesize: 5, //每页的数据条数
      currentPage: 1, //默认开始页面
      tableData: [],
      loading: true,
      row:{
        moduleId:"",
        moduleName:""
      },
      isDelete:false
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init() {
      if (sessionStorage.getItem("isAdmin") != "2") {
        this.$router.push("/noFound");
        return;
      }else{
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
              if (retcode != "0000") {
                this.open(msg);
              } else {
                this.tableData = response.data.retData;
                this.total = this.tableData.length;
                this.loading = false;
              }
            } else {
              this.open("服务异常!");
            }
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
      }
    },

    deleteRow(){
      this.isDelete = true;
    },

    getDetails(row) {
      this.row.moduleId = row.moduleId;
      this.row.moduleName = row.moduleName;
      if(this.isDelete){
        this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/deleteModule",
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
              if (retcode == "0000") {
                this.$message("删除成功！");
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
      }
      this.isDelete = false;
    },
    open(tips) {
      this.$alert(tips, "提示：", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    addModule() {
      if (this.moduleName == "") {
        this.open("请输入模块名！");
        return;
      }
      this.params.moduleName = this.moduleName;
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/addModule",
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
                this.open(msg);
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
    },
     current_change: function(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>