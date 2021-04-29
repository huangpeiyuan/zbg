const BASE_URL = 'https://zbger.com:8443'
// const BASE_URL = 'http://192.168.0.108:8080'
export const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			success: (res) => {
				if (res.statusCode !== 200) {
					uni.showToast({
						title: '获取数据有误'
					})
				}
				
				resolve(res)
			},
			fail: (err) => {
				// uni.showToast({
				// 	// title: '请求接口失败'
				// })
				reject(err)
			}
		})
	})
}
