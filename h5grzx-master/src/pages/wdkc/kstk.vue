<template>
  <div>
    <Head></Head>
    <van-loading size="24px" class="loading" v-if="loading">加载中...</van-loading>
    <div v-else>
      <van-empty description="暂无课程" v-if="wdkcList.length == 0">
        <van-button round class="bottom-button" @click="gotokczx"> 去购买 </van-button>
      </van-empty>
      <div
        v-else
        class="crouse-item"
        v-for="(item, index) in wdkcList"
        :key="index"
        :data-config="item.config"
        @click="goPlayVideo(item.config)"
      >
        <div class="crouse-img">
          <img :src="'http://www.360xkw.com/' + item.bigPicUrl" alt />
        </div>

        <div class="crouse_right">
          <div class="crouse_title">
            <div>
              <img src="../../img/wdkc/kstk/icon_yh.png" alt class="icon-img_yh" />
            </div>

            <div class="crouse_name">{{ item.kcname }}</div>
          </div>
          <div class="crouse_score">
            <div>
              <van-rate
                v-model="score"
                class="score"
                size="16px"
                color="#ff403a"
                void-icon="star"
                void-color="#bfbfbf"
                readonly
              />
            </div>
            <div class="score_number">{{ score }}.0</div>
          </div>
          <!-- <div class="price">
          <span class="price_num">￥{{ item.price }}</span>
        </div> -->
          <!-- <van-button class="btn_st" @click="change">开始学习</van-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Wdkc from "@/api/Wdkc/wdkc";
import { Rate, Button, Loading } from "vant"; //引入Tab 标签页,Rate 评分

export default {
  name: "kstk",
  data() {
    return {
      userInfo: [],
      show: false,
      score: 5, //评分
      wdkcList: [],
      loading: true,
    };
  },
  methods: {
    goPlayVideo(value) {
      // console.log(value);
      // this.$router.push({ path: "tstkBf" });
      this.$router.push({ name: "kstkBf", query: { config: value } });
    },
    gotokczx() {
      this.$router.push({ name: "kczx" });
    },
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const params = {
      account: this.userInfo.account,
    };
    Wdkc.getMyCourse(params)
      .then((res) => {
        const data = res.data;
        if(data.S=='1'){
        this.wdkcList = data.V;
        this.loading = false;
        }else{
  this.wdkcList = [];
   this.loading = false;
        }
      
      })
      .catch(() => {
  Toast({ message: "获取我的课程失败", position: "bottom" });
      });
  },
  created() {},
};
</script>

<style scoped>
.loading {
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}

.bottom-button {
  width: 120px;
  height: 30px;
  background-image: linear-gradient(90deg, #ff403a, #ff6949);
  color: white;
}

.reload {
  height: calc(100vh - 50px);
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.crouse-item {
  width: calc(100% - 20px);
  padding: 10px;
  border-bottom: 2px solid #f9f2f2;
  display: flex;
  flex-direction: row;
}
/* .crouse-item:hover{
background: rgba(173, 173, 173, 0.1);
} */

.crouse-item:hover {
  animation: touchMOve 0.2s;
}
@keyframes touchMOve {
  0% {
    background: rgba(173, 173, 173, 0);
  }
  50% {
    background: rgba(173, 173, 173, 0.1);
  }
  100% {
    background: rgba(173, 173, 173, 0);
  }
}

.crouse-img {
  width: 116px;
  height: 86px;
}
.crouse-img img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.crouse_right {
  display: flex;
  width: calc(100% - 116px);
  flex-direction: column;
  /* flex: 1; */
  margin-left: 15px;
  /* justify-content: center; */
}
/* .crouse_title {
  width: 60%;
} */
.crouse_title,
.crouse_score {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
}
.icon-img_yh {
  width: 40px;
  height: 20px;
  background-color: #ff5040;
  border-radius: 10px 0px 10px 0px;
  margin-top: 11px;
}
/* 课程标题 */
.crouse_right .crouse_name {
  font-size: 16px;
  display: block;
  line-height: 15px;
  color: #333333;
  margin-top: 7px;
  margin-left: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* 评分 */
.score {
  margin-top: 25px;
}
.score_number {
  font-size: 16px;
  margin: 20px 0 0 20px;
  color: #999999;
}
/* 价格 */
.price {
  color: #ff413b;
  position: absolute;
  top: 50%;
  margin-top: 60px;
}
.price_num {
  font-size: 16px;
}
.btn_st {
  padding: 0 10px;
  height: 26px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 3px;
  font-size: 14px;
  color: #ffffff;
  position: absolute;
  left: 50px;
  margin-left: 100px;
  margin-top: 130px;
}
</style>
