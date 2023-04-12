<template>
  <div>
    <Head></Head>
    <van-loading size="24px" class="loading" v-if="loading">加载中...</van-loading>
    <div class="SmartDialog" v-else>
      <div class="unit_connent" v-for="(item, index) in list" :key="index">
        <div class="unit_timu">
          <div class="unit_timu_tit">
            {{item.reportTitle}} ( <span>20</span> / <span>300</span> )
          </div>
          <div class="unit_timu_correct">
            错题 <span>0</span> 权重 <span>0</span> 正确率 <span>0%</span>
          </div>
        </div>
        <div class="tlk_xuanze">
            <span class="clheck_detail_btn1" @click="redo(item, 1)">重做</span>
            <span class="clheck_detail_btn" @click="redo(item, 2)">查看详情</span>
        </div>
      </div>

       <van-empty description="暂无智能评估详情" v-if="list.length == 0">
      <van-button round class="bottom-button" @click="gotoZnpg"> 返回智能评估 </van-button>
    </van-empty>
    </div>


  </div>
</template>
<script>

import { Icon, Popup, Toast } from "vant";
import StartQuestion from "@/api/kszt/kszt";

export default {
  data() {
    return {
      list: [],
      loading: true,
      type: undefined,
      subcourseId: 259
    };
  },
  created () {
    // console.log(this.$route.query)
    this.getChapterPaperReportDetialJZ(this.$route.query)
    this.subcourseId = this.$route.query.subcourseId
    this.type = this.$route.query.type
  },
  methods: {
    gotoZnpg() {
       this.$router.push({ path: "/znpg?subcourseId=" +  this.subcourseId });
    },
      // 智能评估数据
    getChapterPaperReportDetialJZ(val) {
      const params = {
        subcourseId: val.subcourseId
      };
      if (val.type === '智能评估详情练习任务') {
        params.chapterId = val.chapterId
      } else {
        params.doTypeId = val.doTypeId
      }
      StartQuestion.getChapterPaperReportDetialJZ(params)
        .then((res) => {
          if (res.data.V) {
            const data = res.data;
              this.list = data.V
              // console.log(this.list)
          }
           this.loading = false
        })
        .catch((error) => {
          Toast.fail("请求失败");
          this.loading = false
        });
    },
    // 重做/查看解析
    redo(val, index) {
      // console.log(this.type)
          const params = {
         didRecordId: val.didRecordId
      };
       StartQuestion.getRedoQuestionIdTypes(params)
        .then((res) => {
          if (res.data.V) {
            const datas = res.data;
            // console.log(datas)
            const questionIdTypeList = []
            datas.V.questionIdTypes.forEach(e => {
              questionIdTypeList.push(e[0])
            });
            const data = {
              choiceList: [],
              subcourseId: String(this.subcourseId),
              type: this.type === '智能评估详情练习任务'?"章节练习":'模拟考试',
              questionIds: questionIdTypeList.join(','),
              answerTime: this.type === '智能评估详情练习任务'?undefined:datas.V.paper.answerTime || 100
            };
            if (this.type === '智能评估详情练习任务') {
              data.chapterId = datas.V.chapter.id
               data.reportName = datas.V.chapter.name
            } else {
              data.paperId = datas.V.paper.id
               data.reportName = datas.V.paper.paperName
            }
            if (index === 2) {
              data.comeFrom = '答案'
            }
            // console.log(data)
            this.$router.push({
              path: "/dxtKsms",
              query: { data: JSON.stringify(data) },
            });
          }
        })
        .catch((error) => {
           Toast.fail("请求失败");
        });
    }
  },
  mounted() {},
};
</script>
<style scoped>
.SmartDialog {
  padding: 15px 16px;
  background: white;
  /* background: red; */
}
.active {
  display: block;
}
.SmartDialog .unit_connent {
  margin: 0 auto;
  background-color: #fffeff;
  box-shadow: 0px 0px 5px 0px #edeff2;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 14px 12px 14px 20px;
  margin-bottom: 12px;
}
.SmartDialog .unit_timu {
  color: #26292c;
  font-size: 14px;
}
.SmartDialog .unit_timu_correct {
  margin-top: 10px;
  font-size: 12px;
  color: #999999;
}
.SmartDialog .clheck_detail_btn {
  width: 60px;
  height: 21px;
  border-radius: 10px;
  border: solid 1px #f89ea5;
  text-align: center;
  color: #e70012;
  font-size: 12px;
  line-height: 22px;
  margin-top: 20px;
}
.clheck_detail_btn1{
   width: 50px;
  height: 21px;
  border-radius: 10px;
  border: solid 1px #f89ea5;
  text-align: center;
  color: #e70012;
  font-size: 12px;
  line-height: 22px;
  margin-top: 20px;
}
.bottom-button {
  width: 120px;
  height: 30px;
  background-image: linear-gradient(90deg, #ff403a, #ff6949);
  color: white;
}
.loading {
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.tlk_xuanze{
  width: 250px;
  display:flex;
  justify-content: space-between;

}
</style>
