export default {
	namespaced: true,
	state: {
		mainList:[],//保存请求一级的数据
		mainIndex: 0,//默认情况下 没有激活的 让一级分类的第一个激活
		subLists: {} //保存请求二级的数据
	},
	getters: {
		subList(state,getters) {
			return state.subLists[state.mainIndex] || [];
		}
	},
	mutations: {
		_initMainList(state,payload) { state.mainList = payload},
		_changeCurCid(state,payload) { state.mainIndex = payload},//更改一级激活
		_initSubLists(state,payload) {
			let temp = {};
			temp[state.mainIndex] = payload;
			state.subLists = {
				...temp,
				...state.subLists
			};
		}
	},
	actions: {
		initMainList({commit,dispatch,rootState}) {
			rootState.http({
					url:'/category/main'
				})
					.then(data => {
							commit('_initMainList',data); //将请求回来的数据传给当前的一级的数组
							dispatch('initSubLists',data[0].id);
					})
			
		},
		initSubLists({state,commit,rootState},payload) {
			commit('_changeCurCid',payload);
			if(typeof state.subLists[payload] !== 'undefined') return;
			rootState.http({
				url:'/category/sub',
				params: {
					id:payload
				}
			}).then(data => commit('_initSubLists',data));
		}
	},
	modules: {
		
	}
}