import service from "@/utils/axios";
var qs = require("qs")
const Login = {
  login(data) {
    return service.post(`/360xkw/tiku/user/userlogin.do`, qs.stringify(data))
  },
  getRegcode(data) {
    return service.post(`/360xkw/tiku/sms/sendVerifiyCodeForH5NoLogin.do`, qs.stringify(data))
  },
  register(data) {
    return service.post(`/360xkw/tiku/user/regist.do`, qs.stringify(data))
  },
  resetpass(data) {
    return service.post(`/360xkw/tiku/user/editPwdNoLogin.do`, qs.stringify(data))
  }

}
export default Login
