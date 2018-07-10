// 配置项
let host= "https://wx.api.hs1p.com"

const config = {
	host,
	loginUrl: `${host}/api/login/getsessionkey`,
	userUrl: `${host}/weapp/user`,
	uploadImageUrl:`${host}/api/image/uploadimage`,
	imgUrl:'http://t.img.i.hsuperior.com'
}
export default config