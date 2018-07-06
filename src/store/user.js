import CONFIG from '../config'
import api from './../api/index'
import {changeTipOperation} from "../util/index";

const state = {
  user: {
    avatar: '',
    coins: 0,
    nick_name: '',
    open_id: '',
    player_id: '',
    coin_infinite:false
  },
  coin: [],
  consume: {
    data: [],
    meta: {
      pagination: {}
    }
  },
  info: {
    coin_num: 0,
    online:0
  },
  machine_no: '',
  operations:[],
  hide_coupons:[], //隐藏优惠券
  tipContent:{
    imgSrc:"",
    content:[],
    button:'',
    isShow:false
  },
  show_tip_operation:{isShow:false,tipObj:{image:''}},
  tip_operation:{},
  activity_promocode:{
    progress:0,
    records:[],
    needle:0
  },
  // activity_bounty:{
  //   bounty:0,
  //   voucher:{
  //     value:0
  //   },
  //   list:[]
  // },
  activity_bounty:{
    voucher_batch:{
      value:0
    },
    vouchers:[]
  },

  task_game:{
    num:0, //任务可以完成多少次
    value:1,//任务值
    task_count:0,//任务已经完成的次数
    coupon:{},//任务绑定的优惠券
    coin_price:{}//优惠券绑定的充值项
  },
  task_wawa:{
    num:1, //任务可以完成多少次
    value:1,//任务值
    task_count:0,//任务已经完成的次数
    coupon:{},//任务绑定的优惠券
    coin_price:{}//优惠券绑定的充值项
  },
  task_now:{
    recharge_bounty:-1,//充值的奖励金
    game_bounty:-1,//用户当前任务的进度
    prize_bounty:-1//掉落的娃娃数
  },
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setCoins(state, coin) {
    state.user.coins = state.user.coins + coin
  },
  setCoinList(state, coin) {
    state.coin = coin
  },
  setConsume(state, consume) {
    state.consume = consume
  },
  setMachineNo(state) {
    if (CONFIG.machine_no) {
      state.machine_no = CONFIG.machine_no
    }
  },
  setInfo(state, info) {
    state.info = info
  },
  setInfinite(state,flag){
    state.user.coin_infinite = flag;
  },
  setOperations(state,operations){
    state.operations = operations
  },
  setHideCoupons(state,hideCoupons){
    state.hide_coupons = hideCoupons;
  },
  changeTipContent(state,tipContent){
    state.tipContent = tipContent
  },
  setTipOperation(state,tip_operation){
    state.tip_operation = tip_operation;
  },
  changeShowTipOperation(state,obj){
    state.show_tip_operation = obj;
  },
  setActivityPromocode(state,obj){
    state.activity_promocode = obj
  },
  setActivityBounty(state,obj){
    state.activity_bounty = obj
  },
  setActivityBountyValue(state,value){
    state.activity_bounty.bounty = value
  },
  setTaskGame(state,obj){
    state.task_game = obj;
  },
  setTaskNow(state,obj){
    state.task_now = obj;
  },
  setTaskWawa(state,obj){
    state.task_wawa = obj;
  }
}

const actions = {
  getUser({commit}) {
    return new Promise((success, error) => {
      api.getUser({token:CONFIG.token}).then((data) => {
        commit('setUser', data.data)
        success(data)
      })
    })
  },
  getCoinList({commit}) {
    return new Promise((success, error) => {
      api.getCoinList({
        machine_no: state.machine_no,
        token:CONFIG.token
      }).then((data) => {
        commit('setCoinList', data.data);
        success();
      })})
  },
  getConsume({commit}, page) {
    return new Promise((success, error) => {
      api.getConsume({
        page_index: page.page_index,
        page_size: page.page_size,
        token:CONFIG.token
      }).then((data) => {
        commit('setConsume', data)
        const p = data
        success(p)
      })
    })
  },
  getPayJssdk(ctx,ids) {
    return new Promise((success, error) => {
      if(ids.coupon_id){
        api.getPayJssdk({
          coin_price_id: ids.coin_price_id,
          coupon_id:ids.coupon_id,
          machine_no: ctx.state.machine_no,
          token:CONFIG.token
        }).then((data) => {
          success(data)
        }).catch(()=>{
          error()
        })
      }else {
        api.getPayJssdk({
          coin_price_id: ids.coin_price_id,
          machine_no: ctx.state.machine_no,
          token:CONFIG.token
        }).then((data) => {
          success(data)
        }).catch(()=>{
          error()
        })
      }

    })
  },
  getPayAlipay(ctx,ids){
    return new Promise((success,error)=> {
      if(ids.coupon_id){
        api.getPayAlipay({
          coin_price_id: ids.coin_price_id,
          coupon_id:ids.coupon_id,
          machine_no: ctx.state.machine_no,
          token: CONFIG.token
        }).then((data) => {
          success(data)
        }).catch(()=>{
          error()
        })
      }else {
        api.getPayAlipay({
          coin_price_id: ids.coin_price_id,
          machine_no: ctx.state.machine_no,
          token: CONFIG.token
        }).then((data) => {
          success(data)
        }).catch(()=>{
          error()
        })
      }
    })
  },
  getPayTpp(ctx, id) {
    return new Promise((success, error) => {
      api.getPayTpp({
        coin_price_id: id,
        machine_no: ctx.state.machine_no,
        token:CONFIG.token
      }).then((data) => {
        success(data)
      })
    })
  },
  judgeMachine(ctx) {
    return new Promise((success, error) => {
      api.judgeMachine({
        machine_no: ctx.state.machine_no,
        token:CONFIG.token
      }).then((data) => {
        ctx.commit('setInfo', data.data)
        success(data.data)
      })
    })
  },
  getFreeCoin(ctx, ids) {
    return new Promise((success, error) => {
      if(ids.coupon_id){
        api.getFreeCoin({
            coin_price_id:ids.coin_price_id,
            machine_no:ctx.state.machine_no,
            coupon_id:ids.coupon_id,
            token:CONFIG.token
          }
        ).then((data) => {
          success(data)
        }).catch((err)=>{
          error(err);
        })
      }else {
        api.getFreeCoin({
            coin_price_id:ids.coin_price_id,
            machine_no:ctx.state.machine_no,
            token:CONFIG.token
          }
        ).then((data) => {
          success(data)
        }).catch((err)=>{
          error(err);
        })
      }
    })
  },
  startingDevice(ctx, num) {
    return new Promise((success, error) => {
      api.startingDevice({
        coin_num: num,
        machine_no: CONFIG.machine_no,
        token:CONFIG.token
      }).then((data) => {
        if (data.status_code == 200) {
          var s = ctx.state.user
          s.coins = data.data.coin_total
          // s.game_ticket = data.data.game_ticket
          // if(s.coins === 0 && s.game_ticket === 0 && ctx.state.tip_operation.workout){
          if(s.coins === 0 && ctx.state.tip_operation.workout){
            changeTipOperation(ctx.state.tip_operation.workout,'alreadyTipWorkout',ctx);
          }
          ctx.commit('setUser', s)
          success()
        } else {
          error()
        }
      }).catch((err)=>{
        error(err);
      })
    })
  },
  InfiniteGame(ctx){
    return new Promise((success,error)=>{
      api.InfiniteGame({machine_no:ctx.state.machine_no,token:CONFIG.token}).then((data)=>{
        if (data.status_code == 200) {
          ctx.commit('setInfinite',0);
          success();
        }else {
          ctx.commit('setInfinite',1);
          error(err);
        }
      }).catch((err)=>{
        ctx.commit('setInfinite',1);
        error(err);
      })
    })
  },
  //获取优惠券列表
  getOperations:function (ctx) {
    return new Promise((success,err)=>{
      api.getOperations({machine_no:ctx.state.machine_no,token:CONFIG.token}).then((data)=>{
        //对运营位进行过滤
        var res = data.data;
        var operationsList = [];
        var hideCoupons = [];
        for(var i=0;i<res.length;i++){
          if(res[i].type ===1 || res[i].type === 7){
            if(res[i].coupon){
              if(res[i].coupon.type == 2 ){
                operationsList.push(res[i]);
              }else if(res[i].coupon.type == 1 && ((res[i].coin_price.coin_price - res[i].coupon.reduce) >0) ){
                operationsList.push(res[i]);
              }else if(res[i].coupon.type == 0 && ((res[i].coin_price.coin_price*res[i].coupon.reduce/100) >0)){
                operationsList.push(res[i]);
              }
            }
          }else if(res[i].type ===4 ){
            if(res[i].coupon.status === 2){
              res[i].timeType = 'used';
            } else if(res[i].coupon.status ===0){
              res[i].timeType = 'unreceived'
            }else if(res[i].coupon.status === 1){
              if(res[i].coupon.id === -1){
                res[i].timeType = 'notPrize';
              }else {
                res[i].timeType = 'received';
              }
            }
            operationsList.push(res[i]);
          }else if(res[i].type ===5 ){
            hideCoupons.push(res[i]);
          }else if(res[i].type === 2){
            operationsList.push(res[i]);
          }else if(res[i].type === 6){
            var endTime = res[i].end_time.replace(/-/g,',');
            endTime = new Date(endTime).getTime();
            var nowTime = new Date().getTime();
            if(endTime >= nowTime){
              ctx.commit('setTipOperation',res[i]);
            }
          }else if(res[i].type === 8){
            ctx.commit('setActivityBounty',res[i]);
          }else if(res[i].type === 9){
            //type为9时为游戏次数运营位
            ctx.commit('setTaskGame',res[i]);
          }else if(res[i].type === 10){
            //type为10时为掉落任务运营位
            ctx.commit('setTaskWawa',res[i]);
          }
        }
        ctx.commit('setHideCoupons',hideCoupons);
        ctx.commit('setOperations',operationsList)
        success(operationsList)
      }).catch(()=>{

      })
    })
  },
  //获取奖励金（新版带任务）
  getActivityBountyInfo(ctx){
    return new Promise((success,error)=>{
      api.getActivityBountyInfo({token:CONFIG.token}).then((data)=>{
        ctx.commit('setTaskNow',data.data);
        success(data.data);
      }).catch((err)=>{
        error(err)
      })
    })
  },
  //领取优惠券
  consumer:function (ctx,ids) {
    return new Promise((success,error) => {
      api.consumer({coupon_ids:[ids.coupon_id],token:CONFIG.token}).then((data)=>{
        if (data.status_code == 200) {
          success(data)
        }else {
          error(data)
        }
      }).catch((err)=>{
        error(err)
      })
    })
  },
  //使用优惠券
  useCoupons:function (ctx,id) {
    return new Promise(() => {
      api.useCoupons({id:id,token:CONFIG.token}).then((data) => {
      })
    })
  },
  //抢红包
  redReceive:function (ctx,record_id) {
    return new Promise(() => {
      api.redReceive({record_id:record_id,token:CONFIG.token}).then((data) => {
      })
    })
  },

  getActivityPromocode:function (ctx) {
    return new Promise((success,error)=>{
      api.getActivityPromocode({machine_no:ctx.state.machine_no,token:CONFIG.token,site_version_id:CONFIG.site_version_id}).then((data)=>{
        ctx.commit('setActivityPromocode',data.data);
        success(data.data)
      })
    })
  },
  //已经被舍弃
  // getActivityBounty:function (ctx) {
  //   return new Promise((success,error)=>{
  //     api.getActivityBounty({machine_no:ctx.state.machine_no,token:CONFIG.token,site_version_id:CONFIG.site_version_id}).then((data)=>{
  //       ctx.commit('setActivityBounty',data.data);
  //       success(data.data)
  //     })
  //   })
  // },

  //已经被舍弃
  // getActivityReceive:function (ctx,batch_id) {
  //   return new Promise((success,error)=>{
  //     api.getActivityReceive({machine_no:ctx.state.machine_no,token:CONFIG.token,site_version_id:CONFIG.site_version_id,batch_id:batch_id}).then((data)=>{
  //       success(data.data)
  //     })
  //   })
  // },

  //奖励金兑换
  getActivityBountyExchange:function (ctx,operation_id) {
    return new Promise((success,error)=>{
      api.getActivityBountyExchange({token:CONFIG.token,operation_id:operation_id}).then((data)=>{
        success(data);
      }).catch((err)=>{
        error(err);
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
