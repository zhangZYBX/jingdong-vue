export default {
	namespaced:true,
	state: {
		list:[]
	},
	getters: {},
	mutations: {
		_updateList(state,payload) {
			state.list = payload;
		},
		uploadBanner(state,{id,filePath}) {
			let i = state.list.findIndex(item => item.id === id);
			let temp = { ...state.list[i] };
			if(temp.bannerImage !== '') {
				temp.bannerImage = temp.bannerImage.split('?');
				temp.bannerImage.push(filePath);
				temp.bannerImage = temp.bannerImage.join('?');
			} else temp.bannerImage = filePath; //如果没有数据，
			state.list.splice(i,1,temp);
		},
		_removeBanner(state,{id,newBannerImgs}) {
			let i = state.list.findIndex(item => item.id === id);
			let temp = { ...state.list[i] };
			temp.bannerImage = newBannerImgs;
			state.list.splice(i,1,temp);
		},
		_removeProduct(state,payload) { //删除当前仓库里面的那条数据
			var i = state.list.findIndex(item => item.id === payload);
			if( i !== -1) {
				state.list.splice(i,1);
			}
		},
		_uploadNewProduct(state,payload) { //新增加当前的商品
			var tempItem = state.list.find(item => item.cid === payload.cid)
			var temp = {};
			temp.id = payload.id;
			temp.cid = payload.cid;
			temp.name = payload.name;
			temp.price = payload.price;
			temp.avatar = `/images/list/avatar/${payload.avatar1}`;
			temp.store = payload.store;
			temp.bannerImage = '';
			temp.subCategoryName = tempItem.subCategoryName;
			temp.mainCategoryId = tempItem.mainCategoryId;
			temp.mainCategoryName = tempItem.mainCategoryName;
			state.list.push(temp);
		}
	},
	actions: {
		getData({state,commit,rootState},payload) {
			return rootState.http({
				method:'post',
				data: payload,
				url:'/product/admin-list'
			})
				.then(data => {
					commit('_updateList',data.list);
					return data.total; //返回来总数量
				})
		},
		removeBanner({state,commit,rootState},{id,filePath}) {
			let oldBannerImage = state.list.find(item => item.id === id).bannerImage;
			let newBannerImgs = '';
			if(oldBannerImage !== filePath) {
				let arr = oldBannerImage.split('?');
				arr.splice(arr.indexOf(filePath),1);
				newBannerImgs = arr.join('?');
			}
			return rootState.http({
				method:'post',
				url:'/product/banner/remove',
				data:{ id,filePath,newBannerImgs }
			})
				.then( () => {
					commit('_removeBanner',{id,newBannerImgs});
				})
		},
		uploadNewData({state,rootState,commit},payload) { //请求新增商品
			return rootState.http({
				method:'post',
				url:'/product/addNewProduct',
				data: payload
			})  
				.then( data => {
					if(state.list.findIndex(item => item.cid === payload.cid) !== -1) {
						commit('_uploadNewProduct',{ ...payload, id:data  })
					}
				})
		},
		removeProduct({state,rootState,commit},payload) {
			var bannerImage = payload.bannerImage.split('?')
			console.log(bannerImage);
			return rootState.http({
				method:'post',
				url:'/product/removeProduct',
				data: {
					id: payload.id,
					bannerImage,
					avatar1:payload.avatar
				}
			})
				.then(() => {
					 commit('_removeProduct',payload.id);
				})
		}
	}
}