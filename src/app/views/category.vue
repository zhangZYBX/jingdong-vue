<template>
	<div class='page-wrapper'>
		<div class="header">
			<div class="header-left">
				<span></span>
			</div>
			<div class="header-body">
				<i class="JD"></i>
				<i class="search"></i>
				<input type="text" placeholder="海尔空调">
			</div>
			<div class="header-right">
				<span>我的</span>
			</div>
		</div>
		<div class="content">
			<div class="left" ref='left'>
				<ul class="category-main" v-if="mainList.length > 0">
					<li v-for="item in mainList" :key='item.id' :class='{active:mainIndex === item.id}' @click='initSubLists(item.id)' :data-id='item.id' :data-avatar='item.avatar'>
						<span v-text="item.name"></span>
					</li>
				</ul>
				<p v-else>数据暂无</p>
			</div>
			<div class="right" ref='right'>
				<div>
					<ul class="category-sub clearfix" v-if="subList.length > 0">
						<li :data-id=' item.fid' v-for="(item,i) in subList" :key='item.id'>
							<router-link :to='`/list/${mainIndex}/${item.id}`'>
								<img :src='item.avatar'/>
								<span v-text="item.name"></span>
							</router-link>
						</li>
					</ul>
					<p v-else>暂无相应商品信息...</p>
				</div>
				
			</div>
		</div>
		<div class="footer">
			<JDNav></JDNav>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import imagesLoaded from 'imagesloaded';
	import JDNav from '../components/JDNav.vue';
	//映射category子仓库
	import { createNamespacedHelpers } from 'vuex';
	let { mapState, mapGetters,mapActions} = createNamespacedHelpers('category');
	export default {
		components: { 
			JDNav
		},//注册组件
		// data: function() {
		// 	return {
		// 		main:[] ,//保存请求一级的数据
		// 		mainIndex: 0,//默认情况下 没有激活的 让一级分类的第一个激活
		// 		sub:[] //保存请求二级的数据
		// 	}
		// },
		computed: {  //计算一级数据的变化
			...mapState(['mainList','mainIndex']),
			...mapGetters(['subList'])
			// mainIndex: function(newValue,oldValue) {
			// 	this._getSubCategoryData();
			// }
		},
		methods:{
			...mapActions(['initMainList','initSubLists']),
			_initleftScroll() {
				if(!this.leftScroll) this.leftScroll = new BScroll(this.$refs.left,{
					click: true //使点击事件生效
				})
			},
			_initAndRefreshRightScroll() {
				imagesLoaded(this.$refs.right,() => {
					this.$nextTick(function(){
						if(!this.rightScroll) this.rightScroll = new BScroll(this.$refs.right,{
							click: true
						});
						else {
							this.rightScroll.scrollTo(0,0);
							this.rightScroll.refresh();
						}
					})
				})
			}
			
		},
		created: function() {
			this.initMainList();
			//this._updateMainCategory();//加载完毕之前过去一级分类
		},
		updated:function() {
			this._initleftScroll();
			this._initAndRefreshRightScroll();
			// if(!this.leftScroll) this.leftScroll = new BScroll(this.$refs.left,{
			// 	click:true
			// });
			// //判断左边图标是否加载完毕
			// imagesLoaded(this.$refs.right,()=>{
			// 	if(!this.rightScroll) this.rightScroll = new BScroll(this.$refs.right,{
			// 		click:true
			// 	});
			// 	else this.rightScroll.refresh();
			// })
		}
	}
</script>

<style scoped>
	/* 顶部部分 */
	.header {
		height: 0.88rem;
		width: 100%;
		flex-shrink: 0;
		display: flex;
		border-bottom: 1px solid #e5e5e5;
		background-color: #e43130;
	}
	.header-left {
		width: 0.88rem;
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header-left>span {
		width: 0.4rem;
		height: 0.36rem;
		background-color: transparent;
		background-image: url(../assets/images/header/header-logo.png);
		background-size: 100% 100%;
		background-position: center center;
		background-repeat: no-repeat;
	}
	.header-body {
		flex-grow: 1;
		border-radius: 0.3rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		margin: 0.14rem 0;
		position: relative;
	}
	.header-body>i.JD {
		width: 0.4rem;
		height: 0.3rem;
		margin-left: 0.1rem;
		flex-shrink: 0;
		background-image: url(../assets/images/header/header-Jd.png);
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100% 100%;
	}
	.header-body>i.JD:after {
		content: '';
		display: block;
		width: 0.02rem;
		height: 0.3rem;
		background-color: #e5e5e5;
		position: absolute;
		left: 0.6rem;
		
	}
	.header-body>i.search {
		margin-left: 0.3rem;
		width: 0.4rem;
		height: 0.3rem;
		flex-shrink: 0;
		background-image: url(../assets/images/header/jd-sprites.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: -330rem 0;
	}
	.header-body>input {
		flex-grow: 1;
		outline: none;
		border: none;
		border-radius: 0.3rem;
		height: 100%;
		font-size: 0.24rem;
	}
	
	.header-right {
		flex-shrink: 0;
		width: 0.88rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header-right>span {
		padding: 0.2rem 0;
		font-size: 0.28rem;
		color: white;
		font-weight: 400;
	}
	/* 中间内容 */
	.content {
		flex-grow: 1;
		display: flex;
		overflow: hidden;
	}	
	/* .content::-webkit-scrollbar {
		display: none;
	} */
	/*中间部分的左边*/
	.content>.left {
		width: 1.5rem;
		flex-shrink: 0;
		border-right: 1px solid #ccc;
		overflow: auto;
		border-right: 1px solid #ccc;
	}
	/* .content>.left::-webkit-scrollbar {
		display: none;
	} */
	ul.category-main {
		background-color: #f8f8f8;
	}
	ul.category-main>li {
		width: 100%;
		height: 0.92rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	ul.category-main>li>span { font-size: 0.28rem;}
	ul.category-main>li.active { background-color: white;}
	ul.category-main>li.active>span { color: #f23030;}
	/*中间部分的右边部分*/
	.content>.right {
		flex-grow: 1;
		overflow: hidden;
	}
	/* .content>.right::-webkit-scrollbar {
		display: none;
	} */
	ul.category-sub {}
	ul.category-sub>li {
		box-sizing: border-box;
		width: 33.333333%;
		padding: 0.26rem;
		float: left;
	}
	ul.category-sub>li>a {
		display: block;
		text-align: center;
	}
	ul.category-sub>li>a>img { 
		width: 100%;
		transform: scale(0.6);
	}
	ul.category-sub>li>a>span { 
		color: #333;
		font-size: 0.24rem;
	}
	/* 底部部分 */
	.footer {
		flex-shrink: 0;
		border-top: 0.02rem solid #e5e5e5;
		box-sizing: border-box;
		height: 1.24rem;
	}
	
</style>
