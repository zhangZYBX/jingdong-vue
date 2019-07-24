<template>
	<ul class="clearfix nav">
		<li>
			<router-link to='/' exact>
			</router-link>
		</li>
		<li>
			<router-link to='/category'>
			</router-link>
		</li>
		<li>
			<router-link to=''>	
			</router-link>
		</li>
		<li>
			<router-link to='/cart'>
			</router-link>
		</li>
		<li>
			<router-link to='/profile' :class="name ? 'login' : '' ">
			</router-link>
		</li>
	</ul>
</template>

<script>
	import { mapState,mapActions } from 'vuex';
	export default {

	        computed: {
		        ...mapState('cart',['name'])
	        },
	        methods: {
		        ...mapActions('cart',['login'])
	        },
	        created() {
	                this.login()
	        }

	}
</script>

<style scoped>
	ul {
		display: flex;
		width: 100%;
		height: 1.24rem;
		flex-shrink: 0;
	}
	ul>li {
		flex-basis: 0;
		flex-grow: 1; 
		flex-shrink: 0;
		display: flex;
		justify-content: center;
	}
	ul>li>a {
		flex-shrink: 0;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100% 100%;
	}
	ul>li:nth-child(1)>a {
		background-image: url(../assets/images/header/footer/1.1.png);
	}
	ul>li:nth-child(1)>a.active {
		background-image: url(../assets/images/header/footer/1.png);
	}
	ul>li:nth-child(2)>a {
		background-image: url(../assets/images/header/footer/2.png);
	}
	ul>li:nth-child(2)>a.active {
		background-image: url(../assets/images/header/footer/2.2.png);
	}
	ul>li:nth-child(3)>a {
		background-image: url(../assets/images/header/footer/3.png);
	}
	ul>li:nth-child(4)>a {
		background-image: url(../assets/images/header/footer/4.png);
	}
	ul>li:nth-child(5)>a {
		background-image: url(../assets/images/header/footer/5.png);
	}
	ul>li:nth-child(5)>a.active {
		background-image: url(../assets/images/Inmy.png) !important;
	}
	ul>li:nth-child(5)>a.login {
		background-image: url(../assets/images/my.png);
	}
</style>
