<template>
	<div class="my-cart">
		<div class="header-title">
			<span><i class="back" onClick="javascript :history.back(-1);"></i></span>
			<span class="title">购物车</span>
			<span><i class="more"></i></span>
			
		</div>
		<div class="content">
			<div class="edit-wrapper">
				<i></i>
				<a href="#" class='select-address' v-text="address.default" @click="address.isChose = true"></a>
				<span class="btn-edit" @click="isEdit = !isEdit" v-text="isEdit ? '完成' :'编辑商品'"></span>
			</div>
			<ul class="cart-list" v-if="list.length > 0">
				<li :data-id = 'item.id'  :key='item.id' v-for="item in list">
					<span class="checkbox" :class="{ checked:item.active1 }" @click="item.active1 = !item.active1" v-show="!isEdit"></span>
					<span class="checkbox" :class="{ checked: item.active2 }" @click="item.active2 = !item.active2"  v-show="isEdit"></span>
					<router-link :to='`detail/`+item.pid' class="avatar-wrapper">
						<img :src='item.avatar' alt=""/>
					</router-link>
					<div class='info'>
						<router-link  v-text='item.name' :to='`detail/`+item.pid' class='name'></router-link>
						<router-link :to='`detail/`+item.pid' class='price-wrapper'>
							￥<span class='price' v-text="item.price"></span>
						</router-link>
						<div class='count-wrapper'>
							<NumCount :count='item.count' @increase='increase(item)' @decrease='decrease(item)'></NumCount>
		
						</div>
					</div>
				</li>
			</ul>
		</div>
		
		<div class="footer footer-normal" v-show="!isEdit">
			<div class="footer-left">
				<div class="all-wrapper clearfix">
					<span class="checkbox all" :class="{ checked: active1 }" @click="changeAll1(active1)"></span>全选
				</div>
				<div class='total-price-wrapper'>
					总计 &nbsp;: <em>￥<span class="total-price" v-text="totalPrice"></span></em>
				</div>
			</div>
			<span href="#" class="btn-settlement" :class="{ active:isChose }" @click="settlement">去结算<span class="total-count">(<em v-text="totalCount"></em>件)</span></span>
		</div>
		<div class="footer footer-edit" v-show="isEdit">
			<div class="all-wrapper">
				<span class="checkbox all" :class="{checked:active2}" @click="changeAll2(active2)"></span>全选
			</div>
			<div class="product-delect clearfix">
				<a href="#"  class="btn-remove" @click="remove">删除</a>
				<a href="#">移至收藏</a>
			</div>
		</div>	
		<!-- 选择收货地区 -->
		<div class='chose-product' v-show="address.isChose">
			<div></div>
			<div>
				<div class='address-header'><span>选择地址</span><i class='close' @click="closeChoiseAddress"></i></div>
				<ul class='all-address' v-if="address.list.length > 0">	
					<li  v-for="(item,i) in address.list" :key='item.id'>
						<span class="checkbox" :class="{checked: item.id === addressId}" @click="addressId = item.id"></span>
						<p v-text="item.receiveAddress"></p>
					</li>
				</ul>
				<span @click="updateAddress">确认</span>
			</div>
		</div>	
	</div>
</template>

<script>
	import NumCount from '../components/NumCount.vue';
	import{ mapMutations, mapActions } from 'vuex';
	export default {
		components:{
			NumCount
		},
		data() {
			return {
				list:[],
				isEdit: false ,//表示当前是否为编辑状态
				address: {
					default:'',
					isChose: false,
					list:[],
				},
				addressId: 0
			}
		},
		computed: {
			active1() {
				return this.list.length === 0 ? false : !this.list.find(item => item.active1 === false)  //计算属性，如果为真，说明全都选择了
			},
			active2() {
				return this.list.length === 0 ? false : !this.list.find(item => item.active2 === false) //判断商品有无
			},
			totalPrice() { //计算购买商品的总价钱
				var result = 0;
				this.list.filter(item => item.active1).forEach(item => result += item.count * item.price);
				return result;
			},
			totalCount() { //计算购买商品的总数量
				var result = 0;
				this.list.filter(item => item.active1).forEach(item => result += item.count);
				return result;
			},
			isChose() {
				return this.list.every(item => item.active1 === false)
			}
		},
		methods:{
			...mapMutations('alert',['open']),
			getCartList() {
				this.$http({
					method:'post',
					url:'/cart/list',
				})
					.then( data => {
						data.forEach( item => {
							item.active1 = true;
							item.active2 = false;
						});
						this.list = data;
					})
			},
			changeAll1(flag) {
				this.list.forEach( item => item.active1 = !flag) 
			},
			changeAll2(flag) {
				this.list.forEach(item => item.active2 = !flag)
			},
			decrease(item) {
				if(item.count === 1)  {
					this.open('请选择正确的商品数量...');
					return;
				}
				else {
					this.$http({
						method:'post',
						url:'cart/decrease',
						data:{ id: item.id} 
					})
						.then(item.count -= 1) //减到0的时候，需不需要吧商品品删除
				}
			},
			increase(item) {
				if(item.count === 5)  {
					this.open('商品已经达到上限...');
					return;
				}
				else {
					this.$http({
						method:'post',
						url:'cart/increase',
						data:{ id: item.id} 
					})
						.then(item.count += 1)
				}
			},
			getAddress() {
				this.$http({
					method:'post',
					url:'/cart/address'
				})
					.then(data => {
						this.address.list = data;
						data.forEach( (item) =>{
							var isDefault = item.isDefault.data[0];
							if(isDefault === 1) {
								this.address.default = item.receiveAddress; //让当前的默认地址显示
								this.addressId = item.id	//让当前的默认地址按钮激活
							}
						})
					})
			},
			remove() {
				let activeList = this.list.filter(item => item.active2);
				if(activeList.length < 1) { this.open('请先选择...');return;}
				if(!confirm('删除？')) return;
				else {
					var ids =[];
					activeList.forEach(item => ids.push(item.id));// 获取要删除的数据的id
					this.$http({
						method:'post',
						url:'/cart/remove',
						data:{ids:JSON.stringify(ids)}
					})
						.then(data => {
							ids.forEach( (item) => {
								for(var i =0; i< this.list.length;i++) {
									if(this.list[i].id === item) {
										this.list.splice(i,1);
										break;
									}
								}
							})
						})				
				}
			},
			settlement() {
				let activeList = this.list.filter(item => item.active1);
				if(activeList.length < 1) {this.open('请先购买商品!');return;}
				else {
					var ids = [];
					activeList.forEach(item => ids.push(item.id));
					this.$http({
						method:'post',
						url:'/cart/settlement',
						data:{
							ids: JSON.stringify(ids),
							account: this.totalPrice,
							addressId: this.addressId
						}
					})
						.then(data => {
							ids.forEach(item => {
								for(var i=0; i < this.list.length; i++) {
									if(this.list[i].id === item) {
										this.list.splice(i,1);
										break;
									}
								}
							})
							this.$router.push({
								path:`/order/${data}` //跳转到订单页面
							}); //订单生成功
						})
				}
			},
			updateAddress() {
				var newAddress =  this.address.list.find(item => item.id === this.addressId).receiveAddress; //筛选出修改的地址
				this.address.default = newAddress; //赋值新选择的地址
				this.address.isChose = false; //关闭弹窗
			},
			closeChoiseAddress() {
				this.address.isChose = false; //关闭弹窗
				var oldAddress = this.address.list.find(item => { return item.receiveAddress === this.address.default})
				this.addressId = oldAddress.id;
			}
		},
		created() {
			this.getCartList();
			this.getAddress();
		}
	}
</script>

<style scoped>
	.my-cart {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
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
		width: 100%;
	}
	div.edit-wrapper {
		box-sizing: border-box;
		height: 0.9rem;
		line-height: 0.9rem;
		border-bottom: 0.02rem solid #efefef;
		padding: 0 0.2rem;
		display: flex;
		align-items: center;
		position: relative;
	}
	div.edit-wrapper>a {
		display: flex;
		align-items: center;
		color: #999;
		font-size: 0.28rem;
	}
	div.edit-wrapper>i {
		background-image: url(../assets/images/position.png);
		width: 0.26rem;
		height: 0.3rem;
		margin: -0.04rem 0.1rem 0 0;
		background-size: 0.26rem;
	}
	div.edit-wrapper>span.btn-edit {
		position: absolute;
		right: 0.2rem;
		font-size: 0.28rem;
		color: #e93b3d;
	}
	div.edit-wrapper>* {vertical-align: middle;}
	/* 购物车的显示信息 */
	ul.cart-list {
		padding: 0 0.2rem;
		width: 100%;
		box-sizing: border-box;
	}
	ul.cart-list li {
		display: flex;
		padding: 0.2rem 0;
		box-sizing: border-box;
	}
	ul.cart-list li>span.checkbox {
		flex-shrink: 0;
		align-self: center;
	}
	ul.cart-list li>span.checkbox.edit {
	}
	ul.cart-list li>a.avatar-wrapper {
		flex-shrink: 0;
		width: 1.72rem;
		height: 1.72rem;
		border-radius:  0.08rem;
		margin: 0 0.2rem;
		border: 0.02rem solid black;
	}
	ul.cart-list>li>a.avatar-wrapper>img {
		width:100%;
		height:100%;
	}
	ul.cart-list>li .info {
		flex-grow: 1;
		position: relative;
	}
	ul.cart-list>li .info>a.name {
		display: block;
		color: rgb(51,51,51);
		font-size: 0.28rem;
	}
	ul.cart-list>li .info>a.price-wrapper {
		position: absolute;
		left: 0;
		bottom: 0;
		color: rgb(191,17,17);
		font-size: 0.32rem;
	}
	ul.cart-list>li .count-wrapper{
		width: 2.6rem;
		height: 0.4rem;
		display: flex;
		position: absolute;
		right: 0.8rem;
		bottom: 0;
	}
	ul.cart-list>li>.info .count-wrapper span {
		flex: 0 0 auto;
		width: 0.52rem;
		text-align: center;
		font-weight: bolder;
		background-color: rgb(244,244,244);
	}
	ul.cart-list>li>.info .count-wrapper span.count {
		flex-grow: 1;
		color: #999;
		margin: 0 0.2rem;
	}
	
	
	
	/* 底部要购买的信息 */
	.footer {
		flex-shrink: 0;
		width: 100%;
		height: 1rem;
		border-top: 0.02rem solid #efefef;
		display: flex;
	}
	em { font-style: normal;}
	/* 结算页面 */
	div.footer-left{
		flex-grow: 1;
	}
	div.all-wrapper {
		width: 0.8rem;
		float: left;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #999;
	}
	span.checkbox {
		width: 0.4rem;
		height: 0.4rem;
		background-image: url(../assets/images/choise.png);
		background-repeat: no-repeat;
		background-size: 0.4rem;
	}
	span.checkbox.checked {
		background-image: url(../assets/images/ichoise.png);
	}
	div.total-price-wrapper {
		float: right;
		height: 100%;
		box-sizing: border-box;
		padding-top: 0.2rem;
		font-weight: 700;
		font-size: 0.32rem;
		color: #333;
		display: flex;
		justify-content: center;
		align-content: center;
	}
	div.total-price-wrapper>em {
		color: #e93b3d;
	}
	div.total-price-wrapper>em>span.total-price{
		
	}
	.btn-settlement.active {
		background-color: #D7D7D7;
	}
	/* 编辑的状态模块 */
	div.product-delect {
		flex-grow: 1;
		
	}
	div.product-delect>a {
		float: right;
		width: 1.52rem;
		height: 0.6rem;
		line-height: 0.6rem;
		text-align: center;
		font-size: 0.28rem;
		border-radius: 0.08rem;
		margin: 0.1rem 0.1rem 0 0;
	}
	div.product-delect>a:last-child {
		color: #333;
		border: 0.01rem solid #ccc;
	}
	div.product-delect>a:first-child {
		background-color: #e93b3d;
		color: #fff;
	}
		
	
	
	/* 数量结算模块 */
	div.footer-normal>span {
		width: 2.2rem;
		height: 1rem;
		line-height: 1rem;
		background-color: #e93b3d;
		/* d7d7d7 */
		text-align: center;
		font-weight: 700;
		font-size: 0.32rem;
		color: white;
		margin-left: 0.2rem;
	}
	div.footer-normal>a>span.total-count {
		font-weight: 400;
		font-size: 0.24rem;
		color: white;
	}
	div.footer-edit {
	}
	
	/* 购物车确定选择产品 */
	div.chose-product {
		position: absolute;
		left: 0;
		/* bottom: -100%; */
		/* bottom: 0; */
		width: 100%;
		height: 100%;
		transition: all 0.2s;
		z-index: 2;
	}
	div.chose-product>div:first-child {
		height: 20%;
		background-color: rgba(0,0,0,0.5);
	}
	div.chose-product>div:last-child  {
		height: 80%;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		overflow: auto;
		position: relative;
	}
	div.chose-product>div:last-child>.address-header {
		height: 0.8rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f3f2f8;
		color: #333;
		font-size: 0.28rem;
	}
	div.chose-product>div:last-child>.address-header>i {
		width: 0.8rem;
		height: 0.8rem;
		background-image: url(../assets/images/cart-address-close.png);
		background-repeat: no-repeat;
		background-position: center center;
		 position: absolute;
		 right: 0;
		 top: 0;
	} 
	ul.all-address>li {
		padding: 0.34rem 0.5rem 0.34rem 0.6rem;
		display: flex;
	}
	ul.all-address>li>span {
		width: 0.4rem;
		height: 0.4rem;
	}
	ul.all-address>li>p {
		display: flex;
		align-items: center;
		padding-left: 0.1rem;
		flex-grow: 1;
		color: #666;
		font-size: 0.24rem;
	}
	div.chose-product>div:last-child>span {
		height: 0.88rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.32rem;
		background-color: #e4393c;
	}
	
	
</style>
