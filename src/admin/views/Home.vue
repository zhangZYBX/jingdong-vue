<template>
	<el-container class='jd-home'>
		<el-aside width='auto'>
			<HomeNav></HomeNav>
		</el-aside>
		<el-container>
			<el-header>
				<h1>京东商城后台管理系统</h1>
				<div>
					欢迎您<span v-text="name"></span>
					<span  @click="loginOut">退出登录</span>
				</div>
			</el-header>
			<el-main>
				<HomeTab></HomeTab>
			</el-main>
			<el-footer height='30px'>
				<p>&copy;版权所有: 张波</p>
				<p>tel: 17863659003</p>
				<p>e-mail: 1192090645@qq.com</p>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script>
	//引入子组件
	import HomeNav from '../components/HomeNav.vue';
	import HomeTab from '../components/HomeTab.vue';
	import{ mapState,mapMutations } from 'vuex';
        export default {
			//注册子组件
	                data() {
	                        return {

	                        }
	                },
			components:{
				HomeNav,
				HomeTab
			},
			computed: {
			        ...mapState('login',['name'])
			},
			methods: {
				...mapMutations('login',['logout']),
	                        loginOut() {
                                        this.$confirm('确认退出?','提示',{type:'warning'})
                                                .then(() => {
                                                       this.logout();
                                                })
                                                .catch(() => {
                                                        this.$message({
                                                                type: 'info',
                                                                message: '已取消删除'
                                                        });
                                                })
	                        }
			}
		};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.jd-home
		height: 100%
		.el-aside
			background-color: #303133
		.el-header
			background-color: #000
			display: flex
			align-items: center
			position: relative
			h1
				color: #ff7a4d
				font-size: 28px
			div
				position: absolute
				right: 200px
				display: flex
				align-items: center
				color: rgba(255,255,255,0.4)
				font-weight: 800
				font-size:  24px
				height: 100%
				span
					margin-left: 20px
					color: white
					font-size: 12px

		.el-footer
			background-color: #606266
			display: flex
			align-items: center
			justify-content: space-between
			p
				color: #fff
				font-size: 14px
				margin-right: 50px
				font-weight: normal
</style>