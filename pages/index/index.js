var service = require('../../utils/service.js')
const pageSize = 15

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		homePageList: [],
		essenceList: [],
		homePageIndex: 1,
		essencePageIndex: 1,

		currentTab: 0,
		isTriggered: false, // 标识下拉刷新是否被触发
		showLoading_homePage: true,
		showLoading_essence: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await service.getNewToken()
		await service.refreshTokenSilently();
		let homePageListRes = await service.request('/blogposts/@sitehome', {
			pageIndex: 1,
			pageSize: pageSize
		})
		let essenceListRes = await service.request('/blogposts/@picked', {
			pageIndex: 1,
			pageSize: pageSize
		})

		if (homePageListRes.data.length < pageSize) {
			this.setData({
				showLoading_homePage: false
			})
		}
		if (essenceListRes.data.length < pageSize) {
			this.setData({
				showLoading_essence: false
			})
		}

		this.setData({
			homePageList: homePageListRes.data,
			essenceList: essenceListRes.data
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

	// 跳转到作者博客页
	toBlog: function (e) {
		let blogApp = e.currentTarget.dataset.blogapp
		let avatar = e.currentTarget.dataset.avatar
		let author = e.currentTarget.dataset.author
		wx.navigateTo({
			url: '/pages/blog/blog?blogApp=' + blogApp + '&avatar=' + avatar + '&author=' + author,
		})
	},

	// 进入文章详情页
	toArticleDetails: function (e) {
		var item = JSON.stringify(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '/pages/blog_details/blog_details?item=' + encodeURIComponent(item)
		})
	},

	// 网站首页下拉刷新
	refreshHomePage: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			homePageIndex: 1,
			showLoading_homePage: true
		})
		let homePageListRes = await service.request('/blogposts/@sitehome', {
			pageIndex: this.data.homePageIndex,
			pageSize: pageSize
		})

		this.setData({
			homePageList: homePageListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 精华区下拉刷新
	refreshEssence: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			essencePageIndex: 1,
			showLoading_essence: true
		})
		let essenceListRes = await service.request('/blogposts/@picked', {
			pageIndex: this.data.essencePageIndex,
			pageSize: pageSize
		})

		this.setData({
			essenceList: essenceListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 网站首页上滑触底加载更多
	loadMoreHomePage: async function () {
		this.data.homePageIndex++;
		let homePageListRes = await service.request('/blogposts/@sitehome', {
			pageIndex: this.data.homePageIndex,
			pageSize: pageSize
		})

		if (homePageListRes.data.length == 0) {
			this.setData({
				showLoading_homePage: false
			})
		}

		this.setData({
			homePageList: this.data.homePageList.concat(homePageListRes.data)
		})
	},

	// 精华区上滑触底加载更多
	loadMoreEssence: async function () {
		this.data.essencePageIndex++;
		let essenceListRes = await service.request('/blogposts/@picked', {
			pageIndex: this.data.essencePageIndex,
			pageSize: pageSize
		})

		if (essenceListRes.data.length == 0) {
			this.setData({
				showLoading_essence: false
			})
		}

		this.setData({
			essenceList: this.data.essenceList.concat(essenceListRes.data)
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