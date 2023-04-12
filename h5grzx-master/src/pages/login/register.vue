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
          v-model="regiList.account"
          @blur="regiAccount(regiList.account)"
        />
      </div>
      <div class="formInfoBox formInfoCodeBox">
        <van-field
          class="imgcode"
          placeholder="请输入图形验证码"
          v-model="regiList.imgcode"
          @blur="regiImgcode(regiList.imgcode)"
          maxlength="4"
        />
        <div class="imgcode_box" @click="changeImgcode">
          <img
            :src="
              '/360xkw/front/verificationCode/getRandomCharCodeNoLogin.do?' +
              regiList.gyh_time_params
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
          v-model="regiList.regcode"
          @blur="regiRegcode(regiList.regcode)"
        >
          <template #button>
            <van-button
              class="codebtn"
              size="small"
              :disabled="flag"
              @click="getRegcode"
              >{{ msg }}</van-button
            >
          </template>
        </van-field>
      </div>
      <div class="formInfoBox">
        <van-field
          class="password"
          type="password"
          placeholder="请输入6位以上的密码"
          maxlength="16"
          v-model="regiList.password"
          @blur="regiPassword(regiList.password)"
        />
      </div>
      <div class="formInfoBox">
        <van-field
          class="password2"
          type="password"
          placeholder="确认密码"
          maxlength="16"
          v-model="regiList.password2"
          @blur="regiPassword2(regiList.password2)"
        />
      </div>
    </div>
    <!-- 注册块 -->
    <div class="loginInfo">
      <!-- 注册须知 -->
      <!-- <div class="registerKnow">
        注册即表示接受
        <span>《注册协议》</span>
      </div> -->
      <van-button class="loginBtn" block @click="register"> 注册</van-button>
      <div class="haveAccount" @click="gotologin">
        已有账号，去
        <span>登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import Login from "@/api/login/login";
export default {
  name: "register",
  data() {
    return {
      value: "",
      msg: "发送验证码",
      flag: false,
      regiList: {
        account: "",
        gyh_time_params: "",
        imgcode: "",
        regcode: "",
        password: "",
        password2: "",
      },
    };
  },
  methods: {
    // 注册账户
    regiAccount(account) {
      if (!/^1[3456789]\d{9}$/.test(this.regiList.account) || !this.regiList.account) {
        Toast({ message: "账户格式有误", position: "bottom" }); 
           return false;
      }else{

      }
    },
    // 注册图形验证码
    regiImgcode(imgcode) {
      if (!this.regiList.imgcode || this.regiList.imgcode == "") {
        Toast({ message: "图形验证码不能为空", position: "bottom" });
      }
    },
    // 获取图形验证码
    getImgcode() {
      let date = new Date();
      this.regiList.gyh_time_params = dateFormat("YYYYmmddHHMMSS", date);
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
    // 点击改变图形验证码
    changeImgcode() {
      this.getImgcode();
    },
    // 注册手机验证码
    regiRegcode(regcode) {
      if (!this.regiList.regcode || this.regiList.regcode == "") {
        Toast({ message: "手机验证码不能为空", position: "bottom" });
          return false;
      } else {
        

      }
    },
    //得到手机验证码
    getRegcode() {
      // this.flag = !this.flag;
      const params = {
        phone: this.regiList.account,
        verifiyCode: this.regiList.imgcode,
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
    // 注册密码
    regiPassword(password) {
      if (
        !/^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,16}$/.test(this.regiList.password) ||
        !this.regiList.password
      ) {
        Toast({ message: "密码6-16个字符", position: "bottom" });
         return false;
      }else{
         

      }
    },
    // 注册确认密码
    regiPassword2(password2) {
      if (
        !/^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,16}$/.test(this.regiList.password2) ||
        !this.regiList.password2
      ) {
        Toast({ message: "密码6-16个字符", position: "bottom" });
      } else {
        if (this.regiList.password2 !== this.regiList.password) {
          Toast({ message: "两次密码不一致", position: "bottom" });  
          return false;
        } else {
        
        }
      }
    },
    //注册
    register() {
      if (this.regiList.account == "") {
        this.regiAccount();
      } else if (this.regiList.imgcode == "") {
        this.regiImgcode();
      } else if (this.regiList.regcode == "") {
        this.regiRegcode();
      } else if (this.regiList.password == "") {
        this.regiPassword();
      } else {
        this.regiPassword2();
        const params = {
          account: this.regiList.account,
          password: this.regiList.password,
          checksms: this.regiList.regcode,
          flagSource: "1",
          suid: "0",
          dlld: localStorage.getItem("dlld"),
        };
        Login.register(params)
          .then((res) => {
            const data = res.data;
            if (data.S == "1") {
              Toast({ message: "注册成功", position: "bottom" });
                this.$router.push({ name: "login", query: { username:this.regiList.account } });
            } else if (data.S == "0" || data.S == "1002" || data.S == "-1") {
              Toast({ message: "注册错误", position: "bottom" });
            } else if (data.S == "1005") {
              Toast({ message: "此账号已经被注册", position: "bottom" });
            } else if (data.S == "1001") {
              Toast({ message: "注册超时，请稍后再试试吧", position: "bottom" });
            } else if (data.S == "1003" || data.S == "1004") {
              Toast({ message: "发送的验证码验证不一致", position: "bottom" });
            } else if (data.S == "1006") {
              Toast({ message: "密码或账号错误，请检查一下吧", position: "bottom" });
            }
          })
          .catch(() => {
            Toast({ message: "注册系统出错", position: "bottom" });
            // console.log("注册系统出错");
          });
      }
    },
    // 已经账号去登录
    gotologin() {
      this.$router.push({ path: "login" });
    },
  },
  mounted() {
    this.getImgcode();
  },
};
</script>
<style scoped>
.van-field__control {
  border: none !important;
}
</style>
<style scoped>
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
  margin: 0 auto;
  margin: 15px;
  font-size: 14px;
  color: #333333;
  text-align: center;
}
.haveAccount span {
  color: #ff463c;
}
input {
  outline: none !important;
}
</style>
