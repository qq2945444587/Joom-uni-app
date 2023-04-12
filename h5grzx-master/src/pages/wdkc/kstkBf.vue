<template>
  <div>
    <div class="box">
      <Head></Head>
      <div class="video_box">
        <video class="video"  id="movie" v-if="state == 'gyh'||state == '1'||state == '2'||state == '3'" src=""   ></video>

        <video v-else class="video"  id="movie" :src="fake_url" controls autoplay ></video>

        <div class="video_box_tips" v-if="state == 'gyh'">
          <div class="tips">暂无直播视频,点击切换科目试试精讲视频吧</div>
          <div class="btn" @click.stop="gotoBuy">点击购买</div>
        </div>
             <div class="video_box_tips" v-if="state == '1'||state == '2'||state == '3'">
          <div class="tips">该课程需要购买才能观看学习!</div>
          <div class="btn" @click.stop="gotoBuy">点击购买</div>
        </div>
        </div>
     
      </div>
      <div class="video_title_list_box">
        <div class="video_list">
          <div class="video_list_left">
            <div class="video_list_left_icon">
              <img src="../../img/wdkc/kstkBf/zk.png" alt />
            </div>
            <div class="video_list_left_title">{{kcname}}</div>
          </div>

          <div class="video_list_right">
            <van-cell is-link title="切换科目" @click="openSeleCourse" />

            <van-action-sheet
              v-model="show"
              title="切换科目"
              closeable
              close-icon
            >
              <div class="content">
                <van-tree-select
                  height="40vh"
                  :items="items"
                  :active-id.sync="activeId"
                  :main-active-index.sync="activeIndex"
                  selected-icon="items.id"
                  @click-nav="clickLeft"
                  @click-item="clickRight"
                />
                <div class="content_confirm">
                  <div class="cancel" @click="onCancel">取消</div>
                  <div class="confirm" @click="onConfirm">确认</div>
                </div>
              </div>
            </van-action-sheet>
          </div>
        </div>
        <div class="video_list_conn_box">
          <van-collapse
            v-model="activeNames"
            v-for="(item, index) in video_box"
            :key="index"
          >
            <van-collapse-item :title="item.name"    :name="index">
              <div
                class="video_list_conn"
                v-for="(ite, inde) in item.videos"
                :key="inde"
              >
                <div class="video_list_conn_left_line">
                  <div class="video_list_conn_left_yuan"></div>
                </div>
                <div
                  class="video_list_conn_right_conn"
                  
                  @click="palyVideo(ite, ite.videoUrl, index)"
                >
                <div class="right_conn_title_box">
                  <div
                    class="right_conn_title"
                    :class="[ite.classname == true ? 'active' : '']"
                  >

                    {{ ite.videoTitle }}
                  </div>
                   </div>
                  <div class="right_conn_icon">
                    <img v-if="!ite.PurchaseStatus && ite.state !== 4" src="../../img/wdkc/kstkBf/video_suo.png"  />
                    <img  v-if=" ite.classname==true"   src="../../img/wdkc/kstkBf/video_play.png"  />
                    <!-- <img v-else src="" alt=""> -->
                  </div>
                </div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ActionSheet, TreeSelect, Collapse, CollapseItem, Toast } from "vant";
import Wdkc from "@/api/Wdkc/wdkc";
export default {
  data() {
    return {
      activeId: 1,
      activeIndex: 0,
      items: [
        {
          text: "直播课程",
          children: [],
        },
        {
          text: "精讲课程",
          children: [],
        },
      ],
      classname: "", //激活的calss名字
      activeNames: ["1"],
      arr: [],
      videoList: [], //所有视频
      live_arr: [], //直播视频
      fine_arr: [], //精讲视频
      video_box: [],
      valueflag: "直播视频", //选择的课程
      values0: "",
      values1: "",
      config_num_arr: [],
      show: false,
      fake_url: "", //播放地址
      fake_url2: "",
      purchasedCoursesIndex: null,
      purchasedCourses: null,
      jurisdiction: null,
      userInfo: {},
      allConfig: [], //所有的config
      oneConfig: "", //单个的config
      state: false,
      lives_id: "", //直播ID
      items_index: "0", //课程精选或直播 下表
      items_id: "", //课程精选或直播  ID
      title_index: "", //存储的用户点击直播还是精讲id
      kcname: "",
      kcname2: "",
    };
  },
  methods: {
    openSeleCourse() {
      this.show = !this.show;
      this.clickLeft(this.title_index);
    },
    clickLeft(index) {
      // alert(index)
      this.title_index = index;
      this.items_index = index;
      this.items[0].children = [];
      if (this.items_index == 0) {
        if (this.live_arr.length > 0) {
          this.live_arr.forEach((e) => {
            e.text = e.name;
            this.items[0].children.push(e);
          });
        } else {
          this.items[0].children.push({
            text: "暂无课程",
            id: "",
            disabled: true,
          });
        }
      } else {
        // 精讲
        this.items[1].children = [];
        if (this.fine_arr.length > 0) {
          this.fine_arr.forEach((e) => {
            e.text = e.name;
            this.items[1].children.push(e);
          });
        } else {
          this.items[1].children.push({
            text: "暂无课程",
            id: "",
            disabled: true,
          });
        }
      }
    },
    clickRight(data) {
      this.items_id = data.id;
      this.kcname2 = data.text;
    },
    onCancel() {
      this.show = !this.show;
    },
    onConfirm() {
      // console.log(this.title_index);
      this.show = !this.show;
      if (this.items_index == "0") {
        // 直播
        this.video_box = [];
        this.video_box = this.videoList[this.items_id][4];
        // this.videoList[this.items_id][4].forEach((item, index) => {
        //   this.video_box.push(item);
        // });

        // console.log(   this.video_box[0])
        // this.video_box[0].videos.sort((a, b) => {
        //   return b.state - a.state;
        // });

        if (this.video_box.length > 0) {
          var that = this;
          this.video_box[0].videos.forEach((ite, ind) => {
            that.purchasedCoursesIndex = that.purchasedCourses.findIndex(
              (item) => Number(item.split(",")[0]) === Number(ite.subcourseId)
            );
            if (that.purchasedCoursesIndex !== -1) {
              that.jurisdiction = that.purchasedCourses[
                that.purchasedCoursesIndex
              ].split(",")[1];
              if (
                that.jurisdiction.indexOf(ite.materiaProper) > -1 &&
                ite.state !== 4
              ) {
                that.$set(ite, "PurchaseStatus", 1);
              }
            }
          });
          // console.log(data)
          this.kcname = this.kcname2;
          this.ckeck_video_play();
        } else {
          Toast({
            message: "暂无课程视频",
            position: "bottom",
          });
        }
      } else {
        // 精讲
        this.video_box = [];
        this.video_box = this.videoList[this.items_id][1];
        // this.video_box[0].videos.sort((a, b) => {
        //   return b.state - a.state;
        // });

        if (this.video_box.length > 0) {
          var that = this;
          this.video_box[0].videos.forEach((ite, ind) => {
            that.purchasedCoursesIndex = that.purchasedCourses.findIndex(
              (item) => Number(item.split(",")[0]) === Number(ite.subcourseId)
            );
            if (that.purchasedCoursesIndex !== -1) {
              that.jurisdiction = that.purchasedCourses[
                that.purchasedCoursesIndex
              ].split(",")[1];
              if (
                that.jurisdiction.indexOf(ite.materiaProper) > -1 &&
                ite.state !== 4
              ) {
                that.$set(ite, "PurchaseStatus", 1);
              }
            }
          });
          this.kcname = this.kcname2;
          this.ckeck_video_play();
        } else {
          Toast({
            message: "暂无课程视频",
            position: "bottom",
          });
        }
      }
    },
    getAllConfig() {
      var allConfig = this.$route.query.config.split("|");
      for (var i = 0; i < allConfig.length; i++) {
        this.allConfig.push(allConfig[i].split(",")[0]);
      }
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!this.userInfo.orderDetial.config) {
        console.log("kstkBf没有this.userInfo.orderDetial.config");
      }
      this.purchasedCourses =
        this.userInfo.orderDetial.config == undefined ||
        this.userInfo.orderDetial.config == null
          ? (this.userInfo.orderDetial.config = [])
          : this.userInfo.orderDetial.config.split("|");
      const params = {
        subCourseIds: this.allConfig.join(","),
      };
      const that = this;
      Wdkc.getVideos(params).then((res) => {
        const dataState = res.data.S;
        const data = res.data.V;
        if (dataState == "1") {
          this.videoList = data.video;
          that.videoList = data.video;
          for (let i = 0; i < data.subCourse.length; i++) {
            // this.allConfig.push(allConfig[i].split(",")[0]);
            if (data.subCourse[i].materiaProper == "1") {
              // 精讲视频选择目录
              that.fine_arr.push(data.subCourse[i]);
              that.config_num_arr.push(data.subCourse[i].id);
            } else if (data.subCourse[i].materiaProper == "4") {
              that.live_arr.push(data.subCourse[i]);
              that.config_num_arr.push(data.subCourse[i].id);
            }
          }
          if (that.live_arr.length > 0) {
            that.lives_id = that.live_arr[0].videos[0].id;
          } else {
            that.lives_id = "";
          }
          that.valueflag = "直播视频";
          if (
            that.fine_arr[0] == "" ||
            that.fine_arr[0] == undefined ||
            that.fine_arr[0] == null
          ) {
            Toast({
              message: "暂无视频",
              position: "bottom",
            });
          } else {
            document.title = that.fine_arr[0].name;
            that.kcname = that.fine_arr[0].name;
            // Toast({
            //   message: that.fine_arr[0].name,
            //   position: "bottom",
            // });
          }

          var arr = [];
          for (let i = 0; i < that.allConfig.length; i++) {
            if (that.videoList[that.allConfig[i]] == undefined) {
              console.log("没有" + that.allConfig[i] + "的视频数据");
            } else {
              arr.push(that.allConfig[i]);
              // that.oneConfig = arr[0];
              if (arr[0] == "919") {
                that.oneConfig = arr[1];
              } else {
                that.oneConfig = arr[0];
              }
              that.video_box =
                that.videoList[that.oneConfig][4].length > 0
                  ? that.videoList[that.oneConfig][4]
                  : [];
            }
          }
          if (that.videoList[that.oneConfig][4].length == 0) {
            that.state = "noFoundUrl";
          }
          //        console.log(   that.video_box  );
          // console.log( that.oneConfig );
        } else {
          Toast({
            message: "获取视频失败",
            position: "bottom",
          });
        }

        this.ckeck_video_play();
      });
      // .catch(() => {
      //   Toast({ message: "获取视频失败", position: "bottom" });
      // });
    },
    // 初始化播放
    ckeck_video_play() {
      // console.log(this.oneConfig);
      // console.log(this.videoList[this.oneConfig]);
      if (this.videoList[this.oneConfig][4] == undefined) {
        alert("chulai");
      }

      if (this.videoList[this.oneConfig][4].length == 0) {
        this.state = "gyh";
      } else {
        // console.log(this.videoList[this.oneConfig]);

        if (this.videoList[this.oneConfig][1][0].name == "OKR精讲") {
          var that = this;
          this.videoList[this.oneConfig][1][0].videos.forEach(function (
            ite,
            ind
          ) {
            ite.classname = false;
            that.purchasedCoursesIndex = that.purchasedCourses.findIndex(
              (item) => Number(item.split(",")[0]) === Number(ite.subcourseId)
            );
            if (that.purchasedCoursesIndex !== -1) {
              that.jurisdiction = that.purchasedCourses[
                that.purchasedCoursesIndex
              ].split(",")[1];
              if (
                that.jurisdiction.indexOf(ite.materiaProper) > -1 &&
                ite.state !== 4
              ) {
                that.$set(ite, "PurchaseStatus", 1);
              }
            }
          });
          this.videoList[this.oneConfig][1][0].videos[0].classname = true;
          this.fake_url = this.videoList[
            this.oneConfig
          ][1][0].videos[0].videoUrl;

          if (
            this.fake_url == undefined ||
            this.fake_url == "" ||
            this.fake_url == null
          ) {
            Wdkc.getBuyVideos({ id: this.lives_id }).then((res) => {
              this.fake_url = res.data.V[0].videoUrl;
              this.fake_url = this.fake_url.split("http://tk.360xkw.com")[1];
              this.fake_url = `http://s1.v.360xkw.com` + this.fake_url; // 转化真实url
            });
          } else {
            this.fake_url = this.fake_url.split("http://tk.360xkw.com")[1];
            this.fake_url = `http://s1.v.360xkw.com` + this.fake_url; // 转化真实url
          }
        } else {
          if (this.videoList[this.oneConfig][4].length > 0) {
            var that = this;
            this.videoList[this.oneConfig][4][0].videos.forEach(function (
              ite,
              ind
            ) {
              ite.classname = false;
              that.purchasedCoursesIndex = that.purchasedCourses.findIndex(
                (item) => Number(item.split(",")[0]) === Number(ite.subcourseId)
              );
              if (that.purchasedCoursesIndex !== -1) {
                that.jurisdiction = that.purchasedCourses[
                  that.purchasedCoursesIndex
                ].split(",")[1];
                if (
                  that.jurisdiction.indexOf(ite.materiaProper) > -1 &&
                  ite.state !== 4
                ) {
                  that.$set(ite, "PurchaseStatus", 1);
                }
              }
            });
            // 免费视频
            var mianfei = [];
            this.videoList[this.oneConfig][4][0].videos.forEach(function (
              item,
              index
            ) {
              if (item.state == "4") {
                mianfei.push(item);
              }
            });
            const that = this;
            if (mianfei.length == 0) {
              console.log("没有state==4的视频");
              that.videoList[that.oneConfig][4][0].videos;
            } else {
              this.videoList[this.oneConfig][4][0].videos.forEach(function (
                item,
                index
              ) {
                if (item.videoTitle == mianfei[0].videoTitle) {
                  that.videoList[that.oneConfig][4][0].videos.splice(index, 1);
                }
              });
              this.videoList[this.oneConfig][4][0].videos.unshift(mianfei[0]);
            }

            // console.log(this.videoList[this.oneConfig][4][0].videos);

            this.videoList[this.oneConfig][4][0].videos[0].classname = true;
            this.fake_url = this.videoList[
              this.oneConfig
            ][4][0].videos[0].videoUrl;
            if (
              this.fake_url == undefined ||
              this.fake_url == "" ||
              this.fake_url == null
            ) {
              Wdkc.getBuyVideos({ id: this.lives_id }).then((res) => {
                // console.log(res.data.V);
                this.fake_url = res.data.V[0].videoUrl;
                this.fake_url = this.fake_url.split("http://tk.360xkw.com")[1];
                this.fake_url = `http://s1.v.360xkw.com` + this.fake_url; // 转化真实url
              });
            } else {
              this.fake_url = this.fake_url.split("http://tk.360xkw.com")[1];
              this.fake_url = `http://s1.v.360xkw.com` + this.fake_url; // 转化真实url
            }
          } else {
            Toast({ message: "没有视频", position: "bottom" });
          }
        }
      }

      this.$forceUpdate();
    },
    // 点击播放
    palyVideo(value, videoUrl, ind) {
      this.kcname = value.videoTitle;
      // console.log(value, videoUrl, ind);
      const that = this;
      if (this.video_box.length > 0) {
        this.video_box.forEach(function (item, index) {
          item.videos.forEach(function (ite, inde) {
            ite.classname = false;
            that.state = "1";
          });
        });
        value.classname = true;
        if (value.PurchaseStatus == "1") {
          this.state = 4;
          const params = {
            id: value.id,
          };
          // console.log(value.id);

          // console.log(value.PurchaseStatus);
          Wdkc.getBuyVideos(params)
            .then((res) => {
              const data = res.data;
              if (
                data.V[0].videoUrl == "" ||
                data.V[0].videoUrl == null ||
                data.V[0].videoUrl == undefined
              ) {
                // that.state = "noFoundUrl";
                value.classname = false;
              } else {
                value.classname = true;
                that.state = "4";
                that.fake_url = data.V[0].videoUrl.split(
                  "http://tk.360xkw.com"
                )[1];
                that.fake_url = `http://s1.v.360xkw.com` + that.fake_url; // 转化真实url
              }
            })

            .catch(() => {
              Toast({
                message: "暂无直播视频!",
                position: "bottom",
              });
            });
        }
        if (
          !videoUrl ||
          videoUrl == "" ||
          videoUrl == undefined ||
          videoUrl == null
        ) {
          value.classname = false;
          return false;
        } else {
          value.classname = true;
          this.fake_url = videoUrl.split("http://tk.360xkw.com")[1];
          this.fake_url = `http://s1.v.360xkw.com` + this.fake_url; // 转化真实url
          this.state = "4";
        }

        // this.fake_url = videoUrl;
        // this.fake_url = videoUrl.split("http://tk.360xkw.com")[1];
        // this.fake_url = `http://s1.v.360xkw.com` + this.fake_url; // 转化真实url
      } else {
        var myVideo = document.getElementById("movie");
        if (myVideo.paused) {
          myVideo.pause();
        } else {
          myVideo.pause();
        }
        Toast({
          message: "暂无课程视频",
          position: "bottom",
        });
      }
    },
    // 去购买
    gotoBuy() {
      this.$router.push({ name: "kczx" });
    },
  },
  mounted() {
    this.items_id = 0;
    this.getAllConfig();
    setTimeout(() => {
      this.ckeck_video_play();
    }, 600);

    // this.onConfirm()

    //   this.clickLeft(0);

    // this.clickRight()
  },
};
</script>

<style scoped>
.van-icon,
.van-icon-arrow van-cell__right-icon {
  display: none;
}

.van-cell {
  width: 70px;
  height: 27px;
  border-radius: 4px;
  border: solid 1px #ff423a;
  color: #ff423a;
  text-align: center;
  line-height: 27px;
  padding: 0;
}

.van-collapse-item__wrapper .van-collapse-item__content {
  padding: 0 !important;
}

.van-collapse-item__wrapper .van-collapse-item__content {
  padding: 0 20px !important;
}

.van-sidebar-item--select,
.van-tree-select__item--active,
.van-sidebar-item--select:active {
  color: #ff403a;
  font-size: 16px;
  font-weight: 600;
}
.van-tree-select__item--active {
  color: #ff403a;
  font-weight: 600;
  background: #f7f8fa;
}
.van-tree-select__nav-item {
  text-align: center;
}
.van-tree-select__item {
  text-align: left;
}
</style>
<style scoped>
@import url("../../css/index.css");

.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
}

.video_box {
  width: 100vw;
  position: fixed;
  top: 47px;
  left: 0;
}

.video_box video {
  width: 100%;
  height: 210px;

  outline: none;
  display: block;
}

.video_box_tips {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("../../img/wdkc/kstkBf/suopg.jpg");
  background-size: 100% 100%;
}

.video_box_tips .tips {
  font-size: 14px;
  color: #cacaca;
}

.video_box_tips .btn {
  font-size: 12px;
  margin-top: 14px;
  padding: 3px 8px;
  border-radius: 16px;
  color: #cacaca;
  background-image: linear-gradient(90deg, #ff403a, #ff6949);
}

.video_list_left_icon {
  width: 18px;
}

.video_list_left_icon img {
  width: 100%;
}

.video_list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  width: calc(100% - 24px);
  border-bottom: 1px solid #ebebeb;
  padding: 0 12px;
}

.video_list_left {
  display: flex;
  flex-direction: row;
}

.video_list_left_title {
  font-size: 14px;
  color: #333333;
  margin-left: 3px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 245px;
}

.video_list_right_checkBtn {
  width: 70px;
  height: 27px;
  border-radius: 4px;
  border: solid 1px #ff423a;
  color: #ff423a;
  text-align: center;
  line-height: 27px;
}

.video_list_conn_box {
  width: 100vw;
  max-width: 100vw;

  height: calc(100vh - 300px);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}

.video_title_list_box {
  position: fixed;
  top: 257px;
  left: 0;
}

.video_list_conn {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  width: 100%;
}

.video_list_conn_left_line {
  width: 1px !important;
  height: 44px;
  position: relative;
  display: block;
  /* background: #dedede ; */
  border-right: 1px dashed #dedede;
  margin-right: 15px;
}

.video_list_conn_left_yuan {
  position: absolute;
  width: 7px;
  height: 7px;
  border: solid 1px #ff433b;
  border-radius: 50%;
  top: calc(50% - 3px);
  right: -5px;
}

.video_list_conn_right_conn {
  width: calc(100% - 34px);
  flex: 1;
  /* height: 44px; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.video_list_conn_right_conn:hover {
  animation: touchMOve 0.2s;
}
@keyframes touchMOve {
  0% {
    background: rgba(173, 173, 173, 0);
  }
  50% {
    background: rgba(173, 173, 173, 0.1);
  }
  100% {
    background: rgba(173, 173, 173, 0);
  }
}
.right_conn_title_box {
  -webkit-overflow-style: none;
  -ms-overflow-style: none;
  -o-overflow-style: none;
  -moz-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
.right_conn_title_box::-webkit-scrollbar {
  width: 0px;
}

.right_conn_title_box {
  width: calc(100% - 14%) !important;
  overflow: hidden;
  overflow-y: hidden;
  overflow-x: scroll;
  margin-bottom: -10px;
}
.right_conn_title {
  font-size: 14px;
  color: #999999;
  /* line-height: 44px; */
  white-space: nowrap;
}
.right_conn_icon {
  width: 20px;
}

.right_conn_icon img {
  width: 100%;
}

.content {
  width: 100%;
  height: 100%;
}

.active {
  color: #333333;
}
.content_confirm {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  height: 30px;
  align-items: center;
}
.content_confirm .confirm {
  width: 30%;
  font-size: 16px;
  text-align: center;
  color: #4e6699;
}

.content_confirm .cancel {
  width: 30%;
  font-size: 16px;
  text-align: center;
  color: rgb(161, 161, 161);
}
</style>
