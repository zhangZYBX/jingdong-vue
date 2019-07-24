<template>
	<el-container class='mi-login'>
		<el-header height='60px'>
			<img src="../assets/images/adminLogin/logo.png" alt="">
		</el-header>
		<el-main height='475px' class='mi-login-main'>
			<LoginForm class='form'></LoginForm>
		</el-main>
		<el-footer height='86px'>
			<ul>
				<li><a href="#">关于我们</a></li>
				<li><a href="#">联系大家</a></li>
				<li><a href="#">人才招聘</a></li>
				<li><a href="#">商家入驻</a></li>
				<li><a href="#">广告服务</a></li>
				<li><a href="#">手机京东</a></li>
				<li><a href="#">友情链接</a></li>
				<li><a href="#">销售联盟</a></li>
				<li><a href="#">京东社区</a></li>
				<li><a href="#">京东公益</a></li>
				<li><a href="#">English Site</a></li>
			</ul>
			<div>
				Copyright &nbsp;
				&copy; &nbsp;
				2004-2019 &nbsp;
				京东JD.com
			</div>
		</el-footer>
	</el-container>
</template>

<script>
		import LoginForm from '../components/LoginForm.vue';
        export default {
			components:{ LoginForm}
		};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.mi-login
		height:100%
		.el-header
			img
				margin-left: 60px
		.mi-login-main
			background-image: url(../assets/images/adminLogin/adminBc.jpg)
			background-repeat: no-repeat
			background-position: center center
			background-color: #0d3645
		.el-footer
			margin: 0 auto
			ul
				display: flex
				width: 990px
				li
					position: relative	
					&:not(:last-child):after
						content:''
						display: block
						position: absolute
						right: 0
						top: 50%
						transform: translateY(-40%)
						height: 12px
						width: 1px
						background-color:#666
					a
						padding: 0 10px
						text-align: center
						color: #666
						font-size: 12px
			div
				display: flex
				justify-content: center
				color: #666
				font-size: 12px
</style>