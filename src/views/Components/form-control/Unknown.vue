<template>
  <el-input v-model="source" @change="handleChange"></el-input>
</template>

<script>
export default {
  data() {
    return {
      source: ""
    };
  },

  props: {
    value: String
  },

  model: {
    prop: "value",
    event: "value-change"
  },

  methods: {
    handleChange(value) {
      this.$emit("value-change", value);
    }
  }
};
</script>
