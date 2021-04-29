<template>
	<view style="width: 90%; margin: 0 auto;">
		<u-form :model="form" ref="uForm">
			<u-form-item label="标题" prop="title">
				<u-input v-model="form.title" />
			</u-form-item>

			<u-form-item label="电话" prop="mobile">
				<u-input v-model="form.mobile" />
			</u-form-item>
			<u-form-item label="内容" prop="intro">
				<textarea placeholder-style="color:#b8b8b8" placeholder="请输入您要提交的内容" v-model="form.intro" />
				</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
		
		<u-popup v-model="popupFlag" mode="center" border-radius="5" width="500rpx" height="400rpx" closeable="true"
		 close-icon-pos="top-right" close-icon-size="30">
			<view class="authorization">
				<view class="message">
					浏览更多详细信息，请先登录
				</view>
				<u-button type="success" :ripple="true" ripple-bg-color="#909399" size="medium" class="btn" open-type="getUserInfo"
				 @getuserinfo="login">微信一键授权</u-button>
		
			</view>
		</u-popup>
		<view>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					title: '',
					intro: '',
					mobile:''
					
				},
				rules: {
					title: [{
						required: true,
						message: '请输入标题',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					intro: [{
						min: 10,
						message: '内容不能少于10个字',
						trigger: [ 'blur'],
					}],
					// 字段名称
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: [ 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: [ 'blur'],
						}
					]
				},
				popupFlag: false,
			};
		},
		methods: {
			submit() {
				var me =this
				const getUser = uni.getStorageSync("zbgerUserInfo")
				if(!uni.getStorageSync("zbgerUserInfo")){
					this.popupFlag= true
					return
				}
				this.$refs.uForm.validate(valid => {
					
						if (valid) {
							console.log('验证通过');
							const openid = getUser.openId
							uni.request({
								url:"https://zbger.com:8443/zbger/feedback",
								method:"POST",
								data:{
									"title":this.form.title,
									"phoneNumber":this.form.mobile,
									"content":this.form.intro,
									"openid":openid,
									
								},
								success() {
									me.$refs.uToast.show({
										title: '提交成功',
										type: 'success',
										position: 'top'
									})
								}
							})
						} else {
							console.log('验证失败');
						}
					
					
					
					
					
				});
			},
			login(e) {
				var me = this
				const userInfo = e.detail.userInfo
				const avatarUrl = userInfo.avatarUrl
				const nickName = userInfo.nickName
				console.log(userInfo)
				uni.login({
					success(response) {
						const code = response.code
						const zbgerUserInfo = {};
						
						zbgerUserInfo.avatarUrl = avatarUrl
						zbgerUserInfo.nickName = nickName
						// uni.setStorageSync("userInfo", code)
						me.popupFlag = false
						uni.request({
							url: "https://zbger.com:8443/zbger/wechatAppletsUser/login",
							method: "POST",
							data: {
								"avatarUrl": avatarUrl,
								"nickName": nickName,
								"code": code
							},
							success(res) {
								console.log(res)
								if (res.data.code === 0) {
									zbgerUserInfo.openId = res.data.msg
									uni.setStorageSync("zbgerUserInfo",zbgerUserInfo);
									me.$refs.uToast.show({
										title: '登录成功',
										type: 'success',
										position: 'top'
									})
								}else{
									me.$refs.uToast.show({
										title: '授权失败',
										type: 'err',
										position: 'top'
									})
								}
							}
						})
						// this.$myRequest({
						// 	url:'',
						// 	method:"POST",
						// 	data:{"avatarUrl":avatarUrl,"nickName":nickName,"code":code }
						// })
					}
				})
			
			},
			
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			
		}
	};
</script>
<style>
	
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40rpx;
		margin-bottom: 20rpx;
		z-index: 100;
	}
	
	.loading .loading_text {
		margin-left: 20rpx;
		font-size: 12rpx;
	}
	
	
	
	.authorization {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.message{
		margin-top: 80rpx;
	}
	.btn{
		margin-bottom: 60upx;
	}
</style>
