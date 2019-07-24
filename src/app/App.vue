<template>
	<div class="root">
		<MiAlert></MiAlert>
		<keep-alive>
				<router-view v-if='$route.meta.keepAlive'>
				</router-view>
		</keep-alive>
		<router-view v-if='!$route.meta.keepAlive'>
	    </router-view>
	</div>
	
   
</template>

<script>
	import MiAlert from './components/MiAlert.vue';
	export default {
		components: {
			MiAlert
		}
	}
</script>

<style>
	.root {
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
