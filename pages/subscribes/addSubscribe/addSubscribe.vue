<template>
	<view>
		<!-- <label :labelList="labels" @sent="getSonValue"></label> -->
		<u-tabs-swiper ref="tabs" name="value" :current="current" :list="list" :is-scroll="false" @change="change"></u-tabs-swiper>

		<view class="tabbody" v-if=" current === 0 ? true : false">
			<!-- <u-input v-model="value" :type="text" :border="border" placeholder="请选择地区:"  disabled placeholder-style="color: #000000;"/> -->

			<view class="etab" @click="chooseCity">
				<view class="etype">选择地区:</view>
				<view class="emain">
					<view class="city" v-for="c in city">{{c.name}};</view>
				</view>
			</view>
			<view class="etab" @click="changezbShow">
				<view class="etype">招标类型:</view>
					<view class="emain">{{biddingType}}</view>
			</view>
			<view class="etab">
				<view class="etype etype1">关键字:</view>
					<input class="text" type="text" placeholder="请输入关键字"  v-model="keyword" />
			</view>
			<view class="etab">
				<view class="etype etype1">邮箱接收:</view>
					<input class="text" type="text" placeholder="请输入邮箱"  v-model="email" />
			</view>

		</view>
		<button type="primary" style="margin-top: 40upx; width: 90%;" @click="addSubscribe" v-if="subscribeFlag">订阅</button>
		<button type="primary" style="margin-top: 40upx; width: 90%;" @click="changeSubscribe" v-else>修改订阅</button>
		<u-select v-model="zbShow" mode="single-column" :list="zbList" @confirm="confirm"></u-select>
		<tki-tree ref="tkitree" :range="areaList" rangeKey="name" confirmColor="#4e8af7" multiple="true" idKey="value"
		 @confirm="treeConfirm" selectParent="true" />



		<u-popup v-model="popupFlag" mode="top" border-radius="5" width="500rpx" height="400rpx" closeable="true"
		 close-icon-pos="top-right" close-icon-size="30">
			<view class="authorization">
				<view class="message">
					添加订阅，请先登录
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
	import label from '../../../components/label.vue'
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	import provincesAndCities from '../../../components/provincesAndCities.js'

	export default {
		data() {
			return {
				zbList: [{
						value: '1',
						label: '不限'
					},
					{
						value: '2',
						label: '招标'
					},
					{
						value: '3',
						label: '中标'
					}
				],
				list: [{
						id: 0,
						value: '按关键字',
						// isActive: true
					},
					{
						id: 1,
						value: '按行业',
						// isActive: false
					}
				],
				current: 0,
				city: [{
						name: '北京',
						value: 1
					},
					{
						name: '上海',
						value: 2
					},
					{
						name: '广州',
						value: 3
					},
					{
						name: '深圳',
						value: 4
					}
				],
				biddingType: '不限',
				keyword: "",
				email: '',
				zbShow: false,
				areaList: '',

				UserInfo: {},
				cityCode: [],
				popupFlag: false,
				subscribeFlag: true,
				canbesent: false,
				numbers:true,
				testNumber:true
			}
		},
		methods: {
			checkForm() {
				var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (this.cityCode === '[]') {
					uni.showModal({
						content: '请选择地区！',
						showCancel: false
					});
					this.canbesent = false
				} else if (this.biddingType == '') {
					uni.showModal({
						content: '请选择招标类型！',
						showCancel: false
					});
					this.canbesent = false
				} else if (this.keyword == '') {
					uni.showModal({
						content: '请输入关键字！',
						showCancel: false
					});
					this.canbesent = false
				} else if (this.email === '') {
					uni.showModal({
						content: '请输入邮箱！',
						showCancel: false
					});
					this.canbesent = false
				} else if(!reg.test(this.email)){
					uni.showModal({
						content: '邮箱格式输入错误，请重新输入！',
						showCancel: false
					});
					this.canbesent = false
				}
				else {
					this.canbesent = true
				}
			},
			change(index) {
				
				this.current = index;
				console.log(this.current)
			},
			changezbShow() {
				this.zbShow = true
			},
			confirm(e) {
				
				console.log(e[0].label)
				this.biddingType = e[0].label
			},
			chooseCity() {
								
				const treeList = this.$refs.tkitree.treeList
				for (var i = 0; i < this.city.length; i++) {
					treeList.some(e => {
						if (e.id === this.city[i].value) {
							e.checked = true
						}
					})
				}
				this.$refs.tkitree._show();
			},
			treeConfirm(e) {
				
				this.city = e
				const cityCode = []
				e.forEach(e => {
					cityCode.push(e.value)
				})
				this.cityCode = cityCode
				console.log(this.$refs.tkitree.treeList)

			},
			addSubscribe() {
				var UserInfo = uni.getStorageSync("zbgerUserInfo")
				
				if (!UserInfo) {
					
					this.popupFlag = true
				} else {
					console.log(JSON.stringify(this.UserInfo) + typeof(JSON.stringify(this.UserInfo)))
					this.checkForm();
					if (this.canbesent === true) {
						console.log(this.canbesent)
						const openid = this.UserInfo.openId
						
						uni.request({
							url: 'https://zbger.com:8443/zbger/subscribe/addSubscribe',
							method: 'POST',
							data: {
								intoAreaCodes: this.cityCode,
								subscribeType: this.biddingType,
								subscribeDesc: this.keyword,
								subscribeEmail: this.email,
								openid: openid
							},
							success: (res) => {
								//console.log(res)
								
								if (res.data.code === 200) {
									const subscribe = {
										"areaCodes": this.cityCode,
										"subscribeType": this.biddingType,
										"subscribeDesc": this.keyword,
										"subscribeEmail": this.email
									}

									const UserInfo = uni.getStorageSync("zbgerUserInfo")
									UserInfo.subscribe = subscribe
									uni.setStorageSync("zbgerUserInfo", UserInfo)
									var getLocationFlag = uni.getStorageSync("getLocationFlag")
									getLocationFlag = false
									uni.setStorageSync("getLocationFlag", getLocationFlag)
									uni.switchTab({
										url: "../../index/index"
									})
								}
							}
						})
					}

				}

			},
			changeSubscribe() {

				if (this.UserInfo === '') {
					this.popupFlag = true
				} else {
					const openid = this.UserInfo.openId
					this.checkForm();
					
					
					if (this.canbesent === true) {
						// const areaCodes = []
						// this.cityCode.forEach(e=>{
						// 	areaCodes.push({areaCode:e})
						// })
						
						uni.request({
							url: 'https://zbger.com:8443/zbger/subscribe/changeSubscribe',
							method: 'POST',
							data: {
								intoAreaCodes: this.cityCode,
								subscribeType: this.biddingType,
								subscribeDesc: this.keyword,
								subscribeEmail: this.email,
								openid: openid
							},
							success: (res) => {
								
								const subscribe = {
									"areaCodes": this.cityCode,
									"subscribeType": this.biddingType,
									"subscribeDesc": this.keyword,
									"subscribeEmail": this.email
								}
								
									
								const UserInfo = uni.getStorageSync("zbgerUserInfo")
								
								UserInfo.subscribe = subscribe
								
								uni.setStorageSync("zbgerUserInfo", UserInfo)
								
								var getLocationFlag = uni.getStorageSync("getLocationFlag")
								getLocationFlag = false
								
								uni.setStorageSync("getLocationFlag", getLocationFlag)
								uni.switchTab({
									url: "../../index/index"
								})
								
								uni.showToast({
									title: '修改成功',
									icon: 'success',   //如果要纯文本，不要icon，将值设为'none'
									duration: 2000     //持续时间为 2秒
								})  

							},
							fail() {
								console.log("fail") 
								
								uni.showToast({
									title: '修改失败',
									icon: 'none',    
									duration: 2000 
								})
							}
						})

					}

				}
			},
			login(e) {
				var me = this
				const userInfo = e.detail.userInfo
				const avatarUrl = userInfo.avatarUrl
				const nickName = userInfo.nickName
				//console.log(userInfo)
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
									me.UserInfo = uni.getStorageSync("zbgerUserInfo")
									var getLocationFlag = uni.getStorageSync("getLocationFlag")
									getLocationFlag = false
									uni.setStorageSync("getLocationFlag", getLocationFlag)
									uni.switchTab({
										url: "../subscribe/subscribe"
									})
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


		},

		components: {
			label,
			tkiTree
		},
		onShow() {
			this.areaList = provincesAndCities

			var UserInfo = uni.getStorageSync("zbgerUserInfo")
			
			var me = this
			if (UserInfo) {

				this.UserInfo = UserInfo
				if (UserInfo.subscribe) {
					me.city = []
					me.subscribeFlag = false
					me.biddingType = UserInfo.subscribe.subscribeType
					me.keyword = UserInfo.subscribe.subscribeDesc
					me.email = UserInfo.subscribe.subscribeEmail
					const cityList = UserInfo.subscribe.areaCodes
					
					for (var i = 0; i < cityList.length; i++) {
						
						provincesAndCities.forEach(e => {
							
							if (e.value === cityList[i]){
								me.city.push(e)
								me.cityCode.forEach(mm =>{
									if(mm === e.value){
										this.numbers = false
									}
								})
								if(this.numbers){
									me.cityCode.push(e.value)
								}
							} else {
								if (e.children !== null ) {
									e.children.forEach(e => {
										if (e.value === cityList[i]) {
											me.cityCode.forEach(mm =>{
												if(mm === e.value){
													this.testNumber = false
												}
											})
											me.city.push(e)
											if(this.testNumber){
												me.cityCode.push(e.value)
											}
										
										}
									})

								}
							}
						})
					}

				} else {
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
									console.log("UserInfo==="+JSON.stringify(UserInfo))
									uni.setStorageSync("zbgerUserInfo", UserInfo)

									UserInfo = uni.getStorageSync("zbgerUserInfo")

									me.city = []
									me.subscribeFlag = false
									me.biddingType = UserInfo.subscribe.subscribeType

									me.keyword = UserInfo.subscribe.subscribeDesc
									me.email = UserInfo.subscribe.subscribeEmail
									const cityList = UserInfo.subscribe.areaCodes
									for (var i = 0; i < cityList.length; i++) {
										provincesAndCities.forEach(e => {
											if (e.value === cityList[i]) {
												me.city.push(e)
												me.cityCode.push(e.value)
											} else {
												if (e.children !== null) {
													e.children.forEach(e => {
														if (e.value === cityList[i]) {
															me.city.push(e)
															me.cityCode.push(e.value)
														}
													})

												}
											}
										})
									}

								}
							}
						}
					})
				}

			} else {
				me.subscribeFlag = true
				me.cityCode = []				
				me.keyword = ''
				me.email = '';
				me.city = [{
						name: '北京',
						value: 1
					},
					{
						name: '上海',
						value: 2
					},
					{
						name: '广州',
						value: 3
					},
					{
						name: '深圳',
						value: 4
					}

				]
			}
		}
	}
</script>

<style>
	.tabbody {
		width: 90%;
		margin: 40upx auto 0upx auto;
	}

	.etab {
		width: 100%;
		height: 100upx;
		border: 1upx solid #cccccc;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: #000000;
		font-size: 15px;
		/* font-weight: 300; */
		margin-bottom: 30upx;
		
	}

	.etype {
		margin-left: 20upx;
	}
	
	.text{
		width: 100%;
	}
	
	.etype1 {
		width: 260rpx;
	}

	.emain {
		margin-left: 20upx;
		display: flex;
		margin-left: 46rpx;
	}

	,
	.authorization {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.message {
		margin-top: 80rpx;
	}

	.btn {
		margin-bottom: 60upx;
	}
</style>
