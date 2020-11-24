<template>
  <div class="dashboard-wrapper subscan-content">
    <div v-if="multisigAccounts.length > 0" class="subscan-container subscan-card-title">
      {{ $t("wallet.list") }}
    </div>
    <div class="subscan-container subscan-card">
      <div v-if="multisigAccounts.length > 0" class="list-section">
        <el-table :data="multisigAccounts" style="width: 100%" ref="accountTable">
          <el-table-column min-width="100" :label="$t('name')" fit>
            <template slot-scope="props">
              <div>{{props.row.meta.name}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="300" :label="$t('address')" fit>
            <template slot-scope="props">
              <div class="address">{{props.row.address}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="200" :label="$t('balance')" fit>
            <!-- <template slot-scope="props">
              <div>{{props.row.address}}</div>
            </template> -->
          </el-table-column>
          <el-table-column min-width="100" :label="$t('status.index')" fit>
            <template slot-scope="props">
              <div>{{props.row.isAvailable ? $t('available') : $t('unavailable')}}</div>
            </template>
          </el-table-column>
          <el-table-column width="100" type="expand" :label="$t('action')">
            <template slot-scope="props">
              <div class="expand-form">
                <el-table
                  :data="props.row.meta.addressPair"
                  border
                  :show-header="false"
                  style="width: 100%">
                  <el-table-column prop="name" width="160">
                    <template slot-scope="props">
                      <div>{{props.row.name}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address">
                    <template slot-scope="props">
                      <address-display
                        customCls="address-display-cls"
                        :iconSize="30"
                        :hasCopyBtn="false"
                        :hasDisplayName="false"
                        :address="props.row.address"
                      ></address-display>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" width="200">
                    <template slot-scope="props">
                      <div>{{props.row.isInjected ? $t('injected') : $t('external')}}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="create-section">
        <div class="create">
          <icon-svg icon-class="add-circle" class="icon" />
          <div class="add-tip">{{ $t("wallet.empty") }}</div>
          <div class="btns">
            <router-link class="button" to="/wallet/create" tag="a">
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
import AddressDisplay from "@/views/Components/AddressDisplay";
export default {
  name: "Home",
  components: {
    AddressDisplay
  },
  data() {
    return {
      const_symbol: const_symbol,
      currentTime: Date.now(),
      drawer: false,
      network: "polkadot",
      multisigAccounts: [],
      tokens: {},
      metadata: {},
      sourceList: this.$const["COMMON/networkList"]["all"].value,
    };
  },
  watch: {
    isKeyringLoaded(newValue) {
      if(newValue) {
        this.getMultisigAccounts();
      }
    }
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      language: (state) => state.global.language,
      extensionAccountList: (state) => state.global.extensionAccountList,
      isKeyringLoaded: (state) => state.global.isKeyringLoaded
    })
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.getMultisigAccounts();
    },
    getMultisigAccounts() {
      this.multisigAccounts = [];
      const accounts = keyring.getAccounts();
      let extensionAddressList = [];
      _.forEach(this.extensionAccountList, (item) => {
        extensionAddressList.push(item.address);
      })
      _.forEach(accounts, ({ address, meta }) => {
        if (meta.isMultisig) {
          let isAvailable = false;
          _.forEach(meta.addressPair, (item) => {
            if (extensionAddressList.indexOf(item.address) > -1) {
              item.isInjected = true;
              isAvailable = true;
            } else {
              item.isInjected = false;
            }
          })
          this.multisigAccounts.push({
            address: address,
            meta: meta,
            isAvailable: isAvailable
          })
        }
      });
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
    .create-section {
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
          background: #302b3c;
          border-radius: 2px;
          color: #fff;
        }
        > div {
          text-align: center;
          font-weight: 600;
        }
      }
    }
    .list-section {
      margin: 30px;
      /deep/ .address-display-cls {
        .address-wrapper-address {
          pointer-events: none;
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
