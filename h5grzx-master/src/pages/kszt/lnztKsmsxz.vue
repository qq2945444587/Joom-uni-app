<template>
  <div>
    <Head></Head>
    <!-- 遮罩 -->
    <van-overlay :show="mask">
      <div class="tlk_app">
        <div class="tlk_app_top">
          <div>
            <div>扫码下载教师伴APP</div>
            <div>更多题库资料等你来解锁</div>
          </div>
        </div>

         <div class="tlk_APP_font">教师伴APP下载码</div>
         <div class="tlk_appImg"><img src="../../img/kszt/kszt/tlk_downAPP.png" alt=""></div>
         <div class="tlk_APP_bootm">长按-保存-扫一扫-相册，下载教师伴</div>
      </div>
      <img class="tlk_xx" src="../../img/kszt/kszt/tlk_xxx.png" alt="" @click="mask=false">
    </van-overlay>

    <div class="main">
      <div class="main_top">
        <span class="top_span">{{ data.paperName }}</span>
      </div>
      <div class="main_center">
        <div class="center_left">
          <span class="left_span-ksrs">
            考试人数：
            <span class="span_num">{{ data.didUserCount }}</span>人
          </span>
          <span class="left_span-hgrs">
            合格标准：
            <span class="span_num">{{ data.passingScore }}</span>分及格
          </span>
        </div>
        <div class="center_right">
          <span class="right_span-kssj">
            考试时间：
            <span class="span_num">{{ data.answerTime }}</span>分钟
          </span>
        </div>
      </div>
      <div class="main_bottom">
        <div class="bottom_left" @click="Jump(1)">
          <span>练习模式</span>
        </div>
        <div class="bottom_right" @click="Jump(2)">
          <span>模拟考试</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "lnztKsmsxz",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    this.tyoeObj = JSON.parse(this.$route.query.data);
    this.details(this.tyoeObj.data);
  },
  data() {
    return {
      data: {},
      tyoeObj: {},
      mask: false,
    };
  },
  methods: {
    details(val) {
      // console.log(val);
      this.data = val.paper;
      if (this.data.answerTime === null) {
        this.data.answerTime = 100;
      }
    },
    // 跳转到做题
    Jump(val) {
      // console.log(val);
      const questionIdTypeList = [];
      this.tyoeObj.data.questionIdTypes.forEach((e, index) => {
        questionIdTypeList.push(e[0]);
      });
      const questionIdTypeString = questionIdTypeList.join(",");
      if (val === 1) {
        const data = {
          reportName: this.tyoeObj.data.paper.paperName,
          subcourseId: String(this.tyoeObj.data.paper.subCourseId),
          type: "模拟考试",
          questionIds: questionIdTypeString,
          paperId: this.tyoeObj.data.paper.id,
          answerTime: this.data.answerTime,
        };
        this.$router.push({
          path: "/dxtKsms",
          query: { data: JSON.stringify(data) },
        });
      } else if (val === 2) {
        // console.log("我平时你爸爸");
        this.mask = true;
      }
    },
  },
};
</script>

<style  scoped>
.main {
  margin: 25px 18px 0 16px;
}
.main_top {
  text-align: center;
  height: 36px;
}
.top_span {
  width: 100%;
  height: 36px;
  font-size: 16px;
  line-height: 21px;
  color: #333333;
}
.main_center {
  height: 79px;
  margin-top: 26px;
  font-size: 14px;
  line-height: 18px;
  color: #999999;
  background-color: #ffffff;
  box-shadow: 0px 0px 4px 0px #dddddd;
  border-radius: 5px;
}
.center_left {
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
}
.span_num {
  font-size: 14px;
  line-height: 18px;
  color: #fc554c;
}
.left_span-ksrs {
  position: absolute;
  left: 0;
  margin: 20px 0px 0px 27px;
}
.left_span-hgrs {
  position: absolute;
  left: 0;
  margin: 50px 0px 0px 27px;
}
.center_right {
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
}
.right_span-kssj {
  position: absolute;
  left: 0;
  margin: 20px 0px 0px 19px;
}
.main_bottom {
  width: 100%;
  height: 37px;
  margin-top: 42px;
}
.bottom_left {
  width: 50%;
  height: 100%;
  background-color: #309099;
  border-radius: 19px 0px 0px 19px;
  float: left;
}
.bottom_left span {
  font-size: 14px;
  line-height: 18px;
  color: #ffffff;
  display: inline-block;
  position: absolute;
  left: 0;
  margin: 10px 0px 12px 70px;
}
.bottom_right {
  width: 50%;
  height: 100%;
  background-color: #ff5641;
  border-radius: 0px 19px 19px 0px;
  float: left;
  position: relative;
}
.bottom_right span {
  font-size: 14px;
  line-height: 18px;
  color: #ffffff;
  display: inline-block;
  position: absolute;
  left: 0;
  margin: 10px 0px 12px 58px;
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
.tlk_appImg{
  margin-top: 14px;
}
.tlk_appImg img{
  margin: 0 auto;
  display: block;
 width: 145.5px;
	height: 145px;
}
.tlk_APP_font{
  margin-top: 34.5px;
  color: #666666;
  font-size: 16px;
  text-align: center;
}
.tlk_APP_bootm{
  text-align: center;
  font-size: 12px;
  margin-top: 13px;
  color: #666666;
}
.tlk_xx{
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
