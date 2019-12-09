<template>
  <div class="overview">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="grid-content-header">
            室外天气
          </div>
          <el-divider></el-divider>
          <div class="grid-content-con">
            <div class="grid-content-item" style="width:100%;">
              <div class="pull-left">
                <span>{{outdoor.location}}</span>&nbsp;&nbsp;&nbsp;
                <span>{{outdoor.situation}}</span>
              </div>
              <div class="pull-right"><span class="bignum">{{outdoor.temperature}}</span>℃</div>
            </div>
          </div>
<!--          <div id="weather-view-he"></div>-->
<!--          <iframe src="../weather.html" frameborder="0" scrolling="auto"></iframe>-->
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <div class="grid-content-header">
            展区情况
          </div>
          <el-divider></el-divider>
          <div class="grid-content-con " style="">
            <div class="grid-content-item">
              <div class="pull-left">
                <span>展区</span>
              </div>
              <div class="pull-right"><span class="bignum">4</span>个</div>
            </div>

            <div class="grid-content-item">
              <div class="pull-left">
                <span>线路</span>
              </div>
              <div lass="pull-right">共<span class="bignum">{{concentratorSum}}</span>条</div>
            </div>

            <div class="grid-content-item">
              <div class="pull-left">
                <span>采集器</span>
              </div>
              <div lass="pull-right">共<span class="bignum">{{collectorSum}}</span>个</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" >
        <div class="grid-content bg-purple ">
          <div class="grid-content-header">
            今日报警设备
          </div>
          <br/>
          <el-tabs type="card" @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in exhibitionAreaList" :key="index" :id="item.id" :label="item.name"></el-tab-pane>
          </el-tabs>

          <el-card v-for="item in todayAlarmDeviceData" :key="item.id" class="box-card">

              <div slot="header" class="clearfix">
                <span>{{item.name}}</span> |
                <span >{{item.type}}</span> |
                <soan>{{item.gmtCreate}}</soan>
                <i class="el-icon-warning" style=" float:right; color: #F56C6C; font-size: 24px; "></i>
              </div>
              <div v-show="item.type =='温湿度'">
                <span>温度：<b>{{item.temperature}}°C</b> ({{item.temperatureFlag}})</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>湿度：<b>{{item.humidity}}%</b> ({{item.humidityFlag}})</span>
              </div>
              <div v-show="item.type != '温湿度'">
                <span>浓度：<b>{{item.temperature}}ppm</b> ({{item.temperatureFlag}})</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </el-card>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
        <div class="grid-content-header">
          设备运行情况
          <span style="float: right;" @click="setEquipmentFlag = true"><i class="el-icon-setting">筛选配置</i> </span>
        </div>
          <br/>
        <el-table :data="equipmentSituationDate" width="100%">
          <el-table-column prop="name" label="线路名" min-width="120"></el-table-column>
          <el-table-column prop="online" label="运行情况" ></el-table-column>
          <el-table-column prop="batteryPower" label="电量" ></el-table-column>
          <el-table-column prop="temperature" label="温度" ></el-table-column>
          <el-table-column prop="humidity" label="湿度" ></el-table-column>
        </el-table>
        </div>

      </el-col>
    </el-row>

    <el-dialog title="筛选配置" :visible.sync="setEquipmentFlag" width="60%" :before-close="handleClose(setEquipmentFlag)">

      <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="setEquipment()">保 存</el-button>
          <el-button type="primary" @click="setEquipmentFlag = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "overview",
      data() {
        return {
          outdoor:{
            temperature:'',
            location:'',
            situation:'',

          },
          todayAlarmDeviceData:[],
          equipmentSituationDate:[],
          concentratorSum:'',
          collectorSum:'',
          exhibitionAreaList:[],
          setEquipmentFlag:false,
        }
      },
      created() {
        this.getEquipmentSituation();
        this.getTodayAlarmDevice(1);
        this.getWeather();
        this.getConcentratorSum();
        this.getCollectorSum();
        this.getAreaList();
      },
      methods: {
        handleClose(flag) {

          if(flag == 'setEquipmentFlag'){
            this.setEquipmentFlag = false;
          }

        },

        getEquipmentSituation(){
          let _this = this;
          _this.axios({
            method:'get',
            url:window.config.url + "/stage/home/getEquipmentSituation",
            headers: { "token": localStorage.getItem("token") }
        }).then(function(res){
            //var arr = _this.equipmentSituation;
            var arr = res.data.data;
              arr.map(item=>{
                if(item.online == false){
                  item.online = "离线";
                }else if(item.online == true){
                  item.online = "在线";
                }
                if(item.batteryPower < 1){
                  item.batteryPower = "电量过低";
                }else {
                  item.batteryPower = "正常";
                }
              });
              _this.equipmentSituationDate=arr;
          }).catch(function (error) {
            console.log(error);
          });
        },
        getAreaList(){
          let _this = this;

          this.axios({
            method:'get',
            url:window.config.url + "/stage/exhibitionArea/getExhibitionAreaList",
            headers:{ "token":localStorage.getItem("token") }
          }).then(function (res) {
            _this.exhibitionAreaList=res.data.data;
            //console.log(_this.areaList);
          }).catch(function (error) {
            console.log(error);
          });
        },
        handleClick(tab) {
          let _this = this;
          //console.log(tab.index)
          //console.log(_this.areaList[tab.index].id)
          _this.tabAreaId = _this.exhibitionAreaList[tab.index].id;
          _this.getTodayAlarmDevice(_this.tabAreaId);
        },
        getTodayAlarmDevice(id){
          let _this = this;
          _this.axios({
            method:'get',
            url:window.config.url + "/stage/home/getTodayAlarmDevice",
            params:{exhibitionAreaId:id},
            headers: { "token": localStorage.getItem("token") }
        }).then(function(res){
            //console.log(res.data);
            var arr = res.data.data;
            arr.map(item=>{
              //console.log(item)
              //item.equipment = myExhibitionArea.name +'-'+ myLineGroup.name +'-'+ myConcentrator.name +'-'+ myCollector.name;

              if(item.type == 1){
                item.type = "温湿度";
              }else if(item.type == 2){
                item.type = "有机物";
              }else if(item.type == 3){
                item.type = "苯";
              }else if(item.type == 4){
                item.type = "氨气";
              }else if(item.type == 5){
                item.type = "二氧化硫";
              }else if(item.type == 6){
                item.type = "甲醛";
              }else if(item.type == 7){
                item.type = "PM2.5";
              }
              if(item.temperatureFlag == "00"){
                item.temperatureFlag = "正常";
              }else if(item.temperatureFlag == "01"){
                item.temperatureFlag = "过低";
              } else if(item.temperatureFlag == "10"){
                item.temperatureFlag = "过高";
              }
              if(item.humidityFlag == "00"){
                item.humidityFlag = "正常";
              }else if(item.humidityFlag == "01"){
                item.humidityFlag = "过低";
              } else if(item.humidityFlag == "10"){
                item.humidityFlag = "过高";
              }
            });
            _this.todayAlarmDeviceData = arr;
            //console.log(_this.todayAlarmDeviceData);
          }).catch(function (error) {
            console.log(error);
          });
        },

        getWeather(){
          let _this = this;
          //http://t.weather.sojson.com/api/weather/city/101210101
          this.axios.get(
            _this.crossUrl+"/v3/weather/now.json?key=SsbrsFY1VjGb1-zGf&location=hangzhou&language=zh-Hans&unit=c",
            //"http://t.weather.sojson.com/api/weather/city/101210101",
            //{headers: {'Access-Control-Allow-Origin': '*',}}
            ).then(function(res){
            //console.log(res);
            let arr= res.data.results;
            _this.outdoor.temperature = arr[0].now.temperature;
            _this.outdoor.situation = arr[0].now.text;
            _this.outdoor.location = arr[0].location.name;

          }).catch(function (error) {
            console.log(error);
          });

        },
        getConcentratorSum(){
          let _this = this;
          _this.axios({
            method:'get',
            url:window.config.url + "/stage/device/getConcentratorList",
            headers: { "token": localStorage.getItem("token") }
          }).then(function(res){

            _this.concentratorSum = res.data.data.length;
           // console.log(_this.concentratorSum);
          }).catch(function (error) {
            console.log(error);
          });
        },

        getCollectorSum(){
          let _this = this;
          _this.axios({
            method: 'get',
            url: window.config.url + "/stage/home/getCollectorTotalNum",
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            console.log(res);
            _this.collectorSum = res.data.data;
            //_this.get();
            //console.log(_this.exhibitionAreaList);
          }).catch(function (error) {
            console.log(error);
          });


        },
        get(){
          let _this = this;
          var collectorCount = 0;
          console.log(_this.exhibitionAreaList);
          var num=0;
          for(var i=0; i<_this.exhibitionAreaList.length; i++){

            _this.axios({
              method: 'get',
              url: window.config.url + "/stage/home/getCollectorNum",
              params:{exhibitionAreaId:_this.exhibitionAreaList[i].id},
              headers: {"token": localStorage.getItem("token")}
            }).then(function (res) {
              collectorCount += res.data.data;
              num++;
              console.log(collectorCount);
            }).catch(function (error) {
              console.log(error);
            });

          }

          var time = setInterval(function () {
            if(num=_this.exhibitionAreaList.length){
              _this.collectorSum = collectorCount;
              console.log(_this.collectorSum );
              clearInterval(time)
            }
          },5000)

        }
      },
    }


</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
     margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #F5F7FA;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 20px;

  }
  .grid-content-header{
    /*border-bottom:1px solid #ebeef5 ;*/
  }
  .grid-content-con{
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content:  space-around;
  }
  .grid-content-item{
    width: 30%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-around;
    align-items:  flex-end;

    border-left:1px solid #ebeef5 ;
  }
  .grid-content-item:first-child{
    border-left:none ;
  }
  .bignum{
     font-size: 36px;
    color: #46a0fc;

  }
  /*.pull-left{*/
  /*  float: left;*/
  /*}*/
  /*.pull-right{*/
  /*  float: right;*/
  /*}*/

  .box-card {
    width: 100%;
    box-shadow: none;


  }

  .el-tabs__item.is-active {
    background-color: #fff;
  }
</style>
