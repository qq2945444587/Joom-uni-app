<template>
  <div>
    <Head></Head>
    <div class="main">
      <div class="course_item" v-for="item in list" :key="item" :title="item">
        <div class="course_img_box">
          <img class="course_img" :src="item.img" alt />
        </div>
        <div class="course_text">
          <div class="course_title">{{item.title}}</div>
          <div class="course_num">{{item.num}}已做</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "xzkc", //选择课程
  components: {},
  filters: {}, //过滤器
  provide() {
    return {};
  },
  data() {
    return {
      list: [
        {
          title: "全科幼儿直播班",
          num: 1041,
          img: require("@/img/kszt_kcxz/crouse.png"),
        },
        {
          title: "全科幼儿直播班",
          num: 1041,
          img: require("@/img/kszt_kcxz/crouse.png"),
        },
        {
          title: "全科VIP班（幼儿）",
          num: 1041,
          img: require("@/img/kszt_kcxz/crouse.png"),
        },
        {
          title: "综合素质（幼儿）",
          num: 1041,
          img: require("@/img/kszt_kcxz/crouse.png"),
        },
        {
          title: "综合素质（幼儿）",
          num: 1041,
          img: require("@/img/kszt_kcxz/crouse.png"),
        },
      ],
    };
  },
  methods: {},
};
</script>

<style  scoped>
.main {
  width: 100vw;
}
.course_item {
  width: 385px;
  height: 62px;
  display: flex;
  flex-direction: row;
  margin: 15px 0 0 15px;
}
.course_img {
  width: 107px;
  height: 62px;
}
.course_text {
  margin-left: 15px;
}
.course_title {
  font-size: 14px;
  color: #333333;
}
.course_num {
  font-size: 12px;
  color: #999999;
  margin-top: 29px;
}
</style>
