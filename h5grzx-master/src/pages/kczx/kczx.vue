<template>
  <div>
    <Head></Head>
    <van-loading size="24px" class="loading" v-if="loading2"
      >加载中...</van-loading
    >

    <div class="gyh_box" v-else>
      <div class="tlk_top">
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="value"
            @change="dropdown"
            :options="courseOption"
          />
        </van-dropdown-menu>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="crouse_item" v-for="(item, index) in list" :key="index">
          <div class="left_img_box">
            <img :src="item.bigSrc" alt class="left_img" />
          </div>
          <div class="crouse_right">
            <div class="right_top">
              <img
                src="../../img/wdkc/kstk/icon_yh.png"
                alt
                class="icon_img_yh"
              />
              <span class="crouse_title">{{ item.kcname }}</span>
            </div>
            <div class="right_center">
              <div class="score_star">
                <van-rate
                  v-model="item.scoreCustom"
                  class="score"
                  size="16px"
                  color="#ff403a"
                  void-icon="star"
                  void-color="#bfbfbf"
                  readonly
                />
              </div>
              <div class="score_number" style>{{ item.scoreCustom }}.0</div>
            </div>

            <div class="right_bottom">
              <div class="price">
                <span class="price_font">
                  <span class="yuan">￥</span>
                  {{ item.disPrice }}
                </span>
                <span class="date_font">{{ item.price }}</span>
              </div>
              <div class="btn_ckxq" @click="seeDetails(item)">查看详情</div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, Rate, Button, Loading } from "vant"; //引入Tab 标签页,Rate 评分
import CurrCenterApi from "@/api/kczx/kczx";

export default {
  name: "kczx", //课程中心
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  created() {
    this.loading2 = true;
    this.kczxList();
  },
  mounted() {},
  data() {
    return {
      loading2: true,
      Listloading: true, // 整个数据刷新时的加载
      score: 3, //评分
      // 加载
      loading: false,
      finished: false,
      // refreshing: false,
      value: "全部",
      courseOption: [
        { text: "全部", value: "全部" },
        { text: "最热", value: "最热" },
        { text: "全科", value: "全科" },
        { text: "单科", value: "单科" },
      ],
      courseList: undefined,
      list: [],
    };
  },
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // if (this.refreshing) {
      //   this.list = [];
      //   this.refreshing = false;
      // }
      // for (let i = 0; i < 10; i++) {
      //   this.list.push(this.list.length + 1);
      // }
      // 加载状态结束
      this.loading = false;
      // 数据全部加载完成
      if (this.list.length >= this.list.length) {
        this.finished = true;
      }
    },
    dropdown(val) {
      this.kczxList(val);
    },
    // 课程中心的数据
    kczxList(val) {
      this.loading2 = true;
      const params = {
        courseId: 11,
        dlId: localStorage.getItem("dlld"),
      };
      CurrCenterApi.getItemListByBanXingTypeNoLogin(params)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            data.V.forEach((item) => {
              item.items.forEach((e) => {
                e.bigSrc = "https://tk.360xkw.com/" + e.picUrl;
                e.scoreCustom = Number(e.scoreCustom);
              });
            });
            this.courseList = data.V;
            this.moreList(val);
            this.loading2 = false;
          }
        })
        .catch((error) => {
          // console.log("获取数据失败");
          Toast({
            message: "获取数据失败!",
            position: "bottom",
          });
          this.loading2 = false;
        });
    },
    // 不同的类型显示不同的课程列表
    moreList(val) {
      let courseList = [];
      let courseList1 = [];
      let courseList2 = [];
      let courseList3 = [];

      if (val === "全部" || val === undefined) {
        this.courseList.forEach((e, index) => {
          if (index === 0) {
            courseList1 = e.items;
          } else if (index === 1) {
            courseList2 = e.items;
          } else if (index === 2) {
            courseList3 = e.items;
          }
        });
        courseList = courseList1.concat(courseList2, courseList3);
        this.list = courseList;
      } else if (val === "最热") {
        this.courseList.forEach((item) => {
          if (item.name === "最热") {
            this.list = item.items;
          }
        });
      } else if (val === "全科") {
        this.courseList.forEach((item) => {
          if (item.name === "全科") {
            this.list = item.items;
          }
        });
      } else if (val === "单科") {
        this.courseList.forEach((item) => {
          if (item.name === "单科") {
            this.list = item.items;
          }
        });
      }
      // console.log(this.list);
    },
    seeDetails(val) {
      // console.log(val);
      const data = {
        config: val.config,
        bxid: val.banxingType,
        id: val.id,
        courseId: val.courseId,
      };
      this.$router.push({
        path: "/kczxCkxq",
        query: { data: JSON.stringify(data) },
      });
    },
  },
};
</script>

<style scoped>
.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.gyh_box {
  width: 100vw;
  height: calc(100vh - 50px);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}
.tlk_top {
  background: red;
  width: 100vw;
  height: 48px;
  position: fixed;
  top: 46px;
  left: 0;
  background: white;
  z-index: 9999;
}
.van-list {
  padding-top: 60px;
}
.crouse_item {
  width: calc(100vw - 29px);
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ebebeb;
  padding: 15px 17px 16px 12px;
}
.left_img_box {
  width: 116px;
  height: 86px;
}
.left_img {
  width: 116px;
  height: 86px;
}
.crouse_right {
  flex: auto;
  margin-left: 15px;
}
.right_top {
  width: 100%;
}
.icon_img_yh {
  width: 40px;
  height: 20px;
  border-radius: 10px 0px 10px 0px;
  vertical-align: middle; /*文本对齐，父元素的中部 */
  margin-top: 6px;
}
/* 课程标题 */
.crouse_title {
  width: 170px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333333;
  display: inline-block;
  vertical-align: middle;
  margin-top: 2px;
}
.right_center {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.score_number {
  font-size: 16px;
  color: #999999;
  margin-left: 11px;
}
.right_bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
/* 价格 */
.price {
  display: flex;
  align-self: flex-end;
  color: #ff413b;
}

.price_font {
  font-size: 16px;
}
.yuan {
  font-size: 10px;
  letter-spacing: -5px;
}
.date_font {
  color: #bfbfbf;
  text-decoration: line-through;
  display: flex;
  align-self: flex-end;
  font-size: 12px;
  padding-left:4px;
}
.btn_ckxq {
  width: 80px;
  height: 26px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 3px;
  font-size: 14px;
  line-height: 26px;
  color: #ffffff;
  text-align: center;
}
</style>
