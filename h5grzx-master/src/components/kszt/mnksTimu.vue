<template>
  <div class="main">
    <!--轮播题-->

    <div class="swipe_box">
      <van-swipe
        @change="onChange"
        :show-indicators="false"
        :loop="false"
        :initial-swipe="subjectIndex"
      >
        <van-swipe-item v-for="(item, index) in subjectList" :key="index" ref="container">
          <div class="topic_item">
            <div class="top">
              <span class="top_title">【{{ item.questionTypeName }}】</span>
              <div class="top_num">
                <span class="num_undone">
                  <span class="num_done">{{ index + 1 }}</span>
                  /{{ subjectListLenght }}
                </span>
              </div>
            </div>

            <div class="center">
              <span class="center_text">
                {{ index + 1 }}.&nbsp&nbsp&nbsp
                <span v-html="item.questionTitle"></span>
                
              </span>
            </div>
            <!-- 题目 -->
            <div class="reply" v-if="item.questionType.id !== 5">
              <div
                v-if="xuanTi.optionName !== '' && xuanTi.optionName !== undefined"
                class="tiBox"
                v-for="(xuanTi, tiIndex) in item.xuanze"
                :key="tiIndex"
                @click.stop="selectTopic(item, xuanTi, item.questionType.id)"
              >
                <div class="choiceImg">
                  <img
                    v-if="xuanTi.state === undefined && xuanTi.optionName !== '' && xuanTi.optionName !== undefined"
                    :src="xuanTi.img"
                    alt
                  />
                  <img v-if="xuanTi.state === true" :src="xuanTi.imgTrue" alt />
                  <img v-if="xuanTi.state === false" :src="xuanTi.imgFales" alt />
                </div>
                <div class="choiceTitle" v-html="xuanTi.optionName"></div>
              
              </div>
            </div>
            <div class="tlk_textarea"  v-if="item.questionType.id === 5">
              <el-input
                type="textarea"
                :rows="7"
                placeholder="请输入内容"
                v-model="item.mainDesc">
              </el-input>
            </div >
                 <!-- <div v-if="item.questionType.id === 5 && comeFrom.comeFrom === '答案'">
                   <span v-html="item.subAnswer"></span>
                </div> -->
            <!-- 参考答案 -->
            <div class="answer_box" v-if="item.questionType.id !== 5 && comeFrom.comeFrom === '答案'">
              <div class="wenziBox tlk_margin_top">
                <div class="tlk_fonts">参考答案</div>
                <div class="tlk_fonts">我的答案</div>
              </div>
              <div class="wenziBox">
                <div class="tlk_xuan tlk_green">{{item.obAnswer}}</div>
                <div class="tlk_xuan tlk_red">{{item.depositAnswer}}</div>
              </div>
            </div>
            <!-- 解析 -->
            <div
              class="analysis_box"
              v-if="comeFrom.comeFrom === '答案'"
            >
              <div class="analysis_img">
                <img src="../../img/kszt/kszt/msjx.png" alt />
              </div>
              <div class="tlk_analysis_font tlk_analysis_ma">参考解析</div>
              <div class="tlk_analysis_font tlk_jiexi_ma">
                <span v-html="item.analyzeWord"></span>
              </div>
            </div>
          </div>

        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import StartQuestion from "@/api/kszt/kszt";
import {
  Checkbox,
  CheckboxGroup,
  Swipe,
  SwipeItem,
  Overlay,
  Toast,
} from "vant";

export default {
  name: "dxtKsms", //多选题
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  data() {
    return {
      // radio: "1",
      current: 0, // 轮播值
      checked: true,
      subjectList: [],
      subjectListLenght: 0,
      dailyPracticeSetIsd: undefined,
      readList: [],
    };
  },
  props: {
    subcourseId: {
      type: String,
      default: "",
    },
    subjectIndex: {
      type: Number,
      default: 0,
    },
    selectedQuestionIdSetList: {
      type: Array,
      default: [],
    },
    questionIds: {
      type: String,
      default: "",
    },
    comeFrom: {
      type: Object,
      default: {},
    },
  },
  watch: {
    subcourseId(val) {
      //   console.log(val);
    },
    subjectIndex(val) {
        // console.log(val);
    },
    selectedQuestionIdSetList(val) {
      this.readList = val;
    },
    questionIds(val) {},
  },
  created() {
    this.mrylList(this.questionIds);
  },
  methods: {
    // 题目
    mrylList(val) {
      const params = {
        questionIds: val,
      };
      StartQuestion.getQuestionListByIds(params)
        .then((res) => {
          this.subjectList = [];
          if (res.data.V) {
            const data = res.data;
            this.subjectList = data.V;
            this.readList.push(this.subjectList[0].id); // 默认插入客户看的第一个题目id
            this.$parent.selectedQuestion(this.readList); // 每次执行一下把阅读的题目选存一波
            this.subjectList.forEach((e, index) => {
              e.xuanze = [];
              e.depositAnswerList = [];
              // console.log(e)
              if (
                e.questionType.id === 1 ||
                e.questionType.id === 2 ||
                e.questionType.id === 3 ||
                e.questionType.id === 4
              ) {
                e.xuanze.push(
                  {
                    optionName: this.charFilter(this.delHtmlTag(e.a)),
                    xuan: "A",
                    state: undefined,
                    img: require("../../img/kszt/dt/A_default.png"),
                    imgTrue: require("../../img/kszt/dt/A_true.png"),
                    imgFales: require("../../img/kszt/dt/A_false.png"),
                  },
                  {
                    optionName: this.charFilter(this.delHtmlTag(e.b)),
                    xuan: "B",
                    state: undefined,
                    img: require("../../img/kszt/dt/B_default.png"),
                    imgTrue: require("../../img/kszt/dt/B_true.png"),
                    imgFales: require("../../img/kszt/dt/B_false.png"),
                  },
                  {
                    optionName: this.charFilter(this.delHtmlTag(e.c)),
                    xuan: "C",
                    state: undefined,
                    img: require("../../img/kszt/dt/C_default.png"),
                    imgTrue: require("../../img/kszt/dt/C_true.png"),
                    imgFales: require("../../img/kszt/dt/C_false.png"),
                  },
                  {
                    optionName: this.charFilter(this.delHtmlTag(e.d)),
                    xuan: "D",
                    state: undefined,
                    img: require("../../img/kszt/dt/D_default.png"),
                    imgTrue: require("../../img/kszt/dt/D_true.png"),
                    imgFales: require("../../img/kszt/dt/D_false.png"),
                  },
                  {
                    optionName: this.charFilter(this.delHtmlTag(e.e)),
                    xuan: "E",
                    state: undefined,
                    img: require("../../img/kszt/dt/E_default.png"),
                    imgTrue: require("../../img/kszt/dt/E_true.png"),
                    imgFales: require("../../img/kszt/dt/E_false.png"),
                  },
                  {
                    optionName: this.charFilter(this.delHtmlTag(e.f)),
                    xuan: "F",
                    state: undefined,
                    img: require("../../img/kszt/dt/F_default.png"),
                    imgTrue: require("../../img/kszt/dt/F_true.png"),
                    imgFales: require("../../img/kszt/dt/F_false.png"),
                  },
                  {
                    optionName: this.charFilter(this.delHtmlTag(e.g)),
                    xuan: "G",
                    state: undefined,
                    img: require("../../img/kszt/dt/G_default.png"),
                    imgTrue: require("../../img/kszt/dt/G_true.png"),
                    imgFales: require("../../img/kszt/dt/G_false.png"),
                  }
                );
              }
            });
            this.subjectList.sort((a, b) => {
              return a.questionTypeId - b.questionTypeId;
            });
            this.subjectList.forEach((item, index) => {
              item.numberIndex = index + 1;
            });
            if (this.comeFrom.comeFrom === "答案") {
              this.subjectList.forEach((tiItem) => {
                this.comeFrom.choiceList.forEach((dep) => {
                  if (tiItem.questionType.id !== 5) {
                    if (Number(dep.didQuestionIdSet) === tiItem.id) {
                      tiItem.depositAnswer = dep.didAnswerSet;
                    }
                  } else {
                      if (Number(dep.didQuestionIdSet) === tiItem.id) {
                      tiItem.mainDesc = dep.didAnswerSet;
                    }
                  }
                });
                tiItem.xuanze.forEach((xuans) => {
                  if (tiItem.obAnswer.indexOf(xuans.xuan) !== -1) {
                    this.$set(xuans, "state", true);
                  }
                });
              });
            }
            this.subjectListLenght = this.subjectList.length;
            this.$emit("subjectListBy", this.subjectList);
          
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    delHtmlTag(str) {
      if (str !== undefined) {
        return str.replace(/<[^(>|img)]+>/g, "");
      }
    },
    charFilter(str) {
      if (str !== undefined) {
        let fileType = "";
        //非可见字符asc,多个就可以用数组
        const ascNum = [10];
        for (let i = 0; i < str.length; i++) {
          if (ascNum.every((n) => str.charCodeAt(i) != n)) {
            fileType += str.charAt(i);
          }
        }
        return fileType;
      }
    },
    selectTopic(val, tval, type) {
      if (this.comeFrom.comeFrom === "答案") {
        return;
      }
      if (type === 1) {
        // 单选
        var a = false;
        val.xuanze.forEach((e) => {
          if (e.state === false || e.state === true) {
            a = true;
          }
        });
        if (a === true) {
          return;
        }
        val.depositAnswer = tval.xuan;
        if (val.obAnswer === tval.xuan) {
          this.$set(tval, "state", true);
          this.$set(val, "answerCorrect", 2);
        } else {
          val.xuanze.forEach((e) => {
            if (e.xuan === val.obAnswer) {
              this.$set(e, "state", true);
            }
          });
          this.$set(tval, "state", false);
          this.$set(val, "answerCorrect", 4);
        }
      } else {
        // console.log(tval)
        // 多选
        let xuanLength = [];
        val.xuanze.forEach((items) => {
          if (items.optionName !== "") {
            xuanLength.push(items.optionName);
          }
        });
        val.depositAnswerList = Array.from(new Set(val.depositAnswerList));
        if (val.depositAnswerList.length === xuanLength.length) {
          return;
        }
        const daan = val.obAnswer.split(",");
        val.depositAnswerList.push(tval.xuan);
        val.depositAnswerList = Array.from(new Set(val.depositAnswerList));
        if (val.obAnswer.indexOf(tval.xuan) !== -1) {
          this.$set(tval, "state", true);
        } else {
          this.$set(tval, "state", false);
        }
        const result =
          daan.length === val.depositAnswerList.length &&
          daan.every((a) => val.depositAnswerList.some((b) => a === b)) &&
          val.depositAnswerList.every((_b) => daan.some((_a) => _a === _b));
        if (result === false) {
          this.$set(val, "answerCorrect", 4);
        } else {
          this.$set(val, "answerCorrect", 2);
        }
        val.depositAnswer = val.depositAnswerList.join(",");
        // console.log(val);
        this.$forceUpdate();
      }
      //   console.log(val)
    },
    // 切换题目
    onChange(index) {
      this.$parent.trackIndex(index); // 切换题目时将其index跟踪到答题卡上
      this.$nextTick(() => {
        // 把已经阅读的题目存起来
        this.readList.push(this.subjectList[this.subjectIndex].id);
        this.readList = Array.from(new Set(this.readList));
        this.$parent.selectedQuestion(this.readList);
      });
      this.current = index;
    },
  },
};
</script>

<style>
.center_text span {
  font-size: 14px !important;
}
.center_text p {
  display: inline;
  font-size: 14px !important;
}
.center_text p span {
  font-size: 14px !important;
}
.choiceTitle {
  font-size: 14px !important;
  margin-left: 9px;
}
.choiceTitle p {
  text-indent: 0px !important;
  line-height: 0 !important;
}
.choiceTitle span {
  text-indent: 0px !important;
  line-height: 0 !important;
  font-size: 14px !important;
}
.van-cell__value--alone .van-field__control {
  border: 1px solid #dedede;
}
.tlk_textarea{
  margin: 20px 0;
    /* border: 1px solid #dedede; */
}
.tlk_textarea textarea{
  resize: none;
}
</style>

<style  scoped>

.van-swipe-item {
  height: calc(100vh - 100px);
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
<style  scoped>
.body {
  width: 100vw;
}
/* 遮罩层 */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 100% auto;
}

/* 轮播题 */

/* 主体内容 */
.topic_item {
  margin: 24px 12px 10px 15px;
  display: flex;
  flex-direction: column;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top_title {
  font-size: 16px;
  line-height: 18px;
  color: #26292c;
}
.num_done {
  font-size: 14px;
  line-height: 18px;
  color: #fc554c;
}
.num_undone {
  font-size: 11px;
  color: #26292c;
}
.center {
  margin-top: 16px;
}
.center_text {
  font-size: 14px;
  line-height: 21px;
  color: #26292c;
}

.reply {
  margin: 8px 0 0 10px;
}
.tiBox {
  margin: 15.5px 0;
  display: flex;
  align-items: center;
}
.choiceImg img {
  width: 24px;
  height: 24px;
}

/* 答案 */
.answer_box {
  width: 345px;
  height: 56px;
  background-color: #ffffff;
  box-shadow: 0px 1px 5px 0px rgba(221, 221, 221, 0.69);
  border-radius: 5px;
  margin: 0 auto;
}
.answer_box {
  margin-top: 58px;
}
.wenziBox {
  text-align: center;
  display: flex;
  align-items: center;
}
.tlk_fonts {
  font-size: 12px;
  flex: 1;
}
.tlk_xuan {
  font-size: 18px;
  flex: 1;
}
.tlk_green {
  color: #15c29d;
}
.tlk_red {
  color: #e70012;
}
.tlk_margin_top {
  margin: 7px 0;
}
.analysis_box {
  width: 345px;
  min-height: 119px;
  background-color: #ffffff;
  box-shadow: 0px 1px 5px 0px rgba(221, 221, 221, 0.69);
  border-radius: 5px;
  margin-top: 24px;
}

.analysis_box .analysis_img img {
  margin-top: 18.5px;
  width: 63px;
  height: 16px;
}
.analysis_img {
  text-align: center;
}
.tlk_analysis_font {
  font-size: 12px;
}
.tlk_analysis_ma {
  margin: 19.5px 0 0 8px;
}
.tlk_jiexi_ma {
  margin: 8px 8px 17.5px 8px;
}
</style>
