<template>
  <div class="lineMaçnagement">
    <el-row>
      <el-button type="primary" icon="el-icon-plus"  class="handle-del mr10" @click=" addLineBox() ">新增线路</el-button>
    </el-row>
    <br />
    <el-row>
      <el-table :data="lineList" width="100%">
        <el-table-column prop="name" label="线路名" ></el-table-column>
        <el-table-column prop="operation" label="操作" >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit-outline" size="mini" @click="editLineBox(scope.row)">修改线路</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delLine(scope.row)">删除线路</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="operation" label="采集器" >
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-set-up" size="mini" @click="handleCollectorDrawer(scope.row)">线路配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>


    <!--新增线路-->
    <el-dialog title="新增线路" :visible.sync="addLineFlag" width="50%" :before-close="addLineBoxClose">

      <el-form ref="form" :model="addLineInfo"   label-width="120px" >
        <el-form-item label="选择展区">
          <el-select v-model="addLineInfo.exhibitionAreaId" @change="((val)=>{getLineGroupList(val)})" value-key="value" style="width: 100%" >
            <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择分组">
          <el-select v-model="addLineInfo.lineGroupId" value-key="value" style="width: 100%"  >
            <el-option v-for="item in lineGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路名称">
          <el-input v-model="addLineInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addLineInfo.sort"></el-input>
        </el-form-item>
        <el-form-item label="mac地址">
          <el-input v-model="addLineInfo.mac"></el-input>
        </el-form-item>
        <el-form-item label="ip地址">
          <el-input v-model="addLineInfo.ip"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="addLine()">保 存</el-button>
          <el-button type="primary" @click="addLineBoxClose">取 消</el-button>
        </span>
    </el-dialog>

    <!--编辑线路-->
    <el-dialog title="编辑线路" :visible.sync="editLineFlag" width="60%" :before-close="handleClose(editLineFlag)">

      <el-form ref="form" :model="editLineInfo"   label-width="120px" >
        <el-form-item label="所属展区">
          <el-select v-model="editLineInfo.exhibitionAreaId" @change="((val)=>{getLineGroupList(val)})" value-key="value" style="width: 100%" >
            <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组">
          <el-select v-model="editLineInfo.lineGroupId" value-key="value" style="width: 100%"  >
            <el-option v-for="item in lineGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路名称">
          <el-input v-model="editLineInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="editLineInfo.sort"></el-input>
        </el-form-item>
        <el-form-item label="mac地址">
          <el-input v-model="editLineInfo.mac"></el-input>
        </el-form-item>
        <el-form-item label="ip地址">
          <el-input v-model="editLineInfo.ip"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="editLine()">保 存</el-button>
          <el-button type="primary" @click="editLineFlag = false">取 消</el-button>
        </span>
    </el-dialog>

    <!--配置采集器抽屉-->
    <el-drawer title="配置采集器" :visible.sync="collectorDrawerFlag" direction="rtl" size="60%">
      <el-divider></el-divider>
      <el-main>
      <el-row>
        <span>线路名：{{collectorDrawerTitle}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click=" addCollectorFlag = true ">新增采集器</el-button>
      </el-row>
        <br/>
      <el-table :data="collectorList">
        <el-table-column property="name" label="采集器名称" width="180" ></el-table-column>
        <el-table-column property="" label="操作" >
          <template slot-scope="scope" style="white-space:nowrap;">
            <el-button type="primary" icon="el-icon-edit-outline" size="mini" @click="editBasicBox(scope.row)">修改基本配置</el-button>
            <el-button type="primary" icon="el-icon-edit-outline" size="mini" @click="editAlarmBox(scope.row)">修改报警配置</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCollector(scope.row)">删除采集器</el-button>
          </template>
        </el-table-column>
        <el-table-column label="配置"  width="150" property="states">
          <template slot-scope="scope" >
            <el-switch active-text="开启" inactive-text="关闭" :active-value="1" :inactive-value="0" v-model="scope.row.states"   @change="changeStatus($event,scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      </el-main>
    </el-drawer>

    <!--添加采集器-->
    <el-dialog title="添加采集器" :visible.sync="addCollectorFlag" width="60%" :before-close="addCollectorBoxClose" >
      <el-form ref="form" :model="addCollectorInfo" :label-position="labelPosition" label-width="80px" >
        <el-form-item label="基本配置" >
        <el-row >
          <el-col :span="3">名称：</el-col>
          <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.name"></el-input></el-col>
          <el-col :span="3">排序：</el-col>
          <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.sort"></el-input></el-col>
        </el-row>
        <el-row >
          <el-col :span="3">地址：</el-col>
          <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.address"></el-input></el-col>
          <el-col :span="3">编号：</el-col>
          <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.number"></el-input></el-col>
        </el-row>
        <el-row >
          <el-col :span="3">记录间隔：</el-col>
          <el-col :span="9">
            <el-select v-model="addCollectorInfo.recordingType"  style="display: inline-block;width: 200px; ">
              <el-option v-for="item in recordIntervalList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">屏保延时(秒)</el-col>
          <el-col :span="9">
            <el-input class="input" :disabled="screenLong" style="display: inline-block;width: 200px; " v-model="addCollectorInfo.screenTime"></el-input>
            <el-checkbox v-model="screenLong" @change="screenLongClick">常显</el-checkbox>
          </el-col>
        </el-row>
          <el-row>
          <el-col :span="3">采样频率(秒)</el-col>
          <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.samplingFrequency"></el-input></el-col>
            <el-col :span="3">类型：</el-col>
            <el-col :span="9">
              <el-select v-model="addCollectorInfo.type"  style="width: 200px;" >
                <el-option v-for="item in collectorTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">状态：</el-col>
            <el-col :span="9">
              <el-radio-group v-model="addCollectorInfo.states" >
                <el-radio label="1" value="1">开机</el-radio>
                <el-radio label="2" value="2">关机</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="报警配置" >
          <el-row >
            <el-col :span="4">开启蜂鸣器：</el-col>
            <el-col :span="4"><el-switch v-model="addCollectorInfo.openBuzzer" ></el-switch></el-col>
            <el-col :span="4">报警持续时间(秒)</el-col>
            <el-col :span="4"><el-input style="display: inline-block;width: 80px; " v-model="addCollectorInfo.buzzerDuration"></el-input></el-col>
            <el-col :span="4">报警检测时间(分)</el-col>
            <el-col :span="4"><el-input style="display: inline-block;width: 80px; " v-model="addCollectorInfo.buzzerDetectTime"></el-input></el-col>
          </el-row>
          <el-row >
            <el-col :span="4">{{this.addCollectorInfo.type==1?"温度(°C)：":"安全域(ppm)："}}</el-col>
            <el-col :span="6"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.lowerTemperatureLimit" placeholder="下限"></el-input></el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="6"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.upperTemperatureLimit" placeholder="上限"></el-input></el-col>
          </el-row>
          <el-row v-show="this.addCollectorInfo.type == 1">
            <el-col :span="4">湿度(%)：</el-col>
            <el-col :span="6"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.lowerHumidityLimit" placeholder="下限"></el-input></el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="6"><el-input style="display: inline-block;width: 200px; " v-model="addCollectorInfo.upperHumidityLimit" placeholder="上限"></el-input></el-col>
          </el-row>


        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="addCollector()">保 存</el-button>
          <el-button type="primary" @click="addCollectorBoxClose">取 消</el-button>
        </span>
    </el-dialog>

    <!--修改基础配置-->
    <el-dialog title="修改基础配置" :visible.sync="editBasicFlag" width="60%" :before-close="handleClose(editBasicFlag)">
      <el-form ref="form" :model="editBasicInfo"  :label-position="labelPosition" label-width="80px" >
        <el-form-item label="基本配置" >
          <el-row >
            <el-col :span="3">名称：</el-col>
            <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="editBasicInfo.name"></el-input></el-col>
            <el-col :span="3">排序：</el-col>
            <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="editBasicInfo.sort"></el-input></el-col>
          </el-row>
          <el-row >
            <el-col :span="3">地址：</el-col>
            <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="editBasicInfo.address"></el-input></el-col>
            <el-col :span="3">编号：</el-col>
            <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="editBasicInfo.number"></el-input></el-col>
          </el-row>
          <el-row >
            <el-col :span="3">记录间隔：</el-col>
            <el-col :span="9">
              <el-select v-model="editBasicInfo.recordingType"  style="display: inline-block;width: 200px; " >
                <el-option v-for="item in recordIntervalList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3">屏保延时(秒)</el-col>
            <el-col :span="9">
              <el-input :disabled="editScreenLong" style="display: inline-block;width: 200px; " v-model="editBasicInfo.screenTime"></el-input>
              <el-checkbox v-model="editScreenLong" @change="screenLongClick">常显</el-checkbox>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="3">采样频率：</el-col>
            <el-col :span="9"><el-input style="display: inline-block;width: 200px; " v-model="editBasicInfo.samplingFrequency"></el-input></el-col>

            <el-col :span="3">状态：</el-col>
            <el-col :span="9">
              <el-radio-group v-model="editBasicInfo.states">
                <el-radio :label="1" value="1">开机</el-radio>
                <el-radio :label="2" value="2">关机</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="editBasic()">保 存</el-button>
          <el-button type="primary" @click="editBasicFlag = false">取 消</el-button>
        </span>
    </el-dialog>

    <!--修改报警配置-->
    <el-dialog title="修改报警配置" :visible.sync="editAlarmFlag" width="60%" :before-close="handleClose(editAlarmFlag)">
      <el-form ref="form" :model="editAlarmInfo"  :label-position="labelPosition" label-width="80px" >

        <el-form-item label="报警配置" >
          <el-row >
            <el-col :span="3">开启蜂鸣器：</el-col>
            <el-col :span="4"><el-switch v-model="editAlarmInfo.openBuzzer" ></el-switch></el-col>
            <el-col :span="2">持续(秒)</el-col>
            <el-col :span="4"><el-input style="display: inline-block;width: 80px; " v-model="editAlarmInfo.buzzerDuration"></el-input></el-col>
            <el-col :span="2">检测(分)</el-col>
            <el-col :span="4"><el-input style="display: inline-block;width: 80px; " v-model="editAlarmInfo.buzzerDetectTime"></el-input></el-col>
          </el-row>
          <el-row >
            <el-col :span="3">{{this.editAlarmInfo.type == 1?"温度(°C)：":"安全域(ppm)："}}</el-col>
            <el-col :span="7"><el-input style="display: inline-block;width: 200px; " v-model="editAlarmInfo.lowerTemperatureLimit" placeholder="下限"></el-input></el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="7"><el-input style="display: inline-block;width: 200px; " v-model="editAlarmInfo.upperTemperatureLimit" placeholder="上限"></el-input></el-col>
          </el-row>
          <el-row v-show="this.editAlarmInfo.type == 1">
            <el-col :span="3">湿度(%)：</el-col>
            <el-col :span="7"><el-input style="display: inline-block;width: 200px; " v-model="editAlarmInfo.lowerHumidityLimit" placeholder="下限"></el-input></el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="7"><el-input style="display: inline-block;width: 200px; " v-model="editAlarmInfo.upperHumidityLimit" placeholder="上限"></el-input></el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="success" @click="editAlarm()">保 存</el-button>
          <el-button type="primary" @click="editAlarmFlag = false">取 消</el-button>
        </span>
    </el-dialog>


  </div>
</template>

<script>
  import { Loading } from 'element-ui';
  export default {
    name: 'lineMaçnagement',
    data() {
      return {
        screenLong:false,
        editScreenLong:false,
        addLineInfo:{
          exhibitionAreaId:'',
          lineGroupId:'',
          name:'',
          sort:0,
          mac:'',
          ip:''
        },
        editLineInfo:{
          exhibitionAreaId:'',
          lineGroupId:'',
          id:'',
          name:'',
          sort:0,
          mac:'',
          ip:''
        },
        addCollectorInfo:{
          concentratorId:'',
          address:'',
          name:'',
          number:'',
          samplingFrequency:'10',
          screenTime:'60',
          sort:'0',
          states:'1',
          recordingType:'1',
          type:'1',

          openBuzzer:false,
          buzzerDetectTime:'1',
          buzzerDuration:'5',
          lowerHumidityLimit:'',
          lowerTemperatureLimit:'',
          upperHumidityLimit:'',
          upperTemperatureLimit:'',

        },
        editBasicInfo:{
          id:'',
          address:'',
          name:'',
          number:'',
          recordingType:0,
          samplingFrequency:'',
          recordingType:0,
          screenTime:0,
          sort:0,
          states:'',
          type:'',
        },
        editAlarmInfo:{
          id:'',
          openBuzzer:false,
          buzzerDetectTime:'',
          buzzerDuration:'',
          lowerHumidityLimit:'',
          lowerTemperatureLimit:'',
          upperHumidityLimit:'',
          upperTemperatureLimit:'',
          recordingType:'',
          type:'',
        },
        openConcentratorId:'',
        exhibitionAreaList:[],
        lineGroupList:[],
        lineList:[],
        collectorList:[],
        addLineFlag: false,
        editLineFlag: false,
        collectorDrawerFlag:false,
        addCollectorFlag:false,
        editBasicFlag:false,
        editAlarmFlag:false,
        labelPosition:'top',
        collectorDrawerTitle:'',
        recordIntervalList:[
          {  value: '1', label: '10秒' },
          {  value: '2', label: '20秒', },
          {  value: '3', label: '30秒' },
          {  value: '4', label: '1分钟' },
          {  value: '5', label: '5分钟' },
          {  value: '6', label: '10分钟' },
          {  value: '7', label: '15分钟' },
          {  value: '8', label: '30分钟' },
          {  value: '9', label: '1小时' },
        ],

        collectorTypeList:[
          {  value: '1', label: '温湿度' },
          {  value: '2', label: '总有机物' },
          {  value: '3', label: '苯' },
          {  value: '4', label: '氨气' },
          {  value: '5', label: '二氧化硫' },
          {  value: '6', label: '甲醛' },
          {  value: '7', label: 'PM2.5' },
        ],
        num:0,
        setCollectorFlag:false,

      };
    },
    created() {
      this.getLineList();

    },
    methods: {
      screenLongClick(){
        if( this.screenLong == true ){
          this.addCollectorInfo.screenTime = '250';
        }else{
          this.addCollectorInfo.screenTime = '60';
        }
        if( this.editScreenLong == true ){
          this.editBasicInfo.screenTime = '250';
        }else{
          this.editBasicInfo.screenTime = '60';
        }
      },

      handleClose(flag) {
        if(flag == 'addLineFlag'){
          this.addLineFlag = false;
        }
        if(flag == 'editLineFlag'){
          this.editLineFlag = false;
        }
        if(flag == 'addCollectorFlag'){
          this.addCollectorFlag = false;
        }
        if(flag == 'editAlarmFlag'){
          this.editAlarmFlag = false;
        }
        if(flag == 'editBasicFlag'){
          this.editBasicFlag = false;
        }
      },

      getLineList(){
        let _this = this;
        this.axios({
          method: 'get',
          url: window.config.url + "/stage/device/getConcentratorList",
          headers: {
            "token": localStorage.getItem("token")
          }
        }).then(function(res){
          console.log(res);
          _this.lineList = res.data.data;
        }).catch(function (error) {
          console.log(error);
        });
      },
      addLineBox(){
        this.addLineFlag = true;
        this.getExhibitionAreaList();
      },
      getExhibitionAreaList(){
        let _this = this;
        this.axios({
          method: 'get',
          url:window.config.url + "/stage/device/getExhibitionAreaDropDownList",
          headers: {
            "token": localStorage.getItem("token")
          }
      }).then(function(res){
            console.log(res);
            _this.exhibitionAreaList = res.data.data;
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
          headers: {
            "token": localStorage.getItem("token")
          }
        }).then(function(res){
            //console.log(res);
          _this.lineGroupList = res.data.data;
          //console.log(_this.exhibitionAreaList);
          console.log(_this.lineGroupList);
          }).catch(function (error) {
          console.log(error);
        });
      },
      addLine(){
        let _this = this;
        let addLineData = {
          lineGroupId:_this.addLineInfo.lineGroupId,
          ip:_this.addLineInfo.ip,
          mac:_this.addLineInfo.mac,
          name:_this.addLineInfo.name,
          sort:_this.addLineInfo.sort
        };
        _this.axios({
          method: 'post',
          url:window.config.url + "/stage/device/addConcentrator",
          data:addLineData,
          headers: { "token": localStorage.getItem("token") }
        }).then((res)=>{
          if(res.data.code == 200){
            _this.$message({
              message: "添加成功",
              type: 'success'
            });
            this.addLineFlag = false;
            _this.getLineList();
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
      addLineBoxClose(){
        this.addLineFlag = false;
        this.addLineInfo.lineGroupId='';
        this.addLineInfo.ip='';
        this.addLineInfo.mac='';
        this.addLineInfo.name='';
        this.addLineInfo.sort='';
      },

      editLineBox(row){
        //let _this = this;
        //console.log(this.lineList);
        var myeditLine = this.lineList.find(x => x.id == row.id);
        //console.log(myeditLine);
        this.editLineInfo.exhibitionAreaId = myeditLine.exhibitionAreaId,
        this.editLineInfo.lineGroupId = myeditLine.lineGroupId,
        this.editLineInfo.id = myeditLine.id;
        this.editLineInfo.name = myeditLine.name;
        this.editLineInfo.mac = myeditLine.mac;
        this.editLineInfo.ip = myeditLine.ip;
        //this.addLineInfo.sort = editLine.sort;
        //console.log("editLineInfo==");
        //console.log(this.editLineInfo);
        this.editLineFlag =  true;
        this.getExhibitionAreaList();
        this.getLineGroupList(this.editLineInfo.exhibitionAreaId);

      },
      editLine(){
        //this.axios.defaults.headers.common["token"] = localStorage.getItem("token");
        //console.log(this.editLineInfo);
        this.axios({
          method: 'post',
          url:window.config.url + "/stage/device/updateConcentrator",
          data:this.editLineInfo,
          headers: { "token": localStorage.getItem("token") }
        }).then((res)=>{
          if(res.data.code == 200){
            this.$message({
              message: "编辑成功",
              type: 'success'
            });
            this.editLineFlag = false;
            this.getLineList();
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      delLine(row){
        let _this = this;
        //console.log(row.id);
        _this.$confirm('此操作将永久删除该线路以及其下的采集器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.axios({
            method: 'get',
            url:window.config.url + "/stage/device/deleteConcentrator",
            params:{id:row.id},
            headers: {"token": localStorage.getItem("token")}
          }).then(function(res){
              if(res.data.code == 200){
                _this.$message({
                  message: "删除成功",
                  type: 'success'
                });
                _this.getLineList();
              }else{
                _this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            }).catch(function (error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      getCollectorList(id){
        let _this = this;
        _this.axios({
          method: 'get',
          url:window.config.url + "/stage/device/getCollectorList",
          params:{concentratorId: id},
          headers: {"token": localStorage.getItem("token") }
      }).then(function(res){
            //console.log(res);
            _this.collectorList = res.data.data;
            console.log("_this.collectorList")
            console.log(_this.collectorList);
          }).catch(function (error) {
          console.log(error);
        });
      },
      handleCollectorDrawer(row){
        let _this = this;
        _this.collectorDrawerFlag = true;
        var editLine = _this.lineList.find(x => x.id == row.id);
        _this.collectorDrawerTitle = editLine.name;
        _this.openConcentratorId =row.id;
        _this.getCollectorList(_this.openConcentratorId);
        //console.log("openConcentratorId="+_this.openConcentratorId);
      },
      addCollector(){
        let _this = this;
        let addCollectorData = {
          concentratorId:_this.openConcentratorId,
          address:_this.addCollectorInfo.address,
          name:_this.addCollectorInfo.name,
          number:_this.addCollectorInfo.number,
          samplingFrequency:_this.addCollectorInfo.samplingFrequency,
          screenTime:_this.addCollectorInfo.screenTime,
          sort:_this.addCollectorInfo.sort,
          states:_this.addCollectorInfo.states,
          type:_this.addCollectorInfo.type,
          recordingType:_this.addCollectorInfo.recordingType,
          //recordingType:_this.recordIntervalList.value,
          openBuzzer:_this.addCollectorInfo.openBuzzer,
          buzzerDuration:_this.addCollectorInfo.buzzerDuration,
          buzzerDetectTime:_this.addCollectorInfo.buzzerDetectTime,
          lowerHumidityLimit:_this.addCollectorInfo.lowerHumidityLimit,
          lowerTemperatureLimit:_this.addCollectorInfo.lowerTemperatureLimit,
          upperHumidityLimit:_this.addCollectorInfo.upperHumidityLimit,
          upperTemperatureLimit:_this.addCollectorInfo.upperTemperatureLimit,
          concentratorId:_this.openConcentratorId,
        };
        console.log(addCollectorData);
        for (var i in addCollectorData) {
          if( addCollectorData[i] === '') {
            _this.$message({
              message: "请填写完整表单",
              type: 'warning'
            });
            return false;
          }
        };
        _this.axios({
          method: 'post',
          url:window.config.url + "/stage/device/addCollector",
          data:addCollectorData,
          headers: { "token": localStorage.getItem("token") }
        }).then((res)=>{
          if(res.data.code == 200){
            _this.$message({
              message: "添加成功",
              type: 'success'
            });
            this.addCollectorFlag = false;
            _this.getCollectorList(_this.openConcentratorId);
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
      addCollectorBoxClose(){
        this.addCollectorFlag = false;
        this.addCollectorInfo.address="";
        this.addCollectorInfo.name="";
        this.addCollectorInfo.number="";
        this.addCollectorInfo.samplingFrequency="";
        this.addCollectorInfo.screenTime=0;
        this.addCollectorInfo.sort=0;
        this.addCollectorInfo.states=0;
        this.addCollectorInfo.recordInterval="";
        this.addCollectorInfo.openBuzzer=false;
        this.addCollectorInfo.buzzerDuration="";
        this.addCollectorInfo.lowerHumidityLimit="";
        this.addCollectorInfo.lowerTemperatureLimit="";
        this.addCollectorInfo.upperHumidityLimit="";
        this.addCollectorInfo.upperTemperatureLimit="";
      },
      delCollector(row){
        let _this = this;
        //console.log(row.id);
        _this.$confirm('此操作将永久删除该采集器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.axios({
            method:'get',
            url:window.config.url + "/stage/device/deleteCollector",
            params:{id:row.id},
            headers: { "token": localStorage.getItem("token") }
          }).then(function(res){
              if(res.data.code == 200){
                _this.$message({
                  message: "删除成功成功",
                  type: 'success'
                });
                _this.getCollectorList(_this.openConcentratorId);
              }else{
                _this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            }).catch(function (error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      editBasicBox(row){
        //let _this = this;
        var myeditCollector = this.collectorList.find(x => x.id == row.id);
        console.log(myeditCollector.screenTime)
        //this.recordInterval.lable = myeditCollector.recordingType;
        this.editBasicInfo.id = myeditCollector.id;
        this.editBasicInfo.name = myeditCollector.name;
        this.editBasicInfo.address = myeditCollector.address;
        this.editBasicInfo.number = myeditCollector.number;
        this.editBasicInfo.samplingFrequency = myeditCollector.samplingFrequency;
        if(myeditCollector.screenTime == 250){
          this.editScreenLong = true;
          this.editBasicInfo.screenTime = myeditCollector.screenTime;
        }else{
          this.editBasicInfo.screenTime = myeditCollector.screenTime;
        }
        this.editBasicInfo.sort = myeditCollector.sort;
        this.editBasicInfo.states = myeditCollector.states;
        //this.editBasicInfo.recordingType = myeditCollector.recordingType;
        this.recordIntervalList.forEach(v=>{
          if(v.value == myeditCollector.recordingType){
            this.editBasicInfo.recordingType = v.label
          }
        });

        this.editBasicFlag = true;


      },
      editBasic(){
        let loadingInstance = Loading.service({ text:"服务器玩命加载中，请稍后..." ,background:"rgba(0,0,0,0.2)" });
        let _this = this;

        this.recordIntervalList.forEach(v=>{
          if(v.label ==  this.editBasicInfo.recordingType){
            this.editBasicInfo.recordingType = v.value
          }
        })
        console.log(this.editBasicInfo.recordingType);
        console.log(this.editBasicInfo);

        this.axios({
          method: 'post',
          url:window.config.url + "/stage/device/updateBasicConfig",
          data:_this.editBasicInfo,
          headers: { "token": localStorage.getItem("token") }
        }).then((res)=>{
          if(res.data.code == 200){
            this.$message({
              message: "编辑成功",
              type: 'success'
            });
            _this.editBasicFlag = false;
            this.getCollectorList(this.openConcentratorId);
            loadingInstance.close();
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },

      editAlarmBox(row){

        var myeditCollector = this.collectorList.find(x => x.id == row.id);
        console.log(myeditCollector);
        this.editAlarmInfo.id = myeditCollector.id;
        this.editAlarmInfo.openBuzzer = myeditCollector.openBuzzer;
        this.editAlarmInfo.buzzerDetectTime = myeditCollector.buzzerDetectTime;
        this.editAlarmInfo.buzzerDuration = myeditCollector.buzzerDuration;
        this.editAlarmInfo.lowerHumidityLimit = myeditCollector.lowerHumidityLimit;
        this.editAlarmInfo.lowerTemperatureLimit = myeditCollector.lowerTemperatureLimit;
        this.editAlarmInfo.upperHumidityLimit = myeditCollector.upperHumidityLimit;
        this.editAlarmInfo.upperTemperatureLimit = myeditCollector.upperTemperatureLimit;
        this.editAlarmInfo.type = myeditCollector.type;

        this.editAlarmFlag = true;

      },
      editAlarm(){
        let loadingInstance = Loading.service({ text:"服务器玩命加载中，请稍后..." ,background:"rgba(0,0,0,0.2)" });
        let _this = this;
        this.axios({
          method: 'post',
          url:window.config.url + "/stage/device/updateAlarmConfig",
          data:_this.editAlarmInfo,
          headers: { "token": localStorage.getItem("token") }
        }).then((res)=>{
          if(res.data.code == 200){
            this.$message({
              message: "编辑成功",
              type: 'success'
            });
            _this.editAlarmFlag = false;
            this.getCollectorList(this.openConcentratorId);
            loadingInstance.close();
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },

      changeStatus(e, row){
        console.log(e);
        console.log(row.id);
        let _this = this;
        var switchUrl = "";
        if(e == 1){
          switchUrl = window.config.url + "/stage/device/bootCollector"
        }else if(e == 0){
          switchUrl = window.config.url + "/stage/device/shutdownCollector"
        }
        console.log(switchUrl);
        _this.axios({
          method: 'get',
          url:switchUrl,
          params:{id:row.id},
          headers: { "token": localStorage.getItem("token") }
        }).then(function(res){
          console.log(res);
        }).catch(function (error) {
          console.log(error);
        });

      },
    }
  };
</script>

<style scoped>

</style>
