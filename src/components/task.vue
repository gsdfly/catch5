<template>
  <div class="task" :class="{'task-version2':version2}">
    <ul>
      <li @click="consumer" v-if="gzh_operation.id">
        <img v-if="gzh_operation.coupon.status !== 2" :class="{'is_down':gzh_operation.coupon.status === 2}"
             src="./../assets/mogui/icon_free_a.png" alt=""/>
        <img v-if="gzh_operation.coupon.status === 2" class="img_down" src="./../assets/mogui/icon_free_a_used.png"
             alt=""/>

        <p :class="{'is_down':gzh_operation.coupon.status === 2}">免费领币</p>
      </li>

      <li v-if="task_game.num>0">
        <div @click="openTip('taskGameTip')" class="water"
             v-if="task_game.task_count < task_game.num && task_now.game_bounty<task_game.value">
          <span
            class="game-num"><b>{{task_now.game_bounty / info.coin_num}}/</b>{{task_game.value / info.coin_num}}</span>
        </div>

        <div @click="receiveTask(task_game)"
             v-if="task_game.task_count < task_game.num && task_now.game_bounty>=task_game.value" class="m-water">领币
        </div>

        <img v-if="task_game.task_count >= task_game.num" class="img_down" src="./../assets/mogui/icon_free_c_used.png"
             alt=""/>

        <p :class="{'is_down':task_game.task_count >= task_game.num}">投币送币</p>
      </li>

      <li v-if="task_wawa.num>0">
        <img @click="openTip('taskWawaTip')"
             v-if="task_wawa.task_count < task_wawa.num && task_now.prize_bounty<task_wawa.value"
             src="./../assets/mogui/icon_free_c.png" alt=""/>
        <img v-if="task_wawa.task_count < task_wawa.num && task_now.prize_bounty>=task_wawa.value"
             :class="{'is_down':task_wawa.task_count >= task_wawa.num}" @click="receiveTask(task_wawa)"
             src="./../assets/mogui/icon_free_receive_c.png" alt="">
        <img v-if="task_wawa.task_count >= task_wawa.num" class="img_down" src="./../assets/mogui/received.png" alt=""/>
        <p :class="{'is_down':task_wawa.task_count >= task_wawa.num}">抓中送币</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import CONFIG from '../config'
  import {mapState} from 'vuex'
  import api from './../api/index'

  export default {
    name: 'task',
    data() {
      return {
        isRequest: false,
      }
    },
    mounted() {
      if (this.isLogin) {
        this.mountedStart();
      }
    },
    computed: mapState({
      gzh_operation: state => state.user.gzh_operation,
      task_game: state => state.user.task_game,
      task_now: state => state.user.task_now,
      task_wawa: state => state.user.task_wawa,
      info: state => state.user.info,
      isLogin: state => state.user.isLogin,
    }),
    methods: {
      mountedStart() {
        this.$store.dispatch('getOperations').then(() => {
          //获取本地的guide
          var guideTime = localStorage.getItem('guideTime');
          var date = new Date();
          var nowTime = date.getMonth()+''+date.getDate();
          if(!(guideTime === nowTime)){
            this.$store.commit('changeIsGuide',true);
            localStorage.setItem('guideTime',nowTime)
          }
          var prize_bounty = localStorage.getItem('prize_bounty')
          //在第一次进入页面或取到任务值的时候需要将娃娃的任务值存到本地
          this.$store.dispatch('getActivityBountyInfo').then((res)=>{
            if(prize_bounty && res.prize_bounty>prize_bounty){
              _hmt.push(['_trackEvent', '抓中娃娃弹窗', '打开', '进入页面时弹出', '']);
              //弹出抓中娃娃的弹窗
              this.$emit('openTip','wawaTip');
            }
            localStorage.setItem('prize_bounty',res.prize_bounty);
          })

//          this.$store.dispatch('getActivityBountyInfo')
          var coupon_time = Date.now() - (localStorage.getItem('startTime2') ? localStorage.getItem('startTime2') : performance.timing.navigationStart);
          localStorage.removeItem('startTime2')
          if (localStorage.getItem('userTime') && localStorage.getItem('domTime')) {
            this.sendTimeOthers(coupon_time);
          } else {
            var inter = setInterval(() => {
              if (localStorage.getItem('userTime') && localStorage.getItem('domTime')) {
                this.sendTimeOthers(coupon_time);
                clearInterval(inter);
              }
            }, 500)
          }
        })
      },
      sendTimeOthers(coupon_time) {
        api.timeOthers({
          token: CONFIG.token,
          log_id: localStorage.getItem('log_id'),
          auth_time: localStorage.getItem('warrantTime') ? localStorage.getItem('warrantTime') : 0,
          dom_time: localStorage.getItem('domTime'),
          coupon_time: coupon_time,
          use_time: localStorage.getItem('userTime')
        })
        localStorage.removeItem('warrantTime');
        localStorage.removeItem('userTime');
        localStorage.removeItem('domTime');
      },
      openTip(value) {
        if (value === 'taskGameTip') {
          _hmt.push(['_trackEvent', '任务：投币送币', '点击', '投币送币：未完成', '']);
        } else if (value === 'taskWawaTip') {
          _hmt.push(['_trackEvent', '任务：抓中送币', '点击', '抓中送币：未完成', '']);
        }
        this.$emit('openTip', value);
      },
      consumer() {
        if (this.gzh_operation.coupon.status === 2) {
          return;
        }
        if (CONFIG.isWx) {
//          this.$emit('openTip','free',this.gzh_operation.mp_url);
          this.$emit('openTip', 'free', 'http://res.catchme.com.cn/activity/guide/image_free.png');
          _hmt.push(['_trackEvent', '任务：免费领币', '点击', '免费领币：微信', '']);
          return;
        }
        _hmt.push(['_trackEvent', '任务：免费领币', '点击', '免费领币：支付宝', '']);
        this.$store.dispatch('getFreeCoin', {
          coin_price_id: this.gzh_operation.coin_price.coin_price_id,
          coupon_id: this.gzh_operation.coupon.id
        }).then((data) => {
          console.log(data);
          this.$store.commit('setCoins', data.data.coin_num);
          this.$store.dispatch('getUser');
          this.$store.dispatch('getOperations');
        })
      },
      receiveTask(task) {
        //领取任务的游戏币
        if (!this.isRequest) {
          if (task.type === 9) {
            _hmt.push(['_trackEvent', '任务：投币送币', '点击', '投币送币：领币', '']);
          } else if (task.type === 10) {
            _hmt.push(['_trackEvent', '任务：抓中送币', '点击', '抓中送币：领币', '']);
          }
          this.isRequest = true;
          this.$store.dispatch('getActivityBountyExchange', task.id).then((res) => {
            this.$store.dispatch('getFreeCoin', {
              coin_price_id: task.coin_price.coin_price_id,
              coupon_id: task.coupon.id
            }).then(() => {
              this.isRequest = false;
              this.$emit('receiveBiSuccess');
              //领取成功
              this.$store.dispatch('getUser')
              this.$store.dispatch('getActivityBountyInfo')
              this.$store.dispatch('getOperations')
            }).catch(() => {
              this.isRequest = false;
            })
          }).catch(() => {
            this.isRequest = false;
          })
        }
      }
    },
    watch: {
      isLogin() {
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

  .task {
    width: 100%;
    height: 168px;
    position: absolute;
    padding: 0 20px;
    left: 0;
    bottom: 0;
    .task-bg {
      width: 710px;
    }
    .free-bg {
      width: 333px;
      position: absolute;
      left: 0;
      top: -18px;
    }
    ul {
      background: #fff;
      width: 706px;
      position: absolute;
      height: 100%;
      border-radius: 16px;
      left: 22px;
      li {
        width: calc(100% / 3);
        height: 100%;
        float: left;
        position: relative;
        img {
          width: 92px;
          height: 93px;
          display: block;
          margin: 19px auto 11px auto;
        }
        .img_down {
          width: 160px;
        }
        .m-water {
          width: 90px;
          height: 90px;
          background-color: #ff0000;
          box-shadow: 0px 2px 2px 0px rgba(200, 0, 0, 0.4);
          border-radius: 50%;
          font-size: 30px;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 19px auto 14px auto;
        }
        .water {
          width: 90px;
          height: 90px;
          background-color: #ff0000;
          box-shadow: 0px 2px 2px 0px rgba(200, 0, 0, 0.4);
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: flex-end;
          margin: 19px auto 14px auto;
          .game-num {
            position: absolute;
            left: 50%;
            top: 50%;
            font-size: 28px;
            color: #fff;
            transform: translate(-50%, -50%);
            b {
              font-size: 40px;
            }
          }
        }
        p {
          /*width: 93px;*/
          text-align: center;
          height: 24px;
          font-size: 24px;
          line-height: 24px;
          color: #494949;
          margin: 4px 0 0 0;
          &.is_down {
            color: #b3b3b3;
          }
        }
      }
    }
  }

  .task-version2 {
    /*padding: 0 18px;*/
    height: 184px;
    ul {
      padding: 8px 0 0 0;
    }
  }
</style>
