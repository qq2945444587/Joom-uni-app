<template>
  <div>
    <Head></Head>
    <div
      class="main"
      v-loading="Listloading"
      element-loading-text="数据加载中，请稍等..."
      empty-text="对不起，没有找到相关数据！"
    >
      <div class="top_bg">
        <div class="top_bg_box">
          <img :src="courseDetailed.picUrl" alt class="top_bg_img" />
        </div>

        <div class="top_text">
          <span class="top_text_title">{{ courseDetailed.kcname }}</span>
          <span class="top_text_span">{{ courseDetailed.disInfo }}</span>
        </div>
      </div>

      <div class="center_bg"></div>

      <div class="bottom">
        <div class="bottom_top">
          <img src="../../img/kczx/icon_kcxq.png" alt class="icon_kcxq" />
          <span class="span_kcxq">课程详情</span>
        </div>
        <div v-html="courseDetailed.description" class="bottom_img"></div>
        <!-- <img src="../../img/kczx/img_xqy.png" alt class="bottom_img" /> -->
      </div>
    </div>

    <van-goods-action>
      <van-goods-action-icon :icon="kefu" text="客服" color="#ee0a24"  />
      <van-goods-action-icon :icon="shiting" text="试听" @click="gotokstkBf" />
      <van-goods-action-button
        @click="addCart"
        type="warning"
        text="加入购物车"
      />
      <van-goods-action-button type="danger"  @click="addCart" text="立即购买" />
    </van-goods-action>
    <!-- <div class="btn_jrgwc" @click="haha">免费试听</div> -->
  </div>
</template>

<script>
import CurrCenterApi from "@/api/kczx/kczx";
import { Tab, Tabs, Rate, Button, Toast, Dialog } from "vant"; //引入Tab 标签页,Rate 评分

export default {
  name: "kczxCkxq", //课程中心_查看详情
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    // 获取kczx的跳转参数触发事件
    this.routeParameter = JSON.parse(this.$route.query.data);
    this.kcxqList(JSON.parse(this.$route.query.data));
  },
  data() {
    return {
      kefu: require("../../img/kczx/kefu.png"), //客服图片
      shiting: require("../../img/kczx/shiting.png"), //试听图片
      list: [],
      Listloading: false,
      routeParameter: undefined,

      courseDetailed: {
        // 课程详情
      },
    };
  },
  methods: {
    // 获取详情数据
    kcxqList(val) {
      this.Listloading = true;
      // console.log(val);
      const params = {
        courseId: 11,
        dlId: localStorage.getItem("dlld"),
      };
      CurrCenterApi.getItemListNoLogin(params)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            const seeIndex = data.V.findIndex(
              (e) => Number(e.id) === Number(val.id)
            );
            this.courseDetailed = data.V[seeIndex];
            this.courseDetailed.picUrl =
              "http://www.360xkw.com/" + this.courseDetailed.picUrl;
            this.courseDetailed.bigPicUrl =
              "http://www.360xkw.com/" + this.courseDetailed.bigPicUrl;
          }
          this.Listloading = false;
        })
        .catch((error) => {
          Toast.fail("请求失败");
          this.Listloading = false;
        });
    },
    gotokstkBf() {
      this.$router.push({
        path: "/kstkbf",
        query: { config: this.routeParameter.config },
      });
    },

    // 加入购物车
    addCart() {
      const params = {
        id: JSON.parse(this.routeParameter.id),
        dlId: localStorage.getItem("dlld"),
      };
      CurrCenterApi.addShoppingCartJZ(params)
        .then((res) => {
          // console.log(res);
          const message = res.data.S;
          // console.log(message);
          Dialog.confirm({
            title: "提示",
            message:
              message === "1"
                ? "成功将课程添加至购物车，是否去购物车界面查看"
                : "该课程已添加至购物车，是否去购物车界面查看",
            theme: "round-button",
          })
            .then(() => {
              this.$router.push("/shopcat");
            })
            .catch(() => {
              // on cancel
            });
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
  },
};
</script>

<style>
.bottom_img p img {
  width: 334px;
}
</style>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  width: 100vw;
}
.top_bg {
  width: 100vw;
  height: 278px;
}
.top_bg_box {
  width: 100%;
  height: 200px;
}
.top_bg_img {
  width: 100%;
  height: 200px;
}
.top_text {
  width: calc(100% - 20px);
  height: 78px;
  padding: 10px;
  /* margin: 15px 0 0 17px; */
  display: flex;
  flex-direction: column;
}
.top_text_title {
  font-size: 16px;
  color: #333333;
}
.top_text_span {
  font-size: 14px;
  /* line-height: 11px; */
  color: #999999;
  margin: 7px;
}

/* 横线背景 */
.center_bg {
  width: 100%;
  height: 10px;
  background-color: #f4f5f9;
}

.bottom_top {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
}
.icon_kcxq {
  width: 5%;
  margin-left: 12px;
}
.span_kcxq {
  font-size: 14px;
  color: #333333;
  margin-left: 5px;
}
.bottom_img {
  /* display: flex; */
  margin: 0 auto;
  margin-top: 15px;
  margin-bottom: 45px;

  width: 334px;
  /* height: 765px; */
}
.btn_jrgwc {
  position: fixed;
  bottom: 0;
  width: 334px;
  height: 38px;
  background-image: linear-gradient(0deg, #ff443c 0%, #ff6849 100%);
  border-radius: 4px;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
  color: #ffffff;
}
.van-goods-action-button--warning {
  background: #fd934c;
}
.van-goods-action-button--danger {
  background: #ff493e;
}
</style>
