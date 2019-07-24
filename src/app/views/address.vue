<template>
	<div class="page-wrapper">
		<div class="header-title">
			<span><i class="back" onClick="javascript :history.back(-1);"></i></span>
			<span class="title">收货地址</span>
			<span><i class="more"></i></span>
		</div>
		<div class='address-wrapper'>
			<ul v-if="list.length > 0">
				<li :data-id=' item.id ' v-for="item in list" :key='item.id'>
					<span class='receive receive-name' v-text="item.receiveName"></span>
					<span class='receive receive-tel' v-text="item.receiveTel"></span>
					<span class='is-default' >默认地址:<i :class="{checked: item.id === addressId}" @click="updateDefault(item)"></i></span>
					<p class='receive-address' v-text="item.receiveAddress">
					</p>
					<span class='address-edit'  @click="updateOldAddress(item.id)">编辑</span>
				</li>
			</ul>
		</div>
		<div class='footer'>
			<a href="#" @click.prevent="addNewAddress">新增收货地址</a>
		</div>
		<div class='form-wrapper' v-show="form.show">
			<div class="close-button">
				<span>{{ form.edit? '新增收货地址' : '修改收货地址' }}</span>
				<i @click="closeAddressFrom"></i>
			</div>
			<form action="" method="" id="address" name='address'>
				<input type="hidden" name="mode">
				<ul>
					<li>
						<label>收货人</label>
						<input type="text" placeholder='姓名' class='receive-name' v-model="form.receiveName">
					</li>
					<li>
						<label>联系方式</label>
						<input type="text" placeholder='手机号码' class='receive-tel' v-model="form.receiveTel"> 
					</li>
					<li class="info">
						<label>所在地区</label>
						<template>
								<!--省市区三级联动-->
							<div class="divwrap" v-if="show">
							  <v-distpicker type="mobile" @province="onChangeProvince1" @city="onChangeCity"
								@area="onChangeArea" :province='province' :city='city2' :area='area'
								
								></v-distpicker>
							</div>
							<!--遮罩层-->
							<div class="blacks" v-if="show" @click="countermand"></div>
							<!--触发选择-->
							<div @click="choose">
							  <span v-text="form.receiveAddress"></span>
							</div>
						</template>
					</li>
					<li class='determine new-address'><span @click="addNewAddressOrUpdateOldAddress">确认</span></li>
					<li class='determine'  @click="removeAddress" v-show="!form.edit"><span>删除收货地址</span></li>
				</ul>
			</form>
		</div>
	</div>
</template>

<script>
	import VDistpicker from 'v-distpicker';
	import { mapMutations } from 'vuex';
 	export default {
		components:{
			VDistpicker
		},
		data() {
			return {
				//省市区
				province: '北京市',
				city: '',
				area: '',
				city2:'',
				text:'请选择',
				show: false,
				list: [],
				addressId:-1,
				form: {
					show: false , //是否弹窗弹出状态
					edit: true ,//新增或者修改状态的记录
					receiveName:'' ,//收货人的名字
					receiveTel:'',
					receiveAddress:'请选择' ,//收货人的地址
					updateAddressId: -1//修改的某条数据的id
				}
			}
			
		},
		methods: {
			...mapMutations('alert',['open']),
			getAddress() {
				this.$http({
					method:'post',
					url:'/address/list'
				})
					.then(data => {
						this.list = data
						data.forEach(item => {
							var isDefault = item.isDefault.data[0]; //默认地址的值
							if( isDefault === 1) this.addressId = item.id
						})
					})
			},
			_updateAddressList(result) {
				
			},
			updateDefault(data) {
				if(data.isDefault.data[0] === 1) return;
				else {
					this.$http({
						method:'post',
						url:'/address/updateId',
						data: {
							afterId: data.id
						}
					})
						.then(() => {
							this.list.forEach((item,i) => {
								if(item.id === this.addressId) {
									this.list[i].isDefault.data[0] = 0; //将之前默认地址改为不是默认
								}
								if(item.id === data.id ) {
									this.list[i].isDefault.data[0] = 1; //将点击的地址改为默认地址
								}
							})
							this.addressId = data.id //激活当前的默认地址
						})
				}
 			},
			 //取消选择地区
			countermand() {
								this.show = false
			},
			//打开选择地区
			choose() {
								this.show = true;
			},
			onChangeProvince1(a) {
				this.province = a.value;
				if (a.value == '台湾省') {
				  this.show = false;
				}
			},
			onChangeCity(a) {
				this.city = a.value;
				this.city2 = a.value;
			},
			onChangeArea(a) {
				this.area = a.value;
				this.show = false;
				this.city = this.province + this.city + this.area;
				this.form.receiveAddress = this.city;
			},
			addNewAddress() { //新增收货地址
				this.form.show = true; //让新增收货地址弹窗展示
			},
			updateOldAddress(addressId) { //修改点击的收货地址
				this.form.edit = false; //标识是修改状态
				this.form.show = true; //让新增收货地址弹窗展示
				this.form.updateAddressId = addressId; //记录修改的某条数据的id
				var  newAddress = this.list.find(item => { return item.id === addressId });
				this.form.receiveTel = newAddress.receiveTel;
				this.form.receiveAddress = newAddress.receiveAddress;
				this.form.receiveName = newAddress.receiveName;
			},
			addNewAddressOrUpdateOldAddress() {
				if(this.form.edit) { //执行新增操作
					this.$http({
						method:'post',
						url:'/address/add',
						data:{
							receiveTel: this.form.receiveTel,
							receiveName: this.form.receiveName,
							receiveAddress: this.form.receiveAddress
						}
					})
						.then( data =>{
							// var temp = {};
							// temp.id = data.id;
							// temp.name = data.name;
							// temp.receiveName= this.form.receiveName;
							// temp.receiveTel = this.form.receiveTel;
							// temp.receiveAddress = this.form.receiveAddress;							
							// var isDefault = {data:[]};
							// var value = 0;
							// temp.isDefault.data[0] = value;
							// this.list.push(temp);
							this.form.show = false; //关闭弹窗
							this.form.receiveTel = '';
							this.form.receiveAddress = '请选择';
							this.form.receiveName = ''
							this.getAddress();
						})
				}
				else { //执行修改操作
					var receiveName = this.form.receiveName;
					var receiveTel = this.form.receiveTel;
					var receiveAddress = this.form.receiveAddress;
					var id = this.form.updateAddressId;
					this.$http({
						method:'post',
						url: '/address/update',
						data: {
							receiveName:receiveName,
							receiveTel:receiveTel,
							receiveAddress:receiveAddress,
							id:id
						}
					})
						.then( () => {
							this.list.forEach((item,i) => {
								if(item.id === id) {
									this.list[i].receiveAddress = this.form.receiveAddress;
									this.list[i].receiveName = this.form.receiveName;
									this.list[i].receiveTel = this.form.receiveTel;
								}
							})
							this.form.show = false; //关闭修改弹窗
							this.form.receiveTel = '';
							this.form.receiveAddress = '请选择';
							this.form.receiveName = ''
						})
				}
				
			},
			removeAddress() {
				if(!confirm('删除？')) return;
				else {
					var id = this.form.updateAddressId;
					this.$http({
						method:'post',
						url:'/address/delete',
						data:{
							id:id
						}
					})
						.then( () => {
							var i = this.list.findIndex(item => item.id === this.form.updateAddressId);
							this.list.splice(i,1);
							this.open('删除成功!');
							this.form.show = false;
						})
				}
			},
			closeAddressFrom() {
				this.form.show = false;// 关闭form窗口
				this.form.edit = true; //恢复默认为新增状态
				this.form.receiveName ='' ,//收货人的名字
				this.form.receiveTel = '',
				this.form.receiveAddress = '请选择' ,//收货人的地址
				this.form.updateAddressId = -1//修改的某条数据的id
			}
		},
		created() {
			this.getAddress();
		}
	}
</script>

<style scoped>
	/*遮罩层*/
	.blacks {
	  position: fixed;
	  width: 100%;
	  height: 50%;
	  left: 0;
	  top: 0;
	  background: rgba(0, 0, 0, 0.45);
	}
	/*省市区三级联动*/
	.divwrap {
	  height: 50%;
	  position: fixed;
	  left: 0;
	  bottom: 0;
	  width: 100%;
	  z-index: 99;
	}
	
	/*外部*/
	.divwrap > .distpicker-address-wrapper {
	  color: #0d0d0d;
	  height: 100%;
	}
	
	/*头部*/
	.divwrap >>> .address-header {
	  background: #000;
	  color: #fff;
	  width: 100%;
	  position: fixed;
	  bottom: 50%;
	  height: 0.5rem;
	  font-size: 0.2rem;
	}
	
	/*头部内容*/
	.divwrap >>> .address-header ul li {
	  flex-grow: 1;
	  text-align: center;
	}
	
	/*选择过省市区的头部*/
	.divwrap >>> .address-header .active {
	  color: #fff;
	  border-bottom: 0.05rem solid #666;
	}
	
	/*内容部分*/
	.divwrap >>> .address-container {
	  overflow: scroll;
	  height: 100%;
	}
	
	/*点过的地区内容*/
	.divwrap >>> .address-container .active {
	  color: red;
	}
	.page-wrapper {
		
	}
	.header-title {
		height: 0.88rem;
		width: 100%;
		border-bottom: 0.02rem solid #efefef;
		display: flex;
		flex-shrink: 0;
		background: linear-gradient(180deg,#fff,#efefef);
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
		font-size: 0.32rem;
		color: #333;
		justify-content: center;
		align-items: center;
	}
	/* 下方新增的收货地址 */
	div.address-wrapper {
		flex-grow: 1;
		overflow: auto;
	}
	div.address-wrapper>ul {
		padding: 0.14rem 0.8rem;
	}
	div.address-wrapper>ul>li {
		margin: 0.8rem 0;
		position: relative;
		border-bottom: 0.01rem solid #cbcbcb;
		box-sizing: border-box;
	}
	div.address-wrapper>ul>li>span.receive {
		font-size: 0.32rem;
		color: #333;
		font-weight: bold;
	}
	div.address-wrapper>ul>li>span.is-default {
		font-size: 0.24rem;
		color: #999;
		font-weight: bold;
		margin-left: 0.6rem;
		display: inline-block;
		position: absolute;
		right: 1.2rem;
		top: 50%;
		transform: translateY(-50%);
	}
	div.address-wrapper>ul>li>span.is-default>* {
		vertical-align: middle;
	}
	div.address-wrapper>ul>li>span.is-default>i {
		display: inline-block;
		width: 0.4rem;
		height: 0.4rem;
		background-image: url(../assets/images/choise.png);
		background-repeat: no-repeat;
		background-size: 0.4rem;
	}
	div.address-wrapper>ul>li>span.is-default>i.checked {
		background-image: url(../assets/images/ichoise.png);
	}
	div.address-wrapper>ul>li>p {
		margin-top: 0.08rem;
		font-size: 0.28rem;
		color: #666;
	}
	div.address-wrapper>ul>li>span.address-edit {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 1rem;
		height: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.28rem;
		color: #e93b3d;
	}
	/* 底部新增收货地址 */
	div.footer {
		width: 100%;
		flex-shrink: 0;
		height: 0.92re;
	}
	div.footer>a {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 0.92rem;
		width: 100%;
		font-size: 0.32rem;
		color: #fff;
		background-color: #E4393C;
	}
	/* 关闭按钮 */
	div.close-button {
		width: 100%;
		height: 0.8rem;
		border-bottom: 0.01rem solid #cbcbcb;
		box-sizing: border-box;
		display: flex;
	}
	div.close-button>span {
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.32rem;
		font-weight: 800;
	}
	div.close-button>i {
		width: 0.3rem;
		height: 0.3rem;
		margin: 0.2rem;
		padding: 0.05rem;
		flex-shrink: 0;
		background-image: url(../assets/images/close.png);
		background-repeat: no-repeat;
		background-size: 0.22rem auto;
	}
	/* 表单 */
	div.form-wrapper {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: white;
		z-index: 10;
	}
	div.form-wrapper li {
		height: 0.88rem;
		display: flex;
		border-bottom: 0.01rem solid #cbcbcb;
		align-items: center;
	}
	div.form-wrapper li>label {
		width: 1.3rem;
		height: 100%;
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.28rem;
		color: #999;
	}
	div.form-wrapper li>input {
		height: 0.4rem;
		flex-grow: 1;
		outline: none;
		border: none;
		font-size: 0.28rem;
	}
	li.info>select {
		margin-right: 0.1rem;
		font-size: 0.28rem;
		height: 0.4rem;
	}
	div.form-wrapper li.determine {
		padding: 0.0.2rem;
		margin: 0.3rem 0;
	}
	div.form-wrapper li.determine>span {
		flex-grow: 1;
		height: 100%;
		background-color: #E4393C;
		color: #fff;
		border-radius: 0.08rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.32rem;
	}
	div.form-wrapper li.determine:last-child{
		/* display: none; */
	}
	div.form-wrapper li.determine:last-child>span {
		background-color: #ddd;
		color: #333;
	}
</style>
