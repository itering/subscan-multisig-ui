<template>
  <el-input-number
    :disabled="disabled"
    :min="min"
    :max="max"
    v-model="amount"
    controls-position="right"
    @change="handleChange"
  ></el-input-number>
</template>

<script>
export default {
  name: "Amount",
  
  data() {
    return {
      amount: 0
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

    min: {
      type: Number,
      default: 0
    },

    onChange: {
      type: Function,
      default: () => { }
    }
  },

  methods: {
    handleChange(value) {
      this.$emit('value-change', value);
      this.onChange(value);
    }
  }
};
</script>
