
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
					
					<view class=" registerbtn has-radius has-mgtb-20">
						<button form-type="submit">登 录</button>
					</view>
				</form>
 			</view>
 		</view>
		
		<view class="is-20vh has-mgt-80">
			<navigator url="#" class=" has-radius is-center is-grey " hover-class="">
				<text class="is-blue" @click="forget()">忘记密码？</text>
				<!-- <text class="is-white">-------------------</text> -->
				<text>没有账号？</text><text class="is-blue" @click="reg">注册</text>
			</navigator>
		</view>
 	</view>
 </template>
 
 <script>
 	export default {
 		data() {
 			return {
 				userTel:"",
				userPwd:"",
				userList:[]
 			};
 		},
		onShow() {
			// uni.hideHomeButton();
			const loginFlag = uni.getStorageSync("userInfo")
			if(loginFlag != null && loginFlag !=undefined && loginFlag != ''){
				uni.redirectTo({
					url:"../index/index",
					
				})
			}
		},
 		methods: {
 			formSubmit: function(e) {
				
 			   // console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
 			    var formdata = e.detail.value
 				this.userTel = formdata.input1;
				this.userPwd = formdata.input2;
				
				
				uni.request({
					
					url: 'https://zbger.com:8080/procurement/inviteTenders/selectByTel.do?userTel='+this.userTel,
					success: (res) => {
						
						
						this.userList =  res.data;
						// console.log(this.userList)
						if(this.userList == ""){
							uni.showModal({
							        content: '该用户不存在，请先注册！',
							        showCancel: false
							});
						}else if(this.userPwd == ""){
							uni.showModal({
							        content: '请输入密码！',
							        showCancel: false
							});
						}else if(this.userPwd != this.userList[0].userPwd){
							uni.showModal({
							        content: '密码错误！',
							        showCancel: false
							});
						}else{
							uni.setStorageSync("userInfo",res.data)
							uni.redirectTo({
								url:"../index/index",
								
							})
							
						}
					},
					fail() {
						console.log("fail....")
					}
				});		
				
 			},
			
			// async userLogin(){
					
			// 		const res = await this.$myRequest({
			// 			url: '/procurement/inviteTenders/selectByTel.do?userTel='+this.userTel
			// 		});		
			// 		this.userList =  res.data;
			// 		// console.log(this.userList)
			// 		if(this.userList == ""){
			// 			uni.showModal({
			// 			        content: '该用户不存在，请先注册！',
			// 			        showCancel: false
			// 			});
			// 		}else if(this.userPwd == ""){
			// 			uni.showModal({
			// 			        content: '请输入密码！',
			// 			        showCancel: false
			// 			});
			// 		}else if(this.userPwd != this.userList[0].userPwd){
			// 			uni.showModal({
			// 			        content: '密码错误！',
			// 			        showCancel: false
			// 			});
			// 		}else{
			// 			uni.redirectTo({
			// 				url:"../index/index",
			// 			})
			// 		}
						
					
			// },
			
			reg(){
					uni.redirectTo({
							url:"../enter/register",
					})
 
			},
			
			forget(){
					uni.navigateTo({
						url:"forgetPwd",
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
 
 	.is-input1 {
 		height: 88rpx;
 		width: 100%;
 		line-height: 88rpx;
 		padding: 12rpx;
 		color: #353535;
 		font-size: 17px;
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
 
 	.logoimg {
 		margin-top: 50rpx;
 		width: 200rpx;
 		height: 200rpx;
 		border-radius: 50%;
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
 
 	button:after {
 		border: 2rpx solid #f2f2f2;
 	}
 </style>


