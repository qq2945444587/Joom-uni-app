// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import router from './router'
import VueWechatTitle from 'vue-wechat-title'
import 'lib-flexible/flexible'
import Vant from 'vant'
import 'vant/lib/index.css'
import { axios } from "./utils"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueTouch from 'vue-touch'

import qs from "qs"
import Vue from 'vue'
import App from './App'
// 头部
import Head from "../src/components/Head.vue"
Vue.component("Head", Head)
// 失败弹出框
import DialogFail from "../src/components/DialogFail.vue"
Vue.component("DialogFail", DialogFail)
// 智能评估框
import SmartDialog from "../src/components/SmartDialog.vue"
Vue.component("SmartDialog", SmartDialog)
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.use(Vant)
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(VueWechatTitle)
Vue.use(VueTouch, {name: 'v-touch'})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
