var service = require('../../utils/service.js')

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		code: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	// 表单项内容发生改变的回调
	handleInput(event) {
		this.setData({
			code: event.detail.value
		})
	},

	// 登录的回调
	async login() {
		let code = this.data.code;

		// 前端验证
		if (!code) {
			wx.showToast({
				title: 'code不能为空',
				icon: 'none'
			})
			return
		}
		let codeReg = /^([A-Z]|[0-9]){64}$/;
		if (!codeReg.test(code)) {
			wx.showToast({
				title: 'code格式错误',
				icon: 'none'
			})
			return
		}

		// 获取新的token和refresh_token
		if (await service.getNewTokenAndRefreshToken(code) == 0) {
			wx.showToast({
				title: '授权码已过期',
				icon: 'none'
			})
		} else {
			// 将用户信息存储到本地存储
			let userInfoRes = await service.request('/users')
			if (userInfoRes.statusCode == 200) {
				wx.setStorageSync('userInfo', userInfoRes.data)
				// 跳转至个人中心personal页面
				wx.reLaunch({
					url: '/pages/personal/personal?'
				})
			} else {
				wx.showToast({
					title: '登陆失败',
					icon: 'none'
				})
			}
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})