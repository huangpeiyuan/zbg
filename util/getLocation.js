import QQMapWX from "./qqmap-wx-jssdk.min.js"
export const getCity = () => {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (res) => {
				if (res.authSetting && res.authSetting.hasOwnProperty("scope.userLocation")) {
					console.log(res)
					if (res.authSetting["scope.userLocation"]) {

						getCityInfo();

					} else {
						uni.showModal({
							title: "提示",
							content: "请重新授权获取你的地理位置，否则部分功能将无法使用",
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({
										success: () => getCityInfo()
									});
								} else {
									// reject("请授权获取你的地理位置，否则部分功能将无法使用！");
									resolve(null)
								}
							},
						})
					}
				} else {
					getCityInfo();
				}
			}
		});

		// 获取地理位置信息
		const getCityInfo = () => {
			// 腾讯地图Api
			const qqmapsdk = new QQMapWX({
				key: "B36BZ-A56R4-6WKUJ-XEICO-75NLF-JZFHQ"
			});
			// 授权
			uni.authorize({
				scope: "scope.userLocation",
				success: () => {
					uni.getLocation({
						type: "gcj02", //  wgs84: 返回GPS坐标，gcj02: 返回国测局坐标
						success: res => {
							const {
								latitude,
								longitude
							} = res;
							const location = {
								latitude,
								longitude
							};

							qqmapsdk.reverseGeocoder({
								location,
								success: res => resolve(res.result)
							});
						},
						fail() {
							// uni.showModal({
							// 	title: '您手机定位功能没有开启',
							// 	content: '请在系统设置中打开定位服务',
							// 	success(res) {
							// 		if (res.confirm) {

							// 			setTimeout(getCityInfo, 4000)

							// 		} else {
							// 			resolve(null)
							// 		}
							// 	}
							// })
							uni.showToast({
								title: '您未开启手机定位，无法获得您周边招标信息',
								icon: 'none',
								duration: 2000,
								success() {
									resolve(null)
								}
							})
						}
					});
				},
				fail() {
					// openConfirm()
					uni.showToast({
						title: '您未授权，无法获得您周边招标信息',
						icon: 'none',
						duration: 2000,
						success() {
							resolve(null)
						}
					})
				}
			});
		};

		const openConfirm = () => {
			uni.showModal({
				title: '请求授权当前位置',
				content: '需要获取您的地理位置，请确认授权',
				success: (res) => {
					if (res.confirm) {
						uni.openSetting({
							success: () => getCityInfo(),
							fail() {
								uni.showToast({
									title: '你未授权，无法获得周边信息',
									icon: 'none',
									duration: 1000
								})
							}
						})

					} else if (res.cancel) {
						uni.showToast({
							title: '你拒绝了授权，无法获得周边信息',
							icon: 'none',
							duration: 1000
						})
					}
				}
			});
		}
	});


}
