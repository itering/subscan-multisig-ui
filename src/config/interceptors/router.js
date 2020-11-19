import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

NProgress.configure({
  showSpinner: false
}); // NProgress Configuration

export function routerBeforeEachFunc(to, from, next) {
  // 这里可以做页面拦截，也可以在这里面做权限处理
  NProgress.start();
  next();
}

export function routerAfterEachFunc() {
  NProgress.done(); // finish progress bar
  // 跳转页面窗口置顶
  // window.scroll(0, 0);
}
