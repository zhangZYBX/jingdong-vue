export default {
	namespaced: true,
	state: {
		isMainListInit: false ,//标识以及分类信息有没有初始化
		mainList:[]	,//一级分类的列表
		subLists: {} //二级分类的列表
	},
	getters: {},
	mutations: {
		_initMainList(state,payload) { 
			state.mainList = payload;
			state.isMainListInit = true; //第一次数据请求数据后把初始化改为真
		},
		_initSubLists(state,temp) { 
			state.subLists = {
				...temp,
				...state.subLists
				};
			},
		_removeCategory(state,payload) {
			let i = state.mainList.findIndex(item => item.id === payload);
			if( i !== -1) {
				state.mainList.splice(i,1);
				return;
			}
			for(let key in state.subLists) {
				i = state.subLists[key].findIndex(item => item.id === payload);
				if( i !== -1) {
					state.subLists[key].splice(i,1);
					break;
				}
			}
		},
		_addCategory(state,payload) {
			if(payload.fid === 0) {
				state.mainList.push(payload);
			}
			if(payload.fid !== 0 && typeof state.subLists[payload.fid] !== 'undefined') {
				state.subLists[payload.fid].push(payload);
			} 
		},
		_updateCategory(state,payload) {
			let obj = {
				id: payload.id,
				fid: payload.fid,
				name: payload.name,
				avatar: payload.avatar === payload.oldAvatar ? payload.avatar : `/images/category/${ payload.avatar }`
			}
			let i = -1;
			if( payload.fid === 0) { //一级分类
				i =  state.mainList.findIndex(item => item.id === payload.id);
				state.mainList[i] = obj;
			}
			else { //修改的二级
				for(let key in state.subLists) {
					i = state.subLists[key].findIndex(item => item.id === payload.id)
					if( i !== -1 ) {	//二级对象对象里面有
						if( payload.fid.toString() === key ) state.subLists[key][i] = obj;
						else {
							state.subLists[key].splice(i,1);//在当前二级删除
							if(typeof state.subLists[payload.fid] !== 'undefined') state.subLists[payload.fid].push(obj);
						}
						break;
					}
					
				}
			}
		}
	},
	actions: {
		initMainList({state,commit,dispatch,rootState}) {  //解构 rootState 根节点
			if(state.isMainListInit) return Promise.resolve();
			return rootState.http({ url:'/category/main'})
				.then(data => {
					commit('_initMainList',data);//调用mutations里面的initMainList
				})
		},
		initSubLists({state,commit,rootState},payload) {
			if(typeof state.subLists[payload] !== 'undefined') return Promise.resolve();
			return rootState.http({
					url:'/category/sub',//二级请求的路由
					params: {id: payload}	
				})
				.then(data => {
					let temp = {};
					temp[payload] = data;
					commit('_initSubLists',temp)
				});
		},
		removeCategory({state,commit,rootState},{id,avatar,fid}) {
			avatar = fid ===0 ? '' : avatar;
			return rootState.http({
				url:'/category/remove',
				method:'post',
				data: {id,avatar}
			})	
				.then(data => {commit('_removeCategory',id)})
		},
		addCategory({rootState,commit},payload) {
			return rootState.http({
				method:'post',
				data:payload,
				url:'/category/add'			,
			})
				.then(data => {
					let temp = {};
					temp.id = data;
					temp.name = payload.name;
					temp.fid = payload.fid;
					temp.avatar = `/images/category/${payload.avatar}`;
					commit('_addCategory',temp);
					return temp;
				})
		},
		updateCategory({commit,state,rootState},payload) {
			return rootState.http({
				method: 'post',
				data: payload,
				url: '/category/update'
			})
				.then(data => {
					commit('_updateCategory',payload)
				});				
		}
	},
}