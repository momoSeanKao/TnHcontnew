import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'

import lineManagement from '@/components/page/lineManagement'
import alarmConfiguration from '@/components/page/alarmConfiguration'
import dataQuery from '@/components/page/dataQuery'
import accontManage from '@/components/page/accontManage'
import overview from '@/components/page/overview'
import viewSelection from '@/components/page/viewSelection'
import timingJob from '@/components/page/timingJob'
import HelloWorld from '@/components/HelloWorld'



Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect:login,
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: "/home",
      name: "home",
      component: home,
      children: [
        {
          path: "/home/overview",
          name: "overview",
          component: overview,
          meta: {menuName: "概览"}
        },
        {
          path: '/home/lineManagement',
          name: 'lineManagement',
          component: lineManagement,
          meta: {menuName: "线路管理"}
        },
        {
          path: '/home/alarmConfiguration',
          name: 'alarmConfiguration',
          component: alarmConfiguration,
          meta: {menuName: "报警配置"}
        },
        {
          path: '/home/viewSelection',
          name: 'viewSelection',
          component: viewSelection,
          meta: {menuName: "视图选择"}
        },
        {
          path: '/home/dataQuery',
          name: 'dataQuery',
          component: dataQuery,
          meta: {menuName: "数据查询"},
        },
        {
          path: '/home/accontManage',
          name: 'accontManage',
          component: accontManage,
          meta: {menuName: "账号管理"}
        },
        {
          path: '/home/timingJob',
          name: 'timingJob',
          component: timingJob,
          meta: {menuName: "定时任务"}
        },
      ]
    }
  ]
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
