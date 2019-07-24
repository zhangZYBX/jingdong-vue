<script src="../store/category.js"></script>
<template>
	<div class="my-form-wrapper">
		<el-form :inline="true" class='my-form'>
			<el-form-item label="商品名称">
				<el-input placeholder="请输入查询商品名称" prefix-icon="el-icon-search" v-model="search.name">
					
				</el-input>
			</el-form-item>
			<el-form-item label="商品分类">
				<el-select v-model="search.mid">
					<el-option label="请选择" :value="0">
					</el-option>
					<el-option v-for="item in mainList" :key='item.id' :label="item.name" :value="item.id">
						
					</el-option>
				</el-select>
				&nbsp; - &nbsp;
				<el-select v-model="search.sid" :disabled="searchSid">
					<el-option label="请选择" :value="0"></el-option>
					<el-option v-for="item in subList" :key='item.id' :label="item.name" :value="item.id">
						
					</el-option>
				</el-select>
				<el-form-item>
					<el-button @click='searchHandler'>查询</el-button>
					<el-button @click='addNewProduct'>新增</el-button>
				</el-form-item>
			</el-form-item>
		</el-form>
		<el-table border :data='list'>
			<el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
			<el-table-column prop="name" label="商品名称" width="200" fixed="left" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="价格" width="80">
				<template slot-scope='{ row, column, $index }'>
					￥<span v-text="row.price"></span>
				</template>
			</el-table-column>
			<el-table-column label="商品店铺" width="100" prop="store" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="商品分类" width="200" align="center">
				<template slot-scope='{ row, column, $index }'>
					<span v-text="row.mainCategoryName"></span>
					- <span v-text="row.subCategoryName"></span>
				</template>
			</el-table-column>
			<el-table-column label="avatar" fixed="right" align="center">
				<template slot-scope='{row, column, $index }'>
					<el-popover trigger="hover" width="80" placement="left" :title="`avatar -${ row.name } `">
						<el-image :src='row.avatar'></el-image>
						<el-button slot='reference' icon="el-icon-picture" type="text"></el-button>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="banner" width="80" fixed="right" align="center">
				<template slot-scope='{ row,column,$index }'>
					<el-button type="text" @click='beginBannerEdit(row)'>
						<i class="el-icon-picture"></i>
						 / <i class="el-icon-edit"></i>
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="130" fixed="right" align="center">
				<template slot-scope='{ row, column, $index }'>
					<el-button type="text" size="mini" icon="el-icon-delete" @click='removeProduct1(row)'>删除</el-button>
					<el-button type="text" size="mini" icon="el-icon-edit" @click='updateOldProductMessage(row)'>修改</el-button>
				</template>
				
			</el-table-column>
		</el-table>
		<el-pagination background layout="prev,pager,next,total,sizes"
		 :total="pagination.total" :page-sizes="[5,8,10,12,15]" :page-size="pagination.pageSize"
		 :current-page="pagination.currentPage" @size-change='pageSize => {pagination.pageSize = pageSize;getData2(pageSize)}'
		 @current-change='getData2'
		>
		</el-pagination>
		<el-dialog title="banner维护" :visible="banner.isEdit" width="700px" :before-close="endBannerEdit">
			<el-upload list-type="picture-card" 
				:file-list="banner.list" 
				multiple 
				accept=".jpg,.png,.jpeg"
				name="banner" 
				:data="{ id:banner.id }"
				action="/product/banner/upload"
				:on-success="bannerUploadSuccessHandler"
				:before-remove="bannerBeforeRemoveHandler"
			>
			<i class="el-icon-plus"></i>
			</el-upload>
		</el-dialog>
		<el-dialog :visible="product.isAdd" :title="product.isEdit ? '商品修改': '商品新增'" width="700px" :before-close="closeAdd" center>
			<el-form label-width="100px" :rules="product.rules" ref='product' :model="product.model">
					<el-form-item label="商品分类">
						<el-select v-model="add.mid">
							<el-option label="请选择" :value="0">
							</el-option>
							<el-option v-for="item in mainList" :key='item.id' :label="item.name" :value="item.id">
								
							</el-option>
						</el-select>
						&nbsp; - &nbsp;
						<el-select v-model="add.sid" :disabled="searchSid">
							<el-option label="请选择" :value="0"></el-option>
							<el-option v-for="item in subList2" :key='item.id' :label="item.name" :value="item.id">
								
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品名称" prop="name">
						<el-input v-model="product.model.name"></el-input>
					</el-form-item>
					<el-form-item label="价格" prop="price">
						<el-input v-model="product.model.price"> </el-input>
					</el-form-item>
					<el-form-item label="商品店铺" prop="store">
						<el-input v-model="product.model.store"> </el-input>
					</el-form-item>
					<el-form-item label="avatar">
						<el-image class='old-avatar' v-show='product.isEdit' width='100' :src='product.model.oldAvatar'></el-image>
						<el-upload action="/product/uploadAvatar" accept=".jpg,.png,.jpeg"
							list-type="picture-card" name="avatar" :file-list="product.fileList"
							:on-success="uploadAvatarSuccess"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click='uploadNewDate'>确认</el-button>
						<el-button @click='closeAdd'>取消</el-button>
					</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapActions, mapMutations}  from 'vuex';
        export default {
                data() {
                    return {
							searchSid : false, //是否禁用二级
							search: {
								name:'',
								mid:0,
								sid:0
							},
							ajaxSearch:{
								name:'',
								mid:0,
								sid:0
							},
							add: {
								name:'',
								mid:0,
								sid:0
							},
							pagination: {
								pageSize: 5,
								total:0,
								currentPage:0
							},
							banner: {
								isEdit: false, //是否是编辑状态，默认不是
								id:0, //点击编辑时，的商品的id
 								list:[] //点击的商品的bannerImage
							},
							product: {
								isEdit: false ,//是不是编辑状态
								isAdd: false ,//让新增或者修改商品框弹出
								rules: {
									name: [
										{required: true,message:'商品的名称不能为空',trigger:'blur'},
									],
									price: [
										{ required: true,message:'商品的价格不能为空',trigger:'blur' }
									],
									store: [
										{ required: true,message:'商铺名必填',trigger:'blur' }
									]
								},
								model: {id: 0,name:'',price:'',store:'',avatar:'',oldAvatar:''},
								fileList: []
							}
                    }
                },
	        computed: {
			...mapState('category',['mainList','subLists']),
			...mapState('product',['list']),
			subList() {
				if(this.search.mid === 0) return [];
				else return this.subLists[this.search.mid] || [];
			},
			subList2() {
                                if(this.add.mid === 0) return [];
                                else return this.subLists[this.add.mid] || [];
			}
	        },
	        watch: {
			'search.mid': function(newValue,oldValue) {
				this.search.sid = 0 ; //让更换一级的时候，二级是禁用的，禁止用户点击
				if(newValue !== 0) {
					this.searchSid = true ;
					this.initSubLists(newValue).then( () => this.searchSid = false );
				}
			},
			'add.mid':function(newValue) {
			        this.add.sid = 0;
			        if(newValue !== 0) {
                                        this.searchSid = true ;
                                        this.initSubLists(newValue).then( () => this.searchSid = false );
			        }
			}
	        },
	        methods: {
				...mapActions('product',['getData','removeBanner','uploadNewData','removeProduct']),
				...mapActions('category',['initMainList','initSubLists']),
				...mapMutations('product',['uploadBanner']),
				getData2(currentPage) {
					this.pagination.currentPage = currentPage;//改变当前页数
					this.getData({
						...this.ajaxSearch,
						begin:(this.pagination.currentPage - 1) * this.pagination.pageSize, //从哪里看，计算出从哪里看的值
						pageSize: this.pagination.pageSize //每次一看看几条数据
					})
						.then( total => this.pagination.total = total ); //将当前的总数量加上去
					},
				searchHandler() {
					this.ajaxSearch.name = this.search.name;
					this.ajaxSearch.mid = this.search.mid;
					this.ajaxSearch.sid = this.search.sid;
					this.getData2(1);
				},
				beginBannerEdit(row) {
					this.banner.id = row.id;
					if(row.bannerImage) {
						row.bannerImage.split('?').forEach(item => {
							this.banner.list.push({
								name: item.substr(item.lastIndexOf('/')+1),
								url: item,
							})
						})
					}
					this.banner.isEdit = true; //显示遮罩
				},
				endBannerEdit() {
					this.banner.list = []; //清空原来的bannerImage
					this.banner.id = 0; //初始化默认值
					this.banner.isEdit = false; //关闭弹窗，
				},
				bannerUploadSuccessHandler({status,data},file,fileList) {
					if(status === 200) {
						this.uploadBanner({id: this.banner.id,filePath:data});
						this.banner.list.push({
							name:data.substr(data.lastIndexOf('/') + 1),
							url: data,
							uid: file.uid //内部维护认为没有变化
						})
					}
				},
				bannerBeforeRemoveHandler(file,fileList) { //删除图片
					this.$confirm('真删?','提示',{type:'warning'})
						.then(() => {
							this.removeBanner({id:this.banner.id,filePath:file.url})
								.then( () => {
								let i = this.banner.list.findIndex( item => item.url === file.url); //找到要删除某个的下标
								this.banner.list.splice(i,1);
								})
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消删除'
							});
						});
					return false;
				},
				removeProduct1(row) { //单独的删除某个商品
					this.$confirm('真删?','提示',{type:'warning'})
						.then(() => {
							this.removeProduct(row);
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消删除'
							});
						})
				},
				addNewProduct() {
					this.product.isAdd = true; //让新增弹出
				},
				closeAdd() {
					this.product.isAdd = false; //关闭弹窗
					this.product.isEdit = false; //恢复默认是新增状态
					this.$refs.product.clearValidate();//清空验证
					this.product.model.name = ''; //点击关闭新增弹窗的时候，清空新增加的各条数据
					this.product.model.price = '';
					this.product.model.store = '';
					this.product.model.avatar = '';
					this.product.model.oldAvatar = '';
					this.add.mid = 0;
					this.add.sid = 0;
				},
				uploadNewDate() { 
					if(this.product.isEdit === false) {   //新增状态的商品的功能
						this.$refs.product.validate()
							.then( () => {
								if(this.add.mid === 0 || this.add.sid ===0) {
									this.$alert('必须选择分类','提示',{type:'warning'})
								}
								else if(this.product.model.avatar === '') {
									this.$alert('必须选择一张图片','提示',{type:'waring'})
								}
								else {
									this.uploadNewData({
											cid:this.add.sid,
											name: this.product.model.name,
											price: this.product.model.price,
											store: this.product.model.store,
											avatar1: this.product.model.avatar
										})	
											.then(() => {
												this.product.isAdd = false;
												this.product.model.name = ''; //点击关闭新增弹窗的时候，清空新增加的各条数据
												this.product.model.price = '';
												this.product.model.store = '';
												this.product.model.avatar = '';
												this.product.fileList = [];
												this.add.mid = 0;
												this.add.sid = 0;
												this.pagination.total+=1;
                                                                                                this.$refs.product.clearValidate();//清空验证
											})
								}
							})
						}
						else { //修改状态的商品
							 this.$refs.product.validate()
							 	.then( () => {
							 		if(this.search.mid === 0 || this.search.sid ===0) {
							 			this.$alert('必须选择分类','提示',{type:'warning'})
							 		}
							 		else {
										
									}
						})
					}
					
				},
				updateOldProductMessage(row) { //修改
					this.product.isAdd = true;
					this.product.isEdit = true;
					this.add.mid = row.id;
					this.add.sid =  row.cid;
					this.product.model.name = row.name;
					this.product.model.price = row.price;
					this.product.model.store = row.store;
					this.product.model.oldAvatar = row.avatar; 
				},
				uploadAvatarSuccess(response,file,fileList) {
					console.log(file);
					console.log(fileList);
					if(response.status === 200) this.product.model.avatar = response.data
					this.product.fileList = fileList.slice(-1);
				}
	        },
	        created() {
			this.initMainList();
			this.getData2(1); //开始渲染组件时，要看第一页
	        }
        };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.my-form-wrapper
		display: flex
		width: 100%
		height: 100%
		flex-direction:column
		.my-form
			min-width:1200px
			height: 60px
			flex-shrink: 0
		.el-table
			flex-grow: 1
		.el-pagination
			height: 60px
			flex-shrink:0
</style>