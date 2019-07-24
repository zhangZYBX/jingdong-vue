export default {
        namespaced: true,
	state: {
	        name: ''
        },
	getters: {},
	mutations: {
	        _login(state,payload) {
	                if(payload !== 'undefind') state.name = payload;
                }
        },
	actions: {
		login({commit,rootState}) {
		        return rootState.http({
                                url: '/category/login',
                                method: 'post'
                        })
                                .then( data =>{
                                        commit("_login",data)
                                })
                }
	}
}