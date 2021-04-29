<template>

	<view>
		<view class="search">
			<input class="in" type="text" placeholder="请输入关键字 , 如 '系统'" v-model="message" />
			<button class="bu" @click="set"><i>
					<image src="../../static/search_two.png" /></i></button>
		</view>

		<view class="dropdown">
			<picker class="item-picker" mode="multiSelector" range-key="label" @change="classifyChange" @columnchange="columnchange"
			 :value="classifyIndex" :range="classifyArr">
				<view class="con"> {{name}} </view>
			</picker>

			<sl-filter :ref="'slFilter'" :topFixed="true" :isTransNav="true" :navHeight="0" :color="titleColor" :themeColor="themeColor"
			 :menuList="menuList" @result="result"></sl-filter>	
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
						<view v-html="item.announcementName"></view>
					</view>
					<view class="mine-body">
						<span class="city_bg">{{item.address | formatData}}</span>
						<span class="type_bg">{{item.announcementType}}</span>
						<span class="time_bg">{{item.time}}</span>
					</view>
				</view>
			</view>
		</view>

		<!-- 授权提示内容 -->
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

		<view class="top" :style="{'display':(top_flag===true? 'block':'none')}">
			<image src="../../static/backTop.png" class="topc" @click="top"></image>
		</view>
		<view class="over" v-if="bottomMessage">无信息，到底了~</view>
	</view>
</template>

<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	import provincesAndCities from '../../components/city.area.js';


	export default {
		components: {
			slFilter
		},
		data() {
			return {
				provinceValue: '',
				cityValue: '',
				popupFlag: false,

				top_flag: false,
				bottomMessage: false,
				cao: "",
				list: [],
				list1: [],
				flag: false,
				num: 0,
				message: "",
				lucene: false,



				dataSource: [],
				name: "-- 地区 --",
				classifyArr: [
					[],
					[]
				], // picker - 数据源
				classifyIndex: [0, 0], // picker - 索引
				childArr: [], // 二级分类数据源
				addressName: "",
				areaName: "",
				zType: "",
				zTime: "",

				themeColor: '#19b955',
				titleColor: '#666666',
				filterResult: '',
				menuList: [{
						'title': '单选',
						'key': 'single',
						'isMutiple': false,
						'reflexTitle': true,

						'detailTitle': '请选择（单选）',
						'defaultSelectedIndex': 0,
						'detailList': [{
								'title': '公告类型',
								'value': ''
							},
							{
								'title': '中标',
								'value': '中标'
							},
							{
								'title': '招标',
								'value': '招标'
							}
						]
					},
					{
						'title': '排序',
						'key': 'timesort',
						'isSort': true,
						'reflexTitle': true,
						'defaultSelectedIndex': 0,
						'detailList': [{
								'title': '时间',
								'value': ''
							},
							{
								'title': '近一天',
								'value': '1',

							},
							{
								'title': '近一周',
								'value': '7'
							},
							{
								'title': '近一月',
								'value': '30'
							},
							{
								'title': '近三月',
								'value': '90'
							},
							{
								'title': '近半年',
								'value': '180'
							},
							{
								'title': '近一年',
								'value': '365'
							}
						]
					}
				]
			}
		},
		onLoad: function(options) {
			// 获取数据源并分出一级二级分类
			this.dataSource = provincesAndCities;
			this.getAllClassify();	
		},
		onReachBottom() {
			this.sear();
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
					}
				})

			},
			top() { //回到顶部
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
			onKeyFocus() {
				if (this.message !== "") {
					this.lucene = true;
					this.list1 = [];
					this.luc();
				} else {
					this.lucene = false;
					this.list1 = [];
				}
			},
			onKeyInput() {
				if (this.message !== "") {
					this.lucene = true;
					this.list1 = [];
					this.luc();
				} else {
					this.lucene = false;
					this.list1 = [];
				}
			},
			onKeyBlur() {
				this.lucene = false;
			},
			acName(name) {
				this.list = [];
				this.cao = name;
				this.na();
				this.lucene = false;
				this.list1 = [];
			},
			async na() {
				const res = await this.$myRequest({
					url: '/procurement/inviteTenders/selectByName.do?keyword=' + this.cao
				});
				this.list = [...this.list, ...res.data];
				this.list.forEach(e => {
					e['radio_flag'] = true
					// console.log(e)
				})
			},
			async luc() {
				const res = await this.$myRequest({
					url: '/procurement/inviteTenders/selectTenByLucene.do?keyword=' + this.message
				});
				for (var i = 0; i < res.data.length; i++) {
					var a = Math.ceil(Math.random() * 9 + 2);

					res.data[i].announcementName = res.data[i].announcementName.substring(res.data[i].announcementName.indexOf(this.message),
						res.data[i].announcementName.indexOf(this.message) + a);
				}
				this.list1 = [...this.list1, ...res.data];
				this.list1.forEach(e => {
					e['radio_flag'] = true
				})
			},
			set() {
				this.num = 0;
				this.list = [];
				this.bottomMessage = false
				this.flag = false;
				if (this.areaName == null && this.zTime == "" && this.zType == "" && this.message == "") {
					uni.showModal({
						title: '提示',
						content: '请输入搜索内容或筛选条件！',
						showCancel: false
					});
				} else {
					this.sear();
				}

			},
			async sear() {
				console.log("=========" + this.zType)
				const res = await this.$myRequest({
					url: '/zbger/inviteTenders/findTenData?provinceCode=' + this.provinceValue + '&cityCode=' + this.cityValue +
						'&announcementType=' + this.zType + '&day=' +
						this.zTime + '&keyword=' + this.message + '&pageNo=' + this.num
				});


				if (null !== res.data.data) {

					this.list = [...this.list, ...res.data.data];
					this.list.forEach(e => {
						e['radio_flag'] = true
						// console.log(e)
					})
					// this.list = res.data.list
					this.num = this.num + 10;


					if (this.list.length == 0) {
						uni.showModal({
							title: '提示',
							content: '该内容搜索不到！',
							showCancel: false
						});

					} else {
						this.flag = true;
						uni.showLoading({
							title: '加载中'
						});
						var me = this
						setTimeout(function() {
							uni.hideLoading();
							// console.log(me.list.length)
							// console.log(me.num)
							if (res.data.data.length < 10) {
								// setTimeout(function(){
								me.bottomMessage = true;

								// },1000)

							}
						}, 1000);
					}

				}
				if (this.list.length === 0) {
					this.bottomMessage = false;
					uni.showModal({
						title: '提示',
						content: '该内容搜索不到！',
						showCancel: false
					});
				}
			},
			det(e) {
				var me = this;

				var ss = e.currentTarget.dataset
				var id = ss.id
				var index = ss.index


				ss.radio_flag = false

				this.list[index].radio_flag = false
				// this.$set(this.list[index], 'radio_flag', false)
				//强制刷新
				this.$forceUpdate()
			
				const getUser = uni.getStorageSync("zbgerUserInfo")

				if (getUser !== null && getUser !== '' && getUser !== 'null') {
					uni.navigateTo({
						url: "../notice/total?id=" + id
					})
				} else {
					this.popupFlag = true
				}
			},
			// 获取数据源并分出一级二级
			getAllClassify() {
				let dataLen = this.dataSource.length;

				for (let i = 0; i < dataLen; i++) {
					if (this.dataSource[i].children === null) {
						this.dataSource[i].children = []
					}
					// 将数据源中的二级分类 push 进 childArr，作为二级分类的数据源
					this.childArr.push(this.dataSource[i].children)
				};



				// 一级分类的数据源
				this.classifyArr[0] = this.dataSource;

				// 第一次打开时，默认给一级分类添加它的二级分类
				// this.classifyArr[1] = this.childArr[0]
				// console.log(this.childArr[5])
			},

			// 选择商品分类
			classifyChange(e) {

				let value = e.target.value;
				console.log("value:" + value)
				this.classifyIndex = value;

				this.provinceValue = '';
				this.cityValue = '';

				if (this.classifyArr[0].length != 0) {
					this.areaName = this.classifyArr[0][this.classifyIndex[0]].label
					this.provinceValue = this.classifyArr[0][this.classifyIndex[0]].value
					this.name = this.areaName
				};

				if (this.classifyArr[1].length != 0) {
					this.areaName = this.classifyArr[1][this.classifyIndex[1]].label;
					if (this.areaName === '') {
						this.areaName = this.classifyArr[0][this.classifyIndex[0]].label
						this.provinceValue = this.classifyArr[0][this.classifyIndex[0]].value
					} else {
						this.name = this.areaName
						this.cityValue = this.classifyArr[1][this.classifyIndex[1]].value
					}
				}
				console.log(this.provinceValue + this.cityValue)
				if (this.name === '-- 地区 --') {

					this.areaName = ""
				}
				this.set();

			},

			// 获取二级分类
			columnchange(e) {
				// 当滚动切换一级分类时，为当前的一级分类添加它的子类
				if (e.detail.column == 0) {
					// #ifdef H5
					// 在小程序中直接赋值无效  H5 可直接赋值
					this.classifyArr[1] = this.childArr[e.detail.value]
					// #endif

					// #ifdef MP-WEIXIN
					// 在 H5 环境下 $set 会导致一级分类无法滚动， 小程序正常运行
					this.$set(this.classifyArr, 1, this.childArr[e.detail.value])
					// #endif
				}
			},

			result(val) {
				// console.log('filter_result:' + JSON.stringify(val));
				this.filterResult = JSON.stringify(val, null, 2);
				// console.log(this.filterResult)
				//拿到公告类型和时间的值
				this.zType = val.single;
				this.zTime = val.timesort;
				this.set();

			}


		},
		filters: {
			formatData(data) {
				if (data === null) {
					return '未知'
				}
				const arr = data.split("省")
				if (arr.length > 1) {
					console.log("要返回--->" + arr[1]);
					return arr[0]
				} else {
					return data
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.search {
		font-family: 'Microsoft YaHei';
		font-size: 28rpx;
		margin: 26rpx 70rpx auto;
		z-index: 10000;
		height: 90rpx;
		border-radius: 25rpx;
		background-color: #f10000;
		position: relative;
	}

	.in {
		text-align: center;
		width: 460rpx;
		height: 71.9rpx;
		background-color: #FFFFFF;
		border-radius: 25rpx;
		position: absolute;
		top: 10rpx;
		left: 25rpx;
	}

	.bu {
		font-size: 33rpx;
		width: 100rpx;
		height: 71.9rpx;
		color: #fff;
		text-align: center;
		line-height: 73rpx;
		border-radius: 25rpx;
		position: absolute;
		top: 10rpx;
		right: 8rpx;
	}

	.bu image {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		top: 12rpx;
		right: 25rpx;
	}

	.lgz {
		position: absolute;
		margin-top: 85rpx;
		line-height: 40rpx;
	}

	.box2 {
		margin: 1px 7px auto;
		word-wrap: break-word;
		word-break: break-all;
		font-size: 37rpx;
		line-height: 35px;
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
		overflow: hidden;
		white-space: nowrap;
		width: 100%;
		text-overflow: ellipsis;
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
		margin-top: 80rpx;
		font-size: 32rpx;
		text-align: center;
	}

	.dropdown {
		margin-top: 15rpx;
		border-top: 2px solid #ccc;
		border-bottom: 2px solid #ccc;
	}

	.item-picker {
		color: red;
		margin-left: 17rpx;
	}

	.con {
		color: #666666;
		font-size: 30rpx;
		text-align: center;
		width: 199.3rpx;
		overflow: hidden;
		// white-space: nowrap;
		// text-overflow: ellipsis;
		/* margin-left:45rpx; */
		// margin-top: 33rxp;
		margin-bottom: -84.5rpx;
		border: 2px solid #dcdfe6;
		// box-sizing: border-box;
		display: inline-block;
		// font-size: inherit;
		height: 75rpx;
		line-height: 73rpx;
		outline: 0;
	}



	.text {
		margin-left: 20px;
		width: 100%;
	}

	@import url("message.css")
</style>
