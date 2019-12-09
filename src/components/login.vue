<template>
    <div class="login_page fillcontain">
      <img src="../assets/images/logo.png" height="90" width="500"/>
      <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
      <div class="manage_tip">
        <h1>杭州工艺美术博物馆</h1>
        <h2>环境在线监控系统</h2>
      </div>
        <br/>
        <br/>
        <br/>
      <el-form class="loginForm" :model="loginForm" :rules="rules" ref="loginForm" style="margin-top: 20px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
      </section>
    </transition>
    </div>
</template>

<script>
  import {md5} from '../config/md5'

  export default {
    name: 'login',
    data() {

      return {
        loginForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            { required: true,message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码',trigger: 'blur' },
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }

          ],


        }
      };
    },
    methods: {
       submitForm(formName) {

        this.$refs[formName].validate( (valid) => {
          const data = {
            username: this.loginForm.username,
            password: md5(this.loginForm.password)
          };
          //console.log(data)
          this.axios({
            method: 'post',
            url:window.config.url + "/stage/user/login",
            data:data
          }).then((res)=>{
            if(res.data.code == 200){
              console.log(res.data.data.token)
              localStorage.setItem('token', res.data.data.token);
              localStorage.setItem('superAdmin',res.data.data.superAdmin);
              this.$message({
                message: "登陆成功",
                type: 'success'
              });
              this.$router.push('/home/overview')
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });

        })
      },
      resetForm(formName) {
        //this.$refs[formName].resetFields();
      },
    }


  };
</script>

<style scoped>
  .login_page {
    width: 100%;
    height: 100%;
    display: flex;
    background: #000000;
  }
  .login_page img {
   padding-top: 50px;
    padding-left: 50px;
  }

  .form_contianer {
    position: absolute;
    right: 100px;
    bottom: 10%;
    width: 380px;
    height: 400px;
    border-radius: 5px;
    text-align: center;
    background-color: #ffffff;
    padding: 25px;
  }
  .form_contianer .manage_tip {
    float:left;
    display: block;
    width: 100%;
  }

  .manage_tip h1{
    float: left;
  }
  .manage_tip h2{
    float: left;
  }



</style>
