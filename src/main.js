import Vue from 'vue'
import App from './App'
import router from './router'
import CONFIG from './config'
import FastClick from 'fastclick'
import wxFc from './config/wx'
import store from './store'
import callbackUrl from './callbackUrl'
import 'mint-ui/lib/style.css'
import Indicator from 'mint-ui/lib/indicator'
import api from './api'
import {GetCookie, getParamByName, SetCookie} from "./util/index";

// require('./util/vconsole')

FastClick.attach(document.body)

!async function () {

  try {
    if(CONFIG.site_version_id === 0){
      var result = await api.getVersion({machine_no:CONFIG.machine_no});
      CONFIG.site_version_id = result.data.id;
    }
  }catch (err){}

  var sc = document.createElement('script')

  if (process.env.NODE_ENV !== 'development') {
    //回调授权
    // await callbackUrl()
    //先判断是否有token在判断是否有player_id在判断是否有auto_id若都没有则授权，获取到auto_id，通过auto_id获取到token。
    if(!CONFIG.token){
      var encrypt = localStorage.getItem('encrypt');
      if(encrypt){
        api.getToken2({encrypt:encrypt}).then((res)=>{
          console.log('getToken2-----------------------------'+res);
          SetCookie('token_', res.data.token);
          store.commit('changeIsLogin');
          delete res.data.token;
          store.commit('setUser',res.data);
          api.machineLogin({machine_no:CONFIG.machine_no,token:CONFIG.token});
        })
      }else {
        var auth_type = getParamByName('auth_type') || localStorage.getItem('auth_type');
        if(auth_type){
          var auth_id = getParamByName('auth_id') || localStorage.getItem('auth_id');
          var index = window.location.href.indexOf('&');
          if(getParamByName('auth_type')){
            localStorage.setItem('auth_type',auth_type);
            localStorage.setItem('auth_id',auth_id);
            var newUrl = window.location.href.slice(0,index);
            window.history.pushState({},'',newUrl);
          }
          api.getToken({auth_type:auth_type,auth_id:auth_id.split('').reverse().join('')}).then((res)=>{
            //这里可以得到用户信息将用户信息存储到vuex里面，将用户id存储到本地存储中
            localStorage.setItem('encrypt',res.data.encrypt);
            SetCookie('token_', res.data.token);
            store.commit('changeIsLogin');
            delete res.data.token;
            delete res.data.encrypt;
            store.commit('setUser',res.data);
            if(index === -1){
              api.machineLogin({machine_no:CONFIG.machine_no,token:CONFIG.token});
            }
          });
        }else {
          if (CONFIG.isAlipay) {
            window.location.href = CONFIG.url+'v2/alipay/oauth?callback='+document.URL;
          }
          else {
            window.location.href = CONFIG.url+'v2/wechat/oauth_scope?callback='+document.URL
          }
          return;
        }
      }
    }else {
      api.machineLogin({machine_no:CONFIG.machine_no,token:CONFIG.token});
      store.commit('changeIsLogin');
      store.dispatch('getUser');
    }

    //配置初始化
    if (CONFIG.isWx) {
      sc.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
      document.getElementsByTagName('body')[0].appendChild(sc)
      sc.onload = function () {
        wxFc()
      }
    } else {
      sc.src = 'https://a.alipayobjects.com/g/h5-lib/alipayjsapi/3.0.5/alipayjsapi.inc.min.js'
      document.getElementsByTagName('body')[0].appendChild(sc)
    }
  }else {
    store.commit('changeIsLogin');
    store.dispatch('getUser');
  }

  store.commit('setMachineNo');

  Vue.prototype.version2 = false;
  var clientWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
  var clientHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
  if (clientWidth / clientHeight <= 0.6) {
    Vue.prototype.version2 = true;
  }

  Vue.prototype.Indicator = Indicator

  Vue.filter('handleNum', function (value) {
    var index = value.indexOf('.');
    if(index !== -1){
      var after = value.substr(index+1);
      if(Number(after)%100 === 0 ){
        return value.substr(0,index);
      }else if(Number(after)%10 === 0){
        return value.substr(0,index+2);
      }else {
        return value;
      }
    }
  })

  //统计扫码用户
  // api.machineLogin({machine_no:CONFIG.machine_no,token:CONFIG.token});

  Vue.prototype.Indicator = Indicator

  new Vue({
    store,
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
  })
}()
