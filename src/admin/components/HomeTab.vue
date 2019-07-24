<template>
	<div>
		<el-tabs type="card" closable :value='activeName' @tab-remove="removeTab"  @tab-click='(tab) => toggleTab(tab.name)'>
			<el-tab-pane v-for="item in list" :key='item' :name="item">
				<span slot='label'><i class="el-icon-edit-outline"></i>&nbsp;{{tabMap[item].label}}</span>
				<component :is='tabMap[item].component'></component>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
		import { createNamespacedHelpers } from 'vuex'; 
		import TabPassword from './TabPassword.vue';
		import TabCategory from './TabCategory.vue';
		import TabProduct  from './TabProduct.vue';
		let { mapState,mapMutations } = createNamespacedHelpers('tab')
        export default {
			data() {
				return {
					//配置tab地图
					tabMap: {
						password: { label: '密码修改',component:TabPassword},
						category: { label: '商品分类管理',component: TabCategory},
						product:  { label: '商品信息管理', component: TabProduct}
					}
				}
			},
			computed: mapState(['list','activeName']),
			methods: mapMutations(['toggleTab','removeTab'])
		};
</script>

<style scoped>
	.tabs {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.el-tabs >>> .el-tabs_header {
		height: 50px;
		flex-shrink: 0;
	}
	.el-tabs >>> .el-tabs_content {
		flex-grow: 1;
	}
	.el-tab-pane {
		height: 100%;
	}
</style>