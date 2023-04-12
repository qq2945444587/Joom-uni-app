<template>
  <div>
    <Head></Head>
    <!-- tit块 -->
    <div class="grzx_body">
      <div class="grzx_main">
        <div class="grzx_top">
          <div class="grzx_top_top">
            <div class="top_headpic_box">
              <img
                v-if="userInfo && userInfo.bigImageUrl != undefined"
                :src="'http://img.360xkw.com/' + userInfo.bigImageUrl"
                alt=""
              />

              <img
                v-else
                src="../../img/wdkc/grzx/headpic@2x.png"
                alt
                class="grzx_top_headpic"
                @click="gotoaccount"
              />
              <div class="grzx_login" v-if="!userInfo" @click="gotoLogin">
                点击登录/注册
              </div>
              <div class="grzx_login" v-else @click="gotoaccount">
                {{ userInfo.nickName }}
              </div>
            </div>
            <div class="fhsy_man_btn">
              <div>
                <img src="../../img/wdkc/grzx/man.png" class="img_man" alt />
              </div>
              <a href="/">
                <button class="btn_fhsy">
                  <span>返回首页</span>
                </button></a
              >
            </div>
          </div>
          <van-row class="van_row">
            <van-col span="12" class="van_col" @click="goStartListening">
              <div class="van_col_box">
                <img
                  src="../../img/wdkc/grzx/kstk@2x.png"
                  class="top_bottom_img"
                />
                <span class="top_bottom_span_title">开始听课</span>
                <span class="top_bottom_span_text">专业教师在线教学</span>
              </div>
            </van-col>
            <div class="border-right"></div>
            <van-col span="12" class="van_col">
              <a :href="selList2.zxzx||'#'"> <div class="van_col_box">
                <img
                  src="../../img/wdkc/grzx/zxzx@2x.png"
                  class="top_bottom_img"
                  alt
                />
                <span class="top_bottom_span_title">在线咨询</span>
                <span class="top_bottom_span_text">有问题？来找我</span>
              </div></a>
            </van-col>
          </van-row>
        </div>
        <div class="grzx_center">
          <van-cell is-link @click="kczxTo">
            <img src="../../img/wdkc/grzx/kczx@2x.png" alt class="cell_style" />
            <span class="cell_span">课程中心</span>
          </van-cell>
          <van-cell is-link @click="ksztTo">
            <img src="../../img/wdkc/grzx/kszt@2x.png" alt class="cell_style" />
            <span class="cell_span">开始做题</span>
          </van-cell>
          <van-cell is-link>
            <img src="../../img/wdkc/grzx/lntk@2x.png" alt class="cell_style" />
            <span class="cell_span">历年题库</span>
          </van-cell>
        </div>
        <div class="grzx_bottom">
          <div class="bottom_title">
            <div class="bottom_title_span">常用功能</div>
          </div>
          <div class="gonneng_items">
            <div class="col-car" @click="goShopingCar">
              <img src="../../img/wdkc/grzx/cat@2x.png" alt class="car_img" />
              <span class="car_title">购物车</span>
            </div>
            <div class="col-wdqb" @click="goWallet">
              <img src="../../img/wdkc/grzx/wdqb@2x.png" alt class="wdqb_img" />
              <span class="wdqb_title">我的钱包</span>
            </div>
            <div class="col-zhaq" @click="gotoaccount">
              <img src="../../img/wdkc/grzx/zhaq@2x.png" alt class="zhaq_img" />
              <span class="zhaq_title">账户安全</span>
            </div>
          </div>
        </div>
      </div>
      <div class="grzx_footer">
        <div class="footer_flex">
          <div class="footer_left" @click="gotoGZH">
            <img
              src="../../img/wdkc/grzx/icon_1@2x.png"
              alt
              class="footer_img"
            />
            <div class="footer_title">关注公众号</div>
          </div>
          <div class="footer_right" @click="goinWXQ">
            <img
              src="../../img/wdkc/grzx/icon_2@2x.png"
              alt
              class="footer_img"
            />
            <div class="footer_title">加入微信群</div>
          </div>
        </div>
      </div>
<!-- 公众号 -->
      <van-overlay :show="gzh">
        <div class="tlk_app">
          <div class="tlk_app_top">
            <div>
              <div>关注公众号</div>
              <div>更多题库资料等你来解锁</div>
            </div>
          </div>

          <div class="tlk_APP_font">公众号二维码</div>
          <div class="tlk_appImg">
            <img :src="selList2.gzh" alt="暂无图片" />
          </div>
          <div class="tlk_APP_bootm">长按-保存-扫一扫-相册,关注公众号</div>
        </div>
        <img
          class="tlk_xx"
          src="../../img/kszt/kszt/tlk_xxx.png"
          alt=""
          @click="mask"
        />
      </van-overlay>
<!-- 微信群 -->
   <van-overlay :show="wxq">
        <div class="tlk_app">
          <div class="tlk_app_top">
            <div>
              <div>加入微信群</div>
              <div>更多最新动态随时掌握</div>
            </div>
          </div>

          <div class="tlk_APP_font">微信群二维码</div>
          <div class="tlk_appImg">
            <img :src="selList2.wxq" alt="暂无图片" />
          </div>
          <div class="tlk_APP_bootm">长按-保存-扫一扫-相册,加入微信群</div>
        </div>
        <img
          class="tlk_xx"
          src="../../img/kszt/kszt/tlk_xxx.png"
          alt=""
          @click="mask1"
        />
      </van-overlay>


    </div>
  </div>
</template>
 <script type="text/javascript" src="http://res2.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
<script>
import { Col, Row } from "vant"; //引入
// import wx from "../../utils/weixin-js-sdk.js"
export default {
  name: "grzx",
  components: {},

  data() {
    return {
      userInfo: [],
      selList2: "",
      gzh: false,
      wxq: false,
    };
  },
  created() {},
  mounted() {
    // console.log(wx)
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.selList2 = JSON.parse(localStorage.getItem("selList"))
      ? JSON.parse(localStorage.getItem("selList"))
      : "";
  },
  methods: {
    // 关闭弹框
    mask() {
      this.gzh = !this.gzh;
    },
    mask1() {
      this.wxq = !this.wxq;
    },
    gotoGZH() {
      this.gzh = !this.gzh;
      // window.location.href =
      //   "weixin://dl/businessWebview/link/?appid=wx4b140bde9496f2b2&url=aHR0cHM6Ly9tcC53ZWl4aW4ucXEuY29tL3M/X19iaXo9TXpVMk9UY3hNVGsyTkE9PSZtaWQ9MjI0NzQ4NDg0MCZpZHg9MSZzbj1lMmE3YWI3OWZlNTFhZTFhNDhjOWE2ZGJmYmQ3NTVjMyZjaGtzbT1mY2ZiYzk5YmNiOGM0MDhkMmNiMGNlZjlmYWZjZTUyYTAxMzI5OTNiOGRhMDljYTMwNTM0MjU0ZDJjYjczMTRjNDNhMmU4NGNmNGIyJm1wc2hhcmU9MSZzY2VuZT0yMyZzcmNpZD0wMTEzUDNlb3J3b3ZtNlo4RHlhT3pTTmwmc2hhcmVyX3NoYXJldGltZT0xNjEwNTIyMzQ2MTUxJnNoYXJlcl9zaGFyZWlkPTk2OTNiYjI1NjZlY2ZhMzMyY2JmYTE5M2Q3MGEyYzUyI3Jk";
    },
    goinWXQ() {
      this.wxq = !this.wxq;
      // window.location.href = "weixin://dl/business";
    },

    // 去开始做题
    ksztTo() {
      this.$router.push("/kszt");
    },
    // 去开始听课
    goStartListening() {
      this.$router.push({ name: "kstk" });
    },
    // 去购物车
    goShopingCar() {
      this.$router.push({ name: "shopcat" });
    },
    kczxTo() {
      this.$router.push("/kczx");
    },
    // 去安全中心
    gotoaccount() {
      this.$router.push({ name: "accountSafe" });
    },
    // 去安全中心
    gotoLogin() {
      this.$router.push({ name: "login" });
    },
    // 去我的钱包
    goWallet() {
      this.$router.push({ name: "hongbao" });
    },
  },
};
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
body {
  background-color: #f5f5f5 !important;
}
.grzx_body {
  width: 100%;
  height: calc(100vh - 50px);
  overflow: hidden;
  background-color: #f5f5f5 !important;
}

.grzx_main {
  height: calc(100vh - 133px);
  overflow-x: hidden;
  overflow-y: scroll;
}
.box {
  height: 100vh;
  background: #f4f5f9;
}
.grzx_top {
  width: 100%;
  /* height: 166px; */
  background: white;
}
.grzx_top_top {
  position: relative;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 18px;
  display: flex;
  flex-direction: row;
}
.top_headpic_box {
  display: flex;
  width: 67%;
  flex-direction: row;
  align-items: center;
  margin-left: 19px;
  margin-top: 18px;
  overflow: hidden;
}
.top_headpic_box img {
  margin-right: 10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.grzx_top_headpic {
  width: 60px;
  height: 60px;
  margin-right: 12px;
}
.grzx_login {
  width: 60%;
  font-size: 16px;
  color: #2b2b2a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.van_row {
  width: 100%;

  position: relative;
}
.van_col {
  height: 100%;
}
.van_col_box {
  position: relative;
  padding-bottom: 20px;
}
.border-right {
  position: absolute;
  left: 50%;
  width: 1px;
  height: 34px;
  background-color: #eaeaea;
  top: 19px;
}
.top_bottom_img {
  width: 35px;
  height: 29px;
  margin-top: 24px;
  margin-left: 17px;
}
.top_bottom_span_title {
  font-size: 16px;
  color: #333333;
  position: absolute;
  left: 50%;
  margin-top: 17px;
  margin-left: -35px;
}
.top_bottom_span_text {
  font-size: 12px;
  color: #333333;
  position: absolute;
  left: 50%;
  margin-top: 40px;
  margin-left: -35px;
}
.grzx_center {
  width: 100vw;
  background: white;
  margin-top: 10px;
  display: inline-block;
}
.cell_style {
  width: 16px;
  height: 17px;
  vertical-align: middle;
}
.cell_span {
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
}

.grzx_bottom {
  width: 100%;
  /* height: 127px; */
  background: white;
  margin-top: 10px;
}
.bottom_title {
  width: 85%;
  padding: 0 16px;
  height: 42px;
  border-bottom: 1px solid #eaeaea;
  margin-left: 16px;
}
.bottom_title_span {
  font-size: 16px;
  color: #333333;
  line-height: 42px;
}
.gonneng_items {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}
.col-car,
.col-wdqb {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.col-wdqb {
  align-items: center;
}
.col-zhaq {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.col-car,
.col-wdqb,
.col-zhaq {
  width: 33%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.col-car:hover,
.col-wdqb:hover,
.col-zhaq:hover {
  animation: touchMOve 0.2s;
}
@keyframes touchMOve {
  0% {
    background: rgba(173, 173, 173, 0);
  }
  50% {
    background: rgba(173, 173, 173, 0.2);
  }
  100% {
    background: rgba(173, 173, 173, 0);
  }
}

.car_img {
  width: 30px;
  height: 28px;
}
.car_title {
  font-size: 14px;
  color: #333333;
  margin-top: 10px;
}
.wdqb_img {
  width: 30px;
  height: 28px;
}
.wdqb_title {
  font-size: 14px;
  color: #333333;
  margin-top: 9px;
}
.zhaq_img {
  width: 30px;
  height: 28px;
}
.zhaq_title {
  font-size: 14px;
  color: #333333;
  margin-top: 8px;
}

.grzx_footer {
  width: 100%;
  height: 70px;
  background: white;
  position: fixed;
  left: 0;
  bottom: 0;
}
.footer_flex {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.footer_left {
  text-align: center;
}
.footer_img {
  width: 24px;
  height: 24px;
}
.footer_right {
  text-align: center;
}
/* 返回首页 */
.fhsy_man_btn {
  position: relative;
  width: 100px;
  height: 57px;
  margin: 10px 18px 0 0;
}
.img_man {
  width: 38px;
  height: 27px;
  display: block;
  margin: 0 auto;
}

.btn_fhsy {
  margin-top: -4px;

  border: none;
  outline: none;
  width: 96px;
  height: 30px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 15px;
}

.btn_fhsy:hover {
  animation: touchup 0.2s;
}
@keyframes touchup {
  0% {
    background-image: linear-gradient(0deg, #ff403a, #ff6949);
  }
  50% {
    background-image: linear-gradient(0deg, #fc5852, #fd8d73);
  }
  100% {
    background-image: linear-gradient(0deg, #ff403a, #ff6949);
  }
}

.btn_fhsy span {
  font-size: 12px;
  color: #ffffff;
}
.tlk_app {
  background: url("../../img/kszt/kszt/tlk_appBaclk.png") no-repeat;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  margin: auto;
  width: 305px;
  height: 354px;
  background-size: 100% 100%;
}
.tlk_app_top {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  text-align: center;
  width: 305px;
  height: 87px;
  color: #ffffff;
  font-weight: 700;
}
.tlk_appImg {
  margin-top: 14px;
}
.tlk_appImg img {
  margin: 0 auto;
  display: block;
  width: 145.5px;
  height: 145px;
}
.tlk_APP_font {
  margin-top: 34.5px;
  color: #666666;
  font-size: 16px;
  text-align: center;
}
.tlk_APP_bootm {
  text-align: center;
  font-size: 12px;
  margin-top: 13px;
  color: #666666;
}
.tlk_xx {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 450px;
  margin: auto;
}
</style>
