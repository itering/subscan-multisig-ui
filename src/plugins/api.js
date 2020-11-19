import axios from "./axios";
import _assign from "lodash/assign";

import { assert } from "Utils/tools";
import { API_DEFAULT_CONFIG } from "Config";
import API_CONFIG from "Service/api";

class MakeApi {
  constructor(options) {
    this.api = {};
    this.apiBuilder(options);
  }

  apiBuilder({
    config = {},
    isTestEnv = false,
    testEnvBaseURLPrefix = "",
    baseURL = ""
  }) {
    Object.keys(config).map(namespace => {
      this._apiSingleBuilder({
        namespace,
        isTestEnv,
        testEnvBaseURLPrefix,
        baseURL,
        config: config[namespace]
      });
    });
  }
  _apiSingleBuilder({
    namespace,
    config,
    isTestEnv,
    testEnvBaseURLPrefix,
    baseURL
  }) {
    config.forEach(api => {
      let baseURLValue = baseURL;
      let {
        name,
        desc,
        method,
        path,
        options,
        baseURL: singleApiBaseURL
      } = api;
      let apiname = `${namespace}${_firstUpperCase(name)}`;
      let url = path;
      singleApiBaseURL && (baseURLValue = singleApiBaseURL);
      isTestEnv && (baseURLValue = testEnvBaseURLPrefix + baseURLValue);

      assert(name, `${url} :接口name属性不能为空`);
      assert(url.indexOf("/") === 0, `${url} :接口路径path，首字符应为/`);

      Object.defineProperty(this.api, apiname, {
        value(outerParams, outerOptions) {
          let obj = {
            name,
            url,
            desc,
            method,
            baseURL: baseURLValue
          };
          return axios(
            _normoalize(
              { ...obj, customConfig: _assign({}, options, outerOptions) },
              outerParams
            )
          );
        }
      });
    });
  }
}

function _normoalize(options, data) {
  if (options.method === "POST" || options.method === "DELETE") {
    options.data = data;
  } else if (options.method === "GET") {
    options.params = data;
  }
  return options;
}

function _firstUpperCase(str) {
  return str.replace(/\b(\w)/g, function($1) {
    return $1.toUpperCase();
  });
}

export default new MakeApi({
  config: API_CONFIG,
  ...API_DEFAULT_CONFIG
})["api"];
