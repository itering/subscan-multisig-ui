<template>
  <el-input v-model="source" @change="handleChange" :disabled="disabled">
    <slot slot="append"></slot>
  </el-input>
</template>

<script>
import {
  compactAddLength,
  hexToU8a,
  isAscii,
  decodeAddress,
  stringToU8a,
  u8aToHex,
  isU8a,
  isHex,
  u8aToString
} from "@polkadot/util";

export default {
  name: "BaseBytes",

  data() {
    return {
      source: ""
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
      default: () => new Uint8Array(0)
    },

    validate: {
      type: Function,
      default: () => true
    },

    withLength: {
      type: Boolean,
      default: false
    },

    length: {
      type: Number,
      default: -1
    },

    asHex: {
      type: Boolean,
      default: false
    },

    onChange: {
      type: Function,
      default: () => {}
    }
  },

  mounted() {
    const value = this.value;

    this.source = value
      ? this.disabled && isU8a(value) && isAscii(value)
        ? u8aToString(value)
        : isHex(value)
        ? value
        : u8aToHex(value, this.disabled ? 256 : -1)
      : undefined;
    console.log('%c [ value ]-72', 'font-size:13px; background:pink; color:#bf2c9f;', this.source, value);
  },

  methods: {
    handleChange(str) {
      let [isValid, value] = this.convertInput(str);

      isValid =
        isValid &&
        this.validate(value) &&
        (this.length !== -1 ? value.length === this.length : value.length !== 0);

      if (this.withLength && isValid) {
        value = compactAddLength(value);
      }

      value = this.asHex ? u8aToHex(value) : value;

      if (isValid) {
        this.$emit("value-change", value);
        this.onChange(value);
      }
    },

    convertInput(value) {
      if (value === "0x") {
        return [true, new Uint8Array([])];
      } else if (value.startsWith("0x")) {
        try {
          return [true, hexToU8a(value)];
        } catch (error) {
          return [false, new Uint8Array([])];
        }
      }

      // maybe it is an ss58?
      try {
        return [true, decodeAddress(value)];
      } catch (error) {
        // we continue
      }

      return isAscii(value)
        ? [true, stringToU8a(value)]
        : [value === "0x", new Uint8Array([])];
    }
  }
};
</script>
