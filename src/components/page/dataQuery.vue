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
        }

      },
      mounted(){

      },
      methods: {
        handleClick(tab, e) {//点击选项卡
          this.tabType = tab.index;
          var _val = tab.index;

        },



      }
    }
</script>

<style scoped>

</style>
