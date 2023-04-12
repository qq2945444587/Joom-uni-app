<template>
  <!-- 拖拽机器人 -->
  <div
    class="bilibili"
    :style="{top:position.y+'px', left:position.x+'px'}"
    @touchstart.stop="touchstart"
    @touchmove.stop="touchmove"
    @touchend.stop="touchend"
  >
    <img :src="bilibili1" alt />
  </div>
</template>
<script>
import bilibili1 from "../../img/cat/catimg.png";
var dx, dy;
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
// import { mapState } from "vuex";
export default {
  mounted() {},
  // component: {
  //   ...mapState(["checked"])
  // },
  methods: {
    touchstart() {
      this.checked = true;
      if (this.checked) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
      }
    },
    touchmove(e) {
      if (this.checked) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        var maxw = document.querySelector(".bilibili").offsetWidth / 2;
        // 定位滑块的位置
        this.position.x = touch.clientX - maxw;
        this.position.y = touch.clientY - maxw;
        // 限制滑块超出页面
        // console.log('屏幕大小', screenWidth, screenHeight )
        if (this.position.x < 0) {
          this.position.x = 0;
        } else if (this.position.x > screenWidth - touch.target.clientWidth) {
          this.position.x = screenWidth - touch.target.clientWidth;
        }
        if (this.position.y < 0) {
          this.position.y = 0;
        } else if (this.position.y > screenHeight - touch.target.clientHeight) {
          this.position.y = screenHeight - touch.target.clientHeight;
        }
        if (this.position.x > screenWidth) {
          this.position.x = screenWidth;
        } else if (this.position.x > screenWidth - touch.target.clientWidth) {
          this.position.x = screenWidth - touch.target.clientWidth;
        }
        if (this.position.y > screenHeight) {
          this.position.y = screenHeight;
        } else if (this.position.y > screenHeight - touch.target.clientHeight) {
          this.position.y = screenHeight - touch.target.clientHeight;
        }
        //阻止页面的滑动默认事件
        document.addEventListener("touchmove", function () {
          event.preventDefault();
        });
      }
    },
    touchend(e) {
      this.x = this.position.x;
      this.y = this.position.y;
      // console.log(this.x,this.y)
    },
  },
  updated() {
    this.x = this.position.x;
    this.y = this.position.y;
  },
  data() {
    return {
      bilibili1,
      position: {
        x: this.x,
        y: this.x,
      },
    };
  },
};
</script>
<style  scoped>
.bilibili {
  height: 0.7rem;
  width: 0.7rem;
  z-index: 990;
  position: fixed;
  top: 50%;
  right: 50%;
  border-radius: 50%;
}
.bilibili img {
  width: 100%;
  height: 100%;
}
</style>