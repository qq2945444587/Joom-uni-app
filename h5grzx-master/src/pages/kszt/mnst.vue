<template>
  <div>
    <Head></Head>

    <van-loading size="24px" class="loading" v-if="loading2"
      >加载中...</van-loading
    >

    <div class="main" v-else>
      <div class="single" v-for="(item, index) in datas" :key="index">
        <div class="left">
          <img src="../../img/kszt/mnst.png" alt class="left_img" />
        </div>

        <div class="center">
          <div class="center_title">{{ item.paper.paperName }}</div>
        </div>
        <div class="right" v-if="item.paper.state === 4" @click="NowExam(item)">
          <button class="right_btn">免费考试</button>
        </div>

        <div
          class="right"
          @click="buyNow"
          v-if="!item.paper.PurchaseStatus && item.paper.state !== 4"
        >
          <button class="right_btn1">立即购买</button>
        </div>

        <div
          class="right"
          v-if="item.paper.PurchaseStatus === 1"
          @click="NowExam(item)"
        >
          <button class="right_btn">开始考试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Popup, Toast, Loading, Dialog } from "vant";
import StartQuestion from "@/api/kszt/kszt";

export default {
  name: "mnst",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  data() {
    return {
      datas: [],
      loading2: true,
      subcourseId: 259,
    };
  },
  created() {
    this.subcourseId = this.$route.query.subcourseId;
    this.getPaperQuestionIdTypes();
  },
  methods: {
    getPaperQuestionIdTypes() {
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));
      var purchasedCoursesIndex = null;
      var jurisdiction = null;
      var purchasedCourses = userInfo.orderDetial.config.split("|");
      this.loading2 = true;
      const params = {
        materiaProper: 1,
        subcourseId: this.subcourseId,
      };
      StartQuestion.getPaperQuestionIdTypes(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            this.datas = data.V.papers;
            this.datas.sort((a, b) => {
              return b.paper.state - a.paper.state;
            });
            //  获取此用户所对应的课程，下面用来判断模拟卷是否要付钱
            purchasedCoursesIndex = purchasedCourses.findIndex(
              (item) => Number(item.split(",")[0]) === data.V.subcourse.id
            );
            this.datas.forEach((value, index) => {
              // 排序，免费的在最上面
              this.datas[index]["questionIdTypes"] = value[
                "questionIdTypes"
              ].sort((last, next) => {
                return last[1] - next[1];
              });
            });
            if (purchasedCoursesIndex !== -1) {
              jurisdiction = purchasedCourses[purchasedCoursesIndex].split(
                ","
              )[1];
            }
            this.datas.forEach((mn) => {
              if (purchasedCoursesIndex !== -1) {
                if (
                  jurisdiction.indexOf(mn.paper.materiaProper) > -1 &&
                  mn.paper.state !== 4
                ) {
                  mn.paper.PurchaseStatus = 1;
                }
              }
            });
            this.loading2 = false;
            // console.log( this.datas)
          }
        })
        .catch((error) => {
          // console.log("错误");
          this.loading2 = false;
        });
    },
    NowExam(val) {
      const obj = {
        data: val,
      };
      this.$router.push({
        path: "/lnztKsmsxz",
        query: { data: JSON.stringify(obj) },
      });
    },
    // 现在就去买
    buyNow() {
      Dialog.confirm({
        title: "提示",
        message: "此课程未购买，无法模拟考试,是否前去购买",
        theme: "round-button",
      })
        .then(() => {
          this.$router.push("/kczx");
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style  scoped>
.main {
  width: 100vw;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
}
.single {
  width: 345px;
  background-color: #fffeff;
  box-shadow: 0px 0px 5px 0px #edeff2;
  border-radius: 5px;
  margin: 0 15px 12px 16px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: 4px;
}
.left {
  width: 43px;
}
.left_img {
  width: 17px;
  margin: 25px 0 23px 14px;
}
.center {
  width: 213px;
}
.center_title {
  font-size: 14px;
  line-height: 18px;
  color: #333333;
  margin: 25px 0 0 0;
}

.right_btn {
  /* width: 56px; */
  border-radius: 10px;
  border: solid 1px #db737b;
  color: #e70012;
  background: white;
   margin: 25px 13px 0 16px;
  padding: 3px 7px;
}
.right_btn1 {
  border-radius: 10px;
  border: solid 1px#333;
  color: #333;
  background: white;
  margin: 25px 13px 0 16px;
  padding: 3px 7px;
}

.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
