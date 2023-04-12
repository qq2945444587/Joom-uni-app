import axios from "axios";
import { config } from "shelljs";
import { Toast, Dialog } from "vant";
let router = import("@/router");




axios.defaults.baseURL = "";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Cache-Control"] = "no-cache";
axios.defaults.headers["pragma"] = "no-cache";

let source = axios.CancelToken.source();

//请求添加token
const service = axios
service.interceptors.request.use(request => {
    // request.headers["demo-auth"] = store.state.loginInfo ? store.state.loginInfo.userId : ""; // 已将userId保存在store中
    return request;
})

//切换页面取消请求
service.interceptors.request.use(request => {
    request.cancelToken = source.token;
    let url = request.url
    // get参数编码
    if (request.method === 'get' && request.params) {
      url += '?'
      let keys = Object.keys(request.params)
      for (let key of keys) {
        url += `${key}=${encodeURIComponent(request.params[key])}&`
      }
      url = url.substring(0, url.length - 1)
      request.params = {}
    }
    request.url = url
    return request;
});
router.then(lib => {
    lib.default.beforeEach((to, from, next) => {
        source.cancel()
        source = axios.CancelToken.source();
        next()
    })
})

//登录过期跳转
service.interceptors.response.use(response => {
    let data = response.data;
    // console.log(data)
    if (data.S == 1001) {
        Dialog.confirm({
            title: '提醒',
            message: '连接超时或未登录',
            confirmButtonText: "去登录",
            cancelButtonText: "再看看"
        })
            .then(() => {
                // on confirm 
                router.then(lib => lib.default.push({ name: "login" })); // 跳转到个人中心页面
            })
            .catch(() => {
                // on cancel

            });
    } else {
        return response;
    }
   
})

//返回值解构
service.interceptors.response.use(response => {
    let data = response.data;
    // console.log(data)
    let state = response.status
    // console.log(state)

    if (state == 200) {
        // Toast.success('请求成功');
        return Promise.resolve({
            data
        });
    }
    return Promise.reject(
        data.V || "网络错误"
    );
}, err => {
    Toast.fail('请求失败');
    let isCancel = axios.isCancel(err);
    if (isCancel) {
        return new Promise(() => { });
    }
    return Promise.reject(
        err.response.data &&
        err.response.data.msg
    );
})

export default service
