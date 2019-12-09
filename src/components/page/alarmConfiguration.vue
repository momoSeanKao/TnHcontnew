<template>
  <div class="alarmConfiguration" style="margin-top:10px;">
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in areaList" :key="index" :id="item.id" :label="item.name"></el-tab-pane>
    </el-tabs>
    <!--<el-radio-group >
      <el-radio-button v-for="item in areaList" :label="item.name" @click="radioClick()"></el-radio-button>
    </el-radio-group>-->
    <div >
      <el-row :gutter="20">
        <el-col :span="16" >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>短信报警</span>
              <el-switch style="float: right; padding: 3px 0" active-text="开启" inactive-text="关闭" v-model="SMSAlarm.enable"></el-switch>
            </div>
            <br/>
            电话：<el-input v-model="SMSAlarm.number" style="width: 300px; display: inline-block;" ></el-input>&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="verifyPhone">测试短信</el-button>
            <el-button  type="primary" @click="saveAlarm(1)">保存修改</el-button>
            <br/>
            <br/>
          </el-card>
        </el-col>
      </el-row>
      <br/>
      <el-row :gutter="20">
        <el-col :span="16" >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>邮件报警</span>
              <el-switch style="float: right; padding: 3px 0"  active-text="开启" inactive-text="关闭"  v-model="EmailAlarm.enable" ></el-switch>
            </div>
            <br/>
            邮箱：<el-input  v-model="EmailAlarm.number" style="width: 300px; display: inline-block;" ></el-input>&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="verifyEmail">测试邮件</el-button>
            <el-button  type="primary" @click="saveAlarm(2)">保存修改</el-button>
            <br/>
            <br/>
          </el-card>
        </el-col>
      </el-row>

    </div>



  </div>

</template>
<script>
  const cityOptions = ['断电', '断网', '超标'];

  export default {
    name:'alarmConfiguration',
    data() {
      return {

        tabType: 0,
        labelPosition: 'top',
        SMSAlarm:{
          enable:false,
          number:'',
        },
        tabAreaId:'',
        EmailAlarm:{
          enable:false,
          number:'',
        },
        isIndeterminate: true,
        areaList:[],

      };
    },
    created(){
      //console.log(localStorage.getItem("token"))

      this.getAreaList();
      //this.handleClick(0)
    },
    methods: {

      getAreaList(){
        let _this = this;

        this.axios({
          method:'get',
          url:window.config.url + "/stage/exhibitionArea/getExhibitionAreaList",
          headers:{ "token":localStorage.getItem("token") }
        }).then(function (res) {
          _this.areaList=res.data.data;
          //console.log(_this.areaList);
        }).catch(function (error) {
          console.log(error);
        });
      },
      //点击选项卡
      handleClick(tab) {
        let _this = this;
        //console.log(tab.index)
        //console.log(_this.areaList[tab.index].id)
        _this.tabAreaId = _this.areaList[tab.index].id;
        _this.EmailAlarm.number="";
        _this.SMSAlarm.number="";
        _this.getEmailAlarm(_this.tabAreaId);
        _this.getSMSAlarm(_this.tabAreaId);

      },

      getEmailAlarm(tabId) {
        let _this = this;
        this.axios({
          url:window.config.url + "/stage/alarm/getEmailAlarmConfig",
          method:'get',
          params:{ exhibitionAreaId:tabId },
          headers:{ "token":localStorage.getItem("token") }
        }).then(function (res) {
          //console.log(res)
          if(res.data.code == 200){
            _this.EmailAlarm.enable = res.data.data.enable;
            _this.EmailAlarm.number = res.data.data.number;
          }else{
            _this.$message.error(res.data.msg );
          }

          }).catch(function (error) {
          console.log(error);
        });
      },
      getSMSAlarm(tabId){
        let _this = this;
        this.axios({
          url:window.config.url + "/stage/alarm/getSMSAlarmConfig",
          method:'get',
          params:{  exhibitionAreaId:tabId },
          headers:{ "token":localStorage.getItem("token") }
        })
          .then(function(res){
            //console.log(res)
            _this.SMSAlarm.enable = res.data.data.enable;
            _this.SMSAlarm.number = res.data.data.number;
          }).catch(function (error) {
          console.log(error);
        });
      },

      verifyEmail(){
        // var verifyEmailData={
        //   mail:this.EmailAlarm.number
        // };
        //console.log(this.EmailAlarm.number);
        //this.axios.defaults.headers.common["token"] = localStorage.getItem("token");


        //console.log(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(this.EmailAlarm.number));

        if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(this.EmailAlarm.number) ) {
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/alarm/verifyEmail",
            params:{ mail:this.EmailAlarm.number },
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              this.$message({
                message: "测试邮件已发送至邮箱，请注意查收",
                type: 'success'
              });
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });

        }else{
          this.$message({
            message: "请输入正确的邮箱号",
            type: 'none'
          });
          return false
        }


      },
      verifyPhone(){

        if(/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.SMSAlarm.number)){
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/alarm/verifyPhone",
            params:{ phone:this.SMSAlarm.number  },
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              this.$message({
                message: "测试短信已发送至手机，请注意查收",
                type: 'success'
              });
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }else{
          this.$message({
            message: "请输入正确的手机号",
            type: 'none'
          });
          return false
        }

      },
      saveAlarm(type){
        var _this = this
        var AlarmData = {} ;
        if(type == 1 ){
          AlarmData={
            id:1,
            enable: _this.SMSAlarm.enable,
            number:_this.SMSAlarm.number,
          }
        }else if(type == 2 ){
          AlarmData={
            id:2,
            enable: _this.EmailAlarm.enable,
            number:_this.EmailAlarm.number,
          }
        }
        console.log(AlarmData);
        //this.axios.defaults.headers.common["token"] = localStorage.getItem("token");
        this.axios({
          method: 'post',
          url:window.config.url + "/stage/alarm/updateAlarmConfig",
          data:AlarmData,
          headers:{ "token":localStorage.getItem("token") }
        }).then((res)=>{
          if(res.data.code == 200){
            _this.$message({
              message: "添加成功",
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


    },

  };
</script>

