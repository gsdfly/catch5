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
  url: document.URL.indexOf('catchme') !== -1 ?  'http://front.catchme.com.cn/' : 'http://front.5zhua.cn/',
  localtionUrl: document.URL.indexOf('catchme') !== -1 ? 'http://www.catchme.com.cn/catch/':'http://www.5zhua.cn/catch/',
  version: '1.0.0',
  scene:1,
  site_version_id:GetCookie('site_version_id') || 0,
  get token(){
    return   process.env.NODE_ENV === 'development' ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZnJvbnQuNXpodWEuY24vd2VjaGF0L29hdXRoX3Njb3BlIiwiaWF0IjoxNTMxMTA1Mjg5LCJleHAiOjE1MzEzMjEyODksIm5iZiI6MTUzMTEwNTI4OSwianRpIjoiNDR2Sjg5MmhBRGpnaEl6OCIsInN1YiI6Mn0.apRzmpRUucBoTcXbNQh30OUjBRc8g4vgkkEolaDy9Gw' : GetCookie('token_')
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
