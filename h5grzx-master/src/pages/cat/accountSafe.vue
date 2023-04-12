<template>
  <div class="box">
    <Head></Head>
    <div class="account_info">
      <div class="info_unit border_bottom">
        <div class="unit_title">头像</div>
        <div class="unit_text">
          <div class="Avatar">
            <img
              v-if="userInfo && userInfo.bigImageUrl != undefined"
              :src="'http://img.360xkw.com/' + userInfo.bigImageUrl"
              alt=""
            />
            <img v-else src="../../img/wdkc/grzx/headpic@2x.png" alt />
          </div>
          <div class="icon_enter">
            <img src="../../img/login/icon_enter.png" alt />
          </div>
        </div>
      </div>
      <div class="info_unit border_bottom">
        <van-field
          disabled
          v-model="userInfo.account"
          label="登录名称"
          input-align="right"
        />
      </div>
      <div class="info_unit border_bottom">
        <van-field
          v-model="userInfo.nickName"
          label="昵称"
          @input="changeNickName(userInfo.nickName)"
          maxlength="8"
          placeholder="请输入昵称"
          input-align="right"
        />
      </div>
      <div class="info_unit">
        <van-field
          v-model="userInfo.fullName"
          label="真实姓名"
          maxlength="5"
          placeholder="请输入真实姓名"
          input-align="right"
          @blur="changeFullName(userInfo.fullName)"
        />
      </div>
      <div class="info_unit margin_top">
        <div class="unit_title">手机号</div>
        <div class="unit_text">
          <div class="input">
            <van-field
              placeholder="请输入手机号"
              maxlength="11"
              clearable
              type="number"
              left-icon
              input-align="right"
              v-model="userInfo.phone"
              @blur="changePhone(userInfo.phone)"
            />
          </div>
          <!-- <div class="icon_enter">
            <img src="../../img/login/icon_enter.png" alt />
          </div> -->
        </div>
      </div>
      <div class="info_unit">
        <div class="unit_title">账户密码</div>
        <div class="unit_text">
          <div class="text text_orange" @click="goResetPassword">修改密码</div>
        </div>
      </div>
      <div class="info_unit margin_top border_bottom">
        <van-field
          label-width="230"
          readonly
          clickable
          name="picker"
          :value="value"
          label="性别"
          placeholder="请选择性别"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="changeGender"
            @cancel="showPicker = false"
          />
        </van-popup>
        <div class="icon_enter">
          <img src="../../img/login/icon_enter.png" alt />
        </div>
      </div>

      <div class="info_unit border_bottom">
        <van-field
          v-model="userInfo.qq"
          type="text"
          label="QQ"
          @blur="changeQq(userInfo.qq)"
          input-align="right"
          maxlength="13"
          placeholder="请输入QQ"
        />
      </div>

      <div class="info_unit border_bottom">
        <van-field
          v-model="userInfo.email"
          type="text"
          label="邮箱"
          @blur="changeEmail(userInfo.email)"
          input-align="right"
          placeholder="请输入邮箱"
        />
      </div>
    </div>
    <div class="button_box">
      <van-button class="accountSaveBtn" @click="editUserInfo">保存</van-button>

      <van-button
        type="primary"
        size="large"
        plain
        class="accountSignOutBtn"
        @click="signOut"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import Login from "@/api/login/login";
import Car from "@/api/car/car";
import { Toast, Dialog, Button } from "vant";
export default {
  data() {
    return {
      value: "",
      columns: ["保密", "男", "女"],
      fullName: "",
      showPicker: false,
      userInfo: [],
      password: "",
      nickName: "", //昵称
      fullName: "", //真实姓名
      phone: "", //手机号
      gender: "", //性别
      qq: "", //qq
      email: "", //邮箱
      account: "",
      password: "",
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
        ? JSON.parse(localStorage.getItem("userInfo"))
        : [];
    },
    getUserInfoGender(value) {
      // console.log("getUserInfoGender", value);

      if (value == "0") {
        this.value = "保密";
        value = this.value;
        this.changeGender(value);
      } else if (value == "1") {
        this.value = "男";
        value = this.value;

        this.changeGender(value);
      } else if (value == "2") {
        this.value = "女";
        value = this.value;
        this.changeGender(value);
      }
    },
    changeGender(value) {
      // console.log("changeGender", value);
      this.value = value;
      this.showPicker = false;
      if (this.value == "保密") {
        this.gender = 0;
        value = this.value;
      } else if (this.value == "男") {
        this.gender = 1;
        value = this.value;
      } else if (this.value == "女") {
        this.gender = 2;
        value = this.value;
      }
    },
    goResetPassword() {
      this.$router.push({ name: "resetPassword" });
    },
    changeNickName(nickName) {
      this.nickName = nickName;
    },
    changeFullName(fullName) {
      this.fullName = fullName;
    },
    changePhone(phone) {
      this.phone = phone;
      this.userInfo.phone = phone;
      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      if (!/^1[3456789]\d{9}$/.test(this.phone) || !this.phone) {
        Toast({ message: "手机格式有误", position: "bottom" });
      } else {
        this.phone = phone;
      }
    },
    changeQq(qq) {
      this.qq = qq;
      if (!/[1-9][0-9]{4,}/.test(this.qq) || !this.qq) {
        Toast({ message: "QQ格式有误", position: "bottom" });
      } else {
        this.qq = qq;
      }
    },
    changeEmail(email) {
      this.email = email;
      if (
        !/^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/.test(this.email) ||
        !this.email
      ) {
        Toast({ message: "邮箱格式有误", position: "bottom" });
      } else {
        this.email = email;
      }
    },
    editUserInfo() {
      const params = {
        account: this.userInfo.account,
        nickName: this.nickName,
        fullName: this.fullName,
        phone: this.phone,
        gender: this.gender,
        qq: this.qq,
        email: this.email,
      };
      Car.accountSafe(params)
        .then((res) => {
          const data = res.data;
          if (data.S == "1") {
            Toast({ message: "保存成功", position: "bottom" });
            this.$router.push({name:"grzx"})
            this.$forceUpdate();
            this.signIn();
          } else {
            Toast({ message: "保存失败", position: "bottom" });
          }
        })
        .catch((error) => {
          Toast({ message: "保存失败", position: "bottom" });
          // console.log("编辑user出错");
        });
    },
    signOut() {
      Car.signOut()
        .then((res) => {
          // console.log(res);
          if (res.data.S == "1") {
            Toast({ message: res.data.msg, position: "bottom" });
            localStorage.clear();
            this.$router.push({ name: "login" });
          } else {
            Toast({ message: "退出出错", position: "bottom" });
          }
        })
        .catch(() => {
          Toast({ message: "退出出错", position: "bottom" });
          // console.log("退出出错");
        });
    },
    signIn() {
      const params = {
        account: this.account,
        password: this.password,
      };
      Login.login(params)
        .then((res) => {
          const data = res.data;
          if (data.S == "1000") {
            localStorage.setItem("userInfo", JSON.stringify(data.V));
            this.getUserInfo();
          } else {
            if (data.S == "1005" || data.S == "1002")
              Toast.fail("账户密码有误");
          }
        })
        .catch((error) => {
             Toast({ message: "数据出错", position: "bottom" });
        });
    },
  },
  mounted() {
    this.getUserInfo();
    if (
      !this.userInfo ||
      this.userInfo == "" ||
      this.userInfo == undefined ||
      this.userInfo == null
    ) {
      Toast({ message: "您还未登录", position: "bottom" });
      return false;
    }
    this.getUserInfoGender(this.userInfo.gender);
    this.changeNickName(this.userInfo.nickName);
    this.changeFullName(this.userInfo.fullName);
    this.changePhone(this.userInfo.phone);
    this.changeQq(this.userInfo.qq);
    this.changeEmail(this.userInfo.email);
    this.account = this.userInfo.account;
    this.password = this.userInfo.password;
  },
};
</script>

<style>
.van-cell--clickable .van-cell__value .van-field__body .van-field__control {
  text-align: right;
}
.van-cell:after {
  border: none;
}
.van-button--plain.van-button--primary {
  color: #ff6949 !important;
}

.van-field__control {
  border: none !important;
}
</style>

<style scoped>
.box {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f6;
}
.account_info {
  width: 100%;
  background-color: #f5f5f6;
}
.info_unit {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 45px;
  padding: 0 15px;
}
.border_bottom {
  border-bottom: 1px solid #ebebeb;
}
.margin_top {
  margin-top: 10px;
}
.unit_title {
  font-size: 14px;
  color: #666666;
  /* margin-left: 15px; */
}
.unit_text {
  /* margin-right: 21px; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.text {
  color: #bfbfbf;
}
.text_black {
  color: #333333;
}
.text_orange {
  font-size: 14px;
  color: #ff443c;
}
.Avatar {
  width: 30px;
  height: 30px;
}
.Avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.icon_enter {
  width: 10px;
  height: 10px;
  margin-left: 10.5px;
}
.icon_enter img {
  width: 100%;
  height: 100%;
}
.input {
  width: 100px;
}
.van-cell {
  padding: 0;
}
.button_box {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.accountSaveBtn {
  width: 343px;
  height: 40px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 3px;
  margin: 0 auto;
  margin-top: 55px;
  text-align: center;
  line-height: 40px;
  color: white;
  font-size: 16px;
}

.accountSignOutBtn {
  width: 343px;
  height: 40px;
  border: 1px #ff6949 solid;
  text-align: center;
  line-height: 40px;
  color: #ff6949;
  font-size: 16px;
  margin: 0 auto;
  margin-top: 16px;
}
</style>
