<template>
  <div>
    <!-- tit块 -->
    <div class="title">
      <div class="logo">
        <img src="../../img/login/welcome.png" alt />
      </div>
      <div class="title_text">欢迎来到浙江教师资格网</div>
    </div>
    <!-- 表单块 -->
    <div class="formInfo">
      <div class="formInfoBox">
        <van-field
          class="username"
          placeholder="请输入账户"
          maxlength="11"
          v-model="resetList.account"
          @blur="resetAccount(resetList.account)"
        />
      </div>

      <div class="formInfoBox formInfoCodeBox">
        <van-field
          class="imgcode"
          placeholder="请输入图形验证码"
          maxlength="4"
          v-model="resetList.imgcode"
          @blur="resetImgcode(resetList.imgcode)"
        />
        <div class="imgcode_box" @click="changeImgcode">
          <img
            :src="
              '/360xkw/front/verificationCode/getRandomCharCodeNoLogin.do?' +
              resetList.gyh_time_params
            "
          />
        </div>
      </div>

      <div class="formInfoBox">
        <van-field
          class="codecms"
          center
          clearable
          placeholder="请输入短信验证码"
          v-model="resetList.regcode"
          @blur="resetRegcode(resetList.regcode)"
        >
          <template #button>
            <van-button
              class="codebtn"
              size="small"
              @click="getRegcode"
              :disabled="flag"
              >{{ msg }}</van-button
            >
          </template>
        </van-field>
      </div>
      <div class="formInfoBox">
        <van-field
          class="password"
          placeholder="请输入密码"
          type="password"
          maxlength="16"
          v-model="resetList.password"
          @blur="resetPassword(resetList.password)"
        />
      </div>
    </div>
    <!-- 重置块 -->
    <div class="loginInfo">
      <van-button class="loginBtn" block @click="resetpass">重置</van-button>
      <div class="haveAccount" @click="gotologin">
        已有账号,去
        <span>登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import Login from "@/api/login/login";
export default {
  name: "resetpass",
  data() {
    return {
      msg: "发送验证码",
      flag: false,
      resetList: {
        account: "",
        imgcode: "",
        gyh_time_params: "",
        regcode: "",
        password: "",
      },
    };
  },
  mounted() {},
  methods: {
    //得到手机验证码
    getRegcode() {
      // this.flag = !this.flag;
      const params = {
        phone: this.resetList.account,
        verifiyCode: this.resetList.imgcode,
      };
      Login.getRegcode(params)
        .then((res) => {
          // console.log(res);
          if (res.data.S == "1") {
            var num = 60;
            // console.log(this.flag);

            this.msg = `重新发送( ${num} )s`;
            this.flag = true;

            var gyh_timer = setInterval(() => {
              num--;
              if (num > 0) {
                this.msg = `重新发送( ${num} ) s`;
              } else {
                this.flag = false;
                this.msg = "发送验证码";
                clearInterval(gyh_timer);
              }
            }, 1000);

            Toast({ message: "已经发送到您手机", position: "bottom" });
          } else {
            Toast({ message: res.data.msg, position: "bottom" });
          }
        })
        .catch(() => {
           Toast({ message: "获取手机验证码出错", position: "bottom" });
        });
    },
    // 获取图形验证码
    getImgcode() {
      let date = new Date();
      this.resetList.gyh_time_params = dateFormat("YYYYmmddHHMMSS", date);
      // console.log(gyh_time_params);
      // 格式化时间
      function dateFormat(fmt, date) {
        let ret;
        const opt = {
          "Y+": date.getFullYear().toString(), // 年
          "m+": (date.getMonth() + 1).toString(), // 月
          "d+": date.getDate().toString(), // 日
          "H+": date.getHours().toString(), // 时
          "M+": date.getMinutes().toString(), // 分
          "S+": date.getSeconds().toString(), // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
            fmt = fmt.replace(
              ret[1],
              ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
            );
          }
        }
        return fmt;
      }
    },
    // 刷新验证码
    changeImgcode() {
      this.getImgcode();
    },
    // 重置账号
    resetAccount(account) {
      // console.log(account);
      if (
        !/^1[3456789]\d{9}$/.test(this.resetList.account) ||
        !this.resetList.account
      ) {
        Toast({ message: "账户格式有误", position: "bottom" });
        return false;
      }
    },
    // 重置图形验证码
    resetImgcode(imgcode) {
      if (!this.resetList.imgcode || this.resetList.imgcode == "") {
        Toast({ message: "图形验证码不能为空", position: "bottom" });
      }
    },
    // 重置手机验证码
    resetRegcode(regcode) {
      if (!this.resetList.regcode || this.resetList.regcode == "") {
        Toast({ message: "手机验证码不能为空", position: "bottom" });
        return false;
      }
    },
    // 重置密码
    resetPassword(password) {
      if (
        !/^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,16}$/.test(
          this.resetList.password
        ) ||
        !this.resetList.password
      ) {
        Toast({ message: "密码6-16个字符", position: "bottom" });
        return false;
      } else {
      }
    },
    // 重置
    resetpass() {
      if (this.resetList.account == "") {
        this.resetAccount();
      } else if (this.resetList.imgcode == "") {
        this.resetImgcode();
      } else if (this.resetList.regcode == "") {
        this.resetRegcode();
      } else if (this.resetList.password !== "") {
        this.resetPassword();
        const params = {
          phone: this.resetList.account,
          newPassword: this.resetList.password,
          checksms: this.resetList.regcode,
        };
        Login.resetpass(params)
          .then((res) => {
            const data = res.data;
            if (data.S == "1") {
              Toast({ message: "重置密码成功", position: "bottom" });
                this.$router.push({ name: "login", query: { username: this.resetList.account } });
            } else {
              Toast({ message: "重置密码失败", position: "bottom" });
            }
          })
          .catch(() => {
            Toast({ message: "重置密码出错", position: "bottom" });
          });
      } else {
        Toast({ message: "信息请填写完整", position: "bottom" });
      }
    },
    // 已经账号去登录
    gotologin() {
      this.$router.push({ path: "login" });
    },
  },
};
</script>
<style scoped>
.van-field__control {
  border: none !important;
}
</style>
<style scoped>
input {
  outline: none !important;
}
.head {
  width: 100%;
  height: 47px;
  background-image: linear-gradient(90deg, #ff403a 0%, #ff6949 100%);
  color: white;
  text-align: center;
}
.title {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
  margin-top: 34px;
}
.logo {
  width: 39px;
  height: 44px;
  margin-left: 31px;
}
.logo img {
  width: 100%;
}
.title_text {
  font-size: 18px;
  color: #333333;
  font-weight: 600;
  line-height: 17.5px;
  margin-left: 10.5px;
}
.formInfo {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.username,
.codecms,
.password,
.password2,
.city,
.imgcode {
  width: 310px;
  height: 42px;
  background-color: #f5f5f5;
  border-radius: 21px;
}
.formInfoBox {
  margin: 10px 0px;
}
.formInfoCodeBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 310px;
}
.imgcode {
  width: 205px;
  margin-right: 15px;
}

.formInfoBox {
  margin: 10px 0px;
}
.imgcode_box {
  width: 90px;
  height: 33px;
  background-color: #999999;
}
.imgcode_box img {
  width: 100%;
  height: 100%;
}
.codebtn {
  font-size: 14px;
  color: #ff4e35;
  line-height: 13.5px;
  background-color: rgba(0, 0, 0, 0);
  border: none;
}
.cityBox {
  position: relative;
}
.city_left_icon {
  position: absolute;
  right: 18.5px;
  top: 17px;
  width: 10.5px;
  height: 10.5px;
}
.city_left_icon img {
  width: 100%;
}
.registerKnow {
  text-align: left;
  font-size: 14px;
  color: #333333;
  margin-left: 48.5px;
}
.registerKnow span {
  cursor: pointer;
  font-size: 14px;
  color: #ff4e35;
}
.loginInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  width: 100%;
}
.loginBtn {
  width: 310px;
  height: 42px;
  background-image: linear-gradient(0deg, #ff443b 0%, #ff6848 100%);
  border-radius: 21px;
  text-align: center;
  line-height: 42px;
  margin: 0 auto;
  font-size: 16px;
  color: #ffffff;
  margin-top: 34px;
}
.haveAccount {
  padding: 0 51px;
  font-size: 14px;
  align-items: center;
  color: #333333;
  margin: 0 auto;
  margin-top: 15px;
}
.haveAccount span {
  color: #ff463c;
}
</style>
