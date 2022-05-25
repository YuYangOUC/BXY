var service = require('../../utils/service.js')
const pageSize = 10

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		collectList: [],
		pageIndex: 1,

		isTriggered: false, // 标识下拉刷新是否被触发
		showLoading: true // 标识下滑触底加载更多是否显示
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		let collectListRes = await service.request('/Bookmarks', {
			pageIndex: 1,
			pageSize: pageSize
		})

		if (collectListRes.data.length < pageSize) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			collectList: collectListRes.data
		})
	},

	// 下拉刷新
	refreshPage: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			pageIndex: 1,
			showLoading: true
		})
		let collectListRes = await service.request('/Bookmarks', {
			pageIndex: this.data.pageIndex,
			pageSize: pageSize
		})

		if (collectListRes.data.length < pageSize) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			collectList: collectListRes.data,
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
		let collectListRes = await service.request('/Bookmarks', {
			pageIndex: this.data.pageIndex,
			pageSize: pageSize
		})

		if (collectListRes.data.length == 0) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			collectList: this.data.collectList.concat(collectListRes.data)
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