<template>
	<el-dialog  class='dialog-wrapper'  width="400px":visible="true" :show-close="false" :modal="false" title="账户登录" :center="true">
		<el-form ref='form' class='my-form' :model="model" :rules="rules" :status-icon="true">
			<el-form-item prop="name">
				<el-input v-model='model.name' prefix-icon="el-icon-user"
				 placeholder="支持 邮箱/用户名/已验证手机"
				>		
				</el-input>
			</el-form-item>
			<el-form-item prop="pwd">
				<el-input placeholder="密码" prefix-icon="el-icon-unlock" v-model="model.pwd" :show-password='true'></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button type="primary" @click='login2'>登录</el-button>
			<el-button @click='$refs.form.resetFields()'>重置</el-button>
		</div>
	</el-dialog>
	
</template>

<script>
		import { createNamespacedHelpers} from 'vuex';
		let { mapActions } = createNamespacedHelpers('login');
         export default {
			data() {
				return {
					model: {name:'',pwd:''},
					rules: {
						name:[
							{required: true,message:'用户名必填',trigger:'blur'},
							{ min:2,max:20,message:'用户名长度2-20',trigger:'blur'}
						],
						pwd:[
							{required: true,message:'密码不能为空',trigger:'blur'},
							{min: 3,max:20,message:'密码长度为3-20',trigger:'blur'}
						]
					}
				}
			},
			methods:{
				...mapActions(['login']),
				login2() {
					this.$refs.form.validate()
						.then( () => this.login(this.model) )
						.catch( () => {});
				}
			}
			
		};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.dialog-wrapper
		margin-left: 60%
		margin-top: 12vh
	.el-form
		width:330px
		background-color: white
</style>