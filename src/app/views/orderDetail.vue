<template>
	<div class="page-wrapper">
		<div class="header-title">
			<span><i class="back" onClick="javascript :history.back(-1);"></i></span>
			<span class="title">我的订单</span>
			<span><i class="more"></i></span>
		</div>
		<div class='content'>
			<ul class='order-list' v-if="list.length > 0">
				<li :data-id='item.id' v-for="item in list" :key='item.id' v-if='item.pay.data[0] === 0'>
					<div class='header'>
						<span class='logo'></span><span class='jingdong'>京东</span>
						<span class='delete' @click="remove(item.id)"></span>
					</div>
					<span>订单编号: {{item.id}}</span>
					<div>订单时间: {{item.shoppingTime}}</div>
					<div class='avatar-wrapper'>
						<img :src='item.avatar'/>
					</div>	
					<div class='total-price2'>
						<span>总价钱:￥ {{ item.account }}</span>
						<span class='no-pay' @click="$router.push({path:`/order/${item.id}`})">去付款</span>
					</div>
				</li>
				<li  :data-id='item.id' v-for="item in list" :key='item.id' v-if='item.pay.data[0] === 1'>
						<div class='header'>
							<span class='logo'></span><span class='jingdong'>京东</span>
							<span class='delete' @click="remove(item.id)"></span>
						</div>
						<span>订单编号: {{item.id}}</span>
						<div>订单时间: {{ item.shoppingTime }}</div>
						<div class='avatar-wrapper'>
							<img :src='item.avatar'/>
						</div>	
						<div class='total-price'>
							<span>总价钱:￥ {{ item.account }}</span>
							<span>已支付</span>
						</div>
						<div class='other-wrapper'>
							<span>看相似</span>
							<span>再次购买</span>
						</div>
				</li>
			</ul>
			<p v-else>你暂时还没有订单</p>
		</div>
	</div>
</template>

<script>
	
	export default {
		data() {
			return {
				list:[],
			}
		},
		methods: {
			getList() {
				this.$http({
					method:'post',
					url:'/orderDetail/list'
				})
					.then(data => {
						this.list = data[0]
					})
			},
			remove(id) {
                               if(!confirm("删除订单？")) return;
                               else{
				        this.$http({
	                                                method: 'post',
	                                                url:'/orderDetail/delete',
	                                                data: {orderId: id }
	                                        })
					        .then(data => {
	                                                        let mid = this.list.findIndex(item => item.id === id);
						                this.list.splice(mid,1);
                                                             alert('删除成功！');
					        })
                               }
                         }
		},
		created() {
			this.getList();
		}
	}
</script>

<style scoped>
	.page-wrapper {
		overflow: hidden;
	}
	.header-title {
		height: 0.88rem;
		width: 100%;
		border-bottom: 0.02rem solid #efefef;
		display: flex;
		flex-shrink: 0;
	}
	.header-title>span { height: 0.88rem;}
	.header-title>span:not(.title) {
		width: 0.88rem;
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
	.header-title>span.title {
		flex-grow: 1;
		text-align: center;
		display: flex;
		font-size: 0.36rem;
		color: #333;
		justify-content: center;
		align-items: center;
	}
	/* 下方购物车内的信息 */
	div.content {
		flex-grow: 1;
		overflow: auto;
	}
	.content>ul {
		background-color: #F7F7F7;
		width: 100%;
		height: 100%;
		padding-top: 0.2rem;
	}
	.content>ul>li {
		margin: 0.3rem;
		padding: 0.2rem;
		background-color: #fff;
		border-radius: 0.16rem;
		display: flex;
		flex-direction: column;
	}
	.content>ul>li>div.header {
		display: flex;
		position: relative;
	}
	.content>ul>li>div.header>span.logo {
		width: 0.4rem;
		height: 0.4rem;
		background-image: url(../assets/images/logo6.png);
		background-repeat: no-repeat;
		background-size: 0.84rem 0.4rem;
		flex-shrink: 0;
	}
	.content>ul>li>div.header>span.jingdong {
		flex-grow: 1;
		color: #333;
		font-size: 0.32rem;
		text-align: left;
		display: flex;
		align-items: center;
	}
	.content>ul>li>div.header>span.delete {
		width: 0.3rem;
		height: 0.3rem;
		background-image: url(../assets/images/delete.png);
		background-repeat: no-repeat;
		position: absolute;
		right: 0;
	}
	div.avatar-wrapper {
		width: 1.5rem;
		height: 1.5rem;
	}
	div.avatar-wrapper>img { width: 100%;}
	div.total-price { 
		padding: 0.12rem 0;
		font-size: 0.24rem;
		color: #999;
		display: flex;
		justify-content: flex-end;
	}
	div.total-price2 { 
		padding: 0.12rem 0;
		font-size: 0.24rem;
		color: #999;
		display: flex;
		justify-content: flex-end;
	}
	div.total-price2>span {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.08rem;
	}
	div.total-price2>span:first-child{
		flex-grow: 1;
		justify-content: flex-end;
	}
	div.total-price2>span:last-child {
		width: 1.72rem;
		height: 0.6rem;
		background-color: #e93b3d;
		color: #fff;
		border: none;
	}
	div.other-wrapper {
		display: flex;
		justify-content: flex-end;
	}
	div.other-wrapper>span {
		display: flex;
		width: 1.72rem;
		height: 0.6rem;
		justify-content: center;
		align-items: center;
		border-radius: 0.08rem;
	}
	div.other-wrapper>span:first-child {
		background-color: #fff;
		color: #333;
		border: 0.02rem solid #ccc;
		margin-right: 0.4rem;
	}
	div.other-wrapper>span:last-child{
		background-color: #e93b3d;
		color: #fff;
		border: none;
	}
</style>
