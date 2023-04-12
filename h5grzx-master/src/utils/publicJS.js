// 存缓存
export function setStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
  // 获取缓存
export function getStorage(key) {
   return JSON.parse(sessionStorage.getItem(key))
}
//  跳转页面
export function go(key) {
    return window.open(key.href, '_blank')
 }

