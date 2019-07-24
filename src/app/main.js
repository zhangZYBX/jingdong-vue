// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/miReset.css';//引入复位样式
import http from './utils/http.js';//引入axios
import store from './store';
import VDistpicker from 'v-distpicker';
//Vue.config.productionTip = false
Vue.component('v-distpicker',VDistpicker);
Vue.prototype.$http = http;
/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
	store,	//注入自定义的数据仓库
  components: { 
		App
	},
  template: '<App></App>'
})
