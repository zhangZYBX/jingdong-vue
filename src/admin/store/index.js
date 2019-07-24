import Vue from 'vue';
import Vuex from 'vuex';
import category from './category.js';
import tab from './tab.js';
import login from './login.js';
import http from '../utils/http.js';
import  product from './product.js';
//注入vuex体系
Vue.use(Vuex);


//导出
export default new Vuex.Store({
	state: {
		http
	},
	getters: {},
	mutations: {},
	actions: {},
	modules: {
		category,
		tab,
		login,
                product
	}
})