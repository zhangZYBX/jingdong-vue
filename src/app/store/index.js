//公共的仓库
import Vue from 'vue'; //导入vue
import Vuex from 'vuex'; //导入vuex
import http from '../utils/http.js'; //导入http

//向vue注入vuex体系
Vue.use(Vuex);



//导入子仓库系统
import category from './category.js';
import product from'./product.js';
import detail from './detail.js';
import alert from './alert.js';
import cart from './cart.js';
//导出仓库对象并导出
export default new Vuex.Store({
	state: {
		http
	},
	getters: {},
	mutations: {},
	actions: {},
	modules: {
		category,
		product,
		detail,
		alert,
		cart
	}
})