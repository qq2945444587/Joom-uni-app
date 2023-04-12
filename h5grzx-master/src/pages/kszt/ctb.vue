<template>
  <div>
    <Head></Head>

    <van-empty description="暂无试题收藏" v-if="list.length == 0">
      <router-link to="/kszt">
        <van-button round class="bottom-button">返回做题栏目</van-button>
      </router-link>
    </van-empty>

    <div class="ctb_body">
      <div
        class="ctb_main"
        v-for="(item, index) in list"
        :key="index"
        :title="item"
      >
        <div class="left">
          <img src="../../img/kszt/ctb.png" alt class="ctb_img" />
        </div>

        <div class="contre">
          <div class="span_ctb_title">
            {{ item.name }}
            <br />
            <span class="span_ctb_time">错题：{{ item.wrongNum }}</span>
          </div>
        </div>

        <div class="btn_box">
          <div @click="chakan(item, 1)">
            <div class="btn_cz">重做</div>
          </div>
          <div @click="chakan(item, 2)">
            <div class="btn_cz">查看解析</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import StartQuestion from "@/api/kszt/kszt";

export default {
  name: "ctb", //错题本
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    this.subcourseId = this.$route.query.subcourseId;
    this.Wrongtopic();
  },
  data() {
    return {
      list: [],
      subcourseId: 259,
    };
  },
  methods: {
    // 试题收藏
    Wrongtopic() {
      this.datas = [];
      const params = {
        courseId: 11,
        subcourseId: this.subcourseId,
      };
      StartQuestion.wrongReview(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data.V;
            data.forEach((e) => {
              if (Number(this.subcourseId) === e.pid) {
                this.list.push(e);
              }
            });
            // console.log(this.list);
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    chakan(val, index) {
      var params;
      if (val.level) {
        params = {
          courseId: 11,
          subcourseId: val.pid,
          chapterId: val.id,
        };
      } else {
        params = {
          courseId: 11,
          subcourseId: val.pid,
          paperId: val.id,
        };
      }
      StartQuestion.getWrongReviews(params)
        .then((res) => {
          const datas = res.data;
          if (datas.V) {
            const questionIdTypeList = [];
            datas.V.forEach((e) => {
              questionIdTypeList.push(e.questionLibId);
            });
            const questionIdTypeString = questionIdTypeList.join(",");
            const data = {
              subcourseId: this.subcourseId,
              questionIds: questionIdTypeString,
              choiceList: [],
            };
            if (val.level) {
              data.chapterId = val.id;
              data.type = "章节练习";
              if (index === 2) {
                data.comeFrom = "答案";
              }
            } else {
              data.type = "模拟考试";
              data.paperId = val.id;
              if (index === 2) {
                data.comeFrom = "答案";
              }
            }
            // console.log(params);
            this.$router.push({
              path: "/dxtKsms",
              query: { data: JSON.stringify(data) },
            });
          }
        })
        .catch(() => {
            Toast({ message: "获取我的课程失败", position: "bottom" });
          
        });
    },
  },
};
</script>

<style  scoped>
.ctb_body {
  width: 93%;
  margin: 16px auto 0;
}
.ctb_main {
  width: 100%;
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
.ctb_img {
  width: 18px;
  height: 16px;
  margin: 13px 0 0 12px;
}
.contre {
  width: 67%;
}
.span_ctb_title {
  font-size: 14px;
  line-height: 18px;
  color: #333333;
  margin-top: 13px;
  margin-left: 13px;
}
.span_ctb_time {
  margin-top: 10px;
  font-size: 12px;
  line-height: 14px;
  color: #999999;
}
.btn_box {
  width: 40%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.btn_cz {
  border-radius: 10px;
  border: solid 1px #e27e86;
  color: #d44e59;
  background: white;
  font-size: 12px;
  line-height: 14px;
  padding: 3px 8px;
}

.bottom-button {
  width: 120px;
  height: 30px;
  background-image: linear-gradient(90deg, #ff403a, #ff6949);
  color: white;
}
</style>
