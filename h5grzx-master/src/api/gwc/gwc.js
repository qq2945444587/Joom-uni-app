import service from "@/utils/axios";
var qs = require("qs")
const ShopCart = {
  getShoppingCartDetial(data) { //购物车的list
    return service.post(`/360xkw/tiku/app/getShoppingCartDetial.do`, qs.stringify(data))
  },
  delShoppingCart(data) { //单个删除接口..
    return service.post(`/360xkw/tiku/app/delShoppingCart.do`, qs.stringify(data))
  },
  getSutUserRedEnvelopeSum(data) { //单个删除接口..
    return service.post(`/360xkw/tiku/jzCoupon/getSutUserRedEnvelopeSum.do`, qs.stringify(data))
  },
  getValidJzCouponByStuId(data) { //未过期的优惠卷
    return service.post(`/360xkw/tiku/jzCoupon/getValidJzCouponByStuId.do`, qs.stringify(data))
  },
  getLoseJzCouponByStuId(data) { //过期的优惠卷
    return service.post(`/360xkw/tiku/jzCoupon/getLoseJzCouponByStuId.do`, qs.stringify(data))
  },
  getOrderOfShoppingCart(data) { //购物车结算时拿到orderID
    return service.get(`/360xkw/jz/pay/getOrderOfShoppingCart.do`, {
      params: data
    })
  },
  // 多个课程id 以,分隔
  getCartIdsByOrderIdJZ(data) {
    return service.get(`/360xkw/tiku/app/getCartIdsByOrderIdJZ.do`, {
      params: data
    })
  },
  getOrderDetialByOrderID(data) {
    return service.get(`/360xkw/tiku/app/getOrderDetialByOrderID.do`, {
      params: data
    })
  },
  // 阿里支付
  aliPay(data) {
    return service.post(`/360xkw/jz/pay/toH5PayOfAlipayAtPhoneNoLogin.do`, qs.stringify(data))
  },

  // 微信支付
  wxPay(data) {
    return service.post(`/360xkw/jz/pay/toH5PayOfWeChatAtPhoneNoLogin.do`, qs.stringify(data))
    // return service.post(`/360xkw/weixin/pay/toH5PayOfWeChatAtPhoneNoLogin.do`, qs.stringify(data))


  },
}
export default ShopCart
