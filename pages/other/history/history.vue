<template>

	<view>
		<view>
			<u-toast ref="uToast" />
		</view>

		<view class="zb-list">
			<view v-for="(item,index) in list" :key="index" class="main-padding" :data-id="item.id" :data-announcementName="item.announcementName"
			 :data-addRess="item.address" :data-time="item.time" :data-gxxText="item.gxxText" :data-url="item.url"
			 :data-enclosureName="item.enclosureName" :data-enclosureUrl="item.enclosureUrl" :data-radioFlag="item.radio_flag"
			 :data-index="index" @click="det">

				<view class="mine">
					<view class="mine-head">
						<span class="radio" style="width: 10upx; height: 10upx;  border-radius: 50%; background-color: red;
						   margin-top: 10upx; float: left; margin-right: 10upx; "
						 v-if="item.radio_flag"></span>
						<view>{{item.announcementName}}</view>
					</view>
					<view class="mine-body">
						<view class="city_bg">{{item.address | formatData}}</view>
						<view class="type_bg">{{item.announcementType}}</view>
						<view class="time_bg">{{item.time}}</view>
					</view>
				</view>
			</view>
		</view>



		<view class="top" :style="{'display':(top_flag===true? 'block':'none')}">
			<image src="../../../static/backTop.png" class="topc" @click="top"></image>
		</view>

		<view class="loading" v-if="loading_flag">
			<u-loading mode="circle" color="red" size="29"></u-loading>
			<text class="loading_text">正在加载....</text>
		</view>
		<view class="over" v-if="flag" style="z-index: 100;">无信息，到底了~</view>

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
	import {
		getCity
	}
	from '../../../util/getLocation.js'

	import provincesAndCities from '../../../components/provincesAndCities.js'



	var timer = null
	export default {
		data() {
			return {
				list: [],
				flag: false,
				num: 0,
				top_flag: false,
				loading_flag: false,
				areaName: '',
				zType: '',
				zTime: '',
				message: '',
				popupFlag: false,
				cityValue: '',
				subscribePullDownRefresh: true,
				getLocationFlag: true,
				announcementType: "",
				sum: true
			}
		},

		filters: {
			formatData(data) {
				if (data === null) {
					return '未知'
				}
				const arr = data.split("省")
				if (arr.length > 1) {
					return arr[0]
				} else {
					return data
				}
			}
		},
		//小程序端分享
		onShareAppMessage(res) {
			var me = this
			return {
				title: "招标哥，每天免费给用户提供10000+条政府企事业单位的招标采购数据",
				path: '../pages/index/index'
			}
		},


		onLoad() {



		},
		// onReachBottom() {
		// 	var me = this

		// 	const UserInfo = uni.getStorageSync("zbgerUserInfo")
		// 	console.log("UserInfo=====" + JSON.stringify(UserInfo.openId))


		// 	if (me.subscribePullDownRefresh) {

		// 		me.loading_flag = false
		// 	}

		// 	if (timer != null) {
		// 		clearTimeout(timer);
		// 	}
		// 	timer = setTimeout(function() {
		// 		// 注意这里是我自己自定义的方法，返回的页面数据
		// 		if (me.subscribePullDownRefresh) {
		// 			if (UserInfo.openId == undefined) {
		// 				me.get()
		// 			} else {
		// 				me.loadget()
		// 			}
		// 		}
		// 	}, 500);
		// },
		onShow() {
			// uni.hideHomeButton();
			const UserInfo = uni.getStorageSync("zbgerUserInfo")
			const getLocationFlag = uni.getStorageSync("getLocationFlag")
			const cityValue = uni.getStorageSync("this.cityValue")
			var me = this
			if (UserInfo) {
				if (!UserInfo.subscribe) {
					console.log("UserInfo=========" + UserInfo)
					uni.request({
						url: "https://zbger.com:8443/zbger/subscribe/findSubscribeByOpenid",
						data: {
							openid: UserInfo.openId
						},
						success(res) {
							console.log(res)
							if (res.data.code === 0) {
								const provinceCode = []
								const cityCode = []
								if (res.data.data.subscribe) {
									res.data.data.subscribe.areaCodes.forEach(e => {
										provincesAndCities.some(p => {
											if (e.areaCode === p.value) {
												provinceCode.push(e.areaCode)
											} else {
												if (p.children !== null) {
													p.children.some(c => {
														if (c.value === e.areaCode) {
															cityCode.push(e.areaCode)
														}
													})

												}
											}
										})
									})

									const subscribeType = res.data.data.subscribe.subscribeType
									const subscribeDesc = res.data.data.subscribe.subscribeDesc

									uni.request({
										url: "https://zbger.com:8443/zbger/historyCollection/findHistory?user_id",
										method: "GET",
										data: {
											user_id:UserInfo.openId
										},
										success(res) {

											res.data.data.forEach(e => {
												e['radio_flag'] = true
												me.list = res.data.data

												// console.log(e)
											})
											me.subscribePullDownRefresh = false
											me.flag = true
										}
									})
								}
							} else {
								me.subscribePullDownRefresh = true
								me.flag = false
								if (cityValue) {
									me.cityValue = cityValue
									me.get()
								} else {
									if (getLocationFlag !== false) {
										me.getLocation()
									} else {
										me.get()
									}
								}
							}
						},
						fail() {
							me.subscribePullDownRefresh = true
							me.flag = false
							if (cityValue) {
								me.cityValue = cityValue
								me.get()
							} else {
								if (getLocationFlag !== false) {
									me.getLocation()
								} else {
									me.get()
								}
							}
						}
					})
				} else {
					const provinceCode = []
					const cityCode = []

					UserInfo.subscribe.areaCodes.forEach(e => {


						provincesAndCities.some(p => {

							if (e === p.value) {
								provinceCode.push(e)

							} else {

								if (p.children != null) {
									p.children.some(c => {

										if (c.value === e) {
											cityCode.push(e)
										}
									});
								}
							}

						})
					})

					const subscribeType = UserInfo.subscribe.subscribeType
					const subscribeDesc = UserInfo.subscribe.subscribeDesc
					
					// 一打开就是加载数据
					uni.request({
						url: "https://zbger.com:8443/zbger/historyCollection/findHistory?user_id",
						method: "GET",
						data: {
							user_id:UserInfo.openId
						},
						success(res) {
							res.data.data.forEach(e => {
								e['radio_flag'] = true
								me.list = res.data.data
							})

							// me.subscribePullDownRefresh = false
							// me.flag = true
							me.loadget()
						}
					})
				}

			} else {
				me.subscribePullDownRefresh = true
				me.flag = false
				if (cityValue) {
					me.cityValue = cityValue
					me.get()
				} else {
					if (getLocationFlag !== false) {
						me.getLocation()
					} else {
						me.get()
					}
				}

			}


		},
		onPullDownRefresh() {
			if (this.subscribePullDownRefresh) {
				this.get()
			}



		},
		methods: {

			login(e) {
				var me = this
				const userInfo = e.detail.userInfo
				const avatarUrl = userInfo.avatarUrl
				const nickName = userInfo.nickName
				console.log(userInfo)
				uni.login({
					success(response) {
						const code = response.code
						// console.log(code)
						// console.log(avatarUrl)
						// console.log(nickName)
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
									uni.setStorageSync("zbgerUserInfo", zbgerUserInfo);
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
						// this.$myRequest({
						// 	url:'',
						// 	method:"POST",
						// 	data:{"avatarUrl":avatarUrl,"nickName":nickName,"code":code }
						// })
					}
				})

			},
			async getLocation() {

				const res = await getCity();
				console.log(res)
				if (res === null) {
					uni.setStorageSync("getLocationFlag", false)
					this.get()
					return

				}
				uni.setStorageSync("getLocationFlag", true)

				const cityValue = res.ad_info.city_code
				if (cityValue !== null && cityValue !== undefined && cityValue !== '') {
					console.log(cityValue.substring(0, 2))

					if (cityValue.substring(0, 3) !== "156") {
						this.get()
						return
					} else {
						// this.cityValue = cityValue.substring(3, 5) + "0000"
						this.cityValue = cityValue.substring(3, 5) + "0000"
						uni.setStorageSync("cityValue", this.cityValue)
					}
				}

				this.list = []
				this.get();
			},
			top() { //回到顶部
				console.log(this.areaName)
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			onPageScroll(e) { //根据距离顶部距离是否显示回到顶部按钮
				if (e.scrollTop > 600) { //当距离大于600时显示回到顶部按钮
					this.top_flag = true
				} else { //当距离小于600时隐藏回到顶部按钮
					this.top_flag = false
				}
			},
			nav() {
				uni.navigateTo({
					url: "../../message/message",
				})
			},

			det(e) {
				var me = this;

				var ss = e.currentTarget.dataset
				var id = ss.id
				var index = ss.index

				ss.radio_flag = false

				this.list[index].radio_flag = false


				const getUser = uni.getStorageSync("zbgerUserInfo")

				if (getUser !== null && getUser !== '' && getUser !== 'null') {

					uni.navigateTo({
						url: "../../notice/total?id=" + id
					})
				} else {
					this.popupFlag = true
				}

			},

			async loadget() {

				const UserInfo = uni.getStorageSync("zbgerUserInfo")
				

				// 明天这个改接口
				const res = await this.$myRequest({
					url: 'https://zbger.com:8443/zbger/historyCollection/findHistory'
				});
				// console.log(res.data.provinceCode)

				// console.log("res.data.data" + JSON.stringify(res.data.data))

				res.data.data.forEach(e => {
					e['radio_flag'] = true;
				});

				this.num = this.num + 10;
				/* this.list.concat(res.data) */
				this.list = [...this.list, ...res.data.data];
				if (this.list.length < 10) {
					console.log(this.list.length);
					console.log(this.num);
					this.flag = true;
					this.dataPullDownRefresh = false
				}

				uni.stopPullDownRefresh();
			},

			async get() {
				console.log("get")
				// const res = await this.$myRequest({
				// 	url: '/procurement/inviteTenders/selectTenJson.do?pageNo=' + this.num
				// });

				const res = await this.$myRequest({
					url: 'https://zbger.com:8443/zbger/historyCollection/findHistory?user_id'
				})

				res.data.data.forEach(e => {
					e['radio_flag'] = true;
				});

				this.num = this.num + 10;
				/* this.list.concat(res.data) */
				this.list = [...this.list, ...res.data.data];

				if (this.list.length < 10) {
					console.log(this.list.length);
					console.log(this.num);
					this.flag = true;
				}

				uni.stopPullDownRefresh();

				// uni.stopPullDownRefresh();
				// this.$forceUpdate();
			},

		}
	}
</script>

<style>
	.u-card__head--left__title[data-v-80bc29b2] {
		max-width: 300px;
	}
</style>

<style scoped lang="scss">
	.search {
		font-family: 'Microsoft YaHei';
		font-size: 28rpx;
		text-align: center;
		margin: 26rpx 148rpx auto;
	}

	.in {
		width: 450rpx;
		border: 1px solid #e2e2e2;
		height: 71.9rpx;
		float: left;
	}

	.box2 {
		margin: 1px 7px auto;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 60rpx;
	}

	.line {
		float: right;
		width: 100%;
		height: 1px;
		margin-top: 53rpx;
		background: #d4c4c4;
		text-align: center;
	}

	.name_bg {
		padding-top: 7rpx;
		font-size: 36rpx;
		overflow: hidden;
		white-space: nowrap;
		width: 100%;
		text-overflow: ellipsis;
	}

	.three_bg {
		padding-top: 6rpx;
	}

	.city_bg {
		color: #ffa36c;
		background: #ffeadd;
	}

	.type_bg {
		color: #61c5ff;
		background: #d8f1ff;
	}

	.city_bg {
		border-radius: 4px;
		padding: 3px 8px;
		max-width: 160upx;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}

	.type_bg {
		border-radius: 4px;
		padding: 3px 8px;
		font-size: 12px;
	}

	.time_bg {
		border-radius: 4px;
		color: #ff7c95;
		padding: 3px 8px;
		font-size: 12px;
		background: #ffeaee;
	}

	.over {
		text-align: center;
	}

	.u-card-wrap {
		background-color: $u-bg-color;
		padding: 1px;
	}

	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}

	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}

	uni-text {
		max-width: 500px !important;
	}

	@import url("history.css")
</style>
