import {getParamByName, GetCookie} from '../util'

function IsWeixinOrAlipay() {
  var ua = window.navigator.userAgent.toLowerCase()
  //判断是不是微信
  if (ua.match(/MicroMessenger/i) == 'micromessenger') return "WeiXin"
  //判断是不是支付宝
  if (ua.match(/AlipayClient/i) == 'alipayclient') return "Alipay"
  if (ua.match(/aliapp\(tb/i) == 'aliapp\(tb') return "taobao"
  //判断是不是淘票票
  if (ua.match(/tbmovie/i) == 'tbmovie') return "Tpp"
  //哪个都不是
  return "false"
}

var expName = IsWeixinOrAlipay();

let CONFIG = {
  url: document.URL.indexOf('catchme') !== -1 ?  'http://front.catchme.com.cn/' : 'http://front.5zhua.cn/',
  localtionUrl: document.URL.indexOf('catchme') !== -1 ? 'http://www.catchme.com.cn/catch/':'http://www.5zhua.cn/catch/',
  localtionUrl2: document.URL.indexOf('catchme') !== -1 ? 'http://www.catchme.com.cn/':'http://www.5zhua.cn/',
  socketUrl: document.URL.indexOf('catchme') !== -1 ? 'ws://ws.catchme.com.cn/':'ws://ws.5zhua.cn/',
  version: '1.0.0',
  scene:1,
  site_version_id:GetCookie('site_version_id') || 0,
  get token(){
    return   process.env.NODE_ENV === 'development' ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZnJvbnQuNXpodWEuY24vYXBpL2F1dGgvdG9rZW4iLCJpYXQiOjE1MzQ3Mjk1OTgsImV4cCI6MTUzNDk0NTU5OCwibmJmIjoxNTM0NzI5NTk4LCJqdGkiOiJtNUdkRFJKZU5WMmhtNmc0Iiwic3ViIjoyfQ.vblH37XzqHa-MGUFvEshbdLEZMwzIaBXwqpaviwLuig' : GetCookie('token_')
  },
  machine_no: getParamByName('machine') || 'CATCH_100024',
  u: function () {
    return `?machine=${this.machine_no}&token=${this.token}`
  },
  isWx: expName === 'WeiXin' ? true : false,
  isAlipay: expName === 'Alipay' ? true : false,
  isTaobao: expName === 'taobao' ? true : false,
  isTpp: expName === 'Tpp' ? true : false
}


export default CONFIG
