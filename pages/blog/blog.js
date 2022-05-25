var service = require('../../utils/service.js')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		blogApp: '',
		avatar: '',
		author: '',
		blogList: [],
		pageIndex: 1,
		pageSize: 1,

		isTriggered: false, // 标识下拉刷新是否被触发
		showLoading: true // 标识下滑触底加载更多是否显示
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		this.setData({
			blogApp: options.blogApp,
			avatar: options.avatar,
			author: options.author
		})
		let blogListRes = await service.request('/blogs/' + this.data.blogApp + '/posts', {
			pageIndex: 1
		})

		let blogInfoRes = await service.request('/blogs/' + this.data.blogApp)
		this.setData({
			pageSize: blogInfoRes.data.pageSize
		})
		if (blogListRes.data.length < this.data.pageSize) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			blogList: blogListRes.data
		})
	},

	// 进入文章详情页
	toArticleDetails: function (e) {
		var item = JSON.stringify(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '/pages/blog_details/blog_details?item=' + encodeURIComponent(item)
		})
	},

	// 下拉刷新
	refreshPage: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			pageIndex: 1,
			showLoading: true
		})
		let blogListRes = await service.request('/blogs/' + this.data.blogApp + '/posts', {
			pageIndex: this.data.pageIndex
		})
		if (blogListRes.data.length < this.data.pageSize) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			blogList: blogListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 上滑触底加载更多
	loadMore: async function () {
		this.data.pageIndex++;
		let blogListRes = await service.request('/blogs/' + this.data.blogApp + '/posts', {
			pageIndex: this.data.pageIndex
		})

		if (blogListRes.data.length == 0) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			blogList: this.data.blogList.concat(blogListRes.data)
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