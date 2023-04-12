<template>
  <div>
    <div class="max_box">
      <div class="dtk_main">
        <div class="dtk_top">
          <div class="main_dxxzt">
            <div class="top_title">单项选择题</div>
            <div class="xzt_box_classify">
              <div class="xzt_item_wrap" v-for="(dx, dxIndex) in dxList" :key="dxIndex">
                <div
                  ref="bgcolors"
                  @click="xuanz(dx)"
                  class="btn_xzt_item_default"
                >{{ dx.numberIndex }}</div>
              </div>
            </div>
          </div>

          <div class="main_dxxzt">
            <div class="top_title">多选题</div>
            <div class="xzt_box_classify">
              <div class="xzt_item_wrap" v-for="(duo, duoIndex) in duoxList" :key="duoIndex">
                <div
                  ref="bgcolors"
                  @click="xuanz(duo)"
                  class="btn_xzt_item_default"
                >{{ duo.numberIndex }}</div>
              </div>
            </div>
          </div>

          <div class="main_dxxzt">
            <div class="top_title">判断题</div>
            <div class="xzt_box_classify">
              <div class="xzt_item_wrap" v-for="(pd, pdIndex) in pdList" :key="pdIndex">
                <div
                  ref="bgcolors"
                  @click="xuanz(pd)"
                  class="btn_xzt_item_default"
                >{{ pd.numberIndex }}</div>
              </div>
            </div>
          </div>

          <div class="main_dxxzt">
            <div class="top_title">不定项选择题</div>
            <div class="xzt_box_classify">
              <div
                class="xzt_item_wrap"
                v-for="(budin, budinIndex) in budinxList"
                :key="budinIndex"
              >
                <div
                  ref="bgcolors"
                  @click="xuanz(budin)"
                  class="btn_xzt_item_default"
                >{{ budin.numberIndex }}</div>
              </div>
            </div>
          </div>

          <div class="main_dxxzt">
            <div class="top_title">简答题</div>
            <div class="xzt_box_classify">
              <div class="xzt_item_wrap" v-for="(jd, jdIndex) in jdtList" :key="jdIndex">
                <div
                  ref="bgcolors"
                  @click="xuanz(jd)"
                  class="btn_xzt_item_default"
                >{{ jd.numberIndex }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dtk_bottom">
        <div class="bottom_hint">
          <div class="hint_item">
            <div class="item_hue1"></div>
            <div>做对</div>
          </div>
          <div class="hint_item">
            <div class="item_hue2"></div>
            <div>做错</div>
          </div>
          <div class="hint_item">
            <div class="item_hue3"></div>
            <div>简答题已阅</div>
          </div>
          <div class="hint_item">
            <div class="item_hue4"></div>
            <div>未做</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dtk",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  props: {
    dataList: {
      type: Array,
      default: [],
    },
    // 判定是哪一个题目的下标
    subjectIndex: {
      type: Number,
      default: 0,
    },
    selectedQuestionIdSetList: {
      type: Array,
      default: [],
    },
  },
  watch: {
    dataList(val) {
      this.dtkList = val;
      this.dtkClassify(val);
    },
    subjectIndex(val) {
      for (var i = 0; i < this.$refs.bgcolors.length; i++) {
        if (val === i) {
          this.$refs.bgcolors[i].style.background = "#edeff2";
        } else if (
          this.dtkList[i].answerCorrect !== 2 &&
          this.dtkList[i].answerCorrect !== 4
        ) {
          this.$refs.bgcolors[i].style.background = "#fff";
        }
      }
    },
  },
  created() {
    this.dtkList = this.dataList;
    this.dtkClassify(this.dtkList);
  },
  data() {
    return {
      dtkList: [],
      dxList: [],
      duoxList: [],
      pdList: [],
      budinxList: [],
      jdtList: [],
    };
  },
  methods: {
    // 选择答题卡的事件
    xuanz(val) {
      this.selectedQuestionIdSetList.push(val.id);
      this.$parent.closeDtk(val, this.selectedQuestionIdSetList);
    },
    dtkClassify(val) {
      // console.log(val)
      this.dxList = [];
      this.duoxList = [];
      this.pdList = [];
      this.budinxList = [];
      this.jdtList = [];
      val.forEach((e, index) => {
        if (e.questionType.id === 1) {
          this.dxList.push(e);
        } else if (e.questionType.id === 2) {
          this.duoxList.push(e);
        } else if (e.questionType.id === 3) {
          this.pdList.push(e);
        } else if (e.questionType.id === 4) {
          this.budinxList.push(e);
        } else if (e.questionType.id === 5) {
          this.jdtList.push(e);
        }
      });
      this.$nextTick(function () {
        if (val[this.subjectIndex] !== undefined) {
          this.$refs.bgcolors[this.subjectIndex].style.background = "#edeff2";
          if (
            val[this.subjectIndex].questionType.id === 5 &&
            val[this.subjectIndex].mainDesc !== "" &&
            val[this.subjectIndex].mainDesc !== undefined
          ) {
            this.$refs.bgcolors[this.subjectIndex].style.background = "#edeff2";
          }
          val.forEach((item, i) => {
            if (item.answerCorrect === 2) {
              this.$refs.bgcolors[i].style.background = "#15c29d";
            } else if (item.answerCorrect === 4) {
              this.$refs.bgcolors[i].style.background = "#fc554c";
            }
          });
        }
      });
    },
  },
};
</script>

<style  scoped>
.max_box {
  display: none;
  /* background: skyblue; */
}
.dtk_main {
  width: 100vw;
  height: calc(100% - 47px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.dtk_top {
  height: 540px;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}

.dtk_bottom {
  height: 73px;
  display: flex;
  bottom: 0;
  flex-direction: column;
  border-top: solid 1px #dddddd;
  background-color: #ffffff;
}

.top_title {
  font-size: 14px;
  line-height: 18px;
  color: #26292c;
  padding: 24px 0 0 16px;
}
.xzt_box_classify {
  display: flex;
  flex-wrap: wrap;
  padding: 3% 0 0 4%;
}
.xzt_item_wrap {
  padding: 0 3% 3% 0;
}
.btn_xzt_item_default {
  width: 38px;
  height: 38px;
  line-height: 38px;
  border-radius: 19px;
  border: solid 1px #d2d4d4;
  text-align: center;
  color: #26292c;
  font-size: 16px;
}

.btn_xzt_item_true {
  width: 38px;
  height: 38px;
  background-color: #15c29d;
  border-radius: 19px;
}
.btn_xzt_item_false {
  width: 38px;
  height: 38px;
  background-color: #fc554c;
  border-radius: 19px;
}

.bottom_hint {
  height: 29px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.hint_item {
  display: flex;
  flex-direction: row;
}
.item_hue1 {
  width: 11px;
  height: 11px;
  background-color: #15c29d;
  border-radius: 2px;
  margin-right: 6px;
}
.item_hue2 {
  width: 11px;
  height: 11px;
  background-color: #fc554c;
  border-radius: 2px;
  margin-right: 6px;
}
.item_hue3 {
  width: 11px;
  height: 11px;
  background-color: #edeff2;
  border-radius: 2px;
  border: solid 1px #dddddd;
  margin-right: 6px;
}
.item_hue4 {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  border: solid 1px #dddddd;
  margin-right: 6px;
}
.btn_jq_wrap {
  height: 44px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn_jq_wrap:active {
  background: #ff6949;
}
.btn_jq {
  font-size: 14px;
  line-height: 18px;
  color: #ffffff;
}
</style>
