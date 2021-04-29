<template>
	<view class="vf">
		<view class="header">
			<span class="tc">{{announcementName}}</span>
			<p class="pubTime">
				<span>地区：{{address}} &nbsp; &nbsp;时间：{{time}}</span>
			</p>
		</view>

		<view class="content" v-html="text" v-if="text != 'null' && text != 'undefined' ? true : false">
		</view>

		<!-- view class="enclosure" :style="{'display':(enclosure===true? 'block':'none')}">
			
		</view> -->


		<view class="enclosure" v-show="null != enclosureName" v-for="(enclosureName, index) in enclosureNameList">
			附件地址：<navigator :url="enclosureUrlList[index]">{{enclosureName}}</navigator>
			<!-- 附件地址：<navigator :url="123">{{enclosureName}}</navigator> -->
		</view>


		<view class="zb_link">
			<!-- <view class="text-box" scroll-y="true" v-if="select_flag">
				<text selectable style="word-break:break-all;">{{url}}</text>
			</view> -->
			<u-button type="success" shape="square" :plain="true" :ripple="true" ripple-bg-color="#909399" size="mini" v-if="url"
			 @click="copy(url)" class="u-btn">复制原文链接</u-button>
			<view class="collection">
				<p class="star" v-if="star_flag && codeId == codes" @click="addCollection()">
					<image src="../../static/cancel-star.png"></image>
				</p>
				<p class="star2" v-else="codeId == code" @click="delCollection()">
					<image src="../../static/star.png"></image>
				</p>
			</view>
		</view>

		<view class="share_box">
			<view class="zi">
				<span>如此有用的信息<br />快<span class="share">分享</span>给有需要的朋友吧！</span>
			</view>
			<button class="share_friends" open-type='share' @click="shareFriend()">分享好友</button>
		</view>
	</view>
</template>

<script>
	import clipboard from "@/js_sdk/dc-clipboard/clipboard.js"

	export default {
		data() {
			return {
				announcementName: "",
				address: "",
				time: "",
				text: "",
				url: "",
				enclosureName: null,
				enclosureUrl: null,
				flag: false,
				select_flag: false,
				hideenclosure: true,
				enclosureNameList: null,
				enclosureUrlList: null,
				collection_context: "",
				star_flag: true,
				code: 1,
				codes: 0,
				codeId: "",
				codeId2:""
			}
		},
		onLoad:function(options) {
			
			var userInfo = uni.getStorageSync("userInfo");

			const UserInfo = uni.getStorageSync("zbgerUserInfo")
			console.log("openId=====" + JSON.stringify(UserInfo.openId))

			if (userInfo === null) {
				uni.login({
					provider: "weixin",
				})
			}
			
			console.log(options)

			let _this = this

			uni.request({
				url: "https://zbger.com:8443/zbger/inviteTenders/findById",
				method: "GET",
				data: {
					id: options.id,
					user_id: UserInfo.openId,
				},
				success(res) {
					let data = res.data

					if (options.g != 'null' && options.g != 'undefined') {
						_this.flag = true
					}
					_this.announcementName = data.announcementName;
					_this.time = data.time;
					_this.address = data.address;
					_this.text = data.gxxText;
					_this.url = data.url;
					_this.enclosureName = data.enclosureName;
					_this.enclosureUrl = data.enclosureUrl;
					_this.codeId = data.codeId;
					_this.hide();
				},
			})
			var arr = []
			for (let i in options) {
				arr.push(options[i])
			}
			this.collection_context = arr[0]
			console.log(this.collection_context)


			

		},
		methods: {
			copy(value) {
				// #ifdef MP-WEIXIN 
				var self = this;
				uni.setClipboardData({
					data: value,
					success: function() {
						uni.hideToast();
						uni.showToast({
							title: '复制成功,前往浏览器查看详情',
							duration: 2000,
							icon: 'none'
						});
						//这个是自己的提示用法
					},
					fail() {
						uni.showToast({
							title: '复制失败',
							duration: 2000,
							icon: 'none'
						});
					}
				});
				setTimeout(_ => {
					uni.hideToast();
				}, 1);
				this.$nextTick(function() {
					uni.hideToast();
				});
				// #endif
			},
			addCollection() {
				var me = this
				var userInfo = uni.getStorageSync("userInfo");

				const UserInfo = uni.getStorageSync("zbgerUserInfo")
				let _this = this


				uni.request({
					url: "https://zbger.com:8443/zbger/collection/insertCollection?",
					method: "GET",
					data: {
						collection_context: this.collection_context,
						user_id: UserInfo.openId,
						code: this.code
					},
					success(res) {
						let data = res.data
						uni.showToast({
							title: '收藏成功',
							icon: 'success', //如果要纯文本，不要icon，将值设为'none'
							duration: 2000 //持续时间为 2秒
						})

					},
				})
				if (me.code === 1) {
					me.star_flag = false
				}
				console.log("code===" + me.code)
				console.log("codeId1===" + me.codeId)
			},
			delCollection() {
				var me = this
				var userInfo = uni.getStorageSync("userInfo");

				const UserInfo = uni.getStorageSync("zbgerUserInfo")

				console.log()

				let _this = this


				uni.request({
					url: "https://zbger.com:8443/zbger/collection/insertCollection?",
					method: "GET",
					data: {
						collection_context: this.collection_context,
						user_id: UserInfo.openId,
						code: this.codes
					},
					success(res) {
						let data = res.data
						uni.showToast({
							title: '取消收藏',
							icon: 'success', //如果要纯文本，不要icon，将值设为'none'
							duration: 2000 //持续时间为 2秒
						})
					},
				})
				if (me.codes === 0) {
					me.star_flag = true
				}
				console.log("codes===" + me.codes)
				console.log("codeId2===" + me.codeId)
			},
			shareFriend: function() {
				//分享到微信朋友
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: "http:*******************", //这地址太长了，就省略了
					title: "招标哥",
					summary: "招标哥",
					imageUrl: "http:*******************",
					success: function(res) {
						// console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						// console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			loationhref() {
				window.location.href = this.url
			},
			tonewurl() {
				this.select_flag = true

				// uni.showModal({
				//     content:"复制至浏览器打开",//模板中提示的内容
				//     confirmText:url,

				//   });

				// uni.navigateTo({
				//      url:"../newurl/newurl?url="+this.url,
				//  });
				// plus.runtime.openURL("https://www.baidu.com");

			},
			hide() {
				// console.log("-----------");
				// console.log(this.enclosureName);
				// console.log(this.enclosureUrl);

				if (null == this.enclosureName || null == this.enclosureUrl) {
					return;
				}

				this.enclosureNameList = this.enclosureName.split(";");
				this.enclosureUrlList = this.enclosureUrl.split(";");
				// console.log(this.enclosureNameList);
			},
		},
	}
</script>

<style>
	.vf {
		margin: 7rpx 7rpx auto;
	}

	.header {
		text-align: center;
	}

	.tc {
		font-size: 21px;
		line-height: 26px;
		font-weight: bolder;
		color: #383940;
	}

	.pubTime {
		margin-top: 40rpx;
		color: #707070;
		font-size: 30rpx;
	}

	.content {
		font-size: 30rpx;
		margin: 45rpx 38rpx;
		line-height: 65rpx;
	}

	.share_box {
		height: 270rpx;
		width: 100%;
		background-color: rgb(241, 248, 252);
		text-align: center;
	}

	.zi {
		font-size: 33rpx;
		padding-top: 30rpx;
		letter-spacing: 2rpx;
		line-height: 55rpx;
	}

	.share {
		color: #007AFF;
	}

	.share_friends {
		width: 42%;
		background-color: #007AFF;
		color: #F7F7F7;
		font-size: 33rpx;
		margin-top: 20rpx;
	}

	.city_bg {
		border-radius: 4px;
		padding: 3px 6px;

		margin-right: 40rpx;

		background: #ffeadd;
		text-decoration: none;
		font-size: 14px;
		color: #ffa36c;
		width: 120upx;
		height: 40upx;
		margin-left: 60upx;
	}


	.zb_link {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20upx 20upx;
		position: relative;
	}

	.attachment {
		border-radius: 20px;
		padding: 3px 6px;
		margin-right: 40rpx;
		background: #d8f1ff;
	}

	.attachment a {
		text-decoration: none;
		font-size: 30rpx;
		color: #61c5ff;
	}

	.url {
		margin: 20upx auto;
		width: 100%;
	}

	.select {
		word-break: break-all;
	}

	.text-box {
		margin-bottom: 40rpx;
		padding: 40rpx 0;
		display: flex;
		min-height: 300rpx;
		background-color: #FFFFFF;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 30rpx;
		color: #353535;
		line-height: 1.8;
	}

	.u-btn {
		float: left;
	}

	.collection {
		position: absolute;
		right: 32%;
		top: 14%;
	}

	.collection image {
		width: 50rpx;
		height: 50rpx;
		margin: 0 auto;
	}

	.star {
		position: absolute;
		left: 0;
		top: 0;
	}

	.star2 {
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
