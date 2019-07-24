import axios from 'axios'; //导入axios包
import Cookies from 'js-cookie';//导入js-cookie包
import router from '../router'; //导入router
import store from '../store'; //导入仓库
import { MessageBox } from 'element-ui';

var alwaysPeddingPromise = new Promise(() => {});//一个永远pending的promise对象
export default function myhttp(option){
	var defaultOption = {
		...option,
		withCredentials: true,//发送时是否带Coolies
		timeout: 5000 //让axios 发ajax最大的请求事件为5s,5s内没有响应则认为请求就超时
	}
	return  axios(defaultOption)
				.then(response => { console.log(response);return response.data || JSON.parse(response.requset.responseText) ;})//ie9兼容写法，使用axios时response.data是 null
				.then(results => {
					switch(results.status) {
						case 200:
							if(results.message !== '')	
							return MessageBox.alert(results.message,{title:'提示',type:'success'}) //自己封装的config的信息，如果有消息需要提示用户，则弹出提示(不管是成功还是失败)
								.then( () => results.data);
							return results.data;//直接返回
						case 401:
						//没登录时需要登陆，把当前的地址放在Cookies里面
							Cookies.set('target',router.history.current.fullPath);//获取当前的没登录访问传的值
							router.replace('/login');//没登录激活跳转登录页面
							//window.location.href = 'login.html';
						case 404:
						case 500:
						default:
						if(results.message !== '') MessageBox.alert(results.message,{title:'提示',type:'warning'}); //自己封装的config的信息，如果有消息需要提示用户，则弹出提示(不管是成功还是失败)
							return alwaysPeddingPromise;// 返回一个永远pendding的Promise对象
							//return new Promise(() => {});// 返回一个永远pendding的Promise对象
					}
				})
				.catch(error => { 
					MessageBox.alert(error.message,{title:'提示',type:'error'});
					return alwaysPeddingPromise;
				});
}