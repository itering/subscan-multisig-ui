<template>
  <div class="dashboard-wrapper subscan-content">
    <div class="subscan-container subscan-card account-intro">
      <div class="name">{{multisigAccount.meta && multisigAccount.meta.name}}</div>
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
          <el-dropdown-item
            class="menu-item"
            >{{$t("view_in_subscan")}}</el-dropdown-item
          >
          <el-dropdown-item
            class="menu-item"
            @click.native="renameDialogVisible=true"
            >{{$t("rename")}}</el-dropdown-item
          >
          <el-dropdown-item
            class="menu-item"
            @click.native="deleteDialogVisible=true"
            >{{$t("delete")}}</el-dropdown-item
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
        <div>{{ $t("wallet.delete_confirm", {name: multisigAccount.meta && multisigAccount.meta.name}) }}</div>
        <div class="btns">
          <div class="button" @click="deleteWallet">
            {{ $t("ok") }}
          </div>
          <div class="button" @click="deleteDialogVisible=false">
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
          <div class="button" @click="renameWallet">
            {{ $t("ok") }}
          </div>
          <div class="button" @click="renameDialogVisible=false">
            {{ $t("cancel") }}
          </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
      <div class="placeholder"></div>
      <div class="button">{{$t("submit_extrinsic")}}</div>
    </div>
    <div class="subscan-container subscan-card">

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
      multisigAccount: {},
      address: "",
      form: {
        name: ""
      },
      deleteDialogVisible: false,
      renameDialogVisible: false,
      tokens: {},
      metadata: {},
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
    this.address = this.$route.params.key;
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.getMultisigAccount();
    },
    getMultisigAccount() {
      this.multisigAccount = {};
      const accounts = keyring.getAccounts();
      let extensionAddressList = [];
      _.forEach(this.extensionAccountList, (item) => {
        extensionAddressList.push(item.address);
      })
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
          })
          this.multisigAccount = {
            address: address,
            meta: meta,
            isAvailable: isAvailable
          }
          return false;
        }
      });
    },
    renameWallet() {
      try {
        const pair = keyring.getPair(this.address);
        keyring.saveAccountMeta(pair, { name: this.form.name, whenEdited: Date.now() });
        this.$message({
          type: "success",
          message: this.$t("success"),
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
          message: this.$t("success"),
        });
        this.$router.push("/");
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message
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
  }
}
</style>
<style lang="scss">
.main {
  display: flex;
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
</style>
