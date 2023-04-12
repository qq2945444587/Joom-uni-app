<template>
  <div class="box">
    <Head></Head>
    <div class="oroder_info">
      <div class="succ_img">
        <img src="../../img/cat/succ.png" alt />
      </div>
      <div class="order_title">恭喜您，支付成功</div>
      <div class="order_info_unit">
        <div>订单编号</div>
        <div class="order_code">{{paySucc.order}}</div>
      </div>
      <div class="order_info_unit">
        <div>订单金额</div>
        <div class="order_text">{{paySucc.price}}</div>
      </div>
      <div class="order_info_unit">
        <div>交易时间</div>
        <div class="order_time">{{paySucc.time}}</div>
      </div>
      <div class="saveBtn" @click="toback">返回</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paySucc: "",
    };
  },
  methods: {
    toback() {
      this.$router.push({ name: "grzx" });
    },
  },
  mounted() {

    this.paySucc = JSON.parse(localStorage.getItem("paySucc"))?JSON.parse(localStorage.getItem("paySucc")):'';
  },
};
</script>

<style scoped>
.box {
  width: 100%;
  height: 100vh;
  background: #f5f5f6;
}
.oroder_info {
  width: 351px;
  margin: 10px 12px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.succ_img {
  width: 68.5px;
  height: 68.5px;
  margin-top: 35.5px;
}
.succ_img img {
  width: 100%;
}
.order_title {
  font-size: 16px;
  line-height: 92px;
  font-weight: 600;
  color: #333333;
}
.order_info_unit {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 70%;
  font-size: 14px;
  line-height: 25.63px;
  color: #333333;
}
.order_code,
.order_text,
.order_time {
  font-size: 14px;
  color: #959595;
  margin-left: 20px;
}
.saveBtn {
  width: 301px;
  height: 40px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 3px;
  margin: 0 auto;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  color: #fffefe;
  margin: 35.5px 0;
}
</style>