<template>
  <div class="dashboard-wrapper subscan-content">
    <div class="subscan-container">
    </div>
  </div>
</template>
<script>
import const_symbol from "Service/const/symbol";
import { mapState } from "vuex";
import { isMobile } from "Utils/tools";
export default {
  name: "Home",
  components: {
  },
  data() {
    return {
      const_symbol: const_symbol,
      currentTime: Date.now(),
      drawer: false,
      network: "polkadot",
      tokens: {},
      metadata: {},
      sourceList: this.$const["COMMON/networkList"]["all"].value,
    };
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      language: (state) => state.global.language,
    }),
    subscanAccountAddress() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["donate"]["address"] || "";
    },
    subscanAccountInfo() {
      return {
        account_index: "",
        address: this.subscanAccountAddress,
        display: "SUBSCAN",
        identity: true,
        judgements: [{index: 1, judgement: "Reasonable"}]
      }
    },
  },
  created() {
    this.init();
  },
  mounted() {
  },
  methods: {
    init() {
      // this.getData();
    },
    isMobile() {
      return isMobile();
    }
  },
};
</script>
<style lang="scss" scoped>
.dashboard-wrapper {
  .subscan-container {

  }
  @media screen and (max-width: $screen-xs) {
    .subscan-container {
    }
  }
}
</style>
