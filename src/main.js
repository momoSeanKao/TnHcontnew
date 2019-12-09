// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import axios from 'axios';
Vue.prototype.axios = axios;


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import echarts from 'echarts' //引入echarts
Vue.prototype.$echarts = echarts //引入组件

import config from './config/config'
window.config = config;

Vue.config.productionTip = false;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
Vue.prototype.crossUrl = process.env.API_ROOT==="production"?"https://api.seniverse.com":"/api";
//Vue.prototype.crossUrl = process.env.API_ROOT==="production"?"http://t.weather.sojson.com/api":"/api";
//axios.defaults.headers.common["token"] = localStorage.getItem("token");
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if(response.data.code === 401){
        router.push('/login');
        return false;
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },

);
/**

 /* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
