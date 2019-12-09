
<template>

  <div v-show="tabType == 0">
    <el-container>

      <el-aside width="240px" height="100% " style=" border: 1px solid #eee; padding: 10px; ">

        <el-button type="primary" icon="el-icon-plus" size="mini" @click=" addAreaFlag = true">添加展区</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small"  @click=" addGroupFlag = true ">添加分组</el-button>
        <!--:props="name" :load="loadNode" :data="exhibitionAreaList" -->
        <el-tree :props="props" :load="loadNode"  node-key="id" ref="tree" highlight-current lazy  @node-click="handleNodeClick" :render-content="renderContent"></el-tree>
        <!--            <el-collapse style="margin-top: 10px" @change="collapseChange">-->
        <!--              <el-collapse-item v-for="(item,key) in treeData" :key="key" :title="item.name" :name="item.id">-->
        <!--              </el-collapse-item>-->
        <!--        </el-collapse>-->
        <!--添加展区-->
        <el-dialog title="添加展区" :visible.sync="addAreaFlag" width="40%" :before-close="handleClose(addAreaFlag)">
          <el-form ref="form"  label-width="120px" >
            <el-form-item label="展区名称">
              <el-input v-model="areaName"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="addArea()">添 加</el-button>
                <el-button type="primary" @click="addAreaFlag = false">取 消</el-button>
              </span>
        </el-dialog>
        <!--添加分组-->
        <el-dialog title="添加分组" :visible.sync="addGroupFlag" width="40%" :before-close="handleClose(addGroupFlag)">
          <el-form ref="form"  label-width="120px" >
            <el-form-item label="选择展区">
              <el-select v-model="groupAreaId" value-key="value" >
                <el-option v-for="item in exhibitionAreaList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分组名称">
              <el-input v-model="groupName"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="addGroup()">添 加</el-button>
                <el-button type="primary" @click="addGroupFlag = false">取 消</el-button>
              </span>
        </el-dialog>

      </el-aside>
      <el-main>

      </el-main>
    </el-container>



  </div>



</template>

<script>


  export default {
    name: 'areaview2',
    data() {
      return {
        tabType: 0,


        defaultProps: {
          children: 'children',
          label: 'label'
        },
        areaName:"",
        groupAreaId:"",
        groupName:"",
        addAreaFlag:false,
        addGroupFlag:false,
        exhibitionAreaList:[],
        lineGroupList:[],
        treeData:[],
        props: {
          label: "name",//这里是树结构中需显示的数据（即接口返回的需展示在页面上的参数）
          children: [],
          isLeaf: (data, node) => {
            if (node.level === 3) {
              // 第三层没有下一级节点
              return true
            }
          }

        }
      }
    },
    mounted(){

    },
    methods: {
      //关闭按钮
      handleClose(flag) {
        if(flag == 'addAreaFlag'){
          this.addAreaFlag = false;
        }
        if(flag == 'addGroupFlag'){
          this.addGroupFlag = false;
        }

      },
      //点击选项卡
      handleClick(tab, e) {
        this.tabType = tab.index;
        var _val = tab.index;
      },
      getTreeData(resolve){
        let _this = this;

        _this.axios({
          method: 'get',
          url: window.config.url + "/stage/device/getExhibitionAreaDropDownList",
          headers: {"token": localStorage.getItem("token")}
        }).then(function (res) {
          //console.log(res);
          //_this.treeData = res.data.data;
          _this.exhibitionAreaList = res.data.data;
          resolve(res.data.data);
        }).catch(function (error) {
          console.log(error);
        });

      },

      loadNode (node, resolve) {
        // console.log(node, resolve)
        // 一级节点处理
        if (node.level === 0) {
          this.getTreeData(resolve)
        }
        // 其余节点处理
        if (node.level >= 1) {
          // 注意！把resolve传到你自己的异步中去
          this.getClickchild(node, resolve)
        }
      },
      handleNodeClick(data, node, obj){
        // console.log( data);
        // console.log( node);
        // console.log( obj);
      },

      getClickchild(node,resolve){
        console.log(node)
        let  _this = this;
        _this.axios({
          method: 'get',
          url:window.config.url + "/stage/device/getLineGroupDropDownList",
          params:{exhibitionAreaId:node.id},
          headers:{ "token":localStorage.getItem("token") }
        }).then((res)=>{
          //console.log(res);
          resolve(res.data.data);
        }).catch(function (error) {
          console.log(error);
        });

      },



      addArea(){
        let _this = this;

        _this.axios({
          method: 'post',
          url:window.config.url + "/stage/exhibitionArea/addExhibitionArea",
          data:{name:this.areaName},
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
          data:{name:_this.groupName,
            exhibitionAreaId:_this.groupAreaId},
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

      append(data) {

      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
          <span>{node.label}</span>
          </span>
          <span>
          <el-button style="font-size: 12px;" icon="el-icon-circle-plus-outline" type="text" on-click={ () => this.append(data) } ></el-button>
        <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
        </span>
        </span>);
      }

    }
  };

  // <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
</script>

<style scoped>
  .box-card {
    width: 400px;
    float: left;
    margin-bottom: 20px;
    margin-right:20px ;

  }
</style>
