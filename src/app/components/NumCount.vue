<template>
	<div class="number-count">
		<span class='decrease' @click="$emit('decrease')">-</span>
		<span class='count' v-text="count"></span>
		<span class='increase' @click="$emit('increase')">+</span>
	</div>
</template>

<script>
	export default {
		props:['count']
	}
</script>

<style scoped>
	div.number-count{
		width: 2.6rem;
		height: 0.4rem;
		display: flex;
		position: absolute;
		right: 0.8rem;
		bottom: 0;
	}
	div.number-count>span {
		flex: 0 0 auto;
		width: 0.52rem;
		text-align: center;
		font-weight: bolder;
		background-color: rgb(244,244,244);
	}
	div.number-count>span.count {
		flex-grow: 1;
		color: #999;
		margin: 0 0.2rem;
	}
</style>
