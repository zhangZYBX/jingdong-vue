<template>
	<div class="page-wrapper">
		<div class="header">
			<i @click="winBack"></i>
			<h1>京东登录</h1>
		</div>
		<div class="content">
			<LoginPhone v-show='loginType === 1'></LoginPhone>
			<LoginPwd v-show='loginType === 0'></LoginPwd>
			<div class="ps-login">一键登录</div>
			<div class="title-wrapper clearfix">
				<span class="title-phone" v-show="loginType === 1" @click="loginType = 0">短信验证码登录</span>
				<span class="title-pwd" v-show='loginType ===0' @click="loginType = 1">账号密码登录</span>
				<span class="title-regist">手机快速注册</span>
			</div>
			<div class="other-login">
				<h4>其他方式登录</h4>
				<a href="#"></a>
				<span class="qq">QQ</span>
				<span class="explain">登录即代表您已同意<span>京东隐私政策</span></span>
			</div>
		</div>
	</div>
</template>

<script>
	import LoginPhone from '../components/LoginPhone.vue';//导入注册登录组件
	import LoginPwd from '../components/LoginPwd.vue';//导入密码登录组件
	export default {
		components: {
			LoginPhone,
			LoginPwd
		},
		data: function() {
			return {
				loginType:1 //表示那个登录类型要显示 1默认情况下显示
			}
		},
		methods: {
			winBack: function() {
				this.$router.push({path: '/category'})
			}
		}
	}
</script>

<style scoped>
	html,body {width: 100%;height: 100%;}
	body {
		font-size: 0.24rem;
	}
	/*头部部分*/
	.header {
		width: 100%;
		height: 0.88rem;
		line-height:0.88rem;
		position: relative;
	}
	.header>i {
		width: 0.48rem;
		height: 0.48rem;
		position: absolute;
		left: 0.2rem;
		top: 50%;
		transform: translateY(-50%);
		background-image: url(../assets/images/back.png);
		background-size: 100% 100%;
	}
	.header>h1 {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.34rem;
		font-weight: 400;
	}
	.content {
		padding: 0.5rem 0.5rem;
		overflow: auto;
	}
	
	.form-item-wrapper {
		height: 1rem;
		padding: 0.2rem 0;
		margin-top: 0.4rem;
		border-bottom: 0.01rem solid #efefef;
		display: flex;
		align-items: center;
	}
	.form-item-wrapper>* {
		
	}
	.form-item-wrapper>label {
		width: 1.44rem;
		height: 1rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		font-size: 0.32rem;
		flex-shrink: 0;
		box-sizing: border-box;
		text-indent: 1em;
	}
	.form-item-wrapper>input {
		flex-grow: 1;
		flex-shrink: 1;
		outline: none;
		border: none;
		font-size: 0.32rem;
		height: 100%;
	}
	.form-item-wrapper>button {
		width: 2rem;
		height: 0.72rem;
		line-height: 0.72rem;
		flex-shrink: 0;
		outline: none;
		border: none;
		font-size: 0.28rem;
		background-color: white;
		box-sizing: border-box;
		padding: 0 0.2rem;
		margin: 0.2rem 0;
		border-left: 0.02rem solid #ccc;
		color: #848689;
	}
	.form-item-wrapper>label>i {
		position: absolute;
		right: 0.1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 0.28rem;
		height: 0.12rem;
		background-image: url(../assets/images/open.png);
		background-size: 100% 100%;
	}
	.btn-login-wrapper {
		margin-top: 0.6rem;
	}
	.btn-button,.btn-pwd {
		outline: none;
		border: none;
		width: 100%;
		height: 1rem;
		color: #fff;
		font-size: 0.32rem;
		text-align: center;
		border-radius: 0.5rem;
		background-color: #efefef;
		background-image:  linear-gradient(90deg,#fab3b3,#ffbcb3 73%,#ffcaba);;
	}
	.login-pwd {
		/* display: none; */
	}
	.title-pwd {/* 
		display: none; */
	}
	.ps-login {
		margin-top: 0.2rem;
		width: 100%;
		height: 1rem;
		line-height: 1rem;
		border-radius: 0.5rem;
		text-align: center;
		color: #f10000;
		border: 0.02rem solid #ff2000;
		background-color: #fff;
		font-size: 0.32rem;
	}
	.title-wrapper {
		margin-top: 0.4rem;
		height: 100%;
	}
	.title-wrapper>* {
		height: 0.44rem;
		line-height: 0.44rem;
		color: #999;
		font-size: 0.28rem;
		text-align: center;
	}
	span.title-phone,span.title-pwd {
		float: left;
	}
	span.title-regist {
		float: right;
	}
	.other-login {
		margin-top: 1.76rem;
		border-top: 0.02rem solid #efefef;
		position: relative;
	}
	.other-login>h4 {
		padding: 0.1rem 0.3rem;
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%) translateY(-50%);
		text-align: center;
		background-color: #fff;
		color: #ccc;
		font-size: 0.24rem;
		font-weight: 400;
	}
	.other-login>a {
		display: block;
		width: 0.96rem;
		height: 0.96rem;
		margin: 0.3rem auto 0;
		background-image: url(../assets/images/qq.png);
		border-radius: 50%;
		background-size: 100% auto;
		background-repeat: no-repeat;
	}
	.other-login>span {
		display: block;
		text-align: center;
	}
	.other-login>.qq {
		color: #999;
	}
	.other-login>span.explain {
		margin-top: 0.24rem;
		color: #bebebe;
	}
	.other-login>span.explain>span {
		color: #409eff;
	}
</style>
