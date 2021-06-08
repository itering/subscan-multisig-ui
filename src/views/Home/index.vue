<template>
  <div class="dashboard-wrapper subscan-content">
    <div
      v-if="multisigAccounts.length > 0"
      class="subscan-container subscan-card-title"
    >
      {{ $t("wallet.list") }}
    </div>
    <div class="subscan-container subscan-card">
      <div v-if="multisigAccounts.length > 0" class="list-section">
        <el-table
          :data="multisigAccounts"
          style="width: 100%"
          ref="accountTable"
        >
          <el-table-column min-width="100" :label="$t('name')" fit>
            <template slot-scope="props">
              <div>{{ props.row.meta.name }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="300" :label="$t('address')" fit>
            <template slot-scope="props">
              <a class="link" :href="getNetworkHref(`/account/${props.row.address}`)" target="_blank">
                {{props.row.address}}
              </a>
            </template>
          </el-table-column>
          <el-table-column min-width="150" :label="$t('balance')" fit>
            <template slot-scope="props">
              <div>
                <span>{{ props.row.balance | accuracyFormat(tokenDecimal) }}</span>
                <span class="token-symbol">{{tokenSymbol}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100" :label="$t('status.index')" fit>
            <template slot-scope="props">
              <div>
                {{
                  props.row.isAvailable ? $t("available") : $t("unavailable")
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')">
            <template slot-scope="props">
              <div class="btns">
                <div class="expand-btn aciton-btn" @click="handleRuntimeExpand(props.row)">
                  <icon-svg class="icon" icon-class="users"></icon-svg>
                </div>
                <router-link class="detail-btn aciton-btn" :to="`/wallet/${props.row.address}`" tag="div">
                  <icon-svg class="icon" icon-class="triangle"></icon-svg>
                  <div class="red-dot" v-if="props.row.hasInfo && props.row.isAvailable"></div>
                </router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="expand-form">
                <Accounts :accounts="props.row.meta.addressPair" />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="btns">
          <router-link class="button black-btn" to="/wallet/create" tag="a">
            {{ $t("wallet.add") }}
          </router-link>
        </div>
      </div>
      <div v-else class="create-section">
        <div class="create">
          <icon-svg icon-class="add-circle" class="icon" />
          <div class="add-tip">{{ $t("wallet.empty") }}</div>
          <div class="btns">
            <router-link class="button black-btn" to="/wallet/create" tag="a">
              {{ $t("wallet.add") }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import const_symbol from "Service/const/symbol";
import { mapState } from "vuex";
import { isMobile } from "Utils/tools";
import keyring from "@polkadot/ui-keyring";
import { accuracyFormat, toThousandslsFilter } from "Utils/filters";
import { getTokenDecimalByCurrency } from "../../utils/tools";
import Accounts from '@/views/Components/Accounts.vue';

export default {
  name: "Home",
  components: {
    Accounts,
  },
  data() {
    return {
      const_symbol: const_symbol,
      currentTime: Date.now(),
      drawer: false,
      multisigAccounts: [],
      extensionAddressList: [],
      sourceList: this.$const["COMMON/networkList"]["all"].value,
    };
  },
  filters: {
    accuracyFormat,
    toThousandslsFilter,
  },
  watch: {
    isKeyringLoaded(newValue) {
      if (newValue) {
        this.getMultisigAccounts();
      }
    },
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      language: (state) => state.global.language,
      token: (state) => state.global.token,
      extensionAccountList: (state) => state.global.extensionAccountList,
      isKeyringLoaded: (state) => state.global.isKeyringLoaded,
    }),
    tokenSymbol() {
      return this.token.tokenSymbol && this.token.tokenSymbol[0] ;
    },
    tokenDecimal() {
      return getTokenDecimalByCurrency(this.token);
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.getMultisigAccounts();
      this.getAccountBalance();
    },
    getAccountBalance() {
      let multisigAddressList = _.map(this.multisigAccounts, "address");
      this.$polkaApi.query.system.account.multi(
        multisigAddressList,
        (balances) => {
          _.forEach(balances, ({ data }, index) => {
            this.multisigAccounts[index]["balance"] = data.free.toString();
          });
        }
      );
    },
    getMultisigAccounts() {
      this.multisigAccounts = [];
      const accounts = keyring.getAccounts();
      this.extensionAddressList = [];
      _.forEach(this.extensionAccountList, (item) => {
        this.extensionAddressList.push(item.address);
      });
      _.forEach(accounts, ({ address, meta }) => {
        if (meta.isMultisig) {
          let isAvailable = false;
          _.forEach(meta.addressPair, (item) => {
            if (this.extensionAddressList.indexOf(item.address) > -1) {
              item.isInjected = true;
              isAvailable = true;
            } else {
              item.isInjected = false;
            }
          });
          this.multisigAccounts.push({
            balance: "",
            address: address,
            meta: meta,
            isAvailable: isAvailable,
            hasInfo: false
          });
        }
      });
      this.checkMultisigInfos();
    },
    checkMultisigInfos() {
      let multisigAddressList = _.map(this.multisigAccounts, "address");
      _.forEach(multisigAddressList, async (address, index) => {
        const info = await this.$polkaApi.query["multisig"].multisigs.entries(
          address
        );
        this.multisigAccounts[index]["hasInfo"] = info && info.length > 0;
      })
    },
    getNetworkHref(path) {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["domain"]["value"] + path;
    },
    handleRuntimeExpand(row) {
      this.$refs["accountTable"] && this.$refs["accountTable"].toggleRowExpansion(row);
    },
    isMobile() {
      return isMobile();
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  .subscan-card {
    position: relative;
    min-height: 500px;
    flex: 1 1 auto;
    .create-section {
      flex: 1 1 auto;
      .create {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        .icon {
          font-size: 94px;
          color: var(--main-color);
        }
        .btns {
          display: flex;
          justify-content: center;
        }
        .add-tip {
          margin: 60px 0 40px;
          font-size: 20px;
          line-height: 28px;
        }
        .button {
          font-size: 14px;
          cursor: pointer;
          display: inline-block;
          margin-top: 10px;
          padding: 10px 50px;
        }
        > div {
          text-align: center;
          font-weight: 600;
        }
      }
    }
    .list-section {
      flex: 1 1 auto;
      margin: 30px;
      .button {
        font-size: 14px;
        cursor: pointer;
        display: inline-block;
        margin-top: 10px;
        padding: 10px 50px;
      }
      /deep/ .address-display-cls {
        .address-wrapper-address {
          // pointer-events: none;
        }
      }
      /deep/ .el-table {
        .btns {
          padding: 6px 0;
          display: flex;
          .aciton-btn {
            width: 50px;
            height: 26px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .expand-btn {
            border: 1px solid #DBDBDB;
            margin-right: 8px;
            color: #98959F;
            font-size: 16px;
          }
          .detail-btn {
            position: relative;
            border: 1px solid var(--main-color);
            color: var(--main-color);
            font-size: 12px;
            .red-dot {
              position: absolute;
              top: -6px;
              right: -6px;
              width: 12px;
              height: 12px;
              background: #FF475D;
              border-radius: 50%;
            }
          }
        }
        .el-table__expand-column {
          .cell {
            display: none;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.main {
  display: flex;
}
</style>
