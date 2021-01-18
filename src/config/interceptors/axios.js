import store from "Plugins/store";
import axios from "Plugins/axios";
import { Message } from "element-ui";

export function requestSuccessFunc(config) {
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  // 国际化
  config.headers["Accept-Language"] = store.state.global.language;
  return config;
}

export function requestFailFunc(requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...

  return Promise.reject(requestError);
}

export function responseSuccessFunc(responseObj) {
  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  let resData = responseObj.data;
  if (responseObj.config.method === "get") {
    return resData;
  }
  let { code } = resData;
  switch (code) {
    case 0: // 如果业务成功，直接进成功回调
      return resData.data;
    case 10001:
      !responseObj.config.customConfig.noShowDefaultError &&
        Message({
          type: "error",
          message: resData.message,
          showClose: true
        });
      return Promise.reject(resData);
    case 10002:
        !responseObj.config.customConfig.noShowDefaultError &&
        Message({
          type: "error",
          message: resData.message,
          showClose: true
        });
      return Promise.reject(resData);
    case 10004:
        !responseObj.config.customConfig.noShowDefaultError &&
        Message({
          type: "error",
          message: resData.message,
          showClose: true
        });
      return Promise.reject(resData);
    default:
      // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下方它们到业务层
      return Promise.reject(resData);
  }
}

export function responseFailFunc(responseError) {
  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  if (responseError.response) {
    switch (responseError.response.status) {
      default:
        return Promise.reject(responseError.response.data);
    }
  } else {
    if (responseError.code === "ECONNABORTED") {
      // 请求超时了
      const config = responseError.config;
      // 配置不存在或者未设置retry属性
      if (!config || !config.retry) return Promise.reject(responseError);

      // 设置已经重新请求次数的变量以便下次判断
      config.__retryCount = config.__retryCount || 0;

      // 检查再次请求次数是否超过设定
      if (config.__retryCount >= config.retry) {
        // 超时次数超过设定
        Message({
          type: "error",
          message: "请求超时，已多次尝试链接",
          showClose: true
        });
        return Promise.reject(responseError);
      }

      // 增加再次请求计数
      config.__retryCount += 1;

      // 创建promise延时处理再次请求
      const backoff = new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, config.retryDelay || 1);
      });

      // 返回一个其中包含了再次请求的promise，
      return backoff.then(function() {
        // url会因为baseURL不停的叠加
        config.url = config.url.replace(config.baseURL, "");
        if (_isJSON(config.data)) {
          // axios默认把data JSON化了，重新请求时会导致签名算法读取的是字符串，导致出错
          config.data = JSON.parse(config.data);
        }
        return axios(config);
      });
    }
    return Promise.reject(responseError);
  }
}

function _isJSON(str) {
  if (typeof str == "string") {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
}
