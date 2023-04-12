<template>
  <div>
    <Head></Head>
    <div class="redEnvelope_box">
      <van-tabs
        v-model="active"
        title-active-color="#333333"
        title-inactive-color="#999999"
      >
        <!-- 
红
包
 -->
        <van-tab v-for="(item, index) in tabs" :title="item.name" :key="index">
          <div class="hongbaobox" v-show="index == '0'">
            <div class="hongbao">
              <div class="hongbao_title">红包金额(元)</div>
              <div class="hongbao_num">{{ total||0 }}.00</div>
            </div>
            <div class="hongbao_info">
              <div class="hongbao_info_title">红包明细</div>

<van-empty
v-if="rows.length==0"
  class="custom-image"
  image="https://img.yzcdn.cn/vant/custom-empty-image.png"
  description="暂无红包明细"
/>

              <div class="hongbao_info_conn_box" v-else>
                <div class="hongbao_info_conn" v-for="(ite, inde) in rows" :key="inde">
                  <div class="hongbao_info_conn_unit">
                    <div class="conn_unit_left">{{ ite.remarks }}</div>
                    <div class="conn_unit_right">
                      <div class="conn_unit_right_money">
                        +
                        <span>1{{ ite.redEnvelope }}</span>
                      </div>
                      <div class="conn_unit_right_time">
                        {{ ite.createTime  | youhuiTime }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 
优
惠
券
 -->
          <div class="coupon" v-show="index == '1'">
           
            <div v-if="coupons.length > 0">
              <div class="coupon_info" v-for="(item, index) in coupons" :key="index">
                <div class="coupon_info_box">
                  <div
                    class="coupon_info_unit"
                    :id="[item.fail == '1' ? 'coupon_info_unit_fail' : '']"
                  >
                    <div class="info_unit_left">
                      <div class="info_unit_left_price">
                        ¥ <span>{{ item.usedAmount }}</span>
                      </div>
                      <div class="info_unit_left_price" v-if="item.type == 1">满减券</div>
                      <div class="info_unit_left_price" v-if="item.type == 2">立减券</div>
                      <div class="info_unit_left_price" v-if="item.type == 3">折扣券</div>
                      <div class="info_unit_left_price" v-if="item.type == ''">
                        全场通用
                      </div>
                    </div>
                    <div class="info_unit_right">
                      <div class="info_unit_right_title">{{ item.title }}</div>
                      <div class="info_unit_right_time">
                        有效期至：
                        <span>{{ item.endTime | youhuiTime }}</span>
                      </div>
                    </div>

                    <div v-if="item.fail == 1" class="coupon_info_unit_img">
                      <img src="../../img/wallet/Expired.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

             <div v-else>
              <van-empty class="custom-image" :image="img" description="暂无优惠券" />
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Wallet from "@/api/wallet/wallet";
import { Toast, Dialog, Empty } from "vant";
export default {
  data() {
    return {
      img: require("../../img/wallet/coupon_empty.png"),
      tabs: [
        {
          name: "我的红包",
          value: "0",
        },
        {
          name: "优惠券",
          value: "1",
        },
      ],
      list: [
        {
          price: 600,
          type: "新人券",
          title: "适用于单笔满6000减600使用",
          time: "2020 1 5",
        },
      ],
      active: 2,
      count: 0,
      isLoading: false,
      total: "", // 红包总金额
      rows: [], //红包详情获取来源
      coupons: [], //优惠券汇总  包含有效失效
    };
  },
  methods: {
    // 红包总数
    getRedPrice() {
      const params = {
        dlId: JSON.parse(localStorage.getItem("dlld")),
      };
      Wallet.walletPrice(params)
        .then((res) => {
          const data = res.data;
          this.total = data.V;
        })
        .catch((error) => {
          Toast({ message: "获取红包总数出错", position: "bottom" });
       
        });
    },
    // 红包来源
    getRedSource() {
      const params = {
        page: 1,
        rows: 10,
      };
      Wallet.walletSource(params)
        .then((res) => {
          var data = res.data;
          data = data.V;
          this.rows = data.rows;
        })
        .catch(() => {
               Toast({ message: "获取红包来源出错", position: "bottom" });
        });
    },
    //获取 优惠券
    getCoupon() {
      const params = {
        dlId: JSON.parse(localStorage.getItem("dlld")),

      };
      Wallet.failCounpon(params)
        .then((res) => {
          var data = res.data;
          data = data.V;
          for (var i = 0; i < data.length; i++) {
            data[i].fail = "1";
            this.coupons.unshift(data[i]);
          }
        })
        .catch(() => {
             Toast({ message: "获取失效优惠券出错", position: "bottom" });
        });
      setTimeout(() => {
        Wallet.succCounpon(params)
          .then((res) => {
            var data = res.data;
            data = data.V;
            for (var i = 0; i < data.length; i++) {
              data[i].fail = "0";
              this.coupons.unshift(data[i]);
            }
          })
          .catch(() => {
               Toast({ message: "获取有效优惠券出错", position: "bottom" });
          });
      }, 500);
    },
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      return;
    }
    this.getRedPrice();
    this.getRedSource();
    this.getCoupon();
  },
  filters: {
    // 有效时间格式化
    youhuiTime: function (value) {
      if (!value) {
        return (value = "");
      } else {
        var time = value;
        time = time.split(".")[0];
        return time;
      }
    },
  },
};
</script>

<style>

  .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
.van-tabs__line {
  width: 47px;
  bottom: 20px;
}
.van-tabs__wrap {
  border-bottom: 1px solid rgb(238, 237, 237);
}
</style>
<style scoped>
.redEnvelope_box {
  width: 100%;
  height: calc(100vh - 47px);
}
.hongbaobox {
  /* margin:0 12px ; */
  width: 100%;
  background: #fcfcfc;
  height: 200%;
}
.hongbao {
  width: 351px;
  height: 160px;
  box-shadow: 0px 0px 14px 0px rgba(255, 37, 37, 0.08);
  background: url("../../img/wallet/hongbaobg.png");
  background-size: 100% 100%;
  text-align: center;
  margin: 14px;
}
.hongbao_title {
  padding-top: 44.5px;
  font-size: 14px;
  color: #ffffff;
}
.hongbao_num {
  padding-top: 5px;
  font-size: 42px;
  color: #ffffff;
}
.hongbao_info {
  height: 381px;
}
.hongbao_info_title {
  font-size: 14px;
  /* line-height: 48px; */
  margin: 20px 0 16px 14px;
}
.hongbao_info_conn_box {
  width: 100%;
  height: 340px;
  overflow: hidden;
  overflow-y: scroll;
  overflow-x: hidden;
}
.hongbao_info_conn_unit {
  width: 351px;
  height: 75px;
  background-color: #ffffff;
  box-shadow: 0px 0px 14px 0px rgba(48, 48, 48, 0.15);
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}
.conn_unit_left {
  font-size: 14px;
  line-height: 20px;
  color: #333333;
  padding-left: 14px;
}
.conn_unit_right {
  font-size: 14px;
  line-height: 20px;
  color: #fe3f10;
  text-align: right;
  padding-right: 26.5px;
}
.conn_unit_right span {
  font-size: 19px;
  color: #fe3f10;
}
.conn_unit_right_money {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.conn_unit_right_time {
  font-size: 12px;
  line-height: 20px;
  color: #808080;
  margin-top: 12px;
}
.coupon {
    width: 100%;
  height: calc(100vh - 100px) !important;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;

}
.custom_image {
  width: 100%;
}
.custom_image img {
  width: 160px;
  height: 160px;
  margin: 0 auto;
  display: block;
}
.custom_image p {
  margin-top: 20px;
  color: #969799;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
}
.coupon_info {
  width: 100vw;
}
.coupon_info_box {
  margin: 7.5px 12px;
  /* height: 300px; */
}
.coupon_info_unit {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-content: flex-start;

  align-items: center;
  width: 351px;
  height: 95px;
  background: url("../../img/wallet/coupon.png");
  background-size: 100% 100%;
  box-shadow: 0px 0px 14px 0px rgba(48, 48, 48, 0.2);
  border-radius: 5px;
  position: relative;
}
.coupon_info_unit_img {
  width: 60px;
  height: 60px;
  position: absolute;
  right: 20px;
  top: 20px;
}
.coupon_info_unit_img img {
  width: 100%;
}
#coupon_info_unit_fail {
  background: url("../../img/wallet/couponfail.png");
  background-size: 100% 100%;
}
.info_unit_left {
  width: 110px;
  height: 104px;
  /* background: red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}
.info_unit_left_price {
  font-size: 14px;
  color: #ffffff;
}
.info_unit_left_price span {
  font-size: 31px;
}
.info_unit_right {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  padding: 0 15px;
  /* background-color: orange; */
}
.info_unit_right_title {
  font-size: 16px;
  line-height: 21px;
  color: #999999;
  padding-bottom: 20px;
  border-bottom: solid 1px #e4e4e4;
}
.info_unit_right_time,
.info_unit_right_time span {
  padding-top: 13px;
  font-size: 12px;
  color: #999999;
}
</style>
