<template>
<div>
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane label="历史数据" ></el-tab-pane>
      <el-tab-pane label="历史曲线" ></el-tab-pane>
      <el-tab-pane label="报警记录" ></el-tab-pane>
    </el-tabs>
    <div v-show="tabType == 0">
      <el-container>
      <el-aside width="300px"  style="border: 1px solid #eee; padding: 10px; ">
        <p>提示:请选择具体到采集器</p>
        <br/>
        <el-scrollbar style="height:700px; overflow-x: hidden; ">
        <el-tree :props="props" :load="loadNode" :default-expand-all="true" node-key="id" ref="treeHistoryQuerybyTable" show-checkbox lazy  @node-click="handleNodeClick" ></el-tree>
        </el-scrollbar>
      </el-aside>
      <el-main>

      <el-form :inline="true" :model="historyQuerybyTable" >
        <!--        <el-form-item label="展区">
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
        <br/>-->
        <el-form-item label="时间间隔">
          <el-radio-group   v-model="historyQuerybyTable.interval" value-key="id" > <!--@change="intervalChange"-->
            <el-radio-button label="1" >分钟</el-radio-button>
            <el-radio-button label="2" >小时</el-radio-button>
            <el-radio-button label="3" >天</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="截取时间">
          <el-date-picker v-model="historyQuerybyTable.startTime" type="datetime" placeholder="开始日期" :picker-options="pickerOptions0" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-date-picker v-model="historyQuerybyTable.endTime" type="datetime" placeholder="结束日期" :picker-options="pickerOptions1" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="queryTable">查询</el-button>
        </el-form-item>
        <el-form-item >
         <el-button type="primary"  @click="exportExcel">导出Excel</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="historyQueryData"  @sort-change="tableSortChange" style="width: 100%" >
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
      </el-main>
      </el-container>
    </div>
    <div v-show="tabType == 1">
      <el-container>
        <el-aside width="300px"  style="border: 1px solid #eee; padding: 10px; ">
          <p>提示:请选择具体到采集器</p>
          <br/>
          <el-scrollbar style="height:700px; overflow-x: hidden; ">
          <el-tree :props="props" :load="loadNode" :default-expand-all="true" node-key="id" ref="treeHistoryQuerybyChart" show-checkbox lazy  @node-click="handleNodeClick" ></el-tree>
          </el-scrollbar>
        </el-aside>
        <el-main>

        <el-form :inline="true" :model="historyQuerybyChart" >
        <!--<el-form-item label="展区">
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
        <br/>-->
        <el-form-item label="时间间隔">
          <el-radio-group v-model="historyQuerybyChart.interval" value-key="id" >
            <el-radio-button label="1" >分钟</el-radio-button>
            <el-radio-button label="2" >小时</el-radio-button>
            <el-radio-button label="3" >天</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="截取时间">

          <el-date-picker v-model="historyQuerybyChart.startTime"  type="datetime" placeholder="开始日期" :picker-options="{ step: '00:15',}" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-date-picker v-model="historyQuerybyChart.endTime " type="datetime" placeholder="结束日期" :picker-options="{ step: '01:00',}" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="queryChart">查询</el-button>
          <el-button type="primary"  @click="downloadImpByChart('THchart')">导出图片</el-button>
<!--          <el-button type="primary" @click="getTimePotArr">获取时间间隔</el-button>-->
        </el-form-item>
      </el-form>
      <div ref="chart" id="THchart" :style="{width: '100%', height: '720px'}"></div>
        </el-main>
      </el-container>
    </div>
    <div v-show="tabType == 2">
      <el-container>
        <el-aside width="300px"  style="border: 1px solid #eee; padding: 10px; ">
          <p>提示:请选择具体到采集器</p>
          <br/>
          <el-scrollbar style="height:700px; overflow-x: hidden; ">
          <el-tree :props="props" :load="loadNode" :default-expand-all="true" node-key="id" ref="treeHistoryAlarm" show-checkbox lazy  @node-click="handleNodeClick" ></el-tree>
          </el-scrollbar>
        </el-aside>
        <el-main>

      <el-form :inline="true" :model="historyAlarm" >
        <!--<el-form-item label="展区">
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
        </el-form-item>-->
        <el-form-item label="时间间隔">
          <el-radio-group   v-model="historyAlarm.interval" value-key="id" >
            <el-radio-button label="1" >分钟</el-radio-button>
            <el-radio-button label="2" >小时</el-radio-button>
            <el-radio-button label="3" >天</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="截取时间">
          <!--<el-date-picker  v-model="historyQuerybyTable.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>-->
          <el-date-picker v-model="historyAlarm.startTime"  type="datetime" placeholder="开始日期" :picker-options="pickerOptions0" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-date-picker v-model="historyAlarm.endTime" type="datetime" placeholder="结束日期" :picker-options="pickerOptions1" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
        </el-main>
      </el-container>
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
            interval:'2',
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

          defaultProps: {
            children: 'children',
            label: 'label'
          },

          props: {
            label: "name",//这里是树结构中需显示的数据（即接口返回的需展示在页面上的参数）
            children: [],
            isLeaf: (data, node) => {
              if (node.level === 4) {
                // 第四层没有下一级节点
                return true
              }
            }

          },

          rangeDay:30,
          pickerOptions0: {
            // disabledDate: (time) => {
            //   if (this.historyQuerybyChart.endTime != "") {
            //     let endDate = new Date(this.historyQuerybyChart.endTime).getTime();
            //     let  range = this.rangeDay * 24 * 3600 * 1000;
            //     let dateRegionMin = endDate - range;
            //     return  time.getTime() > endDate ||  time.getTime() < dateRegionMin;
            //   }
            // },
            step: '00:15',

          },
          pickerOptions1: {
            // disabledDate: (time) => {
            //   if (this.historyQuerybyChart.startTime != "") {
            //     let stratDate = new Date(this.historyQuerybyChart.startTime).getTime();
            //     let range = this.rangeDay * 24 * 3600 * 1000;
            //     let dateRegionMax = stratDate + range;
            //     return  time.getTime() < stratDate  ||  time.getTime() > dateRegionMax;
            //
            //   }
            // }
            step: '01:00',
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


        loadNode (node, resolve) {
          if (node.level === 0) {
            this.getOneData(resolve)
          }else if (node.level === 1) {
            this.getTwoData(node, resolve)
          }else if (node.level === 2) {
            this.getThreeData(node, resolve)
          }else if (node.level === 3) {
            this.getFourData(node, resolve)
          }else{
            resolve([]);
          }
        },

        handleNodeClick(data){
          //console.log( data);
        },

        getOneData(resolve){
          let _this = this;
          _this.axios({
            method: 'get',
            url: window.config.url + "/stage/device/getExhibitionAreaDropDownList",
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            //console.log(res);
            //_this.treeData = res.data.data;
            //_this.exhibitionAreaList = res.data.data;
            resolve(res.data.data);
          }).catch(function (error) {
            console.log(error);
          });

        },
        getTwoData(node,resolve){
          let  _this = this;
          _this.axios({
            method: 'get',
            url:window.config.url + "/stage/device/getLineGroupDropDownList",
            params:{exhibitionAreaId:node.data.id},
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            //console.log(res);
            resolve(res.data.data);
          }).catch(function (error) {
            console.log(error);
          });

        },
        getThreeData(node,resolve){
          let  _this = this;
          this.axios({
            method: 'get',
            url: window.config.url + "/stage/device/getConcentratorDropDownList",
            params: {lineGroupId: node.data.id},
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            //console.log(res);
            resolve(res.data.data)
          }).catch(function (error) {
            console.log(error);
          });
        },
        getFourData(node,resolve){
          let  _this = this;
          this.axios({
            method: 'get',
            url: window.config.url + "/stage/device/getCollectorDropDownList",
            params: {concentratorId: node.data.id},
            headers: {"token": localStorage.getItem("token")}
          }).then(function (res) {
            //console.log(res);
            resolve(res.data.data)
          }).catch(function (error) {
            console.log(error);
          });
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
            this.rangeDay = 15;
          }
          if (val == 2) {
            this.rangeDay = 60;
          }
          if (val == 3) {
            this.rangeDay = 24*60;
          }
          //console.log(this.rangeDay);
          this.historyQuerybyChart.startTime = '';
          this.historyQuerybyChart.endTime = '';
        },


        queryTable() {
          let _this = this;
          //console.log(this.$refs.treeHistoryQuerybyTable.getCheckedNodes());



          var queryTableData = {
            //exhibitionAreaId: _this.historyQuerybyTable.exhibitionAreaId,
            //lineGroupId: _this.historyQuerybyTable.lineGroupId,
            start: _this.historyQuerybyTable.startTime,
            end: _this.historyQuerybyTable.endTime,
            queryAlarm: _this.historyQuerybyTable.alarm,
            unit:_this.historyQuerybyTable.interval,
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
          // queryTableData.concentratorId = _this.historyQuerybyTable.concentratorId;
          // queryTableData.collectorId = _this.historyQuerybyTable.collectorId;

          var treeArr = this.$refs.treeHistoryQuerybyTable.getCheckedNodes();
          var exhibitionAreaArr=[],lineGroupArr=[],concentratorArr=[],collectorArr =[];
          treeArr.map(item => {
            if(item.concentratorId){
              collectorArr.push(item.id)
            }else if(item.lineGroupId){
              concentratorArr.push(item.id)
            }else if(item.exhibitionAreaId){
              lineGroupArr.push(item.id)
            }else{
              exhibitionAreaArr.push(item.id)
            }
          })
          queryTableData.exhibitionAreaId = exhibitionAreaArr;
          queryTableData.lineGroupId = lineGroupArr;
          queryTableData.concentratorId = concentratorArr;
          queryTableData.collectorId = collectorArr;

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
            // exhibitionAreaId: _this.historyAlarm.exhibitionAreaId,
            // lineGroupId: _this.historyAlarm.lineGroupId,
            start: _this.historyAlarm.startTime,
            end: _this.historyAlarm.endTime,
            queryAlarm: _this.historyAlarm.alarm,
            unit:_this.historyAlarm.interval,
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
          // queryAlarmTableData.concentratorId = _this.historyAlarm.concentratorId;
          // queryAlarmTableData.collectorId = _this.historyAlarm.collectorId;
          // var myCollector = this.collectorList.find(x => x.id == _this.collectorId);
          // var myConcentrator = this.concentratorList.find(x => x.id == _this.concentratorId);
          // var myLineGroup = this.lineGroupList.find(x => x.id == _this.lineGroupId);
          // var myExhibitionArea= this.exhibitionAreaList.find(x => x.id == _this.exhibitionAreaId);

          var treeArr = this.$refs.treeHistoryAlarm.getCheckedNodes();
          var exhibitionAreaArr=[],lineGroupArr=[],concentratorArr=[],collectorArr =[];
          treeArr.map(item => {
            if(item.concentratorId){
              collectorArr.push(item.id)
            }else if(item.lineGroupId){
              concentratorArr.push(item.id)
            }else if(item.exhibitionAreaId){
              lineGroupArr.push(item.id)
            }else{
              exhibitionAreaArr.push(item.id)
            }
          })
          queryAlarmTableData.exhibitionAreaId = exhibitionAreaArr;
          queryAlarmTableData.lineGroupId = lineGroupArr;
          queryAlarmTableData.concentratorId = concentratorArr;
          queryAlarmTableData.collectorId = collectorArr;

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

          var treeArr = this.$refs.treeHistoryQuerybyTable.getCheckedNodes();
          var exhibitionAreaArr=[],lineGroupArr=[],concentratorArr=[],collectorArr =[];
          treeArr.map(item => {
            if(item.concentratorId){
              collectorArr.push(item.id)
            }else if(item.lineGroupId){
              concentratorArr.push(item.id)
            }else if(item.exhibitionAreaId){
              lineGroupArr.push(item.id)
            }else{
              exhibitionAreaArr.push(item.id)
            }
          })


          var queryTableData = {
            //exhibitionAreaId: _this.historyQuerybyTable.exhibitionAreaId,
            //concentratorId: _this.historyQuerybyTable.concentratorId,
            // lineGroupId: _this.historyQuerybyTable.lineGroupId,
            //collectorId: _this.historyQuerybyTable.collectorId,
            start: _this.historyQuerybyTable.startTime,
            end: _this.historyQuerybyTable.endTime,
            unit:_this.historyQuerybyTable.interval,
            queryAlarm: _this.historyQuerybyTable.alarm,
          };

          queryTableData.collectorId = collectorArr;
          //console.log(queryTableData);
          for (var i in queryTableData) {
            if (queryTableData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              break;
            }
          };
          //queryTableData.lineGroupId = _this.historyQuerybyTable.lineGroupId;
          //queryTableData.concentratorId = _this.historyQuerybyTable.concentratorId;

          queryTableData.exhibitionAreaId = exhibitionAreaArr;
          queryTableData.lineGroupId = lineGroupArr;
          queryTableData.concentratorId = concentratorArr;



          _this.axios({
            headers: {"token": localStorage.getItem("token")},
            method: 'post',
            url: window.config.url + "/stage/excel/exportCollectorExcel",
            data: queryTableData,
            responseType: 'blob',
          }).then((res) => {
            console.log(res.data);
              if(res.data.type == "application/json"){
                _this.$message({
                  message: "采集器Id不能为空",
                  type: 'warning'
                });
              }else if(res.data.type == "application/force-download"){
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
              }


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

        getTimePotArr(){
          var unitTime =0;
          var startTime=this.historyQuerybyChart.startTime.split(/[- : \/]/);
          var endTime=this.historyQuerybyChart.endTime.split(/[- : \/]/);

           if(this.historyQuerybyChart.interval == "1"){
             unitTime = 15 * 60 * 1000;
             if(startTime[4] >= 0 && startTime[4]< 15){
               startTime[4]= "00"
             }else if(startTime[4] >= 15 && startTime[4]< 30){
               startTime[4]= "15"
             }else if(startTime[4] >= 30 && startTime[4]< 45){
               startTime[4]= "30"
             }else if(startTime[4] >= 45 && startTime[4]< 59){
               startTime[4]= "45"
             }
           }else if(this.historyQuerybyChart.interval == "2" ){
             unitTime = 60 * 60 * 1000;
             startTime[4] = "00";
           }else if(this.historyQuerybyChart.interval == "3"){
             unitTime = 24 * 60 * 60 * 1000;

             startTime[4] = "00";
             startTime[3] = "00";
           }
           //console.log(startTime);
          var startDate = Date.parse(new Date(startTime[0], startTime[1]-1, startTime[2], startTime[3], startTime[4], startTime[5]));
          var endDate = Date.parse(new Date(endTime[0], endTime[1]-1, endTime[2], endTime[3], endTime[4], endTime[5]));
          //console.log(startDate);
          //console.log(endDate);

          var timePotArr=[];
          for(let  timePot = startDate; timePot <= endDate; timePot = timePot + unitTime){
            timePotArr.push(this.datetimeFormat(timePot));
          }
          //console.log(timePotArr);
          return timePotArr;
        },


        /*请求历史曲线数据*/
        queryChart() {

          let _this = this;

          let queryChartData = {
            // exhibitionAreaId: _this.historyQuerybyChart.exhibitionAreaId,
            // lineGroupId: _this.historyQuerybyChart.lineGroupId,
            // concentratorId: _this.historyQuerybyChart.concentratorId,
            // collectorId: _this.historyQuerybyChart.collectorId,
            unit: _this.historyQuerybyChart.interval,
            start: _this.historyQuerybyChart.startTime,
            end: _this.historyQuerybyChart.endTime,

          };
          //console.log(queryChartData);
          for (var i in queryChartData) {
            if (queryChartData[i] === '') {
              _this.$message({
                message: "请填写完整筛选菜单",
                type: 'warning'
              });
              return false;
            }
          };

          var treeArr = this.$refs.treeHistoryQuerybyChart.getCheckedNodes();
          var exhibitionAreaArr=[],lineGroupArr=[],concentratorArr=[],collectorArr =[];
          treeArr.map(item => {
            if(item.concentratorId){
              collectorArr.push(item.id)
            }else if(item.lineGroupId){
              concentratorArr.push(item.id)
            }else if(item.exhibitionAreaId){
              lineGroupArr.push(item.id)
            }else{
              exhibitionAreaArr.push(item.id)
            }
          })
          queryChartData.exhibitionAreaId = exhibitionAreaArr;
          queryChartData.lineGroupId = lineGroupArr;
          queryChartData.concentratorId = concentratorArr;
          queryChartData.collectorId = collectorArr;


          _this.axios({
            method: 'post',
            url: window.config.url + "/stage/data/getCollectorRecordDto",
            data: queryChartData,
            headers: {"token": localStorage.getItem("token")}
          }).then((res) => {
            //console.log(res);
            if (res.data.code == 200) {
              //console.log(res);

              var chartData = res.data.data;
              //console.log("chartData");
              //console.log(chartData);

              var lengthArr=[], maxLength = chartData[0].collectorList.length, maxLengthIndex=0,maxLengthArr=[], num = 0, num2 = 0;

              //console.log(maxLengthIndex)(
              var recordingTimeaArr =[]
              recordingTimeaArr= this.getTimePotArr();
              //console.log(recordingTimeaArr)
              for(let i=0; i < chartData.length; i++){
                maxLengthArr.push({
                  collectorList:[]
                })
                for(let j=0; j < recordingTimeaArr.length; j++){
                  maxLengthArr[i].collectorList.push({
                    name:"",
                    temperature:"",
                    humidity:"",
                    recordingTime:recordingTimeaArr[j],
                    type:"",
                  })
                  num2++
                }
              }
              console.log(maxLengthArr)
              for(let i=0; i < chartData.length; i++){
                for(let j=0; j < chartData[i].collectorList.length; j++){

                  for(let s=0; s < maxLengthArr[i].collectorList.length; s++){
                    maxLengthArr[i].collectorList[s].name = chartData[i].collectorList[0].name;
                    maxLengthArr[i].collectorList[s].type = chartData[i].collectorList[0].type;
                    if(maxLengthArr[i].collectorList[s].recordingTime == chartData[i].collectorList[j].recordingTime){
                      maxLengthArr[i].collectorList[s].temperature = chartData[i].collectorList[j].temperature;
                      maxLengthArr[i].collectorList[s].humidity = chartData[i].collectorList[j].humidity;
                    }
                  }
                }
                chartData[i].collectorList = maxLengthArr[i].collectorList;
              }
              //console.log(maxLengthArr)





              _this.inithistoryQuerybyChart(chartData);

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
          //console.log(json)
          var arr = [] , recordingTimeArr =  [] , num = 0 ,Arr = [],seriesArr = [],collectorArr = [], num2=0;
          json.forEach((value, index) => {
            collectorArr.push(value.collectorList[0].name)
          })
          //console.log(collectorArr);
          for(let i=0;i<json.length;i++){
            arr.push({
              arr1:[],
              arr2:[]
            })
            for(let j=0;j<json[i].collectorList.length;j++){
              arr[i].arr1.push({
                name: json[i].collectorList[j].name,
                humidity: json[i].collectorList[j].humidity,
                recordingTime: json[i].collectorList[j].recordingTime,
                //type: json[i].collectorList[j].type,

              })
              arr[i].arr2.push({
                name: json[i].collectorList[j].name,
                temperature: json[i].collectorList[j].temperature,
                recordingTime: json[i].collectorList[j].recordingTime,
                //type: json[i].collectorList[j].type,
              })
            }
            num ++
          }
          let that = this
          var time2 = setInterval(function(){
            if(num == json.length){
              for(let i=0;i<arr[0].arr1.length;i++){
                recordingTimeArr.push(arr[0].arr1[i].recordingTime)
              }
              console.log(recordingTimeArr)
              for(let i=0;i<arr.length;i++){
                Arr.push({
                  arr1:{
                    name:arr[i].arr1[0].name,
                    type:'line',
                    data:[],

                  },
                  arr2:{
                    name:arr[i].arr2[0].name,
                    type:'line',
                    data:[],
                    xAxisIndex: 1,
                    yAxisIndex: 1
                  }
                })
                for(let j=0;j<arr[i].arr1.length;j++){
                  Arr[i].arr1.data.push(
                    arr[i].arr1[j].humidity
                  )
                }
                for(let j=0;j<arr[i].arr2.length;j++){
                  Arr[i].arr2.data.push(
                    arr[i].arr2[j].temperature
                  )
                }
              }
              for (let t = 0; t < Arr.length; t++) {
                seriesArr.push(Arr[t].arr1);
                seriesArr.push(Arr[t].arr2);
                num2++
              }
              console.log(seriesArr)
              clearInterval(time2)
            }
          })

          var time3 = setInterval(function(){
            if(num2 == Arr.length){
              let myChart = that.$echarts.init(that.$refs.chart);
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
                legend: {
                  data:collectorArr
                },
                grid: [{
                  top:'15%',
                  left: 50,
                  right: 10,
                  height: '30%'
                }, {
                  left: 50,
                  right: 10,
                  top: '55%',
                  height: '30%'
                }],
                xAxis: [
                  {
                    type: 'category',
                    data: recordingTimeArr,
                    axisPointer: { type: 'shadow'},
                    axisLabel: {
                      interval: 3,
                      formatter: function (value) {
                        return value.split(" ").join("\n");
                      }
                    }
                  },
                  {
                    gridIndex: 1,
                    type: 'category',
                    data: recordingTimeArr,
                    axisPointer: { type: 'shadow'},
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
                    min: "dataMin",
                    max: "dataMax",
                    axisLabel: {
                      formatter: '{value} %'
                    }
                  },
                  {
                    gridIndex: 1,
                    type: 'value',
                    name: '温度',
                    min: "dataMin",
                    max: "dataMax",
                    axisLabel: {
                      formatter: '{value} °C'
                    }
                  }
                ],
                dataZoom: [
                  {
                    show: true,
                    xAxisIndex: [0, 1],
                  },
                  {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                  },
                ],
                series:seriesArr

              });
              clearInterval(time3)

            }
          })


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
