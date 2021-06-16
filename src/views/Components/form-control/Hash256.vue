<template>
  <el-row class="bytes-control">
    <single-file
      v-if="isFileMode"
      :onRemove="toggleMode"
      :onChange="handleFileChange"
      :placeholder="placeholder"
    >
      <el-button
        v-if="!disabled && !isInOption"
        icon="el-icon-edit-outline"
        class="toggle-mode-btn"
        @click="isFileMode = false"
      ></el-button>
    </single-file>

    <base-bytes
      v-else
      v-model="source"
      :disabled="disabled"
      :onChange="handleChange"
      :withLength="withLength"
      :length="32"
      :asHex="true"
    >
      <el-button
        v-if="!disabled && !isInOption"
        icon="el-icon-upload"
        @click="toggleMode"
      ></el-button>
    </base-bytes>
  </el-row>
</template>

<script>
import { u8aToHex } from "@polkadot/util";
import BaseBytes from "./BaseBytes.vue";
import SingleFile from "./SingleFile.vue";

export default {
  name: "Hash256",

  components: {
    SingleFile,
    BaseBytes
  },

  data() {
    return {
      source: new Uint8Array(32),
      isFileMode: false,
      placeholder: undefined
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

    withLength: {
      type: Boolean,
      default: false
    },

    value: {
      default: () => new Uint8Array(32)
    },

    validate: {
      type: Function,
      default: () => {}
    },

    isInOption: {
      type: Boolean,
      default: true
    }
  },

  mounted() {
    this.handleFileChange(this.source);
  },

  methods: {
    handleFileChange(u8a) {
      const value = this.$registry.hash(u8a);

      this.handleChange(value);
    },

    handleChange(value) {
      this.placeholder = u8aToHex(value);

      this.$emit("value-change", value);
    },

    toggleMode: function() {
      this.isFileMode = !this.isFileMode;
      this.source = new Uint8Array(0);
      this.$emit("value-change", new Uint8Array(0));
    }
  }
};
</script>

<style lang="scss" scoped>
.bytes-control {
  /deep/ .el-upload {
    width: 100%;

    .el-upload-dragger {
      width: 100%;
      height: auto;
      border-radius: 6px 0 0 6px;
      border-right: none;
    }
  }

  /deep/ .toggle-mode-btn {
    border-radius: 0 6px 6px 0;
    padding: 13px 15px;
  }
}
</style>
