<template>
	<div>
		<el-button :icon="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" @click='isCollapse = !isCollapse'></el-button>
		<el-menu class='jd-menu' :collapse="isCollapse"
			background-color="#303133"text-color='white' active-text-color="#ff7a4d"
			@select="selectHandler"
			:default-active='$store.state.tab.activeName'
			>
			<el-submenu index='1'>
				<template slot='title'>
					<i class="el-icon-s-tools"></i>
					<span>设置</span>
				</template>
				<el-menu-item index="password">
					<i class="el-icon-edit-outline"></i>
					<span>密码设置</span>
				</el-menu-item>
			</el-submenu>
			<el-submenu index='2'>
				<template slot='title'>
					<i class="el-icon-menu"></i>
					<span>分类</span>
				</template>
				<el-menu-item index="category">
					<i class="el-icon-edit-outline"></i>
					<span>商品分类管理</span>
				</el-menu-item>
			</el-submenu>
			<el-submenu index='3'>
				<template slot='title'>
					<i class="el-icon-s-goods"></i>
					<span>商品</span>
				</template>
				<el-menu-item index="product">
					<i class="el-icon-edit-outline"></i>
					<span>商品信息管理</span>
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
        export default {
			data() {
				return{
					isCollapse: false	//数据驱动当前左栏是否是收缩的
				} 
			},
			methods: {
				selectHandler(index) {
					this.$store.commit('tab/addTab',index) //调用tab仓库里面的addTab函数，将当前激活的放入list列表
				}
			}
		};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-button
		background-color: #ff7a4d
		color: white
		font-size: 18px
		font-weight: bolder
		margin: 13px 10px
		border: none
	.jd-menu:not(.el-menu--collapse)
		width: 300px
		border-right:none
</style>