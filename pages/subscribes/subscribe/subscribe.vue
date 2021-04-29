<template>
	<view class="main">
		<image src="../../../static/person.png" mode="widthFix"></image>
		<button type="primary" size="default" @click="addSubscribe">立即添加</button>
		<p class="text">您还没有订阅信息，请添加~</p>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			addSubscribe() {
				uni.navigateTo({
					url: "../addSubscribe/addSubscribe"
				})
			}
		},
		onLoad() {

		},
		onShow() {
			const UserInfo = uni.getStorageSync("zbgerUserInfo")
			if (UserInfo) {
				if (UserInfo.subscribe) {

					uni.reLaunch({
						url: "../addSubscribe/addSubscribe"
					})
				} else {
					var me = this
					uni.request({
						url: "https://zbger.com:8443/zbger/subscribe/findSubscribeByOpenid",
						data: {
							openid: UserInfo.openId
						},
						success(res) {
							if (res.data.code === 0) {
								const areaCodes = []
								if (res.data.data.subscribe) {
									res.data.data.subscribe.areaCodes.forEach(e => {
										areaCodes.push(e.areaCode)
									})
									const subscribeType = res.data.data.subscribe.subscribeType

									const subscribeDesc = res.data.data.subscribe.subscribeDesc
									const subscribeEmail = res.data.data.subscribe.subscribeEmail
									const subscribe = {
										"areaCodes": areaCodes,
										"subscribeType": subscribeType,
										"subscribeDesc": subscribeDesc,
										"subscribeEmail": subscribeEmail
									}
									UserInfo.subscribe = subscribe
									uni.setStorageSync("zbgerUserInfo", UserInfo)
									uni.reLaunch({
										url: "../addSubscribe/addSubscribe"
									})
								}
							}
						}
					})
				}

			}
		}
	}
</script>

<style>
	@import url("subscribe.css");
</style>
