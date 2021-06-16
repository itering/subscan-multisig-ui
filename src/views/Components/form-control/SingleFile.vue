<template>
  <el-row>
    <el-col :span="22">
      <el-upload
        drag
        action="''"
        :auto-upload="false"
        :multiple="false"
        :limit="1"
        :on-change="handleFileChange"
        :file-list="[]"
      >
        <div v-if="placeholder">{{placeholder}}</div>

        <div v-else-if="!file">
          {{ $t("Drag file here or click to select") }}
        </div>

        <div v-else class="file-info">
          <span>{{ file.name }}</span>
          <span>({{ file.size | formatNumber }}) Bytes</span>
          <i class="el-icon-delete" @click="handleRemove"></i>
        </div>
      </el-upload>
    </el-col>

    <el-col :span="2">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
import { formatNumber, u8aToHex } from "@polkadot/util";
import { convertResult } from "../../../utils/file";

export default {
  name: "SingleFile",

  data() {
    return {
      file: null
    };
  },

  filters: {
    u8aToHex,
    formatNumber
  },

  props: {
    onRemove: {
      type: Function,
      default: () => {}
    },
    
    onChange: {
      type: Function,
      default: () => {}
    },

    placeholder: {
      type: String,
      default: undefined
    }
  },

  methods: {
    handleFileChange(file) {
      const NOOP = () => {};

      if (file) {
        const reader = new FileReader();

        reader.onabort = NOOP;
        reader.onerror = NOOP;

        reader.onload = ({ target }) => {
          if (target && target.result) {
            const data = convertResult(target.result);

            if (data.length) {
              this.$emit("value-change", data);
              this.onChange(data);
            }
          }
        };

        reader.readAsArrayBuffer(file.raw);
        this.file = file;
      } else {
        this.file = null;
      }

      return false;
    },

    handleRemove(event) {
      this.file = null;
      event.stopPropagation();
      this.onRemove();
    }
  }
};
</script>

<style lang="scss">
.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 1em;
}
</style>
