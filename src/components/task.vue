<template>
  <div class="task" :class="{'task-version2':version2}">
    <img class="task-bg" src="./../assets/task/free.png" alt="" @click.prevent=""/>
    <img class="free-bg" src="./../assets/task/free_catch.png" alt="">
    <ul>
      <li @click="consumer" v-if="gzh_operation.id">
        <div>
          <div>
            <img class="liImg1" src="./../assets/task/a.png" alt=""/>
          </div>
          <p v-if="gzh_operation.coupon.status !== 2">免费领币</p>
          <p class="hasDown" v-else="">已领取</p>
        </div>
      </li>
      <li>
        <img v-if="task_game.task_count < task_game.num && task_now.game_bounty>=task_game.value" class="ling" src="./../assets/task/ling.png" alt="" @click="receiveTask(task_game)" />
       <div v-else="">
         <div>
           <img  v-if="task_game.task_count < task_game.num && task_now.game_bounty<task_game.value"  src="" alt="">
           <div>
             <span v-if="task_game.task_count < task_game.num && task_now.game_bounty<task_game.value" class="game-num"><b>{{task_now.game_bounty}}/</b>{{task_game.value}}</span>
           </div>
           <img v-if="task_game.task_count >= task_game.num" class="liImg2" src="./../assets/task/b_done.png" alt=""/>
         </div>
         <p v-if="task_game.task_count < task_game.num">投币送币</p>
         <p class="hasDown" v-else="">已领取</p>
       </div>
      </li>
      <li>
        <img v-if="task_wawa.task_count < task_wawa.num && task_now.prize_bounty>=task_wawa.value" class="ling" src="./../assets/task/ling.png" alt="" @click="receiveTask(task_wawa)"/>
        <div v-else="">
          <div>
            <img v-if="task_wawa.task_count < task_wawa.num && task_now.prize_bounty<task_wawa.value" class="liImg3" src="./../assets/task/c_box.png" alt=""/>
            <img v-if="task_wawa.task_count >= task_wawa.num"  src="./../assets/task/c_done.png" class="liImg3" alt="">
          </div>
          <p v-if="task_wawa.task_count < task_wawa.num">抓中送币</p>
          <p class="hasDown" v-else="">已领取</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import CONFIG from '../config'
  import {mapState} from 'vuex'
  export default {
    name:'task',
    data(){
      return {
        isRequest:false
      }
    },
    mounted(){
      this.$store.dispatch('getOperations').then(()=>{
        this.$store.dispatch('getActivityBountyInfo')
      })
    },
    computed: mapState({
      gzh_operation: state => state.user.gzh_operation,
      task_game: state => state.user.task_game,
      task_now:state => state.user.task_now,
      task_wawa:state => state.user.task_wawa,
    }),
    methods:{
      consumer(){
        if(CONFIG.isWx){
          this.$emit('openTip','free',this.gzh_operation.mp_url);
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
    }

  }
</script>

<style lang="scss" scoped>
  .task{
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 22px;
    .task-bg{
      width: 706px;
    }
    .free-bg{
      width: 333px;
      position: absolute;
      left: 0;
      top:-18px;
    }
    ul{
      width: 706px;
      position: absolute;
      height: 182px;
      left: 22px;
      bottom: 0;
      li{
        width: calc(100% / 3);
        height: 100%;
        float: left;
        position: relative;
        >div{
          width: 100%;
          height: 100%;
          >div{
            width: 144px;
            height: 117px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            margin: 14px auto 8px auto;
            position: relative;
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
              &.liImg1{
                width: 135px;
              }
              &.liImg2{
                width: 114px;
              }
              &.liImg3{
                width: 144px;
              }
            }
          }
          p{
            width: 130px;
            height: 32px;
            background-color: #fec47b;
            border-radius: 16px;
            font-size: 22px;
            line-height: 32px;
            color: #2e339b;
            text-align: center;
            margin: 0 auto;
            &.hasDown{
              background-color: #9a9a9a;
              color: #ffffff;
            }
          }
        }
        .ling{
          position: absolute;
          left: 50%;
          top:50%;
          transform: translate(-50%,-50%);
          width: 193px;
        }
      }
    }
  }
</style>
