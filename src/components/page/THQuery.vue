<template>
<div>
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane label="历史数据" ></el-tab-pane>
      <el-tab-pane label="历史曲线" ></el-tab-pane>
      <el-tab-pane label="报警记录" ></el-tab-pane>
    </el-tabs>
    <div v-show="tabType == 0">

      <el-form :inline="true" :model="historyQuerybyTable" >
        <el-form-item label="展区">
          <el-select v-model="historyQuerybyTable.exhibitionAreaId" value-key="value" @change="((val)=>{getLineGroupList(val)})">
            <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="historyQuerybyTable.lineGroupId" value-key="value"  @change="((val)=>{getConcentratorList(val)})">
            <el-option v-for="item in lineGroupList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路">
          <el-select v-model="historyQuerybyTable.concentratorId" value-key="value"  @change="((val)=>{getCollectorList(val)})">
            <el-option v-for="item in concentratorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集器">
          <el-select v-model="historyQuerybyTable.collectorId" value-key="value" >
            <el-option v-for="item in collectorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
<!--        <el-form-item label="时间间隔">&nbsp;&nbsp;-->
<!--          <el-radio-group   v-model="historyQuerybyTable.interval" value-key="id" @change="intervalChange">-->
<!--            <el-radio-button label="1" >分钟</el-radio-button>-->
<!--            <el-radio-button label="2" >小时</el-radio-button>-->
<!--            <el-radio-button label="3" >天</el-radio-button>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item label="截取时间">
          <el-date-picker v-model="historyQuerybyTable.startTime" type="datetime" placeholder="开始日期" :picker-options="pickerOptions0" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-date-picker v-model="historyQuerybyTable.endTime" type="datetime" placeholder="结束日期" :picker-options="pickerOptions1" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="queryTable">查询</el-button>
        </el-form-item>
        <el-form-item >
         <el-button type="primary"  @click="exportExcel">导出Excel</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="historyQueryData" max-height="500" @sort-change="tableSortChange" style="width: 100%" >
        <el-table-column prop="name" label="设备" min-width="200"></el-table-column>
        <el-table-column prop="recordingTime" sortable='custom' label="时间" min-width="180"></el-table-column>
        <el-table-column label="温度">
          <el-table-column prop="temperature" label="℃" min-width="40"></el-table-column>
          <el-table-column prop="temperatureFlag" label="状态" width="100">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.temperatureFlag === '正常' ? '#606266' : '#F56C6C'}">{{ scope.row.temperatureFlag }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="湿度">
          <el-table-column prop="humidity" label="%" min-width="40"></el-table-column>
          <el-table-column prop="humidityFlag" label="状态" min-width="100">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.humidityFlag === '正常' ? '#606266' : '#F56C6C'}">{{ scope.row.humidityFlag }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <div v-show="tabType == 1">
      <el-form :inline="true" :model="historyQuerybyChart" >
        <el-form-item label="展区">
          <el-select v-model="historyQuerybyChart.exhibitionAreaId" value-key="value" @change="((val)=>{getLineGroupList(val)})">
            <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="historyQuerybyChart.lineGroupId" value-key="value"  @change="((val)=>{getConcentratorList(val)})">
            <el-option v-for="item in lineGroupList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路">
          <el-select v-model="historyQuerybyChart.concentratorId" value-key="value"  @change="((val)=>{getCollectorList(val)})">
            <el-option v-for="item in concentratorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集器">
          <el-select v-model="historyQuerybyChart.collectorId" value-key="value" >
            <el-option v-for="item in collectorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="时间间隔">&nbsp;&nbsp;
          <el-radio-group   v-model="historyQuerybyChart.interval" value-key="id" @change="intervalChange">
            <el-radio-button label="1" >分钟</el-radio-button>
            <el-radio-button label="2" >小时</el-radio-button>
            <el-radio-button label="3" >天</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="截取时间">
          <el-date-picker v-model="historyQuerybyChart.startTime" type="datetime" placeholder="开始日期" :picker-options="pickerOptions0" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-date-picker v-model="historyQuerybyChart.endTime" type="datetime" placeholder="结束日期" :picker-options="pickerOptions1" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item >
          <!--<el-button type="primary"  @click="">曲线对比</el-button>-->
          <el-button type="primary" @click="queryChart">查询</el-button>
          <el-button type="primary"  @click="downloadImpByChart('THchart')">导出图片</el-button>
        </el-form-item>
      </el-form>
      <div ref="chart" id="THchart" :style="{width: '1200px', height: '400px'}"></div>
    </div>
    <div v-show="tabType == 2">
      <el-form :inline="true" :model="historyAlarm" >
        <el-form-item label="展区">
          <el-select v-model="historyAlarm.exhibitionAreaId" value-key="value" @change="((val)=>{getLineGroupList(val)})">
            <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="historyAlarm.lineGroupId" value-key="value"  @change="((val)=>{getConcentratorList(val)})">
            <el-option v-for="item in lineGroupList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路">
          <el-select v-model="historyAlarm.concentratorId" value-key="value"  @change="((val)=>{getCollectorList(val)})">
            <el-option v-for="item in concentratorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集器">
          <el-select v-model="historyAlarm.collectorId" value-key="value" >
            <el-option v-for="item in collectorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截取时间">
          <!--<el-date-picker  v-model="historyQuerybyTable.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>-->
          <el-date-picker v-model="historyAlarm.startTime" type="datetime" placeholder="开始日期" :picker-options="pickerOptions0" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-date-picker v-model="historyAlarm.endTime" type="datetime" placeholder="结束日期" :picker-options="pickerOptions1" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="queryAlarmTable">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :header-cell-style="{background:'#F5F7FA'}" @sort-change="tableSortChangeAlarm" :data="historyAlarmQueryData" style="width: 100%">
        <el-table-column prop="name" label="设备" min-width="240"></el-table-column>
        <el-table-column prop="recordingTime" label="时间" sortable='custom' min-width="180"></el-table-column>
        <el-table-column prop="temperature" label="温度" min-width="180"></el-table-column>
        <el-table-column prop="humidity" label="湿度" min-width="180"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChangeAlarm" @current-change="handleCurrentChangeAlarm" :current-page="currentPageAlarm" :page-sizes="[10, 50, 100]" :page-size="pageSizeAlarm" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

</div>
</template>

<script>
  const echarts = require('echarts');
    export default {
        name: "THQuery",
      data() {
        return {
          tabType: 0,
          tabPosition: 'left',
          radioQuerytype:'温湿度',

          historyQuerybyTable:{
            exhibitionAreaId:'',
            lineGroupId:'',
            concentratorId:'',
            collectorId:'',
            interval:'2',
            startTime:'',
            endTime:this.getCurrentDate(),
            alarm:false,
          },
          historyQuerybyChart:{
            exhibitionAreaId:'',
            lineGroupId:'',
            concentratorId:'',
            collectorId:'',
            interval:'2',
            startTime:'',
            endTime:this.getCurrentDate(),
          },
          historyAlarm:{
            exhibitionAreaId:'',
            lineGroupId:'',
            concentratorId:'',
            collectorId:'',
            startTime:'',
            endTime:this.getCurrentDate(),
            alarm:true,
          },

          exhibitionAreaList:[],
          lineGroupList:[],
          concentratorList:[],
          collectorList:[],

          historyQueryData:[],
          total:0,
          pageSize: 10,
          currentPage: 1,
          asc:true,
          column:'',

          historyAlarmQueryData:[],
          totalAlarm:0,
          pageSizeAlarm: 10,
          currentPageAlarm: 1,
          ascAlarm:true,
          columnAlarm:'',


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
        //this.getCurrentDate();
      },
      methods: {
        handleClick(tab, e) {//点击选项卡
          this.tabType = tab.index;
          var _val = tab.index;
          // this.exhibitionAreaId='';
          // this.lineGroupId='';
          // this.concentratorId='';
          // this.collectorId="";

        },
        getCurrentDate() {
          var timeStr = '-';
          var curDate = new Date();
          var curYear =curDate.getFullYear();  //获取完整的年份(4位,1970-????)
          var curMonth = curDate.getMonth()+1;  //获取当前月份(0-11,0代表1月)
          var curDay = curDate.getDate();       //获取当前日(1-31)
          var curWeekDay = curDate.getDay();    //获取当前星期X(0-6,0代表星期天)
          var curHour = curDate.getHours();      //获取当前小时数(0-23)
          var curMinute = curDate.getMinutes();   // 获取当前分钟数(0-59)
          var curSec =curDate.getSeconds();      //获取当前秒数(0-59)
          if (curMonth<10) {
            curMonth='0'+curMonth;
          }
          if (curDay<10) {
            curDay='0'+curDay;
          }
          if (curHour<10) {
            curHour='0'+curHour;
          }
          if (curMinute<10) {
            curMinute='0'+curMinute;
          }
          if (curSec<10) {
            curSec='0'+curSec;
          }
          var Current= curYear+timeStr+curMonth+timeStr+curDay+' '+curHour+':'+curMinute+':'+curSec;
          //console.log(Current);
          // this.datetime=Current;
          return Current;
        },


        datetimeFormat(time) {
          var date = new Date(time);
          var year = date.getFullYear();
          var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
          var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        },

        getExhibitionAreaList() {
          let _this = this;
          this.axios({
            url: window.config.url + "/stage/device/getExhibitionAreaDropDownList",
            method: 'get',
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            _this.exhibitionAreaList = res.data.data;
            //console.log(_this.areaList);
          }).catch(function (error) {
            console.log(error);
          });
        },
        getLineGroupList(id) {

          let _this = this;
          _this.historyQuerybyTable.lineGroupId = '';
          _this.historyQuerybyChart.lineGroupId = '';
          _this.historyAlarm.lineGroupId = '';
          this.axios({
            method: 'get',
            url: window.config.url + "/stage/device/getLineGroupDropDownList",
            params: {exhibitionAreaId: id},
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            //console.log(res);
            _this.lineGroupList = res.data.data;
          }).catch(function (error) {
            console.log(error);
          });
        },
        getConcentratorList(id) {
          let _this = this;
          _this.historyQuerybyTable.concentratorId = '';
          _this.historyQuerybyChart.concentratorId = '';
          _this.historyAlarm.concentratorId = '';
          this.axios({
            method: 'get',
            url: window.config.url + "/stage/device/getConcentratorDropDownList",
            params: {lineGroupId: id},
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            //console.log(res);
            _this.concentratorList = res.data.data;
          }).catch(function (error) {
            console.log(error);
          });
        },
        getCollectorList(id) {
          let _this = this;
          _this.historyQuerybyTable.collectorId = '';
          _this.historyQuerybyChart.collectorId = '';
          _this.historyAlarm.collectorId = '';
          this.axios({
            method: 'get',
            url: window.config.url + "/stage/device/getCollectorDropDownList",
            params: {concentratorId: id},
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            //console.log(res);
            _this.collectorList = res.data.data;
          }).catch(function (error) {
            console.log(error);
          });
        },


        intervalChange(val) {
          let _this = this;
          //console.log(val);
          if (val == 1) {
            this.rangeDay = 1;
          }
          if (val == 2) {
            this.rangeDay = 30;
          }
          if (val == 3) {
            this.rangeDay = 30;
          }
          //console.log(this.rangeDay);
          this.historyQuerybyChart.startTime = '';
          this.historyQuerybyChart.endTime = '';
        },


        queryTable() {
          let _this = this;

          var queryTableData = {
            exhibitionAreaId: _this.historyQuerybyTable.exhibitionAreaId,
            lineGroupId: _this.historyQuerybyTable.lineGroupId,
            start: _this.historyQuerybyTable.startTime,
            end: _this.historyQuerybyTable.endTime,
            queryAlarm: _this.historyQuerybyTable.alarm,
            current: _this.currentPage,
            size: _this.pageSize,
            orders:[{
                asc:_this.asc,
                column:_this.column
              }]
          };
          for (var i in queryTableData) {
            if (queryTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };
          queryTableData.concentratorId = _this.historyQuerybyTable.concentratorId;
          queryTableData.collectorId = _this.historyQuerybyTable.collectorId;

          //console.log(queryTableData);
          // var myCollector = this.collectorList.find(x => x.id == _this.collectorId);
          // var myConcentrator = this.concentratorList.find(x => x.id == _this.concentratorId);
          // var myLineGroup = this.lineGroupList.find(x => x.id == _this.lineGroupId);
          // var myExhibitionArea= this.exhibitionAreaList.find(x => x.id == _this.exhibitionAreaId);

          _this.axios({
            method: 'post',
            url: window.config.url + "/stage/data/getCollectorRecordList",
            data: queryTableData,
            headers: {"token": localStorage.getItem("token")}
          }).then((res) => {
            if (res.data.code == 200) {
              //console.log(res);
              var arr = res.data.data.records;
              arr.map(item => {
                //console.log(item)
                //item.equipment = myExhibitionArea.name +'-'+ myLineGroup.name +'-'+ myConcentrator.name +'-'+ myCollector.name;
                if (item.temperatureFlag == "00") {
                  item.temperatureFlag = "正常";
                } else if (item.temperatureFlag == "01") {
                  item.temperatureFlag = "过低";
                } else if (item.temperatureFlag == "10") {
                  item.temperatureFlag = "过高";
                }
                if (item.humidityFlag == "00") {
                  item.humidityFlag = "正常";
                } else if (item.humidityFlag == "01") {
                  item.humidityFlag = "过低";
                } else if (item.humidityFlag == "10") {
                  item.humidityFlag = "过高";
                }
              });
              //console.log(arr);
              _this.historyQueryData = arr;
              _this.total = res.data.data.total;
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });

        },

        queryAlarmTable() {
          let _this = this;

          var queryAlarmTableData = {
            exhibitionAreaId: _this.historyAlarm.exhibitionAreaId,
            lineGroupId: _this.historyAlarm.lineGroupId,
            start: _this.historyAlarm.startTime,
            end: _this.historyAlarm.endTime,
            queryAlarm: _this.historyAlarm.alarm,
            current: _this.currentPageAlarm,
            size: _this.pageSizeAlarm,
            orders:[{
              asc:_this.ascAlarm,
              column:_this.columnAlarm
            }]
          };
          for (var i in queryAlarmTableData) {
            if (queryAlarmTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };
          queryAlarmTableData.concentratorId = _this.historyAlarm.concentratorId;
          queryAlarmTableData.collectorId = _this.historyAlarm.collectorId;
          // var myCollector = this.collectorList.find(x => x.id == _this.collectorId);
          // var myConcentrator = this.concentratorList.find(x => x.id == _this.concentratorId);
          // var myLineGroup = this.lineGroupList.find(x => x.id == _this.lineGroupId);
          // var myExhibitionArea= this.exhibitionAreaList.find(x => x.id == _this.exhibitionAreaId);
          _this.axios({
            method: 'post',
            url: window.config.url + "/stage/data/getCollectorRecordList",
            data: queryAlarmTableData,
            headers: {"token": localStorage.getItem("token")}
          }).then((res) => {
            if (res.data.code == 200) {
              //console.log(res);
              var arr = res.data.data.records;
              // arr.map(item=>{
              //   console.log(item)
              //   item.equipment = myExhibitionArea.name +'-'+ myLineGroup.name +'-'+ myConcentrator.name +'-'+ myCollector.name;
              // });
              //console.log(arr);
              _this.historyAlarmQueryData = arr;
              _this.total = res.data.data.total;
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });

        },

        exportExcel() {
          let _this = this;

          var queryTableData = {
            exhibitionAreaId: _this.historyQuerybyTable.exhibitionAreaId,
            concentratorId: _this.historyQuerybyTable.concentratorId,

            collectorId: _this.collectorId,
            start: _this.historyQuerybyTable.startTime,
            end: _this.historyQuerybyTable.endTime,
            queryAlarm: _this.historyQuerybyTable.alarm,
          };
          //console.log(queryTableData);
          for (var i in queryTableData) {
            if (queryTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              break;
            }
          }
          ;
          queryTableData.lineGroupId = _this.historyQuerybyTable.lineGroupId;
          queryTableData.concentratorId = _this.historyQuerybyTable.concentratorId;
          _this.axios({
            headers: {"token": localStorage.getItem("token")},
            method: 'post',
            url: window.config.url + "/stage/excel/exportCollectorExcel",
            data: queryTableData,
            responseType: 'blob',
          }).then((res) => {
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

        tableSortChange(column){
          //console.log(column);
          if(column.prop == "recordingTime" && column.order == "ascending"){
            this.asc = true;
            this.column = "recording_time";
          }else if(column.prop == "recordingTime" && column.order == "descending"){
            this.asc = false;
            this.column = "recording_time";
          }
          this.queryTable();
        },

        handleSizeChange(val) {
          this.pageSize = val;
          this.queryTable();
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.queryTable();
        },
        tableSortChangeAlarm(column){
          //console.log(column);
          if(column.prop == "recordingTime" && column.order == "ascending"){
            this.ascAlarm = true;
            this.columnAlarm = "recording_time";
          }else if(column.prop == "recordingTime" && column.order == "descending"){
            this.ascAlarm = false;
            this.columnAlarm = "recording_time";
          }
          this.queryAlarmTable();
        },
        handleSizeChangeAlarm(val) {
          this.pageSizeAlarm = val;
          this.queryTable();
        },
        handleCurrentChangeAlarm(val) {
          this.currentPageAlarm = val;
          this.queryTable();
        },


        /*请求历史曲线数据*/
        queryChart() {

          let _this = this;

          let queryChartData = {
            exhibitionAreaId: _this.historyQuerybyChart.exhibitionAreaId,
            lineGroupId: _this.historyQuerybyChart.lineGroupId,
            concentratorId: _this.historyQuerybyChart.concentratorId,
            collectorId: _this.historyQuerybyChart.collectorId,
            start: _this.historyQuerybyChart.startTime,
            end: _this.historyQuerybyChart.endTime,
            unit: _this.historyQuerybyChart.interval,
          };
          console.log(queryChartData);
          for (var i in queryChartData) {
            if (queryChartData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          }
          ;
          _this.axios({
            method: 'post',
            url: window.config.url + "/stage/data/getCollectorRecordDto",
            data: queryChartData,
            headers: {"token": localStorage.getItem("token")}
          }).then((res) => {
            //console.log(res);
            if (res.data.code == 200) {
              //console.log(res);
              _this.inithistoryQuerybyChart(res.data.data);

            } else {
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
            // title:{
            //   text:"温湿度曲线"
            // },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            // toolbox: {
            //   feature: {
            //     restore: {show: true},
            //     saveAsImage: {show: true}
            //   }
            // },
            legend: {
              data: ['湿度', '温度']
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
                  formatter: function (value) {
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
                name: '湿度',
                type: 'line',
                data: humidityArr
              },
              {
                name: '温度',
                type: 'line',
                yAxisIndex: 1,
                data: temperatureArr
              }
            ]
          });

        },

        /*下载图表图片*/
        downloadImpByChart(chartId) {
          var myChart = echarts.getInstanceByDom(document.getElementById(chartId));
          var url = myChart.getConnectedDataURL({
            pixelRatio: 5,　　//导出的图片分辨率比率,默认是1
            backgroundColor: '#fff',　　//图表背景色
            excludeComponents: [　　//保存图表时忽略的工具组件,默认忽略工具栏
              'toolbox'
            ],
            type: 'png'　　//图片类型支持png和jpeg
          });
          var $a = document.createElement('a');
          var type = 'png';
          $a.download = '温湿度折线图.' + type;
          $a.target = '_blank';
          $a.href = url;
          // Chrome and Firefox
          if (typeof MouseEvent === 'function') {
            var evt = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: false
            });
            $a.dispatchEvent(evt);
          }
          // IE
          else {
            var html = ''

            '<body style="margin:0;">'
            '![](' + url + ')'
            '</body>';
            var tab = window.open();
            tab.document.write(html);
          }
        },


      }
    }
</script>

<style scoped>

</style>
