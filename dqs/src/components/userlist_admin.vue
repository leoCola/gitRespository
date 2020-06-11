<template>
  <div>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      stripe
      style="width: 100%"
      v-loading="loading"
      @row-click="getDetails"
    >
      <el-table-column prop="id" label="编号" width="100"></el-table-column>
      <el-table-column prop="uname" label="用户名" width="400"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="200"></el-table-column>
      <el-table-column prop="isAdmin" label="是否管理员" width="150"></el-table-column>
      <el-table-column prop="role" label="是否评论用户" width="150"></el-table-column>
      <el-table-column prop="update" label="修改" width="150">
        <el-button type="primary" @click="authRow">修改权限</el-button>
      </el-table-column>
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
    <el-dialog title="用户权限" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="管理员权限：" :label-width="formLabelWidth">
          <el-select v-model="form.admin" placeholder="请选择是否管理员">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论用户权限：" :label-width="formLabelWidth">
          <el-select v-model="form.role" placeholder="请选择是否评论用户">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reback">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
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
      row: {
        id: "",
        uname: "",
        isAdmin: "",
        role: ""
      },
      dialogFormVisible: false,
      isAuth:false,
      form: {
        admin: "",
        role: ""
      },
      formLabelWidth: "120px",
      isDelete:false
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init() {
      if(sessionStorage.getItem("isAdmin") !="2"){
        this.$router.push('/noFound');
        return;
      }
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/getAllUser",
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
                for (var i = 0; i < this.tableData.length; i++) {
                  this.tableData[i].role = this.turnrole(
                    this.tableData[i].role
                  );
                  this.tableData[i].isAdmin = this.turnadmin(
                    this.tableData[i].isAdmin
                  );
                }
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
    reback(){
      this.dialogFormVisible = false;
      this.isAuth = false;
    },
    submit(){
      this.dialogFormVisible = false;
      this.isAuth = false;
      this.row.role = this.form.role;
      this.row.isAdmin = this.form.admin;
      console.log("修改用户信息："+this.row);
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/updateUser",
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
                this.open("修改成功！");
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
    authRow() {
      this.isAuth =true;
    },
    deleteRow(){
      this.isDelete = true;
    },
    getDetails(row) {
      this.row.id = row.id;
      this.row.uname = row.uname;
      if(this.isAuth){
        if(row.uname == "admin"){
          this.open("admin用户不能更改权限！");
          this.isAuth =false;
          return;
        }
        this.form.role = row.role == "是"?"1":"0";
        this.form.admin = row.isAdmin == "否"?"0":"1";
        this.dialogFormVisible = true;
      }

      if(this.isDelete){
        this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/deleteUser",
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
        this.isDelete = false;
      }
    },

    turnrole(role) {
      if (role == "1") {
        return "是";
      } else {
        return "否";
      }
    },
    turnadmin(admin) {
      if (admin == "0") {
        return "否";
      } else {
        return "是";
      }
    },
    open(tips) {
      this.$alert(tips, "提示：", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  }
};
</script>