import service from "@/utils/axios";
var qs=require("qs")
const CurrCenter = {
    getItemListByBanXingTypeNoLogin(data) {  //课程中心数据接口
        return service.post(`/360xkw/tiku/app/getItemListByBanXingTypeNoLogin.do`,qs.stringify(data) )
    },
    getItemListNoLogin(data) {  //课程中心课程的详情接口
        return service.post(`/360xkw/tiku/app/getItemListNoLogin.do`,qs.stringify(data) )
    },
    addShoppingCartJZ(data) {  //课程加入购物车事件接口
        return service.post(`/360xkw/tiku/app/addShoppingCartJZ.do`,qs.stringify(data) )
    }
}
export default CurrCenter