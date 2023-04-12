<template>
  <div class="box">
    <Head></Head>
    <!-- <div class="catBox"> -->
    <!-- <div class="catConn_box"> -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        v-loading="Listloading"
        element-loading-text="数据加载中，请稍等..."
        empty-text="对不起，没有找到相关数据！"
      >
        <van-checkbox-group v-model="result" ref="checkboxGroup">
          <van-cell-group>
            <van-empty description="暂无商品" v-if="shopList.length == 0">
              <van-button round class="bottom-button" @click="gotokczx">
                去购买
              </van-button>
            </van-empty>
            <div
              v-else
              class="catConn_box_info"
              v-for="(val, index) in shopList"
              :key="index"
            >
              <div
                class="minBox"
                v-for="(shopdata, shopIndex) in val.item"
                :key="shopIndex"
                @click="toggle(shopdata, index)"
              >
                <div class="catConn">
                  <div class="checkone">
                    <template>
                      <van-checkbox
                        :name="val.id"
                        checked-color="#ff6949"
                        ref="checkboxes"
                      ></van-checkbox>
                    </template>
                  </div>
                  <div class="carInfo">
                    <div class="catImg">
                      <img :src="shopdata.bigPicUrl" alt />
                    </div>
                    <div class="carRightInfo">
                      <div class="carRightInfo_title">{{ shopdata.kcname }}</div>
                      <div class="carRightInfo_conn">
                        <div class="carRightInfo_conn_price">
                          ¥
                          <span>{{ shopdata.disPrice }}</span>
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
            </div>
          </van-cell-group>
        </van-checkbox-group>
      </van-list>
    </van-pull-refresh>
    <!-- </div> -->
    <!-- </div> -->

    <div class="catBtn">
      <div class="catBtn_left">
        <div class="checkall">
          <van-checkbox
            v-model="Allchecked"
            @click="AllcheckedClick(Allchecked)"
            checked-color="#ff6949"
          ></van-checkbox>
        </div>
        <span>全选</span>
        <span class="delete" @click="deleteClick">删除</span>
      </div>
      <div class="catBtn_right">
        <div class="catBtn_right_heji">
          合计：
          <span class="catBtn_right_heji_price">
            ¥
            <span>{{ totalPrice }}</span>
          </span>
        </div>
        <div class="catBtn_right_btn" @click="settlement">
          结算
          <span>{{ totalPrice }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShopCart from "@/api/gwc/gwc";
import { Checkbox, CheckboxGroup, Cell, CellGroup, Toast, Empty } from "vant";

export default {
  data() {
    return {
      result: [],
      checkedList: [],
      refreshing: false,
      checked: false,
      Allchecked: false,
      shopList: [],
      loading: false,
      Listloading: false,
      finished: false,
      totalPrice: 0,
    };
  },
  created() {
    this.gwcList();
  },
  methods: {
    onClickEditAddress() {},
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      // 加载状态结束
      this.loading = false;
      // 数据全部加载完成
      if (this.shopList.length >= this.shopList.length) {
        this.finished = true;
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.gwcList();
      this.onLoad();
    },
    gwcList() {
      this.Listloading = true;
      const params = {
        dlId: localStorage.getItem("dlld"),
        page: 1,
        limit: 10,
      };
      ShopCart.getShoppingCartDetial(params)
        .then((res) => {
          if (res.data.V) {
            this.shopList = res.data.V;
            this.shopList.forEach((e) => {
              e.item.bigPicUrl = "http://360xkw.com/" + e.item.bigPicUrl;
              e.item.checked = false;
              e.item = [e.item];
            });
          } else if (res.data.S === "0") {
            this.shopList = [];
          }
          if (this.shopList.length === 0) {
            this.Allchecked = false;
            this.$refs.checkboxGroup.toggleAll(false);
            this.totalPrice = 0;
          }
          this.Listloading = false;
        })
        .catch((error) => {
          Toast.fail("请求失败");
          this.Listloading = false;
        });
    },
    // 点击单个商品选中状态
    toggle(val, index) {
      const selecList = []; // 总共多少钱
      val.checked = !val.checked; //自己在数据内添加的选中状态参数
      this.$refs.checkboxes[index].toggle();
      this.checkedList = [];
      this.shopList.forEach((item) => {
        if (item.item[0].checked === true) {
          this.checkedList.push(item);
        }
      });
      this.checkedList.forEach((e) => {
        selecList.push(e.item[0].disPrice);
      });
      if (selecList.length !== 0) {
        this.totalPrice = eval(selecList.join("+"));
      } else {
        this.totalPrice = 0;
      }
      // 当商品单个选中时
      if (this.shopList.length === this.checkedList.length) {
        this.Allchecked = true;
      } else if (this.shopList.length > this.checkedList.length) {
        this.Allchecked = false;
      }
    },
    // 全选商品
    AllcheckedClick(val) {
      const selecList = []; // 总共多少钱
      this.totalPrice = [];
      if (val === true) {
        // 商品列表的全选状态触发打圈，然后计算选中后商品的价格
        this.$refs.checkboxGroup.toggleAll(true);
        this.shopList.forEach((e) => {
          e.item[0].checked = true;
          selecList.push(e.item[0].disPrice);
        });
        this.totalPrice = eval(selecList.join("+"));
      } else {
        // 取消全选，将所有状态归0
        this.$refs.checkboxGroup.toggleAll(false);
        this.shopList.forEach((item) => {
          item.item[0].checked = false;
        });
        this.totalPrice = 0;
      }
    },
    // 单个删除
    deleteClick() {
      const arr = [false];
      const finalArr = this.shopList.filter(
        (item) => !arr.includes(item.item[0].checked)
      ); // 获取选中的商品
      // console.log(finalArr);
      const id = [];
      finalArr.forEach((e) => {
        id.push(e.id);
      });
      id.forEach((ids) => {
        this.delShoppingCart(ids);
      });
    },
    // 单个删除接口
    delShoppingCart(id) {
      const params = {
        ids: id,
      };
      ShopCart.delShoppingCart(params)
        .then((res) => {
          // console.log(res);
          Toast.success("删除成功！");
        })
        .catch((error) => {
          Toast.fail("删除失败！");
        });
      this.gwcList();
    },
    settlement() {
      if (this.totalPrice === 0) {
        Toast("请选择课所要购买的课程");
      } else {
        const xuan = [];
        this.shopList.forEach((item) => {
          if (item.item[0].checked === true) {
            xuan.push(item);
          }
        });
        // console.log(xuan);
        this.$router.push({
          path: "/submitOrder",
          query: { data: JSON.stringify(xuan) },
        });
      }
    },
    gotokczx() {
      this.$router.push({ name: "kczx" });
    },
  },
};
</script>

<style scoped>
.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}

.bottom-button {
  width: 120px;
  height: 30px;
  background-image: linear-gradient(90deg, #ff403a, #ff6949);
  color: white;
}

.box {
  height: 100vh;
}
.van-pull-refresh {
  height: calc(100vh - 120px);
}
.van-pull-refresh {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.head {
  width: 100%;
  height: 47px;
  background-image: linear-gradient(90deg, #ff403a 0%, #ff6949 100%);
  color: white;
  text-align: center;
}
.catBox {
  height: calc(100vh - 150px);
  padding: 10px 12px;
  position: fixed;
  left: 0;
  top: 47px;
  width: 351px;
  background-color: rgb(241, 241, 240);
}
.catConn_box {
  /* width: calc(351px -24px); */
  height: 500px;
}
.catConn_box_info {
  background-color: #fdfdfd;
  /* box-shadow: 0px 0.5px 10px 0px rgba(48, 48, 48, 0.2); */
  border-radius: 5px;
}
.catConn {
  border-bottom: 1px solid #ebebeb;

  padding: 15px 6px;
}

.catBtn {
  width: calc(100% - 24px);
  height: 83px;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 0 12px;
}
.checkone {
  /* width: 32px; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.catConn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
</style>
