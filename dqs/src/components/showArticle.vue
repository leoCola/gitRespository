<template>
  <div>
    <h1>{{title}}</h1>
    <el-row>
      <el-col :span="4" :offset="16">
        <span>作者：{{author}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{date}}</span>
      </el-col>
    </el-row>
    <br />
    <div v-html="content"></div>
    <div class="comment_1">
      评论：
      <div class="comment" v-for="comment in comments" :key="comment">
        <br />
        <span>{{comment.content}}</span>
        <br />
        <span style="margin-left:40%">评论人：{{comment.author}}</span>
        <span style="margin-left:10%">时间：{{comment.createDate}}</span>
        <span style="margin-left:10%;cursor:pointer" @click="deleteComment(comment.id)" v-show='commentCandel(comment.author)'>删除</span>
        <hr />
      </div>
    </div>
    <div class="comment_2" v-show="showComUp">
      <el-input type="textarea" v-model="commentUp" placeholder="请在此输入您的评论。。。"></el-input>
      <div style="margin-top:20px">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="info" @click="reload">重置</el-button>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      showComUp: true,
      title: "",
      date: "",
      content: "",
      author: "",
      id: "",
      params: {
        artId: ""
      },
      comments: [],
      commentUp: "",
      commentParams: {
        content: "",
        author: "",
        artId: ""
      },
      delParams:{
        id:""
      }
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
      var uname = sessionStorage.getItem("uname");
      var role = sessionStorage.getItem("role");
      if(uname==null || uname=="" || role == "0"){
        this.showComUp = false;
      }

      this.title = sessionStorage.getItem("title");
      this.date = sessionStorage.getItem("date");
      this.content = sessionStorage.getItem("content");
      this.author = sessionStorage.getItem("author");
      this.id = sessionStorage.getItem("id");
      this.params.artId = this.id;
      console.log(this.id);
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/findCommentsByArtId",
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
              if (retcode == "0000") {
                console.log("查询评论成功！");
                this.comments = response.data.retData;
              }else if(retcode == "7777"){
                this.comments = '';
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

    onSubmit() {
      if(this.commentUp == ""){
        this.open("请输入评论再提交！");
        return;
      }
      this.commentParams.content = this.commentUp;
      this.commentParams.author = sessionStorage.getItem("uname");
      this.commentParams.artId = this.id;
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/addComment",
        data: JSON.stringify(this.commentParams),
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
                console.log("添加评论成功！");
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

    commentCandel(author){
      var name = sessionStorage.getItem("uname");
      if(name == 'admin'){
        return true;
      }else if(name ==author){
        return true;
      }else{
        return false;
      }
    },

    deleteComment(id){
      this.delParams.id = id;
      this.$axios({
        method: "post",
        url: this.GLOBAL.host + "/deleteComment",
        data: JSON.stringify(this.delParams),
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

    },

    reload() {
      this.commentUp = "";
    }
  }
};
</script>

<style scoped>
.comment_1 {
  width: 60%;
  margin-left: 20%;
  text-align: left;
}
.comment_2 {
  width: 60%;
  margin-left: 20%;
  margin-top: 20px;
}
</style>