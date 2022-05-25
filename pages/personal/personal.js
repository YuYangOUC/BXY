let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指当前的坐标

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		coverTransform: 'translateY(0)',
		coveTransition: '',

		age: '暂无数据',
		fans: '暂无数据',
		follow: '暂无数据',
		post: '暂无数据'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		this.setData({
			userInfo: wx.getStorageSync('userInfo')
		})

		if (this.data.userInfo) {
			this.setData({
				age: '1 个月',
				fans: '1',
				follow: '5',
				post: '6'
			})
		}
	},

	// 跳转到登录页面(login)
	toLogin() {
		wx.navigateTo({
			url: '/pages/login/login'
		})
	},

	// 跳转到个人博客页(blog)
	toBlog: function () {
		if (!this.data.userInfo) {
			wx.showToast({
				title: '我的博客：请先登录',
				icon: 'none'
			})
		} else {
			let blogApp = this.data.userInfo.BlogApp
			let avatar = this.data.userInfo.Avatar
			let author = this.data.userInfo.DisplayName
			wx.navigateTo({
				url: '/pages/blog/blog?blogApp=' + blogApp + '&avatar=' + avatar + '&author=' + author,
			})
		}
	},

	// 跳转到我的闪存(myStatuses)
	toMyStatuses: function () {
		if (!this.data.userInfo) {
			wx.showToast({
				title: '我的闪存：请先登录',
				icon: 'none'
			})
		} else {
			wx.navigateTo({
				url: '/pages/myStatuses/myStatuses',
			})
		}
	},

	// 跳转到我的收藏(collection)
	toCollection: function () {
		if (!this.data.userInfo) {
			wx.showToast({
				title: '我的收藏：请先登录',
				icon: 'none'
			})
		} else {
			wx.navigateTo({
				url: '/pages/collection/collection',
			})
		}
	},

	handleTouchStart(event) {
		startY = event.touches[0].clientY;
	},
	handleTouchMove(event) {
		moveY = event.touches[0].clientY;
		if (moveY - startY < 0) {
			return;
		}

		this.setData({
			coverTransform: `translateY(90rpx)`,
			coveTransition: `transform 0.15s`
		})
	},
	handleTouchEnd() {
		this.setData({
			coverTransform: `translateY(0rpx)`,
			coveTransition: `transform 0.7s`
		})
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