<template>
  <div>
    <Head></Head>
    <van-loading size="24px" class="loading" v-if="loading2">加载中...</van-loading>

    <div class="lnzt_body" v-else>
      <div class="lnzt_main" v-for="(item,index) in list" :key="index" >
        <div class="lnzt_main_left">
          <img src="../../img/kszt/lnzt.png" alt class="left_img" />
        </div>
        <div class="center">
          <div class="span_ctb_title">{{item.paper.paperName}}</div>
        </div>

        <div class="btn_box" v-if="item.paper.state === 4"  @click="NowExam(item)">
          <div class="btn_cz">免费测试</div>
        </div>

        <div
          class="btn_box"
          @click="buyNow"
          v-if="!item.paper.PurchaseStatus && item.paper.state !== 4"
        >
          <div class="btn_cz1">立即购买</div>
        </div>

        <div class="btn_box" v-if="item.paper.PurchaseStatus === 1"  @click="NowExam(item)">
          <div class="btn_cz">开始测试</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Popup, Toast, Loading, Dialog } from "vant";
import StartQuestion from "@/api/kszt/kszt";

export default {
  name: "lnzt",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    this.subcourseId = this.$route.query.subcourseId;
    this.realTitle();
  },
  data() {
    return {
      list: [],
      subcourseId: 259,
      loading2: true,
    };
  },
  methods: {
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
    NowExam(val) {
       const obj = {
         data: val
      };
      this.$router.push({
        path: "/lnztKsmsxz",
        query: { data: JSON.stringify(obj) },
      });
    },
    // 历年真题数据
    realTitle() {
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));
      var purchasedCoursesIndex = null;
      var jurisdiction = null;
      var purchasedCourses = userInfo.orderDetial.config.split("|");
      this.loading2 = true;
      const params = {
        PaperTypeId: 4,
        subcourseId: this.subcourseId,
      };
      StartQuestion.getPaperQuestionIdTypes(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            this.list = data.V.papers;
            this.list.sort((a, b) => {
              return b.paper.state - a.paper.state;
            });
            //  获取此用户所对应的课程，下面用来判断模拟卷是否要付钱
            purchasedCoursesIndex = purchasedCourses.findIndex(
              (item) => Number(item.split(",")[0]) === data.V.subcourse.id
            );
            this.list.forEach((value, index) => {
              // 排序，免费的在最上面
              this.list[index]["questionIdTypes"] = value[
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
            this.list.forEach((mn) => {
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
  },
};
</script>

<style  scoped>
.lnzt_body {
  width: 93%;
  margin: 16px auto 0;
}
.lnzt_main {
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
.lnzt_main_left {
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
.span_ctb_title {
  font-size: 14px;
  line-height: 18px;
  color: #333333;
  margin-top: 13px;
  margin-left: 13px;
}
.span_ctb_time {
  font-size: 12px;
  line-height: 14px;
  color: #999999;
}
.btn_box{
margin: 20px 0 0 10px;
  
}
.btn_cz {

  border-radius: 10px;
  border: solid 1px #e27e86;
  color: #d44e59;
  background: white;
  font-size: 12px;
  line-height: 14px;
  padding: 3px 7px;
}
.btn_cz1 {

  border-radius: 10px;
  border: solid 1px #333;
  color: #333;
  background: white;
  font-size: 12px;
  line-height: 14px;
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
