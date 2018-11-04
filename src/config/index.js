import {getParamByName, GetCookie} from '../util'

function IsWeixinOrAlipay() {
  var ua = window.navigator.userAgent.toLowerCase()
  //判断是不是微信
  if (ua.match(/MicroMessenger/i) == 'micromessenger') return "WeiXin"
  //判断是不是支付宝
  if (ua.match(/AlipayClient/i) == 'alipayclient') return "Alipay"
  if (ua.match(/aliapp\(tb/i) == 'aliapp\(tb' || ua.match(/tmall/i) == 'tmall') return "taobao"
  //判断是不是淘票票
  if (ua.match(/tbmovie/i) == 'tbmovie') return "Tpp"
  //哪个都不是
  return "false"
}

var expName = IsWeixinOrAlipay();

let CONFIG = {
  url: document.URL.indexOf('catchme') !== -1 ?  'https://front.catchme.com.cn/' : 'https://front.5zhua.cn/',
  localtionUrl: document.URL.indexOf('catchme') !== -1 ? 'http://www.catchme.com.cn/catch/':'http://www.5zhua.cn/catch/',
  localtionUrl2:document.URL.indexOf('catchme') !== -1 ? 'https://catchme.ewssh.m.jaeapp.com/' : 'https://zhua.ewssh.m.jaeapp.com/',
  version: '1.0.0',
  scene:1,
  site_version_id:GetCookie('site_version_id') || 0,
  get token(){
    return   process.env.NODE_ENV === 'development' ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Zyb250LjV6aHVhLmNuL2FwaS9hdXRoL3Rva2VuIiwiaWF0IjoxNTQxMzA3OTEyLCJleHAiOjE1NDE1MjM5MTIsIm5iZiI6MTU0MTMwNzkxMiwianRpIjoiU2NBSWVERnpyQ3VHUEllVSIsInN1YiI6Mn0.wiVbEHKO-6a-z4AOBifjd_9sxL3bdvftpufEemj4FIM' : GetCookie('token_')
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
