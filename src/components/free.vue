<template>
  <div class="free" :class="{'free-version2':version2}">
    <div v-if="gzh_operation.id">
      <img v-if="gzh_operation.coupon.status !== 2" class="freeImg" :src="img1" alt=""/>
      <img v-else="" class="freeImg" :src="img3" alt=""/>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import api from './../api/index'
  import CONFIG from '../config'

  export default {
    name:'free',
    data(){
      return {
        img1:require('./../assets/chunjie/activity_free.png'),
        img2:require('./../assets/chunjie/long_activity_free.png'),
        img3:require('./../assets/chunjie/activity_free_ed.png'),
        img4:require('./../assets/chunjie/long_activity_free_ed.png')
      }
    },
    mounted(){
      if(this.version2){
        this.img1 = this.img2;
        this.img3 = this.img4;
      }
      if(this.isLogin){
        this.mountedStart();
      }
    },
    computed: mapState({
      gzh_operation: state => state.user.gzh_operation,
      isLogin: state => state.user.isLogin,
    }),
    methods:{
      mountedStart(){
        this.$store.dispatch('getOperations').then((res)=>{
          //获取是否是从别人公众号过来的gzh_code
          var gzh_code = localStorage.getItem('gzh_code');
          if(gzh_code){
            //这里需要找到对应的公众号运营位，来领取免费币
            for (let item of res){
              if(item.type === 12 && item.code === gzh_code){
                //这里请求
                this.$store.dispatch('getActivityBountyExchange',{operation_id:item.id}).then((res)=>{
                  this.$store.dispatch('getFreeCoin',{coin_price_id: item.coin_price.coin_price_id, coupon_id: item.coupon.id}).then((res)=>{
                    //领取成功调用动画
                    this.$emit('handleGzh')
                    setTimeout(()=>{
                      this.$store.commit('setCoins', res.data.coin_num);
                      this.$store.dispatch('getUser');
                      this.$store.dispatch('getOperations');
                    },1500)
                  })
                })
              }
            }
            localStorage.removeItem('gzh_code')
          }

          var coupon_time = Date.now() - (localStorage.getItem('startTime2') ? localStorage.getItem('startTime2') : performance.timing.navigationStart);
          localStorage.removeItem('startTime2');
          if(localStorage.getItem('userTime') && localStorage.getItem('domTime')){
            this.sendTimeOthers(coupon_time);
          }else {
            var inter = setInterval(()=>{
              if(localStorage.getItem('userTime') && localStorage.getItem('domTime')){
                this.sendTimeOthers(coupon_time);
                clearInterval(inter);
              }
            },500)
          }
        })
      },
      sendTimeOthers(coupon_time){
        api.timeOthers({
          token:CONFIG.token,
          log_id:localStorage.getItem('log_id'),
          auth_time:localStorage.getItem('warrantTime') ? localStorage.getItem('warrantTime') : 0,
          dom_time:localStorage.getItem('domTime'),
          coupon_time:coupon_time,
          use_time:localStorage.getItem('userTime')
        });
        localStorage.removeItem('warrantTime');
        localStorage.removeItem('userTime');
        localStorage.removeItem('domTime');
      },
    },
    watch:{
      isLogin(){
        this.mountedStart();
      }
    }

  }
</script>

<style lang="scss" scoped>
  .free{
    width: 100%;
    height: 100%;
    position: relative;
    >div{
      width: 100%;
      height: 100%;
      .freeImg{
        width: 706px;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }

  }
  .free-version{
    >div{
      .freeImg{
        width: 714px;
      }
    }
  }

</style>
