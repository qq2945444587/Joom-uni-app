<template>
  <div>
    <Head></Head>

    <van-empty description="暂无试题收藏" v-if="datas.length == 0">
      <router-link to="/kszt">
        <van-button round class="bottom-button">返回做题栏目</van-button>
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
          <img src="../../img/kszt/stsc.png" alt class="left_img" />
        </div>

        <div class="center">
          <div class="center_title">
            {{ item.name }}
            <br />
            <span class="center_timu">共{{ item.collectNum }}题</span>
          </div>
        </div>
        <div class="btn_box" @click="chakan(item)">
          <button class="right_btn">查看收藏</button>
        </div>
      </div>
      <div class="bottom_fixd"></div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import StartQuestion from "@/api/kszt/kszt";

export default {
  name: "stsc",
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  data() {
    return {
      datas: [],
      subcourseId: 259,
    };
  },
  created() {
    this.subcourseId = this.$route.query.subcourseId;
    this.Collection();
  },
  methods: {
    // 试题收藏
    Collection() {
      this.datas = [];
      const params = {
        courseId: 11,
      };
      StartQuestion.getSubcourseCountJZ(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data.V;
            data.forEach((e) => {
              if (Number(this.subcourseId) === e.pid) {
                this.datas.push(e);
              }
            });
            // console.log(this.datas);
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    chakan(val) {
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
      StartQuestion.getUserCollectionsJZ(params)
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
              type: "试题收藏",
              comeFrom: "收藏",
              questionIds: questionIdTypeString,
            };
            if (val.level) {
              data.chapterId = val.id;
            } else {
              data.paperId = val.id;
            }
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
.center_timu {
  font-size: 12px;
  line-height: 14px;
  color: #999999;
}
.btn_box {
  width: 40%;
  text-align: center;
  margin-top: 20px;
}
.right_btn {
  border-radius: 10px;
  border: solid 1px #e27e86;
  color: #d44e59;
  background: white;
  font-size: 12px;
  line-height: 14px;
  padding: 3px 8px;
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
