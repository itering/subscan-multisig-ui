
<template>
  <div class="struct-table">
    <div v-if="call !=='set_code'" class="struct-table-content" :class="isInner ? 'is-inner': ''">
      <table class="table is-bordered is-narrow is-object" v-if="isObject(struct)">
        <tbody>
          <tr v-for="(item, index) in struct" :key="index">
            <!-- <td>{{item}}</td> -->
            <td
              v-if="isObject(item) && item && item.type"
              :width="isInner ? '20%' : '15%'"
              class="td-border td-column td-column-1"
            >
              <div v-if="showName" class="table-cell">{{ item && item.name }}</div>
              <div v-else class="table-cell">{{ item && item.type }}</div>
            </td>
            <td v-else :width="isInner ? '20%' : '15%'" class="td-border td-column td-column-2">
              <div class="table-cell">{{ index }}</div>
            </td>
            <td v-if="!isObject(item)" class="td-border td-column td-column-3">
              <div v-if="isBalance" class="table-cell">{{item | accuracyFormat(tokenDecimal)|toThousandslsFilter}}</div>
              <div v-else-if="isCrabValue(index)" class="table-cell">{{item | accuracyFormat(tokenDecimal)|toThousandslsFilter}}</div>
              <div v-else-if="isDownloadType(item)" class="table-cell download-wrapper">
                <a :href="item" target="_blank">
                  {{$t('download')}}
                  <icon-svg class="icon" icon-class="download-csv" />
                </a>
              </div>
              <div v-else-if="!isAddress" class="table-cell">{{ item }}</div>
              <div v-else class="table-address-cell align-items-center">
                <address-display customCls="address-display-cls" :hasDisplayName="false" :isValidate="isValidate" :address="item" :copyBtnSize="10"></address-display>
              </div>
            </td>
            <td v-if="isObject(item)" class="struct-cell-wrapper td-column td-column-4">
              <component
                v-if="item.type"
                :block="block"
                :isAddress="isAddressType(item.type)"
                :isBalance="isBalanceType(item.type)"
                :isValue="isValueType(item.name)"
                :struct="formatAddress(item.value, item.type)"
                :isInner="true"
                :isValidate="isValidate"
                :is="'StructTable'"
              />
              <component v-else :block="block" :struct="item" :isValidate="isValidate" :isInner="true" :is="'StructTable'"></component>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else class="table is-bordered is-narrow">
        <tbody>
          <tr>
            <td class="td-border td-column td-column-3">
              <div v-if="isBalance" class="table-cell">{{struct | accuracyFormat(tokenDecimal)|toThousandslsFilter}}</div>
              <div v-else-if="isValue" class="table-cell value">{{ struct }}</div>
              <div v-else-if="isDownloadType(struct)" class="table-cell download-wrapper">
                <a :href="struct" target="_blank">
                  {{$t('download')}}
                  <icon-svg class="icon" icon-class="download-csv" />
                </a>
              </div>
              <div v-else-if="!isAddress" class="table-cell">{{ struct }}</div>
              <div v-else class="table-address-cell align-items-center">
                <address-display customCls="address-display-cls" :hasDisplayName="false" :isValidate="isValidate" :address="struct" :copyBtnSize="10"></address-display>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <div v-else class="table-cell">{{ struct }}</div> -->
    </div>
    <div v-else class="download-wrapper">
      <a :href="getHref()" target="_blank">
        {{$t('govern.download_wasm_binary')}}
        <icon-svg class="icon" icon-class="download-csv" />
      </a>
    </div>
  </div>
</template>

<script>
import AddressDisplay from "@/views/Components/AddressDisplay";
import { encodeAddress } from "@polkadot/util-crypto";
import _ from "lodash";
import { accuracyFormat, toThousandslsFilter } from "Utils/filters";
import { getTokenDecimalByCurrency } from "../../utils/tools";
import clipboard from "Directives/clipboard";
import { mapState } from "vuex";
export default {
  name: "StructTable",
  components: {
    AddressDisplay
  },
  componentName: "StructTable",
  data() {
    return {
      currency: "ring"
    };
  },
  filters: {
    accuracyFormat,
    toThousandslsFilter
  },
  directives: {
    clipboard
  },
  props: {
    struct: {
      default: () => {
        return "";
      }
    },
    block: {},
    isAddress: {
      default: () => {
        return false;
      }
    },
    isBalance: {
      default: () => {
        return false;
      }
    },
    isValidate: {
      default: () => {
        return false;
      }
    },
    isValue: {
      default: () => {
        return false;
      }
    },
    call: {
      default: () => {
        return "";
      }
    },
    isInner: {
      default: () => {
        return false;
      }
    },
    showName: {
      default: () => {
        return true;
      }
    }
  },
  created() {},
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      metadata: state => state.polka.metadata,
      token: state => state.global.token
    }),
    tokenDecimal() {
      return getTokenDecimalByCurrency(this.token);
    },
  },
  methods: {
    isAddressType(type) {
      let result = false;
      if (type) {
        if (this.$const['COMMON/typeList']['address'].value.indexOf(type.toLowerCase()) > -1) {
          result = true;
        }
      }
      return result;
    },
    isCrabValue(type) {
      let result = false;
      if(type && type.toLowerCase && (type.toLowerCase() === 'ringbalance' || type.toLowerCase() === 'ktonbalance')) {
        result = true;
      }
      return result;
    },
    isBalanceType(type) {
      let result = false;
      if (type) {
        if (this.$const['COMMON/typeList']['balance'].value.indexOf(type.toLowerCase()) > -1) {
          result = true;
        }
      }
      return result;
    },
    isDownloadType(type) {
      let result = false;
      if (type && this.isString(type)) {
        result = type.indexOf('https://subscan.oss-cn-hangzhou.aliyuncs.com') > -1;
      }
      return result;
    },
    isValueType(type) {
      return type && /value/i.test(type);
    },
    formatAddress(val, type) {
      if (this.isAddressType(type)) {
        if (_.isString(val)) {
          let address = val;
          return address;
        } else if (_.isArray(val)) {
          let arr = [];
          _.forEach(val, item => {
            let address = item;
            try {
              let formatVal = item.padStart(66, "0x");
              address = encodeAddress(formatVal, this.metadata.addressType);
            } catch (err) {
              console.error("invalid address");
            }
            arr.push(address);
          });
          return arr;
        } else {
          return val;
        }
      } else {
        return val;
      }
    },
    getHref() {
      let param = this.struct && this.struct[0];
      return param && param.value;
    },
    isObject(struct) {
      return _.isObject(struct);
    },
    isString(struct) {
      return _.isString(struct);
    },
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: this.$t("copy_success")
      });
    }
  }
};
</script>

 <style lang="scss" scoped>
.download-wrapper {
  display: flex;
  a {
    cursor: pointer;
    color: var(--main-color);
    display: flex;
    align-items: center;
  }
  .icon {
    font-size: 30px;
  }
}
.struct-table-content {
  // overflow: scroll;
  // padding: 20px;
  background-color: #f3f5f9;
  // margin: 10px 0;
  &.is-inner {
    padding: 0;
    background-color: #fff;
    margin: 0;
    .table {
      border-width: 0;
    }
  }
  .table {
    background-color: #fff;
    color: #363636;
    width: 100%;
    border-collapse: separate;
    border: 1px solid #e7eaf3;
    border-width: 1px 0 0 1px;
    table-layout: fixed;
  }
  .table-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding: 0 10px;
    line-height: 1.5;
    min-height: 21px;
  }
  .table-address-cell {
    line-height: 1.5;
    .address-display-cls {
      margin-left: 10px;
    }
    .icon {
      line-height: 1;
      margin: 0 10px;
    }
    a {
      word-break: break-all;
      color: var(--link-color);
    }
    .copy-btn {
      cursor: pointer;
      margin-left: 10px;
      margin-right: 10px;
      color: var(--main-color-light);
    }
  }
  .td-border {
    border: 1px solid #e7eaf3;
    border-width: 0 1px 1px 0;
  }

  .struct-cell-wrapper {
    padding: 0 !important;
    border: none !important;
  }
  // > tr {
  //   > td:first-child {
  //     border-left-width: 0 !important;
  //     &.td-column {
  //       border-left-width: 1px !important;

  //     }
  //   }
  // }
  // td + td {
  //   border-left-width: 0 !important;
  // }
  // &.is-inner {
  //   display: flex;
  //   table {
  //     flex: 1 1 auto;
  //   }
  //   tr {
  //     > td:first-child {
  //       border-left-width: 0 !important;
  //     }

  //     &:first-child {
  //       > td {
  //         border-top-width: 0 !important;
  //       }
  //     }
  //     &:last-child {
  //       > td {
  //         border-bottom-width: 0 !important;
  //       }
  //     }
  //   }
  // }
  // .cell {
  //   padding: 0.25em 0.5em;
  // }

  .table td,
  .table th {
    // border: 1px solid #E7EAF3;
    // border-width: 0 0 1px;
    // border-width: 0 1px 1px 0;
    padding: 0;
    // padding: 0.5em 0.75em;
    // vertical-align: top;
  }

  .table td {
    padding: 0.5em 0;
  }

  .table td.is-white,
  .table th.is-white {
    background-color: #fff;
    border-color: #fff;
    color: #0a0a0a;
  }

  .table td.is-black,
  .table th.is-black {
    background-color: #0a0a0a;
    border-color: #0a0a0a;
    color: #fff;
  }

  .table td.is-light,
  .table th.is-light {
    background-color: #f5f5f5;
    border-color: #f5f5f5;
    color: #363636;
  }

  .table td.is-dark,
  .table th.is-dark {
    background-color: #363636;
    border-color: #363636;
    color: #f5f5f5;
  }

  .table td.is-primary,
  .table th.is-primary {
    background-color: #00d1b2;
    border-color: #00d1b2;
    color: #fff;
  }

  .table td.is-link,
  .table th.is-link {
    background-color: #3273dc;
    border-color: #3273dc;
    color: #fff;
  }

  .table td.is-info,
  .table th.is-info {
    background-color: #209cee;
    border-color: #209cee;
    color: #fff;
  }

  .table td.is-success,
  .table th.is-success {
    background-color: #23d160;
    border-color: #23d160;
    color: #fff;
  }

  .table td.is-warning,
  .table th.is-warning {
    background-color: #ffdd57;
    border-color: #ffdd57;
    color: rgba(0, 0, 0, 0.7);
  }

  .table td.is-danger,
  .table th.is-danger {
    background-color: #ff3860;
    border-color: #ff3860;
    color: #fff;
  }

  .table td.is-narrow,
  .table th.is-narrow {
    white-space: nowrap;
    width: 1%;
  }

  .table td.is-selected,
  .table th.is-selected {
    background-color: #00d1b2;
    color: #fff;
  }

  .table td.is-selected a,
  .table td.is-selected strong,
  .table th.is-selected a,
  .table th.is-selected strong {
    color: currentColor;
  }

  .table th {
    color: #363636;
  }

  .table th:not([align]) {
    text-align: left;
  }

  .table tr.is-selected {
    background-color: #00d1b2;
    color: #fff;
  }

  .table tr.is-selected a,
  .table tr.is-selected strong {
    color: currentColor;
  }

  .table tr.is-selected td,
  .table tr.is-selected th {
    border-color: #fff;
    color: currentColor;
  }

  .table thead {
    background-color: transparent;
  }

  .table thead td,
  .table thead th {
    border-width: 0 0 2px;
    color: #363636;
  }

  .table tfoot {
    background-color: transparent;
  }

  .table tfoot td,
  .table tfoot th {
    border-width: 2px 0 0;
    color: #363636;
  }

  .table tbody {
    background-color: transparent;
  }

  .table tbody tr:last-child td,
  .table tbody tr:last-child th {
    // border-bottom-width: 0;
  }

  .table.is-bordered td,
  .table.is-bordered th {
    // border-width: 1px;
  }

  .table.is-bordered tr:last-child td,
  .table.is-bordered tr:last-child th {
    // border-bottom-width: 1px;
  }

  .table.is-fullwidth {
    width: 100%;
  }

  .table.is-hoverable tbody tr:not(.is-selected):hover,
  .table.is-hoverable.is-striped tbody tr:not(.is-selected):hover {
    background-color: #fafafa;
  }

  .table.is-hoverable.is-striped
    tbody
    tr:not(.is-selected):hover:nth-child(even) {
    background-color: #f5f5f5;
  }

  .table.is-narrow td,
  .table.is-narrow th {
    // padding: 0.25em 0.5em;
  }

  .table.is-striped tbody tr:not(.is-selected):nth-child(even) {
    background-color: #fafafa;
  }

  .table-container {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    overflow-y: hidden;
    max-width: 100%;
  }
}
</style>
<style lang="scss">
</style>
