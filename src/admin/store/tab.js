export default {
	namespaced: true,
	state: {
		list:[],//列表信息
		activeName:''
	},
	getters: {},
	mutations: {
		//给左栏点击用
		addTab(state,payload) {
			if(state.list.indexOf(payload) === -1) //判断当前的二级有没有
			 state.list.push(payload);
			 state.activeName = payload;	//告知二级当前激活
		},
		//右边Tab点击影响左边
		toggleTab(state,payload) {
			state.activeName = payload;	//将激活的那个赋值给activeName
		},
		removeTab(state,payload) {
			state.list.splice(state.list.indexOf(payload),1);//返回字符串在数组中出现的首次位置
			state.activeName = state.list[0] || ''; //删除激活的后默认让第一个一个激活，如果都删了就位空
		}
	},
	actions: {}
}