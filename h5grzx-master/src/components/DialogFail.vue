<template>
  <div>
    <div class="dialog_box" v-show="showVisible">
      <div class="dia_conn">
        <div class="dia_tips_text">提交订单失败</div>
        <div @click="returnClick" class="dia_btn">返回</div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      boxshow: false,
    };
  },
  methods: {
    // 点击返回关闭弹窗
    returnClick() {
      this.$parent.returnClicknow(false);
    },
  },

  watch: {
    showVisible(val) {
      // console.log(val);
      this.boxshow = val;
    },
  },
};
</script>
<style scoped>
.dialog_box {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 66;
}
.dia_conn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 210px;
  background-color: #fff;
  background: url("../img/cat/fail.png");
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
.dia_tips_text {
  font-size: 16px;
  line-height: 21.89px;
  color: #f34b4b;
  text-align: center;
  padding-bottom: 25px;
}
.dia_btn {
  width: 110px;
  height: 36px;
  font-size: 16px;
  line-height: 36px;
  color: #ffffff;
  text-align: center;
  background-color: #f34b4b;
  box-shadow: 0px 4px 0px 0px rgba(255, 123, 123, 0.4);
  border-radius: 18px;
  margin-bottom: 20px;
}
</style>