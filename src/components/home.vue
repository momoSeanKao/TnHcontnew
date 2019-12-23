<template>
  <div class="home"  style="height: 100%">
    <el-container style="height: 100%">
      <el-aside class="sidebar"   >
        <el-header style="height: 80px">
          <h1>杭州工艺美术博物馆</h1>
          <h2>环境监控系统</h2>
        </el-header>
        <el-menu :router="true" :default-active="$route.path" style="background-color: #2c3e50" >
          <el-menu-item v-for="menu in menuArray" :key="menu.menuId" :index="menu.link" >
            <i :class="menu.icon"></i>
            <span slot="title">{{menu.menuName}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header" style="height: 80px">

          <div class="float-right">
            <el-dropdown trigger="click" @command="handleCommand" class="header-action">
              <span>操作<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="Profile"><i class="el-icon-key"></i> 修改密码</el-dropdown-item>
                <el-dropdown-item command="SignOut"><i class="el-icon-refresh"></i> 安全退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <el-dialog title="修改密码" :visible.sync="editPasswardFlag" width="60%" :before-close="handleClose(editPasswardFlag)">
            <el-form ref="form"  label-width="120px" >
              <el-form-item label="旧密码">
                <el-input v-model="oldPassword"></el-input>
              </el-form-item>
              <el-form-item label="新密码">
                <el-input v-model="newPassword"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="editPassward()">保 存</el-button>
          <el-button type="primary" @click="editPasswardFlag = false">取 消</el-button>
        </span>
          </el-dialog>

        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  import {md5} from '../config/md5'
    export default {
        name: "home",
      data(){
          return{
            squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
            menuArray:[],
            newPassword: "",
            oldPassword: "",
            editPasswardFlag:false
          }
      },
      created(){

        if( localStorage.getItem("superAdmin") == "true" ){
          this.menuArray = [
            {
              "menuId": 1,
              "menuName": "概览",
              "link": "/home/overview",
              "icon": "el-icon-view",
            },
            {
              "menuId": 2,
              "menuName": "线路管理",
              "link": "/home/lineManagement",
              "icon": "el-icon-s-operation",
            },
            {
              "menuId": 3,
              "menuName": "报警配置",
              "link": "/home/alarmConfiguration",
              "icon": "el-icon-warning-outline",
            },
            {
              "menuId": 4,
              "menuName": "展区布局",
              "link": "/home/viewSelection",
              "icon": "el-icon-monitor",
            },
            {
              "menuId": 5,
              "menuName": "数据查询",
              "link": "/home/dataQuery",
              "icon": "el-icon-coin",
            },
            {
              "menuId": 6,
              "menuName": "账号管理",
              "link": "/home/accontManage",
              "icon": "el-icon-user",
            },
            {
              "menuId": 7,
              "menuName": "定时任务",
              "link": "/home/timingJob",
              "icon": "el-icon-timer",
            }];
        } else {
          this.menuArray=[
            {
              "menuId": 1,
              "menuName": "概览",
              "link": "/home/overview",
              "icon": "el-icon-view",
            },
            {
              "menuId": 5,
              "menuName": "数据查询",
              "link": "/home/dataQuery",
              "icon": "el-icon-s-data",
            }];
        }
      },
      methods:{
        handleClose(flag) {

          if(flag == 'editPasswardFlag'){
            this.editPasswardFlag = false;
          }

        },
        handleCommand(command) {
          switch (command) {
            case "Profile":
              this.editPasswardFlag = true
              break;
            case "SignOut":
              this.signOut();
              break;
          }
        },
        signOut(){
          localStorage.removeItem('token');
          localStorage.removeItem('superAdmin');
          //axios.defaults.headers.common["token"] = "";
          this.$router.push('/login');
        },
        /*editPasswardBox(){
          this.editPasswardFlag = true;


        },*/

        editPassward(){
          let _this = this;
          let editPasswardData = {
            newPassword:md5(_this.newPassword),
            oldPassword:md5(_this.oldPassword),
          };
          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/user/updatePassword",
            data:editPasswardData,
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              _this.$message({
                message: "修改成功",
                type: 'success'
              });
              this.editPasswardFlag = false;
            }else{
              _this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        },


      }
    }
</script>

<style scoped>



  .sidebar {
    background-color: #000;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    width: 260px !important;
  }

  .sidebar h1 {
    font-size: 18px;
    display: inline-block;
    color: #ad9064;
    margin-left:10px ;
    margin-top:15px ;
  }
  .sidebar h2 {
    font-size: 14px;
    display: inline-block;
    color:#aaaaaa;
    margin-left:10px ;
  }
  .sidebar .title{
    height: 80px;
  }
  .sidebar .el-menu {
    border-right: none;
  }
  .sidebar .el-menu .el-menu-item {
    color: #fff;
    background-color: #222222;
  }
  .sidebar .el-menu  .el-menu-item:hover, .el-menu-item:focus {
    background-color: #333333;
  }
  .sidebar .el-menu  .is-active{
    background-color: #333333;
  }
  .header {
    height: 60px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
    line-height: 80px;
  }

  .header .header-action {
    margin-left: 12px;
  }


  .float-right {
    float: right;
  }


</style>
