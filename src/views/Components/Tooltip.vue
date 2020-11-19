<template>
  <div class="tooltip-component">
    <el-tooltip :class="customCls" :effect="effect" :placement="placement">
      <div slot="content" class="tooltip-content" v-clipboard:copy="content"
                  v-clipboard:success="clipboardSuccess">{{content}}</div>
      <slot></slot>
    </el-tooltip>
  </div>
</template>
<script>
import clipboard from "Directives/clipboard";
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    customCls: {
      type: String,
      required: false
    },
    placement: {
      type: String,
      required: false
    },
    effect: {
      type: String,
      required: false
    }
  },
  directives: {
    clipboard
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: this.$t("copy_success")
      });
    }
  }
};
</script>

<style lang="scss">
.tooltip-component {
}
.el-tooltip__popper {
  .tooltip-content {
    cursor: pointer;
  }
}
</style>
