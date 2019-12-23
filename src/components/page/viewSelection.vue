
<template>

 <div>
   <el-row :gutter="20">
     <el-col :span="12">
       展区分组
       <el-divider></el-divider>
       <div style="float: left;width: 160px;height: 100%;">
       <el-button style="margin: 10px;" type="primary" icon="el-icon-plus" size="small" @click=" addAreaFlag = true">添加展区</el-button>
       <el-tabs v-model="activeName" :tab-position="tabPosition"  @tab-click="handleClick" style="height: 100%;" >
         <el-tab-pane v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :name="item.id"></el-tab-pane>
         <!--<el-tab-pane key="add" name="add" ><span slot="label" style="padding: 8px;font-size:12px;"> <i class="el-icon-plus"></i>添加展区</span></el-tab-pane>-->
       </el-tabs>
       </div>

       <div style="float: left; width:calc(100% - 160px)">
         <el-button style="margin: 10px;" type="primary" icon="el-icon-plus" size="small"  @click=" addGroupFlag = true ">添加分组</el-button>
         <el-table :data="lineGroupList">
           <el-table-column property="name" label="分组名称" width="150" ></el-table-column>
           <el-table-column property="" label="操作" >
             <template slot-scope="scope" style="white-space:nowrap;">
               <el-button type="primary" icon="el-icon-edit-outline" size="mini" @click="editGroupBox(scope.row)">修改分组</el-button>
    <!--           <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGroup(scope.row)">删除分组</el-button>-->
             </template>
           </el-table-column>
         </el-table>

       </div>
     </el-col>
     <el-col :span="12">
       采集器布局
       <el-divider></el-divider>
       <el-upload class="avatar-uploader" action="https://upload-z2.qiniup.com" :data="qiniuData" :file-list="fileList" list-type="picture"
          :on-preview="handlePreview" :on-remove="handleRemove" >
         <img v-show="img1" :src="preImg + img1" height="160" class="avatar">
         <el-button size="small" type="primary"><i v-show="!img1" class="el-icon-plus avatar-uploader-icon"></i>上传布局图</el-button>
       </el-upload>
     </el-col>
     </el-row>


   <el-dialog title="添加展区" :visible.sync="addAreaFlag" width="40%" :before-close="handleClose(addAreaFlag)">
     <el-form ref="form"  label-width="120px" >
       <el-form-item label="展区名称">
         <el-input v-model="addExhibitionArea.name"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="addArea()">添 加</el-button>
                <el-button type="primary" @click="addAreaFlag = false">取 消</el-button>
              </span>
   </el-dialog>

   <el-dialog title="添加分组" :visible.sync="addGroupFlag" width="40%" :before-close="handleClose(addGroupFlag)">
     <el-form ref="form"  label-width="120px" >
       <el-form-item label="选择展区">
         <el-select v-model="addLineGroup.id" value-key="value" >
           <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id">
           </el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="分组名称">
         <el-input v-model="addLineGroup.name"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="addGroup()">添 加</el-button>
                <el-button type="primary" @click="addGroupFlag = false">取 消</el-button>
              </span>
   </el-dialog>

   <el-dialog title="修改分组" :visible.sync="editGroupFlag" width="40%" :before-close="handleClose(editGroupFlag)">
     <el-form ref="form"  label-width="120px" >
       <el-form-item label="选择展区">
         <el-select v-model="editLineGroup.exhibitionAreaId" value-key="value" >
           <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id">
           </el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="分组名称">
         <el-input v-model="editLineGroup.name"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="editGroup()">修 改</el-button>
        <el-button type="primary" @click="editGroupFlag = false">取 消</el-button>
      </span>
   </el-dialog>
 </div>

</template>

<script>


  export default {
    name: 'viewSelection',
    props: {
      imgUrl: {
        type: String,
        default() {
          return ''
        }
      }
    },
    data() {
      return {
        tabType: 0,
        tabPosition: 'left',
        activeName: '工美区',

        areaName:"",
        tabAreaId:"",
        groupName:"",

        addExhibitionArea:{
          name:"",
        },

        addLineGroup:{
          id:"",
          name:"",
        },

        editExhibitionArea:{
          name:"",
          id:'',
        },
        editLineGroup:{
          id:"",
          name:"",
          exhibitionArea:"",
        },

        addAreaFlag:false,
        addGroupFlag:false,
        editGroupFlag:false,

        exhibitionAreaList:[],
        lineGroupList:[],

        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],

        preImg:'http://image.sdam.weixun6.com/',
        qiniuData: {
          token: ""
        },
        img1:'',
      }
    },
    created() {


    },
    mounted(){
      this.getExhibitionAreaList();
      //this.handleClick(0);
      //console.log(this.exhibitionAreaList[0].name);
      //this.activeName = this.exhibitionAreaList[0].name;
      this.img1 = this.imgUrl;
      // this.$http('/api/file/getAccessToken', {}, 'get', (res) => {
      //   this.qiniuData.token = res.data.data
      // })

    },
    methods: {

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },

      putb64(picBase) {
        /*picUrl用来存储返回来的url*/
        var token = this.qiniuData.token;
        //console.log(token);
        var picUrl;
        /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
        picBase = picBase.substring(23);

        /*通过base64编码字符流计算文件流大小函数*/
        function fileSize(str) {
          var fileSize;
          if (str.indexOf('=') > 0) {
            var indexOf = str.indexOf('=');
            str = str.substring(0, indexOf);//把末尾的’=‘号去掉
          }
          fileSize = parseInt(str.length - (str.length / 8) * 2);
          return fileSize;
        }

        /*把字符串转换成json*/
        function strToJson(str)
        {
          var json = eval('(' + str + ')');
          return json;
        }

        var url = "https://upload-z2.qiniup.com/putb64/" + fileSize(picBase);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            var keyText = xhr.responseText;
            /*返回的key是字符串，需要装换成json*/
            keyText=strToJson(keyText);

            picUrl = "http://image.sdam.weixun6.com/" + keyText.key;

            //localStorage.cutOutUrl = picUrl;
            console.log(picUrl);

          }
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");

        xhr.setRequestHeader("Authorization", "UpToken " + token);
        xhr.send(picBase);
      },

      //关闭按钮
      handleClose(flag) {
        if(flag == 'addAreaFlag'){
          this.addAreaFlag = false;
        }
        if(flag == 'addGroupFlag'){
          this.addGroupFlag = false;
        }

      },

      getExhibitionAreaList(){
        let _this = this;

        _this.axios({
          method: 'get',
          url: window.config.url + "/stage/device/getExhibitionAreaDropDownList",
          headers: {"token": localStorage.getItem("token")}
        }).then(function (res) {
          //console.log(res);
          _this.exhibitionAreaList = res.data.data;
          _this.activeName = _this.exhibitionAreaList[0].name;
        }).catch(function (error) {
          console.log(error);
        });

      },
      getLineGroupList(id){
        let _this = this;
        _this.axios({
          method: 'get',
          url:window.config.url + "/stage/device/getLineGroupDropDownList",
          params:{exhibitionAreaId:id},
          headers:{ "token":localStorage.getItem("token") }
        }).then((res)=>{
          //console.log(res);
          _this.lineGroupList = res.data.data;
        }).catch(function (error) {
          console.log(error);
        });

      },
      handleClick(tab) {
        let  _this = this;
        _this.tabAreaId = _this.exhibitionAreaList[tab.index].id;
        _this.getLineGroupList(_this.tabAreaId);

      },


      addArea(){
        let _this = this;

        _this.axios({
          method: 'post',
          url:window.config.url + "/stage/exhibitionArea/addExhibitionArea",
          data:{name:this.addExhibitionArea.name},
          headers:{ "token":localStorage.getItem("token") }
        }).then((res)=>{
          console.log(res);
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
      addGroup(){
        let _this = this;

        _this.axios({
          method: 'post',
          url:window.config.url + "/stage/exhibitionArea/addLineGroup",
          data:{
            name:_this.addLineGroup.name,
            exhibitionAreaId:_this.addLineGroup.id
          },
          headers:{ "token":localStorage.getItem("token") }
        }).then((res)=>{
          //console.log(res);
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
      editGroupBox(row){
        console.log(row);
        this.editGroupFlag=true;
        this.editLineGroup.exhibitionAreaId=row.exhibitionAreaId;
        this.editLineGroup.name=row.name;
        this.editLineGroup.id=row.id;
      },
      editGroup(){
        _this.axios({
          method: 'post',
          url:window.config.url + "/stage/exhibitionArea/updateLineGroup",
          data:{
            name:_this.addExhibitionArea.name,
            exhibitionAreaId:_this.editLineGroup.id,
            id:this.addExhibitionArea.id,
          },
          headers:{ "token":localStorage.getItem("token") }
        }).then((res)=>{
          console.log(res);
          if(res.data.code == 200){
            _this.$message({
              message: "添加成功",
              type: 'success'
            });

            this.editGroupFlag=false;
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

      // delGroupBox(row){
      //   let _this = this;
      //   //console.log(row.id);
      //   _this.$confirm('此操作将永久删除该分组以及其下的线路、采集器, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     _this.axios({
      //       method: 'get',
      //       url:window.config.url + "/stage/device/deleteConcentrator",
      //       params:{id:row.id},
      //       headers: {"token": localStorage.getItem("token")}
      //     }).then(function(res){
      //       if(res.data.code == 200){
      //         _this.$message({
      //           message: "删除成功成功",
      //           type: 'success'
      //         });
      //         _this.getLineList();
      //       }else{
      //         _this.$message({
      //           message: res.data.msg,
      //           type: 'warning'
      //         });
      //       }
      //     }).catch(function (error) {
      //       console.log(error);
      //     });
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     });
      //   });
      // },

    },
    watch:{
      imgUrl(){
        this.img1 = this.imgUrl
      }

    }
  };

  // <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
</script>

<style scoped>

</style>
