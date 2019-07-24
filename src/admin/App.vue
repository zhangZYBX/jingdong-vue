<template>
	<div class="root">
		<Home v-if="isLogin"></Home>
		<login v-else></login>
	</div>
</template>

<script>
	import Home from './views/Home.vue';
	import login from './views/login.vue';
	import { createNamespacedHelpers } from 'vuex';
	let { mapGetters} = createNamespacedHelpers('login');
	export default {
		components: {
			Home,
			login
		},
		computed:mapGetters(['isLogin'])
	}
</script>

<style scoped>
	.root {
		width: 100%;
		height: 100%;
	}
</style>
