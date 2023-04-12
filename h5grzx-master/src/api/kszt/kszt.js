import service from "@/utils/axios";
var qs=require("qs")
const  StartQuestion= {
    getKMByPidAndLevelNoLogin(data) { //切换课程的课程数据
        return service.get(`/360xkw/tiku/course/getKMByPidAndLevelNoLogin.do`, {params: data})
    },
    getChapterQuestionIdTypes(data) { //章节练习数据
        return service.get(`/360xkw/tiku/course/getChapterQuestionIdTypes.do`, {params: data})
    },
    getUserDidSummry(data) { //用来计算写了多少章节
        return service.get(`/360xkw/tiku/didRecord/getUserDidSummry.do`, {params: data})
    },
    getChapterPaperReportDetialJZ(data) { //做题记录数据
        return service.get(`/360xkw/tiku/report/getChapterPaperReportDetialJZ.do`, {params: data})
    },
    getSubcourseCountJZ(data) { //试题收藏
        return service.get(`/360xkw/tiku/userCollection/getSubcourseCountJZ.do`, {params: data})
    },
    wrongReview(data) { // 错题本
        return service.get(`/360xkw/tiku/wrongReview/getSubcourseCountJZ.do`, {params: data})
    },
    getPaperQuestionIdTypes(data) { // 模拟考试 和 历年真题同一个接口，不同传参
        return service.get(`/360xkw/tiku/paper/getPaperQuestionIdTypes.do`, {params: data})
    },
    getReportSummary(data) { // 智能评估
        return service.get(`/360xkw/tiku/report/getReportSummary.do`, {params: data})
    },
    getChapterPaperReportDetialJZ(data) { // 智能评估查看详情
        return service.get(`/360xkw/tiku/report/getChapterPaperReportDetialJZ.do`, {params: data})
    },
    getDailyPracticeBySubCourseId(data) { // 每日一练的习题id
        return service.post(`/360xkw/tiku/app/getDailyPracticeBySubCourseId.do`, qs.stringify(data))
    },
    getQuestionListByIds(data) { // 答题全部数据
        return service.get(`/360xkw/tiku/questionLib/getQuestionListByIds.do`, {params: data})
    },
    submitAppDailyPractice(data) { // 每日一练交卷
        return service.get(`/360xkw/tiku/app/submitAppDailyPractice.do`, {params: data})
    },
    saveUserCurrentStateJz(data) { // 章节练习交卷
        return service.post(`/360xkw/tiku/currentState/saveUserCurrentStateJz.do`, qs.stringify(data))
    },
    getViewAnswerByReportId(data) { // 交卷后的结果
        return service.get(`/360xkw/tiku/didRecord/getViewAnswerByReportId.do`, {params: data})
    },
    getUserCollectionsJZ(data) { // 试题是否收藏了
        return service.get(`/360xkw/tiku/userCollection/getUserCollectionsJZ.do`, {params: data})
    },
    editUserCollection(data) { // 点击收藏
        return service.get(`/360xkw/tiku/userCollection/editUserCollection.do`, {params: data})
    },
    getRedoQuestionIdTypes(data) { // 做题记录查看解析和重做所获取题目数据
        return service.get(`/360xkw/tiku/didRecord/getRedoQuestionIdTypes.do`, {params: data})
    },
    getWrongReviews(data) { // 错题本获取数据的接口
        return service.get(`/360xkw/tiku/wrongReview/getWrongReviews.do`, {params: data})
    }
}
export default StartQuestion