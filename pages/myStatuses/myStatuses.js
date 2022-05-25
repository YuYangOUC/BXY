var service = require('../../utils/service.js')
const pageSize = 10

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		myList: [],
		followingList: [],
		myCommentList: [],
		myIndex: 1, // 我发布的
		followingIndex: 1, // 我关注的
		myCommentIndex: 1, // 我评论的

		currentTab: 0,
		isTriggered: false, // 标识下拉刷新是否被触发
		showLoading_my: true,
		showLoading_following: true,
		showLoading_myComment: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		let myListRes = await service.request('/statuses/@my', {
			pageIndex: 1,
			pageSize: pageSize
		})
		let followingListRes = await service.request('/statuses/@following', {
			pageIndex: 1,
			pageSize: pageSize
		})
		let myCommentListRes = await service.request('/statuses/@mycomment', {
			pageIndex: 1,
			pageSize: pageSize
		})

		if (myListRes.data.length < pageSize) {
			this.setData({
				showLoading_my: false
			})
		}
		if (followingListRes.data.length < pageSize) {
			this.setData({
				showLoading_following: false
			})
		}
		if (myCommentListRes.data.length < pageSize) {
			this.setData({
				showLoading_myComment: false
			})
		}

		this.setData({
			myList: myListRes.data,
			followingList: followingListRes.data,
			myCommentList: myCommentListRes.data
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

	// 进入闪存详情页
	toStatusDetails: function (e) {
		var item = JSON.stringify(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '/pages/status_details/status_details?item=' + encodeURIComponent(item)
		})
	},

	// 我发布的下拉刷新
	refreshMy: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			myIndex: 1,
			showLoading_my: true
		})
		let myListRes = await service.request('/statuses/@my', {
			pageIndex: this.data.myIndex,
			pageSize: pageSize
		})
		if (myListRes.data.length < pageSize) {
			this.setData({
				showLoading_my: false
			})
		}

		this.setData({
			myList: myListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 我关注的下拉刷新
	refreshFollowing: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			followingIndex: 1,
			showLoading_following: true
		})
		let followingListRes = await service.request('/statuses/@following', {
			pageIndex: this.data.followingIndex,
			pageSize: pageSize
		})
		if (followingListRes.data.length < pageSize) {
			this.setData({
				showLoading_following: false
			})
		}

		this.setData({
			followingList: followingListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 我评论的下拉刷新
	refreshMyComment: async function () {
		wx.showNavigationBarLoading();
		this.setData({
			myCommentIndex: 1,
			showLoading_myComment: true
		})
		let myCommentListRes = await service.request('/statuses/@mycomment', {
			pageIndex: this.data.myCommentIndex,
			pageSize: pageSize
		})
		if (myCommentListRes.data.length < pageSize) {
			this.setData({
				showLoading_myComment: false
			})
		}

		this.setData({
			myCommentList: myCommentListRes.data,
			isTriggered: false
		})
		wx.showToast({
			title: '刷新成功',
			duration: 600
		})
		wx.hideNavigationBarLoading()
	},

	// 我发布的上滑触底加载更多
	loadMoreMy: async function () {
		this.data.myIndex++;
		let myListRes = await service.request('/statuses/@my', {
			pageIndex: this.data.myIndex,
			pageSize: pageSize
		})

		if (myListRes.data.length == 0) {
			this.setData({
				showLoading_my: false
			})
		}
		this.setData({
			myList: this.data.myList.concat(myListRes.data),
		})
	},

	// 我关注的上滑触底加载更多
	loadMoreFollowing: async function () {
		this.data.followingIndex++;
		let followingListRes = await service.request('/statuses/@following', {
			pageIndex: this.data.followingIndex,
			pageSize: pageSize
		})

		if (followingListRes.data.length == 0) {
			this.setData({
				showLoading_following: false
			})
		}
		this.setData({
			followingList: this.data.followingList.concat(followingListRes.data),
		})
	},

	// 我评论的上滑触底加载更多
	loadMoreMyComment: async function () {
		this.data.myCommentIndex++;
		let myCommentListRes = await service.request('/statuses/@mycomment', {
			pageIndex: this.data.myCommentIndex,
			pageSize: pageSize
		})

		if (myCommentListRes.data.length == 0) {
				this.setData({
				showLoading_myComment: false
			})
		}
		this.setData({
			myCommentList: this.data.myCommentList.concat(myCommentListRes.data),
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