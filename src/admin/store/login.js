export default {
	namespaced: true,
	state: {
		name: '' //表示用户名有没有登录
	},
	getters: {
		isLogin(state) { return state.name !== ''}
	},
	mutations:{
		_login(state,payload) { state.name = payload},
		logout(state,payload) { state.name = ''}
	},
	actions:{
		//登录功能
		login({commit,rootState},payload) {
			rootState.http({
				method:'post',
				data: payload,
				url:'/admin/login'
			})
				.then( () => {
					commit('_login',payload.name)
				})
		},
		password({commit,rootState},payload) {
			rootState.http({
				url:'/admin/password',
				method:'post',
				data:payload
			})
				.then( () => commit('logout')) //修改成功后，退出重新登录
		}
	}
}