<template>
  <header class="nav-bar-wrapper">
    <nav
      v-if="isMobile()"
      class="subscan-container align-items-center is-mobile"
    >
      <el-dropdown class="dropdown" trigger="click">
        <span class="el-dropdown-link align-items-center">
          <div :class="`network-button ${sourceSelectedValue}-button`">
            <img class="network-button-img" :src="mobileIconImg" />
            <span
              class="network-arrow"
              :style="{ backgroundColor: arrowColor }"
            >
              <i class="el-icon-caret-bottom"></i>
            </span>
          </div>
        </span>
        <el-dropdown-menu
          slot="dropdown"
          class="menu-dropdown network-dropdown"
        >
          <div class="network-title">Mainnet</div>
          <div class="network-split-line"></div>
          <div v-for="item in sourceList" :key="item.value + ' main'">
            <li
              v-if="item.type === 'mainnet'"
              class="menu-dropdown-item align-items-center"
            >
              <i
                class="choosed-icon"
                :class="{ show: sourceSelected === item.value }"
              ></i>
              <a
                class="menu-dropdown-item-label"
                @click="changeSource(item.value)"
                >{{ item.label }}</a
              >
            </li>
          </div>
          <div class="network-split-line"></div>
          <div class="menu-dropdown-item align-items-center">
            <i class="choosed-icon"></i>
            <a
              class="menu-dropdown-item-label join-subscan"
              :href="$t('join_subscan_url')"
              target="_blank"
              rel="noopener"
              >{{ $t("join_subscan") }}</a
            >
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <router-link class="logo" to="/" tag="a"></router-link>
      <div class="right-menu align-items-center">
        <div class="mobile-menu">
          <div class="menu-area" @click="drawer = true">
            <icon-svg icon-class="hamburger-button" class="icon" />
          </div>
        </div>
        <el-drawer
          :title="$t('menu')"
          class="mobile-drawer"
          size="260px"
          :visible.sync="drawer"
          :direction="direction"
        >
          <div class="drawer-content">
            <div class="menu-section">
              <div class="row">
                <div class="item">
                  <a :href="networkHref">{{ $t("explorer") }}</a>
                </div>
                <el-collapse accordion>
                  <router-link
                    class="item"
                    to="/account"
                    tag="div"
                    @click.native="drawer = false"
                    >{{ $t("accounts") }}</router-link
                  >
                  <el-collapse-item :title="$t('about')" name="4">
                    <a
                      class="sub-item"
                      href="https://medium.com/tag/subscan-update/latest"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                      >{{ $t("version_history") }}</a
                    >
                    <a
                      class="sub-item"
                      href="https://www.subscan.io/privacy"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                      >{{ $t("privacy_policy") }}</a
                    >
                    <a
                      class="sub-item"
                      href="https://www.subscan.io/term"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                      >{{ $t("term_of_use") }}</a
                    >
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="language-section">
              <a
                class="contact-item twitter"
                target="_blank"
                rel="noopener"
                href="https://twitter.com/subscan_io/"
              >
                <icon-svg icon-class="twitter-grey" class="icon" />
              </a>
              <a
                class="contact-item riot"
                target="_blank"
                rel="noopener"
                href="https://riot.im/app/#/room/!uaYUrKBueiKUurHliJ:matrix.org?via=matrix.org&via=matrix.parity.io&via=web3.foundation"
              >
                <icon-svg icon-class="riot-grey" class="icon" />
              </a>
              <a
                class="contact-item github"
                target="_blank"
                rel="noopener"
                href="https://github.com/itering/subscan-essentials"
              >
                <icon-svg icon-class="github-grey" class="icon" />
              </a>
              <a
                class="contact-item medium"
                target="_blank"
                rel="noopener"
                href="https://medium.com/subscan"
              >
                <icon-svg icon-class="medium-grey" class="icon" />
              </a>
              <a
                class="contact-item mail"
                target="_blank"
                rel="noopener"
                href="mailto:hello@subscan.io"
              >
                <icon-svg icon-class="email-grey" class="icon" />
              </a>
              <el-dropdown
                class="language-dropdown"
                trigger="click"
                @command="changeLanguage"
              >
                <div class="contact-item language">
                  <icon-svg icon-class="zh" class="icon" />
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="menu-item" command="zh-CN"
                    >简体中文</el-dropdown-item
                  >
                  <el-dropdown-item class="menu-item" command="en"
                    >English</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-drawer>
      </div>
    </nav>
    <nav v-else class="subscan-container align-items-center">
      <router-link class="logo" to="/" tag="a">
        <div class="subscan-logo"></div>
        <div class="multisig">{{ $t("multisig.index") }}</div>
      </router-link>
      <div
        class="polkadot-status"
        :class="isPolkadotConnect ? 'connected' : ''"
      ></div>
      <div class="rate"></div>
      <div class="right-menu align-items-center">
        <ul class="nav-item-list align-items-center">
          <a class="nav-item" :href="networkHref">{{ $t("explorer") }}</a>
          <div class="nav-item">
            <el-popover placement="bottom" width="260" trigger="click">
              <div class="polka-account-list">
                <div v-if="!hasExtensionAccount" class="empty">
                  <div class="avatar">
                    <icon-svg icon-class="user" class="icon avatar-icon" />
                  </div>
                  <div>{{ $t("polkadot.none") }}</div>
                  <div class="button" @click="getExtensionAccounts">
                    {{ $t("refresh") }}
                  </div>
                </div>
                <div v-else>
                  <div
                    class="account"
                    v-for="item in extensionAccountList"
                    :key="item.address"
                  >
                    <address-display
                      customCls="address-display-cls"
                      :hasAddressWrapper="true"
                      :hasHashFormat="true"
                      :isVertical="true"
                      :iconSize="30"
                      :address="item.address"
                      :hasDisplayNameInfo="true"
                      :displayNameInfo="getAccountDisplayInfo(item)"
                    ></address-display>
                  </div>
                  <div class="button" @click="getExtensionAccounts">
                    {{ $t("refresh") }}
                  </div>
                </div>
              </div>
              <div slot="reference">
                {{ $t("accounts") }}
                <span>
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </div>
            </el-popover>
          </div>
          <el-dropdown class="account-dropdown" trigger="click">
            <li class="nav-item">
              {{ $t("language_demo") }}
              <span>
                <i class="el-icon-caret-bottom"></i>
              </span>
            </li>
            <el-dropdown-menu slot="dropdown" class="account-dropdown-menu">
              <el-dropdown-item
                class="menu-item"
                @click.native="changeLanguage('zh-CN')"
                >简体中文</el-dropdown-item
              >
              <el-dropdown-item
                class="menu-item"
                @click.native="changeLanguage('en')"
                >English</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </ul>
        <el-dropdown class="dropdown" trigger="click">
          <span class="el-dropdown-link align-items-center">
            <!--<div class="choosed-source">{{sourceSelectedLabel}}</div>-->
            <div :class="`network-button ${sourceSelectedValue}-button`">
              <img class="network-button-img" :src="iconImg" />
              <span
                class="network-arrow"
                :style="{ backgroundColor: arrowColor }"
              >
                <i class="el-icon-caret-bottom"></i>
              </span>
            </div>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="menu-dropdown network-dropdown"
          >
            <div class="network-title">Mainnet</div>
            <div class="network-split-line"></div>
            <div v-for="item in sourceList" :key="item.value + ' main'">
              <li
                v-if="item.type === 'mainnet'"
                class="menu-dropdown-item align-items-center"
              >
                <i
                  class="choosed-icon"
                  :class="{ show: sourceSelected === item.value }"
                ></i>
                <a
                  class="menu-dropdown-item-label"
                  @click="changeSource(item.value)"
                  >{{ item.label }}</a
                >
              </li>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </nav>
  </header>
</template>
<script>
import { mapState } from "vuex";
import { formatSymbol, isMobile } from "Utils/tools";
import { encodeAddressByType } from "Utils/filters";
import AddressDisplay from "@/views/Components/AddressDisplay";
import _ from "lodash";
export default {
  name: "NavBar",
  components: {
    AddressDisplay,
  },
  filters: {
    encodeAddressByType
  },
  data() {
    return {
      currentTime: Date.now(),
      drawer: false,
      direction: "rtl",
      sourceList: this.$const["COMMON/networkList"]["all"].value,
    };
  },
  watch: {
    isPolkadotConnect(newValue) {
      if (newValue) {
        this.getExtensionAccounts();
      }
    },
  },
  computed: {
    sourceSelectedValue() {
      let source = this.sourceList.find((item) => {
        return item.value === this.sourceSelected;
      });
      return (source && source.value) || "kusama";
    },
    filterSourceList() {
      let list = [].concat(this.sourceList);
      return _.filter(list, (item) => {
        return item;
      });
    },
    hasExtensionAccount() {
      return this.extensionAccountList && this.extensionAccountList.length > 0;
    },
    hasWalletAccount() {
      let result = false;
      return result;
    },
    iconImg() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["button"];
    },
    mobileIconImg() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["mobileButton"];
    },
    arrowColor() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["arrowColor"];
    },
    networkHref() {
      return this.getSourceHref(this.sourceSelected);
    },
    ...mapState({
      metadata: (state) => state.polka.metadata,
      sourceSelected: (state) => state.global.sourceSelected,
      extensionAccountList: (state) => state.global.extensionAccountList,
      isPolkadotConnect: (state) => state.global.isPolkadotConnect,
      token: (state) => state.global.token,
      language: (state) => state.global.language,
    }),
  },
  created() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    async init() {
    },
    async getExtensionAccounts() {
      this.$store.dispatch("SetExtensionAccountList");
    },
    getAccountDisplayInfo(item) {
      return {
        address: item.address,
        display: item.meta.name,
      };
    },
    isMobile() {
      return isMobile();
    },
    formatSymbol(module, params) {
      return formatSymbol(module, this.$const, this.sourceSelected, params);
    },
    changeSource(value) {
      this.$store.dispatch("SetSourceSelected", value);
      window.location.reload();
    },
    formatSource(module, type) {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      if (source && source[module]) {
        return source[module][type] || "";
      } else {
        return "";
      }
    },
    getSymbol() {
      return this.formatSymbol("balances", {
        block: this.metadata.blockNum,
      });
    },
    changeLanguage(language) {
      window.GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
      this.closeDrawer();
    },
    closeDrawer() {
      this.drawer = false;
    },
    getSourceHref(source) {
      let href = this.$const[`SYMBOL/${source}`]["domain"]["value"];
      if (
        location &&
        location.origin &&
        location.origin.indexOf("subscan.cn") > -1
      ) {
        href = href.replace("subscan.io", "subscan.cn");
      }
      return href;
    },
  },
};
</script>
<style lang="scss" scoped>
.nav-bar-wrapper {
  height: 50px;
  background: var(--navbar-bg);
  position: relative;
  color: #fff;
  .subscan-container {
    height: 100%;
    width: 1180px;
    max-width: 100%;
    .logo {
      cursor: pointer;
      display: flex;
      align-items: center;
      .subscan-logo {
        height: 25px;
        width: 119px;
        background: url("../../assets/images/logo@2x.png") no-repeat center
          center;
        background-size: cover;
      }
      .multisig {
        background: #fff;
        border-radius: 9px;
        color: var(--main-color);
        padding: 0px 10px;
        margin-left: 5px;
      }
    }
    .polkadot-status {
      width: 32px;
      height: 24px;
      background: url("../../assets/images/polka-cross.png") no-repeat center
        center;
      background-size: cover;
      margin-left: 10px;
      &.connected {
        background: url("../../assets/images/polka-check.png") no-repeat center
          center;
        background-size: cover;
      }
    }
    .rate {
      flex: 1 1 auto;
      margin-top: 2px;
      font-size: 14px;
      margin-left: 20px;
      .label {
        font-weight: bold;
      }
      .info {
        margin-left: 8px;
      }
    }
    .right-menu {
      .nav-item-list {
        .account-dropdown {
          margin-right: 15px;
          &:last-child {
            margin-right: 0;
          }
        }
        > .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
          margin-right: 25px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .account-dropdown {
        color: #fff;
        .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
        }
      }
      .dropdown {
        margin-left: 15px;
        margin-right: 1px;
        border-radius: 2px;
        .el-dropdown-link {
          /*padding: 0 10px;*/
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          .dropdown-icon {
            font-size: 11px;
          }
          .choosed-source {
            height: 31px;
            line-height: 31px;
            color: #201550;
            margin-right: 5px;
          }
        }
      }
      .mobile-menu {
        display: none;
      }
      .network-button {
        height: 30px;
        border-radius: 2px;
        background-color: #fff;
        padding: 0 10px;
        display: flex;
        align-items: center;
        .network-button-img {
          height: 30px;
        }
        .network-arrow {
          margin-left: 10px;
          background-color: #000;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          font-size: 12px;
          color: #fff;
          i {
            vertical-align: text-top;
          }
        }
      }
    }
    &.is-mobile {
      padding: 0 10px 0 20px;
      justify-content: space-between;
      .dropdown {
        border-radius: 2px;
        .el-dropdown-link {
          /*padding: 0 10px;*/
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          .dropdown-icon {
            font-size: 11px;
          }
          .choosed-source {
            height: 31px;
            line-height: 31px;
            color: #201550;
            margin-right: 5px;
          }
        }
      }
      .network-button {
        height: 30px;
        border-radius: 2px;
        background-color: #fff;
        padding: 0 5px;
        display: flex;
        align-items: center;
        .network-button-img {
          height: 20px;
        }
        .network-arrow {
          margin-left: 10px;
          background-color: #000;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          line-height: 12px;
          font-size: 12px;
          color: #fff;
          i {
            vertical-align: text-top;
          }
        }
      }
      .mobile-menu {
        display: block;
        font-size: 34px;
        text-align: right;
        .menu-area {
          display: inline-block;
        }
        .icon {
          cursor: pointer;
        }
      }
      .right-menu {
        width: 52px;
        justify-content: flex-end;
      }
    }
  }
  .nav-bar-search {
    display: none;
  }
  @media screen and (max-width: $screen-xs) {
    .subscan-container {
      padding: 0 15px;
      .rate {
        display: none;
      }
      .right-menu {
        .nav-item-list {
          display: none;
        }
        .dropdown {
          margin-left: 0;
          flex: 1 1 auto;
          span {
            float: right;
          }
        }
        .mobile-menu {
          display: block;
          font-size: 34px;
          text-align: right;
          .menu-area {
            display: inline-block;
          }
          .icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.drawer-content {
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  .menu-section {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    text-align: center;
    .row {
      padding-top: 26px;
    }
    .item {
      font-size: 20px;
      padding: 10px 0;
      color: #fff;
      margin-left: 30px;
      text-align: left;
    }
    /deep/ .el-collapse {
      border: none;
      padding-left: 30px;
      .item {
        margin-left: 0;
      }
      .el-collapse-item__header {
        background-color: initial;
        color: #fff;
        border: none;
        font-size: 20px;
        font-weight: 400;
      }
      .el-collapse-item__wrap {
        background-color: initial;
        color: #fff;
        border: none;
        text-align: left;
        padding-left: 10px;
      }
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
    .sub-item {
      display: block;
      font-size: 14px;
      padding: 10px 0;
      color: #fff;
    }
  }
  .language-section {
    height: 70px;
    background-color: #3a3545;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    .contact-item {
      .icon {
        font-size: 24px;
      }
    }
    .language {
      opacity: 0.5;
    }
  }
}
</style>
<style lang="scss">
@each $theme in kusama, darwinia, crab, polkadot {
  .#{$theme} {
    > .nav-bar-wrapper {
      background: var(--navbar-bg);
      @if $theme == centrifuge {
        .subscan-container {
          color: var(--black-color);
          .logo {
            height: 25px;
            width: 119px;
            background: url("../../assets/images/logo-black.png")
              no-repeat
              center
              center;
            background-size: cover;
          }
          .right-menu {
            .account-dropdown {
              color: var(--black-color);
            }
          }
        }
      }
    }
    @media screen and (max-width: $screen-xs) {
      > .nav-bar-wrapper {
        background: url("../../assets/images/#{$theme}-banner-mobile.png")
          no-repeat center center;
        background-size: cover;
      }
    }
  }
}
.polka-account-list {
  padding: 20px;
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar {
      width: 100px;
      height: 100px;
      background-color: var(--main-color-bg-light);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0;
      .avatar-icon {
        color: var(--main-color-light);
        font-size: 60px;
      }
    }
  }
  .address-display-cls {
    padding: 10px 0;
    border-bottom: 1px solid #e7eaf3;
    .name-wrapper {
      pointer-events: none;
      .nick-name {
        a {
          color: var(--main-color) !important;
        }
        font-weight: 600;
      }
    }
    .address-wrapper-address {
      width: 124px;
      pointer-events: none;
    }
  }
  .button {
    margin-top: 20px;
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    width: 200px;
    text-align: center;
    padding: 5px 0;
    border-radius: 2px;
    border: 1px solid var(--main-color);
    color: var(--main-color);
  }
}
.account-dropdown-menu.el-dropdown-menu {
  .menu-item {
    text-align: left;
    color: #212529;
    cursor: pointer;
    outline: none;
    &:hover {
      color: #16181b;
      text-decoration: none;
      background-color: #f8f9fa;
    }
  }
}
.network-dropdown {
  max-height: 410px;
  overflow: scroll;
}
.menu-dropdown.el-dropdown-menu {
  margin-top: 20px;
  background: #fff;
  padding: 5px 0;
  border-radius: 4px;
  border: 1px solid rgba(219, 219, 219, 1);
  .menu-dropdown-item {
    line-height: 22px;
    height: 42px;
    padding: 10px 30px 10px 13px;
    .menu-dropdown-item-label {
      font-size: 16px;
      font-weight: 600;
      color: #201550;
      cursor: pointer;
      &.join-subscan {
        color: var(--main-color);
      }
    }
    .choosed-icon {
      margin-right: 10px;
      border-radius: 50%;
      width: 7px;
      height: 7px;
      background: linear-gradient(
        315deg,
        rgba(254, 56, 118, 1) 0%,
        rgba(124, 48, 221, 1) 71%,
        rgba(58, 48, 221, 1) 100%
      );
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
  }
  .network-title {
    color: #98959f;
    font-size: 14px;
    margin-left: 30px;
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: 600;
  }
  .network-split-line {
    height: 1px;
    margin: 0 30px;
    background-color: #e7eaf3;
  }
  .popper__arrow {
    opacity: 0;
  }
}
.mobile-drawer {
  .el-drawer {
    color: #fff;
    background-color: var(--black-color);
  }
  .el-drawer__header {
    padding: 10px 0;
    color: #fff;
    background-color: #3a3545;
    margin-bottom: 0;
    > span {
      margin-left: 10px;
      font-size: 14px;
    }
    button {
      padding: 0 10px;
    }
  }
  /deep/ .el-collapse {
    .el-collapse-item__content {
      max-height: 200px;
      overflow: scroll;
    }
  }
}
</style>
