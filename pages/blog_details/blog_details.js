var service = require('../../utils/service.js')
var wxParse = require('../../utils/wxParse/wxParse.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		articleInfo: {},
		articleComments: [],
		submitComment: '',
		//初始化隐藏模态输入框
		hiddenmodalput: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		this.setData({
			articleInfo: JSON.parse(decodeURIComponent(options.item))
		})

		let articleContentRes = await service.request('/blogposts/' + this.data.articleInfo.Id + '/body')
		wxParse.wxParse('articleContent', 'html', articleContentRes.data, this, 8)

		let articleCommentsRes = await service.request('/blogs/' + this.data.articleInfo.BlogApp + '/posts/' + this.data.articleInfo.Id + '/comments', {
			pageIndex: 1,
			pageSize: 100
		})
		this.setData({
			articleComments: articleCommentsRes.data
		})
	},

	async collect(params) {
		let articleInfo = this.data.articleInfo
		let collectRes = await service.request('/Bookmarks', {
			'Title': articleInfo.Title,
			'LinkUrl': articleInfo.Url,
			'Summary': articleInfo.Description
		}, 'POST')
		if (collectRes.statusCode == 500) {
			// let deleteRes = await service.request("/Bookmarks?url=" + encodeURIComponent(articleInfo.Url), {}, 'DELETE')
			// console.log(deleteRes)
			// wx.showToast({
			// 	title: '已取消',
			// })
			// return
		} else if (collectRes.statusCode == 201) {
			wx.showToast({
				title: '收藏成功',
			})
			return
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