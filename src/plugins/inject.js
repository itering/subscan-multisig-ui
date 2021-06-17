import axios from './axios'
import api from './api'
import consts from './const'
import polkaApi from "./polkaApi";

export default {
  install: (Vue) => {
    Vue.prototype.$api = api
    Vue.prototype.$ajax = axios
    Vue.prototype.$const = consts
    Vue.prototype.$polkaApi = polkaApi.apiInstance;

    /**
     * TODO: remove $registry, use this.$polkaApi.registry instead;
     * @deprecated the registry below only contains polkadot types.
     * It may cause type issue if deal with certain chain.
     */
    Vue.prototype.$registry = polkaApi.registry;
  }
}
