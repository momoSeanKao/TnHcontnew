<template>
    <div class="timingJob">
      <el-form ref="form" label-width="160px">
        <el-form-item label="定时任务管理：">
          <el-switch active-value="1" inactive-value="2" v-model="mystates" active-text="开启" inactive-text="暂停"
                     @change="changeJobStatus"></el-switch>
        </el-form-item>
        <el-form-item label="修改时间间隔：">
          <el-select v-model="space" :disabled="mystates =='1'?true:false" value-key="key" @change="changeJobSpace">
            <el-option v-for="item in timingJobList" :key="item.id" :label="item.label" :value="item.id"  ></el-option>
          </el-select>
        </el-form-item>
      </el-form>


    </div>
</template>

<script>
    export default {
      name: "timingJob",
      data() {
        return {
          timingJobList:[
            {
              id:'1',
              label:'每两分钟',
            }, {
              id:'2',
              label:'每五分钟',
            },{
              id:'3',
              label:'每十分钟',
            },{
              id:'4',
              label:'每十五分钟',
            },
          ],
          mystates:'',
          space:'',
        }
      },
      mounted(){
        this.getSchedulerJob();
      },
      methods: {
        getSchedulerJob(){
          let _this = this;

          _this.axios({
            method: 'get',
            url:window.config.url + "/stage/task/getSchedulerJob",
            headers:{ "token":localStorage.getItem("token") }
          }).then((res)=>{
            if(res.data.code == 200){
              console.log(res);
              _this.mystates = res.data.data.states.toString();
              //_this.mystates = false;
              //_this.mystates = "1"
              console.log(_this.mystates );
              //_this.space = res.data.data.type;
              this.timingJobList.forEach(v=>{
                if(v.id == res.data.data.type){
                  _this.space = v.label
                }
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
      changeJobStatus(e){
          let _this = this;
        console.log(e);
          //console.log(this.states);
          if(e == 1){
            //_this.states = e;
            _this.axios({
              method: 'get',
              url:window.config.url + "/stage/task/resumeJob",
              headers:{ "token":localStorage.getItem("token") }
            }).then(function(res){
              if(res.data.code==200){
                _this.$message({
                  message: "任务开启",
                  type: 'success'
                });
              }else{
                console.log(res.data.data);
              }
            }).catch(function (error) {
              console.log(error);
            });

          }else if(e  == 2){
            //_this.states = e;
            _this.axios({
              method: 'get',
              url:window.config.url + "/stage/task/pauseJob",
              headers:{ "token":localStorage.getItem("token") }
            }).then(function(res){
              if(res.data.code==200){
                _this.$message({
                  message: "任务暂停",
                  type: 'success'
                });
              }else{
                console.log(res.data.data);
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
        },
        changeJobSpace(e){
          console.log(e)
          let _this = this;
          _this.axios({
            method: 'get',
            url:window.config.url + "/stage/task/updateJob",
            params:{type:e},
            headers:{ "token":localStorage.getItem("token") }
          }).then(function(res){
            console.log(res);
          }).catch(function (error) {
            console.log(error);
          });

        },
      },
    }
</script>

<style scoped>

</style>
