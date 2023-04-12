<template>
  <div>
    <Head></Head>
    <div class="main">
      <div class="tlk_top_bg">
        <div class="tlk_font">
          <div class="tlk_branch">{{ allscore }}</div>
          <div class="tlk_achievement">本科学习成绩(分)</div>
          <div class="tlk_introduce">本科达65分以上考试概率为99%</div>
        </div>
      </div>
      <div class="tlk_task">
        <!-- 练习 -->
        <div class="task_practice_unit">
          <div class="unit_title">练习任务</div>
          <div class="unit_connent" v-for="(item, index) in lxrw" :key="index">
            <div class="unit_timu">
              <div class="unit_timu_tit">
                {{ item.name }} ( <span>{{ item.didQuestionNum }}</span> / <span>{{ item.requireQuestionNum }}</span> )
              </div>
              <div class="unit_timu_correct">
                错题 <span>{{ item.wrongNum  }}</span> 权重 <span>{{ item.weight }}</span> 正确率 <span>{{ item.correctRate }}%</span>
              </div>
            </div>
            <div class="clheck_detail_btn" @click="IcSee(item)">查看详情</div>
          </div>
        </div>

        <!-- 考试 -->
        <div class="task_exam_unit">
          <div class="unit_title">考试任务</div>
          <div class="unit_connent">
            <div class="unit_timu">
              <div class="unit_timu_tit">
                {{ ksrw.name }}( <span>{{ ksrw.examCount }}</span> / <span> {{ ksrw.requireExamNum }}</span> )
              </div>
              <div class="unit_timu_correct">最后一次得分 <span>{{ ksrw.examScore }}</span></div>
            </div>
            <div class="clheck_detail_btn" @click="IcSee(ksrw)">查看详情</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Popup, Toast } from "vant";
import StartQuestion from "@/api/kszt/kszt";

export default {
  name: "ksjg",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  data() {
    return {
      data: [],
      subcourseId: 259,
      lxrw: [],
      ksrw: {},
      allscore: 0
    };
  },
  created () {
      this.subcourseId = this.$route.query.subcourseId;
      this.getReportSummary()
  },
  methods: {
    // 智能评估查看详情
    IcSee(val) {
      // console.log(val);
      if (val.examScore) {
         this.$router.push({ path: "/smart?subcourseId=" + val.id + '&doTypeId=3' + '&type=' + '智能评估详情考试任务' });
      } else {
         this.$router.push({ path: "/smart?subcourseId=" + this.subcourseId + '&chapterId=' + val.id + '&type=' + '智能评估详情练习任务' });
      }
    },
    // 智能评估数据
    getReportSummary() {
      this.lxrw = []
      const params = {
        subcourseId: this.subcourseId,
      };
      StartQuestion.getReportSummary(params)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.lxrw = data.V.chapters
            this.ksrw = data.V.paper
             this.allscore = ((data.V.paper.examScore) * 0.6 + (data.V.userColligationScore.chapterColligationScore) * 0.4).toFixed(1);
            // console.log( this.lxrw)
            // console.log(this.ksrw)
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    }
  },
};
</script>

<style  scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
}
.tlk_top_bg {
  width: 100%;
  height: 218px;
  background: url(../../img/kszt/kszt/znpgBg.png);
  background-size: 100% 100%;
}

.tlk_font {
  text-align: center;
  color: #ffffff;
}
.tlk_branch {
  font-size: 30px;
  line-height: 122px;
  padding-top: 30px;
}
.tlk_achievement {
  font-size: 14px;
}
.tlk_introduce {
  font-size: 12px;
  line-height: 40px;
}
.tlk_task {
  width: 100%;
  height: calc(100vh - 268px);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.task_practice_unit,
.task_exam_unit {
  width: 100%;
}
.unit_title {
  text-indent: 17px;
  font-size: 16px;
  line-height: 60px;
  font-weight: 600;
  color: #333333;
}
.unit_connent {
  width: calc(345px - 32px);
  /* height: calc(62px - 28px); */
  margin: 0 auto;
  background-color: #fffeff;
  box-shadow: 0px 0px 5px 0px #edeff2;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 14px 12px 14px 20px;
  margin-bottom: 12px;
}
.unit_timu {
  color: #26292c;
  font-size: 14px;
}
.unit_timu_correct {
  margin-top: 10px;
  font-size: 12px;
  color: #999999;
}
.clheck_detail_btn {
  width: 80px;
  height: 21px;
  border-radius: 10px;
  border: solid 1px #f89ea5;
  text-align: center;
  color: #e70012;
  font-size: 12px;
  line-height: 22px;
  margin-top: 10px;
}
</style>
