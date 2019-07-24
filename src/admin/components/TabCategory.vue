<template>
	<div>
		<el-tree ref='tree'  node-key="id" lazy :load='loadData' :props="{ label:'name',isLeaf:'isLeaf'}" :expand-on-click-node='false'>
			<span slot-scope='{node,data}' class="my-tree-node">
				<span v-text="data.name"></span>
				<span>
					<el-button type="text" size="medium" icon="el-icon-plus" v-if="node.level < 3" @click='beginEdit(node,true)'></el-button>
					<template v-if="node.level > 1">
						<el-button type="text" size="medium" icon="el-icon-edit-outline" @click='beginEdit(node,false)'></el-button>
						<el-button type="text" size="medium" icon="el-icon-delete" @click='removeCategory2(data)'></el-button>
						<template v-if="node.level > 2">
							<el-popover :title="data.name" placement="right" width="200" trigger="hover">
								<el-image :src='data.avatar' fit='contain'></el-image>
								<el-button type="text" size="medium" icon="el-icon-picture-outline" slot='reference'></el-button>
							</el-popover>
						</template>
					</template>
				</span>
			</span>
		</el-tree>
		<el-dialog :visible="edit.isEdit" :show-close="false" width="600px">
			<h3 slot='title'> 商品信息分类管理-{{edit.isAdd ?'新增':'修改'}}</h3>
			<el-form ref='form' label-width="80px" :model="edit.model" :rules='edit.rules' status-icon>
				<el-form-item label="父级分类">
					<el-select v-model="edit.model.fid" :disabled="edit.isAdd || edit.model.fid === 0">
						<el-option :value="0" label="Root"  disabled></el-option>
						<el-option v-for="item in mainList" :key='item.id' :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input placeholder="请输入分类名称" v-model="edit.model.name"></el-input>
				</el-form-item>
				<el-form-item label="分类图片" v-if="edit.model.fid > 0">
					<el-image class='old-avatar' v-show='!edit.isAdd' :src='edit.model.oldAvatar'></el-image>
					<el-upload class='avatar-upload' accept=".jpg,.png"
					action="/category/upload" name="avatar" list-type="picture-card"
					:on-success="uploadSuccess" :file-list="edit.fileList"
					:on-preview="previewHandler"
					>
						<i class="el-icon-plus avatar-upload-icon"></i>
						<div slot='tip'>只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
					<el-dialog :modal="false" :show-close="false" :visible.sync="edit.dialogVisible">
						<img width='100%' :src="edit.dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
			</el-form>
			<div slot='footer'>
				<el-button @click='closeEdit'>取消</el-button>
				<el-button type="primary" @click='submitEdit'>确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
		//导入加载
		import { Loading } from 'element-ui';
		//映射category子仓库
		import { createNamespacedHelpers} from 'vuex';
		let { mapState,mapActions} = createNamespacedHelpers('category');
        export default {
			data() { 
				return {
					edit: {
						dialogImageUrl: '',
						dialogVisible: false,
						isEdit: false,
						isAdd: true,
						fileList: [],
						model: {id:0,fid:-1,name:'',avatar:'',oldAvatar:''},
						rules: {
							name: [
								{required: true, message: '商品分类名称不能为空',trigger:'blur'},
								{min:2, max:6,message:'商品分类名称长度必须在2-6之间',trigger:'blur'}
							]
						}
						
					}
				}
			},
			computed: {
				...mapState(['mainList','subLists'])
			},
			methods: {
				...mapActions(['initMainList','initSubLists','removeCategory','addCategory','updateCategory']),
				loadData(node,resolve) {
					switch(node.level) {
						case 0:
							return resolve([{id:0,name:'Root'}]);
							break;
						case 1:
							resolve(this.mainList);
							break;
						case 2:
							this.initSubLists(node.data.id).then(() => {
								let temp = this.subLists[node.data.id];
								temp.forEach(item => item.isLeaf = true);
								resolve(temp);
							});
							break;
						default: 
							resolve([]);
							break;
					}
				},
				closeEdit() {
					
					this.edit.isEdit = false
				},
				removeCategory2(data) {
					this.$confirm(`确定删除"${ data.name}"?`,'提示',{
						confirmButtonText: '确定',	//确定文字
						cancelButtonText: '取消',	//取消文字
						type: 'warning'	//提示前面的类型
					}).then(() => {
						//通知仓库请求数据
						this.removeCategory(data)
							.then(() => {
								this.$refs.tree.remove(data); //页面删除
							})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						}); 
					})
				},
				beginEdit(node,isAdd) {
					this.edit.fileList = [];
					this.edit.isAdd = isAdd;
					if(this.$refs.form)
						this.$refs.form.clearValidate();
					if(isAdd) {	//判断是新增状态
						this.edit.model.fid = node.data.id;
						this.edit.model.name = '';
						this.edit.model.oldAvatar = '';
						this.edit.model.avatar = '';
					}
					else {	//修改状态
						this.edit.model.id = node.data.id;
						this.edit.model.fid = node.data.fid
						this.edit.model.name = node.data.name;
						this.edit.model.oldAvatar = node.data.avatar;
						this.edit.model.avatar = node.data.avatar;
					}
					this.edit.isEdit = true;
				},
				uploadSuccess(response,file,fileList) {
					if(response.status === 200) this.edit.model.avatar = response.data;
					this.edit.fileList = fileList.slice(-1);
				},
				previewHandler(file) {	//放大镜预览
					this.edit.dialogImageUrl = file.url;
					this.edit.dialogVisible = true;
				},
				submitEdit() {
					this.$refs.form.validate()
						.then( () => {
							if(this.edit.isAdd && this.edit.model.avatar === ''&& this.edit.model.fid > 0) {
								this.$alert('必须选择一张图片','提示',{type:'warning'})
								return;
							}
							if(this.edit.isAdd) { //新增状态
								this.addCategory(this.edit.model)
									.then(data => {
										if(data.fid !== 0) data.isLeaf = true;
										this.$refs.tree.append(data,this.$refs.tree.getNode(data.fid));//向父节点加入刚刚新增的
										this.edit.isEdit = false; //关闭弹窗
									})
							}
							else {
								this.updateCategory(this.edit.model)
									.then(() => {
										let { id, fid, name, avatar, oldAvatar} = this.edit.model;
										let obj = {id,fid,name,avatar:oldAvatar === avatar ? avatar : `/images/category/${ avatar }` }
										let node = this.$refs.tree.getNode(this.edit.model.id);
										if( fid === 0) node.data = obj;
										else {
											obj.isLeaf = true; //二级为叶子节点
											if(node.parent.data.id === this.edit.model.fid) node.data = obj; //当前一节分类里面修改二级
											else {	//从当前一级分类修改到其他一级里面
												this.$refs.tree.remove(node.data);//删除当前
												if(typeof this.subLists[this.edit.model.fid] !== 'undefined') {
													let parentNode = this.$refs.tree.getNode(this.edit.model.fid);
													this.$refs.tree.append(obj,parentNode);
												}
											}
											
										}
										this.edit.isEdit = false; //关闭修改窗口
									})
							}
						
						})
				}
			},
			created() {
				this.loading = Loading.service();
				this.initMainList().then(() => this.loading.close());
			}
		};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.el-tree
		width: 500px
		.my-tree-node
			flex:1
			display: flex
			justify-content: space-between
			align-items: center
</style>