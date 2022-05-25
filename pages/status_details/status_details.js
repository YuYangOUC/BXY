var service = require('../../utils/service.js')

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		statusInfo: {},
		statusComments: [],
		submitComment: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		this.setData({
			statusInfo: JSON.parse(decodeURIComponent(options.item))
		})
		let statusCommentsRes = await service.request('/statuses/' + this.data.statusInfo.Id + '/comments')
		this.setData({
			statusComments: statusCommentsRes.data
		})
	},

	handleInput(event) {
		this.setData({
			submitComment: event.detail.value
		})
	},

	submitComment: async function (e) {
		let id = this.data.statusInfo.Id
		let submitCommentRes = await service.request('/statuses/' + id + '/comments', {
			'Content': this.data.submitComment
		}, 'POST')
		if (submitCommentRes.statusCode == 403) {
			wx.showToast({
				title: '请先登录',
				icon: 'none'
			})
		} else if (submitCommentRes.statusCode == 500) {
			wx.showToast({
				title: '内容不能为空',
				icon: 'none'
			})
		} else if (submitCommentRes.statusCode > 500) {
			wx.showToast({
				title: '请稍后重试',
				icon: 'none'
			})
		} else {
			// 评论成功，重新刷新页面
			wx.showNavigationBarLoading();
			let statusCommentsRes = await service.request('/statuses/' + id + '/comments')
			this.setData({
				statusComments: statusCommentsRes.data
			})
			wx.hideNavigationBarLoading()
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