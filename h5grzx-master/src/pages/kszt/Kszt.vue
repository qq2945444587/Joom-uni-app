<template>
  <div>
    <Head></Head>
    <div class="main" v-if="bigBoxShow">
      <div class="top">
        <div class="top_head" @click="switchCourse">
          <span class="head_title">{{courseTitle}}</span>
          <div class="head_icon_div">
            <img class="head_icon" src="../../img/kszt/kszt/tlk_qiehuan.png" alt="添加" />
          </div>
        </div>

        <div class="top_eye">
          <div class="eye_size_ztjl" @click="ztjl">
            <!-- <div class="eye_text" v-if="ztjllLenght === 0">尚无记录哦</div>
            <div class="eye_text" v-else>当前已有{{ ztjllLenght }}个做题记录</div>-->
          </div>
          <div class="eye_size_ctb" @click="ctb">
            <div class="eye_text" v-if="ctLenght === 0">尚无记录哦</div>
            <div class="eye_text" v-else>当前已有{{ ctLenght }}个错题记录</div>
          </div>
          <div class="eye_size_wtjl" @click="stsc">
            <div class="eye_text" v-if="stscLenght === 0">尚无收藏哦</div>
            <div class="eye_text" v-else>当前已有{{ stscLenght }}收藏试题</div>
          </div>
        </div>
        <div class="top_nose">
          <div class="nose_item" @click="mryl">
            <div class="nose_item_img_box">
              <img src="../../img/kszt/kszt/item_mryl.png" class="nose_item_img" alt="每日一练" />
            </div>
            <div class="nose_item_text">每日一练</div>
          </div>
          <div class="nose_item" @click="mnks">
            <div class="nose_item_img_box">
              <img src="../../img/kszt/kszt/item_mnks.png" class="nose_item_img" alt="模拟考试" />
            </div>
            <div class="nose_item_text">模拟考试</div>
          </div>
          <div class="nose_item" @click="lnzt">
            <div class="nose_item_img_box">
              <img src="../../img/kszt/kszt/item_lnzt.png" class="nose_item_img" alt="历年真题" />
            </div>
            <div class="nose_item_text">历年真题</div>
          </div>
          <div class="nose_item" @click="znpg">
            <div class="nose_item_img_box">
              <img src="../../img/kszt/kszt/item_znpg.png" class="nose_item_img" alt="智能评估" />
            </div>
            <div class="nose_item_text">智能评估</div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="bottom_box">
          <div class="bottom_box_bg"></div>
          <div class="bottom_title">章节练习</div>
        </div>
        <div class="bottom_content" v-for="(item, index) in tableData" :key="index">
          <div class="bottom_content_single">
            <div class="bottom_content_single_top">
              <div class="bottom_content_single_icon_box">
                <img src="../../img/kszt/kszt/icon_title.png" class="bottom_content_single_icon" />
              </div>
              <div class="bottom_content_single_title">{{ item.name }}</div>
            </div>
            <div
              class="bottom_content_single_num"
            >{{ item.didQuestionIdsList }}/{{ item.questionIdTypesLenght }}</div>

            <div class="plan">
              <van-progress
                color="#fc554c"
                stroke-width="4"
                :show-pivot="false"
                :percentage="item.percentage"
              />
            </div>
            <div class="single_xxsc" @click="zjlxTo(item)">
              <div class="single_xxsc_text">继续上次</div>
              <div class="single_xxsc_icon">
                <van-icon name="arrow" color="#919090" />
              </div>
            </div>
          </div>
        </div>

        <van-empty description="暂无课程" v-if="tableData.length == 0">
          <!-- <van-button round class="bottom-button" @click="gotokczx"> 去购买 </van-button> -->
        </van-empty>
      </div>
    </div>
       <DialogXzkc :showVisible="showVisible" :switchList="switchList" :courseTitle="courseTitle"></DialogXzkc>
  </div>
</template>

<script>
import { Icon, Popup, Toast } from "vant";
import StartQuestion from "@/api/kszt/kszt";
import DialogXzkc from "@/components/kszt/xzkc"; // 选择课程组件
export default {
  name: "Kszt", //开始做题
  components: { DialogXzkc }, // 引入公共组件
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    if (localStorage.getItem("courseId")) {
      this.courseId = localStorage.getItem("courseId");
      this.courseTitle = localStorage.getItem("courseTitle");
    }
    this.SwitchCouList();
    this.chapterList();
    // this.recordList(); // 做题记录
    this.Collection(); // 试题收藏
    this.Wrongtopic(); // 错题本
  },
  data() {
    return {
      switchList: [],
      showVisible: false,
      bigBoxShow: true,
      courseTitle: "",
      courseId: "259",
      switchImg: [
        {
          id: 259,
          img: require("@/img/kszt/kszt/zhszye.png"),
        },
        {
          id: 260,
          img: require("@/img/kszt/kszt/bjzsye.png"),
        },
        {
          id: 12,
          img: require("@/img/kszt/kszt/zhszxxd.jpg"),
        },
        {
          id: 13,
          img: require("@/img/kszt/kszt/jyzbbxx.jpg"),
        },
        {
          id: 261,
          img: require("@/img/kszt/kszt/zhszzx.jpg"),
        },
        {
          id: 262,
          img: require("@/img/kszt/kszt/jyzs.png"),
        },
        {
          id: 1563,
          img: require("@/img/kszt/kszt/mszbb.png"),
        },
        {
          id: 5674,
          img: require("@/img/kszt/kszt/pthjjb.png"),
        },
        {
          id: 6110,
          img: require("@/img/kszt/kszt/czywdk.png"),
        },
        {
          id: 6111,
          img: require("@/img/kszt/kszt/czsxdk.png"),
        },
        {
          id: 6112,
          img: require("@/img/kszt/kszt/czywkc.png"),
        },
      ],
      zjlxList: [], // 章节练习list
      ztjllLenght: 0,
      stscLenght: 0,
      ctLenght: 0,
      tableData: [], // 章节练习写完的长度
    };
  },
  methods: {
    // 切换课程
    switchCourse() {
      this.showVisible = true;
      this.bigBoxShow = false;
    },
    // 选择的课程
    Iwantyou(val) {
      // console.log(val);
      this.showVisible = false;
      this.bigBoxShow = true;
      this.courseTitle = val.name;
      this.courseId = val.id;
      localStorage.setItem("courseId", this.courseId);
      localStorage.setItem("courseTitle", this.courseTitle);
      this.chapterList();
      // this.recordList() 做题记录
      this.Collection(); // 试题收藏
      this.Wrongtopic(); // 错题本
    },
    // 切换课程的数据
    SwitchCouList() {
      const params = {
        pid: 11,
      };
      StartQuestion.getKMByPidAndLevelNoLogin(params)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.switchList = data.V;
            this.switchList.forEach((e) => {
              this.switchImg.forEach((item) => {
                if (e.id === item.id) {
                  e.img = item.img;
                }
              });
            });
            if (localStorage.getItem("courseTitle")) {
              // this.courseId = localStorage.getItem('courseId')
              this.courseTitle = localStorage.getItem("courseTitle");
            } else {
              this.courseTitle = this.switchList[0].name;
            }

            // console.log( this.courseTitle)
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    // 章节练习数据
    chapterList() {
      const params = {
        subcourseId: this.courseId,
      };
      StartQuestion.getChapterQuestionIdTypes(params)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.zjlxList = data.V.chapters;
            this.zjlxList.forEach((e) => {
              e.questionIdTypesLenght = e.questionIdTypes.length;
              e.selected = [];
              e.shuffled = e.questionIdTypes.sort(() => 0.5 - Math.random());
              e.selected = e.shuffled.slice(0, 100);
            });
            this.zjlxList.forEach((value, index) => {
              this.zjlxList[index]["selected"] = value["selected"].sort(
                (last, next) => {
                  return last[1] - next[1];
                }
              );
            });
            this.wrongTopic(this.courseId, 1);
            // console.log(data)
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    // 章节练习已经做了多少个
    wrongTopic(subcourseId, doTypeId) {
      const params = {
        subcourseId: this.courseId,
        doTypeId: doTypeId,
      };
      var allTi;
      StartQuestion.getUserDidSummry(params)
        .then((res) => {
          if (res.data) {
            allTi = res.data.V.chapters;
            if (doTypeId === 1) {
              allTi.forEach((e) => {
                this.zjlxList.forEach((item) => {
                  if (e.id === item.id) {
                    if (e.didQuestionIds === undefined) {
                      item.didQuestionIdsList = 0;
                      item.state = "未完成";
                    } else {
                      if (
                        e.didQuestionIds.length <= item.questionIdTypes.length
                      ) {
                        item.didQuestionIdsList = e.didQuestionIds.length;
                      } else {
                        item.didQuestionIdsList = item.questionIdTypesLenght;
                      }
                      if (
                        e.didQuestionIds.length >= item.questionIdTypes.length
                      ) {
                        item.state = "已完成";
                      } else {
                        item.state = "未完成";
                      }
                    }
                    item.percentage =
                      (
                        item.didQuestionIdsList / item.questionIdTypesLenght
                      ).toFixed(2) * 1;

                    item.percentage = (item.percentage * 100).toFixed(0) * 1;
                  }
                });
              });
            } else {
              this.zjlxList = [];
            }
            this.tableData = this.zjlxList;
            // console.log( this.tableData)
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },

    // 做题记录
    // recordList() {
    //   const params = {
    //     doTypeId: 3,
    //     subcourseId: this.courseId,
    //   };
    //   const ztjlList = [];
    //   StartQuestion.getChapterPaperReportDetialJZ(params)
    //     .then((res) => {
    //       if (res.data.V) {
    //         const data = res.data.V;
    //         console.log(data);
    //         this.ztjllLenght = data.length;
    //       }
    //     })
    //     .catch((error) => {
    //       Toast.fail("请求失败");
    //     });
    // },
    // 试题收藏
    Collection() {
      const params = {
        courseId: 11,
      };
      const stscList = [];
      StartQuestion.getSubcourseCountJZ(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data.V;
            data.forEach((e) => {
              if (Number(this.courseId) === e.pid) {
                stscList.push(e);
              }
            });
            this.stscLenght = stscList.length;
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    // 错题数据
    Wrongtopic() {
      const params = {
        courseId: 11,
      };
      const ctList = [];
      StartQuestion.wrongReview(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data.V;
            data.forEach((e) => {
              if (Number(this.courseId) === e.pid) {
                //  用来判断当前错题数据是否和当前的this.courseId（选课ID）匹配，匹配的才能显示出来
                ctList.push(e);
              }
            });
            this.ctLenght = ctList.length;
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    // 跳转做题记录
    ztjl() {
      this.$router.push({ path: "/ztjl?subcourseId=" + this.courseId });
      //  this.$router.push({ name: "ztjl" });
    },
    // 跳转试题收藏
    stsc() {
      this.$router.push({ path: "/stsc?subcourseId=" + this.courseId });
    },
    // 跳转错题本
    ctb() {
      this.$router.push({ path: "/ctb?subcourseId=" + this.courseId });
    },
    // 每日一练
    mryl() {
      const data = {
        subcourseId: this.courseId,
        type: "每日一练",
      };
      this.$router.push({
        path: "/dxtKsms",
        query: { data: JSON.stringify(data) },
      });
    },
    // 章节练习
    zjlxTo(val) {
      const questionIdTypeList = [];
      val.selected.forEach((e, index) => {
        questionIdTypeList.push(e[0]);
      });
      const questionIdTypeString = questionIdTypeList.join(",");
      const data = {
        subcourseId: String(this.courseId),
        type: "章节练习",
        questionIds: questionIdTypeString,
        chapterId: val.id,
      };
      this.$router.push({
        path: "/dxtKsms",
        query: { data: JSON.stringify(data) },
      });
    },
    // 跳转模拟考试
    mnks() {
      const data = {
        subcourseId: this.courseId,
      };
      this.$router.push({ path: "/mnst?subcourseId=" + this.courseId });
    },
    // 跳转到历年真题
    lnzt() {
      this.$router.push({ path: "/lnzt?subcourseId=" + this.courseId });
    },
    // 跳转智能评估
    znpg() {
      this.$router.push({ path: "/znpg?subcourseId=" + this.courseId });
    },
  },
};
</script>


<style  scoped>
.van-popup--right {
  width: 50%;
  height: 100%;
  z-index: 2002;
}
.main {
  display: flex;
  flex-direction: column;
}
.top {
  display: flex;
  flex-direction: column;
}
.top_head {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 39px;
  border-bottom: 1px #dedede solid;
}
.head_title {
  font-size: 14px;
  color: #333333;
  /* margin-left: 18px; */
}
.head_icon_div {
  width: 10.5px;
  height: 10px;
  /* margin-right: 15px; */
}
.head_icon {
  width: 10.5px;
  height: 10px;
}
.top_eye {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 95px;
}
.eye_size_ztjl {
  width: 110px;
  height: 65px;
  background-image: url("../../img/kszt/kszt/top_bg_ztjl.png");
  background-size: cover;
  border-radius: 3px;
}
.eye_size_ctb {
  width: 110px;
  height: 65px;
  background-image: url("../../img/kszt/kszt/top_bg_ctb.png");
  background-size: cover;
  border-radius: 3px;
}
.eye_size_wtjl {
  width: 110px;
  height: 65px;
  background-image: url("../../img/kszt/kszt/top_bg_stsc.png");
  background-size: cover;
  border-radius: 3px;
}
.eye_text {
  font-size: 10px;
  color: #666666;
  margin: 36px 0 0 12px;
}
.top_nose {
  width: 351px;
  height: 80px;
  background-color: #ffffff;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 auto;
}
.nose_item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nose_item_img_box {
  width: 30px;
  height: 34px;
}
.nose_item_img {
  width: 100%;
}
.nose_item_text {
  width: 56px;
  height: 14px;
  font-size: 14px;
  color: #333333;
  margin-top: -6px;
}
.bottom_box {
  margin: 29px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.bottom_box_bg {
  width: 3px;
  height: 15px;
  margin-left: 12px;
  margin-right: 11px;
  background-color: #ff413b;
}
.bottom_title {
  font-size: 16px;
  color: #333333;
}

.bottom_content_single {
  width: 336px;
  height: 47px;
  margin: 24px 18px 24px 21px;
  position: relative;
}
.bottom_content_single_top {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.bottom_content_single_icon_box {
  width: 12px;
  height: 12px;
}
.bottom_content_single_icon {
  width: 100%;
}
.bottom_content_single_title {
  margin-left: 6px;
  font-size: 14px;
  color: #333333;
}
.bottom_content_single_num {
  font-size: 12px;
  color: #999999;
  margin: 16px 0 0 18px;
}
.plan {
  width: 289px;
  height: 2px;
  background-color: #dedede;
  border-radius: 0px 0px 1px 1px;
  margin: 5px 0 0 18px;
}
.skills {
  padding-right: 20px;
  border-radius: 0px 0px 1px 1px;
}
.html {
  width: 10%;
  height: 3px;
  background-color: #fc554c;
  border-radius: 0px 0px 1px 1px;
}
.single_xxsc {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  margin: 13px 0 0 259px;
}
.single_xxsc_text {
  font-size: 12px;
  color: #fc554c;
  width: 48px;
  height: 12px;
}
.single_xxsc_icon {
  width: 6px;
  height: 10px;
  margin-left: 25px;
  margin-top: 5px;
}
.bottom_fixd {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 34px;
  background-color: #ffffff;
}

.bottom-button {
  width: 120px;
  height: 30px;
  background-image: linear-gradient(90deg, #ff403a, #ff6949);
  color: white;
}
</style>
