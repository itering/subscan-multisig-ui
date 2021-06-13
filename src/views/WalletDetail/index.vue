<template>
  <div class="dashboard-wrapper subscan-content">
    <div class="subscan-container subscan-card account-intro">
      <div class="account">
        <div>
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
              <el-dropdown-item class="menu-item">
                <a
                  target="_blank"
                  :href="getNetworkHref(`/account/${address}`)"
                >
                  {{ $t("view_in_subscan") }}
                </a>
              </el-dropdown-item>
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
        </div>

        <div
          v-if="multisigAccount.isAvailable"
          class="button black-btn"
          @click="handleSubmitBtnClick"
        >
          {{ $t("submit_extrinsic") }}
        </div>
      </div>

      <div class="accounts">
        <div>
          <span
            v-for="item in [
              { label: 'multisig.In Progress', count: extrinsics.length },
              { label: 'multisig.Confirmed Extrinsic', count: confirmedTotal },
              {
                label: 'multisig.Threshold',
                count: multisigAccount.meta.threshold
              },
              {
                label: 'multisig.Members',
                count: multisigAccount.meta.who.length
              }
            ]"
            :key="item.label"
          >
            <b>{{ $t(item.label) }}: </b>
            <span>{{ item.count }}</span>
          </span>

          <el-button
            size="small"
            :icon="
              isAccountsDisplay ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            "
            @click="isAccountsDisplay = !isAccountsDisplay"
          ></el-button>
        </div>

        <Accounts
          class="account-list"
          v-if="isAccountsDisplay"
          :accounts="multisigAccount.meta.addressPair"
        />
      </div>

      <el-dialog
        class="dialog deleteDialog"
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
              name: multisigAccount.meta && multisigAccount.meta.name
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
        class="dialog renameDialog"
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

      <el-dialog
        class="dialog submitDialog"
        title=""
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="extrinsicDialogVisible"
        width="670px"
      >
        <div class="title">{{ $t("submit_extrinsic") }}</div>
        <div class="split-line"></div>
        <el-form
          label-width="80px"
          :model="form"
          ref="form"
          :rules="formRules"
          label-position="top"
        >
          <el-form-item :label="$t('account')">
            <el-select placeholder v-model="form.account" class="select">
              <address-display
                slot="prefix"
                customCls="address-display-cls"
                :hasAddressWrapper="true"
                :iconSize="30"
                :address="form.account"
                :hasCopyBtn="false"
                :hasDisplayNameInfo="true"
                :displayNameInfo="getDisplayInfoByAddress(form.account)"
                :isLink="false"
              ></address-display>
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
                  :iconSize="30"
                  :address="item.address"
                  :hasCopyBtn="false"
                  :hasDisplayNameInfo="true"
                  :displayNameInfo="getAccountDisplayInfo(item)"
                  :isLink="false"
                ></address-display>
              </el-option>
            </el-select>
          </el-form-item>

          <InputExtrinsic v-model="form.extrinsic" />
        </el-form>

        <div class="split-line"></div>
        <div class="footer">
          <div class="fee">{{ $t("fee", { num: fee }) }}</div>
          <div class="btns">
            <div class="button black-btn" @click="submitTransction">
              {{ $t("send") }}
            </div>
            <div
              class="button white-btn"
              @click="extrinsicDialogVisible = false"
            >
              {{ $t("cancel") }}
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
    </div>

    <div class="subscan-container subscan-card extrinsic-list">
      <el-tabs @tab-click="tabChange">
        <el-tab-pane>
          <span slot="label"
            >{{ $t("multisig.In Progress") }} ({{ extrinsics.length }})</span
          >
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"
            >{{ $t("multisig.Confirmed Extrinsic") }} ({{
              confirmedTotal
            }})</span
          >
        </el-tab-pane>
      </el-tabs>

      <div class="list-section" v-if="!isLoading">
        <el-table
          default-expand-all
          row-key="created_at"
          :data="tabSourceData"
          style="width: 100%"
          ref="accountTable"
        >
          <el-table-column
            min-width="200"
            :label="$t(activeTabIndex === 0 ? 'call_hash' : 'block_hash')"
            fit
          >
            <template slot-scope="props">
              <div>
                {{
                  activeTabIndex === 0
                    ? props.row.callHash
                    : props.row.blockHash
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="80" :label="$t('action')" fit>
            <template slot-scope="props">
              <div>{{ getAction(props.row) }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="40" :label="$t('progress')" fit>
            <template slot-scope="props">
              <div>{{ getProgress(props.row.approvals) }}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="80" :label="$t('status.index')" fit>
            <template slot-scope="props">
              <div v-if="props.row.status === 'cancelled'">
                {{ $t("status.cancelled") }}
              </div>
              <div v-else-if="props.row.status === 'executed'">
                {{ $t("status.executed") }}
              </div>
              <div v-else class="cell-btns">
                <div
                  v-for="action in getExtrinsicActions(props.row)"
                  :key="action"
                >
                  <div v-if="action.indexOf('pending') > -1">
                    {{ $t("status.pending") }}
                  </div>
                  <div
                    class="button"
                    v-else-if="action.indexOf('cancel') > -1"
                    @click="handleCancelBtnClick(props.row)"
                  >
                    {{ $t("cancel") }}
                  </div>
                  <div
                    class="button"
                    v-else-if="action.indexOf('approve') > -1"
                    @click="handleApproveBtnClick(props.row)"
                  >
                    {{ $t("approve") }}
                  </div>
                </div>
              </div>
              <el-dialog
                class="dialog approveDialog"
                title=""
                :show-close="false"
                :close-on-click-modal="false"
                :visible.sync="approveDialogVisible"
                width="670px"
              >
                <div class="title">{{ $t("multisig.approval") }}</div>
                <div class="split-line"></div>
                <el-form
                  label-width="80px"
                  ref="approveForm"
                  :rules="approveFormRules"
                  :model="approveForm"
                  label-position="top"
                >
                  <el-form-item :label="$t('pending_hash')">
                    <div>{{ props.row.callHash }}</div>
                  </el-form-item>
                  <el-form-item :label="$t('account')">
                    <el-select
                      placeholder
                      v-model="approveForm.account"
                      class="select"
                      @change="handleInputChange"
                    >
                      <address-display
                        slot="prefix"
                        customCls="address-display-cls"
                        :hasAddressWrapper="true"
                        :iconSize="30"
                        :address="approveForm.account"
                        :hasCopyBtn="false"
                        :hasDisplayNameInfo="true"
                        :displayNameInfo="
                          getDisplayInfoByAddress(approveForm.account)
                        "
                        :isLink="false"
                      ></address-display>
                      <el-option
                        v-for="item in getUnapprovedInjectedList(props.row)"
                        :key="item.address"
                        class="popover-option"
                        :label="item.name"
                        :value="item.address"
                      >
                        <address-display
                          customCls="address-display-cls"
                          :hasAddressWrapper="true"
                          :iconSize="30"
                          :address="item.address"
                          :hasCopyBtn="false"
                          :hasDisplayNameInfo="true"
                          :displayNameInfo="getAccountDisplayInfo(item)"
                          :isLink="false"
                        ></address-display>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="isCallDataValid(props.row)"
                    :label="$t('multisig.from_chain')"
                  >
                    <el-input
                      v-model="approveForm.callData"
                      @input="handleInputChange"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    v-else
                    prop="callData"
                    :label="$t('multisig.customize')"
                  >
                    <el-input
                      v-model="approveForm.callData"
                      @input="handleInputChange"
                    ></el-input>
                  </el-form-item>
                </el-form>

                <div class="approve-detail">
                  <h4>
                    {{
                      $t("multisig.sending_transaction", {
                        transaction: currentTransaction
                      })
                    }}
                  </h4>
                  <p>{{ currentTransactionDoc }}</p>

                  <div v-for="item in currentApproval" :key="item.name">
                    <h4>{{ item.name }}: {{ item.type }}</h4>
                    <p>{{ item.value }}</p>
                  </div>
                </div>

                <div class="dialog-tip">{{ $t("multisig.approval_tip") }}</div>
                <div class="split-line"></div>
                <div class="footer">
                  <div class="fee">{{ $t("fee", { num: fee }) }}</div>
                  <div class="btns">
                    <div class="button black-btn" @click="approveTransction">
                      {{ $t("approve") }}
                    </div>
                    <div
                      class="button white-btn"
                      @click="approveDialogVisible = false"
                    >
                      {{ $t("cancel") }}
                    </div>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer"> </span>
              </el-dialog>
              <el-dialog
                class="dialog cancelDialog"
                title=""
                :show-close="false"
                :close-on-click-modal="false"
                :visible.sync="cancelDialogVisible"
                width="670px"
              >
                <div class="title">{{ $t("multisig.cancel") }}</div>
                <div class="split-line"></div>
                <el-form label-width="80px" label-position="top">
                  <el-form-item :label="$t('pending_hash')">
                    <div>{{ props.row.callHash }}</div>
                  </el-form-item>
                  <el-form-item :label="$t('account')">
                    <div>{{ props.row.depositor }}</div>
                  </el-form-item>
                </el-form>
                <div class="dialog-tip">{{ $t("multisig.cancel_tip") }}</div>
                <div class="split-line"></div>
                <div class="footer">
                  <div class="fee">{{ $t("fee", { num: fee }) }}</div>
                  <div class="btns">
                    <div class="button black-btn" @click="cancelTransction">
                      {{ $t("submit") }}
                    </div>
                    <div
                      class="button white-btn"
                      @click="cancelDialogVisible = false"
                    >
                      {{ $t("cancel") }}
                    </div>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer"> </span>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column width="40" type="expand">
            <template slot-scope="scope">
              <div class="expand-form">
                <div class="table-title">{{ $t("progress") }}</div>
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
                        :hasDisplayName="false"
                        :address="props.row.address"
                      ></address-display>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" width="200">
                    <template slot-scope="props">
                      <div
                        v-if="
                          hasApproved(props.row.address, scope.row.approvals)
                        "
                      >
                        {{ $t("status.approved") }}
                        <el-link
                          type="primary"
                          :underline="false"
                          :href="getApprovedExtrinsicHref(scope.row.when)"
                          target="__blank"
                        >
                          <i class="el-icon-document-copy"></i>
                        </el-link>
                      </div>
                      <div v-else>
                        {{ $t("status.pending") }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-if="scope.row.params" class="table-title">
                  {{ $t("parameters") }}
                </div>
                <struct-table
                  v-if="scope.row.params"
                  :struct="scope.row.params"
                />
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
import StructTable from "@/views/Components/StructTable";
import API_CONFIG from "Service/api";
import keyring from "@polkadot/ui-keyring";
import AddressDisplay from "@/views/Components/AddressDisplay";
import { web3FromAddress } from "@polkadot/extension-dapp";
import {
  accuracyFormat,
  toThousandslsFilter,
  encodeAddressByType
} from "Utils/filters";
import { getTokenDecimalByCurrency } from "../../utils/tools";
import BN from "bn.js";
import { BigNumber } from "bignumber.js";
import Accounts from "@/views/Components/Accounts.vue";
import { transfers } from "Config";
import InputExtrinsic from "@/views/Components/InputExtrinsic.vue";
import { isObject, isUndefined } from "@polkadot/util";

const EMPTY_STATE = new BN(0);
const ZERO_ACCOUNT = "5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg";
const SUBSTRATE_PREFIX = 42;

export default {
  name: "Home",
  components: {
    AddressDisplay,
    StructTable,
    Accounts,
    InputExtrinsic
  },
  data() {
    return {
      const_symbol: const_symbol,
      multisigAccount: {},
      address: "",
      form: {
        account: "",
        extrinsic: {}
      },
      formRules: {
        value: [
          {
            trigger: "submit",
            validator: (rule, value, callback) => {
              callback();
            }
          }
        ]
      },
      waitingNotify: null,
      approveForm: {
        isMultiCall: false,
        account: "",
        hash: "",
        callData: ""
      },
      approveFormRules: {
        callData: [
          {
            trigger: "submit",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error(this.$t("error.call_data")));
              }
            }
          }
        ]
      },
      cancelForm: {
        account: "",
        hash: "",
        when: null
      },
      isLoading: false,
      fee: "0",
      extrinsics: [],
      confirmedTotal: 0,
      confirmedExtrinsics: [],
      extrinsicDialogVisible: false,
      approveDialogVisible: false,
      cancelDialogVisible: false,
      deleteDialogVisible: false,
      renameDialogVisible: false,
      tokens: {},
      metadata: {},
      isAccountsDisplay: false,
      activeTabIndex: 0
    };
  },
  filters: {
    accuracyFormat,
    toThousandslsFilter,
    encodeAddressByType
  },
  watch: {
    isKeyringLoaded(newValue) {
      if (newValue) {
        this.getMultisigAccounts();
      }
    },
    "form.extrinsic": {
      deep: true,
      handler: "calcFee"
    }
  },
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      language: state => state.global.language,
      token: state => state.global.token,
      extensionAccountList: state => state.global.extensionAccountList,
      isKeyringLoaded: state => state.global.isKeyringLoaded
    }),
    tokenSymbol() {
      return this.token.tokenSymbol && this.token.tokenSymbol[0];
    },
    tokenDecimal() {
      return getTokenDecimalByCurrency(this.token);
    },
    injectedAccountList() {
      return _.filter(this.multisigAccount.meta?.addressPair, item => {
        return item.isInjected;
      });
    },

    tabSourceData() {
      return this.activeTabIndex === 1
        ? this.confirmedExtrinsics
        : this.extrinsics;
    },

    currentApproval() {
      const target = this.extrinsics.find(
        item => item.callHash === this.approveForm.hash
      );

      if (!target) {
        return [];
      }

      const { params, args } = target;

      return params.map(({ name, type }, index) => ({
        name,
        type,
        value:
          typeof args[index] === "object"
            ? Object.values(args[index]).join(" ")
            : args[index]
      }));
    },

    currentTransaction() {
      const target = this.extrinsics.find(
        item => item.callHash === this.approveForm.hash
      );

      if (!target) {
        return {};
      }

      const { params, section, method } = target;

      return `${section}.${method}(${params
        .map(({ name }) => name)
        .join(",")})`;
    },

    currentTransactionDoc() {
      const target = this.extrinsics.find(
        item => item.callHash === this.approveForm.hash
      );

      if (!target) {
        return "";
      }

      const { callData } = target;
      const { callData: result } = this.getInfoFromCallData(callData);

      return result.meta
        .get("documentation")
        .toHuman()
        .join("");
    }
  },
  created() {
    this.address = this.$route.params.key;
    this.init();
    this.debounceCalc = _.debounce(this.calcFee, 500);
  },

  mounted() {
    this.getConfirmedExtrinsics();
  },

  methods: {
    init() {
      this.getMultisigAccount();
      this.getAccountMultisigs();
    },
    getAccountDisplayInfo(item) {
      return {
        address: item.address,
        display: item.name
      };
    },
    getDisplayInfoByAddress(address) {
      let result = {};
      _.forEach(this.injectedAccountList, account => {
        if (account.address === address) {
          result = this.getAccountDisplayInfo(account);
        }
      });
      return result;
    },
    isMultiCall(multisig) {
      return (
        multisig.approvals.length + 1 >= this.multisigAccount.meta.threshold
      );
    },
    getMultisigAccount() {
      this.multisigAccount = {};
      const accounts = keyring.getAccounts();
      let extensionAddressList = [];
      _.forEach(this.extensionAccountList, item => {
        extensionAddressList.push(item.address);
      });
      _.forEach(accounts, ({ address, meta }) => {
        if (meta.isMultisig && address === this.address) {
          let isAvailable = false;
          _.forEach(meta.addressPair, item => {
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
            isAvailable: isAvailable
          };
          return false;
        }
      });
    },
    handleSubmitBtnClick() {
      this.extrinsicDialogVisible = true;
      let localAccountInMultisigPairList = this.getLocalAccountInMultisigPairList();
      this.form.account =
        localAccountInMultisigPairList && localAccountInMultisigPairList[0];
    },
    handleCancelBtnClick(row) {
      this.cancelDialogVisible = true;
      this.cancelForm = {
        account: row.depositor,
        hash: row.callHash,
        when: row.when
      };
      this.calcFee();
    },
    handleApproveBtnClick(row) {
      let accountList = this.getUnapprovedInjectedAddressList(row);
      let account = (accountList && accountList[0]) || "";
      this.approveForm = {
        account: account,
        hash: row.callHash,
        callData: row.callData,
        isMultiCall: this.isMultiCall(row)
      };
      this.approveDialogVisible = true;
    },
    hasApproved(address, approveList) {
      return approveList && approveList.indexOf(address) > -1;
    },

    getApprovedExtrinsicHref({ height, index }) {
      return `https://${this.sourceSelected}.subscan.io/extrinsic/${height}-${index}`;
    },

    async getAccountMultisigs() {
      this.isLoading = true;
      let callHashs = [];
      this.extrinsics = [];
      const info = await this.$polkaApi.query["multisig"].multisigs.entries(
        this.multisigAccount.address
      );
      _.forEach(info, item => {
        let extrinsic = {
          ...item[1].toJSON(),
          address: item[0].toHuman()[0],
          callHash: item[0].toHuman()[1]
        };
        callHashs.push(extrinsic.callHash);
        this.extrinsics.push(extrinsic);
      });
      const callInfos = await this.$polkaApi.query["multisig"].calls.multi(
        callHashs
      );
      _.forEach(callInfos, (item, index) => {
        let call = item.toHuman();
        if (call) {
          let { callDataInfoJSON, callDataInfo } = this.getInfoFromCallData(
            call[0]
          );
          let meta = this.$polkaApi.tx[callDataInfo.section][
            callDataInfo.method
          ].meta.toJSON();
          _.forEach(meta.args, arg => {
            arg.value = callDataInfoJSON.args[arg.name];
          });
          this.extrinsics[index] = {
            ...this.extrinsics[index],
            ...callDataInfo,
            created_at: this.extrinsics[index]["when"]["height"],
            params: meta.args,
            callData: call[0],
            callInfo: call
          };
        }
      });
      let historyCalls = await this.getHistoryCalls();
      this.extrinsics = _.concat(this.extrinsics, historyCalls);
      this.isLoading = false;
    },
    async getHistoryCalls() {
      let result = [];
      let callApi = _.find(API_CONFIG["global"], item => {
        return item.name === "getCallsByAddress";
      });
      try {
        let calls = await this.$ajax({
          url: callApi.path,
          baseURL: callApi.baseURL,
          method: callApi.method,
          params: {
            multisig_address: this.multisigAccount.address,
            chain: this.$const[`SYMBOL/${this.sourceSelected}`]["chain"]
          }
        });
        result = _.map(calls, call => {
          let callDataInfo = {},
            callDataInfoJSON = {},
            meta = {};
          let { approvals, call_data, call_hash, status } = call;
          if (call_data) {
            let infoResult = this.getInfoFromCallData(call_data);
            callDataInfoJSON = infoResult.callDataInfoJSON;
            callDataInfo = infoResult.callDataInfo;
            let meta = this.$polkaApi.tx[callDataInfo.section][
              callDataInfo.method
            ].meta.toJSON();
            _.forEach(meta.args, arg => {
              arg.value = callDataInfoJSON.args[arg.name];
            });
          }
          return {
            approvals,
            status,
            address: call.multisig_address,
            created_at: call.when,
            ...callDataInfo,
            params: meta.args,
            callData: call_data,
            callHash: call_hash
          };
        });
        result = _.filter(result, item => {
          return item.status !== "created" && item.status !== "approving";
        });
      } catch (error) {
        console.log(error);
      }
      return result;
    },
    getInfoFromCallData(data) {
      const callData = this.$polkaApi.registry.createType("Call", data);
      const callDataInfoJSON = callData.toJSON();
      const callDataInfo = callData.toHuman();
      return {
        callData,
        callDataInfoJSON,
        callDataInfo
      };
    },
    isCallDataValid(row) {
      let result = false;
      if (row.callData) {
        const callData = this.$polkaApi.registry.createType(
          "Call",
          row.callData
        );
        if (callData.hash && callData.hash.eq(row.callHash)) {
          result = true;
        }
      }
      return result;
    },
    getAction(row) {
      if (row.section && row.method) {
        return row.section + " (" + row.method + ")";
      }
      return "-";
    },
    getProgress(approvals) {
      let cur = (approvals && approvals.length) || 0;
      return cur + "/" + this.multisigAccount.meta.threshold;
    },
    getUnapprovedInjectedList(row) {
      let list = this.getUnapprovedInjectedAddressList(row);
      return _.filter(this.injectedAccountList, item => {
        return list.indexOf(item.address) > -1;
      });
    },
    getUnapprovedInjectedAddressList(row) {
      let localAccountInMultisigPairList = this.getLocalAccountInMultisigPairList();
      let approvedLocalAccountList = this.getApprovedLocalAccountList(
        localAccountInMultisigPairList,
        row
      );
      return _.difference(
        localAccountInMultisigPairList,
        approvedLocalAccountList
      );
    },
    getLocalAccountInMultisigPairList() {
      let injectedAddressList = _.map(this.injectedAccountList, "address");
      let multisigPairAddressList = _.map(
        this.multisigAccount.meta.addressPair,
        "address"
      );
      return _.intersection(injectedAddressList, multisigPairAddressList);
    },
    getApprovedLocalAccountList(localAccountInMultisigPairList, row) {
      return _.intersection(
        localAccountInMultisigPairList,
        row && row.approvals
      );
    },
    getExtrinsicActions(row) {
      let actions = [];
      let injectedAddressList = _.map(this.injectedAccountList, "address");
      if (injectedAddressList.indexOf(row.depositor) > -1) {
        actions.push("cancel");
      }
      let localAccountInMultisigPairList = this.getLocalAccountInMultisigPairList();
      let approvedLocalAccountList = this.getApprovedLocalAccountList(
        localAccountInMultisigPairList,
        row
      );
      if (
        approvedLocalAccountList.length !==
        localAccountInMultisigPairList.length
      ) {
        actions.push("approve");
      }
      if (actions.length === 0) {
        if (
          row.approvals &&
          row.approvals.length === this.multisigAccount.meta.threshold
        ) {
          actions.push("pending");
        }
      }
      return actions;
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
        who: (pair.meta.who || []).map(this.recodeAddress)
      };
    },
    recodeAddress(address) {
      return keyring.encodeAddress(keyring.decodeAddress(address));
    },

    getBn(input) {
      const bignumber = new BigNumber(input)
        .shiftedBy(+this.tokenDecimal)
        .integerValue()
        .toString();
      const num = new BN(bignumber);

      return num;
    },

    handleInputChange() {
      this.fee = this.$t("calculating");
      this.debounceCalc();
    },

    async calcFee() {
      let tx = null;
      const multiRoot = this.multisigAccount.address;

      try {
        if (
          this.extrinsicDialogVisible &&
          this.form.extrinsic?.section &&
          this.form.extrinsic?.method
        ) {
          const { section, method, params } = this.form.extrinsic;
          const parameters = this.getTxParameters(params).filter(item => !isUndefined(item));

          tx = this.$polkaApi.tx[section][method](...parameters);
        }

        if (this.cancelDialogVisible) {
          tx = this.getCancelTransaction();
        }

        if (this.approveDialogVisible && this.approveForm.callData) {
          tx = await this.getApproveTransaction();
        }

        if (tx && multiRoot) {
          const { partialFee } = await tx.paymentInfo(multiRoot);

          this.fee =
            accuracyFormat(partialFee.toJSON(), this.tokenDecimal) +
            " " +
            this.tokenSymbol;
        }
      } catch (error) {
        console.log(
          "%c [ error ]-1077",
          "font-size:13px; background:pink; color:#bf2c9f;",
          error.message
        );
        this.fee = this.$t("calculating");
      }
    },

    showLoadingNotify() {
      this.waitingNotify = this.$notify({
        title: this.$t("transaction_waiting_title"),
        message: this.$t("transaction_waiting_content"),
        duration: 0
      });
    },
    closeLoadingNotify() {
      this.waitingNotify && this.waitingNotify.close();
    },
    async cancelTransction() {
      this.cancelDialogVisible = false;
      await this.signAndSend(
        this.getCancelTransaction(),
        this.cancelForm.account,
        () => {
          this.getAccountMultisigs();
        }
      );
    },
    getCancelTransaction() {
      let multiRoot = this.multisigAccount.address;
      let signAddress = this.cancelForm.account;
      const { threshold, who } = this.extractExternal(multiRoot);
      const others = who.filter(w => w !== signAddress);
      return this.$polkaApi.tx.multisig.cancelAsMulti(
        threshold,
        others,
        this.cancelForm.when,
        this.cancelForm.hash
      );
    },
    //https://github.com/polkadot-js/apps/blob/master/packages/react-hooks/src/useWeight.ts
    async getWeight(call) {
      let result = EMPTY_STATE;
      if (call) {
        let { weight } = await this.$polkaApi
          .tx(call)
          .paymentInfo(ZERO_ACCOUNT);
        result = weight;
      }
      return result;
    },
    async approveTransction() {
      this.$refs["approveForm"].validate(async valid => {
        if (valid) {
          this.approveDialogVisible = false;
          let tx = await this.getApproveTransaction();
          await this.signAndSend(tx, this.approveForm.account, () => {
            this.getAccountMultisigs();
          });
        }
      });
    },
    async getApproveTransaction() {
      let multiRoot = this.multisigAccount.address;
      let signAddress = this.approveForm.account;
      let api = this.$polkaApi;
      let multiModule = api.tx.multisig;
      const info = await api.query["multisig"].multisigs(
        multiRoot,
        this.approveForm.hash
      );
      let callData = null;
      if (this.approveForm.callData) {
        callData = this.$polkaApi.registry.createType(
          "Call",
          this.approveForm.callData
        );
      }
      let weight = await this.getWeight(callData);
      const { threshold, who } = this.extractExternal(multiRoot);
      const others = who.filter(w => w !== signAddress);
      let timepoint = null;
      if (info.isSome) {
        timepoint = info.unwrap().when;
      }
      let tx = this.approveForm.isMultiCall
        ? multiModule.asMulti.meta.args.length === 6
          ? multiModule.asMulti(
              threshold,
              others,
              timepoint,
              callData.toHex(),
              true,
              weight
            )
          : multiModule.asMulti(threshold, others, timepoint, callData)
        : multiModule.approveAsMulti.meta.args.length === 5
        ? multiModule.approveAsMulti(
            threshold,
            others,
            timepoint,
            this.approveForm.hash,
            weight
          )
        : multiModule.approveAsMulti(
            threshold,
            others,
            timepoint,
            this.approveForm.hash
          );
      return tx;
    },
    submitTransction() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.sendTransaction();
        }
      });
    },

    /**
     * this method should not capture the error during param handling;
     */
    getTxParameters(params) {
      if (!params) {
        return [];
      }

      return params.map(({ value }) => {
        const param =
          isObject(value) && value.valueKey ? value[value.valueKey] : value;

        return isNaN(+param) ? param : this.getBn(param);
      });
    },

    async sendTransaction() {
      const multiRoot = this.multisigAccount.address;
      const signAddress = this.form.account;
      const api = this.$polkaApi;
      const { section, method, params } = this.form.extrinsic;
      let parameters = [];

      try {
        parameters = this.getTxParameters(params);
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message
        });

        return;
      }

      const tx = api.tx[section][method](...parameters);
      const multiModule = api.tx.multisig;
      const info = await api.query["multisig"].multisigs(
        multiRoot,
        tx.method.hash
      );
      const { threshold, who } = this.extractExternal(multiRoot);
      const others = who.filter(w => w !== signAddress);
      const { weight } = await tx.paymentInfo(multiRoot);
      const timepoint = info.isSome ? info.unwrap().when : null;
      const multiTx =
        multiModule.asMulti.meta.args.length === 6
          ? multiModule.asMulti(
              threshold,
              others,
              timepoint,
              tx.method.toHex(),
              true,
              weight
            )
          : multiModule.asMulti(threshold, others, timepoint, tx.method);
      const { partialFee } = await tx.paymentInfo(multiRoot);

      this.extrinsicDialogVisible = false;
      this.fee =
        accuracyFormat(partialFee.toJSON(), this.tokenDecimal) +
        " " +
        this.tokenSymbol;

      this.signAndSend(multiTx, this.form.account, () => {
        this.form = {
          account: "",
          extrinsic: {}
        };
        this.getAccountMultisigs();
      });
    },

    async signAndSend(tx, signAddress, callback) {
      try {
        const injector = await web3FromAddress(
          encodeAddressByType(signAddress, SUBSTRATE_PREFIX)
        );
        this.$polkaApi.setSigner(injector.signer);
        this.showLoadingNotify();
        await tx.signAndSend(signAddress, ({ events = [], status }) => {
          if (status.isInBlock) {
            events.forEach(({ event: { data, method, section } }) => {
              this.closeLoadingNotify();
              if (method === "ExtrinsicSuccess" && section === "system") {
                this.$notify({
                  title: this.$t("transaction_success_title"),
                  message: this.$t("transaction_success_content"),
                  type: "success"
                });
                callback && callback();
              }
              if (method === "ExtrinsicFailed" && section === "system") {
                const [dispatchError] = data;
                let message = dispatchError.type;
                if (dispatchError.isModule) {
                  try {
                    const mod = dispatchError.asModule;
                    const error = dispatchError.registry.findMetaError(mod);
                    message = `${error.section}.${error.name}`;
                  } catch (error) {
                    // swallow
                  }
                }
                this.$notify({
                  title: this.$t("transaction_failed_title"),
                  message: message,
                  type: "error"
                });
              }
            });
          }
        });
      } catch (error) {
        this.closeLoadingNotify();
        this.$message({
          type: "error",
          message: error.message
        });
      }
    },

    renameWallet() {
      try {
        const pair = keyring.getPair(this.address);
        keyring.saveAccountMeta(pair, {
          name: this.form.name,
          whenEdited: Date.now()
        });
        this.$message({
          type: "success",
          message: this.$t("success")
        });
        this.renameDialogVisible = false;
        this.getMultisigAccount();
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message
        });
      }
    },
    deleteWallet() {
      try {
        keyring.forgetAccount(this.address);
        this.$message({
          type: "success",
          message: this.$t("success")
        });
        this.$router.push("/");
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message
        });
      }
    },
    getNetworkHref(path) {
      return (
        this.$const[`SYMBOL/${this.sourceSelected}`]["domain"]["value"] + path
      );
    },
    isMobile() {
      return isMobile();
    },

    tabChange(event) {
      this.activeTabIndex = +event.index;

      if (this.activeTabIndex === 1) {
        this.getConfirmedExtrinsics();
      }
    },

    getConfirmedExtrinsics() {
      const limit = 10;
      const offset = 0;

      this.$apollo.provider.clients[this.sourceSelected]
        // this.$apollo.provider.defaultClient
        .query({
          query: transfers,
          variables: { offset, limit, account: this.address }
        })
        .then(res => {
          const {
            transfers: { totalCount, nodes }
          } = res.data;

          this.confirmedTotal = totalCount;
          this.confirmedExtrinsics = nodes.map(node => {
            const {
              fromId,
              timestamp,
              block: {
                id: blockHash,
                extrinsics: { nodes }
              }
            } = node;

            const target = nodes.find(item => item.section === "multisig");
            const { args, signerId, isSuccess } = target;
            const multisigArgs = JSON.parse(args);
            const callData = multisigArgs.find(item => item.name === "call")
              ?.value;
            const { callDataInfoJSON, callDataInfo } = this.getInfoFromCallData(
              callData
            );
            const meta = this.$polkaApi.tx[callDataInfo.section][
              callDataInfo.method
            ].meta.toJSON();
            const { height, index } = multisigArgs.find(
              item => item.name === "maybe_timepoint"
            )?.value;

            return {
              ...callDataInfo,
              callData,
              blockHash,
              address: fromId,
              approvals: [
                ...multisigArgs
                  .find(item => item.name === "other_signatories")
                  .value.slice(1), // 第1个是多签账号
                signerId
              ],
              params: Object.entries(callDataInfoJSON.args).map(
                ([key, value]) => ({
                  name: key,
                  value,
                  type: meta.args.find(item => item.name === key)?.type
                })
              ),
              status: isSuccess ? "executed" : "pending",
              created_at: timestamp,
              when: { height: +height.replace(",", ""), index: +index }
            };
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  .subscan-card {
    position: relative;

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
          background: var(--black-color);
          border-radius: 2px;
          color: #fff;
        }
        > div {
          text-align: center;
          font-weight: 600;
        }
      }
    }

    .el-tabs {
      padding: 1em 2em 0;
    }

    .list-section {
      padding: 1em 2em;
      .table-title {
        margin: 10px 0;
      }
      .cell-btns {
        display: flex;
        > div {
          margin-right: 10px;
        }
        .button {
          padding: 2px 15px;
          border: 1px solid var(--main-color);
          color: var(--main-color);
        }
      }
    }

    &.account-intro {
      padding: 0 20px;
      margin-bottom: 20px;

      .account {
        height: 70px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        & > div:first-child {
          display: flex;
          align-items: center;
        }

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          padding: 0 20px;
          height: 1px;
          width: 100%;
          background-color: #f3f5f9;
        }
      }

      .accounts {
        & > div:first-child {
          display: inline-flex;
          gap: 2em;
          align-items: center;
          margin: 0 0 1em 0;
        }

        .account-list {
          background: #f3f5f9;
          padding: 1em;
          margin: 0 0 1em 0;
        }
      }

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

.approve-detail {
  padding: 1em;
  background: #f3f5f9;
  border-radius: 4px;

  & > div {
    background: #fff;
    border-radius: 4px;
    padding: 5px 10px;
    margin: 1em 0;
  }

  h4 {
    color: var(--black-color);
  }

  p {
    margin: 5px 0;
  }
}
</style>
<style lang="scss">
.main {
  display: flex;
}
.dialog {
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
  .module-item {
    width: 180px;
    margin-right: 20px;
    display: inline-block;
  }
  .call-item {
    width: 350px;
    display: inline-block;
  }
}

.submitDialog,
.approveDialog,
.cancelDialog {
  .split-line {
    margin: 10px 0;
    background-color: #e7eaf3;
    height: 1px;
  }
  .fee {
    flex: 1 1 auto;
    color: var(--main-color);
  }
  .footer {
    display: flex;
    align-items: center;
  }
  .dialog-tip {
    color: #ff475d;
    font-weight: 600;
  }
  .el-dialog__body {
    padding: 10px 60px;
    .el-form-item__label {
      font-weight: 600;
      line-height: 20px;
      color: var(--black-color);
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-select {
      width: 100%;
      &.select {
        .el-input__inner {
          color: transparent;
        }
        .el-input__prefix {
          pointer-events: none;
        }
      }
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
