<template>
  <div class="option-with-switch">
    <component
      :is="control"
      v-model="source"
      :onChange="handleChange"
      v-if="sub && isActive"
    ></component>

    <el-input disabled v-else class="empty" :value="$t('empty')"></el-input>

    <el-tooltip
      :content="$t(isActive ? 'include option' : 'exclude option')"
      placement="top"
    >
      <el-switch v-model="isActive" @change="handleSwitch"></el-switch>
    </el-tooltip>
  </div>
</template>

<script>
import { findComponent } from "../../../utils/find-component";

export default {
  name: "Option",

  data() {
    return {
      source: null,
      isActive: false
    };
  },

  model: {
    prop: "value",
    event: "value-change"
  },

  props: {
    sub: {
      type: Object,
      default: () => null
    }
  },

  computed: {
    control() {
      if (!this.sub) {
        return null;
      }

      const component = findComponent(this.$registry, this.sub, {});

      return component || null;
    }
  },

  mounted() {
    this.handleChange(null);
  },

  methods: {
    handleChange(value) {
      this.$emit("value-change", value);
    },

    handleSwitch() {
      this.source = null;
      this.$emit("value-change", null);
    }
  }
};
</script>

<style lang="scss">
.option-with-switch {
  position: relative;

  .el-switch {
    position: absolute;
    right: 3em;
    top: 5px;
  }
}
</style>
