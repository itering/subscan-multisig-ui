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
      <component
        :is="control.component"
        v-model="params[index].value"
      ></component>
    </el-form-item>
  </div>
</template>

<script>
import { GenericCall } from "@polkadot/types";
import { getTypeDef } from "@polkadot/types/create";
import { findComponent } from "../../utils/find-component";

export default {
  name: "extrinsic",

  data() {
    return {
      section: "",
      method: "",
      params: null // { name: string; type: {displayName: string; info: number; name: string; type: string}; value: any }[];
    };
  },

  model: {
    prop: "value",
    event: "value-change"
  },

  props: {
    value: {
      type: Object, // shape of data
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
        const component = findComponent(this.$registry, type, {});
        console.log(
          "%c [ component ]-121",
          "font-size:13px; background:pink; color:#bf2c9f;",
          component
        );

        return { label: name, component };
      });

      return result;
    }
  },

  mounted() {},

  methods: {
    onSectionChange() {
      this.method = "";
      this.params = null;
    },

    onMethodChange() {
      if (this.method === "") {
        this.params = null;
      } else {
        const method = this.$polkaApi.tx[this.section][this.method];

        this.params = this.getParams(method);
      }
    },

    getParams({ meta }) {
      return GenericCall.filterOrigin(meta).map(arg => ({
        name: arg.name.toString(),
        type: getTypeDef(arg.type.toString())
      }));
    },

    onParamsChange() {
      this.$emit("value-change", {
        method: this.method,
        section: this.section,
        params: this.params
      });
    }
  },

  watch: {
    section: function() {
      this.$emit("value-change", {
        section: this.section,
        method: "",
        params: null
      });
    },

    method: function() {
      this.$emit("value-change", {
        section: this.section,
        method: this.method,
        params: null
      });
    },
    
    params: {
      deep: true,
      handler: "onParamsChange"
    }
  }
};
</script>

<style scoped></style>
