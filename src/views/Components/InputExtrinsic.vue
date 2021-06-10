<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item :label="$t('module')">
          <el-select v-model="section" @change="onSectionChange">
            <el-option
              v-for="option in sectionOptions"
              :key="option.value"
              :label="option.text"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="16">
        <el-form-item :label="$t('call')">
          <el-select v-model="method" @change="onMethodChange">
            <el-option
              v-for="option in methodOptions"
              :key="option.value"
              :label="option.text"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      v-for="(control, index) in controls"
      :key="index"
      :label="$t(control.label)"
    >
      <component :is="control.component"></component>
    </el-form-item>
  </div>
</template>

<script>
import { GenericCall } from "@polkadot/types";
import { getTypeDef } from "@polkadot/types/create";
import { componentDefs } from "../../config/component-def";
import { Input } from "element-ui";

export default {
  data() {
    return {
      section: "",
      method: "",
      params: null
    };
  },

  props: {
    value: {
      type: String,
      default: null
    }
  },

  computed: {
    sectionOptions() {
      const api = this.$polkaApi;

      return Object.keys(api.tx)
        .sort()
        .filter(name => Object.keys(api.tx[name]).length)
        .map(name => ({
          text: name,
          value: name
        }));
    },

    methodOptions() {
      if (!this.section) {
        return [];
      }

      const section = this.$polkaApi.tx[this.section];

      if (!section || Object.keys(section).length === 0) {
        return [];
      }

      return Object.keys(section)
        .sort()
        .map(value => {
          const method = section[value];
          const inputs = method.meta.args
            .filter(arg => arg.type.toString() !== "Origin")
            .map(arg => arg.name.toString())
            .join(", ");

          return {
            text: `${value}(${inputs})`,
            value
          };
        });
    },

    controls() {
      if (!this.params) {
        return [];
      }

      const result = this.params.map(({ name, type }) => {
        const target = componentDefs.find(
          ({ types }) => types.indexOf(type.type) > -1
        );

        return { label: name, component: target ? target.component : Input };
      });

      return result;
    }
  },

  mounted() {},

  methods: {
    onSectionChange() {
      this.method = "";
    },

    onMethodChange() {
      if (this.method === "") {
        this.params = null;
      } else {
        const method = this.$polkaApi.tx[this.section][this.method];
        const params = this.getParams(method);

        this.params = params;
      }
    },

    getParams({ meta }) {
      return GenericCall.filterOrigin(meta).map(arg => ({
        name: arg.name.toString(),
        type: getTypeDef(arg.type.toString())
      }));
    }
  }
};
</script>

<style scoped></style>
