var service = require('../../utils/service.js')
const pageSize = 15

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		newsList: [],
		statusesList: [],
		pageIndex: 1,

		submitStatus: '',
		//初始化隐藏模态输入框
		hiddenmodalput: true,

		isTriggered: false, // 标识下拉刷新是否被触发
		showLoading: true // 标识下滑触底加载更多是否显示
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		let newsListRes = await service.request('/newsitems/@hot-week', {
			pageIndex: 1,
			pageSize: 5
		})
		let statusesListRes = await service.request('/statuses/@all', {
			pageIndex: 1,
			pageSize: pageSize
		})

		if (statusesListRes.data.length < pageSize) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			newsList: newsListRes.data,
			statusesList: statusesListRes.data
		})
	},

	// 查看更多新闻
	toMoreNews: function (e) {
		wx.navigateTo({
			url: '/pages/more_news/more_news'
		})
	},

	// 进入文章详情页
	toArticleDetails: function (e) {
		var item = JSON.stringify(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '/pages/news_details/news_details?item=' + encodeURIComponent(item)
		})
	},

	// 进入闪存详情页
	toStatusDetails: function (e) {
		var item = JSON.stringify(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '/pages/status_details/status_details?item=' + encodeURIComponent(item)
		})
	},

	// 显示或隐藏模态框
	modalinput: function () {
		this.setData({
			hiddenmodalput: !this.data.hiddenmodalput
		})
	},
	handleInput(event) {
		this.setData({
			submitStatus: event.detail.value
		})
	},
	submitStatus: async function (e) {
		let submitStatusRes = await service.request('/statuses', {
			'Content': this.data.submitStatus
		}, 'POST')
		if (submitStatusRes.statusCode == 403) {
			wx.showToast({
				title: '请先登录',
				icon: 'none'
			})
		} else if (submitStatusRes.statusCode == 500) {
			wx.showToast({
				title: '内容为空或内容重复',
				icon: 'none'
			})
		} else {
			this.setData({
				hiddenmodalput: !this.data.hiddenmodalput
			})

			// 重新刷新页面
			wx.showNavigationBarLoading();
			this.setData({
				pageIndex: 1
			})
			let statusesListRes = await service.request('/statuses/@all', {
				pageIndex: this.data.pageIndex,
				pageSize: pageSize
			})
			this.setData({
				statusesList: statusesListRes.data,
			})
			wx.hideNavigationBarLoading()
		}
	},

	// 下拉刷新
	refreshPage: async function (e) {
		wx.showNavigationBarLoading();
		this.setData({
			pageIndex: 1
		})
		let statusesListRes = await service.request('/statuses/@all', {
			pageIndex: this.data.pageIndex,
			pageSize: pageSize
		})

		this.setData({
			statusesList: statusesListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 上滑触底加载更多
	loadMore: async function (e) {
		this.data.pageIndex++;
		let statusesListRes = await service.request('/statuses/@all', {
			pageIndex: this.data.pageIndex,
			pageSize: pageSize
		})

		if (statusesListRes.data.length == 0) {
			this.setData({
				showLoading: false
			})
		}

		this.setData({
			statusesList: this.data.statusesList.concat(statusesListRes.data)
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
	 * 页面上滑触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})