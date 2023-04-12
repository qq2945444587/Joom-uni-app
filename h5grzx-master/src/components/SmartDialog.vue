<template>
  <div>
    <div class="SmartDialog" :class="show ? 'active' : ''">
      <div class="unit_connent">
        <div class="unit_timu">
          <div class="unit_timu_tit">
            第一章 教师职业理念 ( <span>20</span> / <span>300</span> )
          </div>
          <div class="unit_timu_correct">
            错题 <span>0</span> 权重 <span>0</span> 正确率 <span>0%</span>
          </div>
        </div>
        <div class="clheck_detail_btn">查看详情</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
// 获取登录api

export default {
  props: ["show"],
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
<style scoped>
.SmartDialog {
  position: fixed;
  height: calc(100% - 30px);
  width: calc(100% - 32px);
  top: 0;
  left: 0;
  padding: 15px 16px;
  background: white;
  /* background: red; */
  display: none;
}
.active {
  display: block;
}
.SmartDialog .unit_connent {
  width: calc(345px - 32px);
  /* height: calc(62px - 28px); */
  margin: 0 auto;
  background-color: #fffeff;
  box-shadow: 0px 0px 5px 0px #edeff2;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 14px 12px 14px 20px;
  margin-bottom: 12px;
}
.SmartDialog .unit_timu {
  color: #26292c;
  font-size: 14px;
}
.SmartDialog .unit_timu_correct {
  margin-top: 10px;
  font-size: 12px;
  color: #999999;
}
.SmartDialog .clheck_detail_btn {
  width: 80px;
  height: 21px;
  border-radius: 10px;
  border: solid 1px #f89ea5;
  text-align: center;
  color: #e70012;
  font-size: 12px;
  line-height: 22px;
  margin-top: 10px;
}
</style>
