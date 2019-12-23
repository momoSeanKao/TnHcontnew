
<template>

  <div >
    <el-container>

      <el-aside width="300px"  style="border: 1px solid #eee; padding: 10px; ">
        <el-tree :props="props" :load="loadNode"  node-key="id" ref="tree" show-checkbox lazy  @node-click="handleNodeClick" ></el-tree>
      </el-aside>
      <el-main>
        <el-button @click="getCheckedNodes">通过 node 获取</el-button>
        <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      </el-main>
    </el-container>

  </div>



</template>

<script>


  export default {
    name: 'THQueryTest',
    data() {
      return {
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

        }
      }
    },
    mounted(){

    },
    methods: {

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
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
        var treeArr=this.$refs.tree.getCheckedNodes();
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
        console.log(exhibitionAreaArr,lineGroupArr,concentratorArr,collectorArr )
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
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
