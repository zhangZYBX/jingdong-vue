export default {
	namespaced: true,
	state: {
		
	},
	getters: {},
	mutations:{},
	actions:{
		getData({state,commit,rootState},payload) {
			return rootState.http({
					method:'post',
					url:'/product/detail',
					data: {pid:payload}
				})
					.then(data => {
						return data
					});
		},
		addInToMyCart({state,commit,rootState},payload) {
			return rootState.http({
				method:'post',
				url:'/detail/add',
				data:payload
			})
				.then(() => {
					 return '加入购物车成功';
				})
		}
	}
}