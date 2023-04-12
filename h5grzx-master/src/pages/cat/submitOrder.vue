<template>
  <div class="submitOrderBox">
    <!-- <div></div> -->
    <DialogFail :showVisible="showVisible"></DialogFail>
    <Head></Head>
    <div class="order_box">
      <div class="catConn_box_info" v-for="(item, index) in list" :key="index">
        <div class="catConn">
          <div class="carInfo">
            <div class="catImg">
              <img :src="item.item[0].bigPicUrl" alt />
            </div>
            <div class="carRightInfo">
              <div class="carRightInfo_title">{{ item.item[0].kcname }}</div>
              <div class="carRightInfo_conn">
                <div class="carRightInfo_conn_price">
                  ¥
                  <span>{{ item.item[0].disPrice }}</span>
                </div>
                <div class="carRightInfo_conn_num">
                  x
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 优惠券 -->
      <div class="coupon">
        <van-coupon-cell
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          @click="showList = true"
        />
        <!-- 优惠券列表 -->
        <van-popup
          v-model="showList"
          round
          position="bottom"
          style="height: 90%; padding-top: 4px"
        >
          <van-coupon-list
            :coupons="coupons"
            :chosen-coupon="chosenCoupon"
            :disabled-coupons="disabledCoupons"
            @change="onChange"
          />
        </van-popup>
      </div>

      <div class="pay_methods">
        <div class="pay_title">支付方式：</div>
        <van-radio-group v-model="radio">
          <van-cell-group>
            <div class="pay_ali" clickable @click="radio = '1'">
              <div class="pay_ali_left">
                <div class="pay_img">
                  <img src="../../img/cat/pay_ali.png" alt />
                </div>
                <div class="pay_left_title">支付宝</div>
              </div>
              <div class="pay_ali_right_check">
                <van-radio name="1" checked-color="#ff6949"></van-radio>
              </div>
            </div>
            <div class="pay_wx" clickable @click="radio = '2'">
              <div class="pay_wx_left">
                <div class="pay_img">
                  <img src="../../img/cat/pay_wx.png" alt />
                </div>
                <div class="pay_left_title">微信支付</div>
              </div>
              <div class="pay_wx_right_check">
                <van-radio name="2" checked-color="#ff6949"></van-radio>
              </div>
            </div>
          </van-cell-group>
        </van-radio-group>
      </div>

      <div class="redEnvelope" @click="honhbaoClick(checked)">
        <div class="pay_red">
          <div class="pay_red_left">
            <div class="pay_img">
              <img src="../../img/cat/redEnvelope.png" alt />
            </div>
            <div class="pay_left_title">可抵用红包{{ RedBaoNumber }}元</div>
          </div>
          <div class="pay_red_right_check">
            <van-checkbox v-model="checked"></van-checkbox>
            <!-- <van-checkbox v-model="checked" @click="honhbaoClick(checked)" checked-color="#ff6949"></van-checkbox> -->
          </div>
        </div>
      </div>
    </div>
    <div class="submit">
      <div class="sumbit_heji">
        合计：
        <span class="submit_heji_fuhao">
          ¥
          <span>{{ lastMoney }}</span>
        </span>
      </div>
      <div class="submit_order_btn" @click="submitClick">结算</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  ActionSheet,
  RadioGroup,
  Radio,
  CellGroup,
  Cell,
  Toast,
  CouponCell,
  CouponList,
} from "vant";
import ShopCart from "@/api/gwc/gwc";
import DialogFail from "@/components/DialogFail"; // 订单提交失败弹窗组件
Vue.use(ActionSheet);
export default {
  components: { DialogFail }, // 引入公共组件
  data() {
    return {
      url: "", //网址
      showVisible: false,
      checked: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      show: false,
      radio: "0",
      RedBaoNumber: 0,
      showList: false,
      chosenCoupon: -1,
      coupons: [],
      lastMoney: 0,
      disabledCoupons: [],
      indexs: -1,
      isUserRedEnvelope: "",
      couponId: "",
      orderID: "",
      cartID: "", //购物车id以,分隔多个
      itemIdStr: "", //多个课程id 以,分隔
      kname: "", //课程名称
      courseId: "", //课程证书id
      xkwMoney: "",
      nowtime: "", //当前时间
    };
  },
  created() {
    this.url = window.location.href.split("/grzx/")[0];
    // console.log( this.url)
    this.RedBao();
    this.canCoupon();
    this.disCoupons();
    this.currentTime();
    this.list = JSON.parse(this.$route.query.data);
    // console.log(this.list);
    const shopMoneyList = [];
    this.list.forEach((item) => {
      shopMoneyList.push(item.item[0].disPrice);
    });
    this.lastMoney = eval(shopMoneyList.join("+"));
  },
  methods: {
  
    // 选择了优惠卷触发的事件
    onChange(index) {
      this.indexs = index;
      const shopMoney = [];
      this.list.forEach((item) => {
        shopMoney.push(item.item[0].disPrice);
      });
      // console.log(this.coupons[index]);
      // console.log(this.coupons)
      var zhuan = false
			var mei = false
      // Toast.fail("此优惠卷为专用课程优惠卷，请选择对应专用课程");
      this.list.forEach(e => {
        if (this.coupons[index] !== '') {
						if (this.coupons[index].withSn.indexOf(e.itemsId) > -1) {
							zhuan = true
						} else {
							mei = true

						}
					}
      })
      console.log(zhuan, mei)
      if (mei === true) {
        Toast.fail("此优惠卷为专用课程优惠卷，请选择对应专用课程")
				return
			}
      this.calCoupon(this.coupons[index], eval(shopMoney.join("+")), index);
    },
    // 计算优惠卷显示的减多少价格
    calCoupon(couponobject, money, index) {
      if (couponobject !== undefined) {
        this.couponId = couponobject.id;
      }
      this.lastMoney = money; // 每触发选择红包还是优惠卷都重置一次价格
      if (couponobject === undefined && this.checked === true) {
        // 当只选择优红包时所得结算
        this.lastMoney = Number(this.lastMoney) - Number(this.RedBaoNumber);
      }
      if (couponobject !== undefined) {
        // 当选择了优惠卷时的条件
        if (couponobject.type === 1) {
          // console.log("我是满减卷");
          if (money < couponobject.withAmount) {
            // 课程未满足条件被截胡了
            Toast.fail("课程未满足优惠条件");
            return;
          } else {
            // 满足满减条件后进行满减计算
            couponobject.value = Number(couponobject.valueDesc) * 100;
            if (this.checked === true) {
              // 是否使用红包
              // 当红包和折扣卷都选择的计算结果
              this.lastMoney = Number(money) - Number(couponobject.valueDesc);
              if (Number(this.lastMoney) >= Number(this.RedBaoNumber)) {
                // 如果打完折后总金额还大于红包，那么就减去，否则打完折后红包金额此总金额大，那么直接0元购
                this.lastMoney =
                  Number(this.lastMoney) - Number(this.RedBaoNumber);
              } else {
                this.lastMoney = 0;
              }
            } else if (this.checked === false) {
              // 只选择折扣卷不选择红包的计算结果
              this.lastMoney = Number(money) - Number(couponobject.valueDesc);
            }
          }
        } else if (couponobject.type === 2) {
          couponobject.value = Number(couponobject.valueDesc) * 100;
          // console.log("我是立减卷");
          if (this.checked === true) {
            // 当红包和折扣卷都选择的计算结果
            this.lastMoney = Number(money) - Number(couponobject.valueDesc);
            if (Number(this.lastMoney) >= Number(this.RedBaoNumber)) {
              // 如果打完折后总金额还大于红包，那么就减去，否则打完折后红包金额此总金额大，那么直接0元购
              this.lastMoney =
                Number(this.lastMoney) - Number(this.RedBaoNumber);
            } else {
              this.lastMoney = 0;
            }
          } else if (this.checked === false) {
            // 只选择折扣卷不选择红包的计算结果
            this.lastMoney = Number(money) - Number(couponobject.valueDesc);
          }
        } else if (couponobject.type === 3) {
          //  console.log("我是折扣卷");
          couponobject.value =
            (Number(money) -
              Number(money) * Number(couponobject.valueDesc / 10)) *
            100;
          if (this.checked === true) {
            // 当红包和折扣卷都选择的计算结果
            this.lastMoney =
              Number(money) * Number(couponobject.valueDesc / 10);
            if (Number(this.lastMoney) >= Number(this.RedBaoNumber)) {
              // 如果打完折后总金额还大于红包，那么就减去，否则打完折后红包金额此总金额大，那么直接0元购
              this.lastMoney =
                Number(this.lastMoney) - Number(this.RedBaoNumber);
            } else {
              this.lastMoney = 0;
            }
          } else if (this.checked === false) {
            // 只选择折扣卷不选择红包的计算结果
            this.lastMoney =
              Number(money) * Number(couponobject.valueDesc / 10);
          }
        }
      }
      this.chosenCoupon = index;
      this.showList = false;
    },
    // 可以使用的优惠卷
    canCoupon() {
      const params = {
        dlId: localStorage.getItem("dlld"),
      };
      this.coupons = [];
      // this.coupons = [{
      //   available: 1,
      //   condition: "课程专用卷\n满减卷\n满2680减1000",
      //   description: "课程专用卷",
      //   endAt: 1655913599,
      //   id: 95,
      //   name: "教师资格全科直播班",
      //   reason: "原因",
      //   startAt: 1624291200,
      //   type: 1,
      //   unitDesc: "元",
      //   value: 100000,
      //   valueDesc: 1000,
      //   withAmount: 2680,
      //   withSn: "324,325,326"
      // }]
      ShopCart.getValidJzCouponByStuId(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            data.V.forEach((e) => {
              // data.V.forEach((e) => {
              e.startAt = parseInt(new Date(e.startTime).getTime() / 1000);
              e.endAt = parseInt(new Date(e.endTime).getTime() / 1000);
              e.couponState =
                e.withSn !== "" && e.withSn ? "课程专用卷" : "全场通用卷";
              if (e.type === 3) {
                e.youhui = "折扣卷";
                e.manjian = "";
              } else if (e.type === 1) {
                e.youhui = "满减卷";
                e.manjian = "满" + e.withAmount + "减" + e.usedAmount;
              } else if (e.type === 2) {
                e.youhui = "立减卷";
                e.manjian = "";
              }

              this.coupons.push(
                Object.assign(
                  {},
                  {
                    withAmount: e.withAmount,
                    type: e.type,
                    id: e.id,
                    value: 1.6 * 100,
                    startAt: e.startAt,
                    endAt: e.endAt,
                    available: 1,
                    condition:
                      e.couponState + "\n" + e.youhui + "\n" + e.manjian,
                    reason: "原因",
                    description:
                      e.withSn !== "" && e.withSn ? "课程专用卷" : "全场通用卷",
                    name: e.title,
                    valueDesc: e.usedAmount,
                    unitDesc: e.type === 3 ? "折" : "元",
                    withSn: e.withSn
                  }
                )
              );
            });
            // console.log(data.V);
          }
        })
        .catch((error) => {
          Toast.fail("优惠卷获取失败");
        });
    },
    // 无效了的优惠卷
    disCoupons() {
      const params = {
        dlId: localStorage.getItem("dlld"),
      };
      ShopCart.getLoseJzCouponByStuId(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
            data.V.forEach((e) => {
              e.startAt = parseInt(new Date(e.startTime).getTime() / 1000);
              e.endAt = parseInt(new Date(e.endTime).getTime() / 1000);
              e.couponState =
                e.withSn !== "" && e.withSn ? "课程专用卷" : "全场通用卷";
              if (e.type === 3) {
                e.youhui = "折扣卷";
                e.manjian = "";
              } else if (e.type === 1) {
                e.youhui = "满减卷";
                e.manjian = "满" + e.withAmount + "减" + e.usedAmount;
              } else if (e.type === 2) {
                e.youhui = "立减卷";
              }
              // 将需要的参数提取出来绑定在vant框架的固定参数上
              this.disabledCoupons.push(
                Object.assign(
                  {},
                  {
                    value: 1.6 * 100,
                    startAt: e.startAt,
                    endAt: e.endAt,
                    available: 1,
                    condition:
                      e.couponState + "\n" + e.youhui + "\n" + e.manjian,
                    reason: "优惠卷已过期",
                    name: e.title,
                    valueDesc: e.usedAmount,
                    unitDesc: e.type === 3 ? "折" : "元",
                  }
                )
              );
            });
            // console.log(data);
          }
        })
        .catch((error) => {
          Toast.fail("过期优惠卷获取失败");
        });
    },
    // 当前用户的红包数量
    RedBao() {
      const params = {
        dlId: localStorage.getItem("dlld"),
      };
      ShopCart.getSutUserRedEnvelopeSum(params)
        .then((res) => {
          if (res.data) {
            this.RedBaoNumber = res.data.V ? res.data.V : 0;
          }
        })
        .catch((error) => {
          Toast.fail("红包获取失败");
        });
    },
    // 是否使用红包
    honhbaoClick(val) {
      this.checked = !this.checked;
      const shopMoney = [];
      this.list.forEach((item) => {
        shopMoney.push(item.item[0].disPrice);
      });
      // console.log(this.coupons[this.indexs]);
      this.calCoupon(
        this.coupons[this.indexs],
        eval(shopMoney.join("+")),
        this.indexs
      );
    },
    // 从组件获取到的事件
    returnClicknow(val) {
      this.showVisible = val;
    },
    // 结算
    submitClick() {
      if (this.radio === "0") {
        Toast({ message: "请选择支付方式", position: "bottom" });
        return;
      }
      // 判断是否使用了红包
      if (this.checked === true) {
        this.isUserRedEnvelope = 1;
      } else {
        this.isUserRedEnvelope = 2;
      }
      const kcList = [];
      this.list.forEach((e) => {
        kcList.push(
          Object.assign(
            {},
            {
              kcname: e.item[0].kcname,
              courseId: String(e.item[0].courseId),
              disPrice: String(e.item[0].disPrice),
              id: String(e.item[0].id),
              config: e.item[0].config,
              cartIds: String(e.id),
            }
          )
        );
      });

      kcList.forEach((item) => {
        // console.log(item);

        this.itemIdStr += item.id + ",";
        this.cartID += item.cartIds + ",";
        this.kname += item.kcname + ",";
        this.courseId += item.courseId + ",";
      });

      const params = {
        test: JSON.stringify(kcList),
        isUserRedEnvelope: String(this.isUserRedEnvelope),
        couponId: this.couponId,
        jzdlId: localStorage.getItem("dlld"),
      };
      const that = this;
      ShopCart.getOrderOfShoppingCart(params)
        .then((res) => {
          // console.log(res);
          if (res.data.V) {
            this.orderID = res.data.V.orderID;
            const orderId = {
              orderId: this.orderID,
            };
            ShopCart.getCartIdsByOrderIdJZ(orderId)
              .then((res) => {
                const data = res.data;
                // this.cartID = data.V.substring(1, data.V.length - 1);
                // console.log(  data.V.substring(1, data.V.length - 1))
                const carID = {
                  orderID: this.orderID,
                };
                // 购买的课程的订单页面展示的数据
                ShopCart.getOrderDetialByOrderID(carID).then((res) => {
                  const data = res.data;
                  if (data.S == "1") {
                    that.xkwMoney = data.V.xkwMoney;
                    const orderDetail = [];
                    data.V.orderdetials.forEach((item, index) => {
                      orderDetail.push(item);
                    });
                    localStorage.setItem(
                      "orderDetail",
                      JSON.stringify(orderDetail)
                    );

                    var paySucc = {
                      price: this.lastMoney,
                      time: this.nowtime,
                      order: this.orderID,
                    };
                    localStorage.setItem("paySucc", JSON.stringify(paySucc));

                    // 1是支付宝 2是微信
                    if (this.radio == "1") {
                      // this.$router.push({name:"paySucc"})
                      const params = {
                        orderID: this.orderID,
                        itemIdStr: this.itemIdStr,
                        cartId: this.cartID,
                        price: this.lastMoney,
                        xkwMoney: "0",
                        domain: "360xkw.com",
                        suid: "0",
                        returnUrl: `${this.url}/grzx/#/paySucc`,
                      };
                      ShopCart.aliPay(params)
                        .then((res) => {
                          const data = res.data;
                          // console.log(data);

                          if (data.S == "1") {
                            var formHtml = data.V.HTML.split("<script>")[0];
                            localStorage.setItem("formHtml", formHtml);
                            this.$router.push({ name: "alipay" });
                          } else {
                            this.showVisible = true;
                            // Toast({
                            //   message: "获取支付宝支付失败",
                            //   position: "bottom",
                            // });
                          }
                        })
                        .catch(() => {
                          this.showVisible = true;
                          Toast({
                            message: "打开支付宝支付失败",
                            position: "bottom",
                          });
                        });
                    } else if (this.radio == "2") {
                      if (
                        this.url == "http://www.jszg.jx.cn" ||
                        this.url == "www.jszg.jx.cn"
                      ) {
                        const params = {
                          cartId: this.cartID,
                          courseId: this.courseId,
                          kcname: this.kname,
                          itemsId: this.itemIdStr,
                          orderID: this.orderID,
                          domain: "www.360xkw.com",
                          xkwMoney: this.xkwMoney,
                          suid: "0",
                        };
                        ShopCart.wxPay(params)
                          .then((res) => {
                            const data = res.data;
                            window.location.href = data.mweb_url;
                            // localStorage.setItem('wxInfo', JSON.stringify(data))
                            // this.$router.push({ name: "wxpay" });
                          })
                          .catch(() => {
                            this.showVisible = true;
                            Toast({
                              message: "打开微信支付失败",
                              position: "bottom",
                            });
                          });
                      } else {
                        Toast({
                          message: "该地区暂未开通微信支付!",
                          position: "bottom",
                        });
                        return;
                      }
                    }
                  } else {
                    this.showVisible = true;
                    Toast({ message: "订单号有误", position: "bottom" });
                  }
                });
              })
              .catch(() => {
                this.showVisible = true;
                Toast({ message: "订单号有误", position: "bottom" });
              });
          }
        })
        .catch((error) => {
          Toast.fail("请求失败");
        });
    },
    // 时间格式化
    currentTime() {
      var date = new Date();
      function getTimer() {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var w = date.getDay();
        var w1 = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ];
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var min = date.getMinutes();
        min = min < 10 ? "0" + min : min;
        var s = date.getSeconds();
        s = s < 10 ? "0" + s : s;

        return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s + "  ";
      }
      this.nowtime = getTimer();

      // console.log(this.nowtime)
    },
  },
};
</script>

<style>
.van-coupon-list__exchange-bar {
  display: none;
}
.submitOrderBox {
  width: 100%;
  height: 100vh;
  background: #f5f5f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.order_box {
  flex: 1;
  padding: 10px 12px;
  height: calc(100vh - 178px);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 200px;
}
.catConn_box_info {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 0.5px 10px 0px rgba(48, 48, 48, 0.04);
  /* width: 351px;
  height: 121px; */
  margin: 4px 0;
}
.catConn {
  /* border-bottom: 1px solid #ebebeb; */

  padding: 15px 6px;
}

.catBtn {
  width: calc(100% - 24px);
  height: 83px;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 12px;
}
.catConn {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  /* align-items: center; */
}
.carInfo {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}
.catImg {
  width: 120px;
  height: 90px;
}
.catImg img {
  width: 120px;
  height: 90px;
}
.carRightInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 10px;
}
.carRightInfo_conn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.carRightInfo_title {
  width: 154px;
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.carRightInfo_conn_price {
  font-size: 14px;
  color: #fc554c;
}

.carRightInfo_conn_price span {
  font-size: 16px;
  color: #fc554c;
}
.carRightInfo_conn_num {
  font-size: 12px;
  color: #333333;
}
.catBtn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.catBtn_left {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  color: #333333;
}
.checkall {
  padding-right: 12px;
}
.delete {
  /* line-height: 16px; */
  margin-left: 15px;
}
.catBtn_right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.catBtn_right_heji_price {
  font-size: 14px;
  color: #ff413a;
  padding-right: 10px;
}

.catBtn_right_btn {
  width: 87px;
  height: 36px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 18px;
  text-align: center;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
}
.coupon {
  width: 351px;
  height: 44px;
  margin-top: 10px;
  display: block;
}
.coupon_info {
  box-shadow: 0px 0.5px 10px 0px rgba(48, 48, 48, 0.04) !important;
  border-radius: 5px !important;
  /* background-color: #f5f5f5 !important; */

  /* margin: 10px 12px; */
}
.pay_methods {
  width: 351px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 5px;
  margin-top: 10px;
}
.pay_title {
  font-size: 14px;
  width: calc(351px - 14px);
  line-height: 38px;
  border-bottom: 1px solid #ebebeb;
  padding-left: 14px;
}
.redEnvelope {
  margin-top: 10px;
}
.pay_wx,
.pay_ali,
.pay_red {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  background-color: #fff;
}

.pay_ali_left,
.pay_wx_left,
.pay_red_left {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 12px;
}
.pay_img {
  width: 24.5px;
  height: 24.5px;
}
.pay_img img {
  width: 100%;
}
.pay_ali_right_check,
.pay_wx_right_check,
.pay_red_right_check {
  margin-right: 15.5px;
}
.pay_left_title {
  margin-left: 10.5px;
  font-size: 14px;
  color: #333333;
}
.submit {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 375px;
  height: 78px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
}
.sumbit_heji {
  font-size: 14px;
  color: #333333;
}
.sumbit_heji .submit_heji_fuhao {
  color: #ff413a;
}
.submit_order_btn {
  font-size: 14px;
  width: 87px;
  height: 36px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  line-height: 36px;
  text-align: center;
  border-radius: 18px;
  color: white;
  margin: 0 10px;
}
</style>
