<template>
	<div class='page-wrapper'>
		<div class="header">
			<div class="header-title">
				<span>
					<i class="back" @click="$router.back(-1)"></i>
				</span>
				<p class="" v-text="title"></p>
				<span><i class="more"></i></span>
			</div>
			<div class="header-nav" ref='nav'>
				<ul>
					<li v-for='item in navList' :key='item.id'>
						<router-link v-text='item.name' :to='`/list/${mainId}/${item.id}`' replace>		'

						</router-link>
					</li>
				</ul>
			</div>
		</div>
		<div class="content" ref='content'>
			<div>
				<ul class="clearfix" v-if="list.length > 0">
					<li :data-id='item.id' v-for="item in list" :key='item.id'>
							<router-link :to='`/detail/${item.id}`'>
								<div class='avatar-wrapper'>
									<img :src="item.avatar">
								</div>
								<p class='ellipsis' v-text="item.name"></p>
								<em>￥<span v-text="item.price"></span></em>
								<h3 v-text="item.store">&gt;</h3>
							</router-link>
					</li>
				</ul>
				<p v-else> 暂无商品，敬请期待...</p>
				<p v-show='isLoading'>loading...</p>
				<p v-show="list.length > 0 && !hasMore">已经到达底部</p>
			</div>
			
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import imagesLoaded from 'imagesloaded';
	import { createNamespacedHelpers } from 'vuex';
	let { mapState, mapActions } = createNamespacedHelpers('product');
	export default {
		data: function() {
			return  {
				mainId:0, //一级
				subId:0,	//二级
				isLoading: false ,//标识是不是在加载
				hasMore: true ,//是否还有更多
				scrollY: 0 ,//记录当前内容的滚动位置
			}
		},
		computed:{
			...mapState(['list']),
			title() {
				return this.mainId ? this.$store.state.category.mainList.find(item => item.id === this.mainId).name :'';
			},
			navList() {
				return this.mainId ? this.$store.state.category.subLists[this.mainId]: []; 
			}
		},
		methods: {
			...mapActions(['getData']),
			_getData(loadMore) {
				this.isLoading = true; //请求二级数据,显示加载状态
				this.getData({subId:this.subId,loadMore})
					.then( (hasMore) => { //返回来的hasMore 
						this.isLoading = false;
						this.hasMore = hasMore;
					})
			},
			_initAndRefreshNavScroll(flag) {
				let ul = this.$refs.nav.querySelector('ul');
				let lis = ul.querySelectorAll('li');
				let lastLi = lis[lis.length - 1];
				let width = lastLi.offsetLeft + lastLi.clientWidth;
				ul.style.width = width + 'px';

				this.$nextTick( () => {
					let target = ul.querySelector('.active');
					if(!this.navScroll) {
						this.navScroll = new BScroll(this.$refs.nav,{
							scrollY: false,//关闭垂直滑动
							scrollX: true, //开始水平滑动
							click: true //开启点击事件
						});
						this.navScroll.scrollToElement(target,600);
					}
					else {
						this.navScroll.refresh();
						this.navScroll.scrollToElement(target,600);
					}
				})
			},
			_initAndRefreshContentScroll() {
				imagesLoaded(this.$refs.content,() => {
					this.$nextTick(function() {
						if(!this.scroll) {
							this.scroll = new BScroll(this.$refs.content,{
								click: true,
								pullUpLoad: {
									threshold: -50 //上拉加载更多
								}
							});
							this.scroll.on('pullingUp',() =>{
								this._getData(true);
							})
						}
						else this.scroll.refresh();//重新计算better-scroll，以便加载更多
					})
				})
			}
		},
		watch: {
			subId(newValue,oldValue) {
				this.hasMore = true;
				this._getData(false);
			},
			isLoading(newValue,oldValue) {
				if( (!newValue) && this.hasMore && this.scroll) this.scroll.finishPullUp();
			}
		},
		updated() {
			this._initAndRefreshNavScroll();
			this._initAndRefreshContentScroll();
		},
                activated() {
			if(this.$store.state.category.mainList.length < 1) {
                                this.$router.replace('/category'); //直接刷新页面仓库数据都清空了，跳转到分类页面
                                return;
			}
			if(this.scrollY) {
				this.scroll.refresh();
				this.scroll.scrollTo(0,this.scrollY);
			}
			this.mainId = parseInt(this.$route.params.mainId);//取出路由里面的一级id
			this.subId = parseInt(this.$route.params.subId);//取出路由里面的二级id
		},
		deactivated() {
			if(this.scroll)
				this.scrollY = this.scroll.y; //离开组件时保存当前离开的位置状态
		},
		beforeRouteUpdate(to,from,next) {
			this.subId = parseInt(to.params.subId);
			next();
		},
		destroyed() {
			if(this.scroll) this.scroll.destroy(); //销毁 释放内存
			if(this.navScroll) this.navScroll.destroy();
		}
}
</script>

<style scoped>
	/*表头部分*/
	.header {
		flex-shrink: 0;
		height: 2rem;
	}
	.header-title {
		height: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header-title>span {
		width: 0.8rem;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header-title>span>i {
		display: block;
		width: 0.88rem;
		height: 0.88rem;
		flex-shrink: 0;
		background-position: center center;
	}
	.header-title>span>i.more {
		background-image: url(../assets/images/header/more.png);
		background-repeat: no-repeat;
		background-size: 40%;
	}
	.header-title>span>i.back {
		background-image: url(../assets/images/back.png);
		background-size: 40%;
		background-repeat: no-repeat;
	}
	.header-title>p {
		flex-grow: 1;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.32rem;
		font-weight: bold;
	}
	.header-nav {
		overflow: hidden;
		height: 50%;
	}
	.header-nav>ul {
		display: flex;
		height: 100%;
	}
	.header-nav>ul>li {
		flex-shrink: 0;
	}
	.header-nav>ul>li>a {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
		color: rgb(105,105,105);
		padding: 0 0.26rem;
		border-bottom: 0.06rem solid transparent;
		box-sizing: border-box;
		font-size: 0.24rem;
	}
	.header-nav>ul>li>a.active {
		border-bottom-color: #E93B3D;
		color: #e93b3d;
	}
	.header>.brand {
		height: 30%;
		box-sizing: border-box;
		border-top: 1px solid #f5f5f7;
		border-bottom: 1px solid #f5f5f7;
		display: flex;
		align-items: center;
	}
	.brand>ul {	
		width: 100%;
		padding: 0.2rem 0.1rem 0.2rem 0.3rem;
	}
	.brand>ul>li {
		box-sizing: border-box;
		float: left;
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.brand>ul>li>a {
		width: 100%;
		margin-right: 0.2rem;
		text-align: center;
		font-size: 0.32rem;
		background-color: #f2f2f7;
		padding: 0.1rem 0;
		color: #666;
	}
	/*下方内容区域*/
	.content {
		flex-grow: 1;
		overflow: hidden;
		background-color: #f2f2f7;
		width: 100%;
		border-top: 0.02rem solid #eee;
	}
	.content>div>ul {
		margin-right: -0.2rem
	}
	.content>div>ul>li {
		width: 50%;
		float: left;
		margin-bottom: 0.2rem;
		box-sizing: border-box;
		padding-right: 0.2rem;
	}
	.content>div>ul>li:nth-child(odd) {
		box-sizing: border-box;
		
	}
	.content>div>ul>li>a {
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		background-color: white;
	}
	.content>div>ul>li>a>.avatar-wrapper {
		width: 100%;
		padding-top: 100%;
		position: relative;
	}
	.content>div>ul>li>a>.avatar-wrapper>img { 
		width: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		height: 100%;
	}
	.content>div>ul>li>a>p {
		color: #333;
		height: 0.38rem;
		line-height: 0.38rem;
		margin-top: 0.16rem;
		text-indent: 1em;
		font-size: 0.28rem;
	}
	.content>div>ul>li>a>em {
		font-style: normal;
		color: #e93b3d;
		text-indent: 1em;
	}
	.content>div>ul>li>a>em>span {
		color: #e93b3d;
		font-size: 0.36rem;
		font-weight: 400;
	}
	.content>div>ul>li>a>h3 {
		text-indent: 1em;
		color: #999;
		font-weight: normal;
		font-size: 0.24rem;
	}
</style>
