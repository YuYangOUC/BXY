var service = require('../../utils/service.js')
const pageSize = 15

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		lastedNewsList: [], // 最新发布新闻列表
		recommendedNewsList: [], // 推荐新闻
		hotNewsList: [], // 热门新闻
		lastedNewsIndex: 1,
		recommendedNewsIndex: 1,
		hotNewsIndex: 1,

		currentTab: 0,
		isTriggered: false, // 标识下拉刷新是否被触发
		showLoading_lasted: true,
		showLoading_recommended: true,
		showLoading_hot: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		let lastedNewsListRes = await service.request('/Newsitems', {
			pageIndex: 1,
			pageSize: pageSize
		})
		let recommendedNewsListRes = await service.request('/newsitems/@recommended', {
			pageIndex: 1,
			pageSize: pageSize
		})
		let hotNewsListRes = await service.request('/newsitems/@hot-week', {
			pageIndex: 1,
			pageSize: pageSize
		})

		if (lastedNewsListRes.data.length < pageSize) {
			this.setData({
				showLoading_lasted: false
			})
		}
		if (recommendedNewsListRes.data.length < pageSize) {
			this.setData({
				showLoading_recommended: false
			})
		}
		if (hotNewsListRes.data.length < pageSize) {
			this.setData({
				showLoading_hot: false
			})
		}

		this.setData({
			lastedNewsList: lastedNewsListRes.data,
			recommendedNewsList: recommendedNewsListRes.data,
			hotNewsList: hotNewsListRes.data
		})
	},

	switchNav: function (e) {
		if (this.data.currentTab !== e.target.dataset.current) {
			this.setData({
				currentTab: e.target.dataset.current
			})
		}
	},
	bindChange: function (e) {
		this.setData({
			currentTab: e.detail.current
		});
	},

	// 进入文章详情页
	toArticleDetails: function (e) {
		var item = JSON.stringify(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '/pages/news_details/news_details?item=' + encodeURIComponent(item)
		})
	},

	// 最新发布下拉刷新
	refreshLastedNews: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			lastedNewsIndex: 1,
			showLoading_lasted: true
		})
		let lastedNewsListRes = await service.request('/Newsitems', {
			pageIndex: this.data.lastedNewsIndex,
			pageSize: pageSize
		})

		this.setData({
			lastedNewsList: lastedNewsListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 推荐新闻下拉刷新
	refreshRecommendedNews: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			recommendedNewsIndex: 1,
			showLoading_recommended: true
		})
		let recommendedNewsListRes = await service.request('/newsitems/@recommended', {
			pageIndex: this.data.recommendedNewsIndex,
			pageSize: pageSize
		})

		this.setData({
			recommendedNewsList: recommendedNewsListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 热门新闻下拉刷新
	refreshHotNews: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			hotNewsIndex: 1,
			showLoading_hot: true
		})
		let hotNewsListRes = await service.request('/newsitems/@hot-week', {
			pageIndex: this.data.hotNewsIndex,
			pageSize: pageSize
		})

		this.setData({
			hotNewsList: hotNewsListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 最新发布上滑触底加载更多
	loadMoreLastedNews: async function () {
		this.data.lastedNewsIndex++;
		let lastedNewsListRes = await service.request('/Newsitems', {
			pageIndex: this.data.lastedNewsIndex,
			pageSize: pageSize
		})

		if (lastedNewsListRes.data.length == 0) {
			this.setData({
				showLoading_lasted: false
			})
		}

		this.setData({
			lastedNewsList: this.data.lastedNewsList.concat(lastedNewsListRes.data)
		})
	},

	// 推荐新闻上滑触底加载更多
	loadMoreRecommendedNews: async function () {
		this.data.recommendedNewsIndex++;
		let recommendedNewsListRes = await service.request('/newsitems/@recommended', {
			pageIndex: this.data.recommendedNewsIndex,
			pageSize: pageSize
		})

		if (recommendedNewsListRes.data.length == 0) {
			this.setData({
				showLoading_recommended: false
			})
		}

		this.setData({
			recommendedNewsList: this.data.recommendedNewsList.concat(recommendedNewsListRes.data)
		})
	},

	// 热门新闻上滑触底加载更多
	loadMoreHotNews: async function () {
		this.data.hotNewsIndex++;
		let hotNewsListRes = await service.request('/newsitems/@hot-week', {
			pageIndex: this.data.hotNewsIndex,
			pageSize: pageSize
		})

		if (hotNewsListRes.data.length == 0) {
			this.setData({
				showLoading_hot: false
			})
		}

		this.setData({
			hotNewsList: this.data.hotNewsList.concat(hotNewsListRes.data)
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