<template>
  <div class="recharge-lists clearfix" :class="{'version2':version2,'distance':gzh_operation.coupon.status ===2}">
    <div  v-for="v in coin.slice(0,4)" :data-id="v.coin_price_id"
         @click="handlePayBefore(v)" :class="{'active':v.status==0,'infinity':v.type==1}">
      <div class="recharge-item-t"><span :class="{'twoCoin':v.coin_num==2}"></span><i v-if="v.type==1">无限币</i><i v-else>{{v.coin_num}}币</i>
      </div>
      <div class="recharge-item-b">{{v.coin_price}}元<span
        v-if="v.sale_state == 1 && v.original_price">({{v.original_price}}元)</span></div>
      <div class="recharge-hot hot-limit" v-if="v.coin_buy_state==1 && v.status != 0">限购<br/>{{v.coin_buy_num}}</div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import CONFIG from '../config'
  import {SetCookie, getErrMsg, changeTipOperation, payment} from '../util'

  export default {
    data() {
      return {
        isActive: false,
        isRequest: false,
      }
    },
    computed: mapState({
      user: state => state.user.user,
      coin: state => state.user.coin,
      machine_no: state => state.user.machine_no,
      info: state => state.user.info,
      hide_coupons: state => state.user.hide_coupons,
      isLogin:state => state.user.isLogin,
      chunjie_operation: state => state.user.chunjie_operation,
      gzh_operation: state => state.user.gzh_operation,
    }),
    mounted() {
      if(this.isLogin){
        this.$store.dispatch('getCoinList');
      }
    },
    methods: {
      handlePayBefore(pay) {
        if (pay.status === 0) {
          return false;
        }
        var hideArr = JSON.parse(localStorage.getItem('hide_coupons')) || [];
        var date = new Date();
        var time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
        if (hideArr.length > 0 && hideArr.indexOf(JSON.stringify({time: time, id: pay.coin_price_id})) !== -1) {
          this.handlePay(pay.coin_price_id, pay.coin_num, pay.status, pay.coin_price, pay.type);
        } else {
          if (hideArr.length > 0) {
            for (var j = 0; j < hideArr.length; j++) {
              if (JSON.parse(hideArr[j]).id === pay.coin_price_id) {
                hideArr.splice(j, 1);
                break;
              }
            }
          }
          hideArr.push(JSON.stringify({time: time, id: pay.coin_price_id}));
          localStorage.setItem('hide_coupons', JSON.stringify(hideArr));
          //在这里得到充值项的优惠券
          var currentCouponPay;
          var len = this.hide_coupons.length;
          for (var i = 0; i < len; i++) {
            if (this.hide_coupons[i].after_coin_price_id) {
              if (this.hide_coupons[i].after_coin_price_id.indexOf(pay.coin_price_id) !== -1) {
                currentCouponPay = this.hide_coupons[i].coin_price;
                break;
              }
            }
          }
          if (currentCouponPay) {
            if (pay.coin_price === "2.00") {
              _hmt.push(['_trackEvent', '弹出2元下面优惠券', '点击', '', '']);
            } else if (pay.coin_price === "9.80") {
              _hmt.push(['_trackEvent', '弹出9.8元下面优惠券', '点击', '', '']);
            }
            this.$emit('changeBgShow', {
              bgShow: true,
              contentShow: 'hideCoupon',
              pay: pay,
              currentCouponPay: currentCouponPay
            });
          } else {
            this.handlePay(pay.coin_price_id, pay.coin_num, pay.status, pay.coin_price, pay.type);
          }
        }
      },
      handlePay(id, coin, status, price, type) {
        if (!this.isRequest) {
          this.isRequest = true;
          if (this.info.online === 0) {
            this.$store.commit('changeTipContent', getErrMsg(1001));
            this.isRequest = false;
            return
          }
          let self = this;
          //status为0不可购买
          if (status === 0) {
            return false;
          }
          if (price == '0.00') {
            //免费请求
            this.$store.dispatch('getFreeCoin', {coin_price_id: id}).then((data) => {
              if (data.status_code == 200) {
                this.$store.dispatch('getCoinList').then(() => {
                  this.isRequest = false;
                  this.$store.dispatch('getUser');
                }).catch(()=>{
                  this.isRequest = false;
                });
              }else {
                this.isRequest = false;
              }
            }).catch(() => {
              this.isRequest = false;
            });
          } else {
            _hmt.push(['_trackEvent', '点击充值', '点击', '充值金额为'+price+'元', '']);
            var chunjieRed = localStorage.getItem('chunjieRed');
            var time = new Date().getDate();
            if(id === this.coin[this.coin.length-1].coin_price_id && this.chunjie_operation.task_count < this.chunjie_operation.num && chunjieRed == time){
              this.isRequest = false;
              this.$emit('openTip','reduce');
              return;
            }
            payment(CONFIG, {coin_price_id: id}, self, function () {
              if(id === self.chunjie_operation.coin_price.coin_price_id){
                self.$store.dispatch('getActivityBountyExchange',{'operation_id':self.chunjie_operation.id}).then(()=>{
                  self.$store.dispatch('getOperations');
                })
              }
              self.$emit('startGame',coin);
              _hmt.push(['_trackEvent', '成功充值', '点击', '充值金额为'+price+'元', '']);
              self.isRequest = false;
              if (type !== 1) {
                self.$store.commit('setCoins', coin)
                self.$emit('closeBg');
              }
              setTimeout(()=>{
                self.$store.dispatch('getCoinList');
              },1000)
            })
          }
        }
      }
    },
    watch:{
      isLogin(){
        this.$store.dispatch('getCoinList');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../themes/chunjie";
  .recharge-lists {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 20px 0 20px;
  }
  .distance{
    padding: 5px 20px 0 20px;
  }

  .recharge-lists > div {
    margin: 0 0 22px 0;
    font-size: 36px;
    float: right;
    width: 342px;
    height: 128px;
    /*height: 37.87%;*/
    border: $wxpayItemBorder;
    background: $wxpayItemImg;
    background-size: 100% 100%;
    position: relative;
    border-radius: 16px;
  }


  .recharge-lists > div:last-of-type,  .recharge-lists > div:nth-last-of-type(2)
  {
    margin: 0;
  }


  .recharge-lists .active {
    color: #666;
    border: 1px solid #999;
  }

  .recharge-lists .active .recharge-item-t {
    color: #666;
  }

  .recharge-lists .active .recharge-item-t span {
    background: url("./../assets/small/icon_recharge_2bi.png") no-repeat;
    background-size: 100% 100%;
  }

  .recharge-lists .infinity .recharge-item-t span {
    background: url("./../assets/small/icon_charge_nbi.png") no-repeat;
    background-size: 100% 100%;
  }

  .recharge-lists .active .recharge-item-b {
    color: #fff;
    background: #999;
  }

  .recharge-lists .active .recharge-item-b span {
    color: #fff;
  }

  .recharge-lists > div:nth-child(odd) {
    float: left;
  }

  .recharge-item-b {
    height: 59px;
    line-height: 59px;
    font-size: 34px;
    background: $wxpayItemBottomBg;
    color: $wxpayItemBottomColor;
    border-radius: 0 0 12px 12px;
    text-align: center;
  }

  .recharge-item-b span {
    font-size: 22px;
    text-decoration: line-through;
  }

  .recharge-item-t {
    height: 67px;
    line-height: 67px;
    font-size: 36px;
    color: $wxpayItemTopColor;
    text-align: center;
    background: $wxpayItemTopBg;
    border-radius: 16px 16px 0 0;
  }

  .recharge-item-t span {
    width: 39px;
    height: 42px;
    display: inline-block;
    background: url("./../assets/small/icon_recharge_bi.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 10px 0 0;
    vertical-align: middle;
  }

  .recharge-item-t i {
    display: inline-block;
    vertical-align: middle;
  }

  .recharge-item-t span.twoCoin {
    width: 32px;
    height: 38px;
    background: url("./../assets/small/icon_recharge_2bi.png") no-repeat;
    background-size: 100% 100%;
  }

  .recharge-hot {
    width: 114px;
    height: 46px;
    position: absolute;
    left: -16px;
    top: -10px;
    color: #fff;
    background: url("./../assets/small/recharge_tab2.png") no-repeat;
    background-size: 100% 100%;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .recharge-has {
    width: 114px;
    height: 46px;
    position: absolute;
    left: -12px;
    top: -10px;
    color: #fff;
    background: url("./../assets/small/recharge_tab_use.png") no-repeat;
    background-size: 100% 100%;
    font-size: 24px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hot-top {
    z-index: 2;
  }

  .version2{
    &.distance{
      padding: 10px 20px 0 20px;
    }
  }
  .version2>div{
    height: 164px;
  }
  .version2 .recharge-item-t {
    height: 83px;
    font-size: 38px;
    line-height: 83px;
  }

  .version2 .recharge-item-b {
    height: 79px;
    line-height: 79px;
    font-size: 34px;
  }

  .version2 .recharge-item-t span {
    width: 44px;
    height: 48px;
  }

  .version2 .recharge-item-t span.twoCoin {
    width: 35px;
    height: 42px;
  }

  .version2 .recharge-item-t span.infinite {
    width: 56px;
    height: 58px;
  }

</style>
