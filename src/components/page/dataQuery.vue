<template>
    <div class="dataQuery">

      <el-tabs  @tab-click="handleClick">
        <el-tab-pane label="温湿度"></el-tab-pane>
        <el-tab-pane label="有害气体"></el-tab-pane>
      </el-tabs>
      <div v-show="tabType == 0">
        <THQuery></THQuery>
      </div>
      <div  v-show="tabType == 1">
        <gasQuery></gasQuery>
      </div>



   </div>
</template>

<script>
  import gasQuery from './gasQuery'
  import THQuery from './THQuery'

  const echarts = require('echarts');
    export default {
        name: "dataQuery",
      components:{
        gasQuery,THQuery
      },
      data() {
        return {
          tabType: 0,
          radioQuerytype:'温湿度',
          exhibitionAreaId:'',
          lineGroupId:'',
          concentratorId:'',
          collectorId:'',
          gasCollectorId:'',

          historyQuerybyTable:{
            startTime:'',
            endTime:'',
            alarm:false,
          },
          historyQuerybyChart:{
            interval:'',
            startTime:'',
            endTime:'',
          },
          historyAlarm:{
            startTime:'',
            endTime:'',
            alarm:true,
          },

          exhibitionAreaList:[],
          lineGroupList:[],
          concentratorList:[],
          collectorList:[],
          gasCollectorList:[],

          historyQueryData:[],
          total:0,
          pageSize: 10,
          currentPage: 1,

          historyGasQueryData:[],
          totalGas:0,
          pageSizeGas: 10,
          currentPageGas: 1,

          historyAlarmQueryData:[],
          totalAlarm:0,
          pageSizeAlarm: 10,
          currentPageAlarm: 1,

          historyAlarmGasQueryData:[],
          totalAlarmGas:0,
          pageSizeAlarmGas: 10,
          currentPageAlarmGas: 1,

          rangeDay:30,
          pickerOptions0: {
            disabledDate: (time) => {
              if (this.historyQuerybyChart.endTime != "") {
                let endDate = new Date(this.historyQuerybyChart.endTime).getTime();
                let  range = this.rangeDay * 24 * 3600 * 1000;
                let dateRegionMin = endDate - range;
                return  time.getTime() > endDate ||  time.getTime() < dateRegionMin;
              }
            }
          },
          pickerOptions1: {
            disabledDate: (time) => {
              if (this.historyQuerybyChart.startTime != "") {
                let stratDate = new Date(this.historyQuerybyChart.startTime).getTime();
                let range = this.rangeDay * 24 * 3600 * 1000;
                let dateRegionMax = stratDate + range;
                return  time.getTime() < stratDate  ||  time.getTime() > dateRegionMax;

              }
            }
          },


        }

      },
      mounted(){
        this. getExhibitionAreaList();
        //this.getCollectorList();
        //this.initCharts();
      },
      methods: {
        handleClick(tab, e) {//点击选项卡
          this.tabType = tab.index;
          var _val = tab.index;
          this.exhibitionAreaId='';
          this.lineGroupId='';
          this.concentratorId='';
          this.collectorId="";

        },
        querytypeChange(e){
          console.log(e)
          console.log(this.radioQuerytype)
        },
        datetimeFormat(time) {
          var date=new Date(time);
          var year=date.getFullYear();
          var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
          var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
          var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
          var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
          var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
          return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
        },

        getExhibitionAreaList(){
          let _this = this;
          this.axios({
            url:window.config.url + "/stage/device/getExhibitionAreaDropDownList",
            method:'get',
            headers:{ "token":localStorage.getItem("token") }
          }).then(function (res) {
            _this.exhibitionAreaList=res.data.data;
            //console.log(_this.areaList);
          }).catch(function (error) {
            console.log(error);
          });
        },
        getLineGroupList(id){
          let _this = this;
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/device/getLineGroupDropDownList",
            params:{exhibitionAreaId:id},
            headers:{ "token":localStorage.getItem("token") }
          }).then(function(res){
            console.log(res);
            _this.lineGroupList = res.data.data;
          }).catch(function (error) {
            console.log(error);
          });
        },
        getConcentratorList(id){
          let _this = this;
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/device/getConcentratorDropDownList",
            params:{lineGroupId:id},
            headers:{ "token":localStorage.getItem("token") }
          }).then(function(res){
            console.log(res);
            _this.concentratorList = res.data.data;
          }).catch(function (error) {
            console.log(error);
          });
        },
        getCollectorList(id){
          let _this = this;
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/device/getCollectorDropDownList",
            params:{concentratorId:id},
            headers:{ "token":localStorage.getItem("token") }
          }).then(function(res){
            console.log(res);
            _this.collectorList = res.data.data;
          }).catch(function (error) {
            console.log(error);
          });
        },
        getGasCollectorList(id){
          let _this = this;
          this.axios({
            method: 'get',
            url:window.config.url + "/stage/device/getGasCollectorDropDownList",
            params:{concentratorId:id},
            headers:{ "token":localStorage.getItem("token") }
          }).then(function(res){
            console.log(res);
            _this.gasCollectorList = res.data.data;
          }).catch(function (error) {
            console.log(error);
          });
        },

        intervalChange(val){
          let _this = this;
          //console.log(val);
          if(val == 1 ){
            this.rangeDay = 1;
          }
          if(val == 2){
            this.rangeDay = 30;
          }
          if(val == 3 ){
            this.rangeDay = 30;
          }
          //console.log(this.rangeDay);
          this.historyQuerybyChart.startTime ='';
          this.historyQuerybyChart.endTime ='';
        },


        queryTable(){
          let _this = this;

          var queryTableData = {
            exhibitionAreaId:_this.exhibitionAreaId,
            lineGroupId:_this.lineGroupId,
            concentratorId:_this.concentratorId,
            collectorId: _this.collectorId,
            start: _this.historyQuerybyTable.startTime,
            end: _this.historyQuerybyTable.endTime,
            queryAlarm:_this.historyQuerybyTable.alarm,
            current:_this.currentPage,
            size:_this.pageSize,
          };
          for (var i in queryTableData) {
            if( queryTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };
          //console.log(queryTableData);
          var myCollector = this.collectorList.find(x => x.id == _this.collectorId);
          var myConcentrator = this.concentratorList.find(x => x.id == _this.concentratorId);
          var myLineGroup = this.lineGroupList.find(x => x.id == _this.lineGroupId);
          var myExhibitionArea= this.exhibitionAreaList.find(x => x.id == _this.exhibitionAreaId);

          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/data/getCollectorRecordList",
            data:queryTableData,
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              //console.log(res);
              var arr = res.data.data.records;
               arr.map(item=>{
                console.log(item)
                item.equipment = myExhibitionArea.name +'-'+ myLineGroup.name +'-'+ myConcentrator.name +'-'+ myCollector.name;
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
              //console.log(arr);
              _this.historyQueryData = arr;
              _this.total=res.data.data.total;
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
        queryAlarmTable(){
          let _this = this;

          var queryAlarmTableData = {
            exhibitionAreaId:_this.exhibitionAreaId,
            lineGroupId:_this.lineGroupId,
            concentratorId:_this.concentratorId,
            collectorId: _this.collectorId,
            start: _this.historyAlarm.startTime,
            end: _this.historyAlarm.endTime,
            queryAlarm:_this.historyAlarm.alarm,
            current:_this.currentPage,
            size:_this.pageSize,
          };
          for (var i in queryAlarmTableData) {
            if( queryAlarmTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };
          var myCollector = this.collectorList.find(x => x.id == _this.collectorId);
          var myConcentrator = this.concentratorList.find(x => x.id == _this.concentratorId);
          var myLineGroup = this.lineGroupList.find(x => x.id == _this.lineGroupId);
          var myExhibitionArea= this.exhibitionAreaList.find(x => x.id == _this.exhibitionAreaId);
          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/data/getCollectorRecordList",
            data:queryAlarmTableData,
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              //console.log(res);
              var arr = res.data.data.records;
              arr.map(item=>{
                console.log(item)
                item.equipment = myExhibitionArea.name +'-'+ myLineGroup.name +'-'+ myConcentrator.name +'-'+ myCollector.name;
              });
              console.log(arr);
              _this.historyAlarmQueryData = arr;
              _this.total=res.data.data.total;
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

        queryTableGas(){
          let _this = this;

          var queryTableData = {
            exhibitionAreaId:_this.exhibitionAreaId,
            lineGroupId:_this.lineGroupId,
            concentratorId:_this.concentratorId,
            collectorId: _this.gasCollectorId,
            start: _this.historyQuerybyTable.startTime,
            end: _this.historyQuerybyTable.endTime,
            queryAlarm:_this.historyQuerybyTable.alarm,
            current:_this.currentPageGas,
            size:_this.pageSizeGas,
          };
          for (var i in queryTableData) {
            if( queryTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };
          console.log(queryTableData);
          var myCollector = this.gasCollectorList.find(x => x.id == _this.gasCollectorId);
          var myConcentrator = this.concentratorList.find(x => x.id == _this.concentratorId);
          var myLineGroup = this.lineGroupList.find(x => x.id == _this.lineGroupId);
          var myExhibitionArea= this.exhibitionAreaList.find(x => x.id == _this.exhibitionAreaId);

          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/data/getGasCollectorRecordList",
            data:queryTableData,
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              console.log(res);
              var arr = res.data.data.records;
              arr.map(item=>{
                //console.log(item)
                item.equipment = myExhibitionArea.name +'-'+ myLineGroup.name +'-'+ myConcentrator.name +'-'+ myCollector.name;
                if(item.type == 2){
                  item.type = "有机物";
                }else if(item.type == 3){
                  item.type = "苯";
                } else if(item.type == 4){
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

              });
              console.log(arr);
              _this.historyGasQueryData = arr;
              _this.totalGas = res.data.data.total;
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
        queryAlarmTableGas(){
          let _this = this;

          var queryAlarmTableData = {
            exhibitionAreaId:_this.exhibitionAreaId,
            lineGroupId:_this.lineGroupId,
            concentratorId:_this.concentratorId,
            collectorId: _this.gasCollectorId,
            start: _this.historyAlarm.startTime,
            end: _this.historyAlarm.endTime,
            queryAlarm:_this.historyAlarm.alarm,
            current:_this.currentPage,
            size:_this.pageSize,
          };
          for (var i in queryAlarmTableData) {
            if( queryAlarmTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };
          var myCollector = this.gasCollectorList.find(x => x.id == _this.gasCollectorId);
          var myConcentrator = this.concentratorList.find(x => x.id == _this.concentratorId);
          var myLineGroup = this.lineGroupList.find(x => x.id == _this.lineGroupId);
          var myExhibitionArea= this.exhibitionAreaList.find(x => x.id == _this.exhibitionAreaId);
          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/data/getCollectorRecordList",
            data:queryAlarmTableData,
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              //console.log(res);
              var arr = res.data.data.records;
              arr.map(item=>{
                console.log(item)
                item.equipment = myExhibitionArea.name +'-'+ myLineGroup.name +'-'+ myConcentrator.name +'-'+ myCollector.name;
              });
              console.log(arr);
              _this.historyQueryData = arr;
              _this.total=res.data.data.total;
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

        exportExcel(){
          let _this = this;

          var queryTableData = {
            exhibitionAreaId:_this.exhibitionAreaId,
            concentratorId: _this.concentratorId,
            lineGroupId: _this.lineGroupId,
            concentratorId: _this.concentratorId,
            collectorId: _this.collectorId || _this.gasCollectorId,
            start: _this.historyQuerybyTable.startTime,
            end: _this.historyQuerybyTable.endTime,
            queryAlarm:_this.historyQuerybyTable.alarm,
          };
          console.log(queryTableData);
          for (var i in queryTableData) {
            if( queryTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              break;
            }
          };

          _this.axios({
            headers:{ "token":localStorage.getItem("token") },
            method: 'post',
            url:window.config.url + "/stage/excel/exportCollectorExcel",
            data:queryTableData,
            responseType: 'blob',
          }).then((res)=>{
            var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            //downloadElement.download = '温湿度记录表.xlsx'; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            _this.$message({
              message: "下载成功",
              type: 'success'
            });

          }).catch(function (error) {
            console.log(error);
          });

        },


        handleSizeChange(val){
          this.pageSize = val;
          this.queryTable();
        },
        handleCurrentChange(val){
          this.currentPage = val;
          this.queryTable();
        },

        handleSizeChangeGas(val){
          this.pageSizeGas = val;
          this.queryTableGas();
        },
        handleCurrentChangeGas(val){
          this.currentPageGas = val;
          this.queryTableGas();
        },

        /*请求历史曲线数据*/
        queryChart(){

          let _this = this;

          let queryChartData = {
            exhibitionAreaId:_this.exhibitionAreaId,
            lineGroupId:_this.lineGroupId,
            concentratorId:_this.concentratorId,
            collectorId: _this.collectorId || _this.gasCollectorId,
            start:_this.historyQuerybyChart.startTime,
            end:_this.historyQuerybyChart.endTime,
            unit:_this.historyQuerybyChart.interval,
          };
          console.log(queryChartData);
          for (var i in queryChartData) {
            if( queryChartData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };
          _this.axios({
            method: 'post',
            url:window.config.url + "/stage/data/getCollectorRecordDto",
            data:queryChartData,
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            //console.log(res);
            if(res.data.code == 200){
              //console.log(res);
              if(_this.collectorId){
                _this.inithistoryQuerybyChart(res.data.data);
              }
              if(_this.gasCollectorId){
                _this.inithistoryGasQuerybyChart(res.data.data);
              }
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

        /*绘制历史曲线图*/
        inithistoryQuerybyChart(json) {
          let humidityArr = [], temperatureArr = [], recordingTimeArr = [];
          json.forEach((value, index) => {
            humidityArr.push(value.humidity);
            temperatureArr.push(value.temperature);
            recordingTimeArr.push(value.recordingTime);
          })

          let myChart = this.$echarts.init(this.$refs.chart);

          // 绘制图表
          myChart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              feature: {
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            legend: {
              data:['湿度','温度']
            },
            xAxis: [
              {
                type: 'category',
                data: recordingTimeArr,
                axisPointer: {
                  type: 'shadow'
                },
                axisLabel: {
                  interval: 3,
                  formatter:function(value) {
                    return value.split(" ").join("\n");
                  }
                }

              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '湿度',
                min: 0,
                max: 100,
                interval: 10,
                axisLabel: {
                  formatter: '{value} %'
                }
              },
              {
                type: 'value',
                name: '温度',
                min: 0,
                max: 50,
                interval: 5,
                axisLabel: {
                  formatter: '{value} °C'
                }
              }
            ],
            series: [
              {
                name:'湿度',
                type:'line',
                data:humidityArr
              },
              {
                name:'温度',
                type:'line',
                yAxisIndex: 1,
                data:temperatureArr
              }
            ]
          });

        },

        /*绘制gas历史曲线图*/
        inithistoryGasQuerybyChart(json) {
          console.log(json)
          let  temperatureArr = [], recordingTimeArr = [];
          json.forEach((value, index) => {
            //humidityArr.push(value.humidity);
            temperatureArr.push(value.temperature);
            recordingTimeArr.push(value.recordingTime);
          })

          let myChart = this.$echarts.init(this.$refs.chartGas);

          // 绘制图表
          myChart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            grid:{
              bottom:"20%" //
            },
            // toolbox: {
            //   feature: {
            //     restore: {show: true},
            //     saveAsImage: {show: true}
            //   }
            // },
            // legend: {
            //   data:['有害气体']
            // },

            xAxis: [
              {
                type: 'category',
                data: recordingTimeArr,
                axisPointer: {
                  type: 'shadow'
                },
                axisLabel: {
                  interval: 3,
                   formatter:function(value) {
                       return value.split(" ").join("\n");
                   }
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '有害气体',
                // min: 0,
                // max: 50,
                //interval: 5,
                axisLabel: {
                  formatter: '{value} ppm'
                }
              }
            ],
            series: [
              {
                name:'有害气体',
                type:'line',
                //yAxisIndex: 1,
                data:temperatureArr
              }
            ]
          });

        },


      }
    }
</script>

<style scoped>

</style>
