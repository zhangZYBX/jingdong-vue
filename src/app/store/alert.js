export default {
	namespaced: true,
	state: {
		isShow: false,
		message:''
	},
	getters: {},
	mutations: {
		//打开弹窗
		open(state,payload) {
			state.isShow = true;
			state.message = payload
		},
		//关闭弹窗
		close(state) {
			state.isShow = false;
			state.message = '';
		}
	},
	actions: {}
}