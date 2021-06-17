<template>
  <base-bytes
    :disabled="disabled"
    v-model="source"
    :withLength="withLength"
    :length="length"
    :asHex="true"
    :onChange="handleChange"
  ></base-bytes>
</template>

<script>
import BaseBytes from "./BaseBytes.vue";

export default {
  name: "Hash160",

  components: {
    BaseBytes
  },

  data() {
    return {
      source: new Uint8Array(0)
    };
  },

  model: {
    prop: "value",
    event: "value-change"
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    value: {
      default: () => new Uint8Array(0)
    },

    validate: {
      type: Function,
      default: () => true
    },

    withLength: {
      type: Boolean,
      default: false
    },

    length: {
      type: Number,
      default: 20
    },

    onChange: {
      type: Function,
      default: () => {}
    }
  },

  methods: {
    handleChange(value) {
      this.$emit("value-change", value);
      this.onChange(value);
    }
  }
};
</script>
