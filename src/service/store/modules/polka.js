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
  }
};
