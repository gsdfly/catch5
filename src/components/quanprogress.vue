<template>
  <div class="quanprogress" :class="{'quan-version2':version2}">
    <p class="p1" @click="openActivityRule">活动规则</p>
    <p class="p2" @click="goExchange">我的红包:{{activity_bounty.list.length}}<span></span></p>
    <div>
      <img @click.prevent="" :src="img1" alt="">
      <div class="progress-out">
        <div class="progress-in" :style="styleLong"></div>
      </div>
      <img v-if="activity_bounty.voucher.value <= activity_bounty.bounty && activity_bounty.voucher.value !== 0" class="ling" @click="goReceive" src="./../assets/catch3/ling.png" alt="">
      <div class="right" v-else="">还差<span>{{(activity_bounty.voucher.value - activity_bounty.bounty).toFixed(2)}}</span>元</div>
    </div>
  </div>
</template>

<script>
  import api from './../api/index'
  import CONFIG from './../config/index'
  import {mapState} from 'vuex'

  export default {
    name: 'quanprogress',
    data() {
      return {
        styleLong: '',
        isFirst: true,
//        img1:require('./../assets/catch2/ticket_short.png'),
//        img2:require('./../assets/catch2/ticket_long.png'),
        img1:require('./../assets/catch3/ticket_bg_short.png'),
        img2:require('./../assets/catch3/ticket_bg.png'),
        needle:0
    }
    },
    props: ['cinemaInfo'],
    computed: {
      ...mapState({
        activity_promocode: state => state.user.activity_promocode,
        activity_bounty: state => state.user.activity_bounty,
        isLogin:state => state.user.isLogin
      })
    },
    mounted() {
      if (this.version2) {
        this.img1 = this.img2;
      }
        this.mountedStart();
      //第一次进来发送一个请求获取用户充值情况
//      this.$store.dispatch('getActivityPromocode').then((res) => {
//        var bili = res.progress / res.amount - Math.floor(res.progress/res.amount);
////        this.needle = Math.round((1-bili)*res.amount*100)/100;
//        this.needle = Math.round((res.amount - (res.progress*100)%(res.amount*100)/100)*100)/100;
//        this.styleLong = 'width:' + bili * 100 + '%';
//        this.$emit('getVoucherLength',res.records.length)
////        this.styleLong = 'width:'+res.current*100+'%';
//      })
    },
    methods: {
      mountedStart(){
        this.$store.dispatch('getActivityBounty').then((res)=>{
          if(res.bounty<res.voucher.value){
            var bili = res.bounty/res.voucher.value;
            this.styleLong = 'width:' + bili * 100 + '%';
          }else {
            this.styleLong = 'width:100%';
          }
        })
      },
      goExchange() {
        if (this.activity_bounty.list && this.activity_bounty.list.length === 0) {
          this.$emit('openTip', 'notExchange');
        } else {
//          this.$emit('openTip', 'exchange');
          this.$emit('openTip', 'couponList');
        }
      },
      openActivityRule() {
        this.$emit('openTip', 'activityRule');
      },
      goReceive(){
        this.$emit('openTip','receive');
      }
    },
    watch: {
//      activity_promocode(newActivity, oldActivity) {
//        if (this.isFirst) {
//          this.isFirst = false;
//          return;
//        }
//        //如果充值成功之后获取到用户的进度没有改变，再过3秒重新请求
//        if(newActivity.progress === oldActivity.progress){
//          console.log('数据未改变发送请求')
//          setTimeout(()=>{
//            this.$store.dispatch('getActivityPromocode');
//          },3000);
//          return;
//        }
////        this.styleLong = 'width:'+newActivity.current*100+'%';
//        if(newActivity.progress>0 && (((newActivity.progress / newActivity.amount)+"").indexOf('.') === -1)){
//          this.styleLong = 'width:100%';
//          this.needle = 0;
//        }else {
//          var bili2 = newActivity.progress / newActivity.amount - Math.floor(newActivity.progress/newActivity.amount);
//          this.styleLong = 'width:' + bili2*100 + '%';
////          this.needle = Math.round((1-bili2)*newActivity.amount*100)/100;
//          this.needle = Math.round((newActivity.amount - (newActivity.progress*100)%(newActivity.amount*100)/100)*100)/100;
//        }
//        if (newActivity.records.length > oldActivity.records.length) {
//          console.log('弹出提示');
//          this.$emit('getVoucherLength',newActivity.records.length)
//          setTimeout(()=>{
//            this.$emit('openTip', 'exchange2');
//            if(newActivity.progress>0 && (((newActivity.progress / newActivity.amount)+"").indexOf('.') === -1)){
//            this.styleLong = 'width:0';
//            this.needle = newActivity.amount;
//            }
//          },500);
//        }
//      }
      activity_bounty(newActivity,oldActivity){
        if (this.isFirst) {
          this.isFirst = false;
          return;
        }
        //如果充值成功之后获取到用户的进度没有改变，再过3秒重新请求
        if(newActivity.bounty === oldActivity.bounty){
          console.log('数据未改变发送请求')
          setTimeout(()=>{
            this.$store.dispatch('getActivityBounty');
          },3000);
          return;
        }
        if(newActivity.bounty<newActivity.voucher.value){
          var bili = newActivity.bounty/newActivity.voucher.value;
          this.styleLong = 'width:' + bili * 100 + '%';
        }else {
          this.styleLong = 'width:100%';
        }
        if(newActivity.voucher.value <= newActivity.bounty ){
          this.goReceive();
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .quanprogress {
    width: 506px;
    /*height: 100%;*/
    position: absolute;
    /*padding: 0 22px;*/
    /*float: right;*/
    right: 20px;
    /*margin: 0 22px 0 0;*/
    bottom: 0;
    >div{
      position: relative;
      img{
        width: 100%;
        display: block;
      }
      .right{
        padding: 0 10px;
        height: 56px;
        /*background: url("./../assets/jiewu/haicbg.png") no-repeat;*/
        /*background-size: 100% 100%;*/
        background: #354dc8;
        border-radius: 4px;
        border:3px solid #63bdfc;
        position: absolute;
        right: 10px;
        bottom: 8px;
        font-size: 20px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        /*text-shadow: 0 0 5px #f8449f;*/
        font-weight: 600;
        span{
          font-size: 28px;
        }
      }
    }
    .p1{
      position: absolute;
      /*width: 98px;*/
      text-align: center;
      height: 26px;
      line-height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      background: rgba(8,8,85,0.3);
      /*background: red;*/
      /*opacity: 0;*/
      padding: 0 10px;
      color: #fff;
      left: 8px;
      top:8px;
      /*top:78px;*/
      /*left: calc(100% - 8px);*/
      /*right: 8px;*/
      border-radius: 13px;
      z-index: 555;
    }
    .p2{
      height:32px;
      position: absolute;
      right: 8px;
      top:4px;
      z-index: 2;
      color: #4475dc;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 22px;
      line-height: 32px;
      background: #25edff;
      border-radius: 16px;
      padding: 0 10px;
     span{
       width: 23px;
       height: 16px;
       float: right;
       background: url("./../assets/catch2/icon_go_quan.png") no-repeat;
       background-size: 100% 100%;
       margin: 0 0 0 3px;
     }
    }
  }


  .ling{
    width: 110px !important;
    height: 128px;
    position: absolute;
    right: -13px;
    bottom:-27px;
  }
  .progress-out {
    width: 457px;
    height: 34px;
    /*background: #491b8f;*/
    background:url("./../assets/catch2/progress_bg.png") no-repeat;
    /*background: #4a148c;*/
    background-size: 100% 100%;
    /*border: 3px solid #fd643b;*/
    border-radius: 17px;
    overflow: hidden;
    position: absolute;
    left: 10px;
    bottom:18px;
    padding:0;
  }

  .progress-in {
    width: 0;
    height: 100%;
    background: #ffea3b;
    /*position: absolute;*/
    /*border: 3px solid #fd643b;*/
    /*border-radius: 17px;*/
    border-radius: 0 17px 17px 0;
    /*background: linear-gradient(to right,#ffea3b,#f44436);*/
    border-right: 3px solid #63bdfc;
    background: url("./../assets/catch2/progress.png") no-repeat;
    transition: all 0.5s;
    background-size: auto 100%;
  }

  .tip1{
    position: absolute;
    font-size: 30px;
    color: #fff;
    top:34px;
    left: 154px;
    line-height: 38px;
  }

  .quan-version2{
    width: 492px;
    .p1{
      font-size: 20px;
      line-height: 20px;
      /*left: 8px;*/
      /*top:8px;*/
      height: 28px;
      border-radius: 14px;
      background: rgba(8,8,85,0.2);
    }
    .p2{
      top:8px;
    }
    .tip1 {
      top:44px;
      font-size: 34px;
    }
      >div{
      .right{
        font-size: 22px;
        bottom: 12px;
        span{
          font-size: 32px;
        }
      }
    }
    .progress-out {
      bottom:22px;
    }
    }

</style>
