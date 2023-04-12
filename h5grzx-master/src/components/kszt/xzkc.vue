<template>
  <div>
    <div class="main" v-if="boxshow">
      <div
        class="course_item"
        v-for="(item, index) in list"
        :key="index"
        @click="choice(item, index)"
      >
        <div style="display: flex;flex-direction: row;">
          <div class="course_img_box">
            <img class="course_img" :src="item.img" alt />
          </div>
          <div class="course_text">
            <div :class="active === item.name?'active':'course_title'">{{item.name}}</div>
            <!-- <div class="course_num">{{item.num}}已做</div> -->
          </div>
        </div>
        <div class="seletRed" v-if="active === item.name">
          <img src="../../img/kszt/kszt/icon_SelectRed.png" alt />
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
  props: {
    showVisible: {
      type: Boolean,
      default: false,
    },
    switchList: {
      type: Array,
      default() {
        return [];
      }
    },
     courseTitle: {
      type: String,
      default: '',
    }
  },
  watch: {
    showVisible(val) {
      this.boxshow = val;
    },
    switchList(val) {
      this.list = val;
      // console.log(this.list);
    },
    courseTitle(val) {
      // console.log(val);
      this.active = val
    },
  },
  created() {
  this.active = this.courseTitle
  },
  data() {
    return {
      boxshow: false,
      active: 0,
      list: [],
    };
  },
  methods: {
    choice(val, index) {
      this.$parent.Iwantyou(val);
    },
  },
};
</script>

<style  scoped>
.active {
  color: #ff413a;
  font-size: 14px;
}
.main {
  position: absolute;
  width: 100vw;
}
.course_item {
  height: 62px;
  display: flex;
  justify-content: space-between;
  margin: 15px 0 15px 15px;
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
.seletRed {
  line-height: 62px;
  text-align: center;
  margin-right: 21px;
}
.seletRed img {
  width: 15px;
  height: 15px;
}
</style>
