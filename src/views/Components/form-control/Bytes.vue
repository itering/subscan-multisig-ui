<template>
  <el-row class="bytes-control">
    <single-file
      v-if="isFileMode"
      :onRemove="toggleMode"
      :onChange="handleChange"
    >
      <el-button
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
      :withLength="true"
    >
      <el-button icon="el-icon-upload" @click="toggleMode"></el-button>
    </base-bytes>
  </el-row>
</template>

<script>
import BaseBytes from "./BaseBytes.vue";
import SingleFile from "./SingleFile.vue";

export default {
  name: "Bytes",

  components: {
    SingleFile,
    BaseBytes
  },

  data() {
    return {
      source: new Uint8Array(0),
      isFileMode: false
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
      type: Uint8Array,
      default: () => new Uint8Array(0)
    },

    validate: {
      type: Function,
      default: () => {}
    }
  },

  methods: {
    handleChange(value) {
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
