<template>
    <div class="accontManage">
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane label="PC端" ></el-tab-pane>
        <el-tab-pane label="移动端" ></el-tab-pane>
      </el-tabs>
      <div v-show="tabType == 0">
        <el-row>
          <el-button type="primary" icon="el-icon-plus"  class="handle-del mr10" @click=" addAccontBox">新增账户</el-button>
        </el-row>
        <el-row>
          <el-table :data="accontList">
            <el-table-column prop="username" label="账号名"></el-table-column>
            <el-table-column  label="设置用户状态" >
              <template slot-scope="scope">
                <el-switch active-value="1" inactive-value="2" active-text="启用" inactive-text="禁用" v-model="scope.row.states" @change="switchAccont(scope.row)" ></el-switch>
              </template>
            </el-table-column>
            <el-table-column  label="重置密码" >
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetPasswardBox(scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>

      <div v-show="tabType == 1">
        <el-row>
          <el-table  :data="accontCheckList">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" style="width: 100%">
                  <el-form-item >
                    <img :src="props.row.headImgUrl"  width="40" height="40"/>
                  </el-form-item>
                  <el-form-item label="openid:">
                    <span>{{ props.row.openid}}</span>
                  </el-form-item>
                  <el-form-item label="ID:">
                    <span>{{ props.row.id}}</span>
                  </el-form-item>
                  <el-form-item label="性别:">
                    <span>{{ props.row.sex }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="nickName" label="昵称" ></el-table-column>
            <el-table-column  prop="states" label="状态" :filter-method="filterTag" filter-placement="bottom-end"
              :filters="[{ text: '待审核', value: '待审核' }, { text: '已通过', value: '已通过' }, { text: '已拒绝', value: '已拒绝' }]">
              <template slot-scope="scope">
                <el-tag close-transition>{{scope.row.states}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column  prop="states" label="操作" >
              <template v-if="scope.row.states =='待审核'" slot-scope="scope">
                <el-button size="mini" type="success" @click="handleStates( scope.row, 2)">通过</el-button>
                <el-button size="mini" type="danger" @click="handleStates( scope.row, 3)">拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>

      <el-dialog title="新增账户" :visible.sync="addAccontFlag" width="60%" :before-close="addAccontBoxClose">

        <el-form ref="form" :model="addAccontInfo"   label-width="120px" >
          <el-form-item label="账户名">
            <el-input v-model="addAccontInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="选择展区">
            <el-select v-model="addAccontInfo.exhibitionAreaId"  value-key="value" style="width: 100%" >
              <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="addAccontInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="addAccontInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="addAccontInfo.email"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="addAccont()">保 存</el-button>
          <el-button type="primary" @click="addAccontBoxClose">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog  :visible.sync="resetPasswardFlag" width="30%" :before-close="resetPasswardBoxclose">
        <span>将本账号的密码重置为"123456"？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetPassward">确 定</el-button>
          <el-button @click="resetPasswardBoxclose">取 消</el-button>

        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "accontManage",
      data(){
        return {
          inject: ['reload'],
          tabType: 0,
          addAccontInfo:{
            name:'',
            exhibitionAreaId:'',
            password:'',
            phone:'',
            email:''
          },
          addAccontFlag:false,
          editPasswardFlag:false,
          resetPasswardFlag:false,
          exhibitionAreaList:[],
          accontList:[] ,
          accontCheckList:[],
          myeditAccont:'',
          resetPasswardId:'',

        }
      },
      created() {
        this.getAccontList();
        this.getAccontCheckList();
      },

      methods: {

        //点击选项卡 切换PC端/移动端
        handleClick(tab, e) {
          this.tabType = tab.index;
          var _val = tab.index;

        },
        //获取PC端用户列表
        getAccontList(){
          let _this = this;
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/user/getUserDtoList",
            headers:{ "token":localStorage.getItem("token") }
        }).then(function(res){
              var arr = res.data.data;
              console.log(arr);
              arr.map(item=>{
                item.states=item.states.toString();
              });
              _this.accontList=arr;
              console.log(_this.accontList);
            }).catch(function (error) {
            console.log(error);
          });
        },
        addAccontBox(){
          this.addAccontFlag = true;
          this.getExhibitionAreaList();
        },
        getExhibitionAreaList(){
          let _this = this;
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/device/getExhibitionAreaDropDownList",
            headers:{ "token":localStorage.getItem("token") }
          }) .then(function(res){
              console.log(res);
              _this.exhibitionAreaList = res.data.data;
            }).catch(function (error) {
            console.log(error);
          });
        },
        //添加PC端用户
        addAccont(){
          let _this = this;
          let addAccontData = {
            username:_this.addAccontInfo.name,
            password:_this.addAccontInfo.password,
            exhibitionAreaId:_this.addAccontInfo.exhibitionAreaId,
            name:_this.addAccontInfo.name,
            email:_this.addAccontInfo.email
          };
          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/user/createAccount",
            data:addAccontData,
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              _this.$message({
                message: "添加成功",
                type: 'success'
              });
              this.addAccontFlag = false;
              _this.getAccontList();
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
        addAccontBoxClose(){
          let _this = this;
          _this.addAccontFlag = false;
            _this.addAccontInfo.name="";
            _this.addAccontInfo.password="";
            _this.addAccontInfo.exhibitionAreaId="";
            _this.addAccontInfo.name="";
            _this.addAccontInfo.email="";
        },
        //启用/禁用PC端用户
        switchAccont(row){
          //console.log(row.id);
          let _this = this;
          var myeditAccont = _this.accontList.find(x => x.id == row.id);
          //console.log(myeditAccont.id)
          _this.axios({
            method: 'get',
            url:window.config.url + "/stage/user/enableOrDisable",
            params:{id:myeditAccont.id},
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              _this.$message({
                message: "修改成功",
                type: 'success'
              });

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

        //重置PC端用户密码
        resetPasswardBox(row){
          this.resetPasswardFlag = true;
          this.resetPasswardId = row.id;
          console.log(this.resetPasswardId);
        },
        resetPassward(){
          let _this = this;
          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/user/resetPwd",
            data:{id:_this.resetPasswardId},
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              _this.$message({
                message: "重置成功",
                type: 'success'
              });
              _this.resetPasswardFlag = false;
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
        resetPasswardBoxclose(){
          this.resetPasswardFlag = false;
          this.resetPasswardId = '';

        },


        //获取移动端用户列表
        getAccontCheckList(){
          let _this = this;
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/user/getWxUserDtoList",
            params:{states: 0},
            headers:{ "token":localStorage.getItem("token") }
          }).then(function(res){
            //console.log(res);
            var arr = res.data.data;
            arr.map(item=>{
              //console.log(item)
              if(item.states == "0"){
                item.states = "全部";
              }else if(item.states == "1"){
                item.states = "待审核";
              } else if(item.states == "2"){
                item.states = "已通过";
              }else if(item.states == "3"){
                item.states = "已拒绝";
              }
              if(item.sex == "1"){
                item.sex = "男";
              }else if(item.sex == "2"){
                item.sex = "女";
              }
            });
              _this.accontCheckList = arr;


            }).catch(function (error) {
            //console.log(error);
          });
        },

        //移动端用户筛选
        filterTag(value, row) {
          return row.states === value;
        },
        //审核移动端用户状态
        handleStates(row,newStates){

          //console.log(row);

          let _this = this;
          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/user/authWxUser",
            data:{ id: row.id, states: newStates },
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              _this.$message({
                message: "编辑成功",
                type: 'success'
              });
              //console.log("this.reload1");
              //_this.reload();
              //window.location.reload();
              //this.$router.go(0);
              this.getAccontCheckList();
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });

          // var time = setInterval(function () {
          //   if(num=_this.exhibitionAreaList.length){
          //     console.log("this.reload2");
          //     _this.reload();
          //     clearInterval(time);
          //   }
          // },5000)

        },


      }


    };
</script>

<style scoped>

</style>
