<template>
  <el-input-number
    v-model="source"
    :placeholder="$t('balance')"
    :controls="false"
    :min="0"
    :max="max"
    :disabled="disabled"
    :precision="precision"
    @change="handleChange"
  ></el-input-number>
</template>

<script>
export default {
  name: "Balance",

  data() {
    return {
      source: ""
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
      type: Number,
      default: 0
    },

    max: {
      type: Number,
      default: Infinity
    },

    precision: {
      type: Number,
      default: 0
    }
  },

  methods: {
    handleChange(value) {
      this.$emit("value-change", value);
    }
  }
};
</script>
