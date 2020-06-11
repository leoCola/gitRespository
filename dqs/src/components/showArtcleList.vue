<template>
  <div>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="title">
        <template slot-scope="scope">
          <i class="el-icon-tickets"></i>
          <span class="stitle" style="font-size:20px" @click="showArticle(scope.row.id)">{{ scope.row.title }}</span>
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
      params: {
        id: ""
      },
      seachparams:{
          
      }
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init() {
        var seachType = sessionStorage.getItem("seachType");
        var path = "";
        if(seachType == "1"){
            path = "/seachArtByModuleId";
            this.seachparams.moduleId = sessionStorage.getItem("moduleId");
        }else if(seachType == "0"){
            path = "/seachArt";
            this.seachparams.title = sessionStorage.getItem("seachTitle");
        }
        
        this.$axios({
        method: "post",
        url: this.GLOBAL.host + path,
        data: JSON.stringify(this.seachparams),
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
                sessionStorage.setItem("date", artdata.date);
                sessionStorage.setItem("content", artdata.content);
                sessionStorage.setItem("author", artdata.author);
                sessionStorage.setItem("title", artdata.title);
                sessionStorage.setItem("id", artdata.id);
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
    current_change: function(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>