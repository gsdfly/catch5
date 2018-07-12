<template>
  <div class="task" :class="{'task-version2':version2}">
    <img src="./../assets/task/activity_bg.png" alt="" @click.prevent=""/>
    <ul>
      <li>
        <div>
          <img class="liImg1" src="./../assets/task/a.png" alt=""/>
        </div>
        <p>免费领币</p>
      </li>
      <li>
        <div>
        <img class="liImg2" src="./../assets/task/b_done.png" alt=""/>
        </div>
        <p>投币送币</p>
      </li>
      <li>
        <div>
          <img class="liImg3" src="./../assets/task/c_box.png" alt=""/>
        </div>
        <p>抓中送币</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name:'task',
    data(){
      return {

      }
    },

  }
</script>

<style lang="scss" scoped>
  .task{
    width: 100%;
    height: 100%;
    position: relative;
    img{
      width: 732px;
    }
    ul{
      width: 706px;
      position: absolute;
      height: 182px;
      left: 22px;
      top:31px;
      li{
        width: calc(100% / 3);
        height: 100%;
        float: left;
        >div{
          width: 144px;
          height: 117px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin: 14px auto 8px auto;
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
        }
      }
    }
  }
</style>
