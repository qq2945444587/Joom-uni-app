<template>
  <div>
    <!-- tit块 -->
    <div class="title">
      <div class="logo">
        <img src="../../img/login/welcome.png" alt />
      </div>
      <div class="title_text">欢迎来到{{selList.name||''}}教师资格网</div>
    </div>
    <!-- 表单块 -->
    <div class="fromInfo">
      <div class="fromInfoBox">
        <van-field
          class="username"
          placeholder="请输入账户"
          v-model="username"
          maxlength="11"
        />
      </div>
      <div class="fromInfoBox">
        <van-field
          class="password"
          type="password"
          placeholder="请输入密码"
          maxlength="16"
          v-model="password"
        />
      </div>
    </div>
    <!-- 登录块 -->
    <div class="loginInfo">
      <van-button class="loginBtn" block @click="login">登录</van-button>
      <div class="haveAccount">
        <span @click.stop="gotoforgetPassword">忘记密码</span>
        <span @click.stop="gotozhuche">免费注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import Login from "@/api/login/login";
export default {
  name: "grzxIndex",
  components: {},
  filters: {},
  provide() {
    return {};
  },
  data() {
    return {
      username: "",
      password: "",
      json: require("../../../static/dlId.json"),
      webname: "",
      selList:"",
    };
  },
  methods: {
    // 站点id
    dlid() {
      var dlidId = window.location.href.split("/")[2];
      let contyindex = this.json.findIndex((item) => item.conty === dlidId);
      if (contyindex !== -1) {
        localStorage.setItem("dlld", this.json[contyindex].dlld);
        localStorage.setItem("selList", JSON.stringify(this.json[contyindex]));
        
      }
    },
    // 去登录
    login() {
      if (!/^1[3456789]\d{9}$/.test(this.username) || !this.username) {
        Toast({ message: "账户格式有误", position: "bottom" });
      } else {
        if (
          !(
            /^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,16}$/.test(this.password) ||
            !this.password
          )
        ) {
          Toast({ message: "密码只能6-16个字符", position: "bottom" });
        } else {
          let params = {
            account: this.username,
            password: this.password,
          };
          Login.login(params)
            .then((res) => {
              const data = res.data;
              if (data.S == "1000") {
                localStorage.setItem("userInfo", JSON.stringify(data.V));
                //  this.setStorageExpire('checkuserInfo', JSON.stringify(data.V), 120)
                Toast.success("登录成功");
                this.setStorageExpire(
                  "expireLoin",
                  "登录过期时间（分钟）",
                  168
                );
                this.$router.push({ name: "grzx" });
                // window.location.href = document.referrer;
              } else {
                if (data.S == "1005" || data.S == "1002") {
                  Toast({ message: "账户密码有误", position: "bottom" });
                } else if (data.S == "1004") {
                  Toast({ message: "您当前账号未注册!", position: "bottom" });
                }
              }
            })
            .catch((error) => {
              Toast({ message: "系统崩溃", position: "bottom" });
              // console.log("错误");
            });
        }
      }
    },
    // 设置过期
    setStorageExpire(key, value, expire) {
      const obj = {
        data: value,
        time: Date.now(),
        expire: 1000 * 60 * 60 * expire, // 单位是小时
        // expire: 1000 * expire, // 单位是S
      };
      localStorage.setItem(key, JSON.stringify(obj));
    },

    // 已经账号去登录
    gotologin() {
      this.$router.push({ path: "login" });
    },
    gotozhuche() {
      this.$router.push({ path: "register" });
    },
    gotoforgetPassword() {
      this.$router.push({ path: "resetpass" });
    },
  },
  created() {
    this.dlid();
    this.selList=JSON.parse( localStorage.getItem("selList"))
    // console.log(this.$route.query.username);
    this.username = this.$route.query.username
      ? this.$route.query.username
      : "";
    // this.webname=webnametext.name?webnametext.name:"安徽"
  },
};
</script>
<style >
.van-field__control {
  border: none !important;
}
</style>
<style scoped>
.van-field__control {
  border: none !important;
}
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
.fromInfo {
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
.city {
  width: 310px;
  height: 42px;
  background-color: #f5f5f5;
  border-radius: 21px;
}
.fromInfoBox {
  margin: 10px 0px;
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
  color: #ff463c;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
</style>
