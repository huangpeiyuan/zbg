<template>
	<view class="page page-fill">
		<view class="header">
			<view v-if="userIsLogin">
				<image :src="userInfo.avatarUrl" class="face"></image>
			</view>

			<view v-else>
				<image src="../../static/logo.png" class="face"></image>
			</view>

			<view class="info-wapper" v-if="userIsLogin">
				<view class="nickname">
					{{userInfo.nickName}}
				</view>
				<view class="nav-info" >
					<!-- <view class="idTitle" style="font-size: 12px;">id:</view> -->
					<view class="openId" style="font-size: 10px; margin-top: 30upx;">{{userInfo.openId}}</view>
				</view>
			</view>
			<view v-else>
				<view>
					<view class="nickname regist-login" @click="changePopup">注册/登录</view>
				</view>
			</view>

			<view class="set-wapper" v-if="userIsLogin">
				<u-button type="success" size="mini" :custom-style="customStyle" @click="logout">退出登录</u-button>
			</view>
			<u-popup v-model="popupFlag" mode="center" border-radius="5" width="500rpx" height="400rpx" closeable="true"
			 close-icon-pos="top-right" close-icon-size="30">
				<view class="authorization">
					<view class="message">
						体验更多服务，请先登录！
					</view>
					<u-button type="success" :ripple="true" ripple-bg-color="#909399" size="medium" class="btn" open-type="getUserInfo"
					 @getuserinfo="login">微信一键授权</u-button>
				</view>
			</u-popup>
			<view>
				<u-toast ref="uToast" />
			</view>

		</view>

		<view class="bottom">
			<view class="feedback" style="border-bottom: 1px solid #cacaca;" @click="toFeedback">
				<view class="text" style="margin-top: 20upx; margin-bottom: 20upx; margin-left: 40upx; font-weight: 500;">意见反馈</view>
			</view>
			<view class="aboutus" style="border-bottom: 1px solid #cacaca;" @click="toAboutUs">
				<view class="text" style="margin-top: 20upx; margin-bottom: 20upx; margin-left: 40upx; font-weight: 500;">关于我们</view>
			</view>
			<view class="history" style="border-bottom: 1px solid #cacaca;" @click="toHistory">
				<view class="text" style="margin-top: 20upx; margin-bottom: 20upx; margin-left: 40upx; font-weight: 500;">历史记录</view>
			</view>
			<view class="history" style="border-bottom: 3px solid #cacaca;" @click="toCollection">
				<view class="text" style="margin-top: 20upx; margin-bottom: 20upx; margin-left: 40upx; font-weight: 500;">收藏记录</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userIsLogin: false,
				userInfo: {},
				popupFlag:false
			}
		},
		methods: {
			toMeInfo() {
				uni.navigateTo({
					url: "../meInfo/meInfo"
				})
			},
			toFeedback() {
				uni.navigateTo({
					url: '../other/feedback/feedback'
				})

			},
			toAboutUs() {
				uni.navigateTo({
					url: '../other/aboutus/aboutus'
				})
			},
			toHistory() {
				uni.navigateTo({
					url: '../other/history/history'
				})
			},
			toCollection() {
				uni.navigateTo({
					url: '../other/collection/collection'
				})
			},
			changePopup(){
				this.popupFlag = true
			},
			logout() {
				uni.clearStorageSync("zbgerUserInfo");
				uni.clearStorageSync("getLocationFlag")
				this.userInfo = {}
				this.userIsLogin = false
				uni.showToast({
					title: '退出成功',
					icon: 'success',   //如果要纯文本，不要icon，将值设为'none'
					duration: 2000     //持续时间为 2秒
				})  
			},
			login(e) {
				var me = this
				const userInfo = e.detail.userInfo
				const avatarUrl = userInfo.avatarUrl
				const nickName = userInfo.nickName
				uni.login({
					success(response) {
						const code = response.code
						
						const zbgerUserInfo = {};
						
						zbgerUserInfo.avatarUrl = avatarUrl
						zbgerUserInfo.nickName = nickName

						me.popupFlag = false
						uni.request({
							url: "https://zbger.com:8443//zbger/wechatAppletsUser/login",
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
									uni.setStorageSync("zbgerUserInfo", zbgerUserInfo);
									me.userIsLogin = true;
									me.userInfo = uni.getStorageSync("zbgerUserInfo")
									
									me.$refs.uToast.show({
										title: '登录成功',
										type: 'success',
										position: 'top'
									})
								} else {
									me.$refs.uToast.show({
										title: '授权失败',
										type: 'err',
										position: 'top'
									})
								}
							}
						})

					}
				})

			}
		},
		onShow() {
			var me = this;
			//使用挂载得 方法获取数据
			var userInfo = uni.getStorageSync("zbgerUserInfo");
			if (userInfo !== null && userInfo !== '') {

				me.userIsLogin = true;

				me.userInfo = userInfo;

			} else {
				me.userIsLogin = false;
				me.userInfo = {}
			}
		}
	}
</script>

<style scoped>
	@import url("me.css");
</style>
