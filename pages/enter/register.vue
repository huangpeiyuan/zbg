  <template>
 	<view class="s-page-wrapper is-100vh">
 		<view class="is-33vh has-mgt-10">
 			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
 				<image src="../../static/logo.png" mode="aspectFit" class="logoimg"></image>
 			</view>
 		</view>
 		<view class="registercontent">
 			<view class="has-mglr-10 ">
				<form @submit="formSubmit">
					<view class=" has-mgtb-10 ">
						<input type="number" placeholder="请输入手机号" class="is-input1 " name="input1" />
					</view>
					<view class=" has-radius has-mgtb-10">
						<input placeholder="请输入登录密码" :password="true" class="is-input1" name="input2" />
					</view>
					<view class=" has-radius has-mgtb-10">
						<input placeholder="请再次输入密码" :password="true" class="is-input1" name="input3" />
					</view>
					<view class=" has-mgtb-10 ">
						<input type="number" maxlength="4" placeholder="请输入验证码" class="is-input1 " />
						<view class="codeimg">获取验证码</view>
					</view>
					<view class=" registerbtn has-radius has-mgtb-20">
						<button form-type="submit">注 册</button>
					</view>
				</form>
 			</view>
 		</view>
		<view class="loginbtn is-20vh has-mgt-80 is-right is-grey">
				<text>已有账号？</text><text class="is-blue" @click="log">登录</text>	
		</view>
 	</view>
 </template>
 
 <script>
 	export default {
 		data() {
 			return {
 				userTel:"",
				userPwd2:"",
				userPwd3:""
 			};
 		},
 		methods: {
 			formSubmit: function(e) {
 			   // console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
 			    var formdata = e.detail.value
 				this.userTel = formdata.input1;
				this.userPwd2 = formdata.input2;
				this.userPwd3 = formdata.input3;
				
 				if((/^1[34578]\d{9}$/).test(this.userTel) == false){
 					uni.showModal({
 					        content: '手机号格式不正确',
 					        showCancel: false
 					});
 				}else if((/^[a-zA-Z]\w{5,9}$/).test(this.userPwd2) == false){
 					uni.showModal({
 					        content: '密码需以字母开头，长度在6~10之间，只能包含字母、数字和下划线',
 					        showCancel: false
 					});
 				}else if(this.userPwd2 != this.userPwd3){
					uni.showModal({
					        content: '密码输入不一致！',
					        showCancel: false
					});
				}else{
					this.addUser();
				}
				
				
 			},
			
			addUser(){
				uni.request({ 
				    url: 'http://192.168.0.108:8080/procurement/inviteTenders/insertUser.do?userTel='+ this.userTel+ '&userPwd='+ this.userPwd2,
				   
					success: (res) => {
						if(res.statusCode == 500){
							uni.showModal({
								title: '提示',
								content: '该用户已注册过，请登录！',
								showCancel: false,
								success: (res) => {
									if (res.confirm) {
										this.log();
									} 
								}
							}); 		
						}else{
								uni.showModal({
									title: '提示',
									content: '注册成功，请登录！',
									showCancel: false,
									success: (res) => {
										if (res.confirm) {
												this.log();
										} 
									}
								}); 		
						}     
					},
				    fail: () => {
						uni.showToast({
							
							title:'请求接口失败'
						})	
				    }
					
				})
			},
			
			
			log(){
				uni.redirectTo({
						url:"../enter/login"
				})
			}
 
 
 		}
 	}
 </script>
 
 <style>
	@import "../../static/css/simplepro.css";
 	page {
 		min-height: 100%;
 		background-color: #FFFFFF;	
		overflow-y:hidden;
 	}
 
 	.registercontent {
 		width: 85%;
 		margin: 0 auto;
 	}
 
 	.logoimg {
		margin-top: 50rpx;
 		width: 200rpx;
 		height: 200rpx;
 		border-radius: 50%;
 	}
 
 	.is-input1 {
 		height: 88rpx;
 		width: 100%;
 		line-height: 88rpx;
 		padding: 12rpx;
 		color: #353535;
 		font-size: 32rpx;
 		box-sizing: border-box;
 		appearance: none;
 		border: 2rpx solid #e5e5e5;
 		box-shadow: none;
 		border-radius: 44rpx;
 		outline: 0;
 		display: block;
 		padding-left: 30rpx;
 		margin: 0;
 		font-family: inherit;
 		background: #fff;
 		resize: none;
 	}
 
 	.iconfont {
 		position: absolute;
 		font-size: 40rpx;
 		right: 12%;
 		z-index: 999;
 		width: 105rpx;
 		text-align: center;
 		color: #353535;
 		margin-top: -11%;
 		background: #fff;
 		border-top-right-radius: 44rpx;
 		border-bottom-right-radius: 44rpx;
 		height: 80rpx;
 		line-height: 80rpx;
 	}
 
 	.codeimg {
 		position: absolute;
 		font-size: 28rpx;
 		right: 12%;
 		z-index: 999;
 		width: 200rpx;
 		text-align: center;
 		color: #353535;
 		margin-top: -11%;
 		background: #fff;
 		border-top-right-radius: 44rpx;
 		border-bottom-right-radius: 44rpx;
 		height: 80rpx;
 		line-height: 80rpx;
 	}
 
 	.registerbtn button {
 		margin-top: 20rpx;
 		height: 88rpx;
 		width: 100%;
 		line-height: 88rpx;
 		color: #ffffff;
 		font-size: 32rpx;
 		border-radius: 44rpx;
 		outline: 0;
 		display: block;
 		margin: 0;
 		font-family: inherit;
 		background: rgba(231,50,40);
 		opacity: 0.8;
 	}
	
	.loginbtn{
		margin-right: 100rpx;
	}
 
 	button:after {
 		border: 2rpx solid #f2f2f2;
 	}
 </style>
 
 
 
 