import Vue from 'vue' ;//导入vue
import Router from 'vue-router'; //导入vue-router

//导入vue-router路由体系
import home from '../views/home.vue';//主页
import category from '../views/category.vue';//分类页
import list from '../views/list.vue';//列表页
import login from '../views/Login.vue';
import detail from '../views/detail.vue';//导入详情组件
import cart from '../views/cart.vue';
import order from '../views/order.vue';
import profile from'../views/profile.vue';
import address from '../views/address.vue';
import orderDetail from '../views/orderDetail.vue';
import test from '../views/test.vue';
//vue使用路由体系 向vue体系注入 router
Vue.use(Router);

export default new Router({
	linkActiveClass:'active',
  routes: [
		{ path: '/',component: home},
		{ path:'/category',component:category,meta:{ keepAlive:true}},
		{ path:'/home',component:home},
		{ path:'/list/:mainId/:subId',component:list,meta:{ keepAlive:true }},
		{ path:'/login',component:login},
		{ path: '/detail/:pid',component:detail},
		{ path: '/cart',component:cart },
		{ path: '/order/:orderId',component:order },
		{ path: '/profile',component:profile },
		{ path: '/address',component:address },
		{ path: '/orderDetail',component:orderDetail },
		{ path: '/test',component:test }
  ]
})
