<template>
  <el-autocomplete
    :class="className"
    v-model="account"
    :value-key="valueKey"
    :fetch-suggestions="querySearch"
    @select="handleSelect"
    @change="handleChange"
    style="width: 100%"
  >
    <template slot="suffix">
      <i class="el-icon-arrow-down"></i>
    </template>
  </el-autocomplete>
</template>

<script>
export default {
  name: "Account",

  data() {
    return {
      account: ""
    };
  },

  model: {
    prop: "value",
    event: "value-change"
  },

  props: {
    value: {
      type: Object,
      default: null
    },
    valueKey: {
      type: String,
      default: "address"
    },
    className: {
      type: String,
      default: ""
    },
    querySearch: {
      type: Function,
      // do not use arrow function
      default: function(_, cb) {
        const source = this.$store?.state.global.extensionAccountList;

        cb(source);
      }
    },
    validate: {
      type: Function,
      default: () => true
    }
  },

  methods: {
    handleSelect(account) {
      const { address } = account;

      if (this.validate(address)) {
        this.$emit("value-change", { ...account, valueKey: this.valueKey });
      }
    },

    handleChange() {
      if (this.validate(this.account)) {
        this.$emit("value-change", {
          address: this.account,
          valueKey: this.valueKey,
          meta: { name: "", source: "", genesisHash: "" }
        });
      }
    }
  }
};
</script>
