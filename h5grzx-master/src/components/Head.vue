<template>
  <div class="Headersear">
    <van-sticky>
      <div class="home">
        <a href="/">
          <div class="title">
            <div class="icon_home">
              <img src="../img/cat/home.png" alt />
            </div>
            <div class="text" @click="gotohome">
              {{ selList1.name || "" }}教师资格网
            </div>
          </div></a
        >
        <div class="head_right">
          <div class="search">
            <img src="../img/cat/search.png" alt />
          </div>
          <!-- 没有登录的状态 -->
          <div class="btn" v-if="!userInfo">
            <div class="login" @click="gotologin">登录</div>
            <div class="register" @click="gotoregister">注册</div>
          </div>
          <!-- 登录状态 -->
          <div class="btn" v-else>
            <div class="register" @click="gogrzx">个人中心</div>
          </div>
        </div>
      </div>
    </van-sticky>
  </div>
</template>
<script>
import { Toast, Dialog } from "vant";
// 获取登录api
import Login from "@/api/login/login";
export default {
  data() {
    return {
      userInfo: [],
      url: "",
      webname1: "",
      selList1: "",
    };
  },
  methods: {
    gotohome() {},
    gotologin() {
      this.$router.push({ path: "login" });
    },
    gogrzx() {
      if (this.$route.name == "grzx") {
        Toast({
          message: "您已经在此页面",
          position: "bottom",
        });
      } else {
        this.$router.push({ path: "grzx" });
      }
    },
    gotoregister() {
      this.$router.push({ path: "register" });
    },
    // 检查过期
    getStorageExpire(key) {
      const val = localStorage.getItem(key);
      if (val != null) {
        this.storageInfo = JSON.parse(val);
        const timeSpan = Date.now() - this.storageInfo.time;

        if (timeSpan > this.storageInfo.expire) {
          localStorage.removeItem(key);
          return null;
        }

        return this.storageInfo.data;
      }
      return null;
    },
    getUserInfo() {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (
        this.$route.name == "grzx" &&
        !JSON.parse(localStorage.getItem("userInfo"))
      ) {
        this.$router.push({ path: "grzx" });
      } else if (!JSON.parse(localStorage.getItem("userInfo"))) {
        // console.log(this.userInfo);

        Toast({
          message: "您还未登录！",
          position: "bottom",
        });
        this.$router.push({ path: "login" });
      } else {
        this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
          ? JSON.parse(localStorage.getItem("userInfo"))
          : [];
      }
    },
  },
  mounted() {
    this.url = window.location.href.split("/grzx/")[0];
    this.getUserInfo();
    this.getStorageExpire("checkuserInfo");
    this.selList1 = JSON.parse(localStorage.getItem("selList"));

    var num = 0;
    setInterval(() => {
      if (this.getStorageExpire("expireLoin") === null) {
        if (
          this.$route.name == "login" ||
          this.$route.name == "register" ||
          this.$route.name == "resetpass"
        ) {
          // console.log(num++);
        } else {
          localStorage.removeItem("userInfo");
          Dialog.alert({
            title: "提醒",
            message: "登录已过期，请重新登录",
            confirmButtonText: "去登录",
          }).then(() => {
            this.$router.push({
              name: "login",
              params: { url: this.$route.name },
            });
          });
        }
      }
    }, 1000 * 60 * 60 * 24);
    // }, 1000);
  },
};
</script>
<style scoped>
.home {
  width: 100%;
  height: 47px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(90deg, #ff403a 0%, #ff6949 100%);
}
.title {
  display: flex;
  flex-direction: row;
  color: white;
  font-size: 14px;
  margin-left: 17.5px;
}
.icon_home {
  width: 18.5px;
  height: 17.5px;
}
.icon_home img {
  width: 100%;
  height: 100%;
}
.text {
  margin-left: 6px;
}
.head_right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 12px;
}
.search {
  width: 18.5px;
  height: 17.5px;
  /* margin-left: 57px; */
}
.search img {
  width: 100%;
  height: 100%;
}
.btn {
  color: #ff423b;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 25px;
}
.login,
.register {
  padding: 8px 16px;
  border-radius: 2px;
  background-color: #fff;
  text-align: center;
  /* line-height: 28px; */
}
.register {
  margin-left: 10px;
}

.register:hover,
.login:hover {
  animation: touchMOve 0.2s;
}
@keyframes touchMOve {
  0% {
    background-color: #fff;
  }
  50% {
    background: rgb(226, 226, 226);
  }
  100% {
    background-color: #fff;
  }
}
</style>
