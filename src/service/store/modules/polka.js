import api from "Plugins/api";

const {
  polkaGetMetadata,
  polkaGetToken,
} = api;

export default {
  state: {
    metadata: {},
    token: {},
  },
  mutations: {
    SET_METADATA: (state, data) => {
      state.metadata = data;
    },
    SET_TOKEN: (state, data) => {
      state.token = data;
    }
  },
  actions: {
    async SetMetadata({
      commit
    }) {
      const data = await polkaGetMetadata();
      commit("SET_METADATA", data);
    },
    async SetToken({
      commit
    }) {
      const data = await polkaGetToken();
      commit("SET_TOKEN", data);
    }
  }
};
