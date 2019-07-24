<template>
	<el-form ref='form'  :rules="rules" :model='model' label-width="120px"class='update-form' >
		<el-form-item label="原始密码" prop="pwd">
			<el-input type="password" v-model="model.pwd"></el-input>
		</el-form-item>
		<el-form-item label="新密码" prop="newPwd" >
			<el-input v-model="model.newPwd" show-password></el-input>
		</el-form-item>
		<el-form-item label="确认新密码" prop="newPwdConfirm">
			<el-input show-password v-model="model.newPwdConfirm"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click='password2'>确定</el-button>
			<el-button @click='$refs.form.resetFields()'>重置</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
		import { createNamespacedHelpers } from 'vuex'; //映射登录仓库
		let { mapState,mapActions } =  createNamespacedHelpers('login');
        export default {
			data() {
				return {
					model: { pwd:'',newPwd:'',newPwdConfirm:''},
					rules:{
						pwd: [
							{required: true,message:'原始密码长度不能为空',trigger:'blur'},
							{min:3,max:20,message:'密码长度为3-20',trigger:'blur'}
						],
						newPwd:[{
							validator:(rule,value,callback) => {
								if (value === '') {
								  callback(new Error('新密码不能为空'));
								} else {
								  if (this.model.newPwdConfirm !== '') {
									this.$refs.form.validateField('newPwdConfirm');
								  }
								  callback();
								  }
							},trigger:'blur'}],
						newPwdConfirm:[{ 
							validator:(rule,value,callback) => {
									 if (value === '') {
									  callback(new Error('请再次输入密码'));
									} else if (value !== this.model.newPwd) {
									  callback(new Error('两次输入密码不一致!'));
									} else {
									  callback();
									}
							},trigger:'blur'}]
					}
				}
			},
			computed: {
				...mapState(['name'])
			},
			methods: {
				...mapActions(['password']),
				password2() {
					this.$refs.form.validate()
						.then( () => {
							this.password({name:this.name,pwd:this.model.pwd,newPwd:this.model.newPwd})
						})
						.catch( () => {} )
				}
			}
		};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.update-form
		width: 450px
</style>