<template>
  <div>
    <Head></Head>
    <van-loading size="24px" class="loading" v-if="loading"
      >正在交卷...</van-loading
    >
    <van-loading size="24px" class="loading" v-if="loading2"
      >正在读取当前题目...</van-loading
    >
    <div>
      <!-- 答题卡 -->
      <dtk
        :dataList="subjectList"
        :subjectIndex="subjectIndex"
        :selectedQuestionIdSetList="selectedQuestionIdSetList"
      ></dtk>
      <!-- 遮罩 -->
      <div class="maskLayer">
        <van-overlay :show="showShade">
          <div class="wrapper" @click.stop>
            <div class="block">
              <img src="../../img/kszt/dxtKsms/left.png" alt />
            </div>
            <div class="block">
              <img src="../../img/kszt/dxtKsms/right.png" alt />
            </div>
            <div class="blockClone" @click="blockShow">
              <img src="../../img/kszt/dxtKsms/know.png" alt />
            </div>
          </div>
        </van-overlay>
      </div>

      <!-- 每日一练的模板 -->
      <mrylTimu
        v-if="tyoeObj.type === '每日一练'"
        :subcourseId="tyoeObj.subcourseId"
        @subjectListBy="subjectListBy"
        :subjectIndex="subjectIndex"
        :selectedQuestionIdSetList="selectedQuestionIdSetList"
        :comeFrom="tyoeObj"
      ></mrylTimu>

      <!-- 章节练习模板 -->
      <zjlxTimu
        v-if="tyoeObj.type === '章节练习'"
        :subcourseId="tyoeObj.subcourseId"
        @subjectListBy="subjectListBy"
        :subjectIndex="subjectIndex"
        :selectedQuestionIdSetList="selectedQuestionIdSetList"
        :questionIds="tyoeObj.questionIds"
        :comeFrom="tyoeObj"
      ></zjlxTimu>

      <!-- 模拟考试答题模板 -->
      <mnksTimu
        v-if="tyoeObj.type === '模拟考试'"
        :subcourseId="tyoeObj.subcourseId"
        @subjectListBy="subjectListBy"
        :subjectIndex="subjectIndex"
        :selectedQuestionIdSetList="selectedQuestionIdSetList"
        :questionIds="tyoeObj.questionIds"
        :comeFrom="tyoeObj"
      ></mnksTimu>

      <stscTimu
        v-if="tyoeObj.type === '试题收藏'"
        :subcourseId="tyoeObj.subcourseId"
        @subjectListBy="subjectListBy"
        :subjectIndex="subjectIndex"
        :selectedQuestionIdSetList="selectedQuestionIdSetList"
        :questionIds="tyoeObj.questionIds"
        :comeFrom="tyoeObj"
      ></stscTimu>

      <!-- 底部 -->
      <div class="bottom_box">
        <div class="bottom">
          <div class="bottom_item" @click="AnswerSheet">
            <div class="item_icon_1">
              <img
                src="../../img/kszt/dtk/dtk.png"
                alt="答题卡"
                class="icon_img"
              />
            </div>
            <span class="item_icon_span">答题卡</span>
          </div>
          <div
            class="bottom_item"
            v-if="
              this.tyoeObj.comeFrom !== '答案' &&
              this.tyoeObj.comeFrom !== '收藏'
            "
          >
            <div class="item_icon_2">
              <img
                src="../../img/kszt/dtk/time.png"
                alt="time"
                class="icon_img"
              />
            </div>

            <span class="item_icon_span">{{ timers }}</span>
          </div>
          <div
            class="bottom_item"
            v-if="
              this.tyoeObj.comeFrom !== '答案' &&
              this.tyoeObj.comeFrom !== '收藏'
            "
            @click="present"
          >
            <div class="item_icon_3">
              <img
                src="../../img/kszt/dtk/jj.png"
                alt="交卷"
                class="icon_img"
              />
            </div>
            <span class="item_icon_span">交卷</span>
          </div>
          <div
            class="bottom_item"
            @click="collection"
            v-if="
              this.tyoeObj.type !== '每日一练' &&
              this.tyoeObj.comeFrom !== '答案'
            "
          >
            <div class="item_icon_4" v-if="collTue.cool === false">
              <img src="../../img/kszt/kszt/tlk_sc.png" alt class="icon_img" />
            </div>
            <span v-if="collTue.cool === false" class="item_icon_span"
              >收藏</span
            >

            <div class="item_icon_4" v-if="collTue.cool === true">
              <img
                src="../../img/kszt/kszt/tlk_scRed.png"
                alt
                class="icon_img"
              />
            </div>
            <span v-if="collTue.cool === true" class="item_icon_span"
              >取消收藏</span
            >
          </div>
        </div>
      </div>
      <!-- 底部结束 -->
    </div>
  </div>
</template>

<script>
import StartQuestion from "@/api/kszt/kszt";
import mrylTimu from "@/components/kszt/mrylTimu"; // ，每日一练题目组件
import zjlxTimu from "@/components/kszt/zjlxTimu"; // 章节练习题目组件
import mnksTimu from "@/components/kszt/mnksTimu"; // 模拟考试题目组件
import stscTimu from "@/components/kszt/stscTimu"; // 模拟考试题目组件
import dtk from "@/components/kszt/dtk"; // 答题卡组件
import {
  Checkbox,
  CheckboxGroup,
  Swipe,
  SwipeItem,
  Overlay,
  Toast,
  Loading,
} from "vant";
// 由于答题后台的数据比较乱，以防以后更改bug和模板，答题分别分为多个组件进行答题
export default {
  name: "dxtKsms", //多选题
  components: { mrylTimu, dtk, zjlxTimu, mnksTimu, stscTimu }, // 引入公共组件
  filters: {}, //过滤器
  provide() {
    return {};
  },
  data() {
    return {
      gyh: false,
      loading: false,
      loading2: true,
      tyoeObj: undefined,
      showShade: false, //是否遮罩层
      showBegin: false, //遮罩提示图片

      dtkShow: false,
      bigBox: true,
      subjectList: [], // 题目内容
      subjectIndex: 0,
      timers: null,
      intDiff: 0,
      xuniTime: 0,
      questionIds: undefined,
      collectionList: [],
      collTue: {
        cool: undefined,
      },
      selectedQuestionIdSetList: [], //已阅读过的题目id
      dailyPracticeSetId: undefined, // 每日一练ID
    };
  },
  created() {
    this.tyoeObj = JSON.parse(this.$route.query.data);
    // console.log(this.tyoeObj);
    if (this.tyoeObj.answerTime || this.tyoeObj.answerTime !== undefined) {
      this.intDiff = this.tyoeObj.answerTime * 60;
      this.xuniTime = this.tyoeObj.answerTime * 60;
    }
    this.timecounts();
    this.showInit();
  },
  methods: {
    times() {
      // 判断时间是倒计时还是计时，当题型是考试的时候，全部获取当前时间倒计时
      const that = this;
      this.timecount = setInterval(() => {
        if (
          this.tyoeObj.type === "模拟考试" ||
          this.tyoeObj.type === "做题记录" ||
          this.tyoeObj.type === "智能评估模拟"
        ) {
          this.intDiff--;
          if (this.intDiff >= 0) {
            this.timecounts();
          } else {
            if (!this.tyoeObj.comeFrom) {
              window.clearInterval(this.timecount);
              this.present();
            }
          }
        } else {
          that.intDiff++;
          that.timecounts();
        }
      }, 1000);
    },
    // 做题计时器
    timecounts() {
      var hour = 0,
        minute = 0,
        second = 0;
      hour = Math.floor(this.intDiff / (60 * 60));
      minute = Math.floor(this.intDiff / 60) - hour * 60;
      second = Math.floor(this.intDiff) - hour * 60 * 60 - minute * 60;
      if (hour <= 9) hour = "0" + hour;
      if (minute <= 9) minute = "0" + minute;
      if (second <= 9) second = "0" + second;
      this.timers = hour + ":" + minute + ":" + second;
    },
    //遮罩点击事件
    blockShow() {
      this.showShade = false;
      sessionStorage.setItem('zzc', '这个东西没有必要再出现了')
      this.times();
    },
    // 遮罩是否出现
    showInit() {
      var data = sessionStorage.getItem("zzc");
      if (data !== "这个东西没有必要再出现了") {
        this.showShade = true;
        // this.showBegin = true;
      }
    },
    // 打开答题卡
    AnswerSheet() {
      this.gyh = !this.gyh;
      var max_box = document.querySelectorAll(".max_box")[0];
      var swipe_box = document.querySelectorAll(".swipe_box")[0];
      if (this.gyh) {
        max_box.style.display = "block";
        swipe_box.style.display = "none";
      } else {
        max_box.style.display = "none";
        swipe_box.style.display = "block";
      }
      // this.dtkShow = !this.dtkShow
    },
    //  选择了卡后关闭答题卡
    closeDtk(val, selectedQuest) {
      // console.log(val);
      this.selectedQuestionIdSetList = Array.from(new Set(selectedQuest));
      this.subjectIndex = val.numberIndex - 1; // 答题卡点击后获取的当前题目索引
      // this.dtkShow = false;
      // this.bigBox = true;
      var max_box = document.querySelectorAll(".max_box")[0]; //  答题卡的显示隐藏
      var swipe_box = document.querySelectorAll(".swipe_box")[0];
      max_box.style.display = "none";
      swipe_box.style.display = "block";
      this.gyh = false;
      // 显示题目就是否收藏
      const panduan = this.collectionList.findIndex(
        (item) => item.questionLibId === this.subjectList[this.subjectIndex].id
      );
      this.getUserCollectionsJZ(this.subjectList);
    },
    // 交卷
    present() {
      if (this.tyoeObj.type === "每日一练") {
        this.submitAppDailyPractice();
      } else if (this.tyoeObj.type === "章节练习") {
        this.chapterExercises();
      } else if (this.tyoeObj.type === "模拟考试") {
        this.mnksEx();
      }
    },
    // 试题有那些是收藏了的
    getUserCollectionsJZ(val) {
      this.collectionList = [];
      if (this.tyoeObj.type === "每日一练") {
        return;
      }
      var params;
      if (this.tyoeObj.chapterId) {
        params = {
          courseId: 11,
          subcourseId: this.tyoeObj.subcourseId,
          chapterId: this.tyoeObj.chapterId,
        };
      } else if (this.tyoeObj.paperId) {
        params = {
          courseId: 11,
          subcourseId: this.tyoeObj.subcourseId,
          paperId: this.tyoeObj.paperId,
        };
      }
      StartQuestion.getUserCollectionsJZ(params)
        .then((res) => {
          const data = res.data;
          // console.log(data);
          if (data.S === "2000") {
            this.collTue.cool = false;
          } else if (data.V) {
            // console.log(data.V);
            this.collectionList = data.V;
            const index = this.collectionList.findIndex(
              // 查询此题目id是否和收藏的东西匹配
              (item) => item.questionLibId === val[this.subjectIndex].id
            );
            if (index !== -1) {
              // 匹配了当前的收藏就显示
              this.collTue.cool = true;
            } else {
              this.collTue.cool = false;
            }
          }
        })
        .catch(() => {
          // console.log("");
        });
    },
    // 模拟考试交卷接口
    mnksEx() {
      const didAnswerSetList = []; // 所做题目选择的选项集合
      const answerCorrectSetList = []; //已做题目对错集合
      const didQuestionIdSetList = []; //已做题目id集合
      const examScoreList = []; // 总获得分数集合

      this.subjectList.forEach((e) => {
        if (e.answerCorrect === 2) {
          // 获取做对题目
          examScoreList.push(e.score);
        }
        if (e.depositAnswer) {
          answerCorrectSetList.push(e.answerCorrect);
          didAnswerSetList.push(e.depositAnswer);
          didQuestionIdSetList.push(e.id);
        }
        if (
          e.questionTypeId === 5 &&
          e.mainDesc !== "" &&
          e.mainDesc !== undefined
        ) {
          didQuestionIdSetList.push(e.id);
          answerCorrectSetList.push(1);
          didAnswerSetList.push(e.mainDesc);
        }
      });
      if (didQuestionIdSetList.length === 0) {
        Toast.fail("您还没有做试卷，请继续做题");
        return;
      }
      this.loading = true;
      const params = {
        didAnswerSet: didAnswerSetList.join("|"), // 所做题目选择的选项
        answerCorrectSet: answerCorrectSetList.join("|"), // 已做题目对错集合（0 未做 1已做 2 对 3半对 4 错误）
        selectedQuestionIdSet: this.selectedQuestionIdSetList.join(","), // 已阅读过的题目id
        subcourseId: this.tyoeObj.subcourseId, // 当前课程ID
        paperId: this.tyoeObj.paperId,
        didQuestionIdSet: didQuestionIdSetList.join(","), // 已做题目id
        doTypeId: 3,
        markQuestionIdSet: "",
        examScore: eval(examScoreList.join("+")) || 0, // 分数总和
        usedTime: Number(this.xuniTime - this.intDiff), // 用时多久
        isComplete: true, // 固定参数
        isAutoNext: 1, // 固定参数
      };
      StartQuestion.saveUserCurrentStateJz(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            const obj = {
              reportId: data.V.reportId,
              type: "模拟考试",
              paperId: this.tyoeObj.paperId,
              questionIds: this.tyoeObj.questionIds,
              subcourseId: this.tyoeObj.subcourseId,
              answerTime: this.tyoeObj.answerTime,
            };
            this.$router.push({
              path: "/ksjg",
              query: { data: JSON.stringify(obj) },
            });
            // this.$nextTick(() => {
            //   this.loading = false;
            // });
          }
        })
        .catch(() => {
          Toast.fail("交卷失败");
          this.loading = false;
        });
    },
    // 章节练习交卷触发接口
    chapterExercises() {
      const didAnswerSetList = []; // 所做题目选择的选项集合
      const answerCorrectSetList = []; //已做题目对错集合
      const didQuestionIdSetList = []; //已做题目id集合
      const examScoreList = []; // 总获得分数集合

      this.subjectList.forEach((e) => {
        if (e.answerCorrect === 2) {
          // 获取做对题目
          examScoreList.push(e.score);
        }
        if (e.depositAnswer) {
          answerCorrectSetList.push(e.answerCorrect);
          didAnswerSetList.push(e.depositAnswer);
          didQuestionIdSetList.push(e.id);
        }
        if (
          e.questionTypeId === 5 &&
          e.mainDesc !== "" &&
          e.mainDesc !== undefined
        ) {
          didQuestionIdSetList.push(e.id);
          answerCorrectSetList.push(1);
          didAnswerSetList.push(e.mainDesc);
        }
      });
      if (didQuestionIdSetList.length === 0) {
        Toast.fail("您还没有做试卷，请继续做题");
        return;
      }
      this.loading = true;
      const params = {
        didAnswerSet: didAnswerSetList.join("|"), // 所做题目选择的选项
        answerCorrectSet: answerCorrectSetList.join("|"), // 已做题目对错集合（0 未做 1已做 2 对 3半对 4 错误）
        selectedQuestionIdSet: this.selectedQuestionIdSetList.join(","), // 已阅读过的题目id
        subcourseId: this.tyoeObj.subcourseId, // 当前课程ID
        chapterId: this.tyoeObj.chapterId,
        didQuestionIdSet: didQuestionIdSetList.join(","), // 已做题目id
        doTypeId: 1,
        markQuestionIdSet: "",
        examScore: eval(examScoreList.join("+")) || 0, // 分数总和
        usedTime: this.intDiff, // 用时多久
        isComplete: true, // 固定参数
        isAutoNext: 1, // 固定参数
      };
      StartQuestion.saveUserCurrentStateJz(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            const obj = {
              reportId: data.V.reportId,
              type: "章节练习",
              chapterId: this.tyoeObj.chapterId,
              questionIds: this.tyoeObj.questionIds,
              subcourseId: this.tyoeObj.subcourseId,
            };
            this.$router.push({
              path: "/ksjg",
              query: { data: JSON.stringify(obj) },
            });
            // this.$nextTick(() => {
            //   this.loading = false;
            // });
          }
        })
        .catch(() => {
          Toast.fail("交卷失败");
          this.loading = false;
        });
    },
    // 每日一练交卷触发的接口
    submitAppDailyPractice() {
      const didAnswerSetList = []; // 所做题目选择的选项集合
      const answerCorrectSetList = []; //已做题目对错集合
      const didQuestionIdSetList = []; //已做题目id集合
      const examScoreList = []; // 总获得分数集合

      this.subjectList.forEach((e) => {
        if (e.answerCorrect === 2) {
          // 获取做对题目
          examScoreList.push(e.score);
        }
        if (e.depositAnswer) {
          answerCorrectSetList.push(e.answerCorrect);
          didAnswerSetList.push(e.depositAnswer);
          didQuestionIdSetList.push(e.id);
        }
        if (
          e.questionTypeId === 5 &&
          e.mainDesc !== "" &&
          e.mainDesc !== undefined
        ) {
          didQuestionIdSetList.push(e.id);
          answerCorrectSetList.push(1);
          didAnswerSetList.push(e.mainDesc);
        }
      });
      if (didQuestionIdSetList.length === 0) {
        Toast.fail("您还没有做试卷，请继续做题");
        return;
      }
      this.loading = true;
      const params = {
        didAnswerSet: didAnswerSetList.join("|"), // 所做题目选择的选项
        answerCorrectSet: answerCorrectSetList.join("|"), // 已做题目对错集合（0 未做 1已做 2 对 3半对 4 错误）
        selectedQuestionIdSet: this.selectedQuestionIdSetList.join(","), // 已阅读过的题目id
        subcourseId: this.tyoeObj.subcourseId, // 当前课程ID
        dailyPracticeSetId: this.dailyPracticeSetId, // 每日一练ID
        didQuestionIdSet: didQuestionIdSetList.join(","), // 已做题目id
        doTypeId: 1, //每日一练固定参数
        markQuestionIdSet: "",
        examScore: eval(examScoreList.join("+")) || 0, // 分数总和
        usedTime: this.intDiff, // 用时多久
        isComplete: true, // 固定参数
        isAutoNext: 1, // 固定参数
      };
      StartQuestion.submitAppDailyPractice(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            const obj = {
              reportId: data.V.reportId,
              type: "每日一练",
              questionIds: this.questionIds,
              subcourseId: this.tyoeObj.subcourseId,
            };
            this.$router.push({
              path: "/ksjg",
              query: { data: JSON.stringify(obj) },
            });
            // this.$nextTick(() => {
            //   this.loading = false;
            // });
          }
        })
        .catch(() => {
          Toast.fail("交卷失败");
          this.loading = false;
        });
    },
    // 点击收藏
    collection(val) {
      var params;
      if (this.tyoeObj.chapterId) {
        params = {
          courseId: 11,
          subcourseId: this.tyoeObj.subcourseId,
          chapterId: this.tyoeObj.chapterId,
          questionLibId: this.subjectList[this.subjectIndex].id,
        };
      } else if (this.tyoeObj.paperId) {
        params = {
          courseId: 11,
          subcourseId: this.tyoeObj.subcourseId,
          paperId: this.tyoeObj.paperId,
          questionLibId: this.subjectList[this.subjectIndex].id,
        };
      }
      StartQuestion.editUserCollection(params)
        .then((res) => {
          const data = res.data;
          this.getUserCollectionsJZ(this.subjectList);
          // if (data.V.state === 0) {
          //   this.$set(this.collTue, "cool", false);
          //   // this.collTue.cool = false
          // } else {
          //   this.$set(this.collTue, "cool", true);
          //   //  this.collTue.cool = true
          // }
        })
        .catch(() => {
          // console.log("");
        });
      this.$forceUpdate();
    },
    // 选择题目的数据传送
    subjectListBy(subjectList) {
      this.getUserCollectionsJZ(subjectList);
      this.subjectList = subjectList;
      this.$nextTick(() => {
        if (this.tyoeObj.comeFrom !== "答案" && sessionStorage.getItem('zzc')) {
          this.times();
        }
        this.loading2 = false;
      });
    },
    // 切换题目索引跟踪事件
    trackIndex(index) {
      this.subjectIndex = index;
      const panduan = this.collectionList.findIndex(
        (item) => item.questionLibId === this.subjectList[index].id
      );
      // console.log(this.collectionList);
      // console.log(this.subjectList[index].id);
      // console.log(panduan);
      this.getUserCollectionsJZ(this.subjectList);
      // if (panduan !== -1) {
      //   this.collTue.cool = true;
      // } else {
      //   this.collTue.cool = false;
      // }
    },
    // 从组件传过来的已阅读题目id，交卷必填字段id
    selectedQuestion(val) {
      this.selectedQuestionIdSetList = val;
    },
    // 交卷所需的每日一练ID
    dailyPract(dailyPracticeSetId, questionIds) {
      console.log(questionIds);
      if (this.tyoeObj.type === "每日一练") {
        this.dailyPracticeSetId = dailyPracticeSetId;
        this.questionIds = questionIds;
      }
    },
  },
};
</script>
<style  scoped>
.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.body {
  width: 100vw;
}
/* 遮罩层 */
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.block {
  width: 70vw;
}

.block img {
  width: 100%;
}
.blockClone {
  width: 30vw;
}
.blockClone img {
  width: 100%;
}

.bottom_box {
  position: fixed;
  bottom: 0;
  height: 50px;
}

.bottom {
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #ffffff;
  box-shadow: 0px -1px 6px 0px rgba(0, 0, 0, 0.05);
}
.bottom_item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item_icon_1 {
  width: 15px;
  height: 15px;
  padding-top: 8px;
  padding-bottom: 6px;
}
.item_icon_2 {
  width: 15px;
  height: 17px;
  padding-top: 7px;
  padding-bottom: 8px;
}
.item_icon_3 {
  width: 15px;
  height: 17px;
  padding-top: 7px;
  padding-bottom: 6px;
}
.item_icon_4 {
  width: 17px;
  height: 16px;
  padding-top: 8px;
  padding-bottom: 5px;
}
.icon_img {
  width: 100%;
}
.item_icon_span {
  font-size: 12px;
  color: #999999;
}
</style>

