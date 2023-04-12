import service from "@/utils/axios"
var qs = require("qs")

const Wdkc = {
    // 我的课程
    getMyCourse(data) {
        return service.post(`/360xkw/tiku/app/getMyItemList.do`, qs.stringify(data))
    },
    // 视频  
    getVideos(data) {
        return service.post(`/360xkw/tiku/app/getSubcourseIdAndMateriaProperAndVideoNoLogin.do`, qs.stringify(data))
    },
        // 二次购买视频  
    getBuyVideos(data) {
        return service.post(`/360xkw/tiku/video/getVideos.do`, qs.stringify(data))
    }
}

export default Wdkc