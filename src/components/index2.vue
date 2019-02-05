<template>
  <div class="jo-index" :class="{'jo-version2':version2}">
    <div class="jo-index-div" v-show="showHtml" @click="hideKefu">
      <div v-if="isGetImg" v-show="false">
      </div>
      <div class="header">
        <div>
          <div class="head-portrait" @click="goProfile">
            <img v-if="user.avatar" :src="user.avatar" alt="" style="border-radius: 50%">
            <img v-else="" src="./../assets/small/icon_portrait.png" alt="">
            <p>{{user.player_id}}</p>
          </div>
          <div class="header-main">
            <h4>{{user.nick_name}}<span>{{'机器号：' + machine_no}}</span></h4>
            <div class="game game-coins">
              <div>
                <i class="icon-jinbi"></i><span class="coins-num">{{user.coins}}</span>
              </div>
              <span v-show="isShowCoinTip" class="animated coin-animate" :class="{'zoomOutLeft':isShowCoinTip}">+{{addCoinNum}}</span>
            </div>
            <div class="kefu" @click.stop="">
              <p id="support" @click="showKefu">
                <img src="./../assets/chunjie/icon_kefu.png" alt=""><span>客服</span>
              </p>
              <div class="kefu2" :style="isKefuStyle">
                <div class="kefu2-right">
                  <div class="kefu2-img">
                    <img :src="kefuImg" alt="">
                  </div>
                  <h3>长按关注<br/>联系客服</h3>
                  <p><span></span><a href="tel:0755-32904117">0755-32904117</a></p>
                </div>
                <div class="kefu2-left" @click="hideKefu">
                  <img src="./../assets/small/icon_close1.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="activitys">
        <free @openTip="openTip" @myStartGame="myStartGame"></free>
        <!--<task  ref="task" @receiveBiSuccess="receiveBiSuccess" @openTip="openTip" @taskGame="taskGame" @bankCard="bankCard" @handleGzh="handleGzh"></task>-->
      </div>
      <div class="main">
        <div class="centerout">
          <div class="center">
            <h3 @click="handleScanQRCode" id="change_device">扫码换机<i class="iconfont icon-go"></i></h3>
            <img v-if="chunjie_operation.task_count < chunjie_operation.num" class="chunjiered" :class="{'clickChunjiered':!isClickChunjiered}" @click="openTip('chunjieRed')" src="./../assets/chunjie/red.png" alt=""/>
            <div class="cloud">
              <img class="cloud-a" src="./../assets/chunjie/cloud_a.png" alt="">
              <img class="cloud-b" src="./../assets/chunjie/cloud_b.png" alt="">
              <img class="cloud-c" src="./../assets/chunjie/cloud_c.png" alt="">
            </div>
            <div class="startgame" :class="{'hasclick':start_desc == '投币中','mypluse':!isClickStartGame}"
                 id="coin-operated"
                 @click="handleStartingDevice">{{start_desc ? start_desc : '投币启动'}}
            </div>
            <div class="game-num norecharge" v-if="user.coins<=0">您还没有游戏币，请先充值<span></span>
            </div>
            <div class="game-num" v-else>
              <i id="coin_reduce" class="iconfont icon-jian" @click="handlerGameNum('-')" :class="{
                     'active': gameNum === 1
                 }"></i>
              <div>
                <h3>{{gameNum * info.coin_num}}币</h3>
                <p>可玩{{gameNum}}次游戏</p>
              </div>
              <i id="coin_add" class="iconfont icon-jia" @click="handlerGameNum('+')" :class="{
                     'active': ((gameNum + 1) * info.coin_num) > user.coins
                 }"></i>
            </div>
            <img @click.prevent="" v-if="start_desc=='投币中'" class="tbz" src="../assets/small/tbz.gif" alt="">
            <img @click.prevent="" v-if="is_lamp_after && start_desc=='投币启动'" class="tbz"
                 src="http://res.catchme.com.cn/imgs-2018-02-05/btcg.gif" alt="">
            <div class="tip" :class="{'tipbg':!isClickStartGame}">
              <p v-show="user.coins<=0  && !is_lamp_after">充值后点击“投币启动”按钮开始游戏</p>
              <p v-show="is_lamp_after && start_desc=='投币启动'">投币成功，<span>“摇动游戏杆”</span>即可开始游戏</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <joPay ref="joPay" @startGame="myStartGame" @openTip="openTip" @changeBgShow="changeBgShow" @handleScanQRCode="handleScanQRCode"
               @closeBg="closeBg"></joPay>
      </div>
      <div class="bg" v-show="bgShow" @click="closeBg">
        <div class="bg-center4" v-if="contentShow == 'hideCoupon'" @click.stop="">
          <div class="bg-center-center">
            <img class="bg-center4-img" @click.prevent=""
                 src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/big/recharge.png"
                 alt="">
            <h3 class="coupon-num" :class="{'coupon-infinity':currentCouponPay.type===1}">
              {{Number(currentCouponPay.coin_price).toFixed(2) | handleNum}}元<span
              v-if="currentCouponPay.type===0">{{currentCouponPay.coin_num}}币</span><span v-else="">无限玩</span></h3>
            <p class="bg-center4-p" v-show="(currentCouponPay.original_price - currentCouponPay.coin_price)>0">
              (立省{{(currentCouponPay.original_price - currentCouponPay.coin_price).toFixed(2) | handleNum}}元)</p>
            <button class="bg-center4-btn1" @click="useCouponPay" id="use_hide_coupon">立即使用</button>
            <button class="bg-center4-btn2 btn2" @click="continueRecharge" id="continue_recharge">
              继续充{{pay.coin_price | handleNum}}元
            </button>
            <img src="./../assets/small/icon_close.png" alt="" class="close"
                 @click="closeBg('hide')" id="close_hide_coupon">
          </div>
        </div>
        <div class="bg-center10" v-if="contentShow == 'coin'" @click.stop="">
          <div>
            <div>
              <img class="imgBg" src="http://res.catchme.com.cn/imgs-2018-02-05/tip/image_much.png" alt="">
              <p>一次投币太多容易造成浪费<br/>确定继续投币吗？</p>
              <button class="btn1" @click="reloadCoin">重新选择</button>
              <button class="btn2" @click="continueCoin">继续投币</button>
            </div>
            <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close"
                 @click="closeBg"/>
          </div>
        </div>
        <div class="bg-center13" v-if="contentShow == 'free'" @click.stop="">
          <div>
            <img @click.prevent="" src="./../assets/chunjie/image_free.png" alt="" class="imgBg"/>
            <img class="btn" src="./../assets/chunjie/press_continue.png" v-show="isShowGzhButtton" @click.prevent="" @touchstart="press1"
                 @touchend="press2"/>
            <p>关注公众号回复“<span>{{freeTip}}</span>”即可领免费币</p>
            <img :style="gzhCodeStyle" @click.prevent="" :src="freeTipImg" alt="" class="qrcode"/>
            <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close"
                 @click="closeBg"/>
          </div>
        </div>

        <div class="bg-center18" v-if="contentShow == 'coinred'" @click.stop="">
          <div>
            <img class="imgBg" src="http://res.catchme.com.cn/activity/red/red_bi2.png" alt="">
            <img v-if="user.avatar" class="avatar" :src="user.avatar" alt=""/>
            <div  class="avatar-div" v-else>
              <img src="./../assets/small/icon_portrait.png" alt="">
            </div>
            <h3>恭喜获得</h3>
            <h2 v-if="redCoinNum > 0">{{redCoinNum}}个免费游戏币</h2>
            <h2 v-else="">现金红包</h2>
            <p v-if="redCoinNum > 0">点击“投币启动”按钮，开始抓娃娃吧</p>
            <p v-else="">红包已通过“趣东西服务”发送至您的微信上啦<br/>注意查收哦</p>
            <h4><span></span><b>大家的手气</b></h4>
            <ul>
              <li v-for="item in redGroup.list">
                <img v-if="item.avatar" class="ul-avatar" :src="item.avatar" alt="">
                <div v-else="">
                  <img src="./../assets/small/icon_portrait.png" alt="">
                </div>
                <p>{{item.nickname}}</p>
                <span v-if="item.type == 1">{{item.desc}}元</span>
                <span v-if="item.type == 2">{{item.desc}}币</span>
              </li>
              <li v-for="item2 in (redGroup.num - redGroup.list.length)">
                <div class="red-avatar">
                  <img src="./../assets/red/red_s.png" alt="">
                </div>
                <span>等待领取</span>
              </li>
            </ul>
            <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close"
                 @click="closeBg('redMachine')"/>
          </div>
        </div>

        <div class="bg-center19" v-if="contentShow == 'moneyred'" @click.stop="">
          <div>
            <img class="imgBg" src="http://res.catchme.com.cn/activity/red/red_cash.png" alt="">
            <h3>恭喜获得</h3>
            <h2>现金红包</h2>
            <p>红包已通过“趣东西服务”发送至您的微信上啦<br/>注意查收哦</p>
            <div class="btn" @click="closeBg">我知道啦</div>
            <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close"
                 @click="closeBg"/>
          </div>
        </div>

        <div class="bg-center20" v-if="contentShow == 'failred'" @click.stop="">
          <div>
            <div class="content">
              <img class="imgBg" src="http://res.catchme.com.cn/activity/red/red_image.png" alt="">
              <h3>领取失败</h3>
              <p>{{message}}</p>
              <div class="btn" @click="closeBg('redMachine')">我知道啦</div>
            </div>
            <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close"
                 @click="closeBg('redMachine')"/>
          </div>
        </div>

        <div class="bg-center30" v-if="contentShow=='chunjieRed'" @click.stop="">
          <div>
            <img class="imgBg" src="./../assets/chunjie/congratulate.png" alt=""/>
            <h3>{{chunjie_operation.price}}<span>元</span></h3>
            <p>（充值{{chunjie_operation.coin_price.original_price}}元可用）</p>
            <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close"
                 @click="closeBg"/>
          </div>
        </div>

        <div class="bg-center31" v-if="contentShow=='reduce'" @click.stop="">
          <div>
            <img class="imgBg" src="./../assets/chunjie/recharge_now.png" alt=""/>
            <h3>{{chunjie_operation.coin_price.coin_price}}元{{chunjie_operation.coin_price.coin_num}}币</h3>
            <p>（{{chunjie_operation.coin_price.original_price}}元）</p>
            <div class="btn" @click="useChunjiePay">立即充值</div>
            <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close"
                 @click="closeBg"/>
          </div>
        </div>

      </div>
    </div>
    <tip :tipContent="tipContent" @tipButton="tipButton"></tip>
  </div>
</template>

<script>
  import CONFIG from '../config'
  import {mapState} from 'vuex'
  import joPay from './wxpay'
  import tip from './tip.vue'
  import {getErrMsg, getParamByName} from './../util/index'
  import Toast from 'mint-ui/lib/Toast'
  import free from './free.vue'
  import socketio from 'socket.io-client';
  import animate from 'animate.css'
  import api from './../api'

  export default {
    data() {
      return {
        isClickChunjiered:false,
        isClickStartGame: true,
        isConnectScoket: false,
        io: {},
        start_desc: '投币启动',
        gameNum: 1,
        is_start: false,
        is_lamp_after: false,
        is_recharge: false,
        loading_art: '加载更多~',
        load: false,
        max_page: false,
        maskShow: false,
        isShow: '',
        showHtml: true,
        bgShow: false,
        contentShow: '',
        contentShowAfter: '',
        currentCoupon: {},
        pay: {},
        currentCouponPay: {},
        operationTipContent: '',
        isKefuStyle: '',
        kefuImg: '',
        isGetImg: false,
        isReceive: false,   //是否领取红包
        couponInfo: {
          code: '',
          end_time: '',
          name: ''
        },
        freeTipImg: '',
        freeTip: '666',
        ringStyle: '',
        centerStyle: '',
        starClass: '',
        currentGift: {
          id: 37,
          level: 1,
          title: "三方优惠券",
          type: 8,
          voucher_batch: {
            id: 3,
            value: 16,
            name: "商城优惠码2",
            image: null,
          },
          vouchers: [{
            code: "267299840241",
            end_time: "2019-01-01 00:00:00",
            image: null,
            value: 1600,
            voucher_batch_id: 3
          }]
        },
        task_game: {},
        bankUserInfo: {
          username: '',
          phone: ''
        },
        bankOpe: {},
        isRequest: false,
        redCoinNum: 0,
        shuomingPre: '',
        isShowGuide2: false,
        freeAnimate: '',
        isShowCoinTip: false,
        addCoinNum: 0,
        isShowGzhButtton: true,
        isShowGzhImg: false,
        gzhCodeStyle: 'visibility: hidden',
        isCalculated: false,//娃娃位置计算完成
        timeout1: {},
        timeout2: {},
//        guideTime:'',
//        touchTime:0
        message: '',
        redGroup: {
          num: 5,
          list: []
        },
        isAfterRed: false,
        tencentCodeImgUrl: '',
        tencentImgtime: 0,
        currentActivityBounty: {},
        dalibaoIndex: 0,
        isShowBaomihuaList: false,
        codeWidth: 2,
        codeHeight: 45,
      }
    },
    created() {
      this.Indicator.open()
    },
    computed: mapState({
      user: state => state.user.user,
      consume: state => state.user.consume,
      machine_no: state => state.user.machine_no,
      info: state => state.user.info,
      hide_coupons: state => state.user.hide_coupons,
      tipContent: state => state.user.tipContent,
//      tip_operation: state => state.user.tip_operation,
//      activity_bounty: state => state.user.activity_bounty,
//      task_now: state => state.user.task_now,
//      isShowGuide: state => state.user.isShowGuide,
      isLogin: state => state.user.isLogin,
      gzh_operation: state => state.user.gzh_operation,
      gzh_operation_other: state => state.user.gzh_operation_other,
      chunjie_operation: state => state.user.chunjie_operation,
//      dalibao: state => state.user.dalibao,
//      redGame: state => state.user.redGame
    }),
    components: {
      joPay,
      tip,
      free
    },
    mounted() {
      var re = localStorage.getItem('re');
      if(re && this.isLogin){
        this.handleRedMachine(re)
      }
      //判断是否是充gzh关注之后过来的
      var isgzh = localStorage.getItem('isgzh');
      if (isgzh) {
        var coin_price_id = document.URL.indexOf('catchme') !== -1 ? 104 : 17;
        var coupon_id = document.URL.indexOf('catchme') !== -1 ? 9 : 13;
        api.getFreeCoin({
          coin_price_id: coin_price_id,
          machine_no: 'CATCH_199999',
          coupon_id: coupon_id,
          token: CONFIG.token
        }).then((res) => {
          //正常领取成功
          this.isShowCoinTip = true;
          this.isClickStartGame = false;
          this.addCoinNum = res.data.coin_num;
          setTimeout(() => {
            this.$store.commit('setCoins', res.data.coin_num);
            this.$store.dispatch('getUser');
            this.$store.dispatch('getOperations');
            this.isShowCoinTip = false;
          }, 1500)
        });
        localStorage.removeItem('isgzh')
      }
      if (CONFIG.isWx) {
        document.addEventListener('visibilitychange', function () {
          if (!document.hidden) {
            this.$store.dispatch('getUser');
            this.$store.dispatch('getOperations');
            if (this.contentShow === 'free') {
              this.bgShow = false;
            }
          }
        }.bind(this));
      } else if (CONFIG.isAlipay) {
        document.addEventListener('resume', function () {
          this.$store.dispatch('getUser');
        }.bind(this));
      }
      this.$store.dispatch('judgeMachine').then((res) => {
        localStorage.setItem('machine_obj', JSON.stringify({'url': document.URL, 'time': new Date().getTime()}));
        //用户可以操作时间
        localStorage.setItem('userTime', (Date.now() - (localStorage.getItem('startTime2') ? localStorage.getItem('startTime2') : performance.timing.navigationStart)))
        this.Indicator.close();
        this.showHtml = true;
        this.isGetImg = true;
        if (res.online === 0) {
          this.$store.commit('changeTipContent', getErrMsg(1001));
        }
      })
    },
    methods: {
      handleRedMachine(re){
        this.$store.dispatch('getEnvelopeReceiveAction',re).then((res)=>{
          this.bgShow = true;
          this.redGroup = res.group;
          this.contentShow = 'coinred';
          if(res.type === 'coin'){
            this.isShowCoinTip = true;
            this.isClickStartGame = false;
            this.addCoinNum = res.data.coin_num;
            this.redCoinNum = res.coin_num;
            setTimeout(()=>{
              this.isShowCoinTip = false;
              this.$store.dispatch('getUser');
            },1500)
          }
          localStorage.removeItem('re')
        }).catch((res)=>{
          this.bgShow = true;
          this.contentShow = 'failred'
          this.message = res.message
          localStorage.removeItem('re')
        })
      },
      openTip(value,value2='',value3='') {
        if(value === 'free'){
          this.isShowGzhButtton = true;
          this.gzhCodeStyle = 'visibility: hidden'
        }
        if(value === 'chunjieRed'){
          this.isClickChunjiered = true;
          var chunjieRed = localStorage.getItem('chunjieRed');
          var time = new Date().getDate();
          if(chunjieRed !== time){
            localStorage.setItem('chunjieRed',time);
            _hmt.push(['_trackEvent', '点击红包', '点击', '用户领取最大充值项红包', '']);
          }
        }
        this.freeTipImg = value2;
        if(value3){
          this.freeTip = value3;
        }
        this.bgShow = true;
        this.contentShow = value;
      },
      closeBg() {
        this.bgShow = false;
        this.contentShow = '';
      },
      myStartGame(coin) {
        this.isClickStartGame = false;
        this.isShowCoinTip = true;
        this.addCoinNum = coin;
        setTimeout(() => {
          this.$store.dispatch('getUser');
          this.isShowCoinTip = false;
        }, 1500)
      },
      press1() {
        clearTimeout(this.timeout1)
        clearTimeout(this.timeout2)
        setTimeout(() => {
          this.gzhCodeStyle = 'visibility: visible'
          this.isShowGzhButtton = false
        }, 100)
        this.timeout1 = setTimeout(() => {
          this.gzhCodeStyle = 'visibility: hidden'
          this.isShowGzhButtton = true
        }, 800)
      },
      press2() {
        this.timeout2 = setTimeout(() => {
          this.gzhCodeStyle = 'visibility: hidden'
          this.isShowGzhButtton = true
        }, 400)
      },
      socket() {
        var self = this;
        if (!self.isConnectScoket) {
          self.io = socketio(CONFIG.socketUrl, {
            query: 'machine=' + CONFIG.machine_no,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5
          })
          self.io.on('connect', function () {
            self.isConnectScoket = true
            self.io.on('prize', function () {
              self.handleActivityBountyInfo(1);
            })
            self.io.on('game_finish_score_0', function () {
              self.bgShow = true;
              self.contentShow = 'nobi'
            })
          })
          self.io.on('disconnect', function () {
            self.isConnectScoket = false
          })
        }
      },
      goProfile() {
        _hmt.push(['_trackEvent', '点击用户头像', '点击', '跳转到个人中心', '']);
        if (document.URL.indexOf('www') !== -1) {
          window.location.href = CONFIG.localtionUrl + '/profile'
        } else {
          window.location.href = CONFIG.localtionUrl2 + 'taobao/profile'
        }
      },
      tipButton() {
        if (this.tipContent.button === '扫码换机') {
          this.handleScanQRCode();
        } else {
          this.$store.commit('changeTipContent', {isShow: false});
        }
      },
      useChunjiePay(){
        this.$refs.joPay.handlePay(this.chunjie_operation.coin_price.coin_price_id, this.chunjie_operation.coin_price.coin_num, this.chunjie_operation.coin_price.status, this.chunjie_operation.coin_price.coin_price, this.chunjie_operation.coin_price.type);
      },
      useCouponPay() {
        _hmt.push(['_trackEvent', '使用' + this.currentCouponPay.coin_price + '元' + this.currentCouponPay.coin_num + '币隐藏优惠券', '点击', '', '']);
        this.$refs.joPay.handlePay(this.currentCouponPay.coin_price_id, this.currentCouponPay.coin_num, this.currentCouponPay.status, this.currentCouponPay.coin_price, this.currentCouponPay.type);
      },
      continueRecharge() {
        _hmt.push(['_trackEvent', '继续充值' + this.pay.coin_price + '元', '点击', '', '']);
        this.$refs.joPay.handlePay(this.pay.coin_price_id, this.pay.coin_num, this.pay.status, this.pay.coin_price, this.pay.type);
      },
      changeBgShow(obj) {
        this.bgShow = obj.bgShow;
        this.contentShow = obj.contentShow;
        this.currentCoupon = obj.currentCoupon;
        this.pay = obj.pay;
        this.currentCouponPay = obj.currentCouponPay;
        this.operationTipContent = obj.operationTipContent;
      },

      handlerGameNum(x) {
        if (x === '-') {
          if (this.gameNum === 1) return false;
          this.gameNum--;
          _hmt.push(['_trackEvent', '减币', '点击', '', '']);
        } else {
          if (((this.gameNum + 1) * this.info.coin_num) > this.user.coins) {
            return false
          }
          this.gameNum++;
          _hmt.push(['_trackEvent', '加币', '点击', '', '']);
        }
      },
      reloadCoin() {
        this.gameNum = 1;
        this.bgShow = false;
      },
      continueCoin() {
        this.startingDevice();
        this.bgShow = false;
      },
      //投币，开始游戏
      handleStartingDevice() {
        this.closeBg();
        this.isClickStartGame = true;
        if (this.info.online === 0) {
          this.$store.commit('changeTipContent', getErrMsg(1001));
          return
        }
        if (this.is_start) {
          return
        } else {
          if (this.gameNum * this.info.coin_num < 50) {
            this.startingDevice();
          } else if (this.gameNum * this.info.coin_num >= 99) {
            Toast({
              message: '投币数量太多，请重新选择',
              position: 'middle',
              duration: 1000
            })
            this.gameNum = 1;
            return;
          } else {
            this.bgShow = true;
            this.contentShow = 'coin';
            return;
          }
        }
      },
      startingDevice() {
        this.is_start = true
        this.is_lamp_after = false
        this.start_desc = '投币中'
        if (this.user.coins < this.info.coin_num) {
          this.start_desc = '';
          this.is_start = false
          this.$store.commit('changeTipContent', getErrMsg(1005));
          return false
        }
        //添加百度统计
        _hmt.push(['_trackEvent', '主按钮投币', '点击', '投币-游戏次数-' + this.gameNum, '']);
        this.$store.dispatch('startingDevice', this.gameNum * this.info.coin_num)
          .then(() => {
            this.socket();
            //投币成功，重新调用获取task_now的接口
            this.$store.dispatch('getActivityBountyInfo')
            this.is_lamp_after = true
            this.is_start = false
            this.start_desc = '投币启动'
            this.gameNum = 1;
            setTimeout(() => {
              this.is_lamp_after = false
            }, 12000 * this.gameNum)
          })
          .catch(() => {
            this.is_start = false
            this.start_desc = '投币启动'
          })
      },
      handleScanQRCode() {
        _hmt.push(['_trackEvent', '扫码更换机器', '点击', '', '']);//添加百度统计
        if (CONFIG.isAlipay) {
          ap.scan(function (res) {
            if (res.code) {
              window.location.href = res.code
            }
          })
        } else if (CONFIG.isWx) {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              window.location.href = result
            },
            error: function () {
              alert('扫码失败')
            }
          })
        } else {
          Tida.scanCode(function (res) {
            if (res.code) {
              if (res.type !== 'ERROR') {
                window.location.href = res.code
              }
            }
          });
        }
      },
      showKefu() {
        _hmt.push(['_trackEvent', '客服', '点击', '', '']);
        this.kefuImg = 'http://res.catchme.com.cn/imgs-2018-04-10/qrcode2.jpg';
        this.isKefuStyle = ' transform: translate3d(0,0,0);';
      },
      hideKefu() {
        this.isKefuStyle = ' transform: translate3d(100%,0,0);';
      }
    },
    watch: {
      isLogin() {
        var re = localStorage.getItem('re');
        if (re) {
          this.handleRedMachine(re)
        }
      },
      user(newUser, oldUser) {
        if (oldUser.coins === 0) {
          return;
        }
        if (newUser.coins !== oldUser.coins) {
          setTimeout(() => {
            this.$store.dispatch('getUser')
          }, 2000)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "./../themes/chunjie";

  @keyframes swing {
   /* 20% {
      transform: rotate3d(0, 0, 1, 20deg);
    }

    40% {
      transform: rotate3d(0, 0, 1, -20deg);
    }

    60% {
      transform: rotate3d(0, 0, 1, 5deg);
    }

    80% {
      transform: rotate3d(0, 0, 1, -5deg);
    }
*/
    from {
      transform: rotate3d(0, 0, 1, -20deg);
    }
    to {
      transform: rotate3d(0, 0, 1, 20deg);
    }
  }

  @keyframes heartBeat {
    0% {
      transform: scale(1);
    }

    14% {
      transform: scale(1.2);
    }

    28% {
      transform: scale(1);
    }

    42% {
      transform: scale(1.2);
    }

    70% {
      transform: scale(1);
    }
  }

  @mixin center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  @mixin centerX {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  @mixin centerY {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .kefu2 {
    width: 324px;
    height: 347px;
    background: url("./../assets/chunjie/service_bg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    z-index: 999;
    top: 0;
    right: 0;
    margin: -14px -14px 0 0;
    padding: 13px 13px 0 19px;
    transform: translate3d(100%, 0, 0);
    transition: all 0.4s;
    .kefu2-left {
      float: right;
      width: 58px;
      height: 62px;
      border-radius: 18px 0 0 18px;
      line-height: 62px;
      text-align: center;
      img {
        width: 30px;
        height: 29px;
        vertical-align: middle;
      }
    }
    .kefu2-right {
      width: 234px;
      padding: 30px 0 0 0;
      float: right;
      border-radius: 0 0 0 18px;
      .kefu2-img {
        width: 143px;
        height: 143px;
        padding: 3px;
        margin: 0 auto;
        background: #d83622;
        border-radius: 4px;
        img {
          width: 137px;
          height: 137px;
        }
      }
      h3 {
        font-size: 22px;
        line-height: 24px;
        color: $kefuTipColor;
        margin: 12px 0 28px 0;
        text-align: center;
      }
      p {
        font-size: 22px;
        text-align: center;
        a {
          color: $kefuPhoneColor;
        }
        span {
          display: inline-block;
          width: 27px;
          height: 26px;
          /*background: url("http://res.catchme.com.cn/imgs-2018-04-10/icon_phone.png") no-repeat;*/
          background: url("./../assets/small/icon_phone.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: top;
          margin: 0 8px 0 0;
        }
      }
    }
  }

  .coupon-num {
    font-size: 80px;
    text-shadow: 3px 3px 5px #d93401;
    color: #fff;
    position: absolute;
    top: 350px;
    width: 100%;
    line-height: 80px;
  }

  .bg-center-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  .bg-center4 button {
    width: 556px;
    height: 100px;
    outline: none;
    border: none;
    font-size: 36px;
    color: #fff;
    text-shadow: 2px 2px 3px #cd1d00;
    background: url("http://res.catchme.com.cn/imgs-2017-12-29-20-42/big/press_default.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .bg-center4 button.btn2 {
    color: #fc6612;
    text-shadow: none;
    background: url("http://res.catchme.com.cn/imgs-2018-04-10/press_recharge_default.png") no-repeat;
    background-size: 100% 100%;
  }

  .bg-center4 p {
    font-size: 36px;
    color: #ff4848;
    position: absolute;
    top: 630px;
    left: 50%;
    transform: translateX(-50%)
  }

  .bg-center4-img {
    width: 90%;
    padding: 0 20px 0 10px;
  }

  .bg-center4 .bg-center4-p {
    font-size: 36px;
    color: #fff;
    position: absolute;
    top: 448px;
    line-height: 36px
  }

  .bg-center4-btn1 {
    bottom: 352px;
  }

  .bg-center4-btn2 {
    bottom: 220px;
  }

  .bg-center10 {
    > div {
      width: 622px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      > div {
        width: 100%;
        height: 840px;
        background: #fff;
        p {
          font-size: 40px;
          color: #000;
          width: 622px;
          text-align: center;
          line-height: 62px;
          margin: 0 0 34px 0;
        }
        button {
          width: 556px;
          height: 100px;
          border: none;
          outline: none;
          /*font-size: 0;*/
          color: #fff;
          &.btn1 {
            background: url("http://res.catchme.com.cn/imgs-2018-04-10/press_default.png") no-repeat;
            background-size: 100% 100%;
            bottom: 204px;
            font-size: 36px;
            margin: 0 0 26px 0;
          }
          &.btn2 {
            background: url("http://res.catchme.com.cn/imgs-2018-04-10/press_recharge_default.png") no-repeat;
            background-size: 100% 100%;
            bottom: 62px;
            color: #f16319;
            /*text-shadow:0 0 10px #fff,
            4px 4px 6px blue,-4x -4px 6px blue;*/
          }
        }
        .imgBg {
          width: 556px;
          margin: 45px 0;
        }
        /*.close {
          position: absolute;
          right: 0;
          top: -140px;
        }*/
      }
    }
  }

  .bg-center13 {
    > div {
      @include center;
      .imgBg {
        width: 640px;
      }
      .qrcode {
        width: 114px;
        height: 114px;
        @include centerX;
        top: 750px;
      }
      p {
        position: absolute;
        width: 100%;
        text-align: center;
        font-size: 30px;
        line-height: 30px;
        color: #c01112;
        left: 0;
        top: 687px;
        span {
          font-weight: bold;
          font-size: 34px;
          color: #c01112;
        }
      }
      .btn {
        width: 374px;
        @include centerX;
        top: 755px;
        z-index: 666;
      }
    }
  }

  .bg-center18,.bg-center19,.bg-center20{
    .btn{
      width: 360px;
      height: 70px;
      line-height: 70px;
      background-image: linear-gradient(0deg,
        rgba(193, 193, 193, 0.65) 0%,
        rgba(255, 255, 255, 0.65) 99%),
      linear-gradient(
          #ffffff,
          #ffffff);
      background-blend-mode: normal,
      normal;
      border-radius: 35px;
      font-size: 32px;
      color: #fd673b;
      @include centerX;
    }
  }

  .bg-center18{
    >div{
      @include center;
      color: #927247;
      .imgBg{
        width: 671px;
      }
      .avatar{
        width: 129px;
        height: 129px;
        border-radius: 50%;
        border: 3px solid #ff6138;
        @include centerX;
        top:60px;
      }
      .avatar-div{
        width: 129px;
        height: 129px;
        background:#ff6138;
        border-radius: 50%;
        @include centerX;
        top:60px;
        img{
          width: 110px;
          @include center;
        }
      }
      >h3{
        font-size: 32px;
        line-height: 32px;
        width: 100%;
        position:absolute;
        left: 0;
        top:213px;
        text-align: center;
      }
      >h2{
        font-size: 48px;
        line-height: 48px;
        width: 100%;
        position:absolute;
        font-weight: bold;
        left: 0;
        top:258px;
        text-align: center;
      }
      >p{
        font-size: 24px;
        line-height: 24px;
        width: 100%;
        position:absolute;
        left: 0;
        top:335px;
        text-align: center;
      }
      >h4{
        font-size: 24px;
        line-height: 24px;
        color: #ffb09c;
        width: 100%;
        text-align: center;
        @include centerX;
        top:493px;
        span{
          width: calc(100% - 98px);
          height: 2px;
          @include centerY;
          left: 49px;
          background: #ffb09c;
          z-index: -1;
        }
        b{
          background:#ff6138;
          padding: 0 20px;
        }
      }
      ul{
        width: 100%;
        height: 365px;
        @include centerX;
        top: 530px;
        overflow: auto;
        li{
          width: 100%;
          height: 65px;
          margin: 0 0 8px 0;
          padding: 0 50px;
          color: #fff;
          .ul-avatar{
            width: 65px;
            height: 65px;
            border: solid 2px #ffe8da;
            border-radius: 50%;
            float: left;
            /*background: #fdead4;*/
          }
          >div{
            width: 65px;
            height: 65px;
            background: #ffe8da;
            float: left;
            position: relative;
            border-radius: 50%;
            img{
              width: 53px;
              @include center;
            }
            &.red-avatar{
              background: #ffb09c;
              img{
                width: 32px;
              }
            }
          }
          p{
            font-size: 28px;
            line-height: 65px;
            float: left;
            margin: 0 0 0 10px;
          }
          span{
            font-size: 30px;
            line-height: 65px;
            float: right;
            font-weight: bold;
          }
        }
      }
      .btn{
        top:687px;
      }
    }
  }

  .bg-center19{
    >div{
      @include center;
      color: #fff;
      .imgBg{
        width: 697px;
      }
      h3{
        font-size: 32px;
        line-height: 32px;
        width: 100%;
        position:absolute;
        left: 0;
        top:464px;
        text-align: center;
        color: #fff787;
      }
      h2{
        font-size: 60px;
        line-height: 60px;
        width: 100%;
        position:absolute;
        left: 0;
        top:522px;
        text-align: center;
        color: #fff787;
      }
      p{
        font-size: 24px;
        line-height: 32px;
        width: 100%;
        position:absolute;
        left: 0;
        top:614px;
        text-align: center;
      }
      .btn{
        top:721px;
      }
    }
  }

  .bg-center20{
    @include center;
    >div{
      .content{
        width: 640px;
        height: 860px;
        background: #fd673b;
        border-radius: 36px;
        padding: 0.1px;
        color: #fff;
        .imgBg{
          width: 474px;
          height: 337px;
          display: block;
          margin: 125px auto 95px auto;
        }
        h3{
          font-size: 34px;
          line-height: 34px;
        }
        p{
          font-size: 24px;
          line-height: 24px;
          margin: 30px 0 0 0;
        }
        .btn{
          top:721px;
        }
      }
    }}

  .bg-center30{
    >div{
      @include center;
      .imgBg{
        width: 640px;
        display: block;
      }
      h3{
        font-size: 168px;
        color:#de2f24;
        position: absolute;
        top:174px;
        line-height: 168px;
        width: 100%;
        text-align: center;
        >span{
          font-size: 80px;
        }
      }
      p{
        position: absolute;
        color: #e43f2a;
        font-size: 36px;
        width: 100%;
        text-align: center;
        line-height: 36px;
        top:361px;
      }
    }
  }

  .bg-center31{
    >div{
      @include center;
      .imgBg{
        width: 640px;
        display: block;
      }
      h3{
        width: 100%;
        text-align: center;
        font-size: 72px;
        line-height: 72px;
        color: #de2f24;
        @include centerX;
        top:123px;
      }
      p{
        width: 100%;
        text-align: center;
        font-size: 36px;
        line-height: 36px;
        color: #de2f24;
        @include centerX;
        top:211px;
      }
      .btn{
        width: 374px;
        height: 106px;
        background: url("./../assets/chunjie/press_bg.png");
        background-size: 100% 100%;
        @include centerX;
        top:339px;
        color: #e63024;
        font-size: 36px;
        line-height: 80px;
      }
    }
  }

  .hide-coupon {
    position: absolute;
    top: 580px;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .bg {
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.72);
    z-index: 999;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .close {
    width: 82px;
    height: 82px;
    margin: 40px 0 0 0;
  }

  .jo-index {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .jo-index .jo-index-div {
    width: 100%;
    height: 100%;
    background: $bgImgOrColor;
    background-size: 100% 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
  }

  .header {
    width: 100%;
    height: 12%;
    min-height: 140px;
    position: relative;
    z-index: 666;
  }

  .header > div {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 0 0 20px;
    height: 112px;
  }

  .header .head-portrait {
    width: 102px;
    height: 102px;
    background: #feccbc;
    border-radius: 50%;
    position: relative;
    margin: -10px 0 0 0;
  }

  .header .head-portrait p {
    position: absolute;
    left: -5px;
    bottom: -18px;
    text-align: center;
    background: url("./../assets/imgs/bg_id.png") no-repeat;
    background-size: 100% 100%;
    width: 112px;
    height: 35px;
    line-height: 40px;
    font-size: 18px;
    color: #a65a4e;
  }

  .header .head-portrait img {
    width: 98px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .header .header-main {
    width: 100%;
    padding: 0 22px 0 140px;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
  }

  .header .header-main h4 {
    font-size: 26px;
    color: $userNameColor;
    margin: 0 0 12px 0;
    line-height: 26px;
    height: 26px;
  }

  .header .header-main h4 span {
    float: right;
    font-size: 20px;
  }

  .header .header-main .game {
    height: 62px;
    padding: 0 22px;
    line-height: 62px;
    border-radius: 31px;
    background: $coinsBgColor;
    float: left;
    position: relative;
    text-align: center;
  }

  .header .header-main .game > div {
    min-width: 160px;
    height: 62px;
  }

  .header .header-main .game .coin-tip {
    width: 128px;
    height: 56px;
    position: absolute;
    right: -80px;
    top: 0;
    animation-duration: 2.5s;
  }

  .header .header-main .game i {
    font-size: 40px;
    color: #fe5f5b;
    font-weight: 500;
    text-align: center;
  }

  .header .header-main .game i.icon-jinbi {
    width: 32px;
    height: 36px;
    line-height: 66px;
    display: inline-block;
    background: $coinsImg;
    background-size: 100% 100%;
    font-size: 0;
  }

  .header .header-main .game span {
    font-size: 36px;
    color: $coinsColor;
    font-weight: 600;
    margin: 0 0 0 10px;
    line-height: 70px;
    position: relative;
  }

  .header .header-main .game .coin-animate {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 50px;
    color: #FDCC09;
    animation-duration: 2.5s;
    font-weight: bold;
  }

  .header .header-main .kefu {
    height: 62px;
    background: $coinsBgColor;
    position: absolute;
    right: 0;
    padding: 0 22px;
    border-radius: 15px 0 0 15px;
    pointer-events: auto;
  }

  .header .header-main .kefu > p {
    width: 100%;
    height: 100%;
    line-height: 62px;
  }

  .header .header-main .kefu p > img {
    width: 50px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .header .header-main .kefu > p > span {
    color: $coinsColor;
    font-size: 28px;
    height: 28px;
    line-height: 70px;
    margin: 0 0 0 55px;
  }

  .main {
    width: 100%;
    height: 46.6%;
    min-height: 548px;
    position: relative;
  }

  .main .guide {
    position: absolute;
    background: rgba(0, 0, 0, 0.72);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    .guideImg2 {
      width: 560px;
      position: absolute;
      right: 100px;
      top: 46%;
    }
  }

  .activitys {
    width: 100%;
    height: 15%;
    min-height: 175px;
    position: relative;
  }

  .main .centerout {
    background-size: 100% 100%;
    padding: 20px;
    width: 100%;
    position: absolute;
    @include center;
    > div {
      position: relative;
      z-index: 9999;
    }
  }

  .main .centerout .center {
    width: 100%;
    background: $mainCenterImgOrColor;
    padding: 80px 20px 0 20px;
    position: relative;
    border-radius: 16px;
    box-shadow: 2px 2px 10px rgba(206, 133, 74, 0.04), 0 0 18px rgba(206, 133, 74, 0.18), 0 0 24px rgba(206, 133, 74, 0.26);
  }

  .main .center .tbz {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding: 15px;
    pointer-events: none;
  }

  .main .center > h3 {
    width: 194px;
    height: 78px;
    font-size: 32px;
    color: $saomaColor;
    background: $saomaBg;
    line-height: 78px;
    position: absolute;
    border-radius: 0 16px 0 0;
    right: 0px;
    top: 0px;
    text-align: center;
  }

  .main .center > h3 > i {
    font-size: 30px;
  }

  .main .center .chunjiered {
    position: absolute;
    width: 95px;
    left: 47px;
    top: 38px;
  }
  .main .center .clickChunjiered{
    animation: swing 0.5s infinite linear;
    animation-direction:alternate;
  }

  @keyframes right {
    from {
      transform: translateX(-30px);
    }
    to{
      transform: translateX(0px);
    }
  }
  @keyframes left {
    from {
      transform: translateX(20px);
    }
    to{
      transform: translateX(-10px);
    }
  }
  .main .center .cloud {
    pointer-events: none;
    width: 418px;
    height: 144px;
    @include centerX;
    z-index: 7;
    top: 150px;
    .cloud-a {
      width: 64px;
      position: absolute;
      right: 0;
      bottom: 0;
      animation: right 1s infinite linear;
      animation-direction:alternate;
    }
    .cloud-b {
      width: 75px;
      position: absolute;
      left: 0;
      top: 92px;
      animation: left 1s infinite linear;
      animation-direction:alternate;
    }
    .cloud-c {
      width: 66px;
      position: absolute;
      right: 80px;
      top: 0;
      animation: right 1s infinite linear;
      animation-direction:alternate;
    }
  }

  .main .center .startgame {
    width: 358px;
    height: 361px;
    text-align: center;
    line-height: 306px;
    background: $startGameImg;
    background-size: 100% 100%;
    border: none;
    outline: none;
    /*font-size: 40px;*/
    font-size: 0;
    color: #fff;
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 6;
  }

  .mypluse {
    animation: heartBeat 1s linear infinite;
  }

  .main .center .hasclick {
    background: $startGameImg;
    background-size: 100% 100%;
  }

  .main .center .game-num {
    width: 418px;
    height: 91px;
    background: url("./../assets/chunjie/home_frame_jiajian.png");
    background-size: 100% 100%;
    // border: 1px solid $addAndReduceColor;
    border-radius: 18px;
    font-size: 24px;
    line-height: 91px;
    margin: -118px auto 0 auto;
    color: #7e7e7e;
    text-align: center;
    position: relative;
    z-index: 6;
    overflow: hidden;
  }

  .main .center .game-num.norecharge {
    border: 1px solid #afafaf;
    background: #fff;
  }

  .main .center .game-num i.active {
    color: #c8c8c8;
  }

  .main .center .game-num i {
    width: 20%;
    float: left;
    font-size: 50px;
    color: $addAndReduceColor;
    text-align: center;
    height: 71px;
    line-height: 71px;
    border-right: 1px solid $addAndReduceColor;
    margin: 10px 0;
  }

  .main .center .game-num i:last-of-type {
    border-right: none;
    border-left: 1px solid $addAndReduceColor;
    float: right;
  }

  .main .center .game-num > div {
    width: 60%;
    float: left;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .main .center .game-num > div h3 {
    font-size: 40px;
    color: $addAndReduceColor;
    font-weight: 600;
    line-height: 40px;
    margin: 0 0 8px 0;
  }

  .main .center .game-num > div p {
    font-size: 22px;
    color: $canPlayGameColor;
    line-height: 22px;
  }

  .main .center .tip {
    position: relative;
    height: 94px;
  }

  .main .center .tipbg {
    z-index: 7;
    background: #fff;
  }

  .main .center .tip > p {
    font-size: 24px;
    color: $tipColor;
    line-height: 64px;
    text-align: center;
  }

  .main .center .tip > p > span {
    font-weight: 600;
    color: black;
  }

  .footer {
    width: 100%;
    height: 26.4%;
    min-height: 305px;
    position: relative;
  }

  .jo-version2 .main {
    height: 43.5%;
  }

  .jo-version2 .activitys {
    height: 15.5%;
  }

  .jo-version2 .main .center .game-num {
    width: 430px;
    height: 96px;
    margin: -108px auto 0 auto;
  }

  .jo-version2 .main .center .tip > p {
    line-height: 72px;
  }

  .jo-version2 .main .centerout .center {
    padding: 90px 20px 0 20px;
  }

  .jo-version2 .header > div {
    top: 55%;
  }

  .jo-version2 .main .center .tip {
    height: 100px;
  }

  .jo-version2 .footer {
    height: 29%;
  }

  .jo-version2 .header .header-main h4 {
    font-size: 28px;
    line-height: 28px;
    height: 28px;
  }

  .jo-version2 .header .header-main h4 span {
    font-size: 22px;
  }
</style>
