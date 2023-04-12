<template>
  <div class="box">
    <Head></Head>
    <div class="info_unit border_bottom">
      <van-field
        v-model="oldPassword"
        type="password"
        label="原密码"
        input-align="right"
        maxlength="13"
        placeholder="请输入原密码"
        @input="getOldPassword(oldPassword)"
      />
    </div>
    <div class="info_unit border_bottom margin-top">
      <van-field
        v-model="newPassword"
        type="password"
        label="新密码"
        input-align="right"
        maxlength="13"
        placeholder="请输入新密码"
        @input="getNewPassword(newPassword)"
      />
    </div>
    <div class="info_unit border_bottom">
      <van-field
        v-model="confirmNewPassword"
        type="password"
        label="确认新密码"
        input-align="right"
        maxlength="13"
        placeholder="请再次输入新密码"
        @input="getConfirmNewPassword(confirmNewPassword)"
      />
    </div>
    <div class="btn_box">
      <van-button class="confirmBtn" @click="resetPassword"
        >确认修改</van-button
      >
    </div>
  </div>
</template>
<script>
import { Buttom, Toast } from "vant";
import Head from "../../components/Head.vue";
import Car from "@/api/car/car";
export default {
  data() {
    return {
      userInfo: [],
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
  },

  //
  methods: {
    getOldPassword(value) {
      this.oldPassword = value;
    },
    getNewPassword(value) {
      this.newPassword = value;
    },
    getConfirmNewPassword(value) {
      this.confirmNewPassword = value;
    },
    resetPassword() {
      // 原始密码
      if (
        !/^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,16}$/.test(this.oldPassword) ||
        !this.oldPassword
      ) {
        Toast({ message: "密码只能6-16个字符", position: "bottom" });
      } else {
        if (this.oldPassword !== this.userInfo.password) {
          Toast({ message: "原密码输入错误", position: "bottom" });
        } else {
          if (
            !/^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,16}$/.test(this.newPassword) ||
            !this.newPassword
          ) {
            Toast({ message: "新密码只能6-16个字符", position: "bottom" });
          } else {
            if (
              !/^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,16}$/.test(
                this.confirmNewPassword
              ) ||
              !this.confirmNewPassword
            ) {
              Toast({ message: "密码只能6-16个字符", position: "bottom" });
            } else {
              if (this.newPassword !== this.confirmNewPassword) {
                Toast({ message: "两次新密码不一致", position: "bottom" });
              } else {
                const params = {
                  account: this.userInfo.account,
                  password: this.confirmNewPassword,
                };
                Car.resetPassword(params)
                  .then((res) => {
                    const data = res.data;
                    if (data.S == "1") {
                      Car.signOut(data)
                        .then((res) => {
                          if (res.data.S == "1") {
                            Toast({ message: "修改成功", position: "bottom" });
                            localStorage.clear();
                            this.$router.push({ name: "login" });
                          } else {
                            Toast({ message: "修改出错", position: "bottom" });
                          }
                        })
                        .catch(() => {
                              Toast({ message: "退出登录出错", position: "bottom" });
                        });
                    }
                  })
                  .catch(() => {
                    Toast({ message: "修改密码出错", position: "bottom" });
                    // console.log("修改密码出错");
                  });
              }
            }
          }
        }
      }
    },
    getUserInfo() {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>
<style  scoped>
.box {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f6;
}
.info_unit {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 45px;
  /* padding: 0 15px; */
}
.border_bottom {
  border-bottom: 1px solid #ebebeb;
}
.margin-top {
  margin-top: 10px;
}
.btn_box {
  width: 100%;
  display: flex;
  justify-content: center;
}
.confirmBtn {
  width: 343px;
  height: 40px;
  background-image: linear-gradient(0deg, #ff403a 0%, #ff6949 100%);
  border-radius: 3px;
  margin-top: 55px;
  text-align: center;
  line-height: 40px;
  color: white;
  font-size: 16px;
  overflow: hidden;
}
</style>