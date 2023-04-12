<template>
  <div>
    <Head></Head>
    <van-empty description="暂无做题记录" v-if="datas.length == 0">
      <router-link to="/kszt">
        <van-button round class="bottom-button"> 返回做题栏目 </van-button>
      </router-link>
    </van-empty>
    <div class="body">
      <div
        class="main"
        v-for="(item, index) in datas"
        :key="index"
        :title="item"
      >
        <div class="left">
          <img src="../../img/kszt/ztjl.png" alt class="left_img" />
        </div>
        <div class="center">
          <div class="center_title">
            {{ item.reportTitle }}
            <br />
            <span class="center_time">{{ item.recordTime }}</span>
            <span class="center_time">用时 :{{ item.usedTime }}秒</span>
            <span class="center_time">错题: {{ item.wrongNum || 0 }}%</span>
            <span class="center_time"
              >正确率: {{ item.correctRate || 0 }}%</span
            >
          </div>
        </div>
        <div class="reset_btn_box" @click="redo(item, 1)">
          <div class="reset_btn">重做</div>
        </div>
        <div class="btn_box" @click="redo(item, 2)">
          <div class="right_btn">查看解析</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import StartQuestion from "@/api/kszt/kszt";
export default {
  name: "ztjl",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    // console.log(this.$route.query);
    this.subcourseId = this.$route.query.subcourseId;
    this.recordList();
  },
  data() {
    return {
      datas: [],
      subcourseId: 259,
    };
  },
  methods: {
    // 做题记录
    recordList() {
      const params = {
        doTypeId: 3,
        subcourseId: this.subcourseId,
      };
      StartQuestion.getChapterPaperReportDetialJZ(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            this.datas = data.V;
            // console.log(data)
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    // 重做/查看解析
    redo(val, index) {
      const params = {
        didRecordId: val.didRecordId,
      };
      StartQuestion.getRedoQuestionIdTypes(params)
        .then((res) => {
          if (res.data.V) {
            const datas = res.data;
            const questionIdTypeList = [];
            datas.V.questionIdTypes.forEach((e) => {
              questionIdTypeList.push(e[0]);
            });
            const data = {
              choiceList: [],
              reportName: datas.V.paper.paperName,
              subcourseId: String(this.subcourseId),
              type: "模拟考试",
              questionIds: questionIdTypeList.join(","),
              paperId: datas.V.paper.id,
              answerTime: datas.V.paper.answerTime || 100,
            };
            if (index === 2) {
              data.comeFrom = "答案";
            }
            // console.log(data);
            this.$router.push({
              path: "/dxtKsms",
              query: { data: JSON.stringify(data) },
            });
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
  },
};
</script>

<style  scoped>
.body {
  width: 93%;
  margin: 16px auto 0;
}
.main {
  width: 100%;
  display: block;
  margin-bottom: 12px;
  background-color: #fffeff;
  box-shadow: 0px 0px 5px 0px #edeff2;
  border-radius: 5px;
  padding: 0 0 14px 0;
  display: flex;
  display: -webkit-flex;
}
.left {
  width: 8%;
}
.left_img {
  width: 18px;
  height: 16px;
  margin: 13px 0 0 12px;
}
.center {
  width: 67%;
}
.center_title {
  font-size: 14px;
  line-height: 18px;
  color: #333333;
  margin-top: 13px;
  margin-left: 13px;
}
.center_time {
  font-size: 12px;
  line-height: 14px;
  color: #999999;
}
.reset_btn_box {
  width: 16%;
  margin: 0 5px;
  
}
.btn_box {
  width: 25%;
}
.reset_btn_box,
.btn_box {
  display: flex;
  flex-direction: row;
  
  align-items: center;
}
.right_btn {
  border-radius: 10px;
  border: solid 1px #e27e86;
  color: #d44e59;
  background: white;
  font-size: 12px;
  line-height: 14px;
  padding: 3px 7px;
  text-align: center;
}
.reset_btn {
  border-radius: 10px;
  border: solid 1px #e27e86;
  color: #d44e59;
  background: white;
  font-size: 12px;
  line-height: 14px;
  padding: 3px 7px;
  text-align: center;
}

.bottom-button {
  width: 120px;
  height: 30px;
  background-image: linear-gradient(90deg, #ff403a, #ff6949);
  color: white;
}
</style>
