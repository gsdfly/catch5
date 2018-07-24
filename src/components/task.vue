<template>
  <div class="task" :class="{'task-version2':version2}">
    <!--<img class="task-bg" :src="img1_1" alt="" @click.prevent=""/>-->
    <!--<img class="free-bg" :src="img2_2" alt="">-->
    <ul>
      <li @click="consumer" v-if="gzh_operation.id">
          <!--<div>-->
            <!--<img class="liImg1" src="./../assets/task/a.png" alt=""/>-->
          <img :class="{'is_down':gzh_operation.coupon.status === 2}" src="./../assets/task-2/icon_free_a.png" alt=""/>
          <img v-if="gzh_operation.coupon.status === 2" class="img_down" src="./../assets/task-2/received.png" alt=""/>
          <!--</div>-->
          <p :class="{'is_down':gzh_operation.coupon.status === 2}">免费领币</p>
          <!--<p v-if="gzh_operation.coupon.status !== 2">免费领币</p>-->
          <!--<p class="hasDown" v-else="">已领取</p>-->
      </li>
      <li>
        <div @click="openTip('taskGameTip')" class="water" v-if="task_game.task_count < task_game.num && task_now.game_bounty<task_game.value">
          <div class="bol" :style="'height:'+task_now.game_bounty/task_game.value*100+'%'"></div>
          <span class="game-num"><b>{{task_now.game_bounty/info.coin_num}}/</b>{{task_game.value/info.coin_num}}</span>
        </div>
        <div @click="receiveTask(task_game)" v-if="task_game.task_count < task_game.num && task_now.game_bounty>=task_game.value" class="m-water">领币</div>
        <!--<div>-->
           <!--<div @click="openTip('taskGameTip')" class="water"  v-if="task_game.task_count < task_game.num && task_now.game_bounty<task_game.value" >-->
             <!--<div class="bol" :style="'height:'+task_now.game_bounty/task_game.value*100+'%'"></div>-->
             <!--<span class="game-num"><b>{{task_now.game_bounty/info.coin_num}}/</b>{{task_game.value/info.coin_num}}</span>-->
           <!--</div>-->
        <div v-if="task_game.task_count >= task_game.num" class="m-water is_down">领币</div>
        <img v-if="task_game.task_count >= task_game.num" class="img_down" src="./../assets/task-2/received.png" alt=""/>
        <p :class="{'is_down':task_game.task_count >= task_game.num}">投币送币</p>
           <!--<img v-if="task_game.task_count < task_game.num && task_now.game_bounty>=task_game.value" class="liImg2" src="./../assets/task/b_ling.png" alt="" @click="receiveTask(task_game)" />-->
           <!--<img v-if="task_game.task_count >= task_game.num" class="liImg2" src="./../assets/task/b_done.png" alt=""/>-->
         <!--</div>-->
         <!--<p v-if="task_game.task_count < task_game.num">投币送币</p>-->
         <!--<p class="hasDown" v-else="">已领取</p>-->
      </li>
      <li>
        <img @click="openTip('taskWawaTip')" v-if="task_wawa.task_count < task_wawa.num && task_now.prize_bounty<task_wawa.value" src="./../assets/task-2/icon_free_c.png" alt=""/>
        <img :class="{'is_down':task_wawa.task_count >= task_wawa.num}" @click="receiveTask(task_wawa)" v-else="" src="./../assets/task-2/icon_free_receive_c.png" alt="">
        <img v-if="task_wawa.task_count >= task_wawa.num" class="img_down" src="./../assets/task-2/received.png" alt=""/>
        <p :class="{'is_down':task_wawa.task_count >= task_wawa.num}">抓中送币</p>
          <!--<div>-->
            <!--<img v-if="task_wawa.task_count < task_wawa.num && task_now.prize_bounty>=task_wawa.value" class="liImg4" src="./../assets/task/c_ling.png" alt="" @click="receiveTask(task_wawa)"/>-->
            <!--<img @click="openTip('taskWawaTip')" v-if="task_wawa.task_count < task_wawa.num && task_now.prize_bounty<task_wawa.value" class="liImg3" src="./../assets/task/c_box.png" alt=""/>-->
            <!--<img v-if="task_wawa.task_count >= task_wawa.num"  src="./../assets/task/c_done.png" class="liImg3" alt="">-->
          <!--</div>-->
          <!--<p v-if="task_wawa.task_count < task_wawa.num">抓中送币</p>-->
          <!--<p class="hasDown" v-else="">已领取</p>-->
      </li>
    </ul>
  </div>
</template>

<script>
  import CONFIG from '../config'
  import {mapState} from 'vuex'
  import api from './../api/index'

  export default {
    name:'task',
    data(){
      return {
        isRequest:false,
        img1_1:require('./../assets/task/free.png'),
        img1_2:require('./../assets/task/free_bg.png'),
        img2_1:require('./../assets/task/free_catch.png'),
        img2_2:require('./../assets/task/free_catch2.png'),
      }
    },
    mounted(){
      if (this.version2) {
        this.img1_1 = this.img1_2;
        this.img2_1 = this.img2_2;
      }
      if(this.isLogin){
        this.mountedStart();
      }
    },
    computed: mapState({
      gzh_operation: state => state.user.gzh_operation,
      task_game: state => state.user.task_game,
      task_now:state => state.user.task_now,
      task_wawa:state => state.user.task_wawa,
      info: state => state.user.info,
      isLogin: state => state.user.isLogin,
    }),
    methods:{
      mountedStart(){
        this.$store.dispatch('getOperations').then(()=>{
          this.$store.dispatch('getActivityBountyInfo')
          var coupon_time = Date.now() - (localStorage.getItem('startTime2') ? localStorage.getItem('startTime2') : performance.timing.navigationStart);
          localStorage.removeItem('startTime2')
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
        })
        localStorage.removeItem('warrantTime');
        localStorage.removeItem('userTime');
        localStorage.removeItem('domTime');
      },
      openTip(value){
          this.$emit('openTip',value);
      },
      consumer(){
        if(CONFIG.isWx){
          this.$emit('openTip','free',this.gzh_operation.mp_url);
          return;
        }
        if(this.gzh_operation.coupon.status === 2){
          return;
        }
        this.$store.dispatch('getFreeCoin', {coin_price_id: this.gzh_operation.coin_price.coin_price_id, coupon_id: this.gzh_operation.coupon.id}).then((data) => {
          console.log(data);
          this.$store.commit('setCoins', data.data.coin_num);
          this.$store.dispatch('getUser');
          this.$store.dispatch('getOperations');
        })
      },
      receiveTask(task){
        //领取任务的游戏币
        if(!this.isRequest){
          this.isRequest = true;
          this.$store.dispatch('getActivityBountyExchange',task.id).then((res)=>{
            this.$store.dispatch('getFreeCoin',{coin_price_id: task.coin_price.coin_price_id, coupon_id: task.coupon.id}).then(()=>{
              this.isRequest = false;
              this.$emit('receiveBiSuccess');
              //领取成功
              this.$store.dispatch('getUser')
              this.$store.dispatch('getActivityBountyInfo')
              this.$store.dispatch('getOperations')
            }).catch(()=>{
              this.isRequest = false;
            })
          }).catch(()=>{
            this.isRequest = false;
          })
        }
      }
    },
    watch:{
      isLogin(){
        this.mountedStart();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @keyframes wave-animation {
    0% {
      background-position: 0 top;
    }

    100% {
      background-position: 102px top;
    }
  }
  .task{
    width: 100%;
    height:168px;
    position: absolute;
    padding: 0 20px;
    left: 0;
    bottom: 0;
    .task-bg{
      width: 710px;
    }
    .free-bg{
      width: 333px;
      position: absolute;
      left: 0;
      top:-18px;
    }
    ul{
      background: #fff;
      width: 706px;
      position: absolute;
      height:100%;
      border-radius: 16px;
      left: 22px;
      li{
        width: calc(100% / 3);
        height: 100%;
        float: left;
        position: relative;
        img{
          width: 110px;
          height: 110px;
          display: block;
          margin: 13px auto 0 auto;
          &.img_down{
            width: 160px;
            height: 88px;
            position: absolute;
            left: 50%;
            top:26px;
            margin: 0;
            transform: translateX(-50%);
          }
          &.is_down{
            opacity: 0.5;
          }
        }
        .m-water{
          width: 90px;
          height: 90px;
          background: url("./../assets/task-2/water.png") no-repeat;
          background-size: 100% 100%;
          border-radius: 50%;
          font-size: 30px;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 19px auto 14px auto;
          box-shadow: 0 4px 12px rgba(180,149,84,0.4);
          &.is_down{
            opacity: 0.5;
          }
        }
        .water{
          width: 90px;
          height: 90px;
          background-color: #999999;
          /*border: solid 6px #ffffff;*/
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: flex-end;
          margin: 19px auto 14px auto;
          box-shadow: 0 4px 12px rgba(180,149,84,0.4);
          /*box-shadow: inset 0px 3px 13px 0px*/
          /*rgba(242, 123, 0, 0.51);*/
          .bol{
            width: 100%;
            background: url("./../assets/task/b_bg.png");
            animation: wave-animation 1s infinite linear;
            transition: all 1s linear;
            background-size: 102px 116px;
          }
          .game-num{
            position: absolute;
            left: 50%;
            top:50%;
            font-size: 28px;
            color: #fff;
            transform: translate(-50%,-50%);
            b{
              font-size: 40px;
            }
          }
        }
         /* >div{
            width: 147px;
            height: 117px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            margin: 14px auto 8px auto;
            position: relative;
            .water{
              width: 114px;
              height: 114px;
              background-color: #999999;
              border: solid 6px #ffffff;
              border-radius: 50%;
              overflow: hidden;
              position: relative;
              display: flex;
              align-items: flex-end;
              .bol{
                width: 100%;
                background: url("./../assets/task/b_bg.png");
                animation: wave-animation 1s infinite linear;
                transition: all 1s linear;
                background-size: 102px 116px;
              }
            }
            .game-num{
              position: absolute;
              left: 50%;
              top:50%;
              font-size: 28px;
              color: #fff;
              transform: translate(-50%,-50%);
              b{
                font-size: 40px;
              }
            }
            img{
              width: 110px;
              height: 110px;
              &.liImg1{
                width: 135px;
              }
              &.liImg2{
                width: 114px;
              }
              &.liImg3{
                width: 144px;
              }
              &.liImg4{
                width: 147px;
              }
            }
          }
  */
          p{
            /*width: 93px;*/
            text-align: center;
            height: 24px;
            font-size: 24px;
            line-height: 24px;
            color: #494949;
            margin: 4px 0 0 0;
            /*width: 130px;*/
            /*height: 32px;*/
            /*background-color: #fec47b;*/
            /*border-radius: 16px;*/
            /*font-size: 22px;*/
            /*line-height: 32px;*/
            /*color: #2e339b;*/
            /*text-align: center;*/
            /*margin: 0 auto;*/
            /*font-weight: 600;*/
            &.is_down{
              color: #b3b3b3;
            }
          }
        }
      }
    }

  .task-version2{
    /*padding: 0 18px;*/
    height: 184px;
    ul{
      padding: 8px 0 0 0;
    }
  }
</style>
