import $axios from 'axios'
import CONFIG from './../config/index'
import {jsonToStr} from "../util/index";
import {getErrMsg,SetCookie} from "../util/index";
import store from './../store'
import callbackUrl from './../callbackUrl'

let instance = $axios.create({
  params: {
    version: CONFIG.version,
    scene:CONFIG.scene,
  }
})

instance.interceptors.response.use(function(response) {
  // 错误码信息
  let res = response.data
  if (res.status_code !== 200) {
    // sendError({code:response.data.status_code,message:response.data.message,url:response.config.url});
    store.commit('changeTipContent',getErrMsg(res.status_code, res.message))
    return Promise.reject(res);
  }
  return res
}, async function(error) {
  // Do something with response error
  // sendError({code:error.response.data.status_code,message:error.response.data.message,url:error.config.url});
  // if(error.response.data.status_code === 401){
  //   await callbackUrl();
  // }
  console.log(error, '全局err')
  store.commit('changeTipContent',{
    imgSrc:"http://res.catchme.com.cn/imgs-2018-02-05/tip/tip1.png",
    content:['娃娃机出了点状况','请跟换机器'],
    button:'扫码换机',
    isShow:true
  });
  console.log(store.state.user.tipContent)
  SetCookie('token_', '')
  return Promise.reject(error);
})

function sendError(obj) {
  var str = {
    play_id:store.state.user.user.play_id || "",
    machine_no:CONFIG.machine_no,
    extra:JSON.stringify({
      code:obj.code,
      message:obj.message,
      url:obj.url
    })
  };
  instance.get(CONFIG.url+'api/error', {params:str})
}

export default {
  getUser: function (params) {
    return instance.get(CONFIG.url + 'api/player/info', {
      params: params
    })
  },
  getCoinList: function (params) {
    return instance.get(CONFIG.url + 'api/machine/coin_price', {
      params: params
    })
  },
  getConsume: function (params) {
    return instance.get(CONFIG.url + 'api/player/consume', {
      params: params
    })
  },
  getPayJssdk: function (params) {
    return instance.get(CONFIG.url + 'api/wechat/order', {
      params: params
    })
  },
  getPayAlipay:function (params) {
    return instance.post(CONFIG.url + 'api/alipay/tradeOrder', jsonToStr(params))
  },
  getPayTpp: function (params) {
    return instance.get(CONFIG.url + 'api/tpp/order', {
      params: params
    })
  },
  judgeMachine: function (params) {
    return instance.get(CONFIG.url + 'api/machine/info', {
      params: params
    })
  },
  getFreeCoin: function (params) {
    return instance.post(CONFIG.url + 'api/free/order', jsonToStr(params))
  },
  startingDevice: function (params) {
    return instance.post(CONFIG.url + 'api/machine/launch', jsonToStr(params))
  },
  InfiniteGame:function (params) {
    return instance.post(CONFIG.url + 'api/machine/unlimited', jsonToStr(params))
  },
  getOperations:function (params) {
    return instance.get(CONFIG.url +'api/operation/v2', {
      params: params
    })
  },
  consumer:function (params) {
    return instance.post(CONFIG.url +'api/player/coupon/receive', jsonToStr(params))
  },
  useCoupons:function (params) {
    return instance.get(CONFIG.url + 'api/machine/info', {
      params: params
    })
  },
  redReceive:function (params) {
    return instance.post(CONFIG.url + 'api/player/red/coupon/receive',jsonToStr(params));
  },
  getVersion:function (params) {
    return new Promise((success,error)=>{
      instance.get(CONFIG.url+'api/site/version', {
        params: params
      }).then((data)=>{
        success(data)
      }).catch((err)=>{
        error(err)
      })
    })
  },
  getActivityPromocode:function (params) {
    return instance.get(CONFIG.url+'api/activity/promocode', {
      params: params
    })
  },
  //用户扫码记录
  machineLogin:function (params) {
    return instance.get(CONFIG.url + 'api/machine/login',{
      params: params
    });
  },
  //提交页面各个阶段的统计时间
  timeOthers:function (params) {
    return instance.post(CONFIG.url + 'api/time/others',jsonToStr(params));
  },
  //获取奖励金
  getActivityBounty:function (params) {
    return instance.get(CONFIG.url+'api/activity/bounty', {
      params: params
    })
  },
  //领取券
  getActivityReceive:function (params) {
    return instance.get(CONFIG.url+'api/activity/receive', {
      params: params
    })
  },
}
