import service from "@/utils/axios"

const qs = require("qs")

const Wallet = {
  walletPrice(data) {
    return service.post(`/360xkw/tiku/jzCoupon/getSutUserRedEnvelopeSum.do`, qs.stringify(data))
  },
  walletSource(data) {
    return service.post(`/360xkw/tiku/jzCoupon/getRedEnvelopePage.do`, qs.stringify(data))
  },
  succCounpon(data) {
    // return service.post(`vip/tiku/jzCoupon/getValidJzCouponByStuId.do`, qs.stringify(data))
    return service.post(`/360xkw/tiku/jzCoupon/getValidJzCouponByStuId.do`, qs.stringify(data))
  },
  failCounpon(data) {
    // return service.post(`vip/tiku/jzCoupon/getLoseJzCouponByStuId.do`, qs.stringify(data))

    return service.post(`/360xkw/tiku/jzCoupon/getLoseJzCouponByStuId.do`, qs.stringify(data))
  }
}

export default Wallet
