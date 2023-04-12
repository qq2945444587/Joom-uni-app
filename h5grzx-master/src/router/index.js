import Vue from 'vue'
import Router from 'vue-router'
import {
  Dialog
} from 'vant';
Vue.use(Router)

// var isLogin = JSON.parse(localStorage.getItem("userInfo"))
// console.log(isLogin)

const routes = [{
    path: "/",
    redirect: {
      name: "login"
    }
  },
  // 登录快
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['@/pages/login/login'], resolve),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: (resolve) => require(['@/pages/login/register'], resolve),
    meta: {
      title: '注册',
      needLogin: true // 需要登录
    }
  },
  {
    path: '/resetpass',
    name: 'resetpass',
    component: (resolve) => require(['@/pages/login/resetpass'], resolve),
    meta: {
      title: '重置密码'
    }
  },
  // 购物快
  {
    path: '/shopcat',
    name: 'shopcat',
    component: (resolve) => require(['@/pages/cat/shopcat'], resolve),
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/submitOrder',
    name: 'submitOrder',
    component: (resolve) => require(['@/pages/cat/submitOrder'], resolve),
    meta: {
      title: '提交订单'
    }
  },
  {
    path: '/paySucc',
    name: 'paySucc',
    component: (resolve) => require(['@/pages/cat/paySucc'], resolve),
    meta: {
      title: '完成订单'
    }
  },
  {
    path: '/a',
    name: 'a',
    component: (resolve) => require(['@/pages/wallet/a'], resolve),
    meta: {
      title: '移动'
    }
  },
  {
    path: '/hongbao',
    name: 'hongbao',
    component: (resolve) => require(['@/pages/wallet/hongbao'], resolve),
    meta: {
      title: '我的钱包',
      // needLogin: true // 需要登录
    }

  },
  {
    path: '/accountSafe',
    name: 'accountSafe',
    component: (resolve) => require(['@/pages/cat/accountSafe'], resolve),
    meta: {
      title: '账号安全',
      // needLogin: true // 需要登录　
    },

  },

  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: (resolve) => require(['@/pages/cat/resetPassword'], resolve),
    meta: {
      title: '修改密码'
    }
  },
  //课程中心
  {
    path: '/kczx',
    name: 'kczx',
    component: (resolve) => require(['@/pages/kczx/kczx'], resolve),
    meta: {
      title: '课程中心'
    }
  },
  //课程中心_查看详情
  {
    path: '/kczxCkxq',
    name: 'kczxCkxq',
    component: (resolve) => require(['@/pages/kczx/kczxCkxq'], resolve),
    meta: {
      title: '课程中心_查看详情'
    }
  },
  //开始听课
  {
    path: '/kstk',
    name: 'kstk',
    component: (resolve) => require(['@/pages/wdkc/kstk'], resolve),
    meta: {
      title: '开始听课'
    }
  },
  //开始听课_播放
  {
    path: '/kstkBf',
    name: 'kstkBf',
    component: (resolve) => require(['@/pages/wdkc/kstkBf'], resolve),
    meta: {
      title: '开始听课_播放'
    }
  },
  //个人中心
  {
    path: '/grzx',
    name: 'grzx',
    component: (resolve) => require(['@/pages/wdkc/grzx'], resolve),
    meta: {
      title: '个人中心'
    }
  },
  //错题本
  {
    path: '/ctb',
    name: 'ctb',
    component: (resolve) => require(['@/pages/kszt/ctb'], resolve),
    meta: {
      title: '错题本'
    }
  },
  //试题收藏
  {
    path: '/stsc',
    name: 'stsc',
    component: (resolve) => require(['@/pages/kszt/stsc'], resolve),
    meta: {
      title: '试题收藏'
    }
  },
  //做题记录
  {
    path: '/ztjl',
    name: 'ztjl',
    component: (resolve) => require(['@/pages/kszt/ztjl'], resolve),
    meta: {
      title: '做题记录'
    }
  },
  //模拟试题
  {
    path: '/mnst',
    name: 'mnst',
    component: (resolve) => require(['@/pages/kszt/mnst'], resolve),
    meta: {
      title: '模拟试题'
    }
  },
  //历年真题
  {
    path: '/lnzt',
    name: 'lnzt',
    component: (resolve) => require(['@/pages/kszt/lnzt'], resolve),
    meta: {
      title: '历年真题'
    }
  },
  //历年真题_考试模式选择
  {
    path: '/lnztKsmsxz',
    name: 'lnztKsmsxz',
    component: (resolve) => require(['@/pages/kszt/lnztKsmsxz'], resolve),
    meta: {
      title: '历年真题_考试模式选择'
    }
  },
  //考试结果
  {
    path: '/ksjg',
    name: 'ksjg',
    component: (resolve) => require(['@/pages/kszt/ksjg'], resolve),
    meta: {
      title: '考试结果'
    }
  },
  //智能评估
  {
    path: '/znpg',
    name: 'znpg',
    component: (resolve) => require(['@/pages/kszt/znpg'], resolve),
    meta: {
      title: '智能评估'
    }
  },
  //智能评估查看详情
  {
    path: '/smart',
    name: 'smart',
    component: (resolve) => require(['@/pages/kszt/smart'], resolve),
    meta: {
      title: '智能评估详情'
    }
  },
  //开始做题
  {
    path: '/Kszt',
    name: 'Kszt',
    component: (resolve) => require(['@/pages/kszt/Kszt'], resolve),
    meta: {
      title: '开始做题'
    }
  },
  //选择课程
  {
    path: '/xzkc',
    name: 'xzkc',
    component: (resolve) => require(['@/pages/kszt/xzkc'], resolve),
    meta: {
      title: '选择课程'
    }
  },
  
  //多选题_考试模拟
  {
    path: '/dxtKsms',
    name: 'dxtKsms',
    component: (resolve) => require(['@/pages/kszt/dxtKsms'], resolve),
    meta: {
      title: '题库详情'
    }
  },
  {
    path: '/alipay',
    name: 'alipay',
    component: (resolve) => require(['@/pages/cat/alipay'], resolve),
    meta: {
      title: '支付宝支付'
    }
  },
  {
    path: '/wxpay',
    name: 'wxpay',
    component: (resolve) => require(['@/pages/cat/wxpay'], resolve),
    meta: {
      title: '微信支付'
    }
  },
]

const router = new Router({
  routes,
  // mode: 'history',
  // base: process.env.BASE_URL,

})


// router.beforeEach((to, from, next) => {
//   if (to.meta.needLogin) {  // 判断该路由是否需要登录权限
//     if (isLogin) { // 判断是否已经登录
//       next()
//     }
//     else {
//       Dialog.alert({
//         message: '您还未登录！',
//         confirmButtonText: "去登录"
//       }).then(() => {
//         router.push({ path: "login" });

//       });
//     }
//   }
//   else {
//     next()
//   }
// })



// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
export default router
