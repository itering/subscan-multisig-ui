<template>
  <div class="dashboard-wrapper subscan-content">
    <div class="subscan-container subscan-card account-intro">
      <div class="name">
        {{ multisigAccount.meta && multisigAccount.meta.name }}
      </div>
      <address-display
        customCls="address-display-cls"
        :hasIdenticon="false"
        :hasDisplayName="false"
        :address="address"
      ></address-display>
      <el-dropdown class="dropdown" trigger="click" placement="bottom">
        <div class="icon-wrapper">
          <icon-svg class="iconfont" icon-class="setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="setting-dropdown-menu">
          <el-dropdown-item class="menu-item">{{
            $t("view_in_subscan")
          }}</el-dropdown-item>
          <el-dropdown-item
            class="menu-item"
            @click.native="renameDialogVisible = true"
            >{{ $t("rename") }}</el-dropdown-item
          >
          <el-dropdown-item
            class="menu-item"
            @click.native="deleteDialogVisible = true"
            >{{ $t("delete") }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog
        class="deleteDialog"
        title=""
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="deleteDialogVisible"
        width="560px"
      >
        <div class="title">{{ $t("wallet.delete") }}</div>
        <div class="message">
          {{
            $t("wallet.delete_confirm", {
              name: multisigAccount.meta && multisigAccount.meta.name,
            })
          }}
        </div>
        <div class="btns">
          <div class="button black-btn" @click="deleteWallet">
            {{ $t("ok") }}
          </div>
          <div class="button white-btn" @click="deleteDialogVisible = false">
            {{ $t("cancel") }}
          </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
      <el-dialog
        class="renameDialog"
        title=""
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="renameDialogVisible"
        width="560px"
      >
        <div class="title">{{ $t("rename") }}</div>
        <el-form label-width="80px" :model="form" label-position="top">
          <el-form-item :label="$t('name')">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
        <div class="btns">
          <div class="button black-btn" @click="renameWallet">
            {{ $t("ok") }}
          </div>
          <div class="button white-btn" @click="renameDialogVisible = false">
            {{ $t("cancel") }}
          </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
      <div class="placeholder"></div>
      <div class="button" @click="extrinsicDialogVisible = true">
        {{ $t("submit_extrinsic") }}
      </div>
      <el-dialog
        class="submitDialog"
        title=""
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="extrinsicDialogVisible"
        width="560px"
      >
        <div class="title">{{ $t("submit_extrinsic") }}</div>
        <el-form label-width="80px" :model="form" label-position="top">
          <el-form-item :label="$t('account')">
            <el-select placeholder v-model="form.account" class="select">
              <el-option
                v-for="item in injectedAccountList"
                :key="item.address"
                class="popover-option"
                :label="item.name"
                :value="item.address"
              >
                <address-display
                  customCls="address-display-cls"
                  :hasAddressWrapper="true"
                  :hasHashFormat="true"
                  :iconSize="30"
                  :address="item.address"
                  :hasCopyBtn="false"
                  :hasDisplayNameInfo="true"
                  :displayNameInfo="getAccountDisplayInfo(item)"
                ></address-display>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('module')">
            <el-input v-model="form.module" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('call')">
            <el-input v-model="form.call" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('dest')">
            <el-input v-model="form.dest"></el-input>
          </el-form-item>
          <el-form-item :label="$t('value')">
            <el-input
              v-model="form.value"
              @input="handleInputChange"
            ></el-input>
            <div>
              {{ fee }}
            </div>
          </el-form-item>
        </el-form>
        <div class="btns">
          <div class="button black-btn" @click="sendTransction">
            {{ $t("send") }}
          </div>
          <div class="button white-btn" @click="extrinsicDialogVisible = false">
            {{ $t("cancel") }}
          </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
    </div>
    <div class="subscan-container subscan-card extrinsic-list">
      <div class="list-section">
        <el-table :data="extrinsics" style="width: 100%" ref="accountTable">
          <el-table-column min-width="200" :label="$t('call_hash')" fit>
            <template slot-scope="props">
              <div>{{ props.row.callHash }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="80" :label="$t('action')" fit>
            <template slot-scope="props">
              <!-- <router-link :to="`/wallet/${props.row.address}`" tag="a">
                {{props.row.address}}
              </router-link> -->
              <div>{{ getAction(props.row.address) }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="40" :label="$t('progress')" fit>
            <template slot-scope="props">
              <div>{{ getProgress(props.row.approvals) }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="80" :label="$t('status.index')" fit>
            <template slot-scope="props">
              <div>
                {{ getExtrinsicStatus(props.row.callHash) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="40" type="expand">
            <template slot-scope="scope">
              <div class="expand-form">
                <el-table
                  :data="multisigAccount.meta.addressPair"
                  border
                  :show-header="false"
                  style="width: 100%"
                >
                  <el-table-column prop="name" width="160">
                    <template slot-scope="props">
                      <div>{{ props.row.name }}</div>
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
                      <div>{{ hasApproved(props.row.address, scope.row.approvals) }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
import { accuracyFormat, toThousandslsFilter } from "Utils/filters";
import { getTokenDecimalByCurrency } from "../../utils/tools";
import BN from "bn.js";
export default {
  name: "Home",
  components: {
    AddressDisplay,
  },
  data() {
    return {
      const_symbol: const_symbol,
      multisigAccount: {},
      address: "",
      form: {
        account: "",
        dest: "",
        module: "",
        call: "",
        value: "",
      },
      fee: "0",
      extrinsics: [],
      extrinsicDialogVisible: false,
      deleteDialogVisible: false,
      renameDialogVisible: false,
      tokens: {},
      metadata: {},
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
      token: (state) => state.polka.token,
      extensionAccountList: (state) => state.global.extensionAccountList,
      isKeyringLoaded: (state) => state.global.isKeyringLoaded,
    }),
    tokenSymbol() {
      return this.token.tokenSymbol;
    },
    tokenDecimal() {
      return getTokenDecimalByCurrency(this.token);
    },
    injectedAccountList() {
      return _.filter(this.multisigAccount.meta?.addressPair, (item) => {
        return item.isInjected;
      });
    },
    isMultiCall() {
      return false;
    },
  },
  created() {
    this.address = this.$route.params.key;
    this.init();
    this.debounceCalc = _.debounce(this.calcFee, 500);
  },
  mounted() {},
  methods: {
    init() {
      this.getMultisigAccount();
      this.getAccountMultisigs();
      // let hex = transfer.method.toHex();
      // const callData = this.$registry.createType("Call", hex);
      // console.log(callData.toHuman());
    },
    getAccountDisplayInfo(item) {
      return {
        address: item.address,
        display: item.name,
      };
    },
    getMultisigAccount() {
      this.multisigAccount = {};
      const accounts = keyring.getAccounts();
      let extensionAddressList = [];
      _.forEach(this.extensionAccountList, (item) => {
        extensionAddressList.push(item.address);
      });
      _.forEach(accounts, ({ address, meta }) => {
        if (meta.isMultisig && address === this.address) {
          let isAvailable = false;
          _.forEach(meta.addressPair, (item) => {
            if (extensionAddressList.indexOf(item.address) > -1) {
              item.isInjected = true;
              isAvailable = true;
            } else {
              item.isInjected = false;
            }
          });
          this.multisigAccount = {
            address: address,
            meta: meta,
            isAvailable: isAvailable,
          };
          return false;
        }
      });
    },
    hasApproved(address, approveList) {
      return (approveList && (approveList.indexOf(address) > -1)) ? "approved": "unapproved";
    },
    async getAccountMultisigs() {
      const info = await this.$polkaApi.query["multisig"].multisigs.entries(
        this.multisigAccount.address
      );
      _.forEach(info, item => {
        let extrinsic = {
          ...(item[1].toJSON()),
          address: (item[0].toHuman())[0],
          callHash: (item[0].toHuman())[1],
        };
        this.extrinsics.push(extrinsic);
      })
    },
    getAction() {
      return "-"
    },
    getProgress(approvals) {
      let cur = approvals && approvals.length || 0;
      return cur + "/" + this.multisigAccount.meta.threshold;
    },
    getExtrinsicStatus() {
      return "pending";
    },
    extractExternal(accountId) {
      if (!accountId) {
        return { isMultisig: false, threshold: 0, who: [] };
      }
      let publicKey;
      try {
        publicKey = keyring.decodeAddress(accountId);
      } catch (error) {
        console.error(error);
        return { isMultisig: false, threshold: 0, who: [] };
      }
      const pair = keyring.getPair(publicKey);
      return {
        isMultisig: !!pair.meta.isMultisig,
        threshold: pair.meta.threshold || 0,
        who: (pair.meta.who || []).map(this.recodeAddress),
      };
    },
    recodeAddress(address) {
      return keyring.encodeAddress(keyring.decodeAddress(address));
    },
    getBn(input) {
      let BN_TEN = new BN(10);
      let num = new BN(input.replace(/[^\d]/g, "")).mul(BN_TEN.pow(new BN(this.tokenDecimal)));
      return num;
    },
    handleInputChange() {
      this.fee = "calculating";
      this.debounceCalc();
    },
    async calcFee() {
      let multiRoot = this.multisigAccount.address;
      let tx = this.$polkaApi.tx.balances.transferKeepAlive(
        this.form.dest,
        this.getBn(this.form.value)
      );
      const { partialFee } = await tx.paymentInfo(multiRoot);
      this.fee =
        accuracyFormat(partialFee.toJSON(), this.tokenDecimal) +
        " " +
        this.tokenSymbol;
    },
    async sendTransction() {
      let multiRoot = this.multisigAccount.address;
      let signAddress = this.form.account;
      let api = this.$polkaApi;
      let tx = api.tx.balances.transferKeepAlive(
        this.form.dest,
        this.getBn(this.form.value)
      );
      let multiModule = api.tx.multisig;
      const info = await api.query["multisig"].multisigs(
        multiRoot,
        tx.method.hash
      );
      const { threshold, who } = this.extractExternal(multiRoot);
      const others = who.filter((w) => w !== signAddress);
      const { weight } = await tx.paymentInfo(multiRoot);
      let timepoint = null;
      if (info.isSome) {
        timepoint = info.unwrap().when;
      }
      tx = this.isMultiCall
      ? multiModule.asMulti.meta.args.length === 6
        ? multiModule.asMulti(threshold, others, timepoint, tx.method.toHex(), true, weight)
        : multiModule.asMulti(threshold, others, timepoint, tx.method)
      : multiModule.approveAsMulti.meta.args.length === 5
        ? multiModule.approveAsMulti(threshold, others, timepoint, tx.method.hash, weight)
        : multiModule.approveAsMulti(threshold, others, timepoint, tx.method.hash);
      this.$polkaApi.tx.multisig.approveAsMulti(threshold, others, timepoint, tx.method.hash, weight);
      this.signAndSend(tx);
    },
    async signAndSend() {
      // try {
      //   await tx.signAsync(pairOrAddress, options);
      //   queueSetTxStatus(currentItem.id, 'sending');
      //   const unsubscribe = await tx.send(handleTxResults('signAndSend', queueSetTxStatus, currentItem, () => {
      //     unsubscribe();
      //     this.$message({
      //       type: "success",
      //       message: this.$t("success"),
      //     });
      //   }));
      // } catch(err) {
      //   this.$message({
      //     type: "error",
      //     message: error.message
      //   });
      // }
    },
    renameWallet() {
      try {
        const pair = keyring.getPair(this.address);
        keyring.saveAccountMeta(pair, {
          name: this.form.name,
          whenEdited: Date.now(),
        });
        this.$message({
          type: "success",
          message: this.$t("success"),
        });
        this.renameDialogVisible = false;
        this.getMultisigAccount();
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    deleteWallet() {
      try {
        keyring.forgetAccount(this.address);
        this.$message({
          type: "success",
          message: this.$t("success"),
        });
        this.$router.push("/");
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
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
    /deep/ .address-display-cls {
      .address-wrapper-address {
        pointer-events: none;
      }
    }
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
    }
    &.account-intro {
      height: 70px;
      min-height: auto;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      .name {
        font-size: 14px;
        line-height: 22px;
        font-weight: 600;
        color: var(--main-color);
        margin-right: 10px;
      }
      /deep/ .address-display-cls {
        .address-wrapper-address {
          font-size: 14px;
        }
      }
      .icon-wrapper {
        min-width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--main-color-bg-light);
        border-radius: 50%;
        color: var(--main-color-light);
        margin: 0 10px;
        cursor: pointer;
      }
      .placeholder {
        flex: 1 1 auto;
      }
      .button {
        font-size: 14px;
        cursor: pointer;
        display: inline-block;
        padding: 5px 25px;
        border-radius: 2px;
        border: 1px solid var(--main-color);
        color: var(--main-color);
      }
    }
    &.extrinsic-list {
      flex: 1 1 auto;
    }
  }
}
</style>
<style lang="scss">
.main {
  display: flex;
}
.deleteDialog,
.renameDialog {
  .title {
    font-size: 20px;
    font-weight: 600;
    line-height: 27px;
    text-align: center;
  }
  .message {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-align: center;
    margin: 20px 0;
  }
  .btns {
    display: flex;
    justify-content: center;
  }
  .button {
    width: 150px;
    text-align: center;
    padding: 10px 0;
    & + .button {
      margin-left: 20px;
    }
  }
}
.setting-dropdown-menu {
  .menu-item {
    text-align: center;
    color: #212529;
    cursor: pointer;
    outline: none;
    font-weight: 600;
    &:hover {
      color: #16181b;
      text-decoration: none;
      background-color: #f8f9fa;
    }
  }
}
.popover-option {
  /deep/ .address-display-cls {
    .info-wrapper {
      pointer-events: none;
    }
  }
}
</style>
