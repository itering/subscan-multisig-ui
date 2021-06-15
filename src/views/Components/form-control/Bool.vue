<template>
  <el-radio-group v-model="source" @change="handleChange" :disbaled="disabled">
    <el-radio :label="true">{{ $t(truthText) }}</el-radio>
    <el-radio :label="false">{{ $t(falseText) }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: "Bool",

  data() {
    return {
      source: false,
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
      type: Boolean,
      default: false
    },

    truthText: {
      type: String,
      default: 'truth_label',
    },

    falseText: {
      type: String,
      default: 'false_label',
    }
  },

  mounted() { 
    this.handleChange(this.source);
  },

  methods: {
    handleChange(value) {
      this.$emit("value-change", !!value);
    }
  }
};
</script>
