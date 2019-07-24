<template>
	<div class="mi-alert" v-show="isShow">
		<div class="content">
			<h2>提示</h2>
			<p v-text="message"></p>
			<button @click="close">确定</button>
		</div>
	</div>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex';//映射子仓库
	let { mapState, mapMutations,mapGetters, mapActions } = createNamespacedHelpers('alert');
	//自定义的弹窗
	export default {
		computed: mapState(['isShow','message']),
		methods:  mapMutations(['close'])
	}
</script>

<style>
	.mi-alert {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.7);
		z-index: 10;
	}
	.mi-alert>div.content {
		width: 40%;
		height: 40%;
		padding: 0.4rem;
		background-color: white;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.mi-alert>div.content>h2 {
		font-weight: bold;
		position: absolute;
		left:0;
		top: 0;
		width: 100%;
		background-color: #E4393C;
		height: 0.5rem;
		font-size: 0.32rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: lightgray;
	}
	.mi-alert>div.content>p {
		margin-top: 0.5rem;
		flex-grow: 1;
		font-size: 0.24rem;
	}
	.mi-alert>div.content>button {
		flex-shrink: 0;
		border: none;
		outline: none;
		background-color: #E4393C;
		color: #fff;
		border-radius: 0.08rem;
		height: 0.4rem;
		width: 100%;
	}


</style>
