import {
  getCookie,
  setCookie,
  setLocalStore,
  getLocalStore
} from "Utils/storage";

let language =
  getCookie("local_language") ||
  (navigator.browserLanguage ? navigator.browserLanguage : navigator.language);
let language_bak = getCookie("local_language");
language === "en-US" && (language = "en");
language === "zh-cn" && (language = "zh-CN");
if (["en", "zh-CN"].indexOf(language) === -1) {
  // 浏览器语言不在列表中
  language = "en";
}
if (language_bak == null) {
  setCookie("local_language", language, {
    expires: 30
  });
}

const global = {
  state: {
    language, // 当前UI语言
    sourceSelected: getLocalStore("polka_source") || "kusama",
    isPolkadotConnect: false
  },
  mutations: {
    SET_IS_POLKADOT_CONNECT: (state, status) => {
      state.isPolkadotConnect = status;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
    },
    SET_SOURCE_SELECTED: (state, source) => {
      state.sourceSelected = source;
    }
  },
  actions: {
    SetLanguage({
      commit
    }, language) {
      commit("SET_LANGUAGE", language);
      setCookie("local_language", language, {
        expires: 30
      });
    },
    SetIsPolkadotConnect({
      commit
    }, status) {
      commit("SET_IS_POLKADOT_CONNECT", status);
    },
    SetSourceSelected({
      commit
    }, source) {
      window.GLOBAL.vbus.$emit("CHANGE_SOURCE", source);
      commit("SET_SOURCE_SELECTED", source);
      setLocalStore("polka_source", source);
    }
  }
};

export default global;
