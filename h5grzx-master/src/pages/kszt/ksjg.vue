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
        <div class="tlk_appImg">
          <img src="../../img/kszt/kszt/tlk_downAPP.png" alt="" />
        </div>
        <div class="tlk_APP_bootm">长按-保存-扫一扫-相册，下载教师伴</div>
      </div>
      <img
        class="tlk_xx"
        src="../../img/kszt/kszt/tlk_xxx.png"
        alt=""
        @click="mask = false"
      />
    </van-overlay>

    <div class="main">
      <div class="top"></div>
      <!-- <div class="center">
        <div class="center_left">
          <img src="../../img/kszt/znpg/ckct.png" alt class="center_left_img" style="margin-top: 150px" />
          <span class="c_l_span_title">查看错题</span>
          <span class="c_l_span_content">做错1题，未做99题</span>
        </div>
        <div class="center_right">
          <img src="../../img/kszt/znpg/cxks.png" alt class="center_right_img" />
          <span class="c_r_span_title">重新考试</span>
          <span class="c_r_span_content">成绩不满意？再战</span>
        </div>
      </div>-->
      <div style="margin-top: 137px">
        <div class="center" style="height: 60px">
          <div class="center_left" @click="lookAnswer(1)">
            <img
              src="../../img/kszt/znpg/ckct.png"
              alt
              class="center_left_img"
              style="margin-top: 10px"
            />
            <span class="c_l_span_title" style="margin-top: 0px">查看错题</span>
            <span class="c_l_span_content" style="margin-top: 24px"
              >做错{{ answerCorrectSetList.length }}题，未做{{
                Notdone
              }}题</span
            >
          </div>
          <div class="center_right" @click="lookAnswer(0, 2)">
            <img
              src="../../img/kszt/znpg/cxks.png"
              alt
              class="center_right_img"
              style="margin-top: 10px"
            />
            <span class="c_r_span_title" style="margin-top: 0px">重新考试</span>
            <span class="c_r_span_content" style="margin-top: 0px"
              >成绩不满意?再战</span
            >
          </div>
        </div>
        <div class="center" style="height: 60px">
          <div class="center_left" @click="mask = true">
            <img
              src="../../img/kszt/kszt/cuotinext.png"
              alt
              class="center_left_img"
              style="margin-top: 10px"
            />
            <span class="c_l_span_title" style="margin-top: 0px"
              >教师伴app</span
            >
            <span class="c_l_span_content" style="margin-top: 24px"
              >查看更多做题资料</span
            >
          </div>
          <div class="center_right">
            <img
              src="../../img/kszt/kszt/henbang.png"
              alt
              class="center_right_img"
              style="margin-top: 10px"
            />
            <span class="c_r_span_title" style="margin-top: 0px">敬请期待</span>
            <span class="c_r_span_content" style="margin-top: 0px"
              >敬请期待</span
            >
          </div>
        </div>
      </div>
      <div class="bg" style></div>
      <div class="bottom">
        <div class="bottom_title">专家建议</div>
        <div class="bottom_span" v-if="accuracy >= 60">
          你的正确率很高，你的正确率很高，目前你可以很轻松的拿下考
          试，去考吧，没问题的！ （练习越多评估建议约准确） （练习越
          多评估建议约准确）
        </div>
        <div class="bottom_span" v-else>
          你的正确率偏低想要通过考试，建议配合课程听老师分析讲解，再加强试题练习，从备考到冲刺快
          速锁分，备考更高效。
        </div>
      </div>
      <div class="modal">
        <div class="modal_top">
          <span class="zql_num">{{ accuracy }}</span>
          <span class="zql_bfb">%</span>
        </div>
        <span class="modal_top_zql">正确率</span>
        <span class="modal_top_time">{{ timers }}</span>
        <span class="modal_top_lx-time">练习时间</span>
        <span class="modal_top_cts-num">{{ answerCorrectSetList.length }}</span>
        <span class="modal_top_cts">错题数</span>
        <span class="modal_top_bcdts-num">{{ didAnswerSetLNumber }}</span>
        <span class="modal_top_bcdts">本次答题数</span>
        <button class="btn_ckda" @click="lookAnswer(0)">
          <span class="span_ckda">查看答案</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import StartQuestion from "@/api/kszt/kszt";
import { Toast, Dialog } from "vant";
export default {
  name: "ksjg",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    this.tyoeObj = JSON.parse(this.$route.query.data);
    this.getViewAnswerByReportId(this.tyoeObj.reportId);
  },
  data() {
    return {
      data: [],
      tyoeObj: {},
      list: [],
      answerCorrectSetList: [],
      didAnswerSetLNumber: 0,
      accuracy: 0, // 正确率
      correct: [], // 正确的个数
      timers: null,
      didQuestionIdSetList: [],
      Notdone: 0,
      mask: false,
    };
  },
  methods: {
    //  时间
    timecounts(usedTime) {
      var hour = 0,
        minute = 0,
        second = 0;
      // hour = Math.floor(usedTime / (60 * 60));
      minute = Math.floor(usedTime / 60) - hour * 60;
      second = Math.floor(usedTime) - hour * 60 * 60 - minute * 60;
      // if (hour <= 9) hour = "0" + hour;
      if (minute <= 9) minute = "0" + minute;
      if (second <= 9) second = "0" + second;
      this.timers = minute + ":" + second;
      // console.log(this.timers);
    },
    // 交卷结果数据
    getViewAnswerByReportId(reportId) {
      this.list = [];
      this.answerCorrectSetList = [];
      const params = {
        reportId: reportId,
      };
      StartQuestion.getViewAnswerByReportId(params)
        .then((res) => {
          if (res.data.V) {
            // console.log(res.data.V);
            const answerCorrectSetList = res.data.V.answerCorrectSet.split("|"); // 已做题目是否正确
            const didAnswerSetList = res.data.V.didAnswerSet.split("|"); // 已选题目是a还是b还是....
            this.didAnswerSetLNumber = didAnswerSetList.length;
            const didQuestionIdSetList = res.data.V.didQuestionIdSet.split(","); // 已做题目id
            this.Notdone = Number(
              this.tyoeObj.questionIds.split(",").length -
                didQuestionIdSetList.length
            ); // 还有多少未做题目
            answerCorrectSetList.forEach((e, index) => {
              if (e === "4") {
                this.answerCorrectSetList.push(e); // 所作的题目有多少个错的
              }
              if (e === "2" || e === "1") {
                this.correct.push(e); // 正确的数组
              }

              // 将题目先统一匹配
              this.list.push(
                Object.assign(
                  {},
                  {
                    answerCorrectSet: answerCorrectSetList[index],
                    didAnswerSet: didAnswerSetList[index],
                    didQuestionIdSet: didQuestionIdSetList[index],
                  }
                )
              );
            });
            this.didQuestionIdSetList = [];
            this.list.forEach((item) => {
              if (item.answerCorrectSet === "4") {
                this.didQuestionIdSetList.push(item.didQuestionIdSet);
              }
            });
            // console.log(this.didQuestionIdSetList);
            this.accuracy = (
              (this.correct.length / this.didAnswerSetLNumber) *
              100
            ).toFixed(0); // 正确率
            this.timecounts(res.data.V.usedTime);
            // this.timecounts(9600)
          }
        })
        .catch(() => {
          Toast.fail("获取交卷后数据失败");
        });
    },
    // 查看答案
    lookAnswer(val, con) {
      if (this.tyoeObj.type === "每日一练") {
        const obj = {
          comeFrom: con !== 2 ? "答案" : undefined,
          type: "每日一练",
          subcourseId: this.tyoeObj.subcourseId,
          choiceList: this.list,
        };
        if (this.answerCorrectSetList.length === 0 && val === 1) {
          Dialog.alert({
            message: "你很棒！没有错题哦",
            theme: "round-button",
          }).then(() => {
            // on close
          });
          return;
        }
        this.$router.push({
          path: "/dxtKsms",
          query: { data: JSON.stringify(obj) },
        });
      } else if (this.tyoeObj.type === "章节练习") {
        const obj = {
          comeFrom: con !== 2 ? "答案" : undefined,
          type: "章节练习",
          subcourseId: this.tyoeObj.subcourseId,
          choiceList: this.list,
          questionIds:
            val === 0
              ? this.tyoeObj.questionIds
              : this.didQuestionIdSetList.join(","),
          chapterId: this.tyoeObj.chapterId,
        };
        if (this.answerCorrectSetList.length === 0 && val === 1) {
          Dialog.alert({
            message: "你很棒！没有错题哦",
            theme: "round-button",
          }).then(() => {
            // on close
          });
          return;
        }
        this.$router.push({
          path: "/dxtKsms",
          query: { data: JSON.stringify(obj) },
        });
      } else if (this.tyoeObj.type === "模拟考试") {
        const obj = {
          comeFrom: con !== 2 ? "答案" : undefined,
          type: "模拟考试",
          subcourseId: this.tyoeObj.subcourseId,
          choiceList: this.list,
          questionIds:
            val === 0
              ? this.tyoeObj.questionIds
              : this.didQuestionIdSetList.join(","),
          paperId: this.tyoeObj.paperId,
          answerTime: this.tyoeObj.answerTime,
        };
        if (this.answerCorrectSetList.length === 0 && val === 1) {
          Dialog.alert({
            message: "你很棒！没有错题哦",
            theme: "round-button",
          }).then(() => {
            // on close
          });
          return;
        }
        this.$router.push({
          path: "/dxtKsms",
          query: { data: JSON.stringify(obj) },
        });
      }
    },
  },
};
</script>

<style  scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
}
.top {
  width: 100%;
  height: 172px;
  background-image: url("../../img/kszt/znpg/background.png");
  background-size: cover;
}
.center {
  height: 160px;
}
.center_left {
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
}
.center_left_img {
  width: 21px;
  opacity: 0.9;
  position: absolute;
  left: 0;
  margin: 110px 0 0 23px;
}
.c_l_span_title {
  position: absolute;
  left: 0;
  margin: 108px 0 0 58px;
  font-size: 14px;
  color: #333333;
}
.c_l_span_content {
  position: absolute;
  left: 0;
  margin: 129px 0 0 58px;
  font-size: 12px;
  color: #999999;
}

.center_right {
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
}
.center_right_img {
  width: 21px;
  opacity: 0.9;
  position: absolute;
  left: 0;
  margin: 110px 0 0 37.5px;
}
.c_r_span_title {
  opacity: 0.9;
  left: 0;
  margin: 110px 0 0 69.5px;
  font-size: 14px;
  color: #333333;
  display: block; /* 设置块状元素防止margin-top失效 */
}
.c_r_span_content {
  opacity: 0.9;
  position: absolute;
  left: 0;
  margin: 0px 0 0 69.5px;
  font-size: 12px;
  color: #999999;
}
.bg {
  width: 100%;
  height: 10px;
  background-color: #f4f5f9;
}
.bottom {
  width: 100%;
  height: 103px;
  position: absolute;
}
.bottom_title {
  padding: 16px 0 0 15px;
  font-size: 14px;
  color: #333333;
}
.bottom_span {
  font-size: 12px;
  color: #333333;
  padding: 16px 15px 0 15px;
  line-height: 24px;
}

.modal {
  width: 331px;
  height: 215px;
  background-color: #ffffff;
  box-shadow: 0px 2px 6px 0px #dddddd;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 0;
  margin: 40px 23px 0 22px;
}
.modal_top {
  text-align: center;
  width: 80px;
  height: 0.8rem;
  color: #333;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0 auto;
}
.modal_top {
  margin-top: 40px;
}
.zql_num {
  font-size: 40px;
  line-height: 15px;
  letter-spacing: -2px;
  color: #333333;
}
.zql_bfb {
  font-size: 15px;
  letter-spacing: -1px;
  color: #333333;
}
.modal_top_zql {
  display: block;
  position: absolute;
  left: 0px;
  right: 0;
  bottom: 0;
  top: 0;
  margin: 0 auto;
  text-align: center;
  width: 50px;
  height: 14px;
  font-size: 14px;
  line-height: 15px;
  letter-spacing: 1px;
  color: #333333;
}
.modal_top_zql {
  margin-top: 75px;
}
.modal_top_time {
  display: inline-block;
  position: absolute;
  left: 0px;
  margin: 115px 239px 88px 51px;
  width: 41px;
  height: 12px;
  font-size: 16px;
  line-height: 15px;
  color: #333333;
}
.modal_top_lx-time {
  display: inline-block;
  position: absolute;
  left: 0px;
  margin: 139px 237px 64px 49px;
  width: 45px;
  height: 12px;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -1px;
  color: #333333;
}
.modal_top_cts-num {
  display: inline-block;
  position: absolute;
  left: 0px;
  margin: 115px 164px 88px 159px;
  width: 8px;
  height: 12px;
  font-size: 16px;
  line-height: 15px;
  color: #333333;
}
.modal_top_cts {
  display: inline-block;
  position: absolute;
  left: 0px;
  margin: 139px 149px 64px 148px;
  width: 34px;
  height: 12px;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -1px;
  color: #333333;
}
.modal_top_bcdts-num {
  display: inline-block;
  position: absolute;
  left: 0px;
  margin: 115px 58px 88px 254px;
  width: 19px;
  height: 12px;
  font-size: 16px;
  line-height: 15px;
  color: #333333;
}
.modal_top_bcdts {
  display: inline-block;
  position: absolute;
  left: 0px;
  margin: 139px 38px 64px 236px;
  width: 57px;
  height: 12px;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -1px;
  color: #333333;
}
.btn_ckda {
  width: 211px;
  height: 28px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 13px;
  border: 0;
  position: absolute;
  left: 0px;
  margin: 172px 60px 15px 61px;
}
.span_ckda {
  display: inline-block;
  width: 50px;
  height: 12px;
  font-size: 12px;
  line-height: 15px;
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
