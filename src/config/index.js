import {getParamByName, GetCookie} from '../util'

function IsWeixinOrAlipay() {
  var ua = window.navigator.userAgent.toLowerCase()
  //判断是不是微信
  if (ua.match(/MicroMessenger/i) == 'micromessenger') return "WeiXin"
  //判断是不是支付宝
  if (ua.match(/AlipayClient/i) == 'alipayclient') return "Alipay"
  //判断是不是淘票票
  if (ua.match(/tbmovie/i) == 'tbmovie') return "Tpp"
  //哪个都不是
  return "false"
}

var expName = IsWeixinOrAlipay();

let CONFIG = {
  url: document.URL.indexOf('catchme') !== -1 ?  'https://front.catchme.com.cn/' : 'https://front.5zhua.cn/',
  localtionUrl: document.URL.indexOf('catchme') !== -1 ? 'http://www.catchme.com.cn/':'http://www.5zhua.cn/',
  localtionUrl2:document.URL.indexOf('catchme') !== -1 ? 'https://catchme.ewssh.m.jaeapp.com/' : 'https://zhua.ewssh.m.jaeapp.com/',
  socketUrl: document.URL.indexOf('catchme') !== -1 ? 'ws://ws.catchme.com.cn/':'ws://ws.5zhua.cn/',
  version: '1.0.0',
  scene:1,
  site_version_id:GetCookie('site_version_id') || 0,
  get token(){
    return   process.env.NODE_ENV === 'development' ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Zyb250LjV6aHVhLmNuL2FwaS9hdXRoL3Rva2VuIiwiaWF0IjoxNTM3MjM1NDQwLCJleHAiOjE1Mzc0NTE0NDAsIm5iZiI6MTUzNzIzNTQ0MCwianRpIjoicHNtbjkzUTFrQWRmYzBGayIsInN1YiI6Mn0.Lg0_utuWj7M7qb9azonEq7aBlHSeOIIhNTLNlWP2ZxY' : GetCookie('token_')
  },
  machine_no: getParamByName('machine') || 'CATCH_100024',
  u: function () {
    return `?machine=${this.machine_no}&token=${this.token}`
  },
  isWx: expName === 'WeiXin' ? true : false,
  isAlipay: expName === 'Alipay' ? true : false,
  isTpp: expName === 'Tpp' ? true : false
}


export default CONFIG
