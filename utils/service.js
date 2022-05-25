const CLIENT_ID = 'd82063b4-d3de-45c3-ab39-3879b23f4edc'
const CLIENT_SECRET = 'DOgp09tH-OeY-YnqtWCQ5V5pFXu3-oNrDvv2Svj09JfeLQWdgFSA_J-0yZjE-_0b7fOjW-tsFM7WSxun'

const URL_BASE = 'https://api.cnblogs.com/api'
const URL_CLIENT_CREDENTIAL = 'https://api.cnblogs.com/token'
const URL_REDIRECT = 'https://oauth.cnblogs.com/auth/callback'
const URL_AUTHORIZE_CODE = 'https://oauth.cnblogs.com/connect/token'

// 获取本地存储的token
function getToken() {
	return wx.getStorageSync('token');
}

// 获取本地存储的refresh_token
function getRefreshToken() {
	return wx.getStorageSync('refresh_token');
}

// Client_Credentials授权方式获得token
async function getNewToken() {
	console.log('[info] getNewToken()函数')
	let data = {
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET,
		'grant_type': 'client_credentials'
	}
	let res = await request_authorization(URL_CLIENT_CREDENTIAL, data)
	wx.setStorageSync('token', res.data.access_token)
}

// Authorization_Code授权方式获得token和refresh_token
async function getNewTokenAndRefreshToken(code) {
	console.log('[info] getNewTokenAndRefreshToken()函数')
	let data = {
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET,
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': URL_REDIRECT
	}
	let res = await request_authorization(URL_AUTHORIZE_CODE, data)
	if (res.statusCode == 200) {
		wx.setStorageSync('token', res.data.access_token)
		wx.setStorageSync('refresh_token', res.data.refresh_token)
		return 1
	} else {
		return 0
	}
}

// 刷新token和refreshToken	
async function refreshToken() {
	console.log('[info] refreshToken()函数')
	let data = {
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET,
		'grant_type': 'refresh_token',
		'refresh_token': getRefreshToken(),
		'redirect_uri': URL_REDIRECT,
	}
	let res = await request_authorization(URL_AUTHORIZE_CODE, data)
	if (res.statusCode == 200) {
		console.log('refreshToken成功')
		wx.setStorageSync('token', res.data.access_token);
		wx.setStorageSync('refresh_token', res.data.refresh_token);
	} else {
		wx.showToast({
			title: '登录过期，请重新登陆',
			icon: 'none'
		})
	}
}

// 静默刷新token，每次登陆小程序时便执行
async function refreshTokenSilently() {
	console.log('[info] refreshTokenSilently()函数');
	if (getToken() && getRefreshToken()) {
		console.log('[info] 本地存储中存在token和refreshToken')
		refreshToken();
	} else {
		console.log('[info] 本地存储中不存在token或refreshToken，需输入授权码code获取token和refreshToken');
		wx.showToast({
			title: '尚未登录',
			icon: 'none'
		})
	}
}

// 发出获取授权的请求
function request_authorization(url, data = {}) {
	return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: data,
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// 发出访问普通接口的请求
function request(url, data = {}, method = 'GET') {
	return new Promise((resolve, reject) => {
		wx.request({
			url: URL_BASE + url,
			data: data,
			method: method,
			header: {
				'Authorization': 'Bearer ' + getToken()
			},
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// 对外暴露的接口(方法)
module.exports = {
	refreshTokenSilently: refreshTokenSilently,
	getNewToken: getNewToken,
	getNewTokenAndRefreshToken: getNewTokenAndRefreshToken,
	request: request,
	getToken: getToken
}