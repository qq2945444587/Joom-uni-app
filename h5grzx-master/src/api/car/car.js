
import service from "@/utils/axios"
const qs = require("qs")
const Car = {
    // 重置账户
    accountSafe(data) {
        return service.post("/360xkw//tiku/user/editUser.do", qs.stringify(data))
    },
    // 重置密码
    resetPassword(data) {
        return service.post("/360xkw//tiku/user/editWebUser.do", qs.stringify(data))
    },
    // 退出登录
    signOut(data) {
        return service.post("/360xkw//tiku/user/logout.do", qs.stringify(data))
    }
}

export default Car