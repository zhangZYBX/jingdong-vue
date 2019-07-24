import Vue from 'vue';
import ElementUI from 'element-ui'; //导入ui框架
import './assets/css/adminReset.css';	//导入复位样式
import 'element-ui/lib/theme-chalk/index.css'; //导入ui框架专用css
import router from './router'; //引入路由系统
import store from './store'; //引入仓库
import App from './App.vue';
Vue.use(ElementUI); //向vue注入UI框架

let vm = new Vue({
	el:'#app',
	router,
	store,
	components: {
		App	//注册组件
	},
	template:'<App></App>'
}) 